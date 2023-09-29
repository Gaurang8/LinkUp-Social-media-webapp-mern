const express = require("express");
const app = express();
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const User = require("./model/datamodal");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const cors = require("cors");

const http = require("http");
const socketIo = require("socket.io");

dotenv.config();
app.use(express.json());
app.use(cors({ origin: process.env.BASE_ADDR, credentials: true }));
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", process.env.BASE_ADDR);
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, PATCH");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.header("Access-Control-Allow-Credentials", "true");
  next();
});
app.use(bodyParser.json({ limit: 1024 * 1024 * 50, type: 'application/json' }));
app.use(bodyParser.urlencoded({ extended: true, limit: 1024 * 1024 * 50, parameterLimit: 500000, type: 'application/x-www-form-urlencoded' }));
app.use(cookieParser());


const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
    credentials: true,
  }
});

app.listen(8000);


io.on("connection", (socket) => {
  console.log("A user connected");

  socket.on("disconnect", () => {
    console.log("A user disconnected");
  });

});

app.get("/", (req, res) => {
  if (mongoose.connection.readyState === 1) {
    res.send(`Database Connected to ${process.env.BASE_ADDR}`);
  } else {
    res.send("Database connection failed.");
  }
});

const url = `${process.env.MONGODB_URI}Users?retryWrites=true&w=majority`;

mongoose
  .connect(url)
  .then(() => {

    console.log("connected to database successfully");
  })
  .catch((error) => {
    console.log("error connecting to database: ", error);
  });

const authenticateToken = (req, res, next) => {
  const token = req.cookies.token;
  console.log("token is", token);

  if (token === null) {
    return res.status(401).json({ message: "Missing token" });
  }

  jwt.verify(token, process.env.TOKEN_KEY, (err, user) => {
    if (err) {
      return res.status(403).json({ message: "Invalid token" });
    }

    req.user = user;
    next();
  });
};

app.post("/register", async (req, res) => {
  try {
    const { name, email, password, description, location, accountType, languageSpeak, posts } = req.body;
    console.log(req.body);
    if (!(email && password && name)) {
      return res.status(400).send("All input is required");
    }

    const oldUser = await User.findOne({ email });

    if (oldUser) {
      return res.status(409).send("User Already Exists, login to continue");
    }

    const encryptedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      name,
      email,
      password: encryptedPassword,
      description: description || '',
      location: location || '',
      accountType: accountType || 'non-verified',
      languageSpeak: languageSpeak || [],
      following: [],
      followers: [],
      socialMediaLinks: [],
      posts: posts || [],
      notifications: [],
      joinedDate: new Date(),
      username: `${name}${new Date().getMinutes()}${new Date().getSeconds()}` ,
      dateOfBirth: null,
      profileImage: "",
      coverImage: "",
    });

    const token = jwt.sign(
      { user_id: newUser._id, email },
      process.env.TOKEN_KEY
    );

    console.log("token is", token);

    const expirationDate = new Date();
    expirationDate.setDate(expirationDate.getDate() + 15);

    res.cookie("token", token, { expires: expirationDate, sameSite: "None", secure: true });

    console.log(newUser);
    res.status(201).json({ user: newUser, message: "Registered successfully" });
  } catch (err) {
    console.log(err);
    res.status(500).send("An error occurred while registering");
  }
});


app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!(email && password)) {
      res.status(400).send("All input is required");
    }
    const user = await User.findOne({ email });

    if (user && (await bcrypt.compare(password, user.password))) {
      const token = jwt.sign(
        { user_id: user._id, email },
        process.env.TOKEN_KEY
      );

      console.log("token is", token);
      const expirationDate = new Date();
      expirationDate.setDate(expirationDate.getDate() + 15);

      res.cookie("token", token, { expires: expirationDate, sameSite: "None", secure: true });


      return res.status(200).json({ message: "Login successful", user });
    }
    return res.status(400).send("Invalid data");
  } catch (err) {
    console.log(err);
  }
});

app.get("/logout", async (req, res) => {
  res.clearCookie("token", { sameSite: "None", secure: true });
  res.status(200).json({ message: "Logout successful" });
});

app.get("/auth", authenticateToken, async (req, res) => {
  const user = await User.findOne({ email: req.user.email });
  res.status(201).json({ user });
});


app.post("/follow/:userId", authenticateToken, async (req, res) => {
  try {
    const { userId } = req.params;
    const userToFollow = await User.findById(userId);

    if (!userToFollow) {
      return res.status(404).json({ message: "User not found" });
    }

    console.log(req.user);
    const currentUser = await User.findById(req.user.user_id);
    console.log(currentUser)
    if (!currentUser) {
      return res.status(404).json({ message: "Current user not found" });
    }

    if (currentUser.following.includes(userId)) {
      return res.status(400).json({ message: "You are already following this user" });
    }

    currentUser.following.push(userId);
    await currentUser.save();

    userToFollow.followers.push(req.user.user_id);
    await userToFollow.save();



    // only for notifications
    const notificationMessage = ` is now started following you.`;
    const recipientUserId = userId;

    const recipient = await User.findById(recipientUserId);
    if (recipient) {
      const notification = {
        message: notificationMessage,
        senderId: currentUser._id.toString(),
        senderName: currentUser.name,
        recipient: recipientUserId,
        timestamp: new Date(),
      };
      recipient.notifications.push(notification);
      await recipient.save();


      console.log("recipientUserId", recipientUserId);


      io.to(recipientUserId).emit("sendNotification", {
        notification
      });
    }



    // notification ends here

    res.status(200).json({ message: "You are now following this user" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "An error occurred while following the user" });
  }
});


app.post("/unfollow/:userId", authenticateToken, async (req, res) => {
  try {
    const { userId } = req.params;
    const userToUnfollow = await User.findById(userId);
    if (!userToUnfollow) {
      return res.status(404).json({ message: "User not found" });
    }

    const currentUser = await User.findById(req.user.user_id);
    if (!currentUser) {
      return res.status(404).json({ message: "Current user not found" });
    }

    if (!currentUser.following.includes(userId)) {
      return res.status(400).json({ message: "You are not following this user" });
    }

    console.log(currentUser.following[0])
    console.log(userId)
    currentUser.following = currentUser.following.filter(id => id !== userId);
    await currentUser.save();

    userToUnfollow.followers = userToUnfollow.followers.filter(id => id !== req.user.user_id);
    await userToUnfollow.save();

    res.status(200).json({ message: "You have unfollowed this user" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "An error occurred while unfollowing the user" });
  }
});

app.post("/addnewpost", authenticateToken, async (req, res) => {
  try {
    const { text, images } = req.body;
    console.log(req.body)

    const userId = req.user.user_id;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const newPost = {
      userId: userId,
      name: user.name,
      text: text,
      images: images || [],
      likes: [],
      comments: [],
    };

    user.posts.push(newPost);
    await user.save();

    res.status(201).json({ message: "Post created successfully", post: newPost });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "An error occurred while creating the post" });
  }
});

app.delete("/deletepost/:postId", authenticateToken, async (req, res) => {
  try {
    const { postId } = req.params;
    const userId = req.user.user_id;

    const postUser = await User.findOne({ 'posts._id': postId });

    if (!postUser) {
      return res.status(404).json({ message: "Post not found" });
    }

    const post = postUser.posts.find((p) => p._id.toString() === postId);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    console.log(post.userId)
    console.log(userId)
    if (post.userId.toString() !== userId) {
      return res.status(403).json({ message: "You are not authorized to delete this post" });
    }

    await User.updateOne({ 'posts._id': postId }, { $pull: { posts: { _id: postId } } });

    res.status(200).json({ message: "Post deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "An error occurred while deleting the post" });
  }
});


app.patch("/likepost/:postId", authenticateToken, async (req, res) => {
  try {
    const { postId } = req.params;
    const userId = req.user.user_id;

    const postUser = await User.findOne({ 'posts._id': postId });

    if (!postUser) {
      return res.status(404).json({ message: "Post not found" });
    }

    const post = postUser.posts.find((p) => p._id.toString() === postId);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    if (post.likes.includes(userId)) {
      return res.status(400).json({ message: "You have already liked this post" });
    }

    post.likes.push(userId);
    await postUser.save();

    res.status(200).json({ message: "You have liked the post" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "An error occurred while liking the post" });
  }
});

app.patch("/dislikepost/:postId", authenticateToken, async (req, res) => {
  try {
    const { postId } = req.params;
    const userId = req.user.user_id;

    const postUser = await User.findOne({ 'posts._id': postId });

    if (!postUser) {
      return res.status(404).json({ message: "Post not found" });
    }

    const post = postUser.posts.find((p) => p._id.toString() === postId);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    if (!post.likes.includes(userId)) {
      return res.status(400).json({ message: "You have not liked this post" });
    }

    post.likes = post.likes.filter((id) => id !== userId);
    await postUser.save();

    res.status(200).json({ message: "You have disliked the post" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "An error occurred while disliking the post" });
  }
});


app.patch("/commentpost/:postId", authenticateToken, async (req, res) => {
  try {
    const { postId } = req.params;
    const { comment } = req.body;
    const userId = req.user.user_id;

    const postUser = await User.findOne({ 'posts._id': postId });

    if (!postUser) {
      return res.status(404).json({ message: "Post not found" });
    }

    const post = postUser.posts.find((p) => p._id.toString() === postId);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const newComment = {
      userId: userId,
      name: user.name,
      comment: comment,
      currentTime: new Date(),
    };

    post.comments.push(newComment);
    await postUser.save();

    res.status(200).json({ message: "Comment added successfully", comment: newComment });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "An error occurred while adding the comment" });
  }
});

app.delete("/deletecomment/:postId/:commentId", authenticateToken, async (req, res) => {
  try {
    const { postId, commentId } = req.params;
    const userId = req.user.user_id;

    const postUser = await User.findOne({ 'posts._id': postId });

    if (!postUser) {
      return res.status(404).json({ message: "Post not found" });
    }

    const post = postUser.posts.find((p) => p._id.toString() === postId);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const comment = post.comments.find((c) => c._id.toString() === commentId);

    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    if (comment.userId !== userId) {
      return res.status(403).json({ message: "You are not authorized to delete this comment" });
    }

    post.comments = post.comments.filter((c) => c._id.toString() !== commentId);
    await postUser.save();

    res.status(200).json({ message: "Comment deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "An error occurred while deleting the comment" });
  }
});

app.get("/user/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    console.log(userId)

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred while fetching the user by ID" });
  }
});

app.get("/searchuser/:query", async (req, res) => {
  try {
    const { query } = req.params;

    const users = await User.find({ name: { $regex: new RegExp(query, "i") } });

    res.status(200).json({ users });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "An error occurred while searching for users" });
  }
});

app.patch("/update", authenticateToken, async (req, res) => {
  try {
    const { name, description, location, languageSpeak, socialMediaLinks ,dob } = req.body;

    const userId = req.user.user_id;
    console.log(userId)

    // if (req.user.user_id !== userId) {
    //   return res.status(403).json({ message: "You are not authorized to update this user's profile" });
    // }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (name) {
      user.name = name;
    }
    if (description) user.description = description;
    if (location) user.location = location;
    if (languageSpeak) user.languageSpeak = languageSpeak;
    if (dob) user.dateOfBirth = dob;
    if (socialMediaLinks) user.socialMediaLinks = socialMediaLinks;


    await user.save();

    res.status(200).json({ message: "User profile updated successfully", user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "An error occurred while updating the user profile" });
  }
});

app.patch("/updateaccounttype/:userId", authenticateToken, async (req, res) => {
  try {
    const { userId } = req.params;
    const { accountType } = req.body;

    if (req.user.user_id !== userId) {
      return res.status(403).json({ message: "You are not authorized to update this user's account type" });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (accountType) user.accountType = accountType;

    await user.save();

    res.status(200).json({ message: "User account type updated successfully", user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "An error occurred while updating the user account type" });
  }
});


app.patch("/changeuseremail/:userId", authenticateToken, async (req, res) => {
  try {
    const { userId } = req.params;
    const { newEmail,newUsername, currentPassword } = req.body;

    if (req.user.user_id !== userId) {
      return res.status(403).json({ message: "You are not authorized to change this user's email" });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isPasswordValid = await bcrypt.compare(currentPassword, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: "Incorrect password. change Failed" });
    }

    const existingUserWithUsername = await User.findOne({ username: newUsername });


    if (existingUserWithUsername && existingUserWithUsername._id.toString() !== userId) {
      return res.status(400).json({ message: "Username already in use" });
    }


    user.email = newEmail;

    user.username = newUsername;

    await user.save();

    res.status(200).json({ message: "Email changed successfully", user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "An error occurred while changing the email" });
  }
});

app.patch("/changeuserpassword/:userId", authenticateToken, async (req, res) => {
  try {
    const { userId } = req.params;
    const { currentPassword, newPassword } = req.body;

    console.log(req.body)
    console.log(userId)
    console.log(req.user.user_id)

    if (req.user.user_id !== userId) {
      return res.status(403).json({ message: "You are not authorized to change this user's password" });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isPasswordValid = await bcrypt.compare(currentPassword, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: "Incorrect current password" });
    }

    const newPasswordHash = await bcrypt.hash(newPassword, 10);

    user.password = newPasswordHash;

    await user.save();

    res.status(200).json({ message: "Password changed successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "An error occurred while changing the password" });
  }
});

app.get("/newsfeed/:offset/:limit", authenticateToken, async (req, res) => {
  try {

    const userId = req.user.user_id;

    const offset = parseInt(req.params.offset) || 0;
    const limit = parseInt(req.params.limit) || 15;

    const user = await User.findById(userId);
    console.log(user)

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    console.log(user.following)
    const posts = await User.find({ _id: { $in: user.following } })
      .select("posts")
      .sort({ "posts.createdTime": -1 })

    console.log(posts)

    const newsFeed = posts.flatMap((u) => u.posts);

    const limitedNewsFeed = newsFeed.slice(offset, offset + limit);

    res.json({ newsFeed: limitedNewsFeed });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred while fetching the news feed" });
  }
});
app.get("/popularposts", async (req, res) => {
  try {
    const timeFrameInDays = 7;
    const postLimit = 15;

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - timeFrameInDays);

    const popularPosts = await User.aggregate([
      {
        $unwind: "$posts",
      },
      {
        $match: {
          "posts.createdTime": { $gte: startDate },
        },
      },
      {
        $sort: { "posts.likes.length": -1 },
      },
      {
        $limit: postLimit,
      },
      {
        $group: {
          _id: null,
          posts: { $push: "$posts" },
        },
      },
    ]);

    if (popularPosts.length === 0) {
      return res.json({ popularPosts: [] });
    }

    const trendingPosts = popularPosts.map((doc) => doc.posts).flat();
    res.json({ popularPosts: trendingPosts });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred while fetching popular posts" });
  }
});

app.get("/postlikes/:postId", async (req, res) => {
  try {
    const { postId } = req.params;

    const post = await User.findOne({ 'posts._id': postId });

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const likedUserIds = post.posts.find((p) => p._id.toString() === postId).likes;

    const likedUsers = await User.find(
      { _id: { $in: likedUserIds } },
      { name: 1, image: 1, description: 1 }
    );

    res.json({ likedUsers });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred while fetching post likes" });
  }
});

app.get("/postcomments/:postId", async (req, res) => {
  try {
    const { postId } = req.params;

    const post = await User.findOne({ 'posts._id': postId });

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const comments = post.posts.find((p) => p._id.toString() === postId).comments;

    const commentUserIds = comments.map((comment) => comment.userId);

    const commentUsers = await User.find(
      { _id: { $in: commentUserIds } },
      { name: 1, image: 1, description: 1 }
    )

    const formattedComments = comments.map((comment) => {
      const commentUser = commentUsers.find((user) => user._id.toString() === comment.userId);
      return {
        commentData: comment,
        userData: commentUser,
      };
    });

    res.json({ comments: formattedComments });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred while fetching post comments" });
  }
});

app.get("/suggestedusers", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.user_id;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const suggestedUsers = await User.find({
      _id: { $ne: userId },
      _id: { $nin: user.following },
    }).limit(10);

    res.json({ suggestedUsers });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred while fetching suggested users" });
  }
});

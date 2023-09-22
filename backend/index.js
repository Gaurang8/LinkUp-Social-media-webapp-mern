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

const server = http.createServer(app);
const io = socketIo(server);


dotenv.config();
app.use(express.json());
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", process.env.BASE_ADDR);
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE ,PATCH");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.header("Access-Control-Allow-Credentials", "true");
  next();
});
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());

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
    const { name, email, password } = req.body;
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
      description: '',
      location: '',
      accountType: 'non-verified',
      languageSpeak: [],
      following: [],
      followers: [],
      socialMediaLinks: [],
      posts: [],
      notifications: [],
      joinedDate: new Date()
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
    const notificationMessage = `${currentUser.name} is now started following you.`;
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






app.listen(8000);
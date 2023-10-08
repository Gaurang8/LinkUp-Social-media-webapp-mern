const User = require("../model/datamodal");

const AddNewPost = async (req , res) => {
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
    }

const DeletePost = async (req , res) => {
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
    }

const LikePost = async (req , res) => {
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
    }

const DisLikePost =  async (req , res) => {
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
}

const CommentPost = async (req , res) => {
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
        
    
        const notificationMessage = ` is Commented on Your Post.`;
        const recipientUserId = postUser._id.toString();
    
        if (postUser) {
          const notification = {
            message: notificationMessage,
            senderId: user._id.toString(),
            senderName: user.name,
            recipient: recipientUserId,
            timestamp: new Date(),
          };
          postUser.notifications.push(notification);
        }
        await postUser.save();
    
    
        res.status(200).json({ message: "Comment added successfully", comment: newComment });
      } catch (err) {
        console.error(err);
        res.status(500).json({ message: "An error occurred while adding the comment" });
      }
    }

const DeleteCommentPost = async (req , res) => {
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
    }

const GetPostLikes = async (req , res) => {
    try {
        const { postId } = req.params;
    
        const post = await User.findOne({ 'posts._id': postId });
    
        if (!post) {
          return res.status(404).json({ message: "Post not found" });
        }
    
        const likedUserIds = post.posts.find((p) => p._id.toString() === postId).likes;
    
        const likedUsers = await User.find(
          { _id: { $in: likedUserIds } },
          { name: 1, image: 1, username: 1  }
        );
    
        res.json({ likedUsers });
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: "An error occurred while fetching post likes" });
      }
    }

const GetPostComments = async (req , res) => {
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
    }

const GetPopularPost = async (req , res) => {
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
    }

const GetNewsfeedPost = async (req , res) => {
    try {
        const userId = req.user.user_id;
        const offset = parseInt(req.params.offset) || 0;
        const limit = parseInt(req.params.limit) || 15;
    
        const user = await User.findById(userId);
    
        if (!user) {
          return res.status(404).json({ error: "User not found" });
        }
    
        const userPosts = user.posts || [];
    
        const followingPosts = await User.find({ _id: { $in: user.following } })
          .select("posts")
          .sort({ "posts.createdTime": -1 });
    
        const newsFeed = userPosts.concat(followingPosts.flatMap((u) => u.posts));
    
        newsFeed.sort((a, b) => b.createdTime - a.createdTime);
    
        const limitedNewsFeed = newsFeed.slice(offset, offset + limit);
    
        res.json({ newsFeed: limitedNewsFeed });
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: "An error occurred while fetching the news feed" });
      }
    }


module.exports = {
    AddNewPost,
    DeletePost,
    LikePost,
    DisLikePost,
    CommentPost,
    DeleteCommentPost,
    GetPostLikes,
    GetPostComments,
    GetPopularPost,
    GetNewsfeedPost,
}
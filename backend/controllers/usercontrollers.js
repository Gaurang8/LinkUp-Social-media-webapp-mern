const User = require("../model/datamodal");

const FollowUser = async (req , res) => {
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
    
        }
        // notification ends here
    
        res.status(200).json({ message: "You are now following this user" });
      } catch (err) {
        console.error(err);
        res.status(500).json({ message: "An error occurred while following the user" });
      }
}

const UnfollowUser = async (req , res) => {
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
}

const getUserById = async (req, res) => {
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
}

const SearchUsers = async (req, res) => {
  try {
    const { query } = req.params;

    const users = await User.find({ name: { $regex: new RegExp(query, "i") } });

    res.status(200).json({ users });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "An error occurred while searching for users" });
  }
}

const SuggestedUser = async (req, res) => {
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
}

module.exports = {
    FollowUser,
    UnfollowUser,
    getUserById,
    SearchUsers,
    SuggestedUser,
}
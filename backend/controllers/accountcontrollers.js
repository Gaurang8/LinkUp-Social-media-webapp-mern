const User  = require("../model/datamodal");

const UpdateAccountDetails = async (req, res) => {
  try {
    const { name, description, location, languageSpeak, socialMediaLinks ,dob } = req.body;

    const userId = req.user.user_id;
    console.log(userId)


    if (req.user.user_id !== userId) {
      return res.status(403).json({ message: "You are not authorized to update this user's profile" });
    }

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
}

const UpdateAccountType = async (req, res) => {
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
}

const ChangeAccountEmail = async (req, res) => {
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
}

const ChangeAccountPassword = async (req, res) => {
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
}

const AddAccountCoverImg = async (req, res) => {
  try {
    const { images } = req.body;
    const userId = req.user.user_id;
    console.log(images)

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }


    user.coverImage = images
    await user.save();

    res.status(201).json({ message: "Cover image added successfully" });
  } catch (err) {
    console.error("Error while adding cover image", err);
    res.status(500).json({ message: "An error occurred while adding the cover image" });
  }
}

const AddAccountProfileImg = async (req, res) => {
  try {
    const { images } = req.body;
    const userId = req.user.user_id;
    console.log(images)

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }


    user.profileImage = images
    await user.save();

    res.status(201).json({ message: "profile image added successfully" });
  } catch (err) {
    console.error("Error while adding profile image", err);
    res.status(500).json({ message: "An error occurred while adding the profile image" });
  }
}


module.exports = {
  UpdateAccountDetails,
  UpdateAccountType,
  ChangeAccountEmail,
  ChangeAccountPassword,
  AddAccountCoverImg,
  AddAccountProfileImg
}
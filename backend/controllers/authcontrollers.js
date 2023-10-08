const {
  generateToken,
  hashPassword,
  comparePasswords,
} = require("../utiles/authutiles");
const User = require("../model/datamodal");

async function register(req, res) {
 
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

    const encryptedPassword = await hashPassword(password);


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

    const token = generateToken(newUser._id, newUser.email);

    console.log("token is", token);

    const expirationDate = new Date(Date.now() + 15 * 24 * 3600 * 1000)

    res.cookie("token", token, { expires: expirationDate, sameSite: "None", secure: true });

    console.log(newUser);
    res.status(201).json({ user: newUser, message: "Registered successfully" });
  } catch (err) {
    console.log(err);
    res.status(500).send("An error occurred while registering");
  }
}

async function login(req, res) {
  
  try {
    const { email, password } = req.body;

    if (!(email && password)) {
      res.status(400).send("All input is required");
    }
    const user = await User.findOne({ email });

    const isPasswordValid = await comparePasswords(password, user.password);

    if(!user || !isPasswordValid) {
      return res.status(400).send("Invalid data");
    }

    if (user && isPasswordValid) {
      
      const token = generateToken(user._id, user.email);

      console.log("token is", token);

      const expirationDate = new Date(Date.now() + 15 * 24 * 3600 * 1000)

      res.cookie("token", token, { expires: expirationDate, sameSite: "None", secure: true });


      return res.status(200).json({ message: "Login successful", user });
    }
  } catch (err) {
    console.log(err);
  }
}

async function logout(req, res) {
    res.clearCookie("token", { sameSite: "None", secure: true });
    res.status(200).json({ message: "Logout successful" });
    }

const auth = async (req, res) => {
 const user = await User.findOne({ email: req.user.email });
    res.status(201).json({ user });
}


module.exports = { register, login , logout, auth };

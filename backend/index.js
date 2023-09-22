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

    newUser.token = token;
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

app.listen(8000);
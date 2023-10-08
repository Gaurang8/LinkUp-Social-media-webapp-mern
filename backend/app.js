const express = require("express");
const app = express();
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const cors = require("cors");

const authRoutes = require("./routes/authroutes");
const userRoutes = require("./routes/userroutes");
const groupRoutes = require("./routes/grouproutes");
const postRoutes = require("./routes/postroutes");
const accountRoutes = require("./routes/accountroutes");

dotenv.config();
app.use(express.json());
app.use(cors({ origin: process.env.BASE_ADDR, credentials: true }));

app.use(bodyParser.json({ limit: 1024 * 1024 * 50, type: 'application/json' }));
app.use(bodyParser.urlencoded({ extended: true, limit: 1024 * 1024 * 50, parameterLimit: 500000, type: 'application/x-www-form-urlencoded' }));
app.use(cookieParser());


app.use("/auth", authRoutes);
app.use("/user", userRoutes);
app.use("/group", groupRoutes);
app.use("/post", postRoutes);
app.use('/account',accountRoutes)


app.get("/", (req, res) => {
  if (mongoose.connection.readyState === 1) {
    res.send(`Database Connected to ${process.env.BASE_ADDR}`);
  } else {
    res.send("Database connection failed.");
  }
});

module.exports = app;

const jwt = require("jsonwebtoken");

const authenticateToken = (req, res, next) => {
    const token = req.cookies.token;
  
    if (token === null) {
      return res.status(401).json({ message: "Missing token" });
    }
  
    console.log("Verifying token" , process.env.TOKEN_KEY);
    jwt.verify(token, process.env.TOKEN_KEY, (err, user) => {
      if (err) {
        return res.status(403).json({ message: "Invalid token" });
      }
  
      req.user = user;
      next();
    });
  };
  
module.exports = { authenticateToken };
  
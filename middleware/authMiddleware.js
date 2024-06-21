const config = require("../utils/config");
const jwt = require("jsonwebtoken");
const userService = require("../services/userService");

const protect = async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, config.JWT_SECRET);
      req.user = await userService.getUserById(decoded.id);
      next();
    } catch (error) {
      res
        .status(401)
        .json({ success: false, message: "Not authorized, token failed" });
    }
  }
  if (!token) {
    res
      .status(401)
      .json({ success: false, message: "Not authorized, no token" });
  }
};

module.exports = { protect };

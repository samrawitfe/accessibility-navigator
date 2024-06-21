// controllers/authController.js
const userService = require("../services/userService");

exports.register = async (req, res) => {
  const { username, email, password, disabilityType } = req.body;
  try {
    const user = await userService.registerUser(
      username,
      email,
      password,
      disabilityType
    );
    res.status(201).json({ success: true, data: user });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await userService.loginUser(email, password);
    res.json({ success: true, data: user });
  } catch (error) {
    res.status(401).json({ success: false, message: error.message });
  }
};

exports.updateDisabilityType = async (req, res) => {
  const { disabilityType } = req.body;
  try {
    const user = await userService.updateUserDisabilityType(
      req.user._id,
      disabilityType
    );
    res.json({ success: true, data: user });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

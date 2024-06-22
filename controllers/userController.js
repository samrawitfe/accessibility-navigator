const userService = require("../services/userService");

exports.getUserProfile = async (req, res) => {
  try {
    const user = await userService.getUserById(req.params.userId);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    res.json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

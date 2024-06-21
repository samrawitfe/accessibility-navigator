// services/userService.js
const config = require("../utils/config");
const cloudant = require("../utils/cloudant");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const generateToken = (id) => {
  return jwt.sign({ id }, config.JWT_SECRET, { expiresIn: "30d" });
};

async function registerUser(username, email, password, disabilityType) {
  const users = await cloudant.getData("users");
  const userExists = users.find((user) => user.email === email);

  if (userExists) {
    throw new Error("User already exists");
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const newUser = {
    _id: `user_${new Date().getTime()}`,
    username,
    email,
    password: hashedPassword,
    disabilityType, // Add disabilityType field
  };

  await cloudant.storeData("users", newUser);

  return {
    _id: newUser._id,
    username: newUser.username,
    email: newUser.email,
    disabilityType: newUser.disabilityType,
    token: generateToken(newUser._id),
  };
}

async function loginUser(email, password) {
  const users = await cloudant.getData("users");
  const user = users.find((user) => user.email === email);

  if (user && (await bcrypt.compare(password, user.password))) {
    return {
      _id: user._id,
      username: user.username,
      email: user.email,
      disabilityType: user.disabilityType,
      token: generateToken(user._id),
    };
  } else {
    throw new Error("Invalid credentials");
  }
}

async function getUserById(id) {
  const users = await cloudant.getData("users");
  return users.find((user) => user._id === id);
}

async function updateUserDisabilityType(userId, disabilityType) {
  const users = await cloudant.getData("users");
  const userIndex = users.findIndex((user) => user._id === userId);

  if (userIndex === -1) {
    throw new Error("User not found");
  }

  users[userIndex].disabilityType = disabilityType;
  await cloudant.storeData("users", users[userIndex]);

  return users[userIndex];
}

module.exports = {
  registerUser,
  loginUser,
  getUserById,
  updateUserDisabilityType,
};

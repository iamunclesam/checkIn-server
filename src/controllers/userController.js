const User = require("../models/User");
const bcrypt = require("bcryptjs");
const generateUniqueId = require("../helpers/generateUniqueId");
const createHttpError = require("http-errors");
const QRCode = require("qrcode");
const {
  signAccessToken,
  signRefreshToken,
} = require("../middlewares/authMiddleware");

const createNewUser = async (req, res) => {
  try {
    const result = req.body;
    const doesExist = await User.findOne({ email: result.email });
    if (doesExist) {
      throw createHttpError.Conflict(`${result.email} is already registered`);
    }

    const user = new User(result);
    const savedUser = await user.save();

    const qrCodeContent = JSON.stringify({ userId: savedUser._id });
    const qrCodeUrl = await QRCode.toDataURL(qrCodeContent);

    savedUser.qrCodeUrl = qrCodeUrl;
    await savedUser.save();

    const accessToken = await signAccessToken(savedUser.id, savedUser.role);
    const refreshToken = await signRefreshToken(savedUser.id);

    // Send response with tokens
    res.status(201).send({ accessToken, refreshToken, qrCodeUrl });
  } catch (error) {
    // Handle validation or other errors
    if (error.isJoi === true) error.status = 422;
    res.status(error.status || 500).json({ message: error.message });
  }
};

const loginUser = async (req, res, next) => {
  try {
    const result = req.body;

    const user = await User.findOne({ email: result.email });

    if (!user) throw createHttpError.NotFound("User not registered");

    const isMatch = await user.isValidPassword(result.password);

    if (!isMatch)
      throw createHttpError.Unauthorized("Email or password not valid");

    const accessToken = await signAccessToken(user.id, user.role);
    const refreshToken = await signRefreshToken(user.id);
    res.send({ accessToken, refreshToken });
  } catch (error) {
    if (error.isJoi == true)
      return next(createHttpError.BadRequest("Invalid Email/Password"));
    next(error);
  }
};

const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAllUser = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const checkIn = async (req, res) => {
  try {
    const user = await User.findById(req.payload.aud);

    const checkInTime = new Date();

    user.checkedIn = true;
    user.checkInTime = checkInTime;
    user.checkIns.push({ time: checkInTime }); // Log the check-in event
    await user.save();

    res.json({ message: "Checked in successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const checkOut = async (req, res) => {
  try {
    const user = await User.findById(req.payload.aud);
    user.checkedIn = false;
    user.checkOutTime = new Date();
    await user.save();

    res.json({ message: "Checked out successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all checked-in users with sorting
const getAllCheckedInUsers = async (req, res) => {
  try {
    const sortField = req.query.sortBy || "checkInTime"; // Default sort by checkInTime
    const sortOrder = req.query.order === "desc" ? -1 : 1; // Default order is ascending

    const checkedInUsers = await User.find({ checkedIn: true }).sort({
      [sortField]: sortOrder,
    });

    res.status(200).json(checkedInUsers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all checked-out users with sorting
const getAllCheckedOutUsers = async (req, res) => {
  try {
    const sortField = req.query.sortBy || "checkOutTime"; // Default sort by checkOutTime
    const sortOrder = req.query.order === "desc" ? -1 : 1; // Default order is ascending

    const checkedOutUsers = await User.find({ checkedIn: false }).sort({
      [sortField]: sortOrder,
    });

    res.status(200).json(checkedOutUsers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createNewUser,
  loginUser,
  getUserById,
  getAllUser,
  checkIn,
  checkOut,
  getAllCheckedInUsers,
  getAllCheckedOutUsers,
};

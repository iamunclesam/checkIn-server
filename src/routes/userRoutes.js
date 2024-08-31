const express = require("express");
const router = express.Router();
const {
  createNewUser,
  loginUser,
  getAllUser,
  getCurrentUser,
  getUserById,
  getAllCheckedInUsers,
  getAllCheckedOutUsers,
  checkIn,
  checkOut,
} = require("../controllers/userController");
const { verifyAccessToken } = require("../middlewares/authMiddleware");

// Registration route
router.post("/register", createNewUser);

// Login route
router.post("/login", loginUser);
router.get("/user/:id", getUserById);
router.get("/currentuser", verifyAccessToken, getCurrentUser);

router.get("/users", getAllUser);
router.get("/checked-in-users", getAllCheckedInUsers);
router.get(
  "/checked-out-users?sortBy=checkOutTime&order=desc",
  getAllCheckedOutUsers
);

// Check-in route
router.post("/checkin", verifyAccessToken, checkIn);

// Check-out route
router.post("/checkout", verifyAccessToken, checkOut);

module.exports = router;

const express = require("express");
const router = express.Router();
const { getCheckInStats } = require("../controllers/stats");
const { verifyAccessToken } = require("../middlewares/authMiddleware");


router.get("/checkin-stats", verifyAccessToken, getCheckInStats);

module.exports = router;

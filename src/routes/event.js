const express = require("express");
const router = express.Router();
const {
  createEvent,
  getUpcomingEvents,
  bookTicket,
} = require("../controllers/event");
const { verifyAccessToken } = require("../middlewares/authMiddleware");

router.post("/event", createEvent);
router.get("/event/upcoming", getUpcomingEvents);
router.post("/:eventId/book", verifyAccessToken, bookTicket);

module.exports = router;

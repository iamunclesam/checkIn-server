const mongoose = require("mongoose");

const ticketSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  ticketNumber: {
    type: String,
    required: true,
    unique: true,
  },
  qrCodeUrl: {
    type: String,
  },
  bookedAt: {
    type: Date,
    default: Date.now,
  },
});

const eventSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  ticketsAvailable: {
    type: Number,
    required: true,
  },
  tickets: [ticketSchema], // Array of tickets booked for the event
});

module.exports = mongoose.model("Event", eventSchema);

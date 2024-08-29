const mongoose = require("mongoose");

const qrCodeSchema = new mongoose.Schema({
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
  qrCodeContent: {
    type: String, // The content encoded in the QR code
    required: true,
  },
  qrCodeUrl: {
    type: String, // URL or path to the saved QR code image
  },
  generatedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("QRCode", qrCodeSchema);

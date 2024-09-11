const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const { required } = require("joi");

const checkInSchema = new mongoose.Schema({
  time: { type: Date, required: true },
});

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  qrCodeUrl: {
    type: String, 
  },
  uniqueId: {
    type: String,
    unique: true,
  },
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
    required: true,
  },
  checkedIn: {
    type: Boolean,
    default: false,
  },
  checkInTime: {
    type: Date,
  },
  checkOutTime: {
    type: Date,
  },
  checkIns: [checkInSchema], // Array of check-in events
});

UserSchema.pre("save", async function (next) {
  try {
    // Check if the password has been modified (for updates)
    if (!this.isModified("password")) return next();

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(this.password, salt);
    this.password = hashedPassword;
    console.log("Password hashed successfully:", this.password); // Debug log
    next();
  } catch (error) {
    console.error("Error during password hashing:", error); // Debug log
    next(error);
  }
});

UserSchema.methods.isValidPassword = async function (password) {
  try {
    const isMatch = await bcrypt.compare(password, this.password);
    console.log("Comparing passwords:", {
      input: password,
      hash: this.password,
      isMatch,
    }); // Debug log
    return isMatch;
  } catch (error) {
    console.error("Error comparing passwords:", error); // Debug log
    throw error;
  }
};

module.exports = mongoose.model("User", UserSchema);

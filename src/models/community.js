const mongoose = require("mongoose");

// Define core team member schema
const coreTeamMemberSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  position: {
    type: String,
    required: true,
  },
});

// Define the main community schema
const communitySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  description: {
    type: String,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  coreTeam: [coreTeamMemberSchema], // Embeds core team members
});

// Create and export the Community model
module.exports = mongoose.model("Community", communitySchema);

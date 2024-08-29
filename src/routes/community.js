const express = require("express");
const router = express.Router();
const {
  createCommunity,
  getAllCommunities,
  getCommunityById,
  updateCommunity,
  deleteCommunity,
} = require("../controllers/community");

router.post("/community", createCommunity);
router.get("/community", getAllCommunities);
router.get("/community/:id", getCommunityById);
router.put("/community/:id", updateCommunity);
router.delete("/community/:id", deleteCommunity);

module.exports = router;

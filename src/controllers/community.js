const Community = require("../models/community");
const createHttpError = require("http-errors");

// Controller to create a new community
const createCommunity = async (req, res, next) => {
  try {
    const { name, description, coreTeam, createdBy } = req.body;
    console.log(req);

    const doesExist = await Community.findOne({ name });
    if (doesExist) {
      throw createHttpError.Conflict(`${name} is already registered`);
    }

    const community = new Community({
      name,
      description,
      createdBy,
      coreTeam,
    });

    const savedCommunity = await community.save();

    res.status(201).json(savedCommunity);
  } catch (error) {
    next(error);
  }
};

// Controller to get all communities
const getAllCommunities = async (req, res, next) => {
  try {
    const communities = await Community.find();
    res.status(200).json(communities);
  } catch (error) {
    next(error);
  }
};

// Controller to get a single community by ID
const getCommunityById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const community = await Community.findById(id);
    if (!community) throw createHttpError.NotFound("Community not found");

    res.status(200).json(community);
  } catch (error) {
    next(error);
  }
};

// Controller to update a community
const updateCommunity = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, description, coreTeam } = req.body;

    // Find community by ID and update its fields
    const updatedCommunity = await Community.findByIdAndUpdate(
      id,
      { name, description, coreTeam },
      { new: true, runValidators: true }
    );

    if (!updatedCommunity)
      throw createHttpError.NotFound("Community not found");

    res.status(200).json(updatedCommunity);
  } catch (error) {
    next(error);
  }
};

// Controller to delete a community
const deleteCommunity = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Find community by ID and delete it
    const deletedCommunity = await Community.findByIdAndDelete(id);

    if (!deletedCommunity)
      throw createHttpError.NotFound("Community not found");

    res.status(200).json({ message: "Community deleted successfully" });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createCommunity,
  getAllCommunities,
  getCommunityById,
  updateCommunity,
  deleteCommunity,
};

const User = require("../models/User");

exports.getCheckInStats = async (req, res) => {
  try {
    // Get stats per day, week, and month
    const stats = await User.aggregate([
      { $unwind: "$checkIns" }, // Unwind checkIns array to work with individual check-ins
      {
        $group: {
          _id: {
            day: { $dayOfYear: "$checkIns.time" },
            week: { $week: "$checkIns.time" },
            month: { $month: "$checkIns.time" },
            year: { $year: "$checkIns.time" },
          },
          dailyCount: { $sum: 1 }, // Count check-ins per day
        },
      },
      {
        $group: {
          _id: { week: "$_id.week", year: "$_id.year" },
          weeklyCount: { $sum: "$dailyCount" }, // Count check-ins per week
        },
      },
      {
        $group: {
          _id: { month: "$_id.month", year: "$_id.year" },
          monthlyCount: { $sum: "$weeklyCount" }, // Count check-ins per month
        },
      },
      {
        $sort: { "_id.year": 1, "_id.month": 1 }, // Sort results by year and month
      },
    ]);

    res.json({ stats });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

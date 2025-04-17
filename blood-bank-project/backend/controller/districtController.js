import { District } from "../models/districtSchema.js";

// Get all district types
export const getAllDistricts = async (req, res) => {
  try {
    const districts = await District.find().sort({ DistrictID: 1 });
    res.status(200).json({
      success: true,
      count: districts.length,
      data: districts,
    });
  } catch (error) {
    console.log("Error fetching districts:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error while fetching districts",
    });
  }
};

//   @desc    Get all districts
//   @route   GET /api/districts
//   @access  Public
//   @returns {Object} List of all districts sorted by name

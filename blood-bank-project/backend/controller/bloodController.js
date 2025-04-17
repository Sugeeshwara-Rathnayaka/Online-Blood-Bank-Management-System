import Blood from "../models/bloodSchema.js";

// Get all blood types
export const getAllBloodTypes = async (req, res) => {
  try {
    const bloodTypes = await Blood.find().sort({ BloodID: 1 });
    res.status(200).json({
      success: true,
      bloodTypes,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch blood types",
    });
  }
};

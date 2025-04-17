import mongoose from "mongoose";
import { District } from "../models/districtSchema.js";
import dotenv from "dotenv";
import { dbConnection } from "../database/dbConnection.js";

// Load .env file
dotenv.config({ path: "./config/config.env" });
const seedDistrictData = async () => {
  try {
    // Connect to MongoDB
    await dbConnection();

    // Array of district data
    const districts = [
      { id: 1, name: "Ampara", Province: "easet" },
      { id: 2, name: "Anuradhapura", Province: "north central" },
      { id: 3, name: "Badulla", Province: "uwa" },
      { id: 4, name: "Batticoloa", Province: "easet" },
      { id: 5, name: "Colombo", Province: "western" },
      { id: 6, name: "Galle", Province: "southern" },
      { id: 7, name: "Gampaha", Province: "western" },
      { id: 8, name: "Hambanthota", Province: "southern" },
      { id: 9, name: "Jaffna", Province: "north" },
      { id: 10, name: "Kaluthara", Province: "western" },
      { id: 11, name: "Kandy", Province: "central" },
      { id: 12, name: "Kegalle", Province: "sabaragamuwa" },
      { id: 13, name: "Kilinochchi", Province: "north" },
      { id: 14, name: "Kurunegala", Province: "north western" },
      { id: 15, name: "Mannar", Province: "north" },
      { id: 16, name: "Mathale", Province: "central" },
      { id: 17, name: "Mathara", Province: "southern" },
      { id: 18, name: "Monaragala", Province: "uwa" },
      { id: 19, name: "Mullativu", Province: "north" },
      { id: 20, name: "Nuwara Eliya", Province: "central" },
      { id: 21, name: "Polonnaruwa", Province: "north central" },
      { id: 22, name: "Puttalam", Province: "north western" },
      { id: 23, name: "Rathnapura", Province: "sabaragamuwa" },
      { id: 24, name: "Trincomalee", Province: "easet" },
      { id: 25, name: "Vavniya", Province: "north" },
    ];

    // Clear existing data (optional - be careful with this in production)
    await District.deleteMany({});

    // Seed the data
    const result = await District.insertMany(districts);
    console.log(`Inserted ${result.length} districts successfully!`);

    // Disconnect after seeding
    await mongoose.disconnect();
    console.log("MongoDB disconnected after seeding");
  } catch (error) {
    console.error("Error seeding district data:", error);
    // Ensure we disconnect even if there's an error
    await mongoose.disconnect();
    process.exit(1); // Exit with failure code
  }
};

// Execute the seed function
seedDistrictData();

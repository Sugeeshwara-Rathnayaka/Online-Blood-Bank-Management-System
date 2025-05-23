import mongoose from "mongoose";
import { District } from "../models/Other/District.js";
import dotenv from "dotenv";
import connectDB from "../config/db.js";

// Load .env file
dotenv.config({ path: "./.env" });
const seedDistrictData = async () => {
  try {
    // Connect to MongoDB
    await connectDB();

    // Array of district data
    const districts = [
      { name: "Ampara", province: "eastern" },
      { name: "Anuradhapura", province: "north central" },
      { name: "Badulla", province: "uva" },
      { name: "Batticaloa", province: "eastern" },
      { name: "Colombo", province: "western" },
      { name: "Galle", province: "southern" },
      { name: "Gampaha", province: "western" },
      { name: "Hambantota", province: "southern" },
      { name: "Jaffna", province: "northern" },
      { name: "Kalutara", province: "western" },
      { name: "Kandy", province: "central" },
      { name: "Kegalle", province: "sabaragamuwa" },
      { name: "Kilinochchi", province: "northern" },
      { name: "Kurunegala", province: "north western" },
      { name: "Mannar", province: "northern" },
      { name: "Matale", province: "central" },
      { name: "Matara", province: "southern" },
      { name: "Monaragala", province: "uva" },
      { name: "Mullaitivu", province: "northern" },
      { name: "Nuwara Eliya", province: "central" },
      { name: "Polonnaruwa", province: "north central" },
      { name: "Puttalam", province: "north western" },
      { name: "Ratnapura", province: "sabaragamuwa" },
      { name: "Trincomalee", province: "eastern" },
      { name: "Vavuniya", province: "northern" },
    ];

    // Clear existing data (optional - be careful with this in production)
    await District.deleteMany({});

    // Seed the data
    const result = await District.insertMany(districts);
    console.log(`Inserted ${result.length} districts successfully!`);

    // Disconnect after seeding
    await mongoose.disconnect();
    console.log("MongoDB disconnected after seeding");
    process.exit(0); // Success
  } catch (error) {
    console.error("Error seeding district data:", error);
    // Ensure we disconnect even if there's an error
    await mongoose.disconnect();
    process.exit(1); // Exit with failure code
  }
};

// Execute the seed function
seedDistrictData();

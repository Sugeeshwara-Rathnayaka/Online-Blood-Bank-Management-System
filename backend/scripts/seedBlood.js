import mongoose from "mongoose";
import Blood from "../models/Other/Blood.js";
import dotenv from "dotenv";
import connectDB from "../config/db.js";

// Load .env file
dotenv.config({ path: "./.env" });

const seedBloodData = async () => {
  try {
    // Connect to MongoDB
    await connectDB();

    // Blood types array
    const bloodTypes = [
      { type: "O+", description: "O Positive" },
      { type: "O-", description: "O Negative" },
      { type: "A+", description: "A Positive" },
      { type: "A-", description: "A Negative" },
      { type: "B+", description: "B Positive" },
      { type: "B-", description: "B Negative" },
      { type: "AB+", description: "AB Positive" },
      { type: "AB-", description: "AB Negative" },
    ];

    // Clear existing data (optional - be careful with this in production)
    await Blood.deleteMany({});

    // Seed the data
    const result = await Blood.insertMany(bloodTypes);
    console.log(`Inserted ${result.length} blood types successfully!`);
    // Disconnect after seeding
    await mongoose.disconnect();
    console.log("MongoDB disconnected after seeding.");
    process.exit(0); // Success
  } catch (error) {
    console.error("Error seeding blood types:", error);
    // Ensure we disconnect even if there's an error
    await mongoose.disconnect();
    process.exit(1); // Exit with failure code
  }
};

// Execute the seed function
seedBloodData();

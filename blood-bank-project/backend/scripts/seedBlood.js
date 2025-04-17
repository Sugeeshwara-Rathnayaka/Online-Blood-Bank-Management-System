import mongoose from "mongoose";
import Blood from "../models/bloodSchema.js";
import dotenv from "dotenv";
import { dbConnection } from "../database/dbConnection.js";

// Load .env file
dotenv.config({ path: "./config/config.env" });
const seedBloodData = async () => {
  try {
    // Connect to MongoDB
    await dbConnection();

    // Array of blood types
    const bloodTypes = [
      { BloodID: 1, Type: "O+", Description: "O Positive" },
      { BloodID: 2, Type: "O-", Description: "O Negative" },
      { BloodID: 3, Type: "A+", Description: "A Positive" },
      { BloodID: 4, Type: "A-", Description: "A Negative" },
      { BloodID: 5, Type: "B+", Description: "B Positive" },
      { BloodID: 6, Type: "B-", Description: "B Negative" },
      { BloodID: 7, Type: "AB+", Description: "AB Positive" },
      { BloodID: 8, Type: "AB-", Description: "AB Negative" },
    ];
    await Blood.deleteMany({});
    // Seed the data
    const result = await Blood.insertMany(bloodTypes);
    console.log("Inserted Blood Types:", result);

    console.log("Blood types seeded successfully!");

    // Disconnect after seeding
    mongoose.disconnect();
    console.log("MongoDB disconnected after seeding");
  } catch (error) {
    console.error("Error seeding blood types:", error);
    // Ensure we disconnect even if there's an error
    mongoose.disconnect();
    process.exit(1); // Exit with failure code
  }
};
// Execute the seed function
seedBloodData();

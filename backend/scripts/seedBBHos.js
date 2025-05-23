import mongoose from "mongoose";
import { BloodBankHospital } from "../models/BloodBank/BloodBankHospital.js";
import { District } from "../models/Other/District.js";

import dotenv from "dotenv";
import connectDB from "../config/db.js";

// Load .env file
dotenv.config({ path: "./.env" });
const seedBBHData = async () => {
  try {
    // Connect to MongoDB
    await connectDB();

    // Array of blood types
    const bBHospitals = [
      {
        name: "Ragama Hospital",
        address: "Ragama",
        district: "Gampaha",
        capacity: 200,
        isDeleted: false,
      },
      {
        name: "Ganemulla Hospitals",
        address: "Ganemulla RD",
        district: "Kalutara",
        capacity: 0,
        isDeleted: false,
      },
      {
        name: "Wathupitiwala General Hospital",
        address: "Wathupitiwala RD",
        district: "Gampaha",
        capacity: 0,
        isDeleted: false,
      },
      {
        name: "Welisara Hospital",
        address: "Welisara RD",
        district: "Gampaha",
        capacity: 0,
        isDeleted: false,
      },
      {
        name: "Horana Genaral Hospital",
        address: "Horana RD",
        district: "Kalutara",
        capacity: 0,
        isDeleted: false,
      },
      {
        name: "Jaffna Hospital",
        address: "Jaffna RD",
        district: "Jaffna",
        capacity: 50,
        isDeleted: false,
      },
      {
        name: "Hambanthota Genaral Hospital",
        address: "Hambanthota RD",
        district: "Hambantota",
        capacity: 100,
        isDeleted: false,
      },
      {
        name: "Bibila Genaral Hospital",
        address: "Balangoda RD",
        district: "Kegalle",
        capacity: 200,
        isDeleted: false,
      },
      {
        name: "Maradana Genaral Hospital",
        address: "Maradana South RD",
        district: "Colombo",
        capacity: 200,
        isDeleted: false,
      },
      {
        name: "Balangoda Main Hospital",
        address: "Balangoda RD",
        district: "Jaffna",
        capacity: 100,
        isDeleted: true,
      },
      {
        name: "Galle Main Hospital",
        address: "Galle RD",
        district: "Galle",
        capacity: 150,
        isDeleted: true,
      },
      {
        name: "Rathupaswala Main Hospital",
        address: "Rathupaswala RD",
        district: "Gampaha",
        capacity: 150,
        isDeleted: false,
      },
      {
        name: "Kilinochchi Main Hospital",
        address: "Kilinochchi RD",
        district: "Kilinochchi",
        capacity: 1000,
        isDeleted: false,
      },
      {
        name: "Kothalawala Genaral Hospital",
        address: "Kothalawala RD, Colombo",
        district: "Colombo",
        capacity: 300,
        isDeleted: false,
      },
    ];
    await BloodBankHospital.deleteMany({});
    console.log("Existing hospitals removed!");

    const hospitalsWithDistrictIds = [];
    for (const hosp of bBHospitals) {
      const districtDoc = await District.findOne({ name: hosp.district });
      if (!districtDoc) {
        console.warn(
          `Warning: District "${hosp.district}" not found for hospital "${hosp.name}". Skipping this hospital.`
        );
        continue; // Skip this hospital if district not found
      }
      hospitalsWithDistrictIds.push({
        name: hosp.name,
        address: hosp.address,
        district: districtDoc._id, // use ObjectId here
        capacity: hosp.capacity,
        isDeleted: hosp.isDeleted,
      });
    }

    // Seed the data
    const result = await BloodBankHospital.insertMany(hospitalsWithDistrictIds);
    console.log("Inserted BBH:", result.length);

    console.log("BBH seeded successfully!");

    // Disconnect after seeding
    mongoose.disconnect();
    console.log("MongoDB disconnected after seeding");
  } catch (error) {
    console.error("Error seeding BBH:", error);
    // Ensure we disconnect even if there's an error
    mongoose.disconnect();
    process.exit(1); // Exit with failure code
  }
};
// Execute the seed function
seedBBHData();

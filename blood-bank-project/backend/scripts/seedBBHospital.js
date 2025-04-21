import mongoose from "mongoose";
import { BloodBankHospital } from "../models/bloodBankHospitalSchema.js";
import dotenv from "dotenv";
import { dbConnection } from "../database/dbConnection.js";

// Load .env file
dotenv.config({ path: "./config/config.env" });
const seedBBHData = async () => {
  try {
    // Connect to MongoDB
    await dbConnection();

    // Array of blood types
    const bBHospitals = [
      {
        hospitalId: 10,
        name: "Ragama Hospital",
        address: "Ragama",
        district: "Gampaha",
        capacity: 200,
        isDeleted: false,
      },
      {
        hospitalId: 11,
        name: "Ganemulla Hospitals",
        address: "Ganemulla RD",
        district: "Kaluthara",
        capacity: 0,
        isDeleted: false,
      },
      {
        hospitalId: 12,
        name: "Wathupitiwala General Hospital",
        address: "Wathupitiwala RD",
        district: "Gampaha",
        capacity: 0,
        isDeleted: false,
      },
      {
        hospitalId: 13,
        name: "Welisara Hospital",
        address: "Welisara RD",
        district: "Gampaha",
        capacity: 0,
        isDeleted: false,
      },
      {
        hospitalId: 14,
        name: "Horana Genaral Hospital",
        address: "Horana RD",
        district: "Kaluthara",
        capacity: 0,
        isDeleted: false,
      },
      {
        hospitalId: 17,
        name: "Jaffna Hospital",
        address: "Jaffna RD",
        district: "Jaffna",
        capacity: 50,
        isDeleted: false,
      },
      {
        hospitalId: 18,
        name: "Hambanthota Genaral Hospital",
        address: "Hambanthota RD",
        district: "Hambanthota",
        capacity: 100,
        isDeleted: false,
      },
      {
        hospitalId: 26,
        name: "Bibila Genaral Hospital",
        address: "Balangoda RD",
        district: "Kegalle",
        capacity: 200,
        isDeleted: false,
      },
      {
        hospitalId: 27,
        name: "Maradana Genaral Hospital",
        address: "Maradana South RD",
        district: "Colombo",
        capacity: 200,
        isDeleted: false,
      },
      {
        hospitalId: 30,
        name: "Balangoda Main Hospital",
        address: "Balangoda RD",
        district: "Jaffna",
        capacity: 100,
        isDeleted: true,
      },
      {
        hospitalId: 31,
        name: "Galle Main Hospital",
        address: "Galle RD",
        district: "Galle",
        capacity: 150,
        isDeleted: true,
      },
      {
        hospitalId: 32,
        name: "Rathupaswala Main Hospital",
        address: "Rathupaswala RD",
        district: "Gampaha",
        capacity: 150,
        isDeleted: false,
      },
      {
        hospitalId: 33,
        name: "Kilinochchi Main Hospital",
        address: "Kilinochchi RD",
        district: "Kilinochchi",
        capacity: 1000,
        isDeleted: false,
      },
      {
        hospitalId: 34,
        name: "Kothalawala Genaral Hospital",
        address: "Kothalawala RD, Colombo",
        district: "Colombo",
        capacity: 300,
        isDeleted: false,
      },
    ];
    await BloodBankHospital.deleteMany({});
    console.log("Existing hospitals removed!");
    // Seed the data
    const result = await BloodBankHospital.insertMany(bBHospitals);
    console.log("Inserted BBH:", result);

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

import mongoose from "mongoose";
import dotenv from "dotenv";
import { dbConnection } from "../database/dbConnection.js";
import { BloodBankHospitalTelephone } from "../models/bBHTelephoneSchema.js"; // Make sure this is correctly named and exported

// Load environment variables
dotenv.config({ path: "./config/config.env" });

const seedTelephones = async () => {
  try {
    // Connect to DB
    await dbConnection();

    // Clear old records
    await BloodBankHospitalTelephone.deleteMany({});
    console.log("Existing telephone records removed!");

    // Seed data based on SQL dump
    const telephoneData = [
      { BBID: 10, telephoneNo: "0714053456", flag: 0 },
      { BBID: 10, telephoneNo: "0335555555", flag: 1 },
      { BBID: 11, telephoneNo: "0661234567", flag: 0 },
      { BBID: 11, telephoneNo: "0664444443", flag: 1 },
      { BBID: 12, telephoneNo: "0331122246", flag: 0 },
      { BBID: 12, telephoneNo: "0332345678", flag: 1 },
      { BBID: 13, telephoneNo: "0332222222", flag: 1 },
      { BBID: 14, telephoneNo: "0115555555", flag: 1 },
      { BBID: 17, telephoneNo: "0772222345", flag: 1 },
      { BBID: 18, telephoneNo: "0112345678", flag: 1 },
      { BBID: 26, telephoneNo: "0332333456", flag: 1 },
      { BBID: 27, telephoneNo: "0772123456", flag: 0 },
      { BBID: 27, telephoneNo: "0113335457", flag: 1 },
      { BBID: 30, telephoneNo: "0772233782", flag: 1 },
      { BBID: 31, telephoneNo: "0772345678", flag: 1 },
      { BBID: 32, telephoneNo: "0778989000", flag: 0 },
      { BBID: 32, telephoneNo: "0332233678", flag: 1 },
      { BBID: 33, telephoneNo: "0771234567", flag: 1 },
      { BBID: 34, telephoneNo: "0119876567", flag: 1 },
    ];

    // Insert into DB
    const result = await BloodBankHospitalTelephone.insertMany(telephoneData);
    console.log("Inserted telephones:", result.length);

    // Disconnect
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB");
  } catch (err) {
    console.error("Seeding error:", err);
    await mongoose.disconnect();
    process.exit(1);
  }
};

seedTelephones();

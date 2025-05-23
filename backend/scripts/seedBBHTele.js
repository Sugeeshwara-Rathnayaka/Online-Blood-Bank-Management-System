import mongoose from "mongoose";
import { BloodBankHospitalTelephone } from "../models/BloodBank/BloodBankHospitalTelephone.js";
import { BloodBankHospital } from "../models/BloodBank/BloodBankHospital.js";
import dotenv from "dotenv";
import connectDB from "../config/db.js";

// Load .env file
dotenv.config({ path: "./.env" });

const telephoneData = [
  { hospitalName: "Ragama Hospital", telephoneNo: "0714053456", flag: 1 },
  { hospitalName: "Ganemulla Hospitals", telephoneNo: "0335555555", flag: 1 },
  {
    hospitalName: "Wathupitiwala General Hospital",
    telephoneNo: "0661234567",
    flag: 0,
  },
  {
    hospitalName: "Wathupitiwala General Hospital",
    telephoneNo: "0664444443",
    flag: 1,
  },
  { hospitalName: "Welisara Hospital", telephoneNo: "0331122246", flag: 0 },
  { hospitalName: "Welisara Hospital", telephoneNo: "0332345678", flag: 1 },
  {
    hospitalName: "Horana Genaral Hospital",
    telephoneNo: "0332222222",
    flag: 1,
  },
  { hospitalName: "Jaffna Hospital", telephoneNo: "0115555555", flag: 1 },
  {
    hospitalName: "Hambanthota Genaral Hospital",
    telephoneNo: "0772222345",
    flag: 1,
  },
  {
    hospitalName: "Bibila Genaral Hospital",
    telephoneNo: "0112345678",
    flag: 1,
  },
  {
    hospitalName: "Maradana Genaral Hospital",
    telephoneNo: "0332333456",
    flag: 1,
  },
  {
    hospitalName: "Maradana Genaral Hospital",
    telephoneNo: "0772123456",
    flag: 0,
  },
  {
    hospitalName: "Balangoda Main Hospital",
    telephoneNo: "0113335457",
    flag: 1,
  },
  { hospitalName: "Galle Main Hospital", telephoneNo: "0772233782", flag: 1 },
  {
    hospitalName: "Rathupaswala Main Hospital",
    telephoneNo: "0772345678",
    flag: 1,
  },
  {
    hospitalName: "Rathupaswala Main Hospital",
    telephoneNo: "0778989000",
    flag: 0,
  },
  {
    hospitalName: "Kilinochchi Main Hospital",
    telephoneNo: "0332233678",
    flag: 1,
  },
  {
    hospitalName: "Kothalawala Genaral Hospital",
    telephoneNo: "0771234567",
    flag: 1,
  },
];

const seedTelephones = async () => {
  try {
    // Connect to MongoDB
    await connectDB();

    // Clear existing data (optional - be careful with this in production)
    await BloodBankHospitalTelephone.deleteMany({});

    const finalData = [];

    for (const item of telephoneData) {
      const hospital = await BloodBankHospital.findOne({
        name: item.hospitalName,
      });

      if (!hospital) {
        console.warn(`⚠️ Hospital not found: ${item.hospitalName}`);
        continue;
      }

      finalData.push({
        bloodBankId: hospital._id,
        telephoneNo: item.telephoneNo,
        flag: item.flag,
      });
    }

    // Seed the data
    const result = await BloodBankHospitalTelephone.insertMany(finalData);
    console.log(`✅ Inserted ${result.length} Numbers successfully!`);
    // Disconnect after seeding
    await mongoose.disconnect();
    console.log("MongoDB disconnected after seeding.");
    process.exit(0); // Success
  } catch (error) {
    console.error("❌ Error seeding telephone data:", error);
    // Ensure we disconnect even if there's an error
    await mongoose.disconnect();
    process.exit(1); // Exit with failure code
  }
};

// Execute the seed function
seedTelephones();

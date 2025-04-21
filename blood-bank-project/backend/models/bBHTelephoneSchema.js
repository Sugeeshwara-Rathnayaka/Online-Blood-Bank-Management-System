// models/bloodBankHospitalSchema.js
import mongoose from "mongoose";

const bBHTelephoneSchema = new mongoose.Schema(
  {
    BBID: {
      type: String,
      ref: "BloodBankHospital",
      required: true,
    },
    telephoneNo: {
      type: String,
      required: true,
    },
    flag: {
      type: Number,
      default: 0, // or whatever makes sense (0 = primary maybe)
    },
  },
  { timestamps: true }
);

export const BloodBankHospitalTelephone = mongoose.model(
  "BloodBankHospitalTelephone",
  bBHTelephoneSchema,
  "blood_bank_hospital_telephone"
);

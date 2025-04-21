// models/bloodBankHospitalSchema.js
import mongoose from "mongoose";

const bloodBankHospitalSchema = new mongoose.Schema(
  {
    hospitalId: {
      type: Number,
      unique: true,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    district: {
      type: String,
      ref: "District", // Reference to District collection
      required: true,
    },
    capacity: {
      type: Number,
      default: 0,
    },
    isDeleted: {
      type: Boolean,
      default: false, // Equivalent to SQL Del = 0
    },
    deletedAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

export const BloodBankHospital = mongoose.model(
  "BloodBankHospital",
  bloodBankHospitalSchema,
  "blood_bank_hospital"
);

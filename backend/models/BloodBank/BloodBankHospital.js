import mongoose from "mongoose";

const bloodBankHospitalSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    district: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "District", // Reference to District collection
      required: true,
    },
    capacity: {
      type: Number,
      default: 0,
      required: true,
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

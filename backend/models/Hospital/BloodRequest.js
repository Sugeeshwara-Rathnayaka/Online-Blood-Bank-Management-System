import mongoose from "mongoose";

const bloodReqSchema = new mongoose.Schema(
  {
    requestId: {
      type: String,
      required: true,
      unique: true,
    },
    patientName: {
      type: String,
      required: true,
    },
    bloodId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Blood", //reference collection
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    bloodBankId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "BloodBankHospital", //reference collection
      required: true,
    },
    hospitalId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Hospital", //reference collection
      required: true,
    },
    dateNeeded: {
      type: Date,
      required: true,
    },
    status: {
      type: Number,
      enum: [0, 1, 2, 3, 4], // 0: Pending, 1: Proccessing, 2: Critical, 3: Fulfilled, 4: Rejected
      default: 0,
    },
  },
  { timestamps: true }
);

export const BloodRequest = mongoose.model(
  "BloodRequest",
  bloodReqSchema,
  "blood_request"
);

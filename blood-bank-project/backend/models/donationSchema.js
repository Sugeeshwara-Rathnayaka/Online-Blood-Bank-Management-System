import mongoose from "mongoose";

const donationSchema = new mongoose.Schema({
  donationId: {
    type: String,
    unique: true,
    required: [true, "Donation ID is required"],
  },
  donor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Donor",
    required: [true, "Donor reference is required"],
  },
  patient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Patient",
    required: false,
  },
  hospital: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Hospital",
    required: false,
  },
  campaign: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Campaign",
    required: false,
  },
  packetNumber: {
    type: String,
    required: [true, "Packet Number is required"],
  },
  serialNumber: {
    type: String,
    required: [true, "Serial Number is required"],
  },
  amount: {
    type: Number,
    required: [true, "Amount is required"],
    min: [100, "Minimum amount is 100ml"],
    max: [500, "Maximum amount is 500ml"],
  },
  date: {
    type: Date,
    default: Date.now,
  },
  email: {
    type: String,
    required: false,
  },
  status: {
    type: String,
    enum: ["Pending", "Approved", "Rejected", "Used"],
    default: "Pending",
  },
});

export const Donation = mongoose.model("Donation", donationSchema);

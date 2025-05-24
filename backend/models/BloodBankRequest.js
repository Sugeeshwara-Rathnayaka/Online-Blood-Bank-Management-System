import mongoose from "mongoose";

const bloodBankRequestSchema = new mongoose.Schema({
  senderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "BloodBankHospital", // Reference to sender
    required: true,
  },
  receiverId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "BloodBankHospital", // Reference to receiver
    required: true,
  },
  bloodType: {
    type: String,
    enum: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
    required: true,
  },
  amount: {
    type: Number,
    required: true,
    min: 1,
  },
  date: {
    type: Date,
    required: true,
  },
  priority: {
    type: String,
    required: true,
    enum: ["High", "Normal"],
  },
});

export default mongoose.model(
  "BloodBankRequest",
  bloodBankRequestSchema,
  "blood_bank_request"
);

import mongoose from "mongoose";

const bloodSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
    enum: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
    uppercase: true,
    trim: true,
  },
  description: { type: String, required: true },
});

export default mongoose.model("Blood", bloodSchema, "blood_types");

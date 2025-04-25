import mongoose from "mongoose";

const transfusionSchema = new mongoose.Schema(
  {
    packetNumber: String,
    serialNumber: String,
    date: Date,
  },
  { _id: false }
);

const patientSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    NIC: {
      type: String,
      required: true,
      unique: true,
    },
    district: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "District",
      required: true,
    },
    transfusions: [transfusionSchema],
  },
  { timestamps: true }
);

export default mongoose.model("Patient", patientSchema);

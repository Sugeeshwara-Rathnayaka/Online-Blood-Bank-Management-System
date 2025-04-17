import mongoose from "mongoose";

const bloodSchema = new mongoose.Schema({
  BloodID: { type: Number, required: true, unique: true },
  Type: { type: String, required: true },
  Description: { type: String, required: true },
});

export default mongoose.model("Blood", bloodSchema);

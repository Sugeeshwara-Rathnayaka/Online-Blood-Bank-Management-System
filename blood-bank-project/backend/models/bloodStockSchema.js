import mongoose from "mongoose";

const bloodStockSchema = new mongoose.Schema(
  {
    stockId: {
      type: Number,
      required: true,
    },
    bloodId: {
      type: Number,
      required: true,
    },
    volume: {
      type: Number,
      default: 0,
    },
    volume2: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

export const BloodStock = mongoose.model(
  "BloodStock",
  bloodStockSchema,
  "blood_stock"
);

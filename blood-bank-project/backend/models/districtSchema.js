import mongoose from "mongoose";

const districtSchema = new mongoose.Schema(
  {
    id: {
      type: Number,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
      maxlength: 50,
    },
    Province: {
      type: String,
      required: true,
      maxlength: 100,
      enum: [
        "easet",
        "north central",
        "uwa",
        "western",
        "southern",
        "north",
        "central",
        "sabaragamuwa",
        "north western",
      ],
      lowercase: true,
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt fields
  }
);

// Create index for faster queries
districtSchema.index({ id: 1, Province: 1 });

export const District = mongoose.model("District", districtSchema);

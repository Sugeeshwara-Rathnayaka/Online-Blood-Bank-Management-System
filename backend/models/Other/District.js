import mongoose from "mongoose";

const districtSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      maxlength: 50,
    },
    province: {
      type: String,
      required: true,
      maxlength: 100,
      enum: [
        "central",
        "eastern",
        "northern",
        "north central",
        "north western",
        "sabaragamuwa",
        "southern",
        "uva",
        "western",
      ],
      lowercase: true,
    },
  },
  {
    timestamps: true,
  }
);

// Optional: Add index if you plan to search by name/province frequently
districtSchema.index({ name: 1, province: 1 });

export const District = mongoose.model("District", districtSchema);

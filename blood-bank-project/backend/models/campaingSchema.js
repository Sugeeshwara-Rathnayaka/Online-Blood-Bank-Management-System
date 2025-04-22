import mongoose from "mongoose";

const campaignSchema = new mongoose.Schema(
  {
    campaignId: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    location: { type: String, required: true },
    estimate: { type: Number, required: true },
    bhospitalId: { type: String, required: true },
    date: { type: Date, required: true },
    time: { type: String, required: true }, // or Date if combined with date
    organizationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Organization",
      required: true,
    },
    flag: { type: Number, enum: [0, 1, 2], default: 0 }, // 0: Pending, 1: Approved, 2: Rejected
    isdeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// Optional indexing
campaignSchema.index({ bhospitalId: 1 });
campaignSchema.index({ organizationId: 1 });
campaignSchema.index({ date: 1 });

export const Campaign = mongoose.model("Campaign", campaignSchema, "campaign");

import mongoose from "mongoose";
import validator from "validator";

const campaignSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Campaign name is required"],
      trim: true,
    },
    location: {
      type: String,
      required: [true, "Campaign location is required"],
      trim: true,
    },
    estimate: {
      type: Number,
      required: [true, "Estimate is required"],
      min: [1, "Estimate must be at least 1"],
    },
    bloodBankId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "BloodBankHospital",
      required: [true, "Associated blood bank is required"],
    },
    date: {
      type: Date,
      required: [true, "Campaign date is required"],
    },
    time: {
      type: String,
      required: [true, "Campaign time is required"],
      validate: {
        validator: (v) => /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(v),
        message: (props) => `${props.value} is not a valid time (HH:mm)`,
      },
    },
    organizationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Organization",
      required: [true, "Organization is required"],
    },
    flag: {
      type: Number,
      enum: [0, 1, 2],
      default: 0,
      description: "0: Pending, 1: Approved, 2: Rejected",
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// ✅ Indexes for efficient queries
campaignSchema.index({ bloodBankId: 1 });
campaignSchema.index({ organizationId: 1 });
campaignSchema.index({ date: 1 });

export const Campaign = mongoose.model("Campaign", campaignSchema, "campaign");

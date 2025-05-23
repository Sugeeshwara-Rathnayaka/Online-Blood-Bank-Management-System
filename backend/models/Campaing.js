import mongoose from "mongoose";

const campaignSchema = new mongoose.Schema(
  {
    campaignId: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    estimate: {
      type: Number,
      required: true,
    },
    bloodBankId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "BloodBankHospital", // optional: reference collection
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    time: {
      type: String,
      required: true,
      validate: {
        validator: function (v) {
          return /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(v);
        },
        message: (props) => `${props.value} is not a valid time format (HH:MM)`,
      },
    },
    organizationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Organization",
      required: true,
    },
    flag: {
      type: Number,
      enum: [0, 1, 2], // 0: Pending, 1: Approved, 2: Rejected
      default: 0,
    },
    isdeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// ✅ Correct indexing (based on actual field names)
campaignSchema.index({ bloodBankId: 1 });
campaignSchema.index({ organizationId: 1 });
campaignSchema.index({ date: 1 });

export const Campaign = mongoose.model("Campaign", campaignSchema, "campaign");

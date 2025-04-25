import mongoose from "mongoose";

const reservationSchema = new mongoose.Schema(
  {
    reservationId: { type: String, required: true, unique: true },
    hospitalId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "BloodBankHospital",
      required: true,
    },
    campaignId: { type: String, ref: "Campaign" },
    date: { type: Date, required: true },
    time: { type: String, required: true }, // or Date if combined with date
    donorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Donor",
      required: true,
    },
    flag: { type: Number, enum: [0, 1, 2], default: 0 }, // 0: Pending, 1: Approved, 2: Rejected
  },
  { timestamps: true }
);

export const Reservation = mongoose.model(
  "Reservation",
  reservationSchema,
  "donor_reservation"
);

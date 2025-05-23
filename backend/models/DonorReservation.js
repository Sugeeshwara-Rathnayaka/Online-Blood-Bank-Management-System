import mongoose from "mongoose";

const reservationSchema = new mongoose.Schema(
  {
    reservationId: { type: String, required: true, unique: true },
    bloodBankId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "BloodBankHospital",
      required: true,
    },
    date: { type: Date, required: true },
    time: {
      type: String,
      required: true,
      validate: {
        validator: function (v) {
          return /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(v);
        },
        message: (props) => `${props.value} is not a valid time format (HH:MM)`,
      },
    }, // or Date if combined with date
    donorNic: {
      type: String,
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

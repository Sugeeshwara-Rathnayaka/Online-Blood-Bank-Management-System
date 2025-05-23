import mongoose from "mongoose";

const bBHTelephoneSchema = new mongoose.Schema(
  {
    bloodBankId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "BloodBankHospital",
      required: true,
      index: true,
    },
    telephoneNo: {
      type: String,
      required: true,
      trim: true,
      validate: {
        validator: function (v) {
          return /^\d{10}$/.test(v);
        },
        message: (props) => `${props.value} is not a valid phone number!`,
      },
    },
    flag: {
      type: Number,
      enum: [0, 1], // 0 = Inactive, 1 = Active
      default: 1, // Active phone number
    },
  },
  { timestamps: true }
);
bBHTelephoneSchema.index({ bloodBankId: 1, telephoneNo: 1 }, { unique: true });

export const BloodBankHospitalTelephone = mongoose.model(
  "BloodBankHospitalTelephone",
  bBHTelephoneSchema,
  "blood_bank_hospital_telephone"
);

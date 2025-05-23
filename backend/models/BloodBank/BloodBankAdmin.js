import mongoose from "mongoose";
import validator from "validator";
import { generateJWT } from "../../utils/jwtMethods.js";

const bloodBankAdminSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      minLength: [3, "First Name Must Contain At Least 3 Characters!"],
    },
    lastName: {
      type: String,
      required: true,
      minLength: [3, "Name Must Contain At Least 3 Characters!"],
    },
    email: {
      type: String,
      required: true,
      unique: true,
      validate: [validator.isEmail, "Please Provide A Valid Email"],
    },
    nic: {
      type: String,
      required: true,
      unique: true,
      minLength: [12, "NIC Must Contain Exact 12 Digits!"],
      maxLength: [12, "NIC Must Contain Exact 12 Digits!"],
    },
    phone: {
      type: String,
      required: true,
      unique: true,
      validate: {
        validator: function (v) {
          return /^\d{10}$/.test(v);
        },
        message: (props) => `${props.value} is not a valid phone number!`,
      },
    },
    password: {
      type: String,
      required: true,
      minLength: [8, "Password Must Contain at Least 8 Characters!"],
      select: false,
    },
    bloodBankId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "BloodBankHospital",
      required: true,
    },
    role: {
      type: String,
      default: "BloodBankAdmin",
      enum: ["BloodBankAdmin"],
      required: true,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform: function (doc, ret) {
        delete ret.password; // Never return password in queries
        delete ret.__v;
        return ret;
      },
    },
  }
);

// Generate JWT token
bloodBankAdminSchema.methods.generateJsonWebToken = generateJWT;

export const BloodBankAdmin = mongoose.model(
  "BloodBankAdmin",
  bloodBankAdminSchema,
  "blood_bank_admin"
);

import mongoose from "mongoose";
import validator from "validator";
import { generateJWT } from "../utils/jwtMethods.js";

const reqSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      minLength: [3, "First Name Must Contain At Least 3 Characters!"],
    },
    lastName: {
      type: String,
      required: true,
      minLength: [3, "Last Name Must Contain At Least 3 Characters!"],
    },
    nic: {
      type: String,
      required: true,
      unique: true,
      minLength: [12, "NIC Must Contain Exact 12 Digits!"],
      maxLength: [12, "NIC Must Contain Exact 12 Digits!"],
    },
    district: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "District",
      required: true,
    },
    dob: {
      type: Date,
      required: [true, "DOB is required"],
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      validate: [validator.isEmail, "Please Provide A Valid Email"],
    },
    address: {
      type: String,
      required: true,
    },
    gender: {
      type: String,
      required: true,
      enum: ["Male", "Female"],
    },
    password: {
      type: String,
      required: true,
      minLength: [8, "Password Must Contain at Least 8 Characters!"],
      select: false,
    },
    phone: {
      type: String,
      required: true,
      validate: {
        validator: function (v) {
          return /^\d{10}$/.test(v);
        },
        message: (props) => `${props.value} is not a valid phone number!`,
      },
    },
    role: {
      type: String,
      default: "Requester", // Default role for requesters
      enum: ["Requester"], // Restrict to only "requester" role
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
); // Adds createdAt and updatedAt fields

// Generate JWT token
reqSchema.methods.generateJsonWebToken = generateJWT;

export const Requester = mongoose.model("Requester", reqSchema);

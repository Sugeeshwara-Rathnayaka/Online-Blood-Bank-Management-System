import mongoose from "mongoose";
import validator from "validator";
// import bcrypt from "bcrypt";
// import jwt from "jsonwebtoken";
import { generateJWT } from "../utils/jwtMethods.js";

const donorSchema = new mongoose.Schema(
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
      validate: {
        validator: (v) => /^\d{9}[VXvx]$|^\d{12}$/.test(v),
        message: "NIC must be 12 digits or 9 digits followed by V/X",
      },
    },
    dob: {
      type: Date,
      required: true,
      validate: {
        validator: function (value) {
          const age = calculateAge(value);
          return age >= 18 && age <= 65;
        },
        message: "Donor must be between 18 and 65 years old",
      },
    },
    district: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "District",
      required: true,
    },
    bloodGroup: {
      type: String,
      required: true,
      enum: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
    },
    email: {
      type: String,
      required: true,
      unique: true,
      validate: [validator.isEmail, "Please Provide A Valid Email"],
    },
    address: {
      type: String,
      required: true,
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
    role: {
      type: String,
      default: "Donor", // Automatically set for donor registrations
      enum: ["Donor"],
      required: true,
    },
    validation: {
      type: Number,
      default: 1,
      enum: [0, 1], // 0-verified, 1-Rejected
    },
    privacy: {
      type: Number,
      default: 0,
      enum: [0, 1], // 0 - show, 1 - don't show
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

function calculateAge(dob) {
  const today = new Date();
  const birthDate = new Date(dob);
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
}
// // Hash password before saving
// donorSchema.pre("save", async function (next) {
//   if (!this.isModified("password")) {
//     return next(); // Add "return" here so the hash isn't skipped without continuing
//   }
//   this.password = await bcrypt.hash(this.password, 10);
//   next(); // Important: Don't forget to call next after hashing
// });

// //Compare passwords
// donorSchema.methods.comparePassword = async function (enterdPassword) {
//   return await bcrypt.compare(enterdPassword, this.password);
// };

// Generate JWT token
donorSchema.methods.generateJsonWebToken = generateJWT;

export const Donor = mongoose.model("Donor", donorSchema);

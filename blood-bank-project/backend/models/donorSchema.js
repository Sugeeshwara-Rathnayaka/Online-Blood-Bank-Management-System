import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

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
      minLength: [12, "NIC Must Contain Exact 12 Digits!"],
      maxLength: [12, "NIC Must Contain Exact 12 Digits!"],
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
      validate: [validator.isEmail, "Please Provide A Valid Email"],
    },
    address: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
      minLength: [10, "Phone Number Must Contain Exact 10 Digits!"],
      maxLength: [10, "Phone Number Must Contain Exact 10 Digits!"],
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
      default: "Donor",
      enum: ["Donor"],
    },
  },
  { timestamps: true }
);
// Hash password before saving
donorSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next(); // Add "return" here so the hash isn't skipped without continuing
  }
  this.password = await bcrypt.hash(this.password, 10);
  next(); // Important: Don't forget to call next after hashing
});

//Compare passwords
donorSchema.methods.comparePassword = async function (enterdPassword) {
  return await bcrypt.compare(enterdPassword, this.password);
};

// Generate JWT token
donorSchema.methods.generateJsonWebToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

export const Donor = mongoose.model("Donor", donorSchema);

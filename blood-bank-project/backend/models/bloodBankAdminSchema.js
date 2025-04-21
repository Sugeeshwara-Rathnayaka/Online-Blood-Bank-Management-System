import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const bloodBankAdminSchema = new mongoose.Schema(
  {
    bAdminId: {
      type: Number,
      required: true,
      unique: true,
    },
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
    email: {
      type: String,
      required: true,
      validate: [validator.isEmail, "Please Provide A Valid Email"],
    },
    nic: {
      type: String,
      required: true,
      unique: true,
      minLength: [12, "NIC Must Contain Exact 12 Digits!"],
      maxLength: [12, "NIC Must Contain Exact 12 Digits!"],
    },
    password: {
      type: String,
      required: true,
      minLength: [8, "Password Must Contain at Least 8 Characters!"],
      select: false,
    },
    bloodBankId: {
      type: Number,
    },
    role: {
      type: String,
      default: "BloodBankAdmin",
      enum: ["BloodBankAdmin"],
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt fields
  }
);
// Hash password before saving
bloodBankAdminSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  this.password = await bcrypt.hash(this.password, 10);
  next();
});
// Compare passwords
bloodBankAdminSchema.methods.comparePassword = async function (enterdPassword) {
  return await bcrypt.compare(enterdPassword, this.password);
};
// Generate JWT token
bloodBankAdminSchema.methods.generateJsonWebToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

export const BloodBankAdmin = mongoose.model(
  "BloodBankAdmin",
  bloodBankAdminSchema,
  "blood_bank_admin"
);

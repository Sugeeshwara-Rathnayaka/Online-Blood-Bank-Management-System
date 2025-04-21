import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const organizationSchema = new mongoose.Schema(
  {
    organizationName: {
      type: String,
      required: true,
      minLength: [3, "Name Must Contain At Least 3 Characters!"],
    },
    district: {
      type: String,
      required: true,
    },
    presidentName: {
      type: String,
      required: true,
      minLength: [3, "Name Must Contain At Least 3 Characters!"],
    },
    email: {
      type: String,
      required: true,
      validate: [validator.isEmail, "Please Provide A Valid Email"],
    },
    userName: {
      type: String,
      required: true,
      unique: true,
      minLength: [3, "Name Must Contain At Least 3 Characters!"],
    },
    purpose: {
      type: String,
      required: false,
    },
    phone: {
      type: String,
      required: true,
      minLength: [10, "Phone Number Must Contain Exact 10 Digits!"],
      maxLength: [10, "Phone Number Must Contain Exact 10 Digits!"],
    },
    optionalPhone: {
      type: String,
      required: false,
      minLength: [10, "Phone Number Must Contain Exact 10 Digits!"],
      maxLength: [10, "Phone Number Must Contain Exact 10 Digits!"],
    },
    password: {
      type: String,
      required: true,
      minLength: [8, "Password Must Contain at Least 8 Characters!"],
      select: false,
    },
    role: {
      type: String,
      default: "Organization",
      enum: ["Organization"],
    },
  },
  { timestamps: true }
);
// Hash password before saving
organizationSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

//Compare passwords
organizationSchema.methods.comparePassword = async function (enterdPassword) {
  return await bcrypt.compare(enterdPassword, this.password);
};

// Generate JWT token
organizationSchema.methods.generateJsonWebToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

export const Organization = mongoose.model("Organization", organizationSchema);

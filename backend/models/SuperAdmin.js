import mongoose from "mongoose";
import validator from "validator";
import { generateJWT } from "../utils/jwtMethods.js";

const superAdminSchema = new mongoose.Schema(
  {
    userName: {
      type: String,
      required: true,
      unique: true,
      minLength: [3, "Name Must Contain At Least 3 Characters!"],
    },
    email: {
      type: String,
      required: true,
      unique: true,
      validate: [validator.isEmail, "Provide A Valid Email"],
    },
    password: {
      type: String,
      required: true,
      minLength: [8, "Password Must Contain at Least 8 Characters!"],
      select: false,
    },
    role: {
      type: String,
      default: "SuperAdmin",
      enum: ["SuperAdmin"],
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
superAdminSchema.methods.generateJsonWebToken = generateJWT;

export const SuperAdmin = mongoose.model("SuperAdmin", superAdminSchema);

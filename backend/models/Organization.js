import mongoose from "mongoose";
import validator from "validator";
import { generateJWT } from "../utils/jwtMethods.js";

const orgSchema = new mongoose.Schema(
  {
    organizationName: {
      type: String,
      required: true,
      minLength: [3, "Name Must Contain At Least 3 Characters!"],
    },
    userName: {
      type: String,
      required: true,
      unique: true,
      minLength: [3, "Name Must Contain At Least 3 Characters!"],
    },
    district: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "District",
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
    purpose: {
      type: String,
      required: false,
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
    optionalPhone: {
      type: String,
      required: true,
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
    role: {
      type: String,
      default: "Organization",
      enum: ["Organization"],
      required: true,
      immutable: true,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform: function (doc, ret) {
        delete ret.password;
        return ret;
      },
    },
  }
); // Adds createdAt and updatedAt fields
orgSchema.methods.generateJsonWebToken = generateJWT;
export const Organization = mongoose.model("Organization", orgSchema);

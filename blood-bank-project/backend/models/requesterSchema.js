import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const requesterSchema = new mongoose.Schema({
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
    type: String,
    required: true,
  },
  dob: {
    type: Date,
    required: [true, "DOB is required"],
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
    default: "Requester",
    enum: ["Requester"],
  },
});
// Hash password before saving
requesterSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

//Compare passwords
requesterSchema.methods.comparePassword = async function (enterdPassword) {
  return await bcrypt.compare(enterdPassword, this.password);
};

// Generate JWT token
requesterSchema.methods.generateJsonWebToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

export const Requester = mongoose.model("Requester", requesterSchema);

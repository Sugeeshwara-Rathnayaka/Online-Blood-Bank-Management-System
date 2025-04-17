import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const superAdminSchema = new mongoose.Schema({
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
  },
});
// Hash password before saving
superAdminSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  this.password = await bcrypt.hash(this.password, 10);
  next();
});
// Compare passwords
superAdminSchema.methods.comparePassword = async function (enterdPassword) {
  return await bcrypt.compare(enterdPassword, this.password);
};
// Generate JWT token
superAdminSchema.methods.generateJsonWebToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

export const SuperAdmin = mongoose.model("SuperAdmin", superAdminSchema);

import jwt from "jsonwebtoken";

export function generateJWT() {
  return jwt.sign({ id: this._id, role: this.role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
}

// // Generate JWT token
// donorSchema.methods.generateJsonWebToken = function () {
//   return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
//     expiresIn: process.env.JWT_EXPIRE,
//   });
// };

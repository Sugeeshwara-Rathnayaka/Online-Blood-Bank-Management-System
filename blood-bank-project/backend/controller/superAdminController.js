import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import ErrorHandler from "../middlewares/errorMiddleware.js";
import { SuperAdmin } from "../models/superAdminSchema.js";
import { generateToken } from "../utils/jwtToken.js";

// REGISTER
export const registerSuperAdmin = catchAsyncErrors(async (req, res, next) => {
  const { userName, email, password, confirmPassword } = req.body;
  if (!userName || !email || !password || !confirmPassword) {
    return next(new ErrorHandler("Provide All Details!", 400));
  }
  if (password !== confirmPassword) {
    return next(new ErrorHandler("Password Does Not Match!", 400));
  }
  const isRegistered = await SuperAdmin.findOne({ userName });
  if (isRegistered) {
    return next(
      new ErrorHandler("Super Admin with this User Name Already Exists!", 400)
    );
  }
  const superAdmin = await SuperAdmin.create({
    userName,
    email,
    password,
  });
  res.status(200).json({
    success: true,
    message: "Super Admin Registered!",
  });
});

//LOGIN
export const superAdminLogin = catchAsyncErrors(async (req, res, next) => {
  const { userName, password } = req.body;
  if (!userName || !password) {
    return next(new ErrorHandler("Please Provide All Details!", 400));
  }
  const superAdmin = await SuperAdmin.findOne({ userName }).select("+password");
  if (!superAdmin) {
    return next(new ErrorHandler("Invalid User Name or Password!", 400));
  }
  const isPasswordMatched = await superAdmin.comparePassword(password);
  if (!isPasswordMatched) {
    return next(new ErrorHandler("Invalid User Name or Password!", 400));
  }
  generateToken(superAdmin, "Super Admin Logged In!", 200, res);
});

//LOGOUT
export const logoutSuperAdmin = catchAsyncErrors(async (req, res, next) => {
  res
    .status(200)
    .cookie("superAdminToken", "", {
      httpOnly: true,
      expires: new Date(Date.now()),
    })
    .json({
      success: true,
      message: "Super Admin Logged Out!",
    });
});

export const getSuperAdminDetails = catchAsyncErrors(async (req, res, next) => {
  const superAdmin = req.superAdmin;
  res.status(200).json({
    success: true,
    superAdmin,
  });
});

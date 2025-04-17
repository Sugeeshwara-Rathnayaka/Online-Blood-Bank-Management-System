import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import ErrorHandler from "../middlewares/errorMiddleware.js";
import { Hospital } from "../models/hospitalSchema.js";
import { generateToken } from "../utils/jwtToken.js";

//SIGNUP
export const hospitalRegister = catchAsyncErrors(async (req, res, next) => {
  const {
    hospitalName,
    address,
    district,
    chiefDocName,
    userName,
    email,
    phone,
    optionalPhone,
    password,
    confirmPassword,
  } = req.body;
  if (
    !hospitalName ||
    !address ||
    !district ||
    !chiefDocName ||
    !userName ||
    !email ||
    !phone ||
    !optionalPhone ||
    !password ||
    !confirmPassword
  ) {
    return next(new ErrorHandler("Please Fill Full the Form!", 400));
  }
  if (password !== confirmPassword) {
    return next(new ErrorHandler("Passwords do not match!", 400));
  }
  let hospital = await Hospital.findOne({ userName });
  if (hospital) {
    return next(new ErrorHandler("Hospital Already Exist!", 400));
  }
  hospital = await Hospital.create({
    hospitalName,
    address,
    district,
    chiefDocName,
    userName,
    email,
    phone,
    optionalPhone,
    password,
  });
  generateToken(hospital, "Hospital Registered Successfully!", 200, res);
});

//LOGIN
export const hospitalLogin = catchAsyncErrors(async (req, res, next) => {
  const { userName, password } = req.body;
  if (!userName || !password) {
    return next(new ErrorHandler("Please Provide All Details!", 400));
  }
  const hospital = await Hospital.findOne({ userName }).select("+password");
  if (!hospital) {
    return next(new ErrorHandler("Invalid User Name or Password!", 400));
  }
  const isPasswordMatched = await hospital.comparePassword(password);
  if (!isPasswordMatched) {
    return next(new ErrorHandler("Invalid User Name or Password!", 400));
  }
  generateToken(hospital, "Hospital Logged In Successfully!", 200, res);
});

//UPDATE Hospital
export const updateHospital = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;
  let hospital = await Hospital.findById(id);
  if (!hospital) {
    return next(new ErrorHandler("Hospital Not Found!", 404));
  }
  // Update hospital fields from req.body
  hospital = await Hospital.findByIdAndUpdate(id, req.body, {
    new: true, // return the updated doc
    runValidators: true, // enforce schema rules
    useFindAndModify: false,
  });
  res.status(200).json({
    success: true,
    message: "Hospital Details Updated!",
    hospital,
  });
});

//DELETE Hospital
export const deleteHospital = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;
  const hospital = await Hospital.findById(id);
  if (!hospital) {
    return next(new ErrorHandler("Hospital Not Found!", 404));
  }
  await hospital.deleteOne();
  res.status(200).json({
    success: true,
    message: "Hospital Deleted Successfully!",
  });
});

export const getHospitalDetails = catchAsyncErrors(async (req, res, next) => {
  const hospital = req.hospital;
  res.status(200).json({
    success: true,
    hospital,
  });
});

//LOGUOT Hospital
export const logoutHospital = catchAsyncErrors(async (req, res, next) => {
  res
    .status(200)
    .cookie("hospitalToken", "", {
      httpOnly: true,
      expires: new Date(Date.now()),
    })
    .json({
      success: true,
      message: "Hospital Logged Out Successfully!",
    });
});

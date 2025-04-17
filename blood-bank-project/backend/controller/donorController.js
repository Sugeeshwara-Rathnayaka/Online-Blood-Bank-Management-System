import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import ErrorHandler from "../middlewares/errorMiddleware.js";
import { Donor } from "../models/donorSchema.js";
import { generateToken } from "../utils/jwtToken.js";

//SIGNUP
export const donorRegister = catchAsyncErrors(async (req, res, next) => {
  const {
    firstName,
    lastName,
    nic,
    district,
    bloodGroup,
    email,
    address,
    phone,
    gender,
    password,
    confirmPassword,
  } = req.body;
  if (
    !firstName ||
    !lastName ||
    !nic ||
    !district ||
    !bloodGroup ||
    !email ||
    !address ||
    !phone ||
    !gender ||
    !password ||
    !confirmPassword
  ) {
    return next(new ErrorHandler("Please Fill Full the Form!", 400));
  }
  if (password !== confirmPassword) {
    return next(new ErrorHandler("Passwords do not match!", 400));
  }
  let donor = await Donor.findOne({ nic });
  if (donor) {
    return next(new ErrorHandler("Donor Already Exist!", 400));
  }
  donor = await Donor.create({
    firstName,
    lastName,
    nic,
    district,
    bloodGroup,
    email,
    address,
    phone,
    gender,
    password,
  });
  generateToken(donor, "Donor Registered Successfully!", 200, res);
});

//LOGIN
export const donorLogin = catchAsyncErrors(async (req, res, next) => {
  const { nic, password } = req.body;
  if (!nic || !password) {
    return next(new ErrorHandler("Please Provide All Details!", 400));
  }
  const donor = await Donor.findOne({ nic }).select("+password");
  if (!donor) {
    return next(new ErrorHandler("Invalid Password or NIC!", 400));
  }
  const isPasswordMatched = await donor.comparePassword(password);
  if (!isPasswordMatched) {
    return next(new ErrorHandler("Invalid Password or NIC!", 400));
  }
  generateToken(donor, "Donor Logged In Successfully!", 200, res);
});

//UPDATE DONOR
export const updateDonor = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;
  let donor = await Donor.findById(id);
  if (!donor) {
    return next(new ErrorHandler("Donor Not Found!", 404));
  }
  // Update donor fields from req.body
  donor = await Donor.findByIdAndUpdate(id, req.body, {
    new: true, // return the updated doc
    runValidators: true, // enforce schema rules
    useFindAndModify: false,
  });
  res.status(200).json({
    success: true,
    message: "Donor Details Updated!",
    donor,
  });
});

//DELETE DONOR
export const deleteDonor = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;
  const donor = await Donor.findById(id);
  if (!donor) {
    return next(new ErrorHandler("Donor Not Found!", 404));
  }
  await donor.deleteOne();
  res.status(200).json({
    success: true,
    message: "Donor Deleted Successfully!",
  });
});

export const getDonorDetails = catchAsyncErrors(async (req, res, next) => {
  const donor = req.donor;
  res.status(200).json({
    success: true,
    donor,
  });
});

//LOGUOT DONOR
export const logoutDonor = catchAsyncErrors(async (req, res, next) => {
  res
    .status(200)
    .cookie("donorToken", "", {
      httpOnly: true,
      expires: new Date(Date.now()),
    })
    .json({
      success: true,
      message: "Donor Logged Out Successfully!",
    });
});

import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import ErrorHandler from "../middlewares/errorMiddleware.js";
import { Requester } from "../models/requesterSchema.js";
import { generateToken } from "../utils/jwtToken.js";

//SIGNUP
export const requesterRegister = catchAsyncErrors(async (req, res, next) => {
  const {
    firstName,
    lastName,
    nic,
    district,
    dob,
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
    !dob ||
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
  let requester = await Requester.findOne({ nic });
  if (requester) {
    return next(new ErrorHandler("Requester Already Exist!", 400));
  }
  requester = await Requester.create({
    firstName,
    lastName,
    nic,
    district,
    dob,
    email,
    address,
    phone,
    gender,
    password,
  });
  generateToken(requester, "Requester Registered Successfully!", 200, res);
});

//LOGIN
export const requesterLogin = catchAsyncErrors(async (req, res, next) => {
  const { nic, password } = req.body;
  if (!nic || !password) {
    return next(new ErrorHandler("Please Provide All Details!", 400));
  }
  const requester = await Requester.findOne({ nic }).select("+password");
  if (!requester) {
    return next(new ErrorHandler("Invalid Password or NIC!", 400));
  }
  const isPasswordMatched = await requester.comparePassword(password);
  if (!isPasswordMatched) {
    return next(new ErrorHandler("Invalid Password or NIC!", 400));
  }
  generateToken(requester, "Requester Logged In Successfully!", 200, res);
});

//UPDATE
export const updateRequester = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;
  let requester = await Requester.findById(id);
  if (!requester) {
    return next(new ErrorHandler("Requester Not Found!", 404));
  }
  // Update requester fields from req.body
  requester = await Requester.findByIdAndUpdate(id, req.body, {
    new: true, // return the updated doc
    runValidators: true, // enforce schema rules
    useFindAndModify: false,
  });
  res.status(200).json({
    success: true,
    message: "Requester Details Updated!",
    requester,
  });
});

//DELETE
export const deleteRequester = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;
  const requester = await Requester.findById(id);
  if (!requester) {
    return next(new ErrorHandler("Requester Not Found!", 404));
  }
  await requester.deleteOne();
  res.status(200).json({
    success: true,
    message: "Requester Deleted Successfully!",
  });
});

export const getRequesterDetails = catchAsyncErrors(async (req, res, next) => {
  const requester = req.requester;
  res.status(200).json({
    success: true,
    requester,
  });
});

//LOGUOT
export const logoutRequester = catchAsyncErrors(async (req, res, next) => {
  res
    .status(200)
    .cookie("requesterToken", "", {
      httpOnly: true,
      expires: new Date(Date.now()),
    })
    .json({
      success: true,
      message: "Requester Logged Out Successfully!",
    });
});

import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import ErrorHandler from "../middlewares/errorMiddleware.js";
import { Admin } from "../models/adminSchema.js";
import { generateToken } from "../utils/jwtToken.js";

export const addNewAdmin = catchAsyncErrors(async (req, res, next) => {
  const {
    firstName,
    lastName,
    email,
    phone,
    password,
    confirmPassword,
    gender,
    dob,
    nic,
  } = req.body;
  if (
    !firstName ||
    !lastName ||
    !email ||
    !phone ||
    !password ||
    !confirmPassword ||
    !gender ||
    !dob ||
    !nic
  ) {
    return next(new ErrorHandler("Please Fill Full the Form!", 400));
  }
  if (password !== confirmPassword) {
    return next(new ErrorHandler("Password Does Not Match!", 400));
  }
  const isRegistered = await Admin.findOne({ nic });
  if (isRegistered) {
    return next(new ErrorHandler("Admin with this NIC Already Exists!"));
  }
  const admin = await Admin.create({
    firstName,
    lastName,
    email,
    phone,
    password,
    gender,
    dob,
    nic,
  });
  res.status(200).json({
    success: true,
    message: "New Admin Registered!",
  });
});

//LOGIN
export const adminLogin = catchAsyncErrors(async (req, res, next) => {
  const { nic, password } = req.body;
  if (!nic || !password) {
    return next(new ErrorHandler("Please Provide All Details!", 400));
  }
  const admin = await Admin.findOne({ nic }).select("+password");
  if (!admin) {
    return next(new ErrorHandler("Invalid NIC or Password!", 400));
  }
  const isPasswordMatched = await admin.comparePassword(password);
  if (!isPasswordMatched) {
    return next(new ErrorHandler("Invalid NIC or Password!", 400));
  }
  generateToken(admin, "Admin Logged In Successfully!", 200, res, {
    id: admin._id,
    firstName: admin.firstName,
    email: admin.email,
  });
});

//LOGOUT
export const logoutAdmin = catchAsyncErrors(async (req, res, next) => {
  res
    .status(200)
    .cookie("adminToken", "", {
      httpOnly: true,
      expires: new Date(Date.now()),
    })
    .json({
      success: true,
      message: "Admin Logged Out Successfully!",
    });
});

//UPDATE
export const updateAdmin = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;
  let admin = await Admin.findById(id);
  if (!admin) {
    return next(new ErrorHandler("Admin Not Found!", 404));
  }
  // Update admin fields from req.body
  admin = await Admin.findByIdAndUpdate(id, req.body, {
    new: true, // return the updated doc
    runValidators: true, // enforce schema rules
    useFindAndModify: false,
  });
  res.status(200).json({
    success: true,
    message: "Admin Details Updated!",
    admin,
  });
});

//DELETE
export const deleteAdmin = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;
  const admin = await Admin.findById(id);
  if (!admin) {
    return next(new ErrorHandler("Admin Not Found!", 404));
  }
  await admin.deleteOne();
  res.status(200).json({
    success: true,
    message: "Admin Deleted Successfully!",
  });
});

// //GET DETAILS
// export const getAdminDetails = catchAsyncErrors(async (req, res, next) => {
//   const admin = req.admin;
//   res.status(200).json({
//     success: true,
//     admin,
//   });
// });

import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import ErrorHandler from "../middlewares/errorMiddleware.js";
import { BloodBankAdmin } from "../models/bloodBankAdminSchema.js";
import { generateToken } from "../utils/jwtToken.js";
import { BloodBankHospital } from "../models/bloodBankHospitalSchema.js";

export const addBBAdmin = catchAsyncErrors(async (req, res, next) => {
  const {
    bAdminId,
    firstName,
    lastName,
    email,
    password,
    confirmPassword,
    bloodBankId,
    nic,
  } = req.body;
  if (
    !bAdminId ||
    !firstName ||
    !lastName ||
    !email ||
    !password ||
    !confirmPassword ||
    !bloodBankId ||
    !nic
  ) {
    return next(new ErrorHandler("Please Fill Full the Form!", 400));
  }
  if (password !== confirmPassword) {
    return next(new ErrorHandler("Password Does Not Match!", 400));
  }
  // Optional: Check if the hospital exists (and not deleted)
  const hospitalExists = await BloodBankHospital.findOne({
    hospitalId: bloodBankId,
    isDeleted: false,
  });
  if (!hospitalExists) {
    return next(new ErrorHandler("Blood Bank Hospital not found.", 404));
  }
  // Check if NIC and ID already registered in the same admin
  const isRegistered = await BloodBankAdmin.findOne({ nic, bAdminId });
  if (isRegistered) {
    return next(
      new ErrorHandler("Blood Bank Admin with this NIC and ID Already Exists!")
    );
  }
  const bloodBankAdmin = await BloodBankAdmin.create({
    bAdminId,
    firstName,
    lastName,
    email,
    password,
    bloodBankId,
    nic,
  });
  res.status(200).json({
    success: true,
    message: "Blood Bank Admin Registered!",
    hospitalName: hospitalExists.name,
    bloodBankAdmin,
  });
});

//LOGIN
export const loginBBAdmin = catchAsyncErrors(async (req, res, next) => {
  const { nic, password } = req.body;
  if (!nic || !password) {
    return next(new ErrorHandler("Please Provide All Details!", 400));
  }
  const bloodBankAdmin = await BloodBankAdmin.findOne({ nic }).select(
    "+password"
  );
  if (!bloodBankAdmin) {
    return next(new ErrorHandler("Invalid NIC or Password!", 400));
  }
  const isPasswordMatched = await bloodBankAdmin.comparePassword(password);
  if (!isPasswordMatched) {
    return next(new ErrorHandler("Invalid NIC or Password!", 400));
  }
  generateToken(
    bloodBankAdmin,
    "Blood Bank Admin Logged In Successfully!",
    200,
    res,
    {
      id: bloodBankAdmin._id,
      firstName: bloodBankAdmin.firstName,
      email: bloodBankAdmin.email,
      role: bloodBankAdmin.role,
      bloodBankId: bloodBankAdmin.bloodBankId,
    }
  );
});

//LOGOUT
export const logoutBBAdmin = catchAsyncErrors(async (req, res, next) => {
  res
    .status(200)
    .cookie("bloodBankAdminToken", "", {
      httpOnly: true,
      expires: new Date(Date.now()),
    })
    .json({
      success: true,
      message: "Blood Bank Admin Logged Out Successfully!",
    });
});

//UPDATE
export const updateBBAdmin = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;
  let bloodBankAdmin = await BloodBankAdmin.findById(id);
  if (!bloodBankAdmin) {
    return next(new ErrorHandler("Blood Bank Admin Not Found!", 404));
  }
  // Prevent updating sensitive fields like password directly here if needed
  const disallowedFields = ["password", "nic", "bAdminId"];
  disallowedFields.forEach((field) => {
    if (req.body[field]) delete req.body[field];
  });
  // Update bbadmin fields from req.body
  bloodBankAdmin = await BloodBankAdmin.findByIdAndUpdate(id, req.body, {
    new: true, // return the updated doc
    runValidators: true, // enforce schema rules
    useFindAndModify: false,
  });
  res.status(200).json({
    success: true,
    message: "Blood Bank Admin Details Updated!",
    bloodBankAdmin,
  });
});

//DELETE
export const deleteBBAdmin = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;
  const bloodBankAdmin = await BloodBankAdmin.findById(id);
  if (!bloodBankAdmin) {
    return next(new ErrorHandler("Blood Bank Admin Not Found!", 404));
  }
  await bloodBankAdmin.deleteOne();
  res.status(200).json({
    success: true,
    message: "Blood Bank Admin Deleted Successfully!",
  });
});

//GET DETAILS
export const getBBAdminDetails = catchAsyncErrors(async (req, res, next) => {
  const bloodBankAdmin = req.bloodBankAdmin;
  //   if (!bloodBankAdmin) {
  //     return next(new ErrorHandler("Blood Bank Admin Not Found!", 404));
  //   }

  res.status(200).json({
    success: true,
    bloodBankAdmin,
  });
});
//GET ALL BB ADMINS
export const getAllBBAdmins = catchAsyncErrors(async (req, res, next) => {
  const bBAdmins = await BloodBankAdmin.find().select("-password");
  res.status(200).json({
    success: true,
    bBAdmins,
  });
});

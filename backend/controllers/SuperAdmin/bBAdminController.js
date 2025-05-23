import { catchAsyncErrors } from "../../middleware/catchAsyncErrors.js";
import ErrorHandler from "../../middleware/errorMiddleware.js";
import { BloodBankAdmin } from "../../models/BloodBank/BloodBankAdmin.js";
import { BloodBankHospital } from "../../models/BloodBank/BloodBankHospital.js";
import bcrypt from "bcryptjs";

// ✅ Add New Blood Bank Admin
export const addBBAdmin = catchAsyncErrors(async (req, res, next) => {
  const {
    firstName,
    lastName,
    email,
    password,
    confirmPassword,
    nic,
    phone,
    bloodBankName,
  } = req.body;
  if (
    !firstName ||
    !lastName ||
    !email ||
    !password ||
    !confirmPassword ||
    !nic ||
    !phone ||
    !bloodBankName
  ) {
    return next(new ErrorHandler("Please fill out all the fields.", 400));
  }
  if (password !== confirmPassword) {
    return next(new ErrorHandler("Password Does Not Match!", 400));
  }
  // Optional: Check if the hospital exists (and not deleted)
  const hospitalExists = await BloodBankHospital.findOne({
    name: bloodBankName,
    isDeleted: false,
  });
  if (!hospitalExists) {
    return next(new ErrorHandler("Blood Bank Hospital not found.", 404));
  }
  // Check if NIC and Email already registered in the same admin
  const isRegistered = await BloodBankAdmin.findOne({ nic, email });
  if (isRegistered) {
    return next(
      new ErrorHandler(
        "Blood Bank Admin with this NIC and Email Already Exists!"
      )
    );
  }
  // Hash the password (if not already done in schema pre-save)
  const hashedPassword = await bcrypt.hash(password, 12);

  const bloodBankAdmin = await BloodBankAdmin.create({
    firstName,
    lastName,
    email,
    password: hashedPassword,
    bloodBankId: hospitalExists._id,
    nic,
    phone,
  });
  res.status(200).json({
    success: true,
    message: "Blood Bank Admin Registered!",
    hospitalName: hospitalExists.name,
    bloodBankAdmin,
  });
});

// ✅ DELETE
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

// ✅ GET ALL BB ADMINS
export const getAllBBAdmins = catchAsyncErrors(async (req, res, next) => {
  const bBAdmins = await BloodBankAdmin.aggregate([
    {
      $lookup: {
        from: "blood_bank_hospital", // collection name for BloodBankHospital
        localField: "bloodBankId", // field in BloodBankAdmin referencing the BloodBank _id
        foreignField: "_id", // _id field in BloodBank collection
        as: "bloodBankInfo", // result array field
      },
    },
    {
      $addFields: {
        bloodBankName: {
          $ifNull: [{ $arrayElemAt: ["$bloodBankInfo.name", 0] }, "N/A"],
        },
      },
    },
    {
      $project: {
        password: 0,
        bloodBankInfo: 0, // hide full joined doc
        __v: 0,
      },
    },
  ]);

  res.status(200).json({
    success: true,
    bBAdmins,
  });
});

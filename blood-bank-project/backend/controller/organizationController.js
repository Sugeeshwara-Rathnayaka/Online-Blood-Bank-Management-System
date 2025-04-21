import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import ErrorHandler from "../middlewares/errorMiddleware.js";
import { Organization } from "../models/organizationSchema.js";
import { generateToken } from "../utils/jwtToken.js";

//SIGNUP
export const organizationRegister = catchAsyncErrors(async (req, res, next) => {
  const {
    organizationName,
    district,
    presidentName,
    email,
    userName,
    purpose,
    phone,
    optionalPhone,
    password,
    confirmPassword,
  } = req.body;
  if (
    !organizationName ||
    !district ||
    !presidentName ||
    !userName ||
    !email ||
    !phone ||
    !password ||
    !confirmPassword
  ) {
    return next(new ErrorHandler("Please Fill Full the Form!", 400));
  }
  if (password !== confirmPassword) {
    return next(new ErrorHandler("Passwords do not match!", 400));
  }
  let organization = await Organization.findOne({ userName });
  if (organization) {
    return next(new ErrorHandler("Organization Already Exist!", 400));
  }
  organization = await Organization.create({
    organizationName,
    district,
    presidentName,
    email,
    userName,
    purpose,
    phone,
    optionalPhone,
    password,
  });
  generateToken(
    organization,
    "Organization Registered Successfully!",
    200,
    res
  );
});

//LOGIN
export const organizationLogin = catchAsyncErrors(async (req, res, next) => {
  const { userName, password } = req.body;
  if (!userName || !password) {
    return next(new ErrorHandler("Please Provide All Details!", 400));
  }
  const organization = await Organization.findOne({ userName }).select(
    "+password"
  );
  if (!organization) {
    return next(new ErrorHandler("Invalid User Name or Password!", 400));
  }
  const isPasswordMatched = await organization.comparePassword(password);
  if (!isPasswordMatched) {
    return next(new ErrorHandler("Invalid User Name or Password!", 400));
  }
  generateToken(organization, "Organization Logged In Successfully!", 200, res);
});

//UPDATE Organization
export const updateOrganization = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;
  let organization = await Organization.findById(id);
  if (!organization) {
    return next(new ErrorHandler("Organization Not Found!", 404));
  }
  // Disallow direct password updates here
  if (req.body.password || req.body.role) {
    return next(new ErrorHandler("Password updates not allowed here!", 400));
  }
  // Update organization fields from req.body
  organization = await Organization.findByIdAndUpdate(id, req.body, {
    new: true, // return the updated doc
    runValidators: true, // enforce schema rules
    useFindAndModify: false,
  });
  res.status(200).json({
    success: true,
    message: "Organization Details Updated!",
    organization,
  });
});

//DELETE Organization
export const deleteOrganization = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;
  const organization = await Organization.findById(id);
  if (!organization) {
    return next(new ErrorHandler("Organization Not Found!", 404));
  }
  await organization.deleteOne();
  res.status(200).json({
    success: true,
    message: "Organization Deleted Successfully!",
  });
});

export const getOrganizationDetails = catchAsyncErrors(
  async (req, res, next) => {
    const organization = req.organization;
    res.status(200).json({
      success: true,
      organization,
    });
  }
);

// Get All Organizatios - Admin Only
export const getAllOrganizations = catchAsyncErrors(async (req, res, next) => {
  const organizations = await Organization.find().select("-password");
  res.status(200).json({
    success: true,
    organizations,
  });
});

// Get Organization By ID - Admin Only
export const getOrganizationById = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;
  const organization = await Organization.findById(id).select("-password");
  if (!organization) {
    return next(new ErrorHandler("Organization Not Found!", 404));
  }
  res.status(200).json({
    success: true,
    organization,
  });
});

//LOGUOT Organization
export const logoutOrganization = catchAsyncErrors(async (req, res, next) => {
  res
    .status(200)
    .cookie("organizationToken", "", {
      httpOnly: true,
      expires: new Date(Date.now()),
    })
    .json({
      success: true,
      message: "Organization Logged Out Successfully!",
    });
});

//Password Change...

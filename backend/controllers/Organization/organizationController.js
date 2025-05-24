import { Organization } from "../../models/Organization.js";
import { catchAsyncErrors } from "../../middleware/catchAsyncErrors.js";
import ErrorHandler from "../../middleware/errorMiddleware.js";
import { District } from "../../models/Other/District.js";

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
  // Convert district name to ID if name is passed
  if (req.body.district && typeof req.body.district === "string") {
    const districtDoc = await District.findOne({ name: req.body.district });
    if (!districtDoc) {
      return next(new ErrorHandler("Invalid district name provided", 400));
    }
    req.body.district = districtDoc._id;
  }
  // If district is sent, validate it as ObjectId
  // if (req.body.district) {
  //   const districtDoc = await District.findById(req.body.district);
  //   if (!districtDoc) {
  //     return next(new ErrorHandler("Invalid district ID provided", 400));
  //   }
  // }
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

// Get All Organizatios - Admin Only
export const getAllOrganizations = catchAsyncErrors(async (req, res, next) => {
  const organizations = await Organization.find().select("-password");
  res.status(200).json({
    success: true,
    organizations,
  });
});

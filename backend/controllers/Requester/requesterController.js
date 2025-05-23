import { catchAsyncErrors } from "../../middleware/catchAsyncErrors.js";
import ErrorHandler from "../../middleware/errorMiddleware.js";
import { Requester } from "../../models/Requester.js";
import { District } from "../../models/Other/District.js";

//UPDATE
export const updateRequester = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;
  let requester = await Requester.findById(id);
  if (!requester) {
    return next(new ErrorHandler("Requester Not Found!", 404));
  }
  if (req.body.password || req.body.role) {
    return next(
      new ErrorHandler("Password or Role cannot be updated here!", 400)
    );
  }
  // // 🧠 Convert district name to ID if name is passed
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

// Get All Organizatios - Admin Only
export const getAllRequesters = catchAsyncErrors(async (req, res, next) => {
  const requesters = await Requester.find().select("-password");
  res.status(200).json({
    success: true,
    requesters,
  });
});

// Get Requester By ID - Admin Only
export const getRequesterById = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;
  const requester = await Requester.findById(id).select("-password");
  if (!requester) {
    return next(new ErrorHandler("Requester Not Found!", 404));
  }
  res.status(200).json({
    success: true,
    requester,
  });
});

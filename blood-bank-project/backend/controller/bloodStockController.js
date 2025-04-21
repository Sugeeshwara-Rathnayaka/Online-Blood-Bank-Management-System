import { BloodStock } from "../models/bloodStockSchema.js";
import Blood from "../models/bloodSchema.js";
import ErrorHandler from "../middlewares/errorMiddleware.js";
import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import mongoose from "mongoose";

// ✅ Add Blood Stock
export const createBloodStock = catchAsyncErrors(async (req, res, next) => {
  const { stockId, bloodId, volume, volume2 } = req.body;

  if (!stockId || !bloodId) {
    return next(new ErrorHandler("StockID and BloodID are required", 400));
  }

  // Check if the blood type exists
  const bloodID = await Blood.findOne({ BloodID: bloodId });
  if (!bloodID) {
    return next(new ErrorHandler("Blood Type not found.", 404));
  }

  // Check if the stockId and bloodId already exists
  const exists = await BloodStock.findOne({ stockId, bloodId });
  if (exists) {
    return next(new ErrorHandler("This blood stock entry already exists", 400));
  }
  // Create new blood stock entry
  const newStock = await BloodStock.create({
    stockId,
    bloodId: bloodId,
    volume,
    volume2,
  });

  res.status(201).json({
    success: true,
    message: "Blood stock created successfully",
    bloodType: bloodID.Type,
    stock: newStock,
  });
});

// ✅ Get all blood stock
export const getAllBloodStock = catchAsyncErrors(async (req, res, next) => {
  const stocks = await BloodStock.find();
  res.status(200).json({
    success: true,
    count: stocks.length,
    stocks,
  });
});

// ✅ Get blood stock by stockId
export const getStockByStockId = catchAsyncErrors(async (req, res, next) => {
  const { stockId } = req.params;

  const stocks = await BloodStock.find({ stockId: stockId });
  if (stocks.length === 0) {
    return next(new ErrorHandler("No stock found for this ID", 404));
  }

  res.status(200).json({
    success: true,
    stocks,
  });
});

// ✅ Update blood stock entry
export const updateBloodStock = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;
  const { volume, volume2 } = req.body;

  const stock = await BloodStock.findById(id);
  if (!stock) {
    return next(new ErrorHandler("Stock record not found", 404));
  }

  if (volume !== undefined) stock.volume = volume;
  if (volume2 !== undefined) stock.volume2 = volume2;

  await stock.save();

  res.status(200).json({
    success: true,
    message: "Blood stock updated successfully",
    stock,
  });
});

// ✅ Delete blood stock entry
export const deleteBloodStock = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;

  // Check if the ID is a valid MongoDB ObjectId
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return next(new ErrorHandler("Invalid bloodStock ID format", 400));
  }

  const stock = await BloodStock.findById(id);
  if (!stock) {
    return next(new ErrorHandler("Stock record not found", 404));
  }

  await stock.deleteOne();

  res.status(200).json({
    success: true,
    message: "Blood stock deleted successfully",
  });
});

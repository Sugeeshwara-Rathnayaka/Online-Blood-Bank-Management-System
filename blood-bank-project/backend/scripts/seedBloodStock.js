import mongoose from "mongoose";
import dotenv from "dotenv";
import { dbConnection } from "../database/dbConnection.js";
import { BloodStock } from "../models/bloodStockSchema.js";

dotenv.config({ path: "./config/config.env" });

const seedBloodStock = async () => {
  try {
    await dbConnection();

    await BloodStock.deleteMany({});
    console.log("Old blood stock records deleted");

    const stockData = [
      { stockId: 10, bloodId: 1, volume: 0, volume2: 2 },
      { stockId: 10, bloodId: 2, volume: 2, volume2: 4 },
      { stockId: 10, bloodId: 3, volume: 2, volume2: 3 },
      { stockId: 10, bloodId: 4, volume: 7, volume2: 4 },
      { stockId: 10, bloodId: 5, volume: 1, volume2: 1 },
      { stockId: 10, bloodId: 6, volume: 1, volume2: 1 },
      { stockId: 10, bloodId: 7, volume: 1, volume2: 2 },
      { stockId: 10, bloodId: 8, volume: 0, volume2: 0 },
      { stockId: 11, bloodId: 1, volume: 100, volume2: 0 },
      { stockId: 11, bloodId: 2, volume: 450, volume2: 0 },
      { stockId: 11, bloodId: 3, volume: 700, volume2: 0 },
      { stockId: 11, bloodId: 4, volume: 100, volume2: 0 },
      { stockId: 11, bloodId: 5, volume: 100, volume2: 0 },
      { stockId: 11, bloodId: 6, volume: 450, volume2: 0 },
      { stockId: 11, bloodId: 7, volume: 1000, volume2: 0 },
      { stockId: 11, bloodId: 8, volume: 800, volume2: 0 },
      { stockId: 12, bloodId: 1, volume: 0, volume2: 0 },
      { stockId: 12, bloodId: 2, volume: 0, volume2: 0 },
      { stockId: 12, bloodId: 3, volume: 0, volume2: 0 },
      { stockId: 12, bloodId: 4, volume: 0, volume2: 0 },
      { stockId: 12, bloodId: 5, volume: 0, volume2: 0 },
      { stockId: 12, bloodId: 6, volume: 0, volume2: 0 },
      { stockId: 12, bloodId: 7, volume: 0, volume2: 0 },
      { stockId: 12, bloodId: 8, volume: 0, volume2: 0 },
      // ... continue inserting the rest of your values (can be automated from SQL)
    ];

    await BloodStock.insertMany(stockData);
    console.log("Blood stock seeded successfully!");

    await mongoose.disconnect();
  } catch (err) {
    console.error("Seeding failed:", err);
    await mongoose.disconnect();
    process.exit(1);
  }
};

seedBloodStock();

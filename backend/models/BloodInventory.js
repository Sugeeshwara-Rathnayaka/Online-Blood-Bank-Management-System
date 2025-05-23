const bloodInventorySchema = new mongoose.Schema({
  bloodBank: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "BloodBank",
    required: true,
  },
  bloodGroup: {
    type: String,
    required: true,
    enum: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
  },
  bloodType: {
    type: String,
    enum: ["whole_blood", "platelets", "plasma", "red_cells", "cryo"],
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: 0,
  },
  units: {
    type: String,
    default: "ml",
  },
  collectionDate: {
    type: Date,
    required: true,
  },
  expiryDate: {
    type: Date,
    required: true,
  },
  donor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  donationEvent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "DonationEvent",
  },
  status: {
    type: String,
    enum: ["available", "reserved", "transfused", "discarded"],
    default: "available",
  },
  tested: {
    type: Boolean,
    default: false,
  },
  testResults: {
    hiv: Boolean,
    hepatitisB: Boolean,
    hepatitisC: Boolean,
    syphilis: Boolean,
    otherTests: mongoose.Schema.Types.Mixed,
  },
  lastUpdatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: Date,
});

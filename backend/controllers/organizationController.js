import Organization from "../models/Organization.js";
import Donation from "../models/Donation.js";
import Campaign from "../models/Campaign.js";
import { handleError } from "../utils/handleError.js";

// Dashboard Statistics
export const getDashboardStats = async (req, res) => {
  try {
    const organizationId = req.user.organizationId;

    // Get counts in parallel
    const [totalDonors, activeCampaigns, bloodInventory, pendingRequests] =
      await Promise.all([
        Donation.countDocuments({ organizationId }),
        Campaign.countDocuments({
          organizationId,
          endDate: { $gte: new Date() },
        }),
        Donation.aggregate([
          { $match: { organizationId } },
          { $group: { _id: null, total: { $sum: "$quantity" } } },
        ]),
        Donation.countDocuments({ organizationId, status: "pending" }),
      ]);

    res.json({
      success: true,
      data: {
        totalDonors,
        activeCampaigns,
        bloodInventory: bloodInventory[0]?.total || 0,
        pendingRequests,
        monthlyDonations: await getMonthlyDonations(organizationId),
        recentActivities: await getRecentActivities(organizationId),
      },
    });
  } catch (error) {
    handleError(res, error, "Failed to get dashboard stats");
  }
};

// Recent Donations
export const getRecentDonations = async (req, res) => {
  try {
    const donations = await Donation.find({
      organizationId: req.user.organizationId,
    })
      .sort({ donationDate: -1 })
      .limit(5)
      .populate("donor", "name bloodType");

    res.json({
      success: true,
      data: donations.map((d) => ({
        id: d._id,
        donor: d.donor.name,
        bloodType: d.donor.bloodType,
        date: d.donationDate.toISOString().split("T")[0],
        status: d.status,
      })),
    });
  } catch (error) {
    handleError(res, error, "Failed to get recent donations");
  }
};

// Blood Inventory
export const getBloodInventory = async (req, res) => {
  try {
    const inventory = await Donation.aggregate([
      {
        $match: {
          organizationId: req.user.organizationId,
          status: "completed",
        },
      },
      {
        $group: {
          _id: "$bloodType",
          count: { $sum: 1 },
          totalQuantity: { $sum: "$quantity" },
        },
      },
      { $project: { _id: 0, bloodType: "$_id", count: 1, totalQuantity: 1 } },
    ]);

    // Format for PieChart
    const result = {};
    inventory.forEach((item) => {
      result[item.bloodType] = item.totalQuantity;
    });

    res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    handleError(res, error, "Failed to get blood inventory");
  }
};

// Create Campaign
export const createCampaign = async (req, res) => {
  try {
    const campaign = new Campaign({
      ...req.body,
      organizationId: req.user.organizationId,
      createdBy: req.user.id,
    });

    await campaign.save();

    res.status(201).json({
      success: true,
      message: "Campaign created successfully",
      data: campaign,
    });
  } catch (error) {
    handleError(res, error, "Failed to create campaign");
  }
};

// Helper Functions
async function getMonthlyDonations(organizationId) {
  // Implement logic to get donations by month
  // This is a simplified version - you might want to use MongoDB aggregation
  return [12, 19, 15, 21, 18, 25, 22]; // Mock data
}

async function getRecentActivities(organizationId) {
  // Get recent activities from multiple collections
  const activities = await Promise.all([
    Donation.find({ organizationId })
      .sort({ createdAt: -1 })
      .limit(3)
      .populate("donor", "name"),
    Campaign.find({ organizationId }).sort({ createdAt: -1 }).limit(2),
  ]);

  // Format activities
  return [
    ...activities[0].map((d) => ({
      id: d._id,
      action: `New donation from ${d.donor.name}`,
      time: formatTimeAgo(d.createdAt),
      icon: "donation",
    })),
    ...activities[1].map((c) => ({
      id: c._id,
      action: `Campaign "${c.name}" created`,
      time: formatTimeAgo(c.createdAt),
      icon: "campaign",
    })),
  ];
}

function formatTimeAgo(date) {
  // Implement your time ago formatting
  return "2 days ago"; // Simplified
}

import axios from "axios";

const API_BASE_URL = "https://localhost:5000/api";

// Set up axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add request interceptor for auth tokens
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("authToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const organizationService = {
  async getDashboardStats() {
    try {
      const response = await api.get("/organization/dashboard/stats");
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || "Failed to fetch stats");
    }
  },

  async getRecentDonations() {
    try {
      const response = await api.get("/organization/donations/recent");
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Failed to fetch donations"
      );
    }
  },

  async getBloodInventory() {
    try {
      const response = await api.get("/organization/blood-inventory");
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Failed to fetch blood inventory"
      );
    }
  },

  async createCampaign(campaignData) {
    try {
      const response = await api.post("/organization/campaigns", campaignData);
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Failed to create campaign"
      );
    }
  },

  async generateReport(type) {
    try {
      const response = await api.get(`/organization/reports/${type}`);
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Failed to generate report"
      );
    }
  },

  // Add more API calls as needed
};

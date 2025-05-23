import { useState, useEffect } from "react";
import {
  Flex,
  Heading,
  Button,
  SimpleGrid,
  Grid,
  GridItem,
  Card,
  CardBody,
  Skeleton,
  useToast,
  useDisclosure,
} from "@chakra-ui/react";
import {
  FiUsers,
  FiDroplet,
  FiCalendar,
  FiClock,
  FiAlertCircle,
  FiPlus,
  FiFileText,
} from "react-icons/fi";
import { StatsCard } from "../components/StatsCard";
import { BarChart } from "../charts/BarChart";
import { PieChart } from "../charts/PieChart";
import { DataTable } from "../components/DataTable";
import { RecentActivity } from "../components/RecentActivity";
import { organizationService } from "../api/organizationService";
import NewCampaignModal from "../components/NewCampaignModal";
import ReportGenerator from "../components/ReportGenerator";

export default function OrganizationDashboard() {
  const [stats, setStats] = useState(null);
  const [recentDonations, setRecentDonations] = useState([]);
  const [bloodInventory, setBloodInventory] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const toast = useToast();
  const {
    isOpen: isCampaignModalOpen,
    onOpen: onCampaignModalOpen,
    onClose: onCampaignModalClose,
  } = useDisclosure();
  const {
    isOpen: isReportModalOpen,
    onOpen: onReportModalOpen,
    onClose: onReportModalClose,
  } = useDisclosure();

  useEffect(() => {
    const fetchDashboardData = async () => {
      setIsLoading(true);
      try {
        const [statsData, donationsData, inventoryData] = await Promise.all([
          organizationService.getDashboardStats(),
          organizationService.getRecentDonations(),
          organizationService.getBloodInventory(),
        ]);

        setStats(statsData);
        setRecentDonations(donationsData);
        setBloodInventory(inventoryData);
      } catch (error) {
        toast({
          title: "Error loading dashboard data",
          description: error.message,
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "top-right",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();

    // Set up refresh interval (every 5 minutes)
    const interval = setInterval(fetchDashboardData, 300000);
    return () => clearInterval(interval);
  }, [toast]);

  const handleCampaignCreated = (newCampaign) => {
    setStats((prev) => ({
      ...prev,
      activeCampaigns: prev.activeCampaigns + 1,
    }));
    toast({
      title: "Campaign created",
      description: `${newCampaign.name} has been successfully created.`,
      status: "success",
    });
  };

  const handleReportGenerated = (report) => {
    toast({
      title: "Report generated",
      description: `${report.type} report is ready for download.`,
      status: "success",
    });
  };

  return (
    <Flex direction="column" p={6} gap={6}>
      <Flex justify="space-between" align="center">
        <Heading size="xl">Organization Dashboard</Heading>
        <Flex gap={3}>
          <Button
            colorScheme="blue"
            leftIcon={<FiPlus />}
            onClick={onCampaignModalOpen}
          >
            New Campaign
          </Button>
          <Button
            variant="outline"
            leftIcon={<FiFileText />}
            onClick={onReportModalOpen}
          >
            Generate Report
          </Button>
        </Flex>
      </Flex>

      {/* Stats Cards */}
      <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} gap={5}>
        {isLoading ? (
          [...Array(4)].map((_, i) => (
            <Skeleton key={i} height="120px" borderRadius="lg" />
          ))
        ) : (
          <>
            <StatsCard
              icon={FiUsers}
              title="Total Donors"
              value={stats?.totalDonors || 0}
              trend="+12% this month"
              color="blue"
            />
            <StatsCard
              icon={FiDroplet}
              title="Blood Inventory"
              value={stats?.bloodInventory || 0}
              unit="units"
              trend="+5% this week"
              color="green"
            />
            <StatsCard
              icon={FiCalendar}
              title="Active Campaigns"
              value={stats?.activeCampaigns || 0}
              trend="2 ending soon"
              color="purple"
            />
            <StatsCard
              icon={FiAlertCircle}
              title="Pending Requests"
              value={stats?.pendingRequests || 0}
              trend="Urgent: 3"
              color="orange"
            />
          </>
        )}
      </SimpleGrid>

      {/* Charts Section */}
      <Grid templateColumns={{ base: "1fr", lg: "2fr 1fr" }} gap={6}>
        <GridItem>
          <Card>
            <CardBody>
              <Heading size="md" mb={4}>
                Monthly Donations
              </Heading>
              <BarChart
                data={stats?.monthlyDonations || Array(7).fill(0)}
                labels={["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"]}
              />
            </CardBody>
          </Card>
        </GridItem>
        <GridItem>
          <Card>
            <CardBody>
              <Heading size="md" mb={4}>
                Blood Type Distribution
              </Heading>
              <PieChart
                data={Object.values(bloodInventory)}
                labels={Object.keys(bloodInventory)}
                colors={[
                  "#6366f1",
                  "#8b5cf6",
                  "#a78bfa",
                  "#c4b5fd",
                  "#ddd6fe",
                  "#ec4899",
                  "#f43f5e",
                  "#fb7185",
                ]}
              />
            </CardBody>
          </Card>
        </GridItem>
      </Grid>

      {/* Data Section */}
      <Grid templateColumns={{ base: "1fr", lg: "2fr 1fr" }} gap={6}>
        <GridItem>
          <Card>
            <CardBody>
              <Heading size="md" mb={4}>
                Recent Donations
              </Heading>
              <DataTable
                columns={[
                  { header: "Donor", accessor: "donor" },
                  { header: "Blood Type", accessor: "bloodType" },
                  { header: "Date", accessor: "date" },
                  { header: "Status", accessor: "status" },
                ]}
                data={recentDonations}
                isLoading={isLoading}
              />
            </CardBody>
          </Card>
        </GridItem>
        <GridItem>
          <Card>
            <CardBody>
              <Heading size="md" mb={4}>
                Recent Activity
              </Heading>
              <RecentActivity
                items={stats?.recentActivities || []}
                isLoading={isLoading}
              />
            </CardBody>
          </Card>
        </GridItem>
      </Grid>

      {/* Modals */}
      <NewCampaignModal
        isOpen={isCampaignModalOpen}
        onClose={onCampaignModalClose}
        onSuccess={handleCampaignCreated}
      />
      <ReportGenerator
        isOpen={isReportModalOpen}
        onClose={onReportModalClose}
        onGenerate={handleReportGenerated}
      />
    </Flex>
  );
}

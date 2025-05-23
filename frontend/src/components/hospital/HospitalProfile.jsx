import {
  Box,
  Flex,
  Text,
  Heading,
  Stack,
  Avatar,
  useColorModeValue,
  Divider,
  Input,
  Button,
  useToast,
  useDisclosure,
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialogFooter,
  Spinner,
  Switch,
  FormControl,
  FormLabel,
  Card,
  CardHeader,
  CardBody,
  SimpleGrid,
  Icon,
  Tag,
  TagLabel,
  TagLeftIcon,
  Center,
  Alert,
  AlertIcon,
  Tooltip,
} from "@chakra-ui/react";
import { useEffect, useState, useRef } from "react";
import {
  FiEdit,
  FiTrash2,
  FiUser,
  FiMail,
  FiPhone,
  FiCalendar,
  FiDroplet,
  FiMapPin,
  FiLock,
  FiCheckCircle,
  FiXCircle,
  FiMap,
  FiAlertTriangle,
} from "react-icons/fi";
import api from "../../api/api";
import DistrictSelect from "../select/DistrictSelect";

const HospitalProfile = () => {
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({});
  const [error, setError] = useState(null);
  const [editing, setEditing] = useState(false);
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = useRef();

  const cardBg = useColorModeValue("white", "gray.800");
  const textColor = useColorModeValue("gray.800", "whiteAlpha.900");
  const labelColor = useColorModeValue("gray.600", "gray.400");
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const bgColor = useColorModeValue("gray.50", "gray.700");

  const accentColor = "red.500";

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await api.get("/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUser(res.data.user);
      setFormData(res.data.user);
    } catch (err) {
      setError("Failed to load profile");
      console.error(err);
    }
  };
  useEffect(() => {
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    try {
      if (!user?._id) {
        toast({
          title: "User ID not found.",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
        return;
      }

      const filteredData = {
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        district: formData.district,
      };

      const res = await api.put(`/hos/update/${user._id}`, filteredData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      setUser(res.data.donor);
      await fetchProfile();
      setEditing(false);
      toast({
        title: "Profile updated successfully!",
        status: "success",
        duration: 3000,
        isClosable: true,
        position: "top",
      });
    } catch (err) {
      toast({
        title: "Update failed",
        description: err.response?.data?.message || "Something went wrong",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "top",
      });
    }
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/hos/delete/${user._id}`);

      toast({
        title: "Account deleted successfully!",
        description: "You have been logged out.",
        status: "success",
        duration: 3000,
        isClosable: true,
        position: "top",
      });

      localStorage.removeItem("token");

      // Delay redirect slightly to allow toast to show
      setTimeout(() => {
        window.location.href = "/";
      }, 1500);
    } catch (err) {
      console.log(err);
      toast({
        title: "Delete failed",
        status: "error",
        isClosable: true,
        position: "top",
      });
    }
  };

  const handleStatusToggle = async () => {
    try {
      const newStatus = user.status === "Active" ? "Inactive" : "Active";
      await api.patch(
        `/hos/status`,
        { status: newStatus },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setUser((prev) => ({ ...prev, status: newStatus }));
      toast({
        title: `Status updated to ${newStatus}`,
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (err) {
      console.error("Status update failed", err);
      toast({
        title: "Status update failed",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  if (error) {
    return (
      <Center minH="50vh">
        <Alert status="error" borderRadius="md" maxW="500px">
          <AlertIcon />
          <Text>{error}</Text>
        </Alert>
      </Center>
    );
  }

  if (!user && !error) {
    return (
      <Center minH="50vh">
        <Stack align="center" spacing={4}>
          <Spinner size="xl" color={accentColor} thickness="3px" />
          <Text fontSize="lg" fontWeight="medium">
            Loading your profile...
          </Text>
        </Stack>
      </Center>
    );
  }

  const InfoSection = ({ title, icon, children }) => (
    <Card variant="outline" borderColor={borderColor} flex={1}>
      <CardHeader pb={2}>
        <Flex align="center">
          <Icon as={icon} color={accentColor} mr={2} />
          <Heading size="md">{title}</Heading>
        </Flex>
      </CardHeader>
      <Divider borderColor={borderColor} />
      <CardBody>
        <SimpleGrid spacing={4}>{children}</SimpleGrid>
      </CardBody>
    </Card>
  );

  const InfoField = ({
    label,
    value,
    icon,
    name,
    type = "text",
    editable,
    customInput,
    onChange,
    isRequired,
    ...props
  }) => {
    const labelColor = useColorModeValue("gray.500", "gray.400");
    const valueColor = useColorModeValue("gray.800", "white");
    const bgColor = useColorModeValue("gray.50", "gray.700");

    return (
      <Box>
        <FormLabel color={labelColor} fontSize="sm" mb={1}>
          <Flex align="center">
            {icon && <Icon as={icon} mr={2} color={labelColor} />}
            {label}
            {isRequired && (
              <Text as="span" color="red.500" ml={1}>
                *
              </Text>
            )}
          </Flex>
        </FormLabel>
        {editable ? (
          customInput ? (
            customInput
          ) : (
            <Input
              type={type}
              name={name}
              value={value || ""}
              onChange={onChange}
              focusBorderColor="red.500"
              isRequired={isRequired}
              bg="white" // Better contrast for editable fields
              {...props}
            />
          )
        ) : (
          <Text
            fontSize="md"
            fontWeight="medium"
            color={value ? valueColor : "gray.500"} // Different color for empty values
            p={2}
            borderRadius="md"
            bg={bgColor}
            minH="40px" // Consistent height
            display="flex"
            alignItems="center"
          >
            {value || "Not provided"}
          </Text>
        )}
      </Box>
    );
  };

  return (
    <Box maxW="1200px" mx="auto" p={{ base: 4, md: 6 }}>
      <Flex direction={{ base: "column", md: "row" }} gap={6} align="stretch">
        {/* Profile Card */}
        <Card
          w={{ base: "full", md: "300px" }}
          bg={cardBg}
          border="1px"
          borderColor={borderColor}
          align="center"
          p={6}
          position="relative"
        >
          <Avatar
            name={`${user.hospitalName}`}
            size="2xl"
            mb={4}
            bg={accentColor}
            color="white"
          />

          <Heading size="lg" textAlign="center" color={textColor} noOfLines={2}>
            {user.hospitalName}
          </Heading>

          <Text color={labelColor} fontSize="sm" mb={2}>
            {user.role}
          </Text>

          <Tag
            cursor="pointer"
            onClick={handleStatusToggle}
            colorScheme={
              user.status === "Active"
                ? "green"
                : user.status === "Inactive"
                ? "yellow"
                : "red"
            }
            size="lg"
            mt={3}
            mb={2}
            borderRadius="full"
          >
            <TagLeftIcon
              as={
                user.status === "Active"
                  ? FiCheckCircle
                  : user.status === "Inactive"
                  ? FiXCircle
                  : FiAlertTriangle
              }
            />
            <TagLabel>{user.status}</TagLabel>
          </Tag>

          <Divider my={4} borderColor={borderColor} />

          <Text fontSize="sm" color={labelColor} mb={1} textAlign="center">
            <Icon as={FiCalendar} mr={2} />
            Member Since {new Date(user.createdAt).toLocaleDateString()}
          </Text>

          <Stack mt={6} w="full" spacing={3}>
            {!editing ? (
              <Button
                leftIcon={<FiEdit />}
                onClick={() => setEditing(true)}
                colorScheme="red"
                variant="outline"
              >
                Edit Profile
              </Button>
            ) : (
              <>
                <Button
                  onClick={handleSave}
                  colorScheme="red"
                  isLoading={false}
                  loadingText="Saving..."
                >
                  Save Changes
                </Button>
                <Button
                  onClick={() => setEditing(false)}
                  variant="outline"
                  colorScheme="gray"
                >
                  Cancel
                </Button>
              </>
            )}
            <Tooltip
              label="Verified donors cannot delete their profile"
              isDisabled={user.validation !== 0}
              hasArrow
              placement="bottom"
            >
              <Button
                leftIcon={<FiTrash2 />}
                onClick={onOpen}
                colorScheme="red"
                variant="ghost"
                isDisabled={user.validation === 0}
              >
                Delete Account
              </Button>
            </Tooltip>
          </Stack>
        </Card>
        {/* Profile Details */}

        <InfoSection title="Informations" icon={FiMail}>
          <InfoField
            label="Hospital Name"
            value={formData.hospitalName}
            name="firstName"
            icon={FiUser}
          />
          <InfoField
            label="Chief Doctor Name"
            value={formData.chiefDocName}
            name="nic"
            icon={FiUser}
          />
          <InfoField
            label="Email"
            value={formData.email}
            name="email"
            icon={FiMail}
            type="email"
            editable={editing}
            onChange={handleChange}
          />
          <InfoField
            label="Address"
            value={formData.address}
            name="address"
            icon={FiMapPin}
            editable={editing}
            onChange={handleChange}
          />
          <InfoField
            label="Phone 1"
            value={formData.phone}
            name="phone"
            icon={FiPhone}
            type="tel"
            editable={editing}
            onChange={handleChange}
          />
          <InfoField
            label="Phone 2"
            value={formData.optionalPhone}
            name="phone"
            icon={FiPhone}
            type="tel"
            editable={editing}
            onChange={handleChange}
          />
          <InfoField
            label="District"
            name="district"
            icon={FiMapPin}
            editable={editing}
            customInput={
              editing ? (
                <DistrictSelect
                  value={formData.district}
                  onChange={handleChange}
                  brandColor="red.500"
                  bg="white"
                  placeholder="Select your district"
                />
              ) : null
            }
            value={user.district?.name || formData.district}
          />

          <InfoField
            label="Province"
            value={user.district?.province}
            icon={FiMap}
          />
        </InfoSection>
      </Flex>

      {/* Delete Account Dialog */}
      <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        onClose={onClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              <Flex align="center">
                <Icon as={FiTrash2} color="red.500" mr={2} />
                Delete Your Account
              </Flex>
            </AlertDialogHeader>
            <AlertDialogBody>
              <Text mb={4}>
                This will permanently delete your donor account and all
                associated data.
              </Text>
              <Box p={4} bg={bgColor} borderRadius="md">
                <Text fontWeight="medium" color="red.500">
                  Important: This action cannot be undone.
                </Text>
                <Text fontSize="sm" mt={1}>
                  Your donation history and all personal information will be
                  permanently removed.
                </Text>
              </Box>
            </AlertDialogBody>
            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onClose}>
                Cancel
              </Button>
              <Button
                colorScheme="red"
                onClick={handleDelete}
                ml={3}
                leftIcon={<FiTrash2 />}
              >
                Delete Permanently
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </Box>
  );
};

export default HospitalProfile;

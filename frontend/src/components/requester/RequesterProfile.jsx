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
  FormLabel,
  Card,
  CardHeader,
  CardBody,
  SimpleGrid,
  Icon,
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
  FiMapPin,
  FiLock,
  FiMap,
} from "react-icons/fi";
import api from "../../api/api";
import DistrictSelect from "../select/DistrictSelect";

const RequesterProfile = () => {
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

      const res = await api.put(`/req/update/${user._id}`, filteredData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      setUser(res.data.requester);
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
      await api.delete(`/req/delete/${user._id}`);

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
    <Card variant="outline" borderColor={borderColor} mb={6}>
      <CardHeader pb={2}>
        <Flex align="center">
          <Icon as={icon} color={accentColor} mr={2} />
          <Heading size="md">{title}</Heading>
        </Flex>
      </CardHeader>
      <Divider borderColor={borderColor} />
      <CardBody>
        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
          {children}
        </SimpleGrid>
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
      <Flex direction={{ base: "column", md: "row" }} gap={6}>
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
            name={`${user.firstName} ${user.lastName}`}
            size="2xl"
            mb={4}
            bg={accentColor}
            color="white"
          />

          <Heading size="lg" textAlign="center" color={textColor}>
            {user.firstName} {user.lastName}
          </Heading>

          <Text color={labelColor} fontSize="sm" mb={2}>
            {user.role}
          </Text>

          <Divider my={4} borderColor={borderColor} />

          <Text fontSize="sm" color={labelColor} mb={1}>
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
                <Button onClick={() => setEditing(false)} variant="outline">
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
        <Box flex={1}>
          <InfoSection title="Personal Information" icon={FiUser}>
            <InfoField
              label="Full Name"
              value={`${formData.firstName} ${formData.lastName}`}
              name="fullName"
              icon={FiUser}
            />
            <InfoField
              label="NIC"
              value={formData.nic}
              name="nic"
              icon={FiLock}
            />
            <InfoField
              label="Date of Birth"
              value={formData.dob?.slice(0, 10)}
              name="dob"
              type="date"
              icon={FiCalendar}
            />
            <InfoField
              label="Gender"
              value={formData.gender}
              name="gender"
              icon={FiUser}
            />
          </InfoSection>

          <InfoSection title="Contact Information" icon={FiMail}>
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
              label="Phone"
              value={formData.phone}
              name="phone"
              icon={FiPhone}
              type="tel"
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
        </Box>
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
                This will permanently delete your requester account and all
                associated data.
              </Text>
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

export default RequesterProfile;

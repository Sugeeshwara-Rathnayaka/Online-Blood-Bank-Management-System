import {
  Box,
  Flex,
  FormControl,
  FormLabel,
  Input,
  Select,
  Button,
  Heading,
  Text,
  useToast,
  Spinner,
  Alert,
  AlertIcon,
  InputGroup,
  InputRightElement,
  Link,
  useColorModeValue,
  Grid,
  GridItem,
} from "@chakra-ui/react";
import { useState, useEffect, useRef } from "react";
import { useNavigate, Link as RouterLink, useLocation } from "react-router-dom";
import api from "../api/api";
import BloodTypeSelect from "../components/select/BloodTypeSelect";
import DistrictSelect from "../components/select/DistrictSelect";

const ROLES = {
  DONOR: "donor",
  REQUESTER: "requester",
  HOSPITAL: "hospital",
  ORGANIZATION: "organization",
};

const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
const DISTRICTS = [
  "Anuradhapura",
  "Colombo",
  "Galle",
  "Kandy",
  "Kurunegala",
  "Matara",
];

const Register = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const roleParam = searchParams.get("role");

  const navigate = useNavigate();
  const toast = useToast();
  const initialRef = useRef();

  const [formData, setFormData] = useState({
    role: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isRoleLocked, setIsRoleLocked] = useState(false);

  const bgColor = useColorModeValue("white", "gray.800");
  const cardBg = useColorModeValue("white", "gray.700");
  const borderColor = useColorModeValue("gray.200", "gray.600");

  useEffect(() => {
    if (roleParam && Object.values(ROLES).includes(roleParam.toLowerCase())) {
      setFormData((prev) => ({ ...prev, role: roleParam.toLowerCase() }));
      setIsRoleLocked(true);
    }
    initialRef.current?.focus();
  }, [roleParam]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      setLoading(false);
      return;
    }

    const formattedData = {
      ...formData,
      role: formData.role.charAt(0).toUpperCase() + formData.role.slice(1),
    };

    try {
      await api.post("/signup", formattedData);
      toast({
        title: "Registered successfully",
        description: "You can now login.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      navigate(`/login?role=${formData.role}`);
    } catch (err) {
      const msg = err.response?.data?.message || err.message;
      setError(msg);
      toast({
        title: "Registration failed",
        description: msg,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const renderFieldsByRole = () => {
    const common = (
      <>
        <GridItem>
          <FormControl isRequired>
            <FormLabel>Email</FormLabel>
            <Input
              name="email"
              type="email"
              value={formData.email || ""}
              onChange={handleChange}
            />
          </FormControl>
        </GridItem>

        <GridItem>
          <FormControl isRequired>
            <FormLabel>Phone</FormLabel>
            <Input
              name="phone"
              type="tel"
              value={formData.phone || ""}
              onChange={handleChange}
            />
          </FormControl>
        </GridItem>

        <GridItem>
          <FormControl>
            <FormLabel>Optional Phone</FormLabel>
            <Input
              name="optionalPhone"
              type="tel"
              value={formData.optionalPhone || ""}
              onChange={handleChange}
            />
          </FormControl>
        </GridItem>

        <GridItem>
          <FormControl>
            <FormLabel>Address</FormLabel>
            <Input
              name="address"
              value={formData.address || ""}
              onChange={handleChange}
            />
          </FormControl>
        </GridItem>

        <GridItem colSpan={2}>
          <FormControl isRequired>
            <FormLabel>District</FormLabel>
            <DistrictSelect
              value={formData.district || ""}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, district: e.target.value }))
              }
              brandColor="blue.500"
              bg="white"
              placeholder="Select your district"
            />
          </FormControl>
        </GridItem>
      </>
    );

    switch (formData.role) {
      case ROLES.DONOR:
        return (
          <>
            <GridItem>
              <FormControl isRequired>
                <FormLabel>NIC</FormLabel>
                <Input
                  name="nic"
                  value={formData.nic || ""}
                  onChange={handleChange}
                />
              </FormControl>
            </GridItem>

            <GridItem>
              <FormControl isRequired>
                <FormLabel>First Name</FormLabel>
                <Input
                  name="firstName"
                  value={formData.firstName || ""}
                  onChange={handleChange}
                />
              </FormControl>
            </GridItem>

            <GridItem>
              <FormControl isRequired>
                <FormLabel>Last Name</FormLabel>
                <Input
                  name="lastName"
                  value={formData.lastName || ""}
                  onChange={handleChange}
                />
              </FormControl>
            </GridItem>

            <GridItem>
              <FormControl isRequired>
                <FormLabel>Date of Birth</FormLabel>
                <Input
                  type="date"
                  name="dob"
                  value={formData.dob || ""}
                  onChange={handleChange}
                />
              </FormControl>
            </GridItem>

            <GridItem>
              <FormControl isRequired>
                <FormLabel>Gender</FormLabel>
                <Select
                  name="gender"
                  value={formData.gender || ""}
                  onChange={handleChange}
                >
                  <option value="">Select gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </Select>
              </FormControl>
            </GridItem>

            <GridItem>
              <FormControl isRequired>
                <FormLabel>Blood Group</FormLabel>
                <BloodTypeSelect
                  value={formData.bloodGroup || ""}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      bloodGroup: e.target.value,
                    }))
                  }
                  brandColor="red.500"
                  bg="white"
                  placeholder="Select blood type"
                />
              </FormControl>
            </GridItem>

            {common}
          </>
        );
      case ROLES.REQUESTER:
        return (
          <>
            <GridItem>
              <FormControl isRequired>
                <FormLabel>NIC</FormLabel>
                <Input
                  name="nic"
                  value={formData.nic || ""}
                  onChange={handleChange}
                />
              </FormControl>
            </GridItem>

            <GridItem>
              <FormControl isRequired>
                <FormLabel>First Name</FormLabel>
                <Input
                  name="firstName"
                  value={formData.firstName || ""}
                  onChange={handleChange}
                />
              </FormControl>
            </GridItem>

            <GridItem>
              <FormControl isRequired>
                <FormLabel>Last Name</FormLabel>
                <Input
                  name="lastName"
                  value={formData.lastName || ""}
                  onChange={handleChange}
                />
              </FormControl>
            </GridItem>

            <GridItem>
              <FormControl>
                <FormLabel>Date of Birth</FormLabel>
                <Input
                  type="date"
                  name="dob"
                  value={formData.dob || ""}
                  onChange={handleChange}
                />
              </FormControl>
            </GridItem>

            <GridItem>
              <FormControl>
                <FormLabel>Gender</FormLabel>
                <Select
                  name="gender"
                  value={formData.gender || ""}
                  onChange={handleChange}
                >
                  <option value="">Select gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </Select>
              </FormControl>
            </GridItem>

            {common}
          </>
        );
      case ROLES.HOSPITAL:
        return (
          <>
            <GridItem>
              <FormControl isRequired>
                <FormLabel>Hospital Name</FormLabel>
                <Input
                  name="hospitalName"
                  value={formData.hospitalName || ""}
                  onChange={handleChange}
                />
              </FormControl>
            </GridItem>

            <GridItem>
              <FormControl isRequired>
                <FormLabel>Username</FormLabel>
                <Input
                  name="userName"
                  value={formData.userName || ""}
                  onChange={handleChange}
                />
              </FormControl>
            </GridItem>

            <GridItem colSpan={2}>
              <FormControl isRequired>
                <FormLabel>Chief Doctor Name</FormLabel>
                <Input
                  name="chiefDocName"
                  value={formData.chiefDocName || ""}
                  onChange={handleChange}
                />
              </FormControl>
            </GridItem>

            {common}
          </>
        );
      case ROLES.ORGANIZATION:
        return (
          <>
            <GridItem>
              <FormControl isRequired>
                <FormLabel>Organization Name</FormLabel>
                <Input
                  name="organizationName"
                  value={formData.organizationName || ""}
                  onChange={handleChange}
                />
              </FormControl>
            </GridItem>

            <GridItem>
              <FormControl isRequired>
                <FormLabel>President Name</FormLabel>
                <Input
                  name="presidentName"
                  value={formData.presidentName || ""}
                  onChange={handleChange}
                />
              </FormControl>
            </GridItem>

            <GridItem colSpan={2}>
              <FormControl>
                <FormLabel>Purpose</FormLabel>
                <Input
                  name="purpose"
                  value={formData.purpose || ""}
                  onChange={handleChange}
                />
              </FormControl>
            </GridItem>

            <GridItem>
              <FormControl isRequired>
                <FormLabel>Username</FormLabel>
                <Input
                  name="userName"
                  value={formData.userName || ""}
                  onChange={handleChange}
                />
              </FormControl>
            </GridItem>

            {common}
          </>
        );
      default:
        return null;
    }
  };

  return (
    <Flex minH="100vh" align="center" justify="center" bg={bgColor} px={4}>
      <Box
        w="100%"
        maxW="6xl"
        p={8}
        borderWidth={1}
        borderRadius="lg"
        boxShadow="lg"
        bg={cardBg}
        borderColor={borderColor}
      >
        <Heading as="h1" size="xl" textAlign="center" mb={6}>
          Register As{" "}
          {formData.role.charAt(0).toUpperCase() + formData.role.slice(1)}
        </Heading>

        {error && (
          <Alert status="error" mb={6}>
            <AlertIcon />
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <FormControl mb={6} isRequired>
            <FormLabel>Role</FormLabel>
            <Select
              name="role"
              ref={initialRef}
              value={formData.role}
              onChange={handleChange}
              isDisabled={isRoleLocked}
            >
              <option value="">Select Role</option>
              {Object.values(ROLES).map((role) => (
                <option key={role} value={role}>
                  {role.charAt(0).toUpperCase() + role.slice(1)}
                </option>
              ))}
            </Select>
          </FormControl>

          <Grid templateColumns={{ base: "1fr", md: "1fr 1fr" }} gap={6}>
            {renderFieldsByRole()}

            <GridItem>
              <FormControl isRequired>
                <FormLabel>Password</FormLabel>
                <InputGroup>
                  <Input
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={handleChange}
                  />
                  <InputRightElement width="4.5rem">
                    <Button
                      size="sm"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? "Hide" : "Show"}
                    </Button>
                  </InputRightElement>
                </InputGroup>
              </FormControl>
            </GridItem>

            <GridItem>
              <FormControl isRequired>
                <FormLabel>Confirm Password</FormLabel>
                <InputGroup>
                  <Input
                    name="confirmPassword"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                  />
                  <InputRightElement width="4.5rem">
                    <Button
                      size="sm"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? "Hide" : "Show"}
                    </Button>
                  </InputRightElement>
                </InputGroup>
              </FormControl>
            </GridItem>
          </Grid>

          <Button
            type="submit"
            width="100%"
            colorScheme="blue"
            isLoading={loading}
            mt={8}
          >
            Register
          </Button>

          <Text textAlign="center" mt={4}>
            Already have an account?{" "}
            <Link
              as={RouterLink}
              to={`/login${roleParam ? `?role=${roleParam}` : ""}`}
              color="blue.500"
            >
              Login here
            </Link>
          </Text>
        </form>
      </Box>
    </Flex>
  );
};

export default Register;

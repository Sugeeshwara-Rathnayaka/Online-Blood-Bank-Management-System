// import { useState } from "react";
// import { useNavigate, Link as RouterLink } from "react-router-dom";
// import {
//   Box,
//   Flex,
//   FormControl,
//   FormLabel,
//   Input,
//   Select,
//   Button,
//   Heading,
//   Text,
//   useToast,
//   Spinner,
//   Alert,
//   AlertIcon,
//   Link,
//   useColorModeValue,
//   RadioGroup,
//   Stack,
//   Radio,
//   Grid,
//   GridItem,
// } from "@chakra-ui/react";

// const ROLES = {
//   DONOR: "donor",
//   REQUESTER: "requester",
//   HOSPITAL: "hospital",
//   ORGANIZATION: "organization",
//   BBADMIN: "bbadmin",
// };

// const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

// const Register = () => {
//   const navigate = useNavigate();
//   const toast = useToast();
//   const [formData, setFormData] = useState({
//     role: "",
//     name: "",
//     nic: "",
//     username: "",
//     email: "",
//     password: "",
//     confirmPassword: "",
//     bloodGroup: "",
//     phone: "",
//     address: "",
//     organizationName: "",
//     hospitalName: "",
//   });
//   const [errors, setErrors] = useState({});
//   const [loading, setLoading] = useState(false);

//   const bgColor = useColorModeValue("gray.50", "gray.900");
//   const cardBg = useColorModeValue("white", "gray.800");
//   const borderColor = useColorModeValue("gray.200", "gray.700");

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({
//       ...prev,
//       [name]: value,
//     }));
//     // Clear error when user types
//     if (errors[name]) {
//       setErrors((prev) => ({ ...prev, [name]: "" }));
//     }
//   };

//   const validateForm = () => {
//     const newErrors = {};

//     if (!formData.role) newErrors.role = "Role is required";
//     if (!formData.name) newErrors.name = "Name is required";
//     if (!formData.password) newErrors.password = "Password is required";
//     if (formData.password !== formData.confirmPassword)
//       newErrors.confirmPassword = "Passwords do not match";
//     if (!formData.phone) newErrors.phone = "Phone number is required";

//     // Role-specific validations
//     if (formData.role === ROLES.DONOR || formData.role === ROLES.REQUESTER) {
//       if (!formData.nic) newErrors.nic = "NIC is required";
//       if (!formData.bloodGroup)
//         newErrors.bloodGroup = "Blood group is required";
//     } else {
//       if (!formData.username) newErrors.username = "Username is required";
//       if (!formData.email) newErrors.email = "Email is required";
//     }

//     // Organization-specific
//     if (formData.role === ROLES.ORGANIZATION && !formData.organizationName) {
//       newErrors.organizationName = "Organization name is required";
//     }

//     // Hospital-specific
//     if (formData.role === ROLES.HOSPITAL && !formData.hospitalName) {
//       newErrors.hospitalName = "Hospital name is required";
//     }

//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!validateForm()) return;

//     setLoading(true);
//     try {
//       // Prepare the data to send based on role
//       const payload = {
//         role: formData.role,
//         name: formData.name,
//         password: formData.password,
//         phone: formData.phone,
//         address: formData.address,
//       };

//       // Add role-specific fields
//       if (formData.role === ROLES.DONOR || formData.role === ROLES.REQUESTER) {
//         payload.nic = formData.nic;
//         payload.bloodGroup = formData.bloodGroup;
//       } else {
//         payload.username = formData.username;
//         payload.email = formData.email;
//       }

//       if (formData.role === ROLES.ORGANIZATION) {
//         payload.organizationName = formData.organizationName;
//       }

//       if (formData.role === ROLES.HOSPITAL) {
//         payload.hospitalName = formData.hospitalName;
//       }

//       const response = await fetch("/api/auth/signup", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(payload),
//       });

//       const data = await response.json();

//       if (!response.ok) {
//         throw new Error(data.message || "Registration failed");
//       }

//       toast({
//         title: "Registration successful",
//         description: "Your account has been created",
//         status: "success",
//         duration: 5000,
//         isClosable: true,
//       });

//       // Redirect to login page
//       navigate("/login");
//     } catch (error) {
//       toast({
//         title: "Registration failed",
//         description: error.message,
//         status: "error",
//         duration: 5000,
//         isClosable: true,
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <Flex minH="100vh" align="center" justify="center" bg={bgColor} px={4}>
//       <Box
//         w="100%"
//         maxW="2xl"
//         p={8}
//         borderWidth={1}
//         borderRadius="lg"
//         boxShadow="xl"
//         bg={cardBg}
//         borderColor={borderColor}
//       >
//         <Heading as="h1" size="xl" textAlign="center" mb={8}>
//           Create an Account
//         </Heading>

//         <form onSubmit={handleSubmit}>
//           <FormControl id="role" mb={6} isInvalid={!!errors.role} isRequired>
//             <FormLabel>I want to register as a:</FormLabel>
//             <RadioGroup
//               name="role"
//               value={formData.role}
//               onChange={(value) => {
//                 setFormData((prev) => ({ ...prev, role: value }));
//                 if (errors.role) setErrors((prev) => ({ ...prev, role: "" }));
//               }}
//             >
//               <Stack direction="row" spacing={8} wrap="wrap">
//                 <Radio value={ROLES.DONOR}>Blood Donor</Radio>
//                 <Radio value={ROLES.REQUESTER}>Blood Requester</Radio>
//                 <Radio value={ROLES.HOSPITAL}>Hospital</Radio>
//                 <Radio value={ROLES.ORGANIZATION}>Organization</Radio>
//                 <Radio value={ROLES.BBADMIN}>Blood Bank Admin</Radio>
//               </Stack>
//             </RadioGroup>
//             {errors.role && (
//               <Text color="red.500" fontSize="sm" mt={1}>
//                 {errors.role}
//               </Text>
//             )}
//           </FormControl>

//           <Grid templateColumns="repeat(2, 1fr)" gap={6} mb={6}>
//             <GridItem colSpan={2}>
//               <FormControl id="name" isInvalid={!!errors.name} isRequired>
//                 <FormLabel>Full Name</FormLabel>
//                 <Input
//                   type="text"
//                   name="name"
//                   value={formData.name}
//                   onChange={handleChange}
//                   placeholder="Enter your full name"
//                 />
//                 {errors.name && (
//                   <Text color="red.500" fontSize="sm" mt={1}>
//                     {errors.name}
//                   </Text>
//                 )}
//               </FormControl>
//             </GridItem>

//             <GridItem colSpan={2}>
//               <FormControl id="phone" isInvalid={!!errors.phone} isRequired>
//                 <FormLabel>Phone Number</FormLabel>
//                 <Input
//                   type="tel"
//                   name="phone"
//                   value={formData.phone}
//                   onChange={handleChange}
//                   placeholder="Enter your phone number"
//                 />
//                 {errors.phone && (
//                   <Text color="red.500" fontSize="sm" mt={1}>
//                     {errors.phone}
//                   </Text>
//                 )}
//               </FormControl>
//             </GridItem>

//             <GridItem colSpan={2}>
//               <FormControl id="address" isInvalid={!!errors.address}>
//                 <FormLabel>Address</FormLabel>
//                 <Input
//                   type="text"
//                   name="address"
//                   value={formData.address}
//                   onChange={handleChange}
//                   placeholder="Enter your address"
//                 />
//               </FormControl>
//             </GridItem>

//             {/* Role-specific fields */}
//             {(formData.role === ROLES.DONOR ||
//               formData.role === ROLES.REQUESTER) && (
//               <>
//                 <GridItem colSpan={[2, 1]}>
//                   <FormControl id="nic" isInvalid={!!errors.nic} isRequired>
//                     <FormLabel>NIC Number</FormLabel>
//                     <Input
//                       type="text"
//                       name="nic"
//                       value={formData.nic}
//                       onChange={handleChange}
//                       placeholder="Enter your NIC number"
//                     />
//                     {errors.nic && (
//                       <Text color="red.500" fontSize="sm" mt={1}>
//                         {errors.nic}
//                       </Text>
//                     )}
//                   </FormControl>
//                 </GridItem>

//                 <GridItem colSpan={[2, 1]}>
//                   <FormControl
//                     id="bloodGroup"
//                     isInvalid={!!errors.bloodGroup}
//                     isRequired
//                   >
//                     <FormLabel>Blood Group</FormLabel>
//                     <Select
//                       name="bloodGroup"
//                       value={formData.bloodGroup}
//                       onChange={handleChange}
//                       placeholder="Select blood group"
//                     >
//                       {BLOOD_GROUPS.map((group) => (
//                         <option key={group} value={group}>
//                           {group}
//                         </option>
//                       ))}
//                     </Select>
//                     {errors.bloodGroup && (
//                       <Text color="red.500" fontSize="sm" mt={1}>
//                         {errors.bloodGroup}
//                       </Text>
//                     )}
//                   </FormControl>
//                 </GridItem>
//               </>
//             )}

//             {(formData.role === ROLES.HOSPITAL ||
//               formData.role === ROLES.ORGANIZATION ||
//               formData.role === ROLES.BBADMIN) && (
//               <>
//                 <GridItem colSpan={2}>
//                   <FormControl
//                     id="username"
//                     isInvalid={!!errors.username}
//                     isRequired
//                   >
//                     <FormLabel>Username</FormLabel>
//                     <Input
//                       type="text"
//                       name="username"
//                       value={formData.username}
//                       onChange={handleChange}
//                       placeholder="Choose a username"
//                     />
//                     {errors.username && (
//                       <Text color="red.500" fontSize="sm" mt={1}>
//                         {errors.username}
//                       </Text>
//                     )}
//                   </FormControl>
//                 </GridItem>

//                 <GridItem colSpan={2}>
//                   <FormControl id="email" isInvalid={!!errors.email} isRequired>
//                     <FormLabel>Email Address</FormLabel>
//                     <Input
//                       type="email"
//                       name="email"
//                       value={formData.email}
//                       onChange={handleChange}
//                       placeholder="Enter your email"
//                     />
//                     {errors.email && (
//                       <Text color="red.500" fontSize="sm" mt={1}>
//                         {errors.email}
//                       </Text>
//                     )}
//                   </FormControl>
//                 </GridItem>

//                 {formData.role === ROLES.HOSPITAL && (
//                   <GridItem colSpan={2}>
//                     <FormControl
//                       id="hospitalName"
//                       isInvalid={!!errors.hospitalName}
//                       isRequired
//                     >
//                       <FormLabel>Hospital Name</FormLabel>
//                       <Input
//                         type="text"
//                         name="hospitalName"
//                         value={formData.hospitalName}
//                         onChange={handleChange}
//                         placeholder="Enter hospital name"
//                       />
//                       {errors.hospitalName && (
//                         <Text color="red.500" fontSize="sm" mt={1}>
//                           {errors.hospitalName}
//                         </Text>
//                       )}
//                     </FormControl>
//                   </GridItem>
//                 )}

//                 {formData.role === ROLES.ORGANIZATION && (
//                   <GridItem colSpan={2}>
//                     <FormControl
//                       id="organizationName"
//                       isInvalid={!!errors.organizationName}
//                       isRequired
//                     >
//                       <FormLabel>Organization Name</FormLabel>
//                       <Input
//                         type="text"
//                         name="organizationName"
//                         value={formData.organizationName}
//                         onChange={handleChange}
//                         placeholder="Enter organization name"
//                       />
//                       {errors.organizationName && (
//                         <Text color="red.500" fontSize="sm" mt={1}>
//                           {errors.organizationName}
//                         </Text>
//                       )}
//                     </FormControl>
//                   </GridItem>
//                 )}
//               </>
//             )}

//             <GridItem colSpan={[2, 1]}>
//               <FormControl
//                 id="password"
//                 isInvalid={!!errors.password}
//                 isRequired
//               >
//                 <FormLabel>Password</FormLabel>
//                 <Input
//                   type="password"
//                   name="password"
//                   value={formData.password}
//                   onChange={handleChange}
//                   placeholder="Create a password"
//                 />
//                 {errors.password && (
//                   <Text color="red.500" fontSize="sm" mt={1}>
//                     {errors.password}
//                   </Text>
//                 )}
//               </FormControl>
//             </GridItem>

//             <GridItem colSpan={[2, 1]}>
//               <FormControl
//                 id="confirmPassword"
//                 isInvalid={!!errors.confirmPassword}
//                 isRequired
//               >
//                 <FormLabel>Confirm Password</FormLabel>
//                 <Input
//                   type="password"
//                   name="confirmPassword"
//                   value={formData.confirmPassword}
//                   onChange={handleChange}
//                   placeholder="Confirm your password"
//                 />
//                 {errors.confirmPassword && (
//                   <Text color="red.500" fontSize="sm" mt={1}>
//                     {errors.confirmPassword}
//                   </Text>
//                 )}
//               </FormControl>
//             </GridItem>
//           </Grid>

//           <Button
//             colorScheme="blue"
//             size="lg"
//             fontSize="md"
//             width="full"
//             type="submit"
//             isLoading={loading}
//             loadingText="Registering..."
//             spinner={<Spinner size="sm" mr={2} />}
//             mb={4}
//           >
//             Create Account
//           </Button>

//           <Text textAlign="center">
//             Already have an account?{" "}
//             <Link as={RouterLink} to="/login" color="blue.500">
//               Login here
//             </Link>
//           </Text>
//         </form>
//       </Box>
//     </Flex>
//   );
// };

// export default Register;

import { useState, useEffect } from "react";
import { useNavigate, Link as RouterLink, useLocation } from "react-router-dom";
import {
  Box,
  Flex,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  Select,
  Button,
  Heading,
  Text,
  useToast,
  Spinner,
  Alert,
  AlertIcon,
  Link,
  useColorModeValue,
  Grid,
  GridItem,
  Badge,
} from "@chakra-ui/react";

const ROLES = {
  DONOR: "donor",
  REQUESTER: "requester",
  HOSPITAL: "hospital",
  ORGANIZATION: "organization",
  BBADMIN: "bbadmin",
};

const ROLE_LABELS = {
  [ROLES.DONOR]: "Blood Donor",
  [ROLES.REQUESTER]: "Blood Requester",
  [ROLES.HOSPITAL]: "Hospital",
  [ROLES.ORGANIZATION]: "Organization",
  [ROLES.BBADMIN]: "Blood Bank Admin",
};

const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

const Register = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const toast = useToast();

  // Get role from URL params if available
  const searchParams = new URLSearchParams(location.search);
  const roleParam = searchParams.get("role");

  const [formData, setFormData] = useState({
    role: roleParam || "",
    name: "",
    nic: "",
    username: "",
    district: "",
    gender: "",
    email: "",
    password: "",
    confirmPassword: "",
    bloodGroup: "",
    phone: "",
    address: "",
    organizationName: "",
    hospitalName: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isRoleLocked, setIsRoleLocked] = useState(!!roleParam);

  const bgColor = useColorModeValue("gray.50", "gray.900");
  const cardBg = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");

  // Redirect if no valid role
  useEffect(() => {
    if (!roleParam || !ROLE_LABELS[roleParam]) {
      navigate("/role-selection");
    }
  }, [roleParam, navigate]);

  useEffect(() => {
    if (roleParam && Object.values(ROLES).includes(roleParam.toLowerCase())) {
      setFormData((prev) => ({
        ...prev,
        role: roleParam.toLowerCase(),
      }));
      setIsRoleLocked(true);
    }
  }, [roleParam]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user types
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  // const handleBackToRoleSelection = () => {
  //   navigate("/select-role");
  // };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.role) newErrors.role = "Role is required";
    if (!formData.name) newErrors.name = "Name is required";
    if (!formData.password) newErrors.password = "Password is required";
    if (formData.password !== formData.confirmPassword)
      newErrors.confirmPassword = "Passwords do not match";
    if (!formData.phone) newErrors.phone = "Phone number is required";

    // Password strength validation
    if (formData.password && formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }

    // Role-specific validations
    if (formData.role === ROLES.DONOR || formData.role === ROLES.REQUESTER) {
      if (!formData.nic) newErrors.nic = "NIC is required";
      if (!formData.bloodGroup)
        newErrors.bloodGroup = "Blood group is required";

      // NIC validation
      if (formData.nic && !/^([0-9]{9}[xXvV]|[0-9]{12})$/.test(formData.nic)) {
        newErrors.nic = "Please enter a valid NIC number";
      }
    } else {
      if (!formData.username) newErrors.username = "Username is required";
      if (!formData.email) newErrors.email = "Email is required";

      // Email validation
      if (
        formData.email &&
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)
      ) {
        newErrors.email = "Please enter a valid email address";
      }
    }

    // Organization-specific
    if (formData.role === ROLES.ORGANIZATION && !formData.organizationName) {
      newErrors.organizationName = "Organization name is required";
    }

    // Hospital-specific
    if (formData.role === ROLES.HOSPITAL && !formData.hospitalName) {
      newErrors.hospitalName = "Hospital name is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      // Prepare the data to send based on role
      const payload = {
        role: formData.role,
        name: formData.name,
        password: formData.password,
        phone: formData.phone,
        address: formData.address,
      };

      // Add role-specific fields
      if (formData.role === ROLES.DONOR || formData.role === ROLES.REQUESTER) {
        payload.nic = formData.nic;
        payload.email = formData.email;
        payload.bloodGroup = formData.bloodGroup;
        payload.gender = formData.gender;
        payload.address = formData.address;
      } else {
        payload.username = formData.username;
        payload.email = formData.email;
      }

      if (formData.role === ROLES.ORGANIZATION) {
        payload.organizationName = formData.organizationName;
      }

      if (formData.role === ROLES.HOSPITAL) {
        payload.hospitalName = formData.hospitalName;
      }

      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Registration failed");
      }

      toast({
        title: "Registration successful",
        description: `Account created as ${ROLES[roleParam]}`,
        status: "success",
        duration: 5000,
        isClosable: true,
      });

      // Redirect to login page with role if coming from role selection
      navigate(roleParam ? `/login?role=${roleParam}` : "/login");
    } catch (error) {
      toast({
        title: "Registration failed",
        description: error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Flex minH="100vh" align="center" justify="center" bg={bgColor} px={4}>
      <Box
        w="100%"
        maxW="2xl"
        p={8}
        borderWidth={1}
        borderRadius="lg"
        boxShadow="xl"
        bg={cardBg}
        borderColor={borderColor}
      >
        <Flex direction="column" align="center" mb={8}>
          <Heading as="h1" size="xl" textAlign="center">
            {isRoleLocked
              ? `Register as a ${ROLE_LABELS[formData.role]}`
              : "Create an Account"}
          </Heading>
        </Flex>

        {!isRoleLocked && (
          <FormControl id="role" mb={6} isInvalid={!!errors.role} isRequired>
            <FormLabel>Select Your Role</FormLabel>
            <Select
              name="role"
              value={formData.role}
              onChange={handleChange}
              placeholder="Select your role"
            >
              <option value={ROLES.DONOR}>{ROLE_LABELS[ROLES.DONOR]}</option>
              <option value={ROLES.REQUESTER}>
                {ROLE_LABELS[ROLES.REQUESTER]}
              </option>
              <option value={ROLES.HOSPITAL}>
                {ROLE_LABELS[ROLES.HOSPITAL]}
              </option>
              <option value={ROLES.ORGANIZATION}>
                {ROLE_LABELS[ROLES.ORGANIZATION]}
              </option>
              <option value={ROLES.BBADMIN}>
                {ROLE_LABELS[ROLES.BBADMIN]}
              </option>
            </Select>
            {errors.role && (
              <Text color="red.500" fontSize="sm" mt={1}>
                {errors.role}
              </Text>
            )}
          </FormControl>
        )}

        <form onSubmit={handleSubmit}>
          <Grid templateColumns="repeat(2, 1fr)" gap={6} mb={6}>
            <GridItem colSpan={[2, 1]}>
              <FormControl id="name" isInvalid={!!errors.name} isRequired>
                <FormLabel>First Name</FormLabel>
                <Input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your First name"
                />
                {errors.name && (
                  <Text color="red.500" fontSize="sm" mt={1}>
                    {errors.name}
                  </Text>
                )}
              </FormControl>
            </GridItem>

            <GridItem colSpan={[2, 1]}>
              <FormControl id="name" isInvalid={!!errors.name} isRequired>
                <FormLabel>Last Name</FormLabel>
                <Input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your Last name"
                />
                {errors.name && (
                  <Text color="red.500" fontSize="sm" mt={1}>
                    {errors.name}
                  </Text>
                )}
              </FormControl>
            </GridItem>

            <GridItem colSpan={2}>
              <FormControl id="email" isInvalid={!!errors.email} isRequired>
                <FormLabel>Email</FormLabel>
                <Input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your Email"
                />
              </FormControl>
            </GridItem>

            <GridItem colSpan={2}>
              <FormControl id="address" isInvalid={!!errors.address}>
                <FormLabel>Address</FormLabel>
                <Input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Enter your address"
                />
              </FormControl>
            </GridItem>

            <GridItem colSpan={[2, 1]}>
              <FormControl
                id="district"
                isInvalid={!!errors.bloodGroup}
                isRequired
              >
                <FormLabel>District</FormLabel>
                <Select
                  name="bloodGroup"
                  value={formData.bloodGroup}
                  onChange={handleChange}
                  placeholder="Select yout District"
                >
                  {BLOOD_GROUPS.map((group) => (
                    <option key={group} value={group}>
                      {group}
                    </option>
                  ))}
                </Select>
                {errors.bloodGroup && (
                  <Text color="red.500" fontSize="sm" mt={1}>
                    {errors.bloodGroup}
                  </Text>
                )}
              </FormControl>
            </GridItem>

            <GridItem colSpan={[2, 1]}>
              <FormControl id="phone" isInvalid={!!errors.phone} isRequired>
                <FormLabel>Phone Number</FormLabel>
                <Input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Enter your phone number"
                />
                {errors.phone && (
                  <Text color="red.500" fontSize="sm" mt={1}>
                    {errors.phone}
                  </Text>
                )}
              </FormControl>
            </GridItem>

            {/* Role-specific fields */}
            {(formData.role === ROLES.DONOR ||
              formData.role === ROLES.REQUESTER) && (
              <>
                <GridItem colSpan={[2, 1]}>
                  <FormControl id="nic" isInvalid={!!errors.nic} isRequired>
                    <FormLabel>NIC Number</FormLabel>
                    <Input
                      type="text"
                      name="nic"
                      value={formData.nic}
                      onChange={handleChange}
                      placeholder="Enter your NIC Number"
                      //textTransform="uppercase"
                    />
                    {errors.nic && (
                      <Text color="red.500" fontSize="sm" mt={1}>
                        {errors.nic}
                      </Text>
                    )}
                  </FormControl>
                </GridItem>

                <GridItem colSpan={[2, 1]}>
                  <FormControl
                    id="bloodGroup"
                    isInvalid={!!errors.bloodGroup}
                    isRequired
                  >
                    <FormLabel>Blood Group</FormLabel>
                    <Select
                      name="bloodGroup"
                      value={formData.bloodGroup}
                      onChange={handleChange}
                      placeholder="Select blood group"
                    >
                      {BLOOD_GROUPS.map((group) => (
                        <option key={group} value={group}>
                          {group}
                        </option>
                      ))}
                    </Select>
                    {errors.bloodGroup && (
                      <Text color="red.500" fontSize="sm" mt={1}>
                        {errors.bloodGroup}
                      </Text>
                    )}
                  </FormControl>
                </GridItem>
              </>
            )}

            {(formData.role === ROLES.HOSPITAL ||
              formData.role === ROLES.ORGANIZATION ||
              formData.role === ROLES.BBADMIN) && (
              <>
                <GridItem colSpan={2}>
                  <FormControl
                    id="username"
                    isInvalid={!!errors.username}
                    isRequired
                  >
                    <FormLabel>Username</FormLabel>
                    <Input
                      type="text"
                      name="username"
                      value={formData.username}
                      onChange={handleChange}
                      placeholder="Choose a username"
                    />
                    {errors.username && (
                      <Text color="red.500" fontSize="sm" mt={1}>
                        {errors.username}
                      </Text>
                    )}
                  </FormControl>
                </GridItem>

                <GridItem colSpan={2}>
                  <FormControl id="email" isInvalid={!!errors.email} isRequired>
                    <FormLabel>Email Address</FormLabel>
                    <Input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Enter your email"
                    />
                    {errors.email && (
                      <Text color="red.500" fontSize="sm" mt={1}>
                        {errors.email}
                      </Text>
                    )}
                  </FormControl>
                </GridItem>

                {formData.role === ROLES.HOSPITAL && (
                  <GridItem colSpan={2}>
                    <FormControl
                      id="hospitalName"
                      isInvalid={!!errors.hospitalName}
                      isRequired
                    >
                      <FormLabel>Hospital Name</FormLabel>
                      <Input
                        type="text"
                        name="hospitalName"
                        value={formData.hospitalName}
                        onChange={handleChange}
                        placeholder="Enter hospital name"
                      />
                      {errors.hospitalName && (
                        <Text color="red.500" fontSize="sm" mt={1}>
                          {errors.hospitalName}
                        </Text>
                      )}
                    </FormControl>
                  </GridItem>
                )}

                {formData.role === ROLES.ORGANIZATION && (
                  <GridItem colSpan={2}>
                    <FormControl
                      id="organizationName"
                      isInvalid={!!errors.organizationName}
                      isRequired
                    >
                      <FormLabel>Organization Name</FormLabel>
                      <Input
                        type="text"
                        name="organizationName"
                        value={formData.organizationName}
                        onChange={handleChange}
                        placeholder="Enter organization name"
                      />
                      {errors.organizationName && (
                        <Text color="red.500" fontSize="sm" mt={1}>
                          {errors.organizationName}
                        </Text>
                      )}
                    </FormControl>
                  </GridItem>
                )}
              </>
            )}

            <GridItem colSpan={[2, 1]}>
              <FormControl
                id="password"
                isInvalid={!!errors.password}
                isRequired
              >
                <FormLabel>Password</FormLabel>
                <InputGroup>
                  <Input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Create a password"
                  />
                  <InputRightElement width="4.5rem">
                    <Button
                      h="1.75rem"
                      size="sm"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? "Hide" : "Show"}
                    </Button>
                  </InputRightElement>
                </InputGroup>
                {errors.password && (
                  <Text color="red.500" fontSize="sm" mt={1}>
                    {errors.password}
                  </Text>
                )}
                <Text fontSize="xs" mt={1} color="gray.500">
                  Minimum 8 characters
                </Text>
              </FormControl>
            </GridItem>

            <GridItem colSpan={[2, 1]}>
              <FormControl
                id="confirmPassword"
                isInvalid={!!errors.confirmPassword}
                isRequired
              >
                <FormLabel>Confirm Password</FormLabel>
                <InputGroup>
                  <Input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Confirm your password"
                  />
                  <InputRightElement width="4.5rem">
                    <Button
                      h="1.75rem"
                      size="sm"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                    >
                      {showConfirmPassword ? "Hide" : "Show"}
                    </Button>
                  </InputRightElement>
                </InputGroup>
                {errors.confirmPassword && (
                  <Text color="red.500" fontSize="sm" mt={1}>
                    {errors.confirmPassword}
                  </Text>
                )}
              </FormControl>
            </GridItem>
          </Grid>

          <Button
            colorScheme="blue"
            size="lg"
            fontSize="md"
            width="96%"
            type="submit"
            isLoading={loading}
            loadingText="Registering..."
            spinner={<Spinner size="sm" mr={2} />}
            mb={4}
          >
            Create Account
          </Button>

          <Text textAlign="center">
            Already have an account?{" "}
            <Link
              as={RouterLink}
              to={roleParam ? `/login?role=${roleParam}` : "/login"}
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

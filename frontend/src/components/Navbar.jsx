import { Link as RouterLink, useNavigate, useLocation } from "react-router-dom";
import {
  Flex,
  Heading,
  Button,
  Text,
  Box,
  useToast,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Avatar,
  IconButton,
  Tooltip,
  Badge,
  Spacer,
  useBreakpointValue,
  HStack,
  Divider,
  useDisclosure,
  Slide,
  Portal,
  CloseButton,
  VStack,
  Stack,
  Spinner,
} from "@chakra-ui/react";
import {
  FiHome,
  FiLogOut,
  FiUser,
  FiMenu,
  FiX,
  FiCreditCard,
} from "react-icons/fi";
import { RiIdCardFill } from "react-icons/ri";
import { useAuth } from "../contexts/AuthContext";
import api from "../api/api";
import { motion } from "framer-motion";
import { useState } from "react";

const MotionBox = motion(Box);
const MotionButton = motion(Button);

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const toast = useToast();
  const { isOpen, onToggle, onClose } = useDisclosure();
  const isMobile = useBreakpointValue({ base: true, md: false });
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // Color values
  const bg = "white";
  const color = "gray.800";
  const borderColor = "gray.200";
  const brandColor = "red.600";
  const hoverBg = "gray.100";
  const activeBg = "red.200";

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await api.post("/logout");
      logout();
      toast({
        title: "Logged out successfully",
        status: "success",
        duration: 4000,
        isClosable: true,
        position: "top",
      });
      navigate("/role-selection/login");
    } catch (error) {
      console.error("Logout failed:", error);
      logout();
      toast({
        title: "Logged out",
        description: "You have been logged out",
        status: "info",
        duration: 3000,
        isClosable: true,
        position: "top",
      });
      navigate("/");
    } finally {
      setIsLoggingOut(false);
    }
  };

  const isActive = (path) => location.pathname === path;

  const getDisplayName = (user) => {
    switch (user.role) {
      case "Donor":
      case "Requester":
        return user.firstName;
      case "Hospital":
        return user.hospitalName;
      case "Organization":
        return user.organizationName;
      case "BloodBankAdmin":
        return user.firstName;
      default:
        return user.userName; // fallback
    }
  };
  if (isLoggingOut) {
    return (
      <Flex
        minH="100vh"
        justify="center"
        align="center"
        bg="white"
        position="fixed"
        top="0"
        left="0"
        right="0"
        bottom="0"
        zIndex="9999"
      >
        <Stack spacing={4} align="center">
          <Spinner size="xl" color="red.500" thickness="4px" speed="0.65s" />
          <Text fontSize="lg" fontWeight="semibold">
            Logging out...
          </Text>
        </Stack>
      </Flex>
    );
  }

  return (
    <>
      <Flex
        as="nav"
        align="center"
        justify="space-between"
        wrap="wrap"
        padding={{ base: "0.75rem", md: "1rem 2rem" }}
        bg={bg}
        color={color}
        boxShadow="sm"
        position="sticky"
        top="0"
        zIndex="sticky"
        //opacity="50%"
        borderBottomWidth="1px"
        borderBottomColor={borderColor}
      >
        {/* Brand/Logo */}
        <MotionBox
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          transition={{ duration: 0.2 }}
        >
          <Heading as="h1" size="lg" letterSpacing="tighter" color={brandColor}>
            <RouterLink to="/">BloodLink</RouterLink>
          </Heading>
        </MotionBox>

        <Spacer />

        {isMobile ? (
          <>
            <IconButton
              icon={isOpen ? <FiX /> : <FiMenu />}
              onClick={onToggle}
              aria-label="Open menu"
              variant="ghost"
              rounded="full"
            />

            <Portal>
              <Slide direction="right" in={isOpen} style={{ zIndex: 10 }}>
                <Box
                  bg={bg}
                  color={color}
                  h="100vh"
                  w="80vw"
                  maxW="320px"
                  position="fixed"
                  top="0"
                  right="0"
                  boxShadow="xl"
                  p={4}
                >
                  <Flex justify="flex-end" mb={8}>
                    <CloseButton size="lg" onClick={onClose} />
                  </Flex>

                  <VStack spacing={4} align="stretch">
                    {isAuthenticated ? (
                      <>
                        <Button
                          as={RouterLink}
                          to="/"
                          variant="ghost"
                          leftIcon={<FiHome />}
                          justifyContent="flex-start"
                          bg={isActive("/") ? activeBg : "transparent"}
                          _hover={{ bg: hoverBg }}
                          onClick={onClose}
                        >
                          Home
                        </Button>
                        <Button
                          as={RouterLink}
                          to="/donateUs"
                          variant="ghost"
                          leftIcon={<FiCreditCard />}
                          justifyContent="flex-start"
                          bg={isActive("/donateUs") ? activeBg : "transparent"}
                          _hover={{ bg: hoverBg }}
                          onClick={onClose}
                        >
                          Donate Us
                        </Button>

                        <Button
                          as={RouterLink}
                          to="/aboutUs"
                          variant="ghost"
                          justifyContent="flex-start"
                          leftIcon={<RiIdCardFill />}
                          bg={isActive("/aboutUs") ? activeBg : "transparent"}
                          _hover={{ bg: hoverBg }}
                          onClick={onClose}
                        >
                          About Us
                        </Button>

                        <Button
                          as={RouterLink}
                          to={`/${user.role}-dashboard`}
                          leftIcon={<FiUser />}
                          variant="ghost"
                          justifyContent="flex-start"
                          bg={
                            isActive(`/${user.role}-dashboard`)
                              ? activeBg
                              : "transparent"
                          }
                          _hover={{ bg: hoverBg }}
                          onClick={onClose}
                        >
                          Dashboard
                        </Button>
                        <Divider />
                        <Flex align="center" px={4} py={2}>
                          <Avatar
                            size="md"
                            name={getDisplayName(user)}
                            src={user.avatar}
                            mr={3}
                          />
                          <Box>
                            <Text fontWeight="medium">
                              {getDisplayName(user)}
                            </Text>
                            <Badge
                              colorScheme={
                                user.role === "admin" ? "purple" : "blue"
                              }
                            >
                              {user.role?.toUpperCase()}
                            </Badge>
                          </Box>
                        </Flex>
                        <Button
                          leftIcon={<FiLogOut />}
                          variant="ghost"
                          justifyContent="flex-start"
                          colorScheme="red"
                          onClick={() => {
                            handleLogout();
                            onClose();
                          }}
                          isLoading={isLoggingOut}
                          loadingText="Logging out..."
                        >
                          Logout
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button
                          as={RouterLink}
                          to="/"
                          leftIcon={<FiHome />}
                          variant="ghost"
                          justifyContent="flex-start"
                          bg={isActive("/") ? activeBg : "transparent"}
                          _hover={{ bg: hoverBg }}
                          onClick={onClose}
                        >
                          Home
                        </Button>
                        <Button
                          as={RouterLink}
                          to="/donateUs"
                          leftIcon={<FiCreditCard />}
                          variant="ghost"
                          justifyContent="flex-start"
                          bg={isActive("/donateUs") ? activeBg : "transparent"}
                          _hover={{ bg: hoverBg }}
                          onClick={onClose}
                        >
                          Donate Us
                        </Button>
                        <Button
                          as={RouterLink}
                          to="/aboutUs"
                          leftIcon={<RiIdCardFill />}
                          variant="ghost"
                          justifyContent="flex-start"
                          bg={isActive("/aboutUs") ? activeBg : "transparent"}
                          _hover={{ bg: hoverBg }}
                          onClick={onClose}
                        >
                          About Us
                        </Button>
                        <MotionButton
                          as={RouterLink}
                          to="/role-selection3/login"
                          leftIcon={<FiUser />}
                          colorScheme="red"
                          variant="solid"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={onClose}
                        >
                          Login
                        </MotionButton>
                      </>
                    )}
                  </VStack>
                </Box>
              </Slide>
            </Portal>
          </>
        ) : (
          <HStack spacing={4}>
            {isAuthenticated ? (
              <>
                <Tooltip label="Home" placement="bottom" hasArrow>
                  <Button
                    as={RouterLink}
                    to="/"
                    variant="ghost"
                    leftIcon={<FiHome />}
                    bg={isActive("/") ? activeBg : "transparent"}
                    _hover={{ bg: hoverBg }}
                  >
                    Home
                  </Button>
                </Tooltip>

                <Tooltip label="DonateUs" placement="bottom" hasArrow>
                  <Button
                    as={RouterLink}
                    to="/donateUs"
                    variant="ghost"
                    leftIcon={<FiCreditCard />}
                    bg={isActive("/donateUs") ? activeBg : "transparent"}
                    _hover={{ bg: hoverBg }}
                  >
                    Donate Us
                  </Button>
                </Tooltip>

                <Tooltip label="AboutUs" placement="bottom" hasArrow>
                  <Button
                    as={RouterLink}
                    to="/aboutUs"
                    variant="ghost"
                    leftIcon={<RiIdCardFill />}
                    bg={isActive("/aboutUs") ? activeBg : "transparent"}
                    _hover={{ bg: hoverBg }}
                  >
                    About Us
                  </Button>
                </Tooltip>

                <Tooltip label="Dashboard" placement="bottom" hasArrow>
                  <Button
                    as={RouterLink}
                    to={`/${user.role}-dashboard`}
                    variant="ghost"
                    leftIcon={<FiUser />}
                    bg={
                      isActive(`/${user.role}-dashboard`)
                        ? activeBg
                        : "transparent"
                    }
                    _hover={{ bg: hoverBg }}
                  >
                    Dashboard
                  </Button>
                </Tooltip>

                <Menu>
                  <MenuButton
                    as={Button}
                    variant="ghost"
                    px={2}
                    rounded="full"
                    _hover={{ bg: hoverBg }}
                  >
                    <HStack spacing={3}>
                      <Avatar
                        size="md"
                        name={getDisplayName(user)}
                        src={user.avatar}
                      />
                      <VStack spacing={0} align="center">
                        <Text fontSize="lg" fontWeight="medium">
                          {getDisplayName(user)}
                        </Text>
                        <Badge
                          colorScheme={
                            user.role === "admin" ? "purple" : "blue"
                          }
                        >
                          {user.role?.toUpperCase()}
                        </Badge>
                      </VStack>
                    </HStack>
                  </MenuButton>
                  <MenuList>
                    <MenuItem
                      width={"90%"}
                      icon={<FiLogOut />}
                      onClick={handleLogout}
                      _hover={{ bg: "red.50" }}
                      _focus={{ bg: "red.50" }}
                      isDisabled={isLoggingOut}
                    >
                      {isLoggingOut ? "Logging out..." : "Logout"}
                    </MenuItem>
                  </MenuList>
                </Menu>
              </>
            ) : (
              <>
                <Tooltip label="Home" placement="bottom" hasArrow>
                  <Button
                    as={RouterLink}
                    to="/"
                    variant="ghost"
                    leftIcon={<FiHome />}
                    bg={isActive("/") ? activeBg : "transparent"}
                    _hover={{ bg: hoverBg }}
                  >
                    Home
                  </Button>
                </Tooltip>
                <Tooltip label="DonateUs" placement="bottom" hasArrow>
                  <Button
                    as={RouterLink}
                    to="/donateUs"
                    variant="ghost"
                    leftIcon={<FiCreditCard />}
                    bg={isActive("/donateUs") ? activeBg : "transparent"}
                    _hover={{ bg: hoverBg }}
                  >
                    Donate Us
                  </Button>
                </Tooltip>

                <Tooltip label="AboutUs" placement="bottom" hasArrow>
                  <Button
                    as={RouterLink}
                    to="/aboutUs"
                    variant="ghost"
                    leftIcon={<RiIdCardFill />}
                    bg={isActive("/aboutUs") ? activeBg : "transparent"}
                    _hover={{ bg: hoverBg }}
                  >
                    About Us
                  </Button>
                </Tooltip>

                <MotionButton
                  as={RouterLink}
                  to="/role-selection/login"
                  colorScheme="red"
                  variant="solid"
                  leftIcon={<FiUser />}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Login
                </MotionButton>
              </>
            )}
          </HStack>
        )}
      </Flex>
    </>
  );
};

export default Navbar;

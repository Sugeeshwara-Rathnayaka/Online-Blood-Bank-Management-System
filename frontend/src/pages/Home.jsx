// import { Link } from "react-router-dom";
// import "../styles/Home.css";

// const Home = () => {
//   return (
//     <div className="home-container">
//       <header className="hero-section">
//         <h1>Welcome to Blood Donation System</h1>
//         <p>Save lives by donating blood or finding donors when in need</p>
//         <div className="cta-buttons">
//           <Link to="/login" className="cta-button primary">
//             Login
//           </Link>
//           <Link to="/register" className="cta-button secondary">
//             Register
//           </Link>
//         </div>
//       </header>

//       <section className="features-section">
//         {/* Add your feature cards here */}
//       </section>
//     </div>
//   );
// };

// export default Home;

import {
  Box,
  Flex,
  Heading,
  Text,
  Button,
  Grid,
  Icon,
  useColorModeValue,
} from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";
import {
  FaHeartbeat,
  FaHandsHelping,
  FaCalendarAlt,
  FaUsers,
} from "react-icons/fa";
import { useAuth } from "../contexts/AuthContext";

const Home = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const bgGradient = useColorModeValue(
    "linear(to-r, red.50, orange.50)",
    "linear(to-r, red.900, orange.900)"
  );
  //const buttonBg = useColorModeValue("red.500", "red.600");
  //const buttonHover = useColorModeValue("red.600", "red.700");

  const features = [
    {
      icon: FaHeartbeat,
      title: "Life-Saving Donations",
      description:
        "Join our network of donors to help save lives in your community.",
    },
    {
      icon: FaHandsHelping,
      title: "Easy Registration",
      description: "Quick and simple process to become a blood donor.",
    },
    {
      icon: FaCalendarAlt,
      title: "Schedule Donations",
      description: "Book appointments at your convenience.",
    },
    {
      icon: FaUsers,
      title: "Find Donors",
      description: "Connect with compatible donors when in need.",
    },
  ];

  return (
    <Box>
      {/* Hero Section */}
      <Flex
        direction="column"
        align="center"
        justify="center"
        minH="100vh"
        bgGradient={bgGradient}
        px={[4, 8, 16]}
        textAlign="center"
        position="relative"
        overflow="hidden"
        _before={{
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          bg: "url(/blood-drops-pattern.svg)",
          opacity: 0.05,
          zIndex: 0,
        }}
      >
        <Box position="relative" zIndex={1} maxW="4xl" mx="auto">
          <Heading
            as="h1"
            size={["2xl", "3xl", "4xl"]}
            mb={6}
            fontWeight="extrabold"
            lineHeight="1.2"
            bgGradient="linear(to-r, red.500, orange.500)"
            bgClip="text"
          >
            Welcome to BloodLink Donate Blood & Save Lives
          </Heading>

          <Text
            fontSize={["lg", "xl", "2xl"]}
            mb={10}
            color={useColorModeValue("gray.700", "gray.200")}
            maxW="2xl"
            mx="auto"
          >
            “<b>Volunteer blood donation”</b> is a safe and simple procedure
            that involves a donor giving one of the following blood products:
            whole blood, red blood cells, plasma, or platelets. Overview
            Volunteers donate all blood products used for transfusions performed
            in the United States to help people who are ill or injured, or who
            need blood for other reasons.
          </Text>

          <Flex justify="center" gap={4} flexWrap="wrap">
            {isAuthenticated ? (
              <>
                <Button
                  as={RouterLink}
                  to={`/${user?.role}-dashboard`}
                  size="lg"
                  colorScheme="red"
                  px={8}
                  py={6}
                  fontSize="lg"
                  fontWeight="bold"
                  boxShadow="lg"
                  _hover={{
                    transform: "translateY(-2px)",
                    boxShadow: "xl",
                  }}
                  transition="all 0.2s"
                >
                  Go to Dashboard
                </Button>
                <Button
                  as="a"
                  href="https://www.nhlbi.nih.gov/health-topics/blood-donation"
                  size="lg"
                  variant="outline"
                  colorScheme="red"
                  px={8}
                  py={6}
                  fontSize="lg"
                  fontWeight="bold"
                  _hover={{
                    bg: useColorModeValue("red.50", "red.900"),
                    transform: "translateY(-2px)",
                    boxShadow: "xl",
                  }}
                  transition="all 0.2s"
                >
                  Read More...
                </Button>
              </>
            ) : (
              <>
                <Button
                  as={RouterLink}
                  to="/role-selection"
                  size="lg"
                  colorScheme="red"
                  px={8}
                  py={6}
                  fontSize="lg"
                  fontWeight="bold"
                  boxShadow="lg"
                  _hover={{
                    transform: "translateY(-2px)",
                    boxShadow: "xl",
                  }}
                  rightIcon={<FaHeartbeat />}
                  transition="all 0.2s"
                >
                  Join Now
                </Button>
                <Button
                  as="a"
                  href="https://www.nhlbi.nih.gov/health-topics/blood-donation"
                  size="lg"
                  variant="outline"
                  colorScheme="red"
                  px={8}
                  py={6}
                  fontSize="lg"
                  fontWeight="bold"
                  _hover={{
                    bg: useColorModeValue("red.50", "red.900"),
                    transform: "translateY(-2px)",
                    boxShadow: "xl",
                  }}
                  transition="all 0.2s"
                >
                  Read More...
                </Button>
              </>
            )}
          </Flex>
        </Box>
      </Flex>

      {/* Features Section */}
      <Box
        py={20}
        px={[4, 8, 16]}
        bg={useColorModeValue("gray.50", "gray.800")}
      >
        <Box maxW="7xl" mx="auto">
          <Heading
            as="h2"
            textAlign="center"
            mb={16}
            fontSize={["3xl", "4xl"]}
            fontWeight="extrabold"
          >
            Why Donate With Us?
          </Heading>

          <Grid templateColumns={["1fr", "1fr 1fr", "repeat(4, 1fr)"]} gap={8}>
            {features.map((feature, index) => (
              <Box
                key={index}
                p={8}
                bg={useColorModeValue("white", "gray.700")}
                borderRadius="xl"
                boxShadow="md"
                textAlign="center"
                transition="all 0.3s"
                _hover={{
                  transform: "translateY(-5px)",
                  boxShadow: "xl",
                }}
              >
                <Icon as={feature.icon} w={12} h={12} mb={6} color="red.500" />
                <Heading as="h3" size="lg" mb={4}>
                  {feature.title}
                </Heading>
                <Text color={useColorModeValue("gray.600", "gray.300")}>
                  {feature.description}
                </Text>
              </Box>
            ))}
          </Grid>
        </Box>
      </Box>

      {/* Call to Action */}
      <Box
        py={20}
        px={[4, 8, 16]}
        bgGradient="linear(to-r, red.500, orange.500)"
        color="white"
        textAlign="center"
      >
        <Box maxW="4xl" mx="auto">
          <Heading as="h2" size="xl" mb={6}>
            Ready to Make a Difference?
          </Heading>
          <Text fontSize="xl" mb={10}>
            Every donation can save up to 3 lives. Join our community of
            life-savers today.
          </Text>
          <Button
            as={RouterLink}
            to={
              isAuthenticated ? `/${user?.role}-dashboard` : "/role-selection3"
            }
            size="lg"
            colorScheme="whiteAlpha"
            px={10}
            py={6}
            fontSize="xl"
            fontWeight="bold"
            _hover={{
              bg: "whiteAlpha.800",
              color: "red.500",
            }}
            rightIcon={<FaHeartbeat />}
            boxShadow="0 4px 20px rgba(0,0,0,0.2)"
          >
            {isAuthenticated ? "Go to Dashboard" : "Join Now"}
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default Home;

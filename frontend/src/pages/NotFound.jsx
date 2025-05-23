// import { Link } from "react-router-dom";
// import "../styles/NotFound.css";

// const NotFound = () => {
//   return (
//     <div className="not-found-container">
//       <div className="not-found-content">
//         <h1>404</h1>
//         <h2>Page Not Found</h2>
//         <p>The page you're looking for doesn't exist or has been moved.</p>
//         <Link to="/" className="home-link">
//           Return to Login
//         </Link>
//       </div>
//     </div>
//   );
// };

// export default NotFound;
import { keyframes } from "@emotion/react";
import {
  Box,
  Heading,
  Text,
  Button,
  Flex,
  VStack,
  useColorModeValue,
} from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";
import { FaHome, FaExclamationTriangle } from "react-icons/fa";

const NotFound = () => {
  const pulse = keyframes`
    0% { transform: scale(1); }
    50% { transform: scale(1.05); }
    100% { transform: scale(1); }
  `;

  const bgGradient = useColorModeValue(
    "linear(to-b, red.50, white)",
    "linear(to-b, red.900, gray.800)"
  );

  return (
    <Flex
      minH="100vh"
      align="center"
      justify="center"
      bgGradient={bgGradient}
      px={4}
    >
      <VStack
        textAlign="center"
        spacing={6}
        maxW="md"
        p={8}
        bg={useColorModeValue("white", "gray.700")}
        borderRadius="xl"
        boxShadow="xl"
        position="relative"
        _before={{
          content: '""',
          position: "absolute",
          top: -2,
          left: -2,
          right: -2,
          bottom: -2,
          bgGradient: "linear(to-r, red.500, orange.500)",
          borderRadius: "xl",
          zIndex: -1,
          animation: `${pulse} 2s infinite`,
        }}
      >
        <Box color="red.500">
          <FaExclamationTriangle size="4rem" />
        </Box>

        <Heading
          as="h1"
          size="4xl"
          fontWeight="extrabold"
          bgGradient="linear(to-r, red.500, orange.500)"
          bgClip="text"
        >
          404
        </Heading>

        <Heading as="h2" size="xl">
          Page Not Found
        </Heading>

        <Text fontSize="lg" color={useColorModeValue("gray.600", "gray.300")}>
          The page you're looking for doesn't exist or has been moved.
        </Text>

        <Button
          as={RouterLink}
          to="/"
          colorScheme="red"
          size="lg"
          leftIcon={<FaHome />}
          mt={4}
          px={8}
          py={6}
          _hover={{
            transform: "translateY(-2px)",
            boxShadow: "lg",
          }}
          transition="all 0.2s"
        >
          Return to Home
        </Button>
      </VStack>
    </Flex>
  );
};

export default NotFound;

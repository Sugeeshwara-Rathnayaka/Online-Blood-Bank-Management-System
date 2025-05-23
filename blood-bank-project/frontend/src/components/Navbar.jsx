// import React, { useContext, useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import { Context } from "../main";
// import axios from "axios";
// import { toast } from "react-toastify";
// import { GiHamburgerMenu } from "react-icons/gi";

// const Navbar = () => {
//   const [show, setShow] = useState(false);
//   const { isAuthenticated, setIsAuthenticated } = useContext(Context);

//   const navigateTo = useNavigate();

//   const handleLogout = async () => {
//     await axios
//       .get("http://localhost:4000/api/v1/user/patient/logout", {
//         withCredentials: true,
//       })
//       .then((res) => {
//         toast.success(res.data.message);
//         setIsAuthenticated(false);
//       })
//       .catch((err) => {
//         toast.error(err.response.data.message);
//       });
//   };
//   const gotoLog_reg = () => {
//     navigateTo("/reg_log");
//   };

//   return (
//     <nav className="container">
//       <div className="logo">
//         <img src="/logo.png" alt="logo" className="logo-img" />
//       </div>
//       <div className={show ? "navLinks showmenu" : "navLinks"}>
//         <div className="links">
//           <Link to={"/"}>HOME</Link>
//           <Link to={"/appointment"}>DONATE US</Link>
//           <Link to={"/about"}>ABOUT US</Link>
//         </div>
//         {isAuthenticated ? (
//           <button className="logoutBtn btn" onClick={handleLogout}>
//             LOGOUT
//           </button>
//         ) : (
//           <button className="logoutBtn btn" onClick={gotoLog_reg}>
//             LOGIN
//           </button>
//         )}
//       </div>
//       <div className="hamburger" onClick={() => setShow(!show)}>
//         <GiHamburgerMenu />
//       </div>
//     </nav>
//   );
// };

// export default Navbar;

import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Context } from "../main";
import axios from "axios";
import { toast } from "react-toastify";
import { GiHamburgerMenu } from "react-icons/gi";
import {
  Box,
  Flex,
  Image,
  Button,
  useDisclosure,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerBody,
  VStack,
  IconButton,
  useBreakpointValue,
} from "@chakra-ui/react";

const Navbar = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { isAuthenticated, setIsAuthenticated } = useContext(Context);
  const navigateTo = useNavigate();

  const isMobile = useBreakpointValue({ base: true, md: false });

  const handleLogout = async () => {
    await axios
      .get("http://localhost:4000/api/v1/user/patient/logout", {
        withCredentials: true,
      })
      .then((res) => {
        toast.success(res.data.message);
        setIsAuthenticated(false);
        if (isMobile) onClose();
      })
      .catch((err) => {
        toast.error(err.response.data.message);
      });
  };

  const gotoLog_reg = () => {
    navigateTo("/reg_log");
    if (isMobile) onClose();
  };

  return (
    <Flex
      as="nav"
      align="center"
      justify="space-between"
      wrap="wrap"
      padding="1.5rem"
      bg="white"
      boxShadow="md"
    >
      <Box>
        <Image src="/logo.png" alt="logo" maxH="50px" />
      </Box>

      {!isMobile ? (
        <Flex align="center">
          <Flex mr={10}>
            <Link to="/" style={{ margin: "0 1rem" }}>
              HOME
            </Link>
            <Link to="/appointment" style={{ margin: "0 1rem" }}>
              DONATE US
            </Link>
            <Link to="/about" style={{ margin: "0 1rem" }}>
              ABOUT US
            </Link>
          </Flex>
          {isAuthenticated ? (
            <Button colorScheme="red" onClick={handleLogout}>
              LOGOUT
            </Button>
          ) : (
            <Button colorScheme="blue" onClick={gotoLog_reg}>
              LOGIN
            </Button>
          )}
        </Flex>
      ) : (
        <>
          <IconButton
            icon={<GiHamburgerMenu />}
            variant="outline"
            onClick={onOpen}
            aria-label="Open menu"
          />
          <Drawer placement="right" onClose={onClose} isOpen={isOpen}>
            <DrawerOverlay />
            <DrawerContent>
              <DrawerBody>
                <VStack spacing={4} align="stretch" mt={10}>
                  <Link to="/" onClick={onClose}>
                    HOME
                  </Link>
                  <Link to="/appointment" onClick={onClose}>
                    DONATE US
                  </Link>
                  <Link to="/about" onClick={onClose}>
                    ABOUT US
                  </Link>
                  {isAuthenticated ? (
                    <Button colorScheme="red" onClick={handleLogout}>
                      LOGOUT
                    </Button>
                  ) : (
                    <Button colorScheme="blue" onClick={gotoLog_reg}>
                      LOGIN
                    </Button>
                  )}
                </VStack>
              </DrawerBody>
            </DrawerContent>
          </Drawer>
        </>
      )}
    </Flex>
  );
};

export default Navbar;

import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { ChakraProvider, extendTheme } from "@chakra-ui/react";
import { ErrorBoundary } from "./components/ErrorBoundary";
import App from "./App";
import { AuthProvider } from "./contexts/AuthContext";
import "./index.css";
import Navbar from "./components/Navbar";

// Define custom theme (light mode only)
const theme = extendTheme({
  colors: {
    brand: {
      500: "#6366f1", // Custom brand color
    },
  },
  fonts: {
    heading: "'Inter', sans-serif",
    body: "'Inter', sans-serif",
  },
});

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ErrorBoundary>
      <BrowserRouter>
        <AuthProvider>
          <ChakraProvider theme={theme}>
            <Navbar />
            <App />
          </ChakraProvider>
        </AuthProvider>
      </BrowserRouter>
    </ErrorBoundary>
  </React.StrictMode>
);

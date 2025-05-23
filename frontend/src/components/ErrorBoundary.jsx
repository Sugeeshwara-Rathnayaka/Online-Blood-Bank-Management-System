import { Box, Button, Heading, Text } from "@chakra-ui/react";
import { Component } from "react";

export class ErrorBoundary extends Component {
  state = { hasError: false, error: null };

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return (
        <Box p={8} textAlign="center">
          <Heading mb={4}>Something went wrong</Heading>
          <Text mb={6}>{this.state.error.message}</Text>
          <Button colorScheme="blue" onClick={() => window.location.reload()}>
            Refresh Page
          </Button>
        </Box>
      );
    }
    return this.props.children;
  }
}

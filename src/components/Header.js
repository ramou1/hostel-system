import React from "react";
import {
  Flex,
  Heading,
  IconButton,
  Avatar,
} from "@chakra-ui/react";
import { FiMessageSquare, FiBell, FiUser } from "react-icons/fi";
import { useLocation } from "react-router-dom";

function Header() {
  const location = useLocation();
  const pageTitle = getPageTitle(location.pathname);

  function getPageTitle(pathname) {
    switch (pathname) {
      case "/":
        return "Dashboard";
      case "/clients":
        return "Clients";
      case "/rooms":
        return "Rooms";
      default:
        return "Page";
    }
  }

  return (
    <Flex justifyContent="space-between" alignItems="center" mb={6}>
      <Heading as="h1">{pageTitle}</Heading>
      <Flex alignItems="center">
        <IconButton
          aria-label="MessageSquare"
          icon={<FiMessageSquare />}
          variant="ghost"
          size='lg'
        />
        <IconButton
          aria-label="Notifications"
          icon={<FiBell />}
          variant="ghost"
          size='lg'
        />
        {/* <IconButton aria-label="Profile" icon={<FiUser />} variant="ghost" /> */}
        <Avatar
          size="sm"
          bg="teal.500"
          // src="https://bit.ly/dan-abramov"
        />
      </Flex>
    </Flex>
  );
}

export default Header;

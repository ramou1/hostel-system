import React from 'react';
import { Flex, Heading, IconButton } from '@chakra-ui/react';
import { FiBell, FiUser } from 'react-icons/fi';
import { useLocation } from 'react-router-dom';

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
      <Heading size="lg">{pageTitle}</Heading>
      <Flex alignItems="center">
        <IconButton aria-label="Notifications" icon={<FiBell />} variant="ghost" />
        <IconButton aria-label="Profile" icon={<FiUser />} variant="ghost" />
      </Flex>
    </Flex>
  );
}

export default Header;

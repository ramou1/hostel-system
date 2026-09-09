import React from "react";
import {
  Box,
  Flex,
  VStack,
  Text,
  Icon,
  Image,
  Tooltip,
  useColorModeValue,
} from "@chakra-ui/react";
import { NavLink } from "react-router-dom";
import { FiHome, FiUsers, FiKey, FiMessageSquare } from "react-icons/fi";
import { useI18n } from "../contexts/LanguageContext";

function NavItem({ to, icon, label, collapsed, end, onNavigate }) {
  const activeBg = useColorModeValue("brand.500", "brand.500");
  const activeColor = "white";
  const idleColor = useColorModeValue("gray.600", "gray.300");
  const hoverBg = useColorModeValue("brand.50", "whiteAlpha.100");

  return (
    <Tooltip
      label={label}
      placement="right"
      isDisabled={!collapsed}
      hasArrow
      openDelay={200}
    >
      <Box
        as={NavLink}
        to={to}
        end={end}
        onClick={onNavigate}
        w="100%"
        _activeLink={{
          bg: activeBg,
          color: activeColor,
          boxShadow: "sm",
        }}
        color={idleColor}
        _hover={{ bg: hoverBg, textDecoration: "none" }}
        borderRadius="12px"
        transition="all 0.15s ease"
        display="block"
      >
        <Flex
          align="center"
          justify={collapsed ? "center" : "flex-start"}
          gap={collapsed ? 0 : 3}
          px={collapsed ? 0 : 4}
          py={3}
        >
          <Icon as={icon} boxSize={5} />
          {!collapsed && (
            <Text fontSize="sm" fontWeight={600}>
              {label}
            </Text>
          )}
        </Flex>
      </Box>
    </Tooltip>
  );
}

function Sidebar({ collapsed = false, onNavigate }) {
  const { t } = useI18n();
  const bg = useColorModeValue("white", "gray.800");
  const border = useColorModeValue("gray.100", "gray.700");
  const brandText = useColorModeValue("gray.800", "white");

  const items = [
    { to: "/", icon: FiHome, label: t("nav.dashboard"), end: true },
    { to: "/clients", icon: FiUsers, label: t("nav.clients") },
    { to: "/rooms", icon: FiKey, label: t("nav.rooms") },
    { to: "/messages", icon: FiMessageSquare, label: t("nav.messages") },
  ];

  return (
    <Flex
      direction="column"
      h="100%"
      bg={bg}
      borderRight="1px solid"
      borderColor={border}
      py={5}
      px={collapsed ? 2 : 4}
    >
      {/* Marca */}
      <Flex
        align="center"
        justify={collapsed ? "center" : "flex-start"}
        gap={3}
        px={collapsed ? 0 : 2}
        mb={8}
        minH="44px"
      >
        <Image
          src="/images/logo-collapsed.png"
          alt="HostelZim"
          boxSize="36px"
          objectFit="contain"
        />
        {!collapsed && (
          <Text
            fontSize="xl"
            fontWeight={800}
            color={brandText}
            letterSpacing="-0.02em"
          >
            Hostel<Box as="span" color="brand.500">Zim</Box>
          </Text>
        )}
      </Flex>

      {/* Navegação */}
      <VStack spacing={1} align="stretch" flex="1">
        {items.map((item) => (
          <NavItem
            key={item.to}
            {...item}
            collapsed={collapsed}
            onNavigate={onNavigate}
          />
        ))}
      </VStack>

      {/* Rodapé */}
      {!collapsed && (
        <Text fontSize="xs" color="gray.500" px={2} pt={4}>
          © {new Date().getFullYear()} HostelZim
        </Text>
      )}
    </Flex>
  );
}

export default Sidebar;

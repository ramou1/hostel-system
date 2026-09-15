import React from "react";
import {
  Box,
  Flex,
  VStack,
  Text,
  Icon,
  Image,
  Avatar,
  Tooltip,
  useColorModeValue,
} from "@chakra-ui/react";
import { NavLink } from "react-router-dom";
import { FiHome, FiUsers, FiKey } from "react-icons/fi";
import { useI18n } from "../contexts/LanguageContext";
import BrandLogo from "./BrandLogo";

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
  const tenantBg = useColorModeValue("gray.50", "whiteAlpha.100");

  // Hostel fictício atualmente selecionado (futuro seletor multi-hostel)
  const currentHostel = "Hostel Pé na Areia";

  const items = [
    { to: "/app", icon: FiHome, label: t("nav.dashboard"), end: true },
    { to: "/app/clients", icon: FiUsers, label: t("nav.clients") },
    { to: "/app/rooms", icon: FiKey, label: t("nav.rooms") },
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
        px={collapsed ? 0 : 2}
        mb={8}
        minH="44px"
      >
        {collapsed ? (
          <Image
            src="/images/logo-collapsed.png"
            alt="Hostely"
            boxSize="36px"
            objectFit="contain"
          />
        ) : (
          <BrandLogo height="34px" />
        )}
      </Flex>

      {/* Hostel selecionado */}
      {collapsed ? (
        <Tooltip label={currentHostel} placement="right" hasArrow openDelay={200}>
          <Flex justify="center" mb={6}>
            <Avatar size="sm" name={currentHostel} bg="brand.500" color="white" />
          </Flex>
        </Tooltip>
      ) : (
        <Flex align="center" gap={2.5} bg={tenantBg} borderRadius="12px" p={2.5} mb={6}>
          <Avatar size="sm" name={currentHostel} bg="brand.500" color="white" />
          <Box lineHeight="1.2" overflow="hidden">
            <Text
              fontSize="10px"
              color="gray.500"
              textTransform="uppercase"
              letterSpacing="wider"
              fontWeight={700}
            >
              Hostel
            </Text>
            <Text fontSize="sm" fontWeight={700} color={brandText} noOfLines={1}>
              {currentHostel}
            </Text>
          </Box>
        </Flex>
      )}

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
          © {new Date().getFullYear()} Hostely
        </Text>
      )}
    </Flex>
  );
}

export default Sidebar;

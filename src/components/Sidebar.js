import React, { useEffect, useState } from "react";
import {
  Box,
  Flex,
  VStack,
  Text,
  Icon,
  Image,
  Avatar,
  Tooltip,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  IconButton,
  useColorModeValue,
} from "@chakra-ui/react";
import { NavLink, Link as RouterLink } from "react-router-dom";
import { FiHome, FiUsers, FiKey, FiShoppingBag, FiChevronDown, FiPlus } from "react-icons/fi";
import { useI18n } from "../contexts/LanguageContext";
import BrandLogo from "./BrandLogo";
import {
  loadHostel,
  loadHostels,
  setActiveHostel,
  canAddHostel,
} from "../data/store";

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

  const [hostel, setHostel] = useState(loadHostel);
  const [hostels, setHostels] = useState(loadHostels);
  const [allowAdd, setAllowAdd] = useState(canAddHostel);
  const currentHostel = hostel?.name || "Hostel";

  useEffect(() => {
    const refresh = () => {
      setHostel(loadHostel());
      setHostels(loadHostels());
      setAllowAdd(canAddHostel());
    };
    const onStorage = (e) => {
      if (
        e.key === "hostelzim:hostel" ||
        e.key === "hostelzim:hostels" ||
        e.key === "hostelzim:activeHostelId"
      ) {
        refresh();
      }
    };
    window.addEventListener("hostelzim:hostel-updated", refresh);
    window.addEventListener("storage", onStorage);
    return () => {
      window.removeEventListener("hostelzim:hostel-updated", refresh);
      window.removeEventListener("storage", onStorage);
    };
  }, []);

  const switchHostel = (id) => {
    setHostel(setActiveHostel(id));
    setHostels(loadHostels());
    if (onNavigate) onNavigate();
  };

  const items = [
    { to: "/app", icon: FiHome, label: t("nav.dashboard"), end: true },
    { to: "/app/clients", icon: FiUsers, label: t("nav.clients") },
    { to: "/app/rentals", icon: FiShoppingBag, label: t("nav.rentals") },
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
      {/* Marca → painel */}
      <Flex
        as={NavLink}
        to="/app"
        end
        onClick={onNavigate}
        align="center"
        justify={collapsed ? "center" : "flex-start"}
        px={collapsed ? 0 : 2}
        mb={8}
        minH="44px"
        _hover={{ textDecoration: "none", opacity: 0.85 }}
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

      {/* Hostel selecionado (único acesso à página Hostel) */}
      {collapsed ? (
        <Tooltip label={currentHostel} placement="right" hasArrow openDelay={200}>
          <Flex
            as={NavLink}
            to="/app/hostel"
            onClick={onNavigate}
            justify="center"
            mb={6}
            _hover={{ textDecoration: "none" }}
          >
            <Avatar size="sm" name={currentHostel} bg="brand.500" color="white" />
          </Flex>
        </Tooltip>
      ) : (
        <Flex
          align="center"
          gap={1}
          bg={tenantBg}
          borderRadius="12px"
          p={2.5}
          mb={6}
        >
          <Flex
            as={NavLink}
            to="/app/hostel"
            onClick={onNavigate}
            align="center"
            gap={2.5}
            flex="1"
            minW={0}
            _hover={{ textDecoration: "none", opacity: 0.9 }}
          >
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
          <Menu placement="bottom-end">
            <MenuButton
              as={IconButton}
              aria-label={t("registerHostel.switchHostel")}
              icon={<FiChevronDown />}
              size="sm"
              variant="ghost"
            />
            <MenuList>
              {hostels.map((item) => (
                <MenuItem
                  key={item.id}
                  onClick={() => switchHostel(item.id)}
                  fontWeight={item.id === hostel.id ? 700 : 400}
                >
                  {item.name || t("nav.hostel")}
                </MenuItem>
              ))}
              {allowAdd && (
                <>
                  <MenuDivider />
                  <MenuItem
                    as={RouterLink}
                    to="/app/hostel/novo"
                    icon={<FiPlus />}
                    onClick={onNavigate}
                  >
                    {t("registerHostel.addNew")}
                  </MenuItem>
                </>
              )}
            </MenuList>
          </Menu>
        </Flex>
      )}

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

      {!collapsed && (
        <Text fontSize="xs" color="gray.500" px={2} pt={4}>
          © {new Date().getFullYear()} Hostely
        </Text>
      )}
    </Flex>
  );
}

export default Sidebar;

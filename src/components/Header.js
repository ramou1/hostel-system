import React from "react";
import {
  Flex,
  Heading,
  IconButton,
  Avatar,
  HStack,
  Box,
  Text,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverHeader,
  PopoverBody,
  PopoverArrow,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  Button,
  VStack,
  Badge,
  useColorModeValue,
  useDisclosure,
} from "@chakra-ui/react";
import { FiBell, FiSettings, FiLogOut, FiMenu } from "react-icons/fi";
import { useLocation, useNavigate } from "react-router-dom";
import { useI18n } from "../contexts/LanguageContext";
import { useAuth } from "../contexts/AuthContext";
import SettingsModal from "./SettingsModal";

const TITLE_MAP = {
  "/app": "nav.dashboard",
  "/app/clients": "nav.clients",
  "/app/rooms": "nav.rooms",
};

// Item de notificação no popover
function NotificationRow({ item, hoverBg, dotColor }) {
  return (
    <Flex gap={3} p={2} borderRadius="10px" _hover={{ bg: hoverBg }} cursor="pointer">
      <Box mt={1.5} w={2} h={2} borderRadius="full" bg={dotColor} flexShrink={0} />
      <Box flex="1" minW={0}>
        <Flex justify="space-between" align="center">
          <Text fontSize="sm" fontWeight={600} noOfLines={1}>
            {item.title}
          </Text>
          <Text fontSize="xs" color="gray.500" flexShrink={0} ml={2}>
            {item.time}
          </Text>
        </Flex>
        <Text fontSize="xs" color="gray.500" noOfLines={1}>
          {item.text}
        </Text>
      </Box>
    </Flex>
  );
}

function Header({ onOpenMenu, profile, onSaveProfile }) {
  const { t } = useI18n();
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();
  const settings = useDisclosure();

  const handleLogout = () => {
    logout();
    navigate("/", { replace: true });
  };

  const pageTitle = t(TITLE_MAP[location.pathname] || "nav.dashboard");
  const notifications = t("header.notifications.items");

  const popoverBg = useColorModeValue("white", "gray.800");
  const hoverBg = useColorModeValue("gray.50", "whiteAlpha.100");
  const iconColor = useColorModeValue("gray.600", "gray.300");

  return (
    <>
      <Flex
        as="header"
        justify="space-between"
        align="center"
        mb={6}
        gap={4}
      >
        <Flex align="center" gap={3} minW={0}>
          <IconButton
            aria-label={t("header.openMenu")}
            icon={<FiMenu />}
            variant="ghost"
            onClick={onOpenMenu}
            display={{ base: "inline-flex", md: "none" }}
          />
          <Heading as="h1" fontSize={{ base: "lg", md: "xl" }} noOfLines={1}>
            {pageTitle}
          </Heading>
        </Flex>

        {/* Ações: espaçamento padronizado entre todos os ícones */}
        <HStack spacing={{ base: 1, md: 2 }}>
          {/* Notificações */}
          <Popover placement="bottom-end" isLazy>
            <PopoverTrigger>
              <Box position="relative" display="inline-flex">
                <IconButton
                  aria-label={t("header.notifications.title")}
                  icon={<FiBell />}
                  variant="ghost"
                  fontSize="20px"
                  color={iconColor}
                />
                <Badge
                  position="absolute"
                  top="0"
                  right="0"
                  colorScheme="red"
                  borderRadius="full"
                  fontSize="0.6rem"
                  px={1.5}
                >
                  {notifications.length}
                </Badge>
              </Box>
            </PopoverTrigger>
            <PopoverContent bg={popoverBg} w="320px" borderRadius="14px" boxShadow="xl">
              <PopoverArrow bg={popoverBg} />
              <PopoverHeader fontWeight={700} border="0" pb={1}>
                {t("header.notifications.title")}
              </PopoverHeader>
              <PopoverBody px={2}>
                <VStack align="stretch" spacing={0}>
                  {notifications.map((item, i) => (
                    <NotificationRow
                      key={i}
                      item={item}
                      hoverBg={hoverBg}
                      dotColor="brand.500"
                    />
                  ))}
                </VStack>
                <Button variant="ghost" size="sm" w="100%" mt={2} colorScheme="brand">
                  {t("common.markAllRead")}
                </Button>
              </PopoverBody>
            </PopoverContent>
          </Popover>

          {/* Perfil */}
          <Menu placement="bottom-end">
            <MenuButton
              as={IconButton}
              variant="ghost"
              borderRadius="full"
              icon={
                <Avatar
                  size="sm"
                  name={profile?.name}
                  src={profile?.photo}
                  bg="brand.500"
                  color="white"
                />
              }
              aria-label={profile?.name || "Perfil"}
            />
            <MenuList borderRadius="14px">
              <Box px={3} py={2}>
                <Text fontWeight={700} fontSize="sm" noOfLines={1}>
                  {profile?.name}
                </Text>
                <Text fontSize="xs" color="gray.500" noOfLines={1}>
                  {profile?.email}
                </Text>
              </Box>
              <MenuDivider />
              <MenuItem icon={<FiSettings />} onClick={settings.onOpen}>
                {t("header.profile.settings")}
              </MenuItem>
              <MenuItem icon={<FiLogOut />} color="red.400" onClick={handleLogout}>
                {t("header.profile.logout")}
              </MenuItem>
            </MenuList>
          </Menu>
        </HStack>
      </Flex>

      <SettingsModal
        isOpen={settings.isOpen}
        onClose={settings.onClose}
        profile={profile}
        onSave={onSaveProfile}
      />
    </>
  );
}

export default Header;

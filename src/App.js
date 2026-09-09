import React, { useState, useEffect } from "react";
import {
  Box,
  IconButton,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  useColorModeValue,
  useDisclosure,
} from "@chakra-ui/react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { Route, Routes } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Clients from "./pages/Clients";
import Rooms from "./pages/Rooms";
import Messages from "./pages/Messages";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import "./App.css";

const PROFILE_KEY = "hostelzim:profile";

const DEFAULT_PROFILE = {
  name: "Admin HostelZim",
  email: "admin@hostelzim.com",
  photo: "",
  emailNotifications: true,
};

function loadProfile() {
  try {
    const saved = localStorage.getItem(PROFILE_KEY);
    return saved ? { ...DEFAULT_PROFILE, ...JSON.parse(saved) } : DEFAULT_PROFILE;
  } catch {
    return DEFAULT_PROFILE;
  }
}

function App() {
  const [collapsed, setCollapsed] = useState(false);
  const [profile, setProfile] = useState(loadProfile);
  const mobileNav = useDisclosure();

  useEffect(() => {
    localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
  }, [profile]);

  const sidebarWidth = collapsed ? "84px" : "248px";
  const contentBg = useColorModeValue("gray.50", "gray.900");
  const toggleBg = useColorModeValue("white", "gray.700");
  const toggleColor = useColorModeValue("gray.600", "gray.200");

  return (
    <Box minH="100vh" bg={contentBg}>
      {/* Sidebar fixa (desktop) */}
      <Box
        position="fixed"
        top={0}
        left={0}
        h="100vh"
        w={sidebarWidth}
        display={{ base: "none", md: "block" }}
        transition="width 0.2s ease"
        zIndex={20}
      >
        <Sidebar collapsed={collapsed} />
        <IconButton
          aria-label={collapsed ? "Expandir menu" : "Recolher menu"}
          icon={collapsed ? <FiChevronRight /> : <FiChevronLeft />}
          size="sm"
          borderRadius="full"
          bg={toggleBg}
          color={toggleColor}
          boxShadow="md"
          position="absolute"
          top="28px"
          right="-14px"
          onClick={() => setCollapsed((prev) => !prev)}
          _hover={{ bg: "brand.500", color: "white" }}
        />
      </Box>

      {/* Drawer (mobile) */}
      <Drawer
        isOpen={mobileNav.isOpen}
        placement="left"
        onClose={mobileNav.onClose}
      >
        <DrawerOverlay />
        <DrawerContent maxW="248px">
          <Sidebar collapsed={false} onNavigate={mobileNav.onClose} />
        </DrawerContent>
      </Drawer>

      {/* Conteúdo */}
      <Box
        ml={{ base: 0, md: sidebarWidth }}
        transition="margin-left 0.2s ease"
        minH="100vh"
      >
        <Box
          px={{ base: 4, md: 8 }}
          py={{ base: 4, md: 6 }}
          maxW="1440px"
          mx="auto"
        >
          <Header
            onOpenMenu={mobileNav.onOpen}
            profile={profile}
            onSaveProfile={setProfile}
          />
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/clients" element={<Clients />} />
            <Route path="/rooms" element={<Rooms />} />
            <Route path="/messages" element={<Messages />} />
          </Routes>
        </Box>
      </Box>
    </Box>
  );
}

export default App;

import {
  ChakraProvider,
  Box,
  Flex,
  IconButton,
  useColorMode,
  ButtonGroup,
} from "@chakra-ui/react";
import { FiHome, FiUsers, FiKey, FiSun, FiMoon, FiChevronLeft, FiChevronRight } from "react-icons/fi";
import Dashboard from "./pages/Dashboard";
import Clients from "./pages/Clients";
import Rooms from "./pages/Rooms";
import { Route, Routes, Link } from "react-router-dom";
import Header from "./components/Header";
import { useState } from "react";
import "./App.css";

function App() {
  const [isMenuCollapsed, setIsMenuCollapsed] = useState(false);
  const { colorMode, toggleColorMode } = useColorMode(); // Corrigir para usar toggleColorMode

  const handleMenuToggle = () => {
    setIsMenuCollapsed((prev) => !prev);
  };

  return (
    <ChakraProvider>
      <Flex className="app-container">
        <Box
          as="nav"
          className={`sidebar ${isMenuCollapsed ? "collapsed" : ""}`}
        >
          <Flex className="menu-header">
            <img
              src="/images/logo-collapsed.png"
              alt="Collapsed Logo"
              className={`logo ${
                isMenuCollapsed ? "collapsed-logo" : "full-logo"
              }`}
            />
            <IconButton
              aria-label={isMenuCollapsed ? "Expand Menu" : "Collapse Menu"}
              icon={isMenuCollapsed ? <FiChevronRight /> : <FiChevronLeft />}
              onClick={handleMenuToggle}
              variant="solid"
              colorScheme="blue"
              className="collapse-btn"
              borderRadius="full"
              size="sm"
              fontSize="16px"
            />
          </Flex>
          <ul>
            <li>
              <Link
                to="/"
                className={`menu-item ${
                  window.location.pathname === "/" ? "active" : ""
                }`}
              >
                <FiHome size={20} />
                {!isMenuCollapsed && "Dashboard"}
              </Link>
            </li>
            <li>
              <Link
                to="/clients"
                className={`menu-item ${
                  window.location.pathname === "/clients" ? "active" : ""
                }`}
              >
                <FiUsers size={20} />
                {!isMenuCollapsed && "Clients"}
              </Link>
            </li>
            <li>
              <Link
                to="/rooms"
                className={`menu-item ${
                  window.location.pathname === "/rooms" ? "active" : ""
                }`}
              >
                <FiKey size={20} />
                {!isMenuCollapsed && "Rooms"}
              </Link>
            </li>
          </ul>
          <Box className="footer">
            {/* Mostrar ambos os ícones quando o menu estiver expandido */}
            {isMenuCollapsed ? (
              // Mostrar apenas o ícone ativo quando o menu estiver retraído
              <IconButton
                icon={colorMode === "light" ? <FiSun /> : <FiMoon />}
                aria-label="Toggle color mode"
                onClick={toggleColorMode}
              />
            ) : (
              // Mostrar ambos os ícones quando o menu estiver expandido
              <ButtonGroup isAttached>
                <IconButton
                  icon={<FiSun />}
                  aria-label="Light mode"
                  onClick={() => colorMode === "dark" && toggleColorMode()}
                  isDisabled={colorMode === "light"}
                />
                <IconButton
                  icon={<FiMoon />}
                  aria-label="Dark mode"
                  onClick={() => colorMode === "light" && toggleColorMode()}
                  isDisabled={colorMode === "dark"}
                />
              </ButtonGroup>
            )}
          </Box>
        </Box>

        <Box className={`page-content ${isMenuCollapsed ? "collapsed" : ""}`}>
          <Header />
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/clients" element={<Clients />} />
            <Route path="/rooms" element={<Rooms />} />
          </Routes>
        </Box>
      </Flex>
    </ChakraProvider>
  );
}

export default App;

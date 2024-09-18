import {
  ChakraProvider,
  Box,
  Flex,
  Button,
  IconButton,
} from "@chakra-ui/react";
import { Route, Routes, Link } from "react-router-dom";
import {
  FiHome,
  FiUsers,
  FiKey,
  FiGrid,
  FiChevronLeft,
  FiChevronRight,
} from "react-icons/fi";
import Dashboard from "./pages/Dashboard";
import Clients from "./pages/Clients";
import Rooms from "./pages/Rooms";
import Header from "./components/Header";
import { useState } from "react";
import "./App.css"; // Certifique-se de ter um arquivo CSS para estilos personalizados

function App() {
  const [isMenuCollapsed, setIsMenuCollapsed] = useState(false);

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
              colorScheme="blue" // Escolha a cor desejada
              className="collapse-btn"
              borderRadius="full" // Faz o botão redondo
              size="sm" // Ajusta o tamanho do botão
              fontSize="16px" // Ajusta o tamanho do ícone
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
            <Button size="sm" colorScheme="blue" fontSize="12px">
              {isMenuCollapsed ? (
                <FiGrid className="icon" />
              ) : (
                "UPGRADE PLAN"
              )}
            </Button>
          </Box>
        </Box>

        {/* Conteúdo principal */}
        <Box className={`page-content ${isMenuCollapsed ? "collapsed" : ""}`}>
          {/* Header */}
          <Header />

          {/* Rotas para as páginas */}
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

import React, { useState } from "react";
import {
  Flex,
  Box,
  Card,
  CardBody,
  Heading,
  Text,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  IconButton,
  Button,
  Checkbox,
  Alert,
  AlertIcon,
  Link as ChakraLink,
  useColorModeValue,
} from "@chakra-ui/react";
import { FiEye, FiEyeOff, FiArrowLeft } from "react-icons/fi";
import { Link as RouterLink, useNavigate, useLocation, Navigate } from "react-router-dom";
import { useI18n } from "../contexts/LanguageContext";
import { useAuth, DEMO_CREDENTIALS } from "../contexts/AuthContext";
import BrandLogo from "../components/BrandLogo";

function Login() {
  const { t } = useI18n();
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState(DEMO_CREDENTIALS.email);
  const [password, setPassword] = useState(DEMO_CREDENTIALS.password);
  const [keepConnected, setKeepConnected] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(false);

  const pageBg = useColorModeValue("gray.100", "gray.900");
  const muted = useColorModeValue("gray.500", "gray.400");
  const hintBg = useColorModeValue("gray.50", "whiteAlpha.100");

  const from = location.state?.from?.pathname || "/app";

  // Se já estiver logado, vai direto para o painel
  if (isAuthenticated) return <Navigate to="/app" replace />;

  const handleSubmit = (e) => {
    e.preventDefault();
    const result = login(email, password, keepConnected);
    if (result.ok) {
      navigate(from, { replace: true });
    } else {
      setError(true);
    }
  };

  return (
    <Flex minH="100vh" bg={pageBg} align="center" justify="center" p={4}>
      <Box w="100%" maxW="420px">
        <Flex direction="column" align="center" mb={6}>
          <BrandLogo height="48px" />
        </Flex>

        <Card>
          <CardBody p={{ base: 6, md: 8 }}>
            <Heading as="h1" fontSize="2xl" mb={1}>
              {t("auth.loginTitle")}
            </Heading>
            <Text color={muted} mb={6}>
              {t("auth.loginSubtitle")}
            </Text>

            {error && (
              <Alert status="error" borderRadius="10px" mb={4} fontSize="sm">
                <AlertIcon />
                {t("auth.invalid")}
              </Alert>
            )}

            <form onSubmit={handleSubmit}>
              <FormControl mb={4} isRequired>
                <FormLabel fontSize="sm">{t("auth.email")}</FormLabel>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setError(false);
                  }}
                  autoComplete="username"
                />
              </FormControl>

              <FormControl mb={4} isRequired>
                <FormLabel fontSize="sm">{t("auth.password")}</FormLabel>
                <InputGroup>
                  <Input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      setError(false);
                    }}
                    autoComplete="current-password"
                  />
                  <InputRightElement>
                    <IconButton
                      aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
                      icon={showPassword ? <FiEyeOff /> : <FiEye />}
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowPassword((s) => !s)}
                    />
                  </InputRightElement>
                </InputGroup>
              </FormControl>

              <Checkbox
                colorScheme="brand"
                isChecked={keepConnected}
                onChange={(e) => setKeepConnected(e.target.checked)}
                mb={6}
              >
                {t("auth.keepConnected")}
              </Checkbox>

              <Button type="submit" colorScheme="brand" size="lg" w="100%">
                {t("auth.submit")}
              </Button>
            </form>

            <Box bg={hintBg} borderRadius="10px" p={3} mt={6}>
              <Text fontSize="xs" color={muted} mb={1}>
                {t("auth.demoHint")}
              </Text>
              <Text fontSize="sm" fontFamily="mono">
                {DEMO_CREDENTIALS.email}
              </Text>
              <Text fontSize="sm" fontFamily="mono">
                {DEMO_CREDENTIALS.password}
              </Text>
            </Box>
          </CardBody>
        </Card>

        <Flex justify="center" mt={6}>
          <ChakraLink
            as={RouterLink}
            to="/"
            fontSize="sm"
            color={muted}
            display="inline-flex"
            alignItems="center"
            gap={1}
          >
            <FiArrowLeft />
            {t("auth.backHome")}
          </ChakraLink>
        </Flex>
      </Box>
    </Flex>
  );
}

export default Login;

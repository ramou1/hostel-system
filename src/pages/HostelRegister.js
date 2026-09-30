import React, { useMemo, useState } from "react";
import {
  Box,
  Button,
  Card,
  CardBody,
  Container,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  InputGroup,
  InputRightElement,
  IconButton,
  Text,
  Badge,
  Link as ChakraLink,
} from "@chakra-ui/react";
import { FiArrowLeft, FiEye, FiEyeOff } from "react-icons/fi";
import {
  Link as RouterLink,
  Navigate,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import { useI18n } from "../contexts/LanguageContext";
import { useAuth } from "../contexts/AuthContext";
import BrandLogo from "../components/BrandLogo";
import HostelFormFields from "../components/HostelFormFields";
import useToastService from "../services/ToastService";
import {
  EMPTY_HOSTEL,
  PLAN_IDS,
  addHostel,
  canAddHostel,
  createAccountWithHostel,
  getPlan,
  loadAccount,
} from "../data/store";

function HostelRegister({ variant = "public" }) {
  const { t } = useI18n();
  const { isAuthenticated, signup } = useAuth();
  const navigate = useNavigate();
  const { showSuccess, showError } = useToastService();
  const [searchParams] = useSearchParams();
  const [showPassword, setShowPassword] = useState(false);
  const isApp = variant === "app";

  const requested = searchParams.get("plan");
  const planId = isApp
    ? loadAccount().planId
    : PLAN_IDS.includes(requested)
      ? requested
      : "basic";
  const plan = getPlan(planId);

  const [account, setAccount] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [hostel, setHostel] = useState(EMPTY_HOSTEL);

  const planLabel = t(`registerHostel.plans.${plan.id}`);

  const canSubmit = useMemo(() => {
    if (!hostel.name.trim()) return false;
    if (!isApp && (!account.name.trim() || !account.email.trim() || !account.password)) {
      return false;
    }
    return true;
  }, [account, hostel.name, isApp]);

  if (isApp && !canAddHostel()) {
    return <Navigate to="/app/hostel" replace />;
  }

  if (!isApp && isAuthenticated) {
    return (
      <Navigate
        to={canAddHostel() ? "/app/hostel/novo" : "/app"}
        replace
      />
    );
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!canSubmit) return;

    if (isApp) {
      const result = addHostel(hostel);
      if (!result.ok) {
        showError(t("registerHostel.limitTitle"), t("registerHostel.limitDesc"));
        return;
      }
      showSuccess(t("registerHostel.successTitle"), t("registerHostel.successDesc"));
      navigate("/app/hostel");
      return;
    }

    createAccountWithHostel({ planId: plan.id, hostel });
    signup(account.email.trim(), true);
    showSuccess(t("registerHostel.successTitle"), t("registerHostel.successDesc"));
    navigate("/app", { replace: true });
  };

  const form = (
    <form onSubmit={handleSubmit}>
      {!isApp && (
        <>
          <Text fontSize="xs" fontWeight={700} textTransform="uppercase" color="gray.500" mb={3}>
            {t("registerHostel.accountSection")}
          </Text>
          <FormControl mb={3} isRequired>
            <FormLabel fontSize="sm">{t("registerHostel.ownerName")}</FormLabel>
            <Input
              value={account.name}
              onChange={(e) => setAccount((p) => ({ ...p, name: e.target.value }))}
            />
          </FormControl>
          <FormControl mb={3} isRequired>
            <FormLabel fontSize="sm">{t("auth.email")}</FormLabel>
            <Input
              type="email"
              value={account.email}
              onChange={(e) => setAccount((p) => ({ ...p, email: e.target.value }))}
            />
          </FormControl>
          <FormControl mb={6} isRequired>
            <FormLabel fontSize="sm">{t("auth.password")}</FormLabel>
            <InputGroup>
              <Input
                type={showPassword ? "text" : "password"}
                value={account.password}
                onChange={(e) =>
                  setAccount((p) => ({ ...p, password: e.target.value }))
                }
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
        </>
      )}

      <Text fontSize="xs" fontWeight={700} textTransform="uppercase" color="gray.500" mb={3}>
        {t("registerHostel.hostelSection")}
      </Text>
      <HostelFormFields values={hostel} onChange={setHostel} />

      <Flex justify="flex-end" mt={6} gap={3}>
        {isApp && (
          <Button variant="ghost" onClick={() => navigate("/app/hostel")}>
            {t("common.cancel")}
          </Button>
        )}
        <Button type="submit" colorScheme="brand" isDisabled={!canSubmit}>
          {t("registerHostel.submit")}
        </Button>
      </Flex>
    </form>
  );

  if (isApp) {
    return (
      <Card>
        <CardBody>
          <Flex align="center" gap={3} mb={5} flexWrap="wrap">
            <Heading fontSize="lg">{t("registerHostel.title")}</Heading>
            <Badge colorScheme="brand" borderRadius="full" textTransform="none">
              {planLabel}
            </Badge>
          </Flex>
          <Text fontSize="sm" color="gray.500" mb={6}>
            {t("registerHostel.subtitleApp")}
          </Text>
          {form}
        </CardBody>
      </Card>
    );
  }

  return (
    <Box bg="gray.50" minH="100vh" color="gray.800" py={{ base: 8, md: 12 }} px={4}>
      <Container maxW="760px">
        <Flex direction="column" align="center" mb={6}>
          <BrandLogo height="40px" forceLight />
        </Flex>
        <Card bg="white">
          <CardBody p={{ base: 5, md: 8 }}>
            <Flex align="center" gap={3} mb={2} flexWrap="wrap">
              <Heading as="h1" fontSize="2xl">
                {t("registerHostel.title")}
              </Heading>
              <Badge colorScheme="brand" borderRadius="full" textTransform="none">
                {planLabel}
              </Badge>
            </Flex>
            <Text color="gray.600" mb={6}>
              {t("registerHostel.subtitlePublic")}
            </Text>
            {form}
          </CardBody>
        </Card>
        <Flex justify="center" mt={6}>
          <ChakraLink
            as={RouterLink}
            to="/"
            fontSize="sm"
            color="gray.500"
            display="inline-flex"
            alignItems="center"
            gap={1}
          >
            <FiArrowLeft />
            {t("auth.backHome")}
          </ChakraLink>
        </Flex>
      </Container>
    </Box>
  );
}

export default HostelRegister;

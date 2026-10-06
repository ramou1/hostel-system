import React, { useEffect, useMemo, useState } from "react";
import {
  Flex,
  Box,
  Card,
  CardBody,
  Heading,
  Text,
  Button,
  Icon,
  Divider,
  Checkbox,
  HStack,
  Image,
} from "@chakra-ui/react";
import { FiCheckCircle } from "react-icons/fi";
import ClientFormFields from "../components/ClientFormFields";
import BrandLogo from "../components/BrandLogo";
import useToastService from "../services/ToastService";
import { useI18n } from "../contexts/LanguageContext";
import { loadRooms, loadHostel, addClient, SOURCE } from "../data/store";

const EMPTY_CLIENT = {
  name: "",
  email: "",
  phone: "",
  room: "",
  bed: "",
  cpf: "",
  documentId: "",
  photo: "",
  country: "",
  nationality: "",
  birthDate: "",
  originCity: "",
  destinationCity: "",
  travelReason: "",
  languages: ["pt"],
  locker: "",
};

const LANGS = [
  { id: "pt", label: "Português" },
  { id: "en", label: "English" },
  { id: "es", label: "Español" },
];

function SelfRegister() {
  const { t, lang, setLang } = useI18n();
  const { showError } = useToastService();
  const rooms = useMemo(() => loadRooms(), []);
  const hostel = useMemo(() => loadHostel(), []);
  const [values, setValues] = useState(EMPTY_CLIENT);
  const [acceptedRules, setAcceptedRules] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const pageBg = "gray.100";
  const muted = "gray.500";

  const setField = (name, value) =>
    setValues((prev) => ({ ...prev, [name]: value }));

  const resetForm = () => {
    setValues(EMPTY_CLIENT);
    setAcceptedRules(false);
    setSubmitted(false);
  };

  useEffect(() => {
    if (!submitted) return undefined;
    const timer = setTimeout(resetForm, 8000);
    return () => clearTimeout(timer);
  }, [submitted]);

  const handleSubmit = () => {
    if (!values.name.trim()) {
      showError(t("selfRegister.title"), t("selfRegister.nameRequired"));
      return;
    }
    if (!values.birthDate || !values.nationality.trim()) {
      showError(t("selfRegister.title"), t("selfRegister.profileRequired"));
      return;
    }
    if (values.room && !values.bed) {
      showError(t("selfRegister.title"), t("selfRegister.bedRequired"));
      return;
    }
    if (!acceptedRules) {
      showError(t("selfRegister.title"), t("selfRegister.rulesRequired"));
      return;
    }
    addClient({
      ...values,
      source: SOURCE.LINK,
      registeredAt: new Date().toISOString(),
      status: "checkedIn",
      acceptedRules: true,
    });
    setSubmitted(true);
  };

  return (
    <Flex minH="100vh" bg={pageBg} align="flex-start" justify="center" p={4}>
      <Box w="100%" maxW="720px" py={{ base: 4, md: 8 }}>
        <Flex direction="column" align="center" mb={6}>
          <BrandLogo height="48px" forceLight />
          <Heading as="h1" fontSize="xl" mt={4} textAlign="center" color="gray.800">
            {hostel.name}
          </Heading>
          <HStack spacing={2} mt={4}>
            {LANGS.map((item) => (
              <Box
                as="button"
                key={item.id}
                type="button"
                aria-label={item.label}
                onClick={() => setLang(item.id)}
                boxSize="44px"
                borderRadius="full"
                overflow="hidden"
                border="2px solid"
                borderColor={lang === item.id ? "brand.500" : "transparent"}
                boxShadow={lang === item.id ? "0 0 0 2px #f59e0b" : "none"}
                p={0}
                lineHeight={0}
              >
                <Image
                  src={`/images/flags/${item.id}.png`}
                  alt=""
                  boxSize="40px"
                  objectFit="cover"
                  borderRadius="full"
                />
              </Box>
            ))}
          </HStack>
        </Flex>

        <Card bg="white">
          <CardBody p={{ base: 5, md: 8 }}>
            {submitted ? (
              <Flex direction="column" align="center" textAlign="center" py={6}>
                <Icon as={FiCheckCircle} boxSize={16} color="green.400" mb={4} />
                <Heading as="h2" fontSize="2xl" mb={2}>
                  {t("selfRegister.successTitle")}
                </Heading>
                <Text color={muted} maxW="420px" mb={6}>
                  {t("selfRegister.successDesc")}
                </Text>
                <Button colorScheme="brand" size="lg" onClick={resetForm}>
                  {t("selfRegister.nextGuest")}
                </Button>
              </Flex>
            ) : (
              <>
                <Heading as="h2" fontSize="2xl" mb={1}>
                  {t("selfRegister.title")}
                </Heading>
                <Text color={muted} mb={5}>
                  {t("selfRegister.subtitle")}
                </Text>
                <Divider mb={6} />

                <ClientFormFields
                  values={values}
                  setField={setField}
                  rooms={rooms}
                />

                <Box mt={6}>
                  <Text fontSize="sm" fontWeight={700} mb={2}>
                    {t("selfRegister.rulesTitle")}
                  </Text>
                  <Box
                    bg="gray.50"
                    borderRadius="12px"
                    p={4}
                    maxH="160px"
                    overflowY="auto"
                    mb={3}
                    whiteSpace="pre-wrap"
                    fontSize="sm"
                    color="gray.700"
                  >
                    {hostel.rules || t("selfRegister.noRules")}
                  </Box>
                  <Checkbox
                    colorScheme="brand"
                    isChecked={acceptedRules}
                    onChange={(e) => setAcceptedRules(e.target.checked)}
                  >
                    {t("selfRegister.acceptRules")}
                  </Checkbox>
                </Box>

                <Button
                  colorScheme="brand"
                  size="lg"
                  w="100%"
                  mt={8}
                  onClick={handleSubmit}
                >
                  {t("selfRegister.submit")}
                </Button>
              </>
            )}
          </CardBody>
        </Card>

        <Text textAlign="center" fontSize="xs" color={muted} mt={6}>
          {t("selfRegister.footer")}
        </Text>
      </Box>
    </Flex>
  );
}

export default SelfRegister;

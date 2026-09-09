import React, { useMemo, useState } from "react";
import {
  Flex,
  Box,
  Card,
  CardBody,
  Heading,
  Text,
  Button,
  Image,
  Icon,
  Divider,
  useColorModeValue,
} from "@chakra-ui/react";
import { FiCheckCircle } from "react-icons/fi";
import ClientFormFields from "../components/ClientFormFields";
import useToastService from "../services/ToastService";
import { useI18n } from "../contexts/LanguageContext";
import { loadRooms, addClient, SOURCE } from "../data/store";

const EMPTY_CLIENT = {
  name: "",
  email: "",
  phone: "",
  room: "",
  cpf: "",
  documentId: "",
  photo: "",
  country: "BR",
  language: "pt",
};

function SelfRegister() {
  const { t } = useI18n();
  const { showError } = useToastService();
  const rooms = useMemo(() => loadRooms(), []);
  const [values, setValues] = useState(EMPTY_CLIENT);
  const [submitted, setSubmitted] = useState(false);

  const pageBg = useColorModeValue("gray.100", "gray.900");
  const muted = useColorModeValue("gray.500", "gray.400");

  const setField = (name, value) =>
    setValues((prev) => ({ ...prev, [name]: value }));

  const handleSubmit = () => {
    if (!values.name.trim()) {
      showError(t("selfRegister.title"), t("selfRegister.nameRequired"));
      return;
    }
    addClient({
      ...values,
      source: SOURCE.LINK,
      registeredAt: new Date().toISOString(),
    });
    setSubmitted(true);
  };

  return (
    <Flex minH="100vh" bg={pageBg} align="center" justify="center" p={4}>
      <Box w="100%" maxW="640px">
        <Flex direction="column" align="center" mb={6}>
          <Image
            src="/images/logo-collapsed.png"
            alt="HostelZim"
            boxSize="52px"
            objectFit="contain"
            mb={2}
          />
          <Text fontSize="xl" fontWeight={800} letterSpacing="-0.02em">
            Hostel<Box as="span" color="brand.500">Zim</Box>
          </Text>
        </Flex>

        <Card>
          <CardBody p={{ base: 5, md: 8 }}>
            {submitted ? (
              <Flex direction="column" align="center" textAlign="center" py={6}>
                <Icon as={FiCheckCircle} boxSize={16} color="green.400" mb={4} />
                <Heading as="h1" fontSize="2xl" mb={2}>
                  {t("selfRegister.successTitle")}
                </Heading>
                <Text color={muted} maxW="420px">
                  {t("selfRegister.successDesc")}
                </Text>
              </Flex>
            ) : (
              <>
                <Heading as="h1" fontSize="2xl" mb={1}>
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

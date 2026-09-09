import React, { useMemo, useState } from "react";
import {
  Button,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Input,
  InputGroup,
  InputLeftElement,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  FormControl,
  FormLabel,
  Flex,
  Card,
  CardBody,
  Avatar,
  Text,
  Box,
  Badge,
  Select,
  SimpleGrid,
  Divider,
  HStack,
  IconButton,
  Icon,
  useColorModeValue,
} from "@chakra-ui/react";
import {
  FiPlus,
  FiSearch,
  FiUsers,
  FiLink,
  FiUserCheck,
  FiChevronLeft,
  FiChevronRight,
} from "react-icons/fi";
import { useI18n } from "../contexts/LanguageContext";

// Países disponíveis (códigos ISO-3166 alpha-2; o nome vem do i18n)
const COUNTRY_OPTIONS = ["BR", "AR", "US", "PT", "CL", "FR", "DE", "ES", "IT"];
const LANGUAGE_OPTIONS = ["pt", "en", "es", "fr", "de", "it"];

// Origem do cadastro modelada como enum
const SOURCE = { LINK: "link", DESK: "desk" };

const PER_PAGE = 10;

const INITIAL_CLIENTS = [
  {
    name: "Ana Beatriz",
    email: "ana.beatriz@example.com",
    phone: "(11) 98888-1010",
    room: "101",
    cpf: "123.456.789-00",
    photo: "",
    country: "BR",
    language: "pt",
    source: SOURCE.LINK,
    registeredAt: "2026-09-09T10:15:00",
  },
  {
    name: "Lucas Pereira",
    email: "lucas.pereira@example.com",
    phone: "(21) 97777-2020",
    room: "102",
    cpf: "987.654.321-00",
    photo: "",
    country: "BR",
    language: "pt",
    source: SOURCE.DESK,
    registeredAt: "2026-09-08T18:40:00",
  },
  {
    name: "Sofía Gómez",
    email: "sofia.gomez@example.com",
    phone: "+54 9 11 5555-3030",
    room: "103",
    cpf: "555.123.456-78",
    photo: "",
    country: "AR",
    language: "es",
    source: SOURCE.LINK,
    registeredAt: "2026-09-08T09:05:00",
  },
  {
    name: "Michael Johnson",
    email: "michael.johnson@example.com",
    phone: "+1 202 555-4040",
    room: "104",
    cpf: "444.555.666-66",
    photo: "",
    country: "US",
    language: "en",
    source: SOURCE.DESK,
    registeredAt: "2026-09-07T14:20:00",
  },
  {
    name: "Emily Davis",
    email: "emily.davis@example.com",
    phone: "+1 415 555-5050",
    room: "105",
    cpf: "333.777.888-88",
    photo: "",
    country: "US",
    language: "en",
    source: SOURCE.LINK,
    registeredAt: "2026-09-06T11:00:00",
  },
  {
    name: "João Ferreira",
    email: "joao.ferreira@example.com",
    phone: "+351 912 345 678",
    room: "106",
    cpf: "222.333.444-55",
    photo: "",
    country: "PT",
    language: "pt",
    source: SOURCE.DESK,
    registeredAt: "2026-09-05T16:30:00",
  },
  {
    name: "Camila Rojas",
    email: "camila.rojas@example.com",
    phone: "+56 9 6666 7070",
    room: "107",
    cpf: "111.222.333-44",
    photo: "",
    country: "CL",
    language: "es",
    source: SOURCE.LINK,
    registeredAt: "2026-09-04T08:45:00",
  },
  {
    name: "Pierre Dubois",
    email: "pierre.dubois@example.com",
    phone: "+33 6 12 34 56 78",
    room: "108",
    cpf: "999.888.777-66",
    photo: "",
    country: "FR",
    language: "fr",
    source: SOURCE.DESK,
    registeredAt: "2026-09-03T19:10:00",
  },
  {
    name: "Lena Müller",
    email: "lena.mueller@example.com",
    phone: "+49 151 2345678",
    room: "109",
    cpf: "888.777.666-55",
    photo: "",
    country: "DE",
    language: "de",
    source: SOURCE.LINK,
    registeredAt: "2026-09-01T12:00:00",
  },
  {
    name: "Marta Silva",
    email: "marta.silva@example.com",
    phone: "(31) 96666-8080",
    room: "110",
    cpf: "777.666.555-44",
    photo: "",
    country: "BR",
    language: "pt",
    source: SOURCE.LINK,
    registeredAt: "2026-08-31T09:20:00",
  },
  {
    name: "Giovanni Rossi",
    email: "giovanni.rossi@example.com",
    phone: "+39 340 123 4567",
    room: "111",
    cpf: "666.555.444-33",
    photo: "",
    country: "IT",
    language: "it",
    source: SOURCE.DESK,
    registeredAt: "2026-08-30T15:45:00",
  },
  {
    name: "Carlos Sánchez",
    email: "carlos.sanchez@example.com",
    phone: "+34 612 345 678",
    room: "112",
    cpf: "555.444.333-22",
    photo: "",
    country: "ES",
    language: "es",
    source: SOURCE.LINK,
    registeredAt: "2026-08-29T11:10:00",
  },
  {
    name: "Fátima Alves",
    email: "fatima.alves@example.com",
    phone: "+351 913 222 111",
    room: "113",
    cpf: "444.333.222-11",
    photo: "",
    country: "PT",
    language: "pt",
    source: SOURCE.DESK,
    registeredAt: "2026-08-28T17:05:00",
  },
  {
    name: "Hans Weber",
    email: "hans.weber@example.com",
    phone: "+49 172 9876543",
    room: "114",
    cpf: "333.222.111-00",
    photo: "",
    country: "DE",
    language: "de",
    source: SOURCE.LINK,
    registeredAt: "2026-08-27T08:30:00",
  },
  {
    name: "Marie Laurent",
    email: "marie.laurent@example.com",
    phone: "+33 6 98 76 54 32",
    room: "115",
    cpf: "222.111.000-99",
    photo: "",
    country: "FR",
    language: "fr",
    source: SOURCE.DESK,
    registeredAt: "2026-08-26T13:50:00",
  },
  {
    name: "Diego Fernández",
    email: "diego.fernandez@example.com",
    phone: "+54 9 11 4444-9090",
    room: "116",
    cpf: "111.000.999-88",
    photo: "",
    country: "AR",
    language: "es",
    source: SOURCE.LINK,
    registeredAt: "2026-08-25T10:00:00",
  },
  {
    name: "Sarah Williams",
    email: "sarah.williams@example.com",
    phone: "+1 646 555-6060",
    room: "117",
    cpf: "000.999.888-77",
    photo: "",
    country: "US",
    language: "en",
    source: SOURCE.DESK,
    registeredAt: "2026-08-24T19:25:00",
  },
  {
    name: "Bruno Costa",
    email: "bruno.costa@example.com",
    phone: "(41) 95555-7070",
    room: "118",
    cpf: "121.232.343-45",
    photo: "",
    country: "BR",
    language: "pt",
    source: SOURCE.LINK,
    registeredAt: "2026-08-23T14:15:00",
  },
  {
    name: "Valentina Torres",
    email: "valentina.torres@example.com",
    phone: "+56 9 7777 8080",
    room: "119",
    cpf: "232.343.454-56",
    photo: "",
    country: "CL",
    language: "es",
    source: SOURCE.DESK,
    registeredAt: "2026-08-22T12:40:00",
  },
  {
    name: "Thomas Becker",
    email: "thomas.becker@example.com",
    phone: "+49 160 5554443",
    room: "120",
    cpf: "343.454.565-67",
    photo: "",
    country: "DE",
    language: "de",
    source: SOURCE.LINK,
    registeredAt: "2026-08-21T16:55:00",
  },
];

// Badge que representa a origem do cadastro (link x balcão)
function SourceBadge({ source, t }) {
  const isLink = source === SOURCE.LINK;
  return (
    <Badge
      colorScheme={isLink ? "green" : "purple"}
      borderRadius="full"
      px={2}
      py={0.5}
      display="inline-flex"
      alignItems="center"
      gap={1}
      textTransform="none"
    >
      <Icon as={isLink ? FiLink : FiUserCheck} boxSize={3} />
      {t(isLink ? "clients.sourceLink" : "clients.sourceDesk")}
    </Badge>
  );
}

// Linha rótulo/valor usada no modal de detalhes
function InfoField({ label, children }) {
  const labelColor = useColorModeValue("gray.500", "gray.400");
  return (
    <Box>
      <Text fontSize="xs" fontWeight={700} color={labelColor} textTransform="uppercase">
        {label}
      </Text>
      <Box fontSize="sm" mt={0.5}>
        {children}
      </Box>
    </Box>
  );
}

function Clients() {
  const { t, lang } = useI18n();
  const addModal = useDisclosure();
  const detailsModal = useDisclosure();

  const [clients, setClients] = useState(INITIAL_CLIENTS);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [selectedClient, setSelectedClient] = useState(null);
  const [newClient, setNewClient] = useState({
    name: "",
    email: "",
    phone: "",
    room: "",
    cpf: "",
    photo: "",
    country: "BR",
    language: "pt",
    source: SOURCE.LINK,
  });

  const rowHover = useColorModeValue("gray.50", "whiteAlpha.100");
  const paginationBorder = useColorModeValue("gray.100", "gray.700");

  const formatDate = (iso, withTime = false) => {
    if (!iso) return "-";
    const locale = lang === "pt" ? "pt-BR" : "en-US";
    return new Intl.DateTimeFormat(locale, {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      ...(withTime ? { hour: "2-digit", minute: "2-digit" } : {}),
    }).format(new Date(iso));
  };

  const countryLabel = (code) => t(`clients.countries.${code}`);

  // Filtra + ordena por cadastro mais recente
  const sortedClients = useMemo(() => {
    const term = searchTerm.toLowerCase();
    return clients
      .filter((c) => c.name.toLowerCase().includes(term))
      .sort((a, b) => new Date(b.registeredAt) - new Date(a.registeredAt));
  }, [clients, searchTerm]);

  const totalPages = Math.max(1, Math.ceil(sortedClients.length / PER_PAGE));
  const currentPage = Math.min(page, totalPages);
  const pageClients = sortedClients.slice(
    (currentPage - 1) * PER_PAGE,
    currentPage * PER_PAGE
  );

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setPage(1);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewClient((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddClient = () => {
    setClients((prev) => [
      ...prev,
      { ...newClient, registeredAt: new Date().toISOString() },
    ]);
    setNewClient({
      name: "",
      email: "",
      phone: "",
      room: "",
      cpf: "",
      photo: "",
      country: "BR",
      language: "pt",
      source: SOURCE.LINK,
    });
    setPage(1);
    addModal.onClose();
  };

  const openDetails = (client) => {
    setSelectedClient(client);
    detailsModal.onOpen();
  };

  return (
    <>
      <Flex
        mb={4}
        gap={3}
        direction={{ base: "column", sm: "row" }}
        align={{ base: "stretch", sm: "center" }}
      >
        <InputGroup maxW={{ base: "100%", sm: "360px" }}>
          <InputLeftElement pointerEvents="none">
            <Icon as={FiSearch} color="gray.400" />
          </InputLeftElement>
          <Input
            placeholder={t("clients.searchPlaceholder")}
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </InputGroup>
        <Button
          onClick={addModal.onOpen}
          colorScheme="brand"
          leftIcon={<FiPlus />}
          flexShrink={0}
        >
          {t("clients.addNew")}
        </Button>
      </Flex>

      <Card>
        <CardBody p={0}>
          <TableContainer>
            <Table variant="simple" size="sm">
              <Thead>
                <Tr>
                  <Th>{t("clients.client")}</Th>
                  <Th>{t("clients.email")}</Th>
                  <Th>{t("clients.phone")}</Th>
                  <Th>{t("clients.room")}</Th>
                  <Th>{t("clients.cpf")}</Th>
                  <Th>{t("clients.country")}</Th>
                  <Th>{t("clients.registeredAtShort")}</Th>
                </Tr>
              </Thead>
              <Tbody>
                {pageClients.map((client, index) => (
                  <Tr
                    key={`${client.cpf}-${index}`}
                    onClick={() => openDetails(client)}
                    cursor="pointer"
                    _hover={{ bg: rowHover }}
                    transition="background 0.15s"
                  >
                    <Td>
                      <Flex align="center" gap={3}>
                        <Avatar
                          size="sm"
                          name={client.name}
                          src={client.photo || undefined}
                        />
                        <Text fontWeight={600} fontSize="sm">
                          {client.name}
                        </Text>
                      </Flex>
                    </Td>
                    <Td fontSize="sm">{client.email}</Td>
                    <Td fontSize="sm">{client.phone}</Td>
                    <Td fontSize="sm">{client.room}</Td>
                    <Td fontSize="sm">{client.cpf}</Td>
                    <Td fontSize="sm">{countryLabel(client.country)}</Td>
                    <Td fontSize="sm">{formatDate(client.registeredAt)}</Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </TableContainer>

          {sortedClients.length === 0 && (
            <Flex direction="column" align="center" py={12} color="gray.500">
              <Icon as={FiUsers} boxSize={8} mb={3} />
              <Text>{t("clients.empty")}</Text>
            </Flex>
          )}

          {/* Paginação */}
          {sortedClients.length > 0 && (
            <Flex
              align="center"
              justify="space-between"
              px={4}
              py={3}
              borderTop="1px solid"
              borderColor={paginationBorder}
            >
              <Text fontSize="sm" color="gray.500">
                {t("common.page")} {currentPage} {t("common.of")} {totalPages}
              </Text>
              <HStack>
                <IconButton
                  aria-label={t("common.previous")}
                  icon={<FiChevronLeft />}
                  size="sm"
                  variant="outline"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  isDisabled={currentPage === 1}
                />
                <IconButton
                  aria-label={t("common.next")}
                  icon={<FiChevronRight />}
                  size="sm"
                  variant="outline"
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  isDisabled={currentPage === totalPages}
                />
              </HStack>
            </Flex>
          )}
        </CardBody>
      </Card>

      {/* Modal: detalhes do cliente */}
      <Modal
        isOpen={detailsModal.isOpen}
        onClose={detailsModal.onClose}
        isCentered
        size="lg"
      >
        <ModalOverlay backdropFilter="blur(4px)" />
        <ModalContent borderRadius="16px">
          <ModalHeader>{t("clients.detailsTitle")}</ModalHeader>
          <ModalCloseButton />
          {selectedClient && (
            <ModalBody pb={6}>
              <Flex align="center" gap={4} mb={5}>
                <Avatar
                  size="lg"
                  name={selectedClient.name}
                  src={selectedClient.photo || undefined}
                />
                <Box minW={0}>
                  <Text fontSize="lg" fontWeight={700} noOfLines={1}>
                    {selectedClient.name}
                  </Text>
                  <Text fontSize="sm" color="gray.500" noOfLines={1}>
                    {selectedClient.email}
                  </Text>
                  <Box mt={2}>
                    <SourceBadge source={selectedClient.source} t={t} />
                  </Box>
                </Box>
              </Flex>

              <Divider mb={5} />

              <SimpleGrid columns={{ base: 1, sm: 2 }} spacingY={4} spacingX={6}>
                <InfoField label={t("clients.phone")}>
                  {selectedClient.phone}
                </InfoField>
                <InfoField label={t("clients.room")}>
                  {selectedClient.room}
                </InfoField>
                <InfoField label={t("clients.cpf")}>
                  {selectedClient.cpf}
                </InfoField>
                <InfoField label={t("clients.country")}>
                  {countryLabel(selectedClient.country)}
                </InfoField>
                <InfoField label={t("clients.language")}>
                  {t(`clients.languages.${selectedClient.language}`)}
                </InfoField>
                <InfoField label={t("clients.registeredAt")}>
                  {formatDate(selectedClient.registeredAt, true)}
                </InfoField>
                <InfoField label={t("clients.source")}>
                  <SourceBadge source={selectedClient.source} t={t} />
                </InfoField>
              </SimpleGrid>
            </ModalBody>
          )}
        </ModalContent>
      </Modal>

      {/* Modal: adicionar cliente */}
      <Modal isOpen={addModal.isOpen} onClose={addModal.onClose} isCentered size="lg">
        <ModalOverlay backdropFilter="blur(4px)" />
        <ModalContent borderRadius="16px">
          <ModalHeader>{t("clients.addTitle")}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl mb={3}>
              <FormLabel fontSize="sm">{t("clients.photoUrl")}</FormLabel>
              <Input
                placeholder={t("clients.photoUrl")}
                name="photo"
                value={newClient.photo}
                onChange={handleInputChange}
              />
            </FormControl>
            <SimpleGrid columns={{ base: 1, sm: 2 }} spacing={3}>
              <FormControl>
                <FormLabel fontSize="sm">{t("clients.name")}</FormLabel>
                <Input
                  placeholder={t("clients.name")}
                  name="name"
                  value={newClient.name}
                  onChange={handleInputChange}
                />
              </FormControl>
              <FormControl>
                <FormLabel fontSize="sm">{t("clients.email")}</FormLabel>
                <Input
                  placeholder={t("clients.email")}
                  name="email"
                  value={newClient.email}
                  onChange={handleInputChange}
                />
              </FormControl>
              <FormControl>
                <FormLabel fontSize="sm">{t("clients.phone")}</FormLabel>
                <Input
                  placeholder={t("clients.phone")}
                  name="phone"
                  value={newClient.phone}
                  onChange={handleInputChange}
                />
              </FormControl>
              <FormControl>
                <FormLabel fontSize="sm">{t("clients.room")}</FormLabel>
                <Input
                  placeholder={t("clients.room")}
                  name="room"
                  value={newClient.room}
                  onChange={handleInputChange}
                />
              </FormControl>
              <FormControl>
                <FormLabel fontSize="sm">{t("clients.cpf")}</FormLabel>
                <Input
                  placeholder={t("clients.cpf")}
                  name="cpf"
                  value={newClient.cpf}
                  onChange={handleInputChange}
                />
              </FormControl>
              <FormControl>
                <FormLabel fontSize="sm">{t("clients.country")}</FormLabel>
                <Select name="country" value={newClient.country} onChange={handleInputChange}>
                  {COUNTRY_OPTIONS.map((code) => (
                    <option key={code} value={code}>
                      {t(`clients.countries.${code}`)}
                    </option>
                  ))}
                </Select>
              </FormControl>
              <FormControl>
                <FormLabel fontSize="sm">{t("clients.language")}</FormLabel>
                <Select name="language" value={newClient.language} onChange={handleInputChange}>
                  {LANGUAGE_OPTIONS.map((code) => (
                    <option key={code} value={code}>
                      {t(`clients.languages.${code}`)}
                    </option>
                  ))}
                </Select>
              </FormControl>
              <FormControl>
                <FormLabel fontSize="sm">{t("clients.source")}</FormLabel>
                <Select name="source" value={newClient.source} onChange={handleInputChange}>
                  <option value={SOURCE.LINK}>{t("clients.sourceLink")}</option>
                  <option value={SOURCE.DESK}>{t("clients.sourceDesk")}</option>
                </Select>
              </FormControl>
            </SimpleGrid>
          </ModalBody>
          <ModalFooter gap={3}>
            <Button variant="ghost" onClick={addModal.onClose}>
              {t("common.cancel")}
            </Button>
            <Button colorScheme="brand" onClick={handleAddClient}>
              {t("common.save")}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

export default Clients;

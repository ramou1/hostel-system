import React, { useEffect, useMemo, useState } from "react";
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
  Flex,
  Card,
  CardBody,
  Avatar,
  Text,
  Box,
  Badge,
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
  FiCopy,
  FiExternalLink,
} from "react-icons/fi";
import { useI18n } from "../contexts/LanguageContext";
import useToastService from "../services/ToastService";
import ClientFormFields from "../components/ClientFormFields";
import {
  loadClients,
  loadRooms,
  loadLockers,
  addClient,
  assignLockerToClient,
  SOURCE,
  STORAGE_KEYS,
} from "../data/store";

const PER_PAGE = 10;

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
  lockerId: "",
};

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
  const { showSuccess } = useToastService();
  const addModal = useDisclosure();
  const detailsModal = useDisclosure();
  const linkModal = useDisclosure();

  const [clients, setClients] = useState(loadClients);
  const [rooms, setRooms] = useState(loadRooms);
  const [lockers, setLockers] = useState(loadLockers);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [selectedClient, setSelectedClient] = useState(null);
  const [newClient, setNewClient] = useState(EMPTY_CLIENT);
  const [generatedLink, setGeneratedLink] = useState("");
  const [copied, setCopied] = useState(false);

  const rowHover = useColorModeValue("gray.50", "whiteAlpha.100");
  const paginationBorder = useColorModeValue("gray.100", "gray.700");

  // Atualiza a lista em tempo real quando um auto-cadastro é feito
  // (inclusive em outra aba, via evento de storage).
  useEffect(() => {
    const onStorage = (e) => {
      if (e.key === STORAGE_KEYS.CLIENTS_KEY) setClients(loadClients());
      if (e.key === STORAGE_KEYS.ROOMS_KEY) setRooms(loadRooms());
      if (e.key === STORAGE_KEYS.LOCKERS_KEY) setLockers(loadLockers());
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const formatDate = (iso, withTime = false) => {
    if (!iso) return "—";
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

  const setNewClientField = (name, value) =>
    setNewClient((prev) => ({ ...prev, [name]: value }));

  // Cadastro pelo balcão: origem definida automaticamente como "desk"
  const handleAddClient = () => {
    const lockerId = newClient.lockerId || "";
    const next = addClient({
      ...newClient,
      lockerId,
      source: SOURCE.DESK,
      registeredAt: new Date().toISOString(),
    });
    if (lockerId) {
      const { lockers: nextLockers, clients: synced } = assignLockerToClient(
        lockerId,
        newClient.name
      );
      setLockers(nextLockers);
      setClients(synced);
    } else {
      setClients(next);
    }
    setNewClient(EMPTY_CLIENT);
    setPage(1);
    addModal.onClose();
    showSuccess(t("clients.addSuccessTitle"), t("clients.addSuccessDesc"));
  };

  const lockerCodeOf = (lockerId) => {
    if (!lockerId) return "—";
    const found = lockers.find((lk) => lk.id === lockerId);
    return found?.code || "—";
  };

  const openDetails = (client) => {
    setSelectedClient(client);
    detailsModal.onOpen();
  };

  // Gera um link único (simulado) de auto-cadastro
  const handleGenerateLink = () => {
    const token = Math.random().toString(36).slice(2, 10);
    setGeneratedLink(`${window.location.origin}/cadastro/${token}`);
    setCopied(false);
    linkModal.onOpen();
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(generatedLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard indisponível: usuário pode copiar manualmente
    }
  };

  return (
    <>
      <Flex
        mb={4}
        gap={3}
        direction={{ base: "column", md: "row" }}
        align={{ base: "stretch", md: "center" }}
      >
        <InputGroup maxW={{ base: "100%", md: "360px" }}>
          <InputLeftElement pointerEvents="none">
            <Icon as={FiSearch} color="gray.400" />
          </InputLeftElement>
          <Input
            placeholder={t("clients.searchPlaceholder")}
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </InputGroup>

        <HStack spacing={3} justify={{ base: "stretch", md: "flex-end" }} flex="1">
          <Button
            onClick={handleGenerateLink}
            variant="outline"
            colorScheme="brand"
            leftIcon={<FiLink />}
            flex={{ base: 1, md: "initial" }}
          >
            {t("clients.generateLink")}
          </Button>
          <Button
            onClick={addModal.onOpen}
            colorScheme="brand"
            leftIcon={<FiPlus />}
            flex={{ base: 1, md: "initial" }}
          >
            {t("clients.addNew")}
          </Button>
        </HStack>
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
                  <Th>{t("clients.country")}</Th>
                  <Th>{t("clients.registeredAtShort")}</Th>
                  <Th>{t("clients.source")}</Th>
                </Tr>
              </Thead>
              <Tbody>
                {pageClients.map((client, index) => (
                  <Tr
                    key={`${client.email}-${index}`}
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
                    <Td fontSize="sm">{countryLabel(client.country)}</Td>
                    <Td fontSize="sm">{formatDate(client.registeredAt)}</Td>
                    <Td>
                      <SourceBadge source={client.source} t={t} />
                    </Td>
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
                    {selectedClient.email || "—"}
                  </Text>
                  <Box mt={2}>
                    <SourceBadge source={selectedClient.source} t={t} />
                  </Box>
                </Box>
              </Flex>

              <Divider mb={5} />

              <SimpleGrid columns={{ base: 1, sm: 2 }} spacingY={4} spacingX={6}>
                <InfoField label={t("clients.phone")}>
                  {selectedClient.phone || "—"}
                </InfoField>
                <InfoField label={t("clients.room")}>
                  {selectedClient.room || "—"}
                </InfoField>
                <InfoField label={t("clients.locker")}>
                  {lockerCodeOf(selectedClient.lockerId)}
                </InfoField>
                <InfoField label={t("clients.cpf")}>
                  {selectedClient.cpf || "—"}
                </InfoField>
                <InfoField label={t("clients.documentId")}>
                  {selectedClient.documentId || "—"}
                </InfoField>
                <InfoField label={t("clients.country")}>
                  {countryLabel(selectedClient.country)}
                </InfoField>
                <InfoField label={t("clients.languageMain")}>
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

      {/* Modal: adicionar cliente (balcão) */}
      <Modal isOpen={addModal.isOpen} onClose={addModal.onClose} isCentered size="xl">
        <ModalOverlay backdropFilter="blur(4px)" />
        <ModalContent borderRadius="16px">
          <ModalHeader>{t("clients.addTitle")}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <ClientFormFields
              values={newClient}
              setField={setNewClientField}
              rooms={rooms}
              lockers={lockers}
            />
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

      {/* Modal: gerar link de auto-cadastro */}
      <Modal isOpen={linkModal.isOpen} onClose={linkModal.onClose} isCentered>
        <ModalOverlay backdropFilter="blur(4px)" />
        <ModalContent borderRadius="16px">
          <ModalHeader>{t("clients.linkTitle")}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text fontSize="sm" color="gray.500" mb={4}>
              {t("clients.linkDesc")}
            </Text>
            <InputGroup>
              <Input value={generatedLink} isReadOnly pr="4.5rem" fontSize="sm" />
            </InputGroup>
            <HStack mt={3}>
              <Button
                leftIcon={<FiCopy />}
                colorScheme="brand"
                onClick={handleCopyLink}
                flex="1"
              >
                {copied ? t("common.copied") : t("common.copy")}
              </Button>
              <Button
                as="a"
                href={generatedLink}
                target="_blank"
                rel="noopener noreferrer"
                variant="outline"
                leftIcon={<FiExternalLink />}
              >
                {t("common.open")}
              </Button>
            </HStack>
            <Text fontSize="xs" color="gray.500" mt={4}>
              {t("clients.linkNote")}
            </Text>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" onClick={linkModal.onClose}>
              {t("common.close")}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

export default Clients;

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
  Checkbox,
  Stack,
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
  FiLogOut,
} from "react-icons/fi";
import { useSearchParams } from "react-router-dom";
import { useI18n } from "../contexts/LanguageContext";
import useToastService from "../services/ToastService";
import ClientFormFields from "../components/ClientFormFields";
import {
  loadClients,
  loadRooms,
  addClient,
  checkoutClient,
  getClientLanguages,
  getClientLocker,
  getOpenRentalsForClient,
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
  country: "",
  languages: ["pt"],
  locker: "",
};

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
  const [searchParams, setSearchParams] = useSearchParams();
  const addModal = useDisclosure();
  const detailsModal = useDisclosure();
  const linkModal = useDisclosure();
  const checkoutModal = useDisclosure();

  const [clients, setClients] = useState(loadClients);
  const [rooms, setRooms] = useState(loadRooms);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [selectedClient, setSelectedClient] = useState(null);
  const [newClient, setNewClient] = useState(EMPTY_CLIENT);
  const [generatedLink, setGeneratedLink] = useState("");
  const [copied, setCopied] = useState(false);
  const [returnAllRentals, setReturnAllRentals] = useState(true);
  const [returnedIds, setReturnedIds] = useState([]);

  const rowHover = useColorModeValue("gray.50", "whiteAlpha.100");
  const paginationBorder = useColorModeValue("gray.100", "gray.700");

  useEffect(() => {
    const onStorage = (e) => {
      if (e.key === STORAGE_KEYS.CLIENTS_KEY) setClients(loadClients());
      if (e.key === STORAGE_KEYS.ROOMS_KEY) setRooms(loadRooms());
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  // Link rápido do painel: /app/clients?add=1
  useEffect(() => {
    if (searchParams.get("add") === "1") {
      setNewClient(EMPTY_CLIENT);
      addModal.onOpen();
      searchParams.delete("add");
      setSearchParams(searchParams, { replace: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

  const languageLabels = (client) => {
    const codes = getClientLanguages(client);
    if (!codes.length) return "—";
    return codes.map((code) => t(`clients.languages.${code}`)).join(", ");
  };

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

  const openRentals = selectedClient
    ? getOpenRentalsForClient(selectedClient.name)
    : [];

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setPage(1);
  };

  const setNewClientField = (name, value) =>
    setNewClient((prev) => ({ ...prev, [name]: value }));

  const handleAddClient = () => {
    addClient({
      ...newClient,
      locker: (newClient.locker || "").trim(),
      source: SOURCE.DESK,
      registeredAt: new Date().toISOString(),
      status: "checkedIn",
    });
    setClients(loadClients());
    setRooms(loadRooms());
    setNewClient(EMPTY_CLIENT);
    setPage(1);
    addModal.onClose();
    showSuccess(t("clients.addSuccessTitle"), t("clients.addSuccessDesc"));
  };

  const openDetails = (client) => {
    setSelectedClient(client);
    detailsModal.onOpen();
  };

  const openCheckout = () => {
    const open = getOpenRentalsForClient(selectedClient.name);
    setReturnAllRentals(true);
    setReturnedIds(open.map((r) => r.id));
    checkoutModal.onOpen();
  };

  const handleCheckout = () => {
    const result = checkoutClient(selectedClient.name, {
      returnAllRentals,
      returnedIds,
    });
    setClients(result.clients);
    setRooms(result.rooms);
    setSelectedClient(
      result.clients.find((c) => c.name === selectedClient.name) || null
    );
    checkoutModal.onClose();
    detailsModal.onClose();
    showSuccess(t("clients.checkoutSuccessTitle"), t("clients.checkoutSuccessDesc"));
  };

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
      // clipboard indisponível
    }
  };

  const toggleReturnedId = (id) => {
    setReturnedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
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
            onClick={() => {
              setNewClient(EMPTY_CLIENT);
              addModal.onOpen();
            }}
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
                  <Th>{t("clients.status")}</Th>
                  <Th>{t("clients.source")}</Th>
                </Tr>
              </Thead>
              <Tbody>
                {pageClients.map((client, index) => {
                  const checkedOut = client.status === "checkedOut";
                  return (
                    <Tr
                      key={`${client.email}-${index}`}
                      onClick={() => openDetails(client)}
                      cursor="pointer"
                      _hover={{ bg: rowHover }}
                      opacity={checkedOut ? 0.65 : 1}
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
                      <Td fontSize="sm">{client.country || "—"}</Td>
                      <Td fontSize="sm">{formatDate(client.registeredAt)}</Td>
                      <Td>
                        <Badge
                          colorScheme={checkedOut ? "gray" : "green"}
                          borderRadius="full"
                          textTransform="none"
                        >
                          {checkedOut
                            ? t("clients.statusCheckedOut")
                            : t("clients.statusCheckedIn")}
                        </Badge>
                      </Td>
                      <Td>
                        <SourceBadge source={client.source} t={t} />
                      </Td>
                    </Tr>
                  );
                })}
              </Tbody>
            </Table>
          </TableContainer>

          {sortedClients.length === 0 && (
            <Flex direction="column" align="center" py={12} color="gray.500">
              <Icon as={FiUsers} boxSize={8} mb={3} />
              <Text>{t("clients.empty")}</Text>
            </Flex>
          )}

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

      {/* Detalhes */}
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
                  <HStack mt={2} spacing={2}>
                    <SourceBadge source={selectedClient.source} t={t} />
                    <Badge
                      colorScheme={
                        selectedClient.status === "checkedOut" ? "gray" : "green"
                      }
                      borderRadius="full"
                      textTransform="none"
                    >
                      {selectedClient.status === "checkedOut"
                        ? t("clients.statusCheckedOut")
                        : t("clients.statusCheckedIn")}
                    </Badge>
                  </HStack>
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
                  {getClientLocker(selectedClient) || "—"}
                </InfoField>
                <InfoField label={t("clients.cpf")}>
                  {selectedClient.cpf || "—"}
                </InfoField>
                <InfoField label={t("clients.documentId")}>
                  {selectedClient.documentId || "—"}
                </InfoField>
                <InfoField label={t("clients.country")}>
                  {selectedClient.country || "—"}
                </InfoField>
                <InfoField label={t("clients.languageMain")}>
                  {languageLabels(selectedClient)}
                </InfoField>
                <InfoField label={t("clients.registeredAt")}>
                  {formatDate(selectedClient.registeredAt, true)}
                </InfoField>
                {selectedClient.checkedOutAt && (
                  <InfoField label={t("clients.checkedOutAt")}>
                    {formatDate(selectedClient.checkedOutAt, true)}
                  </InfoField>
                )}
              </SimpleGrid>

              {selectedClient.status !== "checkedOut" && (
                <Button
                  mt={6}
                  w="100%"
                  colorScheme="orange"
                  leftIcon={<FiLogOut />}
                  onClick={openCheckout}
                >
                  {t("clients.checkout")}
                </Button>
              )}
            </ModalBody>
          )}
        </ModalContent>
      </Modal>

      {/* Checkout */}
      <Modal
        isOpen={checkoutModal.isOpen}
        onClose={checkoutModal.onClose}
        isCentered
      >
        <ModalOverlay backdropFilter="blur(4px)" />
        <ModalContent borderRadius="16px">
          <ModalHeader>{t("clients.checkoutTitle")}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text fontSize="sm" color="gray.500" mb={4}>
              {t("clients.checkoutDesc")}
            </Text>

            {openRentals.length > 0 ? (
              <Stack spacing={3}>
                <Checkbox
                  colorScheme="brand"
                  isChecked={returnAllRentals}
                  onChange={(e) => {
                    setReturnAllRentals(e.target.checked);
                    if (e.target.checked) {
                      setReturnedIds(openRentals.map((r) => r.id));
                    } else {
                      setReturnedIds([]);
                    }
                  }}
                >
                  {t("clients.returnAllRentals")}
                </Checkbox>
                <Divider />
                {openRentals.map((rental) => (
                  <Checkbox
                    key={rental.id}
                    colorScheme="brand"
                    isChecked={returnedIds.includes(rental.id)}
                    onChange={() => {
                      setReturnAllRentals(false);
                      toggleReturnedId(rental.id);
                    }}
                  >
                    {t(`rentals.items.${rental.itemType}`)}
                  </Checkbox>
                ))}
              </Stack>
            ) : (
              <Text fontSize="sm">{t("clients.noOpenRentals")}</Text>
            )}
          </ModalBody>
          <ModalFooter gap={3}>
            <Button variant="ghost" onClick={checkoutModal.onClose}>
              {t("common.cancel")}
            </Button>
            <Button colorScheme="brand" onClick={handleCheckout}>
              {t("clients.confirmCheckout")}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Adicionar */}
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
            />
          </ModalBody>
          <ModalFooter gap={3}>
            <Button variant="ghost" onClick={addModal.onClose}>
              {t("common.cancel")}
            </Button>
            <Button
              colorScheme="brand"
              onClick={handleAddClient}
              isDisabled={!newClient.name.trim()}
            >
              {t("common.save")}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Link */}
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

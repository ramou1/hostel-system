import React, { useMemo, useState } from "react";
import {
  Badge,
  Button,
  Card,
  CardBody,
  Flex,
  FormControl,
  FormLabel,
  Icon,
  IconButton,
  Input,
  InputGroup,
  InputLeftElement,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Select,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useDisclosure,
  useColorModeValue,
} from "@chakra-ui/react";
import { FiPlus, FiSearch, FiShoppingBag, FiTrash2 } from "react-icons/fi";
import { useI18n } from "../contexts/LanguageContext";
import useToastService from "../services/ToastService";
import {
  RENTAL_ITEM_TYPES,
  loadRentals,
  addRental,
  removeRental,
  loadClients,
} from "../data/store";

function formatMoney(value, lang) {
  const locale = lang === "pt" ? "pt-BR" : "en-US";
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: "BRL",
  }).format(Number(value) || 0);
}

function Rentals() {
  const { t, lang } = useI18n();
  const { showSuccess } = useToastService();
  const addModal = useDisclosure();

  const [rentals, setRentals] = useState(loadRentals);
  const [clients] = useState(loadClients);
  const [searchTerm, setSearchTerm] = useState("");
  const [form, setForm] = useState({
    itemType: "towel",
    clientName: "",
    price: "",
  });

  const muted = useColorModeValue("gray.500", "gray.400");
  const rowHover = useColorModeValue("gray.50", "whiteAlpha.100");

  const clientNames = useMemo(
    () => [...new Set(clients.map((c) => c.name))].sort(),
    [clients]
  );

  const filtered = useMemo(() => {
    const term = searchTerm.toLowerCase();
    return rentals.filter(
      (r) =>
        r.clientName.toLowerCase().includes(term) ||
        t(`rentals.items.${r.itemType}`).toLowerCase().includes(term)
    );
  }, [rentals, searchTerm, t]);

  const formatDate = (iso) => {
    if (!iso) return "—";
    const locale = lang === "pt" ? "pt-BR" : "en-US";
    return new Intl.DateTimeFormat(locale, {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(iso));
  };

  const openAdd = () => {
    setForm({ itemType: "towel", clientName: "", price: "" });
    addModal.onOpen();
  };

  const handleAdd = () => {
    if (!form.clientName.trim()) return;
    const next = addRental({
      itemType: form.itemType,
      clientName: form.clientName.trim(),
      price: form.price,
    });
    setRentals(next);
    addModal.onClose();
    showSuccess(t("rentals.addSuccessTitle"), t("rentals.addSuccessDesc"));
  };

  const handleRemove = (id) => {
    setRentals(removeRental(id));
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
            placeholder={t("rentals.searchPlaceholder")}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </InputGroup>
        <Button
          ml={{ sm: "auto" }}
          colorScheme="brand"
          leftIcon={<FiPlus />}
          onClick={openAdd}
        >
          {t("rentals.addNew")}
        </Button>
      </Flex>

      <Card>
        <CardBody p={0}>
          <TableContainer>
            <Table size="sm" variant="simple">
              <Thead>
                <Tr>
                  <Th>{t("rentals.item")}</Th>
                  <Th>{t("rentals.client")}</Th>
                  <Th>{t("rentals.price")}</Th>
                  <Th>{t("rentals.rentedAt")}</Th>
                  <Th />
                </Tr>
              </Thead>
              <Tbody>
                {filtered.map((rental) => (
                  <Tr key={rental.id} _hover={{ bg: rowHover }}>
                    <Td>
                      <Badge
                        colorScheme="brand"
                        borderRadius="full"
                        textTransform="none"
                        px={2}
                      >
                        {t(`rentals.items.${rental.itemType}`)}
                      </Badge>
                    </Td>
                    <Td fontWeight={600} fontSize="sm">
                      {rental.clientName}
                    </Td>
                    <Td fontSize="sm">{formatMoney(rental.price, lang)}</Td>
                    <Td fontSize="sm" color={muted}>
                      {formatDate(rental.rentedAt)}
                    </Td>
                    <Td textAlign="right">
                      <IconButton
                        aria-label={t("common.remove")}
                        icon={<FiTrash2 />}
                        size="sm"
                        variant="ghost"
                        colorScheme="red"
                        onClick={() => handleRemove(rental.id)}
                      />
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </TableContainer>

          {filtered.length === 0 && (
            <Flex direction="column" align="center" py={12} color={muted}>
              <Icon as={FiShoppingBag} boxSize={8} mb={3} />
              <Text fontSize="sm">{t("rentals.empty")}</Text>
            </Flex>
          )}
        </CardBody>
      </Card>

      <Modal isOpen={addModal.isOpen} onClose={addModal.onClose} isCentered>
        <ModalOverlay backdropFilter="blur(4px)" />
        <ModalContent borderRadius="16px">
          <ModalHeader>{t("rentals.addTitle")}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl mb={4} isRequired>
              <FormLabel fontSize="sm">{t("rentals.item")}</FormLabel>
              <Select
                value={form.itemType}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, itemType: e.target.value }))
                }
              >
                {RENTAL_ITEM_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {t(`rentals.items.${type}`)}
                  </option>
                ))}
              </Select>
            </FormControl>

            <FormControl mb={4} isRequired>
              <FormLabel fontSize="sm">{t("rentals.client")}</FormLabel>
              <Select
                placeholder={t("rentals.selectClient")}
                value={form.clientName}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, clientName: e.target.value }))
                }
              >
                {clientNames.map((name) => (
                  <option key={name} value={name}>
                    {name}
                  </option>
                ))}
              </Select>
            </FormControl>

            <FormControl isRequired>
              <FormLabel fontSize="sm">{t("rentals.price")}</FormLabel>
              <Input
                type="number"
                min="0"
                step="0.01"
                placeholder="0,00"
                value={form.price}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, price: e.target.value }))
                }
              />
            </FormControl>
          </ModalBody>
          <ModalFooter gap={3}>
            <Button variant="ghost" onClick={addModal.onClose}>
              {t("common.cancel")}
            </Button>
            <Button
              colorScheme="brand"
              onClick={handleAdd}
              isDisabled={!form.clientName || form.price === ""}
            >
              {t("common.add")}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

export default Rentals;

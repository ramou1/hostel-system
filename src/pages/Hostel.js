import React, { useMemo, useState } from "react";
import {
  Box,
  Button,
  Card,
  CardBody,
  Divider,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  HStack,
  Icon,
  IconButton,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Select,
  SimpleGrid,
  Stack,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Textarea,
  Th,
  Thead,
  Tr,
  Badge,
  useDisclosure,
  useColorModeValue,
} from "@chakra-ui/react";
import { FiPlus, FiSave, FiTrash2, FiHome } from "react-icons/fi";
import { useI18n } from "../contexts/LanguageContext";
import useToastService from "../services/ToastService";
import {
  loadHostel,
  saveHostel,
  loadLockers,
  addLocker,
  removeLocker,
  assignLockerToClient,
  loadClients,
} from "../data/store";

function Hostel() {
  const { t } = useI18n();
  const { showSuccess } = useToastService();
  const lockerModal = useDisclosure();

  const [hostel, setHostel] = useState(loadHostel);
  const [lockers, setLockers] = useState(loadLockers);
  const [clients] = useState(loadClients);
  const [newLockerCode, setNewLockerCode] = useState("");
  const [assignDraft, setAssignDraft] = useState({});

  const muted = useColorModeValue("gray.500", "gray.400");
  const sectionBg = useColorModeValue("gray.50", "whiteAlpha.50");

  const clientNames = useMemo(
    () => [...new Set(clients.map((c) => c.name))].sort(),
    [clients]
  );

  const setField = (e) => {
    const { name, value } = e.target;
    setHostel((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveHostel = () => {
    saveHostel(hostel);
    showSuccess(t("hostel.saveSuccessTitle"), t("hostel.saveSuccessDesc"));
  };

  const handleAddLocker = () => {
    const code = newLockerCode.trim();
    if (!code) return;
    const next = addLocker({ code, clientName: "" });
    setLockers(next);
    setNewLockerCode("");
    lockerModal.onClose();
    showSuccess(t("hostel.lockerAddSuccessTitle"), t("hostel.lockerAddSuccessDesc"));
  };

  const handleRemoveLocker = (id) => {
    setLockers(removeLocker(id));
  };

  const handleAssign = (lockerId) => {
    const clientName = assignDraft[lockerId] ?? "";
    const { lockers: next } = assignLockerToClient(lockerId, clientName);
    setLockers(next);
    showSuccess(t("hostel.lockerAssignSuccessTitle"), t("hostel.lockerAssignSuccessDesc"));
  };

  return (
    <Stack spacing={6}>
      {/* Dados do hostel */}
      <Card>
        <CardBody>
          <Flex align="center" gap={3} mb={5}>
            <Flex
              align="center"
              justify="center"
              boxSize="44px"
              borderRadius="12px"
              bg="brand.500"
              color="white"
            >
              <Icon as={FiHome} boxSize={5} />
            </Flex>
            <Box>
              <Heading fontSize="lg">{t("hostel.infoTitle")}</Heading>
              <Text fontSize="sm" color={muted}>
                {t("hostel.infoSubtitle")}
              </Text>
            </Box>
          </Flex>

          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
            <FormControl isRequired>
              <FormLabel fontSize="sm">{t("hostel.name")}</FormLabel>
              <Input name="name" value={hostel.name} onChange={setField} />
            </FormControl>
            <FormControl>
              <FormLabel fontSize="sm">{t("hostel.email")}</FormLabel>
              <Input
                name="email"
                type="email"
                value={hostel.email}
                onChange={setField}
              />
            </FormControl>
            <FormControl>
              <FormLabel fontSize="sm">{t("hostel.phone")}</FormLabel>
              <Input name="phone" value={hostel.phone} onChange={setField} />
            </FormControl>
            <FormControl>
              <FormLabel fontSize="sm">{t("hostel.country")}</FormLabel>
              <Input name="country" value={hostel.country} onChange={setField} />
            </FormControl>
            <FormControl>
              <FormLabel fontSize="sm">{t("hostel.city")}</FormLabel>
              <Input name="city" value={hostel.city} onChange={setField} />
            </FormControl>
            <FormControl>
              <FormLabel fontSize="sm">{t("hostel.address")}</FormLabel>
              <Input name="address" value={hostel.address} onChange={setField} />
            </FormControl>
            <FormControl gridColumn={{ md: "1 / -1" }}>
              <FormLabel fontSize="sm">{t("hostel.description")}</FormLabel>
              <Textarea
                name="description"
                value={hostel.description}
                onChange={setField}
                rows={3}
              />
            </FormControl>
          </SimpleGrid>

          <Divider my={6} />

          <FormControl mb={4}>
            <FormLabel fontSize="sm">{t("hostel.rules")}</FormLabel>
            <Text fontSize="xs" color={muted} mb={2}>
              {t("hostel.rulesHint")}
            </Text>
            <Textarea
              name="rules"
              value={hostel.rules}
              onChange={setField}
              rows={6}
              placeholder={t("hostel.rulesPlaceholder")}
            />
          </FormControl>

          <Flex justify="flex-end">
            <Button
              colorScheme="brand"
              leftIcon={<FiSave />}
              onClick={handleSaveHostel}
            >
              {t("common.save")}
            </Button>
          </Flex>
        </CardBody>
      </Card>

      {/* Armários */}
      <Card>
        <CardBody>
          <Flex
            align={{ base: "stretch", sm: "center" }}
            justify="space-between"
            direction={{ base: "column", sm: "row" }}
            gap={3}
            mb={4}
          >
            <Box>
              <Heading fontSize="lg">{t("hostel.lockersTitle")}</Heading>
              <Text fontSize="sm" color={muted}>
                {t("hostel.lockersSubtitle")}
              </Text>
            </Box>
            <Button
              colorScheme="brand"
              leftIcon={<FiPlus />}
              onClick={lockerModal.onOpen}
              alignSelf={{ base: "stretch", sm: "auto" }}
            >
              {t("hostel.addLocker")}
            </Button>
          </Flex>

          <TableContainer>
            <Table size="sm" variant="simple">
              <Thead>
                <Tr>
                  <Th>{t("hostel.lockerCode")}</Th>
                  <Th>{t("hostel.lockerClient")}</Th>
                  <Th>{t("hostel.lockerStatus")}</Th>
                  <Th textAlign="right">{t("common.save")}</Th>
                </Tr>
              </Thead>
              <Tbody>
                {lockers.map((lk) => {
                  const draft =
                    assignDraft[lk.id] !== undefined
                      ? assignDraft[lk.id]
                      : lk.clientName || "";
                  const occupied = !!lk.clientName;
                  return (
                    <Tr key={lk.id}>
                      <Td fontWeight={600}>{lk.code}</Td>
                      <Td minW="180px">
                        <Select
                          size="sm"
                          value={draft}
                          onChange={(e) =>
                            setAssignDraft((prev) => ({
                              ...prev,
                              [lk.id]: e.target.value,
                            }))
                          }
                        >
                          <option value="">{t("hostel.noClient")}</option>
                          {clientNames.map((name) => (
                            <option key={name} value={name}>
                              {name}
                            </option>
                          ))}
                        </Select>
                      </Td>
                      <Td>
                        <Badge
                          colorScheme={occupied ? "green" : "gray"}
                          borderRadius="full"
                          textTransform="none"
                        >
                          {occupied
                            ? t("hostel.lockerOccupied")
                            : t("hostel.lockerFree")}
                        </Badge>
                      </Td>
                      <Td>
                        <HStack justify="flex-end" spacing={1}>
                          <Button
                            size="sm"
                            colorScheme="brand"
                            variant="outline"
                            onClick={() => handleAssign(lk.id)}
                          >
                            {t("hostel.assign")}
                          </Button>
                          <IconButton
                            aria-label={t("common.remove")}
                            icon={<FiTrash2 />}
                            size="sm"
                            variant="ghost"
                            colorScheme="red"
                            onClick={() => handleRemoveLocker(lk.id)}
                          />
                        </HStack>
                      </Td>
                    </Tr>
                  );
                })}
              </Tbody>
            </Table>
          </TableContainer>

          {lockers.length === 0 && (
            <Flex
              direction="column"
              align="center"
              py={10}
              bg={sectionBg}
              borderRadius="12px"
              color={muted}
            >
              <Text fontSize="sm">{t("hostel.lockersEmpty")}</Text>
            </Flex>
          )}
        </CardBody>
      </Card>

      <Modal isOpen={lockerModal.isOpen} onClose={lockerModal.onClose} isCentered>
        <ModalOverlay backdropFilter="blur(4px)" />
        <ModalContent borderRadius="16px">
          <ModalHeader>{t("hostel.addLocker")}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl isRequired>
              <FormLabel fontSize="sm">{t("hostel.lockerCode")}</FormLabel>
              <Input
                placeholder="A-10"
                value={newLockerCode}
                onChange={(e) => setNewLockerCode(e.target.value)}
              />
            </FormControl>
          </ModalBody>
          <ModalFooter gap={3}>
            <Button variant="ghost" onClick={lockerModal.onClose}>
              {t("common.cancel")}
            </Button>
            <Button
              colorScheme="brand"
              onClick={handleAddLocker}
              isDisabled={!newLockerCode.trim()}
            >
              {t("common.add")}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Stack>
  );
}

export default Hostel;

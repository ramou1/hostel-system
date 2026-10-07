import React, { useState } from "react";
import {
  Button,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Box,
  Input,
  InputGroup,
  InputLeftElement,
  Flex,
  HStack,
  IconButton,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Select,
  Card,
  CardBody,
  Badge,
  Text,
  Icon,
} from "@chakra-ui/react";
import { FiPlus, FiSearch, FiKey, FiTrash2 } from "react-icons/fi";
import useToastService from "../services/ToastService";
import { useI18n } from "../contexts/LanguageContext";
import { loadRooms, saveRooms, normalizeRoom } from "../data/store";

const TYPE_COLORS = { male: "blue", female: "pink", mixed: "purple" };

const EMPTY_ROOM = {
  name: "",
  category: "dorm",
  type: "mixed",
  bathroom: "shared",
  beds: [],
};

function bedSummary(room, t) {
  const groups = Array.isArray(room.beds) ? room.beds : [];
  if (!groups.length) return "—";
  return groups
    .map((group) =>
      t("rooms.bedSummary")
        .replace("{type}", t(`rooms.bedTypes.${group.type}`))
        .replace("{n}", group.quantity)
    )
    .join(", ");
}

function Rooms() {
  const { t } = useI18n();
  const { showSuccess } = useToastService();
  const [searchTerm, setSearchTerm] = useState("");
  const [rooms, setRooms] = useState(loadRooms);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [newRoom, setNewRoom] = useState(EMPTY_ROOM);
  const [bedType, setBedType] = useState("bunk");
  const [bedQty, setBedQty] = useState("1");

  const filteredRooms = rooms.filter((room) =>
    room.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSearchChange = (event) => setSearchTerm(event.target.value);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "category") {
      setBedType(value === "private" ? "double" : "bunk");
      setNewRoom((prev) => ({
        ...prev,
        category: value,
        type: value === "dorm" ? prev.type || "mixed" : "mixed",
        bathroom: value === "private" ? "private" : "shared",
      }));
      return;
    }
    setNewRoom((prev) => ({ ...prev, [name]: value }));
  };

  const totalBeds = newRoom.beds.reduce((sum, group) => sum + group.quantity, 0);

  const resetForm = () => {
    setNewRoom(EMPTY_ROOM);
    setBedType("bunk");
    setBedQty("1");
  };

  const handleAddBed = () => {
    const quantity = Math.floor(Number(bedQty));
    if (!Number.isFinite(quantity) || quantity < 1) return;
    setNewRoom((prev) => {
      const exists = prev.beds.some((group) => group.type === bedType);
      const beds = exists
        ? prev.beds.map((group) =>
            group.type === bedType
              ? { ...group, quantity: group.quantity + quantity }
              : group
          )
        : [...prev.beds, { type: bedType, quantity }];
      return { ...prev, beds };
    });
    setBedQty("1");
  };

  const handleRemoveBed = (type) => {
    setNewRoom((prev) => ({
      ...prev,
      beds: prev.beds.filter((group) => group.type !== type),
    }));
  };

  const handleAddRoom = () => {
    const next = [
      ...rooms,
      normalizeRoom({
        ...newRoom,
        clients: 0,
      }),
    ];
    setRooms(next);
    saveRooms(next);
    resetForm();
    showSuccess(t("rooms.addSuccessTitle"), t("rooms.addSuccessDesc"));
    onClose();
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
            placeholder={t("rooms.searchPlaceholder")}
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </InputGroup>
        <Button
          onClick={onOpen}
          colorScheme="brand"
          leftIcon={<FiPlus />}
          flexShrink={0}
        >
          {t("rooms.addNew")}
        </Button>
      </Flex>

      <Card>
        <CardBody p={0}>
          <TableContainer>
            <Table variant="simple" size="sm">
              <Thead>
                <Tr>
                  <Th>{t("rooms.name")}</Th>
                  <Th>{t("rooms.category")}</Th>
                  <Th isNumeric>{t("rooms.capacity")}</Th>
                  <Th isNumeric>{t("rooms.clients")}</Th>
                  <Th isNumeric>{t("rooms.availableSpaces")}</Th>
                  <Th>{t("rooms.beds")}</Th>
                  <Th>{t("rooms.bathroom")}</Th>
                  <Th>{t("rooms.type")}</Th>
                </Tr>
              </Thead>
              <Tbody>
                {filteredRooms.map((room, index) => (
                  <Tr key={`${room.name}-${index}`}>
                    <Td fontWeight={600}>{room.name}</Td>
                    <Td>
                      <Badge
                        colorScheme={room.category === "private" ? "teal" : "orange"}
                        borderRadius="full"
                        px={2}
                      >
                        {t(`rooms.categories.${room.category}`)}
                      </Badge>
                    </Td>
                    <Td isNumeric>{room.capacity}</Td>
                    <Td isNumeric>{room.clients}</Td>
                    <Td isNumeric>{room.availableSpaces}</Td>
                    <Td whiteSpace="normal">{bedSummary(room, t)}</Td>
                    <Td>{t(`rooms.bathrooms.${room.bathroom}`)}</Td>
                    <Td>
                      {room.category === "dorm" ? (
                        <Badge
                          colorScheme={TYPE_COLORS[room.type] || "gray"}
                          borderRadius="full"
                          px={2}
                        >
                          {t(`rooms.types.${room.type}`)}
                        </Badge>
                      ) : (
                        "—"
                      )}
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </TableContainer>

          {filteredRooms.length === 0 && (
            <Flex direction="column" align="center" py={12} color="gray.500">
              <Icon as={FiKey} boxSize={8} mb={3} />
              <Text>{t("rooms.empty")}</Text>
            </Flex>
          )}
        </CardBody>
      </Card>

      <Modal
        isOpen={isOpen}
        onClose={() => {
          resetForm();
          onClose();
        }}
        isCentered
        size="lg"
      >
        <ModalOverlay backdropFilter="blur(4px)" />
        <ModalContent borderRadius="16px">
          <ModalHeader>{t("rooms.addTitle")}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl mb={3} isRequired>
              <FormLabel fontSize="sm">{t("rooms.name")}</FormLabel>
              <Input
                placeholder={t("rooms.name")}
                name="name"
                value={newRoom.name}
                onChange={handleInputChange}
              />
            </FormControl>
            <FormControl mb={3} isRequired>
              <FormLabel fontSize="sm">{t("rooms.category")}</FormLabel>
              <Select
                name="category"
                value={newRoom.category}
                onChange={handleInputChange}
              >
                <option value="dorm">{t("rooms.categories.dorm")}</option>
                <option value="private">{t("rooms.categories.private")}</option>
              </Select>
            </FormControl>
            <FormControl mb={3} isRequired>
              <FormLabel fontSize="sm">{t("rooms.beds")}</FormLabel>
              <HStack align="flex-end" spacing={2}>
                <FormControl>
                  <FormLabel fontSize="xs" color="gray.500">
                    {t("rooms.bedType")}
                  </FormLabel>
                  <Select
                    value={bedType}
                    onChange={(e) => setBedType(e.target.value)}
                  >
                    <option value="single">{t("rooms.bedTypes.single")}</option>
                    <option value="double">{t("rooms.bedTypes.double")}</option>
                    <option value="queen">{t("rooms.bedTypes.queen")}</option>
                    <option value="bunk">{t("rooms.bedTypes.bunk")}</option>
                  </Select>
                </FormControl>
                <FormControl maxW="110px">
                  <FormLabel fontSize="xs" color="gray.500">
                    {t("rooms.bedQuantity")}
                  </FormLabel>
                  <Input
                    type="number"
                    min={1}
                    value={bedQty}
                    onChange={(e) => setBedQty(e.target.value)}
                  />
                </FormControl>
                <Button
                  leftIcon={<FiPlus />}
                  onClick={handleAddBed}
                  flexShrink={0}
                  isDisabled={Math.floor(Number(bedQty)) < 1}
                >
                  {t("rooms.addBed")}
                </Button>
              </HStack>
              {newRoom.beds.length === 0 ? (
                <Text fontSize="xs" color="gray.500" mt={2}>
                  {t("rooms.bedsEmpty")}
                </Text>
              ) : (
                <Box mt={3}>
                  {newRoom.beds.map((group) => (
                    <Flex
                      key={group.type}
                      align="center"
                      justify="space-between"
                      py={1}
                    >
                      <Text fontSize="sm">
                        {t("rooms.bedSummary")
                          .replace("{type}", t(`rooms.bedTypes.${group.type}`))
                          .replace("{n}", group.quantity)}
                      </Text>
                      <IconButton
                        aria-label={t("rooms.removeBed")}
                        icon={<FiTrash2 />}
                        size="sm"
                        variant="ghost"
                        onClick={() => handleRemoveBed(group.type)}
                      />
                    </Flex>
                  ))}
                  <Text fontSize="xs" color="gray.500" mt={1}>
                    {t("rooms.bedsTotal").replace("{n}", totalBeds)}
                    {" · "}
                    {t("rooms.clientsAutoHint")}
                  </Text>
                </Box>
              )}
            </FormControl>
            <FormControl mb={3}>
              <FormLabel fontSize="sm">{t("rooms.bathroom")}</FormLabel>
              <Select
                name="bathroom"
                value={newRoom.bathroom}
                onChange={handleInputChange}
              >
                <option value="private">{t("rooms.bathrooms.private")}</option>
                <option value="shared">{t("rooms.bathrooms.shared")}</option>
              </Select>
            </FormControl>
            {newRoom.category === "dorm" && (
              <FormControl mb={3}>
                <FormLabel fontSize="sm">{t("rooms.dormGender")}</FormLabel>
                <Select name="type" value={newRoom.type} onChange={handleInputChange}>
                  <option value="male">{t("rooms.types.male")}</option>
                  <option value="female">{t("rooms.types.female")}</option>
                  <option value="mixed">{t("rooms.types.mixed")}</option>
                </Select>
              </FormControl>
            )}
          </ModalBody>
          <ModalFooter gap={3}>
            <Button
              variant="ghost"
              onClick={() => {
                resetForm();
                onClose();
              }}
            >
              {t("common.cancel")}
            </Button>
            <Button
              colorScheme="brand"
              onClick={handleAddRoom}
              isDisabled={!newRoom.name.trim() || totalBeds < 1}
            >
              {t("common.save")}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

export default Rooms;

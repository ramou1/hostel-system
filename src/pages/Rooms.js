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
  Input,
  InputGroup,
  InputLeftElement,
  Flex,
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
import { FiPlus, FiSearch, FiKey } from "react-icons/fi";
import useToastService from "../services/ToastService";
import { useI18n } from "../contexts/LanguageContext";
import { loadRooms, saveRooms } from "../data/store";

const TYPE_COLORS = { male: "blue", female: "pink", mixed: "purple" };

function Rooms() {
  const { t } = useI18n();
  const { showSuccess } = useToastService();
  const [searchTerm, setSearchTerm] = useState("");
  const [rooms, setRooms] = useState(loadRooms);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [newRoom, setNewRoom] = useState({
    name: "",
    capacity: "",
    type: "male",
  });

  const filteredRooms = rooms.filter((room) =>
    room.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSearchChange = (event) => setSearchTerm(event.target.value);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewRoom((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddRoom = () => {
    const capacity = Number(newRoom.capacity) || 0;
    const next = [
      ...rooms,
      {
        name: newRoom.name,
        capacity,
        clients: 0,
        availableSpaces: capacity,
        type: newRoom.type,
      },
    ];
    setRooms(next);
    saveRooms(next);
    setNewRoom({ name: "", capacity: "", type: "male" });
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
            <Table variant="simple">
              <Thead>
                <Tr>
                  <Th>{t("rooms.name")}</Th>
                  <Th isNumeric>{t("rooms.capacity")}</Th>
                  <Th isNumeric>{t("rooms.clients")}</Th>
                  <Th isNumeric>{t("rooms.availableSpaces")}</Th>
                  <Th>{t("rooms.type")}</Th>
                </Tr>
              </Thead>
              <Tbody>
                {filteredRooms.map((room, index) => (
                  <Tr key={index}>
                    <Td fontWeight={600}>{room.name}</Td>
                    <Td isNumeric>{room.capacity}</Td>
                    <Td isNumeric>{room.clients}</Td>
                    <Td isNumeric>{room.availableSpaces}</Td>
                    <Td>
                      <Badge
                        colorScheme={TYPE_COLORS[room.type] || "gray"}
                        borderRadius="full"
                        px={2}
                      >
                        {t(`rooms.types.${room.type}`)}
                      </Badge>
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

      <Modal isOpen={isOpen} onClose={onClose} isCentered>
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
              <FormLabel fontSize="sm">{t("rooms.capacity")}</FormLabel>
              <Input
                type="number"
                name="capacity"
                value={newRoom.capacity}
                onChange={handleInputChange}
              />
              <Text fontSize="xs" color="gray.500" mt={1}>
                {t("rooms.clientsAutoHint")}
              </Text>
            </FormControl>
            <FormControl mb={3}>
              <FormLabel fontSize="sm">{t("rooms.type")}</FormLabel>
              <Select name="type" value={newRoom.type} onChange={handleInputChange}>
                <option value="male">{t("rooms.types.male")}</option>
                <option value="female">{t("rooms.types.female")}</option>
                <option value="mixed">{t("rooms.types.mixed")}</option>
              </Select>
            </FormControl>
          </ModalBody>
          <ModalFooter gap={3}>
            <Button variant="ghost" onClick={onClose}>
              {t("common.cancel")}
            </Button>
            <Button
              colorScheme="brand"
              onClick={handleAddRoom}
              isDisabled={!newRoom.name.trim()}
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

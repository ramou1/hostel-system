import React, { useState } from "react";
import {
  Button,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Input,
  Flex,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
} from "@chakra-ui/react";
import { AddIcon } from "@chakra-ui/icons"; // Importar o ícone de adicionar
import useToastService from "../services/ToastService";

const initialRooms = [
  {
    name: "Quarto 101",
    capacity: 2,
    clients: 2,
    availableSpaces: 0,
    type: "Masculino",
  },
  {
    name: "Quarto 102",
    capacity: 3,
    clients: 1,
    availableSpaces: 2,
    type: "Feminino",
  },
  {
    name: "Quarto 103",
    capacity: 4,
    clients: 3,
    availableSpaces: 1,
    type: "Misto",
  },
  {
    name: "Quarto 104",
    capacity: 5,
    clients: 5,
    availableSpaces: 0,
    type: "Feminino",
  },
];

function Rooms() {
  const { showSuccess, showError } = useToastService();
  const [searchTerm, setSearchTerm] = useState("");
  const [rooms, setRooms] = useState(initialRooms);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const filteredRooms = rooms.filter((room) =>
    room.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleAddRoom = () => {
    // Lógica para adicionar um novo quarto
    showSuccess("Success!", "Room added successfully.");
    onClose();
  };

  return (
    <div>
      <Flex mb={4} alignItems="center">
        <Input
          placeholder="Search rooms..."
          value={searchTerm}
          onChange={handleSearchChange}
          mr={4}
        />
        <Button onClick={onOpen} colorScheme="teal" leftIcon={<AddIcon />}>
          Add New Room
        </Button>
      </Flex>

      <Table variant="striped">
        <Thead>
          <Tr>
            <Th>Name</Th>
            <Th>Capacity</Th>
            <Th>Clients</Th>
            <Th>Available Spaces</Th>
            <Th>Type</Th>
          </Tr>
        </Thead>
        <Tbody>
          {filteredRooms.map((room, index) => (
            <Tr key={index}>
              <Td>{room.name}</Td>
              <Td>{room.capacity}</Td>
              <Td>{room.clients}</Td>
              <Td>{room.availableSpaces}</Td>
              <Td>{room.type}</Td>
            </Tr>
          ))}
        </Tbody>
      </Table>

      {/* Modal para adicionar um novo quarto */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add New Room</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl>
              <FormLabel>Room Name</FormLabel>
              <Input placeholder="Enter room name" />
            </FormControl>
            <FormControl mt={4}>
              <FormLabel>Capacity</FormLabel>
              <Input placeholder="Enter capacity" type="number" />
            </FormControl>
            <FormControl mt={4}>
              <FormLabel>Clients</FormLabel>
              <Input placeholder="Enter number of clients" type="number" />
            </FormControl>
            <FormControl mt={4}>
              <FormLabel>Available Spaces</FormLabel>
              <Input placeholder="Enter available spaces" type="number" />
            </FormControl>
            <FormControl mt={4}>
              <FormLabel>Type</FormLabel>
              <Input placeholder="Enter room type (Feminino, Masculino, Misto)" />
            </FormControl>
          </ModalBody>
          <Button colorScheme="teal" onClick={handleAddRoom} mt={4}>
            Add Room
          </Button>
        </ModalContent>
      </Modal>
    </div>
  );
}

export default Rooms;

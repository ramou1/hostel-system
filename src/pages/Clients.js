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
} from "@chakra-ui/react";
import { AddIcon } from "@chakra-ui/icons";

function Clients() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [clients, setClients] = useState([
    {
      name: "John Doe",
      email: "john@example.com",
      phone: "123-456-7890",
      room: "101",
      cpf: "123.456.789-00",
      photo: "path/to/photo1.jpg",
    },
    {
      name: "Jane Smith",
      email: "jane.smith@example.com",
      phone: "987-654-3210",
      room: "102",
      cpf: "987.654.321-00",
      photo: "path/to/photo2.jpg",
    },
    {
      name: "Michael Johnson",
      email: "michael.johnson@example.com",
      phone: "555-123-4567",
      room: "103",
      cpf: "555.123.456-78",
      photo: "path/to/photo3.jpg",
    },
    {
      name: "Emily Davis",
      email: "emily.davis@example.com",
      phone: "444-555-6666",
      room: "104",
      cpf: "444.555.666-66",
      photo: "path/to/photo4.jpg",
    },
    {
      name: "Robert Wilson",
      email: "robert.wilson@example.com",
      phone: "333-777-8888",
      room: "105",
      cpf: "333.777.888-88",
      photo: "path/to/photo5.jpg",
    },
  ]);
  const [searchTerm, setSearchTerm] = useState("");
  const [newClient, setNewClient] = useState({
    name: "",
    email: "",
    phone: "",
    room: "",
    cpf: "",
    photo: "",
  });

  const handleSearchChange = (e) => setSearchTerm(e.target.value);

  const filteredClients = clients.filter((client) =>
    client.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewClient((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddClient = () => {
    setClients([...clients, newClient]);
    setNewClient({
      name: "",
      email: "",
      phone: "",
      room: "",
      cpf: "",
      photo: "",
    });
    onClose();
  };

  return (
    <div>
      <Flex mb={4}>
        <Input
          placeholder="Search clients..."
          value={searchTerm}
          onChange={handleSearchChange}
          mr={4}
        />
        <Button onClick={onOpen} colorScheme="teal" leftIcon={<AddIcon />}>
          Add New Client
        </Button>
      </Flex>

      <Table variant="striped">
        <Thead>
          <Tr>
            <Th>Photo</Th>
            <Th>Name</Th>
            <Th>Email</Th>
            <Th>Phone</Th>
            <Th>Room</Th>
            <Th>CPF</Th>
          </Tr>
        </Thead>
        <Tbody>
          {filteredClients.map((client, index) => (
            <Tr key={index}>
              <Td>
                <img
                  src={client.photo}
                  alt={`${client.name}'s photo`}
                  onError={(e) => {
                    e.target.onerror = null; // Previne loop infinito se a imagem padrão também falhar
                    e.target.src = "/images/profile-default.png"; // Imagem padrão
                  }}
                  style={{ width: "50px", height: "50px", borderRadius: "50%" }}
                />
              </Td>
              <Td>{client.name}</Td>
              <Td>{client.email}</Td>
              <Td>{client.phone}</Td>
              <Td>{client.room}</Td>
              <Td>{client.cpf}</Td>
            </Tr>
          ))}
        </Tbody>
      </Table>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add New Client</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl mb={3}>
              <FormLabel>Photo URL</FormLabel>
              <Input
                placeholder="Photo URL"
                name="photo"
                value={newClient.photo}
                onChange={handleInputChange}
              />
            </FormControl>
            <FormControl mb={3}>
              <FormLabel>Name</FormLabel>
              <Input
                placeholder="Name"
                name="name"
                value={newClient.name}
                onChange={handleInputChange}
              />
            </FormControl>
            <FormControl mb={3}>
              <FormLabel>Email</FormLabel>
              <Input
                placeholder="Email"
                name="email"
                value={newClient.email}
                onChange={handleInputChange}
              />
            </FormControl>
            <FormControl mb={3}>
              <FormLabel>Phone</FormLabel>
              <Input
                placeholder="Phone"
                name="phone"
                value={newClient.phone}
                onChange={handleInputChange}
              />
            </FormControl>
            <FormControl mb={3}>
              <FormLabel>Room</FormLabel>
              <Input
                placeholder="Room"
                name="room"
                value={newClient.room}
                onChange={handleInputChange}
              />
            </FormControl>
            <FormControl mb={3}>
              <FormLabel>CPF</FormLabel>
              <Input
                placeholder="CPF"
                name="cpf"
                value={newClient.cpf}
                onChange={handleInputChange}
              />
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={handleAddClient}>
              Save
            </Button>
            <Button variant="ghost" onClick={onClose}>
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}

export default Clients;

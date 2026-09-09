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
  Icon,
} from "@chakra-ui/react";
import { FiPlus, FiSearch, FiUsers } from "react-icons/fi";
import { useI18n } from "../contexts/LanguageContext";

function Clients() {
  const { t } = useI18n();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [clients, setClients] = useState([
    {
      name: "John Doe",
      email: "john@example.com",
      phone: "123-456-7890",
      room: "101",
      cpf: "123.456.789-00",
      photo: "",
    },
    {
      name: "Jane Smith",
      email: "jane.smith@example.com",
      phone: "987-654-3210",
      room: "102",
      cpf: "987.654.321-00",
      photo: "",
    },
    {
      name: "Michael Johnson",
      email: "michael.johnson@example.com",
      phone: "555-123-4567",
      room: "103",
      cpf: "555.123.456-78",
      photo: "",
    },
    {
      name: "Emily Davis",
      email: "emily.davis@example.com",
      phone: "444-555-6666",
      room: "104",
      cpf: "444.555.666-66",
      photo: "",
    },
    {
      name: "Robert Wilson",
      email: "robert.wilson@example.com",
      phone: "333-777-8888",
      room: "105",
      cpf: "333.777.888-88",
      photo: "",
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
            bg="chakra-body-bg"
          />
        </InputGroup>
        <Button
          onClick={onOpen}
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
            <Table variant="simple">
              <Thead>
                <Tr>
                  <Th>{t("clients.photo")}</Th>
                  <Th>{t("clients.name")}</Th>
                  <Th>{t("clients.email")}</Th>
                  <Th>{t("clients.phone")}</Th>
                  <Th>{t("clients.room")}</Th>
                  <Th>{t("clients.cpf")}</Th>
                </Tr>
              </Thead>
              <Tbody>
                {filteredClients.map((client, index) => (
                  <Tr key={index}>
                    <Td>
                      <Avatar
                        size="sm"
                        name={client.name}
                        src={client.photo || undefined}
                      />
                    </Td>
                    <Td fontWeight={600}>{client.name}</Td>
                    <Td>{client.email}</Td>
                    <Td>{client.phone}</Td>
                    <Td>{client.room}</Td>
                    <Td>{client.cpf}</Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </TableContainer>

          {filteredClients.length === 0 && (
            <Flex direction="column" align="center" py={12} color="gray.500">
              <Icon as={FiUsers} boxSize={8} mb={3} />
              <Text>{t("clients.empty")}</Text>
            </Flex>
          )}
        </CardBody>
      </Card>

      <Modal isOpen={isOpen} onClose={onClose} isCentered>
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
            <FormControl mb={3}>
              <FormLabel fontSize="sm">{t("clients.name")}</FormLabel>
              <Input
                placeholder={t("clients.name")}
                name="name"
                value={newClient.name}
                onChange={handleInputChange}
              />
            </FormControl>
            <FormControl mb={3}>
              <FormLabel fontSize="sm">{t("clients.email")}</FormLabel>
              <Input
                placeholder={t("clients.email")}
                name="email"
                value={newClient.email}
                onChange={handleInputChange}
              />
            </FormControl>
            <FormControl mb={3}>
              <FormLabel fontSize="sm">{t("clients.phone")}</FormLabel>
              <Input
                placeholder={t("clients.phone")}
                name="phone"
                value={newClient.phone}
                onChange={handleInputChange}
              />
            </FormControl>
            <FormControl mb={3}>
              <FormLabel fontSize="sm">{t("clients.room")}</FormLabel>
              <Input
                placeholder={t("clients.room")}
                name="room"
                value={newClient.room}
                onChange={handleInputChange}
              />
            </FormControl>
            <FormControl mb={3}>
              <FormLabel fontSize="sm">{t("clients.cpf")}</FormLabel>
              <Input
                placeholder={t("clients.cpf")}
                name="cpf"
                value={newClient.cpf}
                onChange={handleInputChange}
              />
            </FormControl>
          </ModalBody>
          <ModalFooter gap={3}>
            <Button variant="ghost" onClick={onClose}>
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

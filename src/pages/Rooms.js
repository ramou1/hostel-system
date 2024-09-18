import React from "react";
import { Button, Table, Thead, Tbody, Tr, Th, Td } from "@chakra-ui/react";
import useToastService from "../services/ToastService";

function Rooms() {
  const { showSuccess, showError } = useToastService();

  return (
    <div>
      <Table variant="simple">
        <Thead>
          <Tr>
            <Th>Name</Th>
            <Th>Email</Th>
            <Th>Phone</Th>
          </Tr>
        </Thead>
        <Tbody>
          <Tr>
            <Td>John Doe</Td>
            <Td>john@example.com</Td>
            <Td>123-456-7890</Td>
          </Tr>
          <Tr>
            <Td>Jane Smith</Td>
            <Td>jane.smith@example.com</Td>
            <Td>987-654-3210</Td>
          </Tr>
          <Tr>
            <Td>Michael Johnson</Td>
            <Td>michael.johnson@example.com</Td>
            <Td>555-123-4567</Td>
          </Tr>
          <Tr>
            <Td>Emily Davis</Td>
            <Td>emily.davis@example.com</Td>
            <Td>444-555-6666</Td>
          </Tr>
          <Tr>
            <Td>Robert Wilson</Td>
            <Td>robert.wilson@example.com</Td>
            <Td>333-777-8888</Td>
          </Tr>
        </Tbody>
      </Table>

      <div>
        <Button
          colorScheme="green"
          onClick={() => showSuccess("Success!", "Operation was successful.")}
        >
          Show Success Toast
        </Button>

        <Button
          colorScheme="red"
          onClick={() => showError("Error!", "Something went wrong.")}
        >
          Show Error Toast
        </Button>
      </div>
    </div>
  );
}

export default Rooms;

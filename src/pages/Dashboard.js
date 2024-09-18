import React, { useState } from "react";
import "./Dashboard.css";
import {
  Card,
  CardBody,
  CardFooter,
  Heading,
  Text,
  Box,
  Avatar,
  Button,
  ButtonGroup,
  IconButton,
  Flex,
  Spacer,
  Progress,
  Stack,
} from "@chakra-ui/react";
import { Line } from "react-chartjs-2";
import {
  MdArrowBack,
  MdArrowForward,
  MdAttachMoney,
  MdRefresh,
  MdPieChart,
  MdStarRate,
  MdEye,
} from "react-icons/md";
import { FiEye } from "react-icons/fi";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Registrar os componentes necessários para o gráfico
ChartJS.register(
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
);

function Dashboard() {
  const data = {
    labels: ["January", "February", "March", "April", "May", "June"],
    datasets: [
      {
        label: "Monthly Revenue",
        data: [5000, 7000, 6000, 8000, 10000, 12000],
        fill: false,
        borderColor: "rgba(75, 192, 192, 1)",
        tension: 0.1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { position: "top" },
      title: { display: false, text: "Revenue Overview" },
    },
  };

  const users = [
    { id: 1, name: "John Doe", avatar: "/path/to/avatar1.jpg" },
    { id: 2, name: "Jane Smith", avatar: "/path/to/avatar2.jpg" },
    { id: 3, name: "Alice Johnson", avatar: "/path/to/avatar3.jpg" },
  ];

  const bookings = [
    { id: 1, name: "John Doe", date: "2024-09-01" },
    { id: 2, name: "Jane Smith", date: "2024-09-02" },
    { id: 3, name: "Alice Johnson", date: "2024-09-03" },
    { id: 4, name: "Bob Brown", date: "2024-09-04" },
    { id: 5, name: "Charlie Davis", date: "2024-09-05" },
    { id: 6, name: "David White", date: "2024-09-06" },
    { id: 7, name: "Eve Black", date: "2024-09-07" },
  ];

  const [currentPage, setCurrentPage] = useState(1);
  const bookingsPerPage = 5;

  const handleRefresh = () => {
    console.log("Refreshing users...");
  };

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const currentBookings = bookings.slice(
    (currentPage - 1) * bookingsPerPage,
    currentPage * bookingsPerPage
  );

  return (
    <div className="dashboard-container">
      <div className="card-container">
        <Card boxShadow="md" width="33%">
          <CardBody>
            <Flex align="center">
              <Box
                display="flex"
                alignItems="center"
                justifyContent="center"
                bg="blue.200"
                borderRadius="full"
                p={3}
              >
                <MdAttachMoney size={22} color="white" />
              </Box>
              <div>
                <Heading className="card-title" ml={4}>
                  Monthly Sales
                </Heading>
                <Text ml={4} fontSize="25px" as="b" color="blue.300">
                  R$ 32.545
                </Text>
              </div>
            </Flex>
          </CardBody>
        </Card>

        <Card boxShadow="md" width="33%">
          <CardBody>
            <Flex align="center">
              <Box
                display="flex"
                alignItems="center"
                justifyContent="center"
                bg="blue.200"
                borderRadius="full"
                p={3}
              >
                <MdPieChart size={22} color="white" />
              </Box>

              <div>
                <Heading className="card-title" ml={4}>
                  Current Occupancy Rate
                </Heading>
                <Box ml={4} mt={4}>
                  <Progress hasStripe value={64} colorScheme="blue" />
                </Box>
              </div>
            </Flex>
          </CardBody>
        </Card>

        <Card boxShadow="md" width="33%">
          <CardBody>
            <Flex align="center">
              <Box
                display="flex"
                alignItems="center"
                justifyContent="center"
                bg="blue.200"
                borderRadius="full"
                p={3}
              >
                <MdStarRate size={22} color="white" />
              </Box>
              <div>
                <Heading className="card-title" ml={4}>
                  Customer Feedback
                </Heading>
                <Flex align="flex-end" justify="flex-start" ml={4}>
                  <Text className="rate-text" color="blue.300">
                    4.7
                  </Text>
                  <Text fontSize="sm" color="blue.800" ml={1}>
                    /5
                  </Text>
                </Flex>
              </div>
            </Flex>
          </CardBody>
        </Card>
      </div>

      <div className="card-container">
        <Card boxShadow="md" width="60%">
          <CardBody>
            <Flex justify="space-between" align="center" mb={4}>
              <Heading className="card-title">Recent Users</Heading>
              <Button
                size="sm"
                colorScheme="blue"
                onClick={handleRefresh}
                variant="ghost"
                borderRadius="full"
                p={1}
              >
                <MdRefresh size={24} />
              </Button>
            </Flex>
            {users.map((user) => (
              <Flex key={user.id} align="center" mb={4}>
                <Avatar src={user.avatar} size="sm" mr={3} />
                <Text>{user.name}</Text>
                <Spacer />
                <Button mr={2} size="sm" colorScheme="teal">
                  <FiEye size={20} />
                </Button>
                <Button size="sm" colorScheme="yellow">
                  Check Payment
                </Button>
              </Flex>
            ))}
          </CardBody>
        </Card>

        <Card boxShadow="md" width="40%">
          <CardBody>
            <Heading as="h2" className="card-title" mb={4}>
              Calendar
            </Heading>
            <Text>Here is your calendar component</Text>
          </CardBody>
        </Card>
      </div>

      <div className="card-container">
        {/* Card de Gráfico */}
        <Card boxShadow="md" width="65%">
          <CardBody>
            <Heading as="h2" className="card-title" mb={4}>
              Revenue Overview
            </Heading>
            <Line data={data} options={options} />
          </CardBody>
        </Card>

        {/* Card de Pending Bookings */}
        <Card boxShadow="md" width="35%">
          <CardBody>
            <Heading className="card-title" ml={4}>
              Pending Bookings
            </Heading>
            <Stack spacing={3} ml={4} mt={2}>
              {currentBookings.map((booking) => (
                <Text key={booking.id}>
                  {booking.name} - {booking.date}
                </Text>
              ))}
            </Stack>

            <Flex justify="space-between" mt={4}>
              <Button
                leftIcon={<MdArrowBack />}
                size="sm"
                colorScheme="blue"
                onClick={() => paginate(currentPage - 1)}
                isDisabled={currentPage === 1}
                variant="outline"
              >
                Previous
              </Button>
              <Button
                rightIcon={<MdArrowForward />}
                size="sm"
                colorScheme="blue"
                onClick={() => paginate(currentPage + 1)}
                isDisabled={currentBookings.length < bookingsPerPage}
                variant="outline"
              >
                Next
              </Button>
            </Flex>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}

export default Dashboard;

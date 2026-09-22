import React, { useMemo, useState } from "react";
import {
  Card,
  CardBody,
  Heading,
  Text,
  Box,
  Avatar,
  Button,
  IconButton,
  Flex,
  Spacer,
  Progress,
  Stack,
  SimpleGrid,
  Grid,
  GridItem,
  HStack,
  Icon,
  useDisclosure,
  useColorModeValue,
} from "@chakra-ui/react";
import { Line } from "react-chartjs-2";
import {
  MdArrowBack,
  MdArrowForward,
  MdAttachMoney,
  MdRefresh,
  MdPieChart,
  MdStarRate,
} from "react-icons/md";
import { FiEye, FiEyeOff, FiUserPlus, FiShoppingBag } from "react-icons/fi";
import { Link as RouterLink } from "react-router-dom";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import {
  format,
  parse,
  startOfWeek,
  getDay,
  startOfDay,
  endOfDay,
} from "date-fns";
import { ptBR, enUS } from "date-fns/locale";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { useI18n } from "../contexts/LanguageContext";
import ClientDetailsModal from "../components/ClientDetailsModal";
import { loadClients, loadRentals } from "../data/store";

ChartJS.register(
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const locales = { pt: ptBR, en: enUS };

function StatCard({ icon, iconBg, label, children, topRight }) {
  return (
    <Card>
      <CardBody>
        <Flex align="flex-start" gap={4}>
          <Flex
            align="center"
            justify="center"
            boxSize="52px"
            borderRadius="14px"
            bg={iconBg}
            flexShrink={0}
          >
            <Icon as={icon} boxSize={6} color="white" />
          </Flex>
          <Box minW={0} flex="1">
            <Flex align="center" justify="space-between" gap={2}>
              <Text fontSize="sm" color="gray.500" fontWeight={600} noOfLines={1}>
                {label}
              </Text>
              {topRight}
            </Flex>
            {children}
          </Box>
        </Flex>
      </CardBody>
    </Card>
  );
}

function Dashboard() {
  const { t, lang } = useI18n();
  const [showSales, setShowSales] = useState(false);
  const [clients, setClients] = useState(loadClients);
  const [selectedClient, setSelectedClient] = useState(null);
  const detailsModal = useDisclosure();

  const axisColor = useColorModeValue("#4A5568", "#A0AEC0");
  const gridColor = useColorModeValue("rgba(0,0,0,0.06)", "rgba(255,255,255,0.08)");
  const mutedText = useColorModeValue("gray.500", "gray.400");
  const calendarBg = useColorModeValue("white", "gray.800");

  const localizer = useMemo(
    () =>
      dateFnsLocalizer({
        format,
        parse,
        startOfWeek: () => startOfWeek(new Date(), { locale: locales[lang] || enUS }),
        getDay,
        locales,
      }),
    [lang]
  );

  const recentClients = useMemo(
    () =>
      [...clients]
        .sort((a, b) => new Date(b.registeredAt) - new Date(a.registeredAt))
        .slice(0, 5),
    [clients]
  );

  const calendarEvents = useMemo(() => {
    const checkIns = clients
      .filter((c) => c.registeredAt)
      .map((c) => ({
        id: `checkin-${c.email || c.name}`,
        title: c.name,
        start: startOfDay(new Date(c.registeredAt)),
        end: endOfDay(new Date(c.registeredAt)),
        allDay: true,
        resource: c,
      }));

    const rentals = loadRentals()
      .filter((r) => r.rentedAt)
      .map((r) => ({
        id: `rental-${r.id}`,
        title: `${r.clientName} · ${t(`rentals.items.${r.itemType}`)}`,
        start: startOfDay(new Date(r.rentedAt)),
        end: endOfDay(new Date(r.rentedAt)),
        allDay: true,
      }));

    return [...checkIns, ...rentals];
  }, [clients, t]);

  const data = {
    labels: t("dashboard.months"),
    datasets: [
      {
        label: t("dashboard.monthlyRevenue"),
        data: [5000, 7000, 6000, 8000, 10000, 12000],
        fill: true,
        borderColor: "#f59e0b",
        backgroundColor: "rgba(245, 158, 11, 0.12)",
        pointBackgroundColor: "#f59e0b",
        tension: 0.4,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: "top", labels: { color: axisColor } },
      title: { display: false },
    },
    scales: {
      x: { ticks: { color: axisColor }, grid: { color: gridColor } },
      y: { ticks: { color: axisColor }, grid: { color: gridColor } },
    },
  };

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
  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const currentBookings = bookings.slice(
    (currentPage - 1) * bookingsPerPage,
    currentPage * bookingsPerPage
  );

  const refreshClients = () => setClients(loadClients());

  const openClient = (client) => {
    setSelectedClient(client);
    detailsModal.onOpen();
  };

  const messages = {
    today: lang === "pt" ? "Hoje" : "Today",
    previous: lang === "pt" ? "Anterior" : "Back",
    next: lang === "pt" ? "Próximo" : "Next",
    month: lang === "pt" ? "Mês" : "Month",
    week: lang === "pt" ? "Semana" : "Week",
    day: lang === "pt" ? "Dia" : "Day",
    agenda: lang === "pt" ? "Agenda" : "Agenda",
    date: lang === "pt" ? "Data" : "Date",
    time: lang === "pt" ? "Hora" : "Time",
    event: lang === "pt" ? "Evento" : "Event",
    noEventsInRange:
      lang === "pt" ? "Nenhum evento neste período." : "No events in this range.",
    showMore: (total) => (lang === "pt" ? `+${total} mais` : `+${total} more`),
  };

  return (
    <Stack spacing={6}>
      <HStack spacing={3} flexWrap="wrap">
        <Button
          as={RouterLink}
          to="/app/clients?add=1"
          colorScheme="brand"
          leftIcon={<FiUserPlus />}
        >
          {t("dashboard.quickAddClient")}
        </Button>
        <Button
          as={RouterLink}
          to="/app/rentals?add=1"
          variant="outline"
          colorScheme="brand"
          leftIcon={<FiShoppingBag />}
        >
          {t("dashboard.quickAddRental")}
        </Button>
      </HStack>

      <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6}>
        <StatCard
          icon={MdAttachMoney}
          iconBg="green.400"
          label={t("dashboard.monthlySales")}
          topRight={
            <IconButton
              aria-label={
                showSales
                  ? t("dashboard.hideSales")
                  : t("dashboard.showSales")
              }
              icon={showSales ? <FiEyeOff /> : <FiEye />}
              size="sm"
              variant="ghost"
              onClick={() => setShowSales((v) => !v)}
            />
          }
        >
          <Heading fontSize="2xl" color="green.400" mt={1} letterSpacing="wide">
            {showSales ? "R$ 32.545" : "••••••"}
          </Heading>
        </StatCard>

        <StatCard
          icon={MdPieChart}
          iconBg="brand.500"
          label={t("dashboard.occupancyRate")}
        >
          <Flex align="center" gap={3} mt={2}>
            <Progress
              value={64}
              colorScheme="brand"
              borderRadius="full"
              size="sm"
              flex="1"
              hasStripe
            />
            <Text fontWeight={700} fontSize="sm">
              64%
            </Text>
          </Flex>
        </StatCard>

        <StatCard
          icon={MdStarRate}
          iconBg="yellow.400"
          label={t("dashboard.customerFeedback")}
        >
          <Flex align="baseline" gap={1} mt={1}>
            <Heading fontSize="3xl" color="yellow.500">
              4.7
            </Heading>
            <Text fontSize="sm" color={mutedText}>
              / 5
            </Text>
          </Flex>
        </StatCard>
      </SimpleGrid>

      <Card>
        <CardBody>
          <Heading fontSize="md" mb={4}>
            {t("dashboard.calendar")}
          </Heading>
          <Box
            h={{ base: "360px", md: "480px" }}
            bg={calendarBg}
            className="dashboard-calendar"
            sx={{
              ".rbc-calendar": { fontSize: "13px" },
              ".rbc-toolbar": { flexWrap: "wrap", gap: "4px", mb: 2 },
              ".rbc-toolbar button": {
                borderRadius: "8px",
                fontSize: "12px",
                padding: "4px 8px",
              },
              ".rbc-event": {
                backgroundColor: "#f59e0b",
                border: "none",
                borderRadius: "6px",
              },
              ".rbc-today": { backgroundColor: "rgba(245, 158, 11, 0.08)" },
              ".rbc-off-range-bg": { background: "transparent" },
            }}
          >
            <Calendar
              localizer={localizer}
              events={calendarEvents}
              startAccessor="start"
              endAccessor="end"
              culture={lang === "pt" ? "pt" : "en"}
              messages={messages}
              views={["month"]}
              defaultView="month"
              style={{ height: "100%" }}
              popup
              onSelectEvent={(event) => {
                if (event.resource) openClient(event.resource);
              }}
            />
          </Box>
        </CardBody>
      </Card>

      <Grid templateColumns={{ base: "1fr", lg: "1fr 1fr" }} gap={6}>
        <GridItem>
          <Card h="100%">
            <CardBody>
              <Flex justify="space-between" align="center" mb={4}>
                <Heading fontSize="md">{t("dashboard.recentClients")}</Heading>
                <IconButton
                  aria-label="refresh"
                  icon={<MdRefresh size={20} />}
                  size="sm"
                  variant="ghost"
                  colorScheme="brand"
                  borderRadius="full"
                  onClick={refreshClients}
                />
              </Flex>
              <Stack spacing={3}>
                {recentClients.length === 0 ? (
                  <Text fontSize="sm" color={mutedText}>
                    {t("common.empty")}
                  </Text>
                ) : (
                  recentClients.map((client) => (
                    <Flex key={client.email || client.name} align="center" gap={3}>
                      <Avatar
                        name={client.name}
                        src={client.photo || undefined}
                        size="sm"
                      />
                      <Box minW={0} flex="1">
                        <Text fontSize="sm" fontWeight={500} noOfLines={1}>
                          {client.name}
                        </Text>
                        <Text fontSize="xs" color={mutedText} noOfLines={1}>
                          {client.room || "—"}
                        </Text>
                      </Box>
                      <Spacer />
                      <IconButton
                        aria-label={t("common.view")}
                        icon={<FiEye />}
                        size="sm"
                        colorScheme="brand"
                        variant="ghost"
                        onClick={() => openClient(client)}
                      />
                    </Flex>
                  ))
                )}
              </Stack>
            </CardBody>
          </Card>
        </GridItem>

        <GridItem>
          <Card h="100%">
            <CardBody>
              <Heading fontSize="md" mb={4}>
                {t("dashboard.pendingBookings")}
              </Heading>
              <Stack spacing={3}>
                {currentBookings.map((booking) => (
                  <Flex
                    key={booking.id}
                    justify="space-between"
                    align="center"
                  >
                    <Text fontSize="sm" fontWeight={500}>
                      {booking.name}
                    </Text>
                    <Text fontSize="xs" color={mutedText}>
                      {booking.date}
                    </Text>
                  </Flex>
                ))}
              </Stack>

              <HStack justify="space-between" mt={5}>
                <Button
                  leftIcon={<MdArrowBack />}
                  size="sm"
                  variant="outline"
                  colorScheme="brand"
                  onClick={() => paginate(currentPage - 1)}
                  isDisabled={currentPage === 1}
                >
                  {t("common.previous")}
                </Button>
                <Button
                  rightIcon={<MdArrowForward />}
                  size="sm"
                  variant="outline"
                  colorScheme="brand"
                  onClick={() => paginate(currentPage + 1)}
                  isDisabled={currentBookings.length < bookingsPerPage}
                >
                  {t("common.next")}
                </Button>
              </HStack>
            </CardBody>
          </Card>
        </GridItem>
      </Grid>

      <Card>
        <CardBody>
          <Heading fontSize="md" mb={4}>
            {t("dashboard.revenueOverview")}
          </Heading>
          <Box h="300px">
            <Line data={data} options={options} />
          </Box>
        </CardBody>
      </Card>

      <ClientDetailsModal
        isOpen={detailsModal.isOpen}
        onClose={detailsModal.onClose}
        client={selectedClient}
      />
    </Stack>
  );
}

export default Dashboard;

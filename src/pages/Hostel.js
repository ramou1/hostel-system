import React, { useMemo, useState } from "react";
import {
  Box,
  Button,
  Card,
  CardBody,
  Checkbox,
  Divider,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  HStack,
  Icon,
  IconButton,
  Image,
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
import { FiPlus, FiSave, FiTrash2, FiHome, FiImage } from "react-icons/fi";
import { useI18n } from "../contexts/LanguageContext";
import useToastService from "../services/ToastService";
import { resizeImage } from "../components/PhotoUpload";
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
  const mapBorder = useColorModeValue("gray.200", "gray.600");

  const clientNames = useMemo(
    () => [...new Set(clients.map((c) => c.name))].sort(),
    [clients]
  );

  const setField = (e) => {
    const { name, value } = e.target;
    setHostel((prev) => ({ ...prev, [name]: value }));
  };

  const setAmenity = (key) => (e) => {
    const checked = e.target.checked;
    setHostel((prev) => ({
      ...prev,
      amenities: { ...prev.amenities, [key]: checked },
    }));
  };

  const handlePhotos = async (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    try {
      const urls = [];
      for (const file of files) {
        urls.push(await resizeImage(file, 640));
      }
      setHostel((prev) => ({
        ...prev,
        photos: [...(prev.photos || []), ...urls].slice(0, 8),
      }));
    } catch {
      // ignora falha de processamento
    } finally {
      e.target.value = "";
    }
  };

  const removePhoto = (index) => {
    setHostel((prev) => ({
      ...prev,
      photos: (prev.photos || []).filter((_, i) => i !== index),
    }));
  };

  const lat = Number(hostel.lat);
  const lng = Number(hostel.lng);
  const hasMap = Number.isFinite(lat) && Number.isFinite(lng) && hostel.lat && hostel.lng;
  const mapSrc = hasMap
    ? `https://www.openstreetmap.org/export/embed.html?bbox=${lng - 0.01}%2C${lat - 0.01}%2C${lng + 0.01}%2C${lat + 0.01}&layer=mapnik&marker=${lat}%2C${lng}`
    : "";

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
            <FormControl>
              <FormLabel fontSize="sm">{t("hostel.lat")}</FormLabel>
              <Input name="lat" value={hostel.lat || ""} onChange={setField} />
            </FormControl>
            <FormControl>
              <FormLabel fontSize="sm">{t("hostel.lng")}</FormLabel>
              <Input name="lng" value={hostel.lng || ""} onChange={setField} />
            </FormControl>
            <FormControl gridColumn={{ md: "1 / -1" }}>
              <FormLabel fontSize="sm">{t("hostel.mapTitle")}</FormLabel>
              <Text fontSize="xs" color={muted} mb={2}>
                {t("hostel.mapHint")}
              </Text>
              {hasMap ? (
                <Box
                  as="iframe"
                  title={t("hostel.mapTitle")}
                  src={mapSrc}
                  w="100%"
                  h="240px"
                  border="1px solid"
                  borderColor={mapBorder}
                  borderRadius="12px"
                />
              ) : (
                <Flex
                  align="center"
                  justify="center"
                  h="160px"
                  bg={sectionBg}
                  borderRadius="12px"
                >
                  <Text fontSize="sm" color={muted}>
                    {t("hostel.mapPlaceholder")}
                  </Text>
                </Flex>
              )}
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

          <FormControl mb={6}>
            <FormLabel fontSize="sm">{t("hostel.amenitiesTitle")}</FormLabel>
            <Text fontSize="xs" color={muted} mb={3}>
              {t("hostel.amenitiesHint")}
            </Text>
            <Stack spacing={2}>
              <Checkbox
                colorScheme="brand"
                isChecked={!!hostel.amenities?.sharedKitchen}
                onChange={setAmenity("sharedKitchen")}
              >
                {t("hostel.amenityKitchen")}
              </Checkbox>
              <Checkbox
                colorScheme="brand"
                isChecked={!!hostel.amenities?.lockers}
                onChange={setAmenity("lockers")}
              >
                {t("hostel.amenityLockers")}
              </Checkbox>
            </Stack>
          </FormControl>

          <FormControl mb={6}>
            <FormLabel fontSize="sm">{t("hostel.photosTitle")}</FormLabel>
            <input
              id="hostel-photos"
              type="file"
              accept="image/*"
              multiple
              style={{ display: "none" }}
              onChange={handlePhotos}
            />
            <Button
              size="sm"
              variant="outline"
              leftIcon={<FiImage />}
              onClick={() => document.getElementById("hostel-photos")?.click()}
              mb={3}
            >
              {t("hostel.photosAdd")}
            </Button>
            {(hostel.photos || []).length === 0 ? (
              <Text fontSize="sm" color={muted}>
                {t("hostel.photosEmpty")}
              </Text>
            ) : (
              <SimpleGrid columns={{ base: 2, sm: 4 }} spacing={3}>
                {hostel.photos.map((src, index) => (
                  <Box key={`${index}-${src.slice(-8)}`} position="relative">
                    <Image
                      src={src}
                      alt=""
                      h="88px"
                      w="100%"
                      objectFit="cover"
                      borderRadius="10px"
                    />
                    <IconButton
                      aria-label={t("common.remove")}
                      icon={<FiTrash2 />}
                      size="xs"
                      colorScheme="red"
                      position="absolute"
                      top={1}
                      right={1}
                      onClick={() => removePhoto(index)}
                    />
                  </Box>
                ))}
              </SimpleGrid>
            )}
          </FormControl>

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

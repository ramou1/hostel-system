import React, { useRef } from "react";
import {
  Box,
  Button,
  Checkbox,
  Divider,
  Flex,
  FormControl,
  FormLabel,
  IconButton,
  Image,
  Input,
  SimpleGrid,
  Stack,
  Text,
  Textarea,
  useColorModeValue,
} from "@chakra-ui/react";
import { FiImage, FiTrash2 } from "react-icons/fi";
import { useI18n } from "../contexts/LanguageContext";
import { resizeImage } from "./PhotoUpload";

function HostelFormFields({ values, onChange }) {
  const { t } = useI18n();
  const photosRef = useRef(null);
  const muted = useColorModeValue("gray.500", "gray.400");
  const sectionBg = useColorModeValue("gray.50", "whiteAlpha.50");
  const mapBorder = useColorModeValue("gray.200", "gray.600");

  const setField = (e) => {
    const { name, value } = e.target;
    onChange({ ...values, [name]: value });
  };

  const setAmenity = (key) => (e) => {
    onChange({
      ...values,
      amenities: { ...values.amenities, [key]: e.target.checked },
    });
  };

  const handlePhotos = async (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    try {
      const urls = [];
      for (const file of files) {
        urls.push(await resizeImage(file, 640));
      }
      onChange({
        ...values,
        photos: [...(values.photos || []), ...urls].slice(0, 8),
      });
    } catch {
      // ignora falha de processamento
    } finally {
      e.target.value = "";
    }
  };

  const removePhoto = (index) => {
    onChange({
      ...values,
      photos: (values.photos || []).filter((_, i) => i !== index),
    });
  };

  const lat = Number(values.lat);
  const lng = Number(values.lng);
  const hasMap =
    Number.isFinite(lat) && Number.isFinite(lng) && values.lat && values.lng;
  const mapSrc = hasMap
    ? `https://www.openstreetmap.org/export/embed.html?bbox=${lng - 0.01}%2C${lat - 0.01}%2C${lng + 0.01}%2C${lat + 0.01}&layer=mapnik&marker=${lat}%2C${lng}`
    : "";

  return (
    <>
      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
        <FormControl isRequired>
          <FormLabel fontSize="sm">{t("hostel.name")}</FormLabel>
          <Input name="name" value={values.name} onChange={setField} />
        </FormControl>
        <FormControl>
          <FormLabel fontSize="sm">{t("hostel.email")}</FormLabel>
          <Input
            name="email"
            type="email"
            value={values.email}
            onChange={setField}
          />
        </FormControl>
        <FormControl>
          <FormLabel fontSize="sm">{t("hostel.phone")}</FormLabel>
          <Input name="phone" value={values.phone} onChange={setField} />
        </FormControl>
        <FormControl>
          <FormLabel fontSize="sm">{t("hostel.country")}</FormLabel>
          <Input name="country" value={values.country} onChange={setField} />
        </FormControl>
        <FormControl>
          <FormLabel fontSize="sm">{t("hostel.city")}</FormLabel>
          <Input name="city" value={values.city} onChange={setField} />
        </FormControl>
        <FormControl>
          <FormLabel fontSize="sm">{t("hostel.address")}</FormLabel>
          <Input name="address" value={values.address} onChange={setField} />
        </FormControl>
        <FormControl>
          <FormLabel fontSize="sm">{t("hostel.lat")}</FormLabel>
          <Input name="lat" value={values.lat || ""} onChange={setField} />
        </FormControl>
        <FormControl>
          <FormLabel fontSize="sm">{t("hostel.lng")}</FormLabel>
          <Input name="lng" value={values.lng || ""} onChange={setField} />
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
            value={values.description}
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
            isChecked={!!values.amenities?.sharedKitchen}
            onChange={setAmenity("sharedKitchen")}
          >
            {t("hostel.amenityKitchen")}
          </Checkbox>
          <Checkbox
            colorScheme="brand"
            isChecked={!!values.amenities?.lockers}
            onChange={setAmenity("lockers")}
          >
            {t("hostel.amenityLockers")}
          </Checkbox>
        </Stack>
      </FormControl>

      <FormControl mb={6}>
        <FormLabel fontSize="sm">{t("hostel.photosTitle")}</FormLabel>
        <input
          ref={photosRef}
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
          onClick={() => photosRef.current?.click()}
          mb={3}
        >
          {t("hostel.photosAdd")}
        </Button>
        {(values.photos || []).length === 0 ? (
          <Text fontSize="sm" color={muted}>
            {t("hostel.photosEmpty")}
          </Text>
        ) : (
          <SimpleGrid columns={{ base: 2, sm: 4 }} spacing={3}>
            {values.photos.map((src, index) => (
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

      <FormControl>
        <FormLabel fontSize="sm">{t("hostel.rules")}</FormLabel>
        <Text fontSize="xs" color={muted} mb={2}>
          {t("hostel.rulesHint")}
        </Text>
        <Textarea
          name="rules"
          value={values.rules}
          onChange={setField}
          rows={6}
          placeholder={t("hostel.rulesPlaceholder")}
        />
      </FormControl>
    </>
  );
}

export default HostelFormFields;

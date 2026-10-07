import React from "react";
import {
  SimpleGrid,
  FormControl,
  FormLabel,
  Input,
  Select,
  Box,
  Checkbox,
  CheckboxGroup,
  Wrap,
  WrapItem,
} from "@chakra-ui/react";
import { useI18n } from "../contexts/LanguageContext";
import PhotoUpload from "./PhotoUpload";
import { LANGUAGE_OPTIONS, findBedSlot, getFreeBeds } from "../data/store";

// Campos compartilhados entre o cadastro no balcão e o auto-cadastro (link).
// País e armário são texto livre; idiomas permitem múltipla escolha.
function ClientFormFields({ values, setField, rooms = [] }) {
  const { t } = useI18n();

  const room = rooms.find((item) => item.name === values.room);
  const freeBeds = values.room ? getFreeBeds(values.room) : [];
  const currentBed = room ? findBedSlot(room, values.bed) : null;
  const bedOptions =
    currentBed && !freeBeds.some((bed) => bed.id === currentBed.id)
      ? [currentBed, ...freeBeds]
      : freeBeds;

  const bedLabel = (bed) =>
    t("clients.bedOption")
      .replace("{type}", t(`rooms.bedTypes.${bed.type}`))
      .replace("{n}", bed.number);

  const handle = (e) => {
    if (e.target.name === "room") {
      setField("room", e.target.value);
      setField("bed", "");
      return;
    }
    setField(e.target.name, e.target.value);
  };

  const selectedLanguages = Array.isArray(values.languages)
    ? values.languages
    : values.language
      ? [values.language]
      : [];

  const toggleLanguage = (code) => {
    const next = selectedLanguages.includes(code)
      ? selectedLanguages.filter((l) => l !== code)
      : [...selectedLanguages, code];
    setField("languages", next);
  };

  return (
    <Box>
      <PhotoUpload
        value={values.photo}
        name={values.name}
        onChange={(url) => setField("photo", url)}
      />

      <SimpleGrid columns={{ base: 1, sm: 2 }} spacing={3} mt={5}>
        <FormControl isRequired>
          <FormLabel fontSize="sm">{t("clients.name")}</FormLabel>
          <Input
            name="name"
            placeholder={t("clients.name")}
            value={values.name}
            onChange={handle}
          />
        </FormControl>

        <FormControl>
          <FormLabel fontSize="sm">{t("clients.email")}</FormLabel>
          <Input
            name="email"
            type="email"
            placeholder={t("clients.email")}
            value={values.email}
            onChange={handle}
          />
        </FormControl>

        <FormControl>
          <FormLabel fontSize="sm">{t("clients.phone")}</FormLabel>
          <Input
            name="phone"
            placeholder={t("clients.phone")}
            value={values.phone}
            onChange={handle}
          />
        </FormControl>

        <FormControl>
          <FormLabel fontSize="sm">{t("clients.room")}</FormLabel>
          <Select
            name="room"
            placeholder={t("clients.selectRoom")}
            value={values.room}
            onChange={handle}
          >
            {rooms.map((room) => (
              <option key={room.name} value={room.name}>
                {room.name}
                {room.category === "dorm"
                  ? ` · ${t(`rooms.types.${room.type}`)}`
                  : ""}
              </option>
            ))}
          </Select>
        </FormControl>

        <FormControl>
          <FormLabel fontSize="sm">{t("clients.bed")}</FormLabel>
          <Select
            name="bed"
            placeholder={
              values.room
                ? bedOptions.length
                  ? t("clients.selectBed")
                  : t("clients.noBeds")
                : t("clients.selectRoomFirst")
            }
            value={values.bed || ""}
            onChange={handle}
            isDisabled={!values.room || bedOptions.length === 0}
          >
            {bedOptions.map((bed) => (
              <option key={bed.id} value={bed.id}>
                {bedLabel(bed)}
              </option>
            ))}
          </Select>
        </FormControl>

        <FormControl>
          <FormLabel fontSize="sm">
            {t("clients.locker")} {t("clients.optionalTag")}
          </FormLabel>
          <Input
            name="locker"
            placeholder={t("clients.lockerPlaceholder")}
            value={values.locker || ""}
            onChange={handle}
          />
        </FormControl>

        <FormControl>
          <FormLabel fontSize="sm">
            {t("clients.cpf")} {t("clients.optionalTag")}
          </FormLabel>
          <Input
            name="cpf"
            placeholder={t("clients.cpf")}
            value={values.cpf}
            onChange={handle}
          />
        </FormControl>

        <FormControl>
          <FormLabel fontSize="sm">
            {t("clients.documentId")} {t("clients.optionalTag")}
          </FormLabel>
          <Input
            name="documentId"
            placeholder={t("clients.documentIdPlaceholder")}
            value={values.documentId}
            onChange={handle}
          />
        </FormControl>

        <FormControl>
          <FormLabel fontSize="sm">{t("clients.country")}</FormLabel>
          <Input
            name="country"
            placeholder={t("clients.countryPlaceholder")}
            value={values.country || ""}
            onChange={handle}
          />
        </FormControl>

        <FormControl>
          <FormLabel fontSize="sm">{t("clients.birthDate")}</FormLabel>
          <Input
            name="birthDate"
            type="date"
            value={values.birthDate || ""}
            onChange={handle}
          />
        </FormControl>

        <FormControl>
          <FormLabel fontSize="sm">{t("clients.nationality")}</FormLabel>
          <Input
            name="nationality"
            placeholder={t("clients.nationalityPlaceholder")}
            value={values.nationality || ""}
            onChange={handle}
          />
        </FormControl>

        <FormControl>
          <FormLabel fontSize="sm">
            {t("clients.originCity")} {t("clients.optionalTag")}
          </FormLabel>
          <Input
            name="originCity"
            placeholder={t("clients.originCity")}
            value={values.originCity || ""}
            onChange={handle}
          />
        </FormControl>

        <FormControl>
          <FormLabel fontSize="sm">
            {t("clients.destinationCity")} {t("clients.optionalTag")}
          </FormLabel>
          <Input
            name="destinationCity"
            placeholder={t("clients.destinationCity")}
            value={values.destinationCity || ""}
            onChange={handle}
          />
        </FormControl>

        <FormControl>
          <FormLabel fontSize="sm">
            {t("clients.travelReason")} {t("clients.optionalTag")}
          </FormLabel>
          <Select
            name="travelReason"
            placeholder={t("clients.travelReasonPlaceholder")}
            value={values.travelReason || ""}
            onChange={handle}
          >
            <option value="tourism">{t("clients.travelReasons.tourism")}</option>
            <option value="work">{t("clients.travelReasons.work")}</option>
            <option value="study">{t("clients.travelReasons.study")}</option>
            <option value="other">{t("clients.travelReasons.other")}</option>
          </Select>
        </FormControl>
      </SimpleGrid>

      <FormControl mt={4}>
        <FormLabel fontSize="sm">{t("clients.languageMain")}</FormLabel>
        <CheckboxGroup value={selectedLanguages}>
          <Wrap spacing={3}>
            {LANGUAGE_OPTIONS.map((code) => (
              <WrapItem key={code}>
                <Checkbox
                  colorScheme="brand"
                  isChecked={selectedLanguages.includes(code)}
                  onChange={() => toggleLanguage(code)}
                >
                  {t(`clients.languages.${code}`)}
                </Checkbox>
              </WrapItem>
            ))}
          </Wrap>
        </CheckboxGroup>
      </FormControl>
    </Box>
  );
}

export default ClientFormFields;

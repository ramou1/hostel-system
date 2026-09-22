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
import { LANGUAGE_OPTIONS } from "../data/store";

// Campos compartilhados entre o cadastro no balcão e o auto-cadastro (link).
// País e armário são texto livre; idiomas permitem múltipla escolha.
function ClientFormFields({ values, setField, rooms = [] }) {
  const { t } = useI18n();

  const handle = (e) => setField(e.target.name, e.target.value);

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

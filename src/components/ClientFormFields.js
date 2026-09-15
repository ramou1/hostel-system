import React from "react";
import {
  SimpleGrid,
  FormControl,
  FormLabel,
  Input,
  Select,
  Box,
} from "@chakra-ui/react";
import { useI18n } from "../contexts/LanguageContext";
import PhotoUpload from "./PhotoUpload";
import { COUNTRY_OPTIONS, LANGUAGE_OPTIONS } from "../data/store";

// Campos compartilhados entre o cadastro no balcão e o auto-cadastro (link).
// `values` é o objeto do cliente e `setField(name, value)` atualiza um campo.
// `lockers` é opcional — quando presente, permite associar um armário.
function ClientFormFields({ values, setField, rooms = [], lockers = [] }) {
  const { t } = useI18n();

  const handle = (e) => setField(e.target.name, e.target.value);

  const availableLockers = lockers.filter(
    (lk) => !lk.clientName || lk.id === values.lockerId
  );

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
          <Select
            name="lockerId"
            placeholder={t("clients.selectLocker")}
            value={values.lockerId || ""}
            onChange={handle}
          >
            <option value="">{t("clients.noLocker")}</option>
            {availableLockers.map((lk) => (
              <option key={lk.id} value={lk.id}>
                {lk.code}
              </option>
            ))}
          </Select>
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
          <Select name="country" value={values.country} onChange={handle}>
            {COUNTRY_OPTIONS.map((code) => (
              <option key={code} value={code}>
                {t(`clients.countries.${code}`)}
              </option>
            ))}
          </Select>
        </FormControl>

        <FormControl>
          <FormLabel fontSize="sm">{t("clients.languageMain")}</FormLabel>
          <Select name="language" value={values.language} onChange={handle}>
            {LANGUAGE_OPTIONS.map((code) => (
              <option key={code} value={code}>
                {t(`clients.languages.${code}`)}
              </option>
            ))}
          </Select>
        </FormControl>
      </SimpleGrid>
    </Box>
  );
}

export default ClientFormFields;

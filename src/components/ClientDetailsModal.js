import React from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  Flex,
  Avatar,
  Text,
  Box,
  Badge,
  SimpleGrid,
  Divider,
  HStack,
  Icon,
  useColorModeValue,
} from "@chakra-ui/react";
import { FiLink, FiUserCheck } from "react-icons/fi";
import { useI18n } from "../contexts/LanguageContext";
import {
  getClientLanguages,
  getClientLocker,
  SOURCE,
} from "../data/store";

function InfoField({ label, children }) {
  const labelColor = useColorModeValue("gray.500", "gray.400");
  return (
    <Box>
      <Text
        fontSize="xs"
        fontWeight={700}
        color={labelColor}
        textTransform="uppercase"
      >
        {label}
      </Text>
      <Box fontSize="sm" mt={0.5}>
        {children}
      </Box>
    </Box>
  );
}

function SourceBadge({ source }) {
  const { t } = useI18n();
  const isLink = source === SOURCE.LINK;
  return (
    <Badge
      colorScheme={isLink ? "green" : "purple"}
      borderRadius="full"
      px={2}
      py={0.5}
      display="inline-flex"
      alignItems="center"
      gap={1}
      textTransform="none"
    >
      <Icon as={isLink ? FiLink : FiUserCheck} boxSize={3} />
      {t(isLink ? "clients.sourceLink" : "clients.sourceDesk")}
    </Badge>
  );
}

function ClientDetailsModal({ isOpen, onClose, client, footer }) {
  const { t, lang } = useI18n();

  const formatDate = (iso, withTime = false) => {
    if (!iso) return "—";
    const locale = lang === "pt" ? "pt-BR" : "en-US";
    return new Intl.DateTimeFormat(locale, {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      ...(withTime ? { hour: "2-digit", minute: "2-digit" } : {}),
    }).format(new Date(iso));
  };

  const languageLabels = () => {
    const codes = getClientLanguages(client);
    if (!codes.length) return "—";
    return codes.map((code) => t(`clients.languages.${code}`)).join(", ");
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered size="lg">
      <ModalOverlay backdropFilter="blur(4px)" />
      <ModalContent borderRadius="16px">
        <ModalHeader>{t("clients.detailsTitle")}</ModalHeader>
        <ModalCloseButton />
        {client && (
          <ModalBody pb={6}>
            <Flex align="center" gap={4} mb={5}>
              <Avatar
                size="lg"
                name={client.name}
                src={client.photo || undefined}
              />
              <Box minW={0}>
                <Text fontSize="lg" fontWeight={700} noOfLines={1}>
                  {client.name}
                </Text>
                <Text fontSize="sm" color="gray.500" noOfLines={1}>
                  {client.email || "—"}
                </Text>
                <HStack mt={2} spacing={2}>
                  <SourceBadge source={client.source} />
                  <Badge
                    colorScheme={
                      client.status === "checkedOut" ? "gray" : "green"
                    }
                    borderRadius="full"
                    textTransform="none"
                  >
                    {client.status === "checkedOut"
                      ? t("clients.statusCheckedOut")
                      : t("clients.statusCheckedIn")}
                  </Badge>
                </HStack>
              </Box>
            </Flex>

            <Divider mb={5} />

            <SimpleGrid columns={{ base: 1, sm: 2 }} spacingY={4} spacingX={6}>
              <InfoField label={t("clients.phone")}>
                {client.phone || "—"}
              </InfoField>
              <InfoField label={t("clients.room")}>
                {client.room || "—"}
              </InfoField>
              <InfoField label={t("clients.locker")}>
                {getClientLocker(client) || "—"}
              </InfoField>
              <InfoField label={t("clients.cpf")}>
                {client.cpf || "—"}
              </InfoField>
              <InfoField label={t("clients.documentId")}>
                {client.documentId || "—"}
              </InfoField>
              <InfoField label={t("clients.country")}>
                {client.country || "—"}
              </InfoField>
              <InfoField label={t("clients.languageMain")}>
                {languageLabels()}
              </InfoField>
              <InfoField label={t("clients.registeredAt")}>
                {formatDate(client.registeredAt, true)}
              </InfoField>
              {client.checkedOutAt && (
                <InfoField label={t("clients.checkedOutAt")}>
                  {formatDate(client.checkedOutAt, true)}
                </InfoField>
              )}
            </SimpleGrid>

            {footer}
          </ModalBody>
        )}
      </ModalContent>
    </Modal>
  );
}

export default ClientDetailsModal;

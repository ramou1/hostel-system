import React, { useEffect, useState } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  Button,
  FormControl,
  FormLabel,
  Input,
  Avatar,
  Flex,
  Box,
  Text,
  Divider,
  SimpleGrid,
  Switch,
  useColorMode,
  useColorModeValue,
  Icon,
} from "@chakra-ui/react";
import { FiSun, FiMoon, FiGlobe } from "react-icons/fi";
import { useI18n } from "../contexts/LanguageContext";

// Botão de opção reutilizável (para tema e idioma)
function ChoiceButton({ active, onClick, icon, children }) {
  const activeBg = "brand.500";
  const activeColor = "white";
  const idleBorder = useColorModeValue("gray.200", "gray.600");
  const idleHoverBg = useColorModeValue("gray.50", "whiteAlpha.100");

  return (
    <Button
      onClick={onClick}
      variant="outline"
      leftIcon={icon ? <Icon as={icon} /> : undefined}
      bg={active ? activeBg : "transparent"}
      color={active ? activeColor : undefined}
      borderColor={active ? activeBg : idleBorder}
      _hover={{ bg: active ? activeBg : idleHoverBg }}
      flex="1"
      size="sm"
    >
      {children}
    </Button>
  );
}

function SettingsModal({ isOpen, onClose, profile, onSave }) {
  const { t, lang, setLang } = useI18n();
  const { colorMode, setColorMode } = useColorMode();
  const [draft, setDraft] = useState(profile);
  const sectionColor = useColorModeValue("gray.500", "gray.400");

  // Sincroniza o rascunho sempre que abrir com o perfil atual
  useEffect(() => {
    if (isOpen) setDraft(profile);
  }, [isOpen, profile]);

  const handleChange = (field) => (e) =>
    setDraft((prev) => ({ ...prev, [field]: e.target.value }));

  const handleSave = () => {
    onSave?.(draft);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg" isCentered scrollBehavior="inside">
      <ModalOverlay backdropFilter="blur(4px)" />
      <ModalContent borderRadius="16px">
        <ModalHeader>{t("settings.title")}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {/* Perfil */}
          <Text fontSize="xs" fontWeight={700} textTransform="uppercase" color={sectionColor} mb={3}>
            {t("settings.profileSection")}
          </Text>
          <Flex align="center" gap={4} mb={4}>
            <Avatar size="lg" name={draft?.name} src={draft?.photo} />
            <Box>
              <Button size="sm" variant="outline">
                {t("settings.changePhoto")}
              </Button>
              <Text fontSize="xs" color={sectionColor} mt={1}>
                {t("settings.roleValue")}
              </Text>
            </Box>
          </Flex>

          <SimpleGrid columns={{ base: 1, sm: 2 }} spacing={4} mb={2}>
            <FormControl>
              <FormLabel fontSize="sm">{t("settings.name")}</FormLabel>
              <Input value={draft?.name || ""} onChange={handleChange("name")} />
            </FormControl>
            <FormControl>
              <FormLabel fontSize="sm">{t("settings.email")}</FormLabel>
              <Input
                type="email"
                value={draft?.email || ""}
                onChange={handleChange("email")}
              />
            </FormControl>
          </SimpleGrid>

          <Divider my={5} />

          {/* Aparência */}
          <Text fontSize="xs" fontWeight={700} textTransform="uppercase" color={sectionColor} mb={3}>
            {t("settings.appearance")}
          </Text>

          <FormControl mb={4}>
            <FormLabel fontSize="sm">{t("settings.theme")}</FormLabel>
            <Flex gap={3}>
              <ChoiceButton
                active={colorMode === "light"}
                onClick={() => setColorMode("light")}
                icon={FiSun}
              >
                {t("settings.light")}
              </ChoiceButton>
              <ChoiceButton
                active={colorMode === "dark"}
                onClick={() => setColorMode("dark")}
                icon={FiMoon}
              >
                {t("settings.dark")}
              </ChoiceButton>
            </Flex>
          </FormControl>

          <FormControl mb={2}>
            <FormLabel fontSize="sm">{t("settings.language")}</FormLabel>
            <Flex gap={3}>
              <ChoiceButton
                active={lang === "pt"}
                onClick={() => setLang("pt")}
                icon={FiGlobe}
              >
                {t("settings.portuguese")}
              </ChoiceButton>
              <ChoiceButton
                active={lang === "en"}
                onClick={() => setLang("en")}
                icon={FiGlobe}
              >
                {t("settings.english")}
              </ChoiceButton>
            </Flex>
          </FormControl>

          <Divider my={5} />

          {/* Conta */}
          <Text fontSize="xs" fontWeight={700} textTransform="uppercase" color={sectionColor} mb={3}>
            {t("settings.account")}
          </Text>
          <FormControl display="flex" alignItems="center" justifyContent="space-between">
            <FormLabel htmlFor="email-notifications" mb={0} fontSize="sm">
              {t("settings.notifications")}
            </FormLabel>
            <Switch
              id="email-notifications"
              colorScheme="brand"
              isChecked={!!draft?.emailNotifications}
              onChange={(e) =>
                setDraft((prev) => ({ ...prev, emailNotifications: e.target.checked }))
              }
            />
          </FormControl>
        </ModalBody>

        <ModalFooter gap={3}>
          <Button variant="ghost" onClick={onClose}>
            {t("common.cancel")}
          </Button>
          <Button colorScheme="brand" onClick={handleSave}>
            {t("common.save")}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

export default SettingsModal;

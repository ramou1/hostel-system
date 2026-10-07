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
  Textarea,
  Text,
} from "@chakra-ui/react";
import { useI18n } from "../contexts/LanguageContext";
import { addSuggestion } from "../data/store";
import useToastService from "../services/ToastService";

function HelpModal({ isOpen, onClose, profile }) {
  const { t } = useI18n();
  const { showSuccess, showError } = useToastService();
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (isOpen) setMessage("");
  }, [isOpen]);

  const handleSubmit = () => {
    const text = message.trim();
    if (!text) {
      showError(t("help.title"), t("help.required"));
      return;
    }
    addSuggestion({
      message: text,
      name: profile?.name,
      email: profile?.email,
    });
    showSuccess(t("help.successTitle"), t("help.successDesc"));
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg" isCentered>
      <ModalOverlay backdropFilter="blur(4px)" />
      <ModalContent borderRadius="16px">
        <ModalHeader>{t("help.title")}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Text fontSize="sm" color="gray.500" mb={4}>
            {t("help.subtitle")}
          </Text>
          <FormControl>
            <FormLabel fontSize="sm">{t("help.message")}</FormLabel>
            <Textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder={t("help.placeholder")}
              rows={5}
              resize="vertical"
            />
          </FormControl>
        </ModalBody>
        <ModalFooter gap={3}>
          <Button variant="ghost" onClick={onClose}>
            {t("common.cancel")}
          </Button>
          <Button colorScheme="brand" onClick={handleSubmit}>
            {t("help.submit")}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

export default HelpModal;

import React from "react";
import {
  Flex,
  Heading,
  Text,
  Icon,
  Badge,
  useColorModeValue,
} from "@chakra-ui/react";
import { FiMessageSquare } from "react-icons/fi";
import { useI18n } from "../contexts/LanguageContext";

function Messages() {
  const { t } = useI18n();
  const cardBg = useColorModeValue("white", "gray.800");
  const iconBg = useColorModeValue("brand.50", "whiteAlpha.100");
  const muted = useColorModeValue("gray.500", "gray.400");

  return (
    <Flex
      direction="column"
      align="center"
      justify="center"
      textAlign="center"
      bg={cardBg}
      borderRadius="16px"
      py={{ base: 12, md: 20 }}
      px={6}
      minH="60vh"
      boxShadow="sm"
    >
      <Flex
        align="center"
        justify="center"
        boxSize="80px"
        borderRadius="full"
        bg={iconBg}
        mb={6}
      >
        <Icon as={FiMessageSquare} boxSize={9} color="brand.500" />
      </Flex>
      <Heading as="h2" fontSize="2xl" mb={2}>
        {t("messagesPage.title")}
      </Heading>
      <Text color={muted} maxW="440px" mb={4}>
        {t("messagesPage.subtitle")}
      </Text>
      <Badge colorScheme="brand" borderRadius="full" px={3} py={1}>
        {t("messagesPage.comingSoon")}
      </Badge>
      <Text color={muted} fontSize="sm" maxW="440px" mt={6}>
        {t("messagesPage.placeholder")}
      </Text>
    </Flex>
  );
}

export default Messages;

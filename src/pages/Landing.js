import React, { useEffect, useState } from "react";
import {
  Box,
  Flex,
  Container,
  Heading,
  Text,
  Button,
  Icon,
  Badge,
  SimpleGrid,
  Card,
  CardBody,
  Stack,
  HStack,
  VStack,
  List,
  ListItem,
  ListIcon,
  IconButton,
  useColorMode,
  useColorModeValue,
} from "@chakra-ui/react";
import {
  FiHome,
  FiUsers,
  FiBarChart2,
  FiGlobe,
  FiCheck,
  FiSun,
  FiMoon,
  FiArrowRight,
} from "react-icons/fi";
import { Link as RouterLink } from "react-router-dom";
import { useI18n } from "../contexts/LanguageContext";
import { useAuth } from "../contexts/AuthContext";
import BrandLogo from "../components/BrandLogo";

const FEATURE_ICONS = [FiHome, FiUsers, FiBarChart2, FiGlobe];

function Brand() {
  return <BrandLogo height="30px" />;
}

function Landing() {
  const { t, lang, setLang } = useI18n();
  const { colorMode, toggleColorMode } = useColorMode();
  const { isAuthenticated } = useAuth();

  // Cabeçalho transparente no topo; ganha fundo/blur ao rolar
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const pageBg = useColorModeValue("white", "gray.900");
  const heroBg = useColorModeValue(
    "linear(to-b, brand.50, white)",
    "linear(to-b, gray.800, gray.900)"
  );
  const muted = useColorModeValue("gray.600", "gray.400");
  const sectionBg = useColorModeValue("gray.50", "gray.800");
  const footerBorder = useColorModeValue("gray.100", "gray.700");
  const cardBorder = useColorModeValue("gray.100", "gray.700");
  // Fundo do header ao rolar: cinza neutro (sem tom azulado do gray.900 do Chakra)
  const navBg = useColorModeValue(
    "rgba(255, 255, 255, 0.82)",
    "rgba(36, 36, 38, 0.78)"
  );

  const features = t("landing.features.items");
  const plans = t("landing.pricing.plans");

  const primaryCta = isAuthenticated ? t("landing.goToApp") : t("landing.hero.ctaPrimary");
  const primaryTo = isAuthenticated ? "/app" : "/login";

  return (
    <Box bg={pageBg} minH="100vh">
      {/* Navbar */}
      <Box
        as="header"
        position="fixed"
        top={0}
        left={0}
        right={0}
        zIndex={10}
        bg={scrolled ? navBg : "transparent"}
        backdropFilter={scrolled ? "blur(12px)" : "none"}
        border="none"
        boxShadow="none"
        transition="background-color 0.25s ease, backdrop-filter 0.25s ease"
      >
        <Container maxW="6xl">
          <Flex align="center" justify="space-between" h="64px">
            <Brand />
            <HStack spacing={2}>
              <IconButton
                aria-label="Toggle theme"
                icon={colorMode === "light" ? <FiMoon /> : <FiSun />}
                variant="ghost"
                size="sm"
                onClick={toggleColorMode}
              />
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setLang(lang === "pt" ? "en" : "pt")}
              >
                {lang === "pt" ? "EN" : "PT"}
              </Button>
              <Button
                as={RouterLink}
                to={isAuthenticated ? "/app" : "/login"}
                colorScheme="brand"
                size="sm"
              >
                {isAuthenticated ? t("landing.goToApp") : t("landing.signIn")}
              </Button>
            </HStack>
          </Flex>
        </Container>
      </Box>

      {/* Hero */}
      <Box bgGradient={heroBg}>
        <Container maxW="4xl" py={{ base: 16, md: 28 }} textAlign="center">
          <Badge
            colorScheme="brand"
            borderRadius="full"
            px={3}
            py={1}
            mb={5}
            textTransform="none"
            fontSize="sm"
          >
            {t("landing.hero.badge")}
          </Badge>
          <Heading
            as="h1"
            fontSize={{ base: "3xl", md: "5xl" }}
            lineHeight="1.1"
            mb={5}
            letterSpacing="-0.02em"
          >
            {t("landing.hero.title")}
          </Heading>
          <Text fontSize={{ base: "md", md: "xl" }} color={muted} maxW="640px" mx="auto" mb={8}>
            {t("landing.hero.subtitle")}
          </Text>
          <HStack spacing={4} justify="center" flexWrap="wrap">
            <Button
              as={RouterLink}
              to={primaryTo}
              colorScheme="brand"
              size="lg"
              rightIcon={<FiArrowRight />}
            >
              {primaryCta}
            </Button>
            <Button as="a" href="#planos" variant="outline" size="lg">
              {t("landing.hero.ctaSecondary")}
            </Button>
          </HStack>
        </Container>
      </Box>

      {/* Features */}
      <Container maxW="6xl" py={{ base: 16, md: 24 }}>
        <VStack spacing={3} mb={12} textAlign="center">
          <Heading as="h2" fontSize={{ base: "2xl", md: "3xl" }}>
            {t("landing.features.title")}
          </Heading>
          <Text color={muted} maxW="560px">
            {t("landing.features.subtitle")}
          </Text>
        </VStack>

        <SimpleGrid columns={{ base: 1, sm: 2, lg: 4 }} spacing={6}>
          {features.map((feature, i) => (
            <Card key={i} borderWidth="1px" borderColor={cardBorder}>
              <CardBody>
                <Flex
                  align="center"
                  justify="center"
                  boxSize="48px"
                  borderRadius="12px"
                  bg="brand.500"
                  mb={4}
                >
                  <Icon as={FEATURE_ICONS[i]} boxSize={6} color="white" />
                </Flex>
                <Heading as="h3" fontSize="md" mb={2}>
                  {feature.title}
                </Heading>
                <Text fontSize="sm" color={muted}>
                  {feature.text}
                </Text>
              </CardBody>
            </Card>
          ))}
        </SimpleGrid>
      </Container>

      {/* Pricing */}
      <Box bg={sectionBg} id="planos">
        <Container maxW="6xl" py={{ base: 16, md: 24 }}>
          <VStack spacing={3} mb={12} textAlign="center">
            <Heading as="h2" fontSize={{ base: "2xl", md: "3xl" }}>
              {t("landing.pricing.title")}
            </Heading>
            <Text color={muted} maxW="560px">
              {t("landing.pricing.subtitle")}
            </Text>
          </VStack>

          <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6} alignItems="stretch" pt={3}>
            {plans.map((plan, i) => {
              const highlighted = i === 1;
              return (
                <Card
                  key={i}
                  borderWidth={highlighted ? "2px" : "1px"}
                  borderColor={highlighted ? "brand.500" : cardBorder}
                  transform={{ md: highlighted ? "scale(1.03)" : "none" }}
                  position="relative"
                  overflow="visible"
                >
                  {highlighted && (
                    <Badge
                      colorScheme="brand"
                      borderRadius="full"
                      px={3}
                      py={1}
                      position="absolute"
                      top="-12px"
                      left="50%"
                      transform="translateX(-50%)"
                      textTransform="none"
                    >
                      {t("landing.pricing.mostPopular")}
                    </Badge>
                  )}
                  <CardBody>
                    <Stack spacing={4} h="100%">
                      <Box>
                        <Text fontWeight={700} fontSize="lg">
                          {plan.name}
                        </Text>
                        <Text fontSize="sm" color={muted}>
                          {plan.desc}
                        </Text>
                      </Box>
                      <Flex align="baseline" gap={1}>
                        <Heading fontSize="3xl">{plan.price}</Heading>
                        {plan.price.match(/\d/) && (
                          <Text color={muted} fontSize="sm">
                            {t("landing.pricing.perMonth")}
                          </Text>
                        )}
                      </Flex>
                      <List spacing={2} flex="1">
                        {plan.features.map((feat, j) => (
                          <ListItem key={j} fontSize="sm" display="flex" alignItems="center">
                            <ListIcon as={FiCheck} color="brand.500" />
                            {feat}
                          </ListItem>
                        ))}
                      </List>
                      <Button
                        as={RouterLink}
                        to="/login"
                        colorScheme="brand"
                        variant={highlighted ? "solid" : "outline"}
                        w="100%"
                      >
                        {t("landing.pricing.cta")}
                      </Button>
                    </Stack>
                  </CardBody>
                </Card>
              );
            })}
          </SimpleGrid>
        </Container>
      </Box>

      {/* Footer */}
      <Box borderTop="1px solid" borderColor={footerBorder}>
        <Container maxW="6xl" py={8}>
          <Flex
            align="center"
            justify="space-between"
            direction={{ base: "column", sm: "row" }}
            gap={3}
          >
            <Brand />
            <Text fontSize="sm" color={muted}>
              {t("landing.footer")}
            </Text>
            <Text fontSize="sm" color={muted}>
              © {new Date().getFullYear()} Hostely
            </Text>
          </Flex>
        </Container>
      </Box>
    </Box>
  );
}

export default Landing;

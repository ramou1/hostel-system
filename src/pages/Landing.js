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
  Image,
} from "@chakra-ui/react";
import {
  FiHome,
  FiUsers,
  FiBarChart2,
  FiGlobe,
  FiCheck,
  FiArrowRight,
} from "react-icons/fi";
import { Link as RouterLink } from "react-router-dom";
import { useI18n } from "../contexts/LanguageContext";
import { useAuth } from "../contexts/AuthContext";
import BrandLogo from "../components/BrandLogo";
import { PLAN_IDS, canAddHostel } from "../data/store";

const FEATURE_ICONS = [FiHome, FiUsers, FiBarChart2, FiGlobe];

const LANGS = [
  { id: "pt", label: "Português" },
  { id: "en", label: "English" },
  { id: "es", label: "Español" },
];

function Brand() {
  return <BrandLogo height="30px" forceLight />;
}

function Landing() {
  const { t, lang, setLang } = useI18n();
  const { isAuthenticated } = useAuth();

  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const features = t("landing.features.items");
  const plans = t("landing.pricing.plans");

  const primaryCta = isAuthenticated ? t("landing.goToApp") : t("landing.hero.ctaPrimary");
  const primaryTo = isAuthenticated ? "/app" : "/login";

  return (
    <Box bg="white" minH="100vh" color="gray.800">
      <Box
        as="header"
        position="fixed"
        top={0}
        left={0}
        right={0}
        zIndex={10}
        bg={scrolled ? "rgba(255, 255, 255, 0.82)" : "transparent"}
        backdropFilter={scrolled ? "blur(12px)" : "none"}
        border="none"
        boxShadow="none"
        transition="background-color 0.25s ease, backdrop-filter 0.25s ease"
      >
        <Container maxW="6xl">
          <Flex align="center" justify="space-between" h="64px">
            <Brand />
            <HStack spacing={2}>
              <HStack spacing={1}>
                {LANGS.map((item) => (
                  <Box
                    as="button"
                    key={item.id}
                    type="button"
                    aria-label={item.label}
                    onClick={() => setLang(item.id)}
                    boxSize="28px"
                    borderRadius="full"
                    overflow="hidden"
                    border="2px solid"
                    borderColor={lang === item.id ? "brand.500" : "transparent"}
                    p={0}
                    lineHeight={0}
                  >
                    <Image
                      src={`/images/flags/${item.id}.png`}
                      alt=""
                      boxSize="24px"
                      objectFit="cover"
                      borderRadius="full"
                    />
                  </Box>
                ))}
              </HStack>
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
      <Box bgGradient="linear(to-b, brand.50, white)">
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
          <Text fontSize={{ base: "md", md: "xl" }} color="gray.600" maxW="640px" mx="auto" mb={8}>
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
          <Text color="gray.600" maxW="560px">
            {t("landing.features.subtitle")}
          </Text>
        </VStack>

        <SimpleGrid columns={{ base: 1, sm: 2, lg: 4 }} spacing={6}>
          {features.map((feature, i) => (
            <Card key={i} borderWidth="1px" borderColor="gray.100" bg="white">
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
                <Text fontSize="sm" color="gray.600">
                  {feature.text}
                </Text>
              </CardBody>
            </Card>
          ))}
        </SimpleGrid>
      </Container>

      {/* Pricing */}
      <Box bg="gray.50" id="planos">
        <Container maxW="6xl" py={{ base: 16, md: 24 }}>
          <VStack spacing={3} mb={12} textAlign="center">
            <Heading as="h2" fontSize={{ base: "2xl", md: "3xl" }}>
              {t("landing.pricing.title")}
            </Heading>
            <Text color="gray.600" maxW="560px">
              {t("landing.pricing.subtitle")}
            </Text>
          </VStack>

          <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6} alignItems="stretch" pt={3}>
            {plans.map((plan, i) => {
              const highlighted = i === 1;
              return (
                <Card
                  key={i}
                  bg="white"
                  borderWidth={highlighted ? "2px" : "1px"}
                  borderColor={highlighted ? "brand.500" : "gray.100"}
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
                        <Text fontSize="sm" color="gray.600">
                          {plan.desc}
                        </Text>
                      </Box>
                      <Flex align="baseline" gap={1}>
                        <Heading fontSize="3xl">{plan.price}</Heading>
                        {plan.price.match(/\d/) && (
                          <Text color="gray.600" fontSize="sm">
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
                        to={
                          isAuthenticated
                            ? canAddHostel()
                              ? "/app/hostel/novo"
                              : "/app"
                            : `/cadastro-hostel?plan=${PLAN_IDS[i]}`
                        }
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
      <Box borderTop="1px solid" borderColor="gray.100">
        <Container maxW="6xl" py={8}>
          <Flex
            align="center"
            justify="space-between"
            direction={{ base: "column", sm: "row" }}
            gap={3}
          >
            <Brand />
            <Text fontSize="sm" color="gray.600">
              {t("landing.footer")}
            </Text>
            <Text fontSize="sm" color="gray.600">
              © {new Date().getFullYear()} Hostely
            </Text>
          </Flex>
        </Container>
      </Box>
    </Box>
  );
}

export default Landing;

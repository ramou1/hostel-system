import { extendTheme } from "@chakra-ui/react";
import { mode } from "@chakra-ui/theme-tools";

// Dark mode como padrão, conforme solicitado
const config = {
  initialColorMode: "dark",
  useSystemColorMode: false,
};

// Paleta da marca inspirada no logo (âmbar/laranja do beliche)
const colors = {
  brand: {
    50: "#fff8e6",
    100: "#ffecc0",
    200: "#ffdd99",
    300: "#ffcc66",
    400: "#ffb833",
    500: "#f59e0b", // cor primária
    600: "#d97706",
    700: "#b45309",
    800: "#8a3f07",
    900: "#5c2a05",
  },
};

const fonts = {
  heading: `"Effra", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif`,
  body: `"Effra", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif`,
};

const styles = {
  global: (props) => ({
    "html, body, #root": {
      height: "100%",
    },
    body: {
      bg: mode("gray.50", "gray.900")(props),
      color: mode("gray.800", "gray.100")(props),
    },
    "*::selection": {
      bg: "brand.500",
      color: "white",
    },
    // Scrollbar mais discreta
    "::-webkit-scrollbar": {
      width: "10px",
      height: "10px",
    },
    "::-webkit-scrollbar-thumb": {
      background: mode("gray.300", "gray.600")(props),
      borderRadius: "8px",
    },
    "::-webkit-scrollbar-track": {
      background: "transparent",
    },
  }),
};

const components = {
  Card: {
    baseStyle: (props) => ({
      container: {
        borderRadius: "16px",
        bg: mode("white", "gray.800")(props),
        boxShadow: mode(
          "0 4px 20px rgba(0, 0, 0, 0.06)",
          "0 4px 20px rgba(0, 0, 0, 0.35)"
        ),
      },
    }),
  },
  Button: {
    baseStyle: {
      borderRadius: "10px",
      fontWeight: 600,
    },
    variants: {
      // Botões "solid" vibrantes (tom 500 + texto branco) em ambos os temas,
      // em vez do tom 200 pálido que o Chakra usa por padrão no dark mode.
      solid: (props) => {
        const c = props.colorScheme || "gray";
        if (c === "gray") return {};
        return {
          bg: `${c}.500`,
          color: "white",
          _hover: {
            bg: `${c}.600`,
            _disabled: { bg: `${c}.500` },
          },
          _active: { bg: `${c}.700` },
        };
      },
    },
    defaultProps: {
      colorScheme: "brand",
    },
  },
  Heading: {
    baseStyle: {
      letterSpacing: "-0.01em",
    },
  },
};

const theme = extendTheme({ config, colors, fonts, styles, components });

export default theme;

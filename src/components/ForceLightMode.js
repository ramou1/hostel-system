import { useLayoutEffect } from "react";
import { useColorMode } from "@chakra-ui/react";

/** Força o tema claro nas páginas públicas, sem alterar a preferência do painel. */
function ForceLightMode({ children }) {
  const { setColorMode } = useColorMode();

  useLayoutEffect(() => {
    setColorMode("light");
  }, [setColorMode]);

  return children;
}

export default ForceLightMode;

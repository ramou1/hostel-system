import React from "react";
import { Image, useColorModeValue } from "@chakra-ui/react";

/**
 * Logotipo da marca Hostely (arte completa: ícone + wordmark).
 *
 * - Tema claro: logo-full-light.png (texto escuro)
 * - Tema escuro: logo-full-dark.png (texto claro)
 *
 * Para usar somente o ícone (ex.: menu recolhido), utilize diretamente
 * <Image src="/images/logo-collapsed.png" />.
 */
function BrandLogo({ height = "32px", ...props }) {
  const src = useColorModeValue(
    "/images/logo-full-light.png",
    "/images/logo-full-dark.png"
  );

  return <Image src={src} alt="Hostely" h={height} objectFit="contain" {...props} />;
}

export default BrandLogo;

import React, { useRef } from "react";
import { Flex, Box, Button, Avatar, Text, useColorModeValue } from "@chakra-ui/react";
import { FiCamera, FiTrash2 } from "react-icons/fi";
import { useI18n } from "../contexts/LanguageContext";

// Redimensiona a imagem para no máximo `max` px (mantendo proporção)
// e retorna um dataURL JPEG, evitando estourar a cota do localStorage.
function resizeImage(file, max = 256) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = reject;
    reader.onload = () => {
      const img = new Image();
      img.onerror = reject;
      img.onload = () => {
        let { width, height } = img;
        if (width > height && width > max) {
          height = Math.round((height * max) / width);
          width = max;
        } else if (height > max) {
          width = Math.round((width * max) / height);
          height = max;
        }
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        canvas.getContext("2d").drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL("image/jpeg", 0.85));
      };
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
  });
}

function PhotoUpload({ value, name, onChange }) {
  const { t } = useI18n();
  const inputRef = useRef(null);
  const hint = useColorModeValue("gray.500", "gray.400");

  const handleFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const dataUrl = await resizeImage(file);
      onChange(dataUrl);
    } catch {
      // se falhar o processamento, ignora silenciosamente
    } finally {
      // permite selecionar o mesmo arquivo novamente
      e.target.value = "";
    }
  };

  return (
    <Flex align="center" gap={4}>
      <Avatar size="xl" name={name} src={value || undefined} />
      <Box>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          capture="environment"
          style={{ display: "none" }}
          onChange={handleFile}
        />
        <Flex gap={2}>
          <Button
            size="sm"
            variant="outline"
            leftIcon={<FiCamera />}
            onClick={() => inputRef.current?.click()}
          >
            {value ? t("clients.changePhoto") : t("clients.addPhoto")}
          </Button>
          {value && (
            <Button
              size="sm"
              variant="ghost"
              colorScheme="red"
              leftIcon={<FiTrash2 />}
              onClick={() => onChange("")}
            >
              {t("common.remove")}
            </Button>
          )}
        </Flex>
        <Text fontSize="xs" color={hint} mt={2}>
          {t("clients.photoHint")}
        </Text>
      </Box>
    </Flex>
  );
}

export default PhotoUpload;

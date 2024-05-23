"use client";
import { Box, Button } from "@radix-ui/themes";
import axios from "axios";
import translations from "/public/locale/hebrew.json";

export default function TranslationButton() {
  async function handleShowTranslation() {
    try {
      const data = await axios.get("/api/translations");
      console.log("Translations: ", data);
    } catch (err) {
      console.error("[error@handleShowTranslation]: ", err.message);
    }
  }

  async function handleAddTranslation() {
    try {
      const data = await axios.post("api/translations/add", {
        englishStr: "Hello",
      });
      console.log("Add Translation: ", data);
    } catch (err) {
      console.error("[error@handleAddTranslation]: ", err.message);
    }
  }

  return (
    <Box>
      <Button
        onClick={async () => {
          await handleShowTranslation();
          console.log("Show Translations JSON: ", translations);
        }}
      >
        Show Translation
      </Button>
      <Button
        onClick={async () => {
          await handleAddTranslation();
        }}
      >
        Add Translation
      </Button>
    </Box>
  );
}

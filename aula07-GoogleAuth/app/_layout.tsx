import { Stack } from "expo-router";
import { ThemeProvider } from "../src/context/ThemeContext";
import { I18nextProvider } from "react-i18next";
import i18n from "../src/services/i18n";
import { ClerkProvider } from '@clerk/clerk-expo'
import {tokenCache} from "@clerk/clerk-expo/token-cache"

export default function Layout() {
  return (
    <ClerkProvider tokenCache={tokenCache}>
      <I18nextProvider i18n={i18n}>
        <ThemeProvider>
          <Stack screenOptions={{ headerShown: false }} />
        </ThemeProvider>
      </I18nextProvider>
    </ClerkProvider>


  );
}

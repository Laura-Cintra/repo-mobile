import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack screenOptions={{animation: "slide_from_bottom"}}/>
  )
}
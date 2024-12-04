import {Stack} from "expo-router";

export default function GenerateInvoiceLayout() {
  return (
    <Stack>
      <Stack.Screen name={'invoices/generate'} options={{ headerShown: false }} />
    </Stack>
  )
}

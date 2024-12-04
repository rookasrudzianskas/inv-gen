import '../global.css';

import { Stack } from 'expo-router';
import { vexo } from 'vexo-analytics';

if (!__DEV__) {
  if (!process.env.VEXO_ANALYTICS_API_KEY) {
    console.error('VEXO_ANALYTICS_API_KEY is not set in .env file');
  }
  vexo(process.env.VEXO_ANALYTICS_API_KEY!);
}

const Layout = () => {
  return (
    <Stack>
      <Stack.Screen name="invoices/generate" options={{ headerShown: false }} />
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="settings" options={{ headerShown: false }} />
    </Stack>
  );
}

export default Layout;

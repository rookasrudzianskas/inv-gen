import '../global.css';

import * as Sentry from '@sentry/react-native';
import { isRunningInExpoGo } from 'expo';
import { Stack, useNavigationContainerRef } from 'expo-router';
import { useEffect } from 'react';
import { vexo } from 'vexo-analytics';

if (!__DEV__) {
  if (!process.env.VEXO_ANALYTICS_API_KEY) {
    console.error('VEXO_ANALYTICS_API_KEY is not set in .env file');
  }
  vexo(process.env.VEXO_ANALYTICS_API_KEY!);
}

const navigationIntegration = Sentry.reactNavigationIntegration({
  enableTimeToInitialDisplay: !isRunningInExpoGo(),
});

Sentry.init({
  dsn: 'https://80bf5ea94ec2b198ae7c0a4c43d656f7@o573055.ingest.us.sentry.io/4508410330021888',
  debug: true,
  tracesSampleRate: 1.0,
  integrations: [navigationIntegration],
  enableNativeFramesTracking: !isRunningInExpoGo(),
});

const Layout = () => {
  const ref = useNavigationContainerRef();

  useEffect(() => {
    if (ref?.current) {
      navigationIntegration.registerNavigationContainer(ref);
    }
  }, [ref]);

  return (
    <Stack>
      <Stack.Screen name="invoices/generate" options={{ headerShown: false }} />
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="settings" options={{ headerShown: false }} />
    </Stack>
  );
};

export default Sentry.wrap(Layout);

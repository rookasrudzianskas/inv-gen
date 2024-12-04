import '../global.css';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Sentry from '@sentry/react-native';
import { isRunningInExpoGo } from 'expo';
import { Stack, useNavigationContainerRef, Redirect } from 'expo-router';
import {useEffect, useState} from 'react';
import { View, ActivityIndicator } from 'react-native';
import { vexo } from 'vexo-analytics';

if (!__DEV__ && process.env.VEXO_ANALYTICS_API_KEY) {
  vexo(process.env.VEXO_ANALYTICS_API_KEY);
}

const navigationIntegration = Sentry.reactNavigationIntegration({
  enableTimeToInitialDisplay: !isRunningInExpoGo(),
});

Sentry.init({
  dsn: 'https://80bf5ea94ec2b198ae7c0a4c43d656f7@o573055.ingest.us.sentry.io/4508410330021888',
  debug: __DEV__,
  tracesSampleRate: 1.0,
  integrations: [navigationIntegration],
  enableNativeFramesTracking: !isRunningInExpoGo(),
});

const STORAGE_KEYS = {
  ONBOARDING: 'hasSeenOnboarding',
} as const;

const Layout = () => {
  const ref = useNavigationContainerRef();
  const [isLoading, setIsLoading] = useState(true);
  const [shouldShowOnboarding, setShouldShowOnboarding] = useState(true);

  useEffect(() => {
    if (ref?.current) {
      navigationIntegration.registerNavigationContainer(ref);
    }
  }, [ref]);

  useEffect(() => {
    checkOnboardingStatus();
  }, []);

  const checkOnboardingStatus = async () => {
    try {
      const hasSeenOnboarding = await AsyncStorage.getItem(STORAGE_KEYS.ONBOARDING);
      setShouldShowOnboarding(!hasSeenOnboarding);
    } catch (error) {
      console.error('Failed to check onboarding status:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="onboarding" />
        <Stack.Screen name="invoices/generate" />
        <Stack.Screen name="settings" />
        <Stack.Screen name="settings/account" />
      </Stack>
      {shouldShowOnboarding && <Redirect href="/onboarding" />}
    </>
  );
};

export default Sentry.wrap(Layout);

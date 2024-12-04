import { useRouter } from 'expo-router';
import { FileText, CreditCard, Bell } from 'lucide-react-native';
import React, { useState } from 'react';
import { View, Text, SafeAreaView, TouchableOpacity, Dimensions } from 'react-native';
import AsyncStorage from "@react-native-async-storage/async-storage";

const { width } = Dimensions.get('window');

const OnboardingScreen = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const router = useRouter();

  const onboardingSteps = [
    {
      icon: FileText,
      title: 'Easy Invoice Management',
      description: 'Create and manage professional invoices effortlessly with our intuitive tools',
    },
    {
      icon: CreditCard,
      title: 'Secure Payments',
      description: 'Track payments and manage your finances with confidence',
    },
    {
      icon: Bell,
      title: 'Stay Updated',
      description: 'Get instant notifications about payment status and invoice updates',
    },
  ];

  const handleNext = async () => {
    if (currentStep < onboardingSteps.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      await AsyncStorage.setItem('hasSeenOnboarding', 'true');
      router.push('/');
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1">
        <View className="flex-row px-6 py-4">
          {currentStep < onboardingSteps.length - 1 ? (
            <TouchableOpacity onPress={() => router.push('/')}>
              <Text className="text-gray-500">Skip</Text>
            </TouchableOpacity>
          ) : null}
        </View>

        <View className="flex-1 justify-center px-6">
          {onboardingSteps.map((step, index) => {
            const Icon = step.icon;
            return (
              <View
                key={index}
                style={{
                  width,
                  position: 'absolute',
                  transform: [{ translateX: (index - currentStep) * width }],
                }}
                className="items-center px-6">
                <View className="mb-8 h-24 w-24 items-center justify-center rounded-full bg-blue-100">
                  <Icon color="#3B82F6" size={40} />
                </View>
                <Text className="mb-4 text-center text-2xl font-bold text-gray-900">
                  {step.title}
                </Text>
                <Text className="text-center text-lg text-gray-500">{step.description}</Text>
              </View>
            );
          })}
        </View>

        <View className="px-6 pb-8">
          <View className="mb-8 flex-row justify-center">
            {onboardingSteps.map((_, index) => (
              <View
                key={index}
                className={`mx-1 h-2 w-2 rounded-full ${
                  currentStep === index ? 'bg-blue-500' : 'bg-gray-200'
                }`}
              />
            ))}
          </View>

          <TouchableOpacity
            className="items-center rounded-lg bg-blue-500 py-4"
            onPress={handleNext}>
            <Text className="text-lg font-semibold text-white">
              {currentStep === onboardingSteps.length - 1 ? 'Get Started' : 'Next'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default OnboardingScreen;

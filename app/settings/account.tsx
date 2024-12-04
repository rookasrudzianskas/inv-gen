import { useRouter } from 'expo-router';
import { ArrowLeft, User, Mail, Phone, Camera } from 'lucide-react-native';
import React, { useState } from 'react';
import { View, Text, SafeAreaView, TouchableOpacity, TextInput, Alert } from 'react-native';

import { AccountSchema, useAccountStore } from '~/stores/account-store';

const AccountScreen = () => {
  const router = useRouter();
  const { setAccountInfo } = useAccountStore();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    try {
      AccountSchema.parse({ name, email, phone });
      setErrors({});
      return true;
    } catch (error: any) {
      if (error.errors) {
        const newErrors = error.errors.reduce(
          (acc: any, curr: any) => ({
            ...acc,
            [curr.path[0]]: curr.message,
          }),
          {}
        );
        setErrors(newErrors);
      }
      return false;
    }
  };

  const handleSave = () => {
    if (validateForm()) {
      setAccountInfo({ name, email, phone });
      Alert.alert('Success', 'Account information saved');
    }
  };

  const InputField = ({
    icon: Icon,
    label,
    value,
    onChangeText,
    keyboardType = 'default',
    error,
  }: {
    icon: React.ComponentType<any>;
    label: string;
    value: string;
    onChangeText: (text: string) => void;
    keyboardType?: 'default' | 'email-address' | 'phone-pad';
    error?: string;
  }) => (
    <View className="mb-4">
      <Text className="mb-1 text-sm font-medium text-gray-700">{label}</Text>
      <View
        className={`relative flex-row items-center rounded-lg border bg-white ${error ? 'border-red-500' : 'border-gray-200'}`}>
        <View className="pl-3 pr-2">
          <Icon color={error ? '#EF4444' : '#9CA3AF'} size={16} />
        </View>
        <TextInput
          value={value}
          onChangeText={onChangeText}
          keyboardType={keyboardType}
          className="flex-1 px-2 py-3 text-gray-900"
        />
      </View>
      {error && <Text className="mt-1 text-sm text-red-500">{error}</Text>}
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-row items-center border-b border-gray-100 px-6 py-4">
        <TouchableOpacity onPress={() => router.back()} className="mr-4">
          <ArrowLeft color="#6B7280" size={24} />
        </TouchableOpacity>
        <Text className="text-2xl font-bold text-gray-900">Account</Text>
      </View>

      <View className="px-6 py-8">
        <View className="mb-8 items-center">
          <View className="relative">
            <View className="h-24 w-24 items-center justify-center rounded-full bg-blue-100">
              <User color="#3B82F6" size={40} />
            </View>
            <TouchableOpacity className="absolute bottom-0 right-0 rounded-full bg-blue-500 p-2">
              <Camera color="#FFFFFF" size={16} />
            </TouchableOpacity>
          </View>
        </View>

        <View className="rounded-lg bg-white p-6 shadow-sm">
          <InputField
            icon={User}
            label="Full Name"
            value={name}
            onChangeText={setName}
            error={errors.name}
          />
          <InputField
            icon={Mail}
            label="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            error={errors.email}
          />
          <InputField
            icon={Phone}
            label="Phone"
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
            error={errors.phone}
          />
        </View>

        <TouchableOpacity
          className="mt-6 items-center rounded-lg bg-blue-500 py-4"
          onPress={handleSave}>
          <Text className="text-lg font-semibold text-white">Save Changes</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default AccountScreen;

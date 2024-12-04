import { useRouter } from 'expo-router';
import { ArrowLeft, User, Mail, Phone, Camera } from 'lucide-react-native';
import React from 'react';
import { View, Text, SafeAreaView, TouchableOpacity, TextInput, Alert } from 'react-native';

import { useAccountStore } from '~/stores/account-store';

const AccountScreen = () => {
  const router = useRouter();
  const { accountInfo, setAccountInfo, isValidAccountInfo } = useAccountStore();

  const handleSave = () => {
    if (isValidAccountInfo()) {
      Alert.alert('Success', 'Account information saved');
    } else {
      Alert.alert('Error', 'Please check your information');
    }
  };

  const InputField = ({ icon: Icon, label, value, onChangeText, keyboardType = 'default' }) => (
    <View className="mb-4">
      <Text className="mb-1 text-sm font-medium text-gray-700">{label}</Text>
      <View className="relative flex-row items-center rounded-lg border border-gray-200 bg-white">
        <View className="pl-3 pr-2">
          <Icon color="#9CA3AF" size={16} />
        </View>
        <TextInput
          value={value}
          onChangeText={onChangeText}
          keyboardType={keyboardType}
          className="flex-1 px-2 py-3 text-gray-900"
        />
      </View>
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
            value={accountInfo?.name}
            onChangeText={(text) => setAccountInfo({ ...accountInfo, name: text })}
          />
          <InputField
            icon={Mail}
            label="Email"
            value={accountInfo?.email}
            onChangeText={(text) => setAccountInfo({ ...accountInfo, email: text })}
            keyboardType="email-address"
          />
          <InputField
            icon={Phone}
            label="Phone"
            value={accountInfo?.phone}
            onChangeText={(text) => setAccountInfo({ ...accountInfo, phone: text })}
            keyboardType="phone-pad"
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

//@ts-nocheck
import { useRouter } from 'expo-router';
import { ArrowLeft, User, CreditCard, Bell, Moon, HelpCircle, LogOut } from 'lucide-react-native';
import React, { useState } from 'react';
import { View, Text, SafeAreaView, TouchableOpacity, Switch } from 'react-native';

const SettingsScreen = () => {
  const router = useRouter();
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isNotificationsEnabled, setIsNotificationsEnabled] = useState(true);

  const SettingsItem = ({ icon: Icon, title, subtitle, onPress, rightComponent }) => (
    <TouchableOpacity
      onPress={onPress}
      className="flex-row items-center justify-between border-b border-gray-100 py-4">
      <View className="flex-row items-center">
        <View className="mr-4 rounded-full bg-blue-100 p-2">
          <Icon color="#3B82F6" size={24} />
        </View>
        <View>
          <Text className="text-lg font-bold text-gray-900">{title}</Text>
          {subtitle && <Text className="text-gray-500">{subtitle}</Text>}
        </View>
      </View>
      {rightComponent}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Header */}
      <View className="flex-row items-center px-6 pb-4 pt-4">
        <TouchableOpacity onPress={() => router.back()} className="mr-4">
          <ArrowLeft color="#6B7280" size={24} />
        </TouchableOpacity>
        <Text className="text-2xl font-bold text-gray-900">Settings</Text>
      </View>

      {/* Settings Content */}
      <View className="mt-4 px-6">
        <SettingsItem
          icon={User}
          title="Account"
          subtitle="Manage your profile"
          onPress={() => {
            router.push('/settings/account');
          }}
        />

        <SettingsItem
          icon={CreditCard}
          title="Billing"
          subtitle="Payment methods and invoicing"
          onPress={() => {
            /* Navigate to billing */
          }}
        />

        <SettingsItem
          icon={Bell}
          title="Notifications"
          subtitle="Manage app notifications"
          rightComponent={
            <Switch
              value={isNotificationsEnabled}
              onValueChange={setIsNotificationsEnabled}
              trackColor={{ false: '#767577', true: '#3B82F6' }}
            />
          }
        />

        <SettingsItem
          icon={Moon}
          title="Dark Mode"
          subtitle="Toggle dark mode appearance"
          rightComponent={
            <Switch
              value={isDarkMode}
              onValueChange={setIsDarkMode}
              trackColor={{ false: '#767577', true: '#3B82F6' }}
            />
          }
        />

        <SettingsItem
          icon={HelpCircle}
          title="Help & Support"
          subtitle="Get assistance"
          onPress={() => {
            /* Navigate to help */
          }}
        />

        <SettingsItem
          icon={LogOut}
          title="Logout"
          subtitle="Sign out of your account"
          onPress={() => {
            /* Logout logic */
          }}
        />
      </View>
    </SafeAreaView>
  );
};

export default SettingsScreen;

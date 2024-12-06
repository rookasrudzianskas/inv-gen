import { Stack, useRouter } from 'expo-router';
import { Search as SearchIcon, Mail as MailIcon, PlusCircle } from 'lucide-react-native';
import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import { customEvent } from 'vexo-analytics';

import { useInvoiceStore } from '~/stores/invoice-details';

export default function ContactsListScreen() {
  const router = useRouter();
  const { invoices } = useInvoiceStore();
  const [contactSearch, setContactSearch] = useState('');

  const recentContacts = useMemo(() => {
    const uniqueContacts = new Map();
    invoices.forEach((invoice) => {
      if (!uniqueContacts.has(invoice.recipientEmail)) {
        uniqueContacts.set(invoice.recipientEmail, {
          name: invoice.recipientName,
          email: invoice.recipientEmail,
          address: invoice.recipientAddress,
          lastInvoice: invoice.createdAt,
        });
      }
    });
    return Array.from(uniqueContacts.values()).sort(
      (a, b) => b.lastInvoice.getTime() - a.lastInvoice.getTime()
    );
  }, [invoices]);

  const onNewInvoice = () => {
    customEvent('start-generating-invoice', { 'invoice-number': 'NEW INVOICE' });
    router.push('/invoices/generate');
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <Stack.Screen options={{ title: 'Select Recipient' }} />

      <View className="p-4">
        <View className="flex-row items-center rounded-lg bg-gray-50 px-4 py-2">
          <SearchIcon size={20} color="#6B7280" />
          <TextInput
            value={contactSearch}
            onChangeText={setContactSearch}
            placeholder="Search contacts"
            className="ml-2 flex-1 text-gray-400"
          />
        </View>
      </View>

      {recentContacts.length > 0 ? (
        <ScrollView className="flex-1">
          {recentContacts.map((contact) => (
            <Pressable
              key={contact.email}
              onPress={() => {
                router.push({
                  pathname: '/invoices/generate/preview',
                  params: {
                    recipientName: contact.name,
                    recipientEmail: contact.email,
                    recipientAddress: contact.address,
                  },
                });
              }}
              className="border-b border-gray-100 bg-white p-4">
              <View className="flex-row items-center justify-between">
                <View className="flex-1">
                  <Text className="text-lg font-semibold text-gray-800">{contact.name}</Text>
                  <Text className="text-gray-500">{contact.email}</Text>
                  <Text className="text-gray-500">{contact.address}</Text>
                </View>
                <MailIcon size={20} color="#3B82F6" />
              </View>
            </Pressable>
          ))}
        </ScrollView>
      ) : (
        <View className="flex-1 items-center justify-between">
          <View className="flex-1 items-center justify-center">
            <Text className="text-gray-500">No contacts found</Text>
          </View>
          <TouchableOpacity
            onPress={onNewInvoice}
            className="shadow-xs mx-6 mb-6 flex-row items-center rounded-2xl bg-blue-100 p-6">
            <View className="mr-4 rounded-full bg-blue-500 p-3">
              <PlusCircle color="white" size={28} />
            </View>
            <View>
              <Text className="text-xl font-bold text-blue-900">Generate New Invoice</Text>
              <Text className="mt-1 text-gray-600">Create a professional invoice quickly</Text>
            </View>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
}

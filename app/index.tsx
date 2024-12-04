//@ts-nocheck
import { useRouter } from 'expo-router';
import { PlusCircle, FileText, Settings } from 'lucide-react-native';
import React from 'react';
import { View, Text, TouchableOpacity, SafeAreaView, FlatList } from 'react-native';
import { customEvent } from 'vexo-analytics';
import * as ContextMenu from 'zeego/context-menu';

import { useInvoiceStore } from '~/stores/invoice-details';

const GenerateInvoice = () => {
  const router = useRouter();
  const { invoices, deleteInvoice } = useInvoiceStore((state) => ({
    invoices: state.invoices,
    deleteInvoice: state.deleteInvoice
  }));
  const handleDeleteInvoice = (invoiceId: string) => {
    deleteInvoice(invoiceId);
  };
  const onNewInvoice = () => {
    customEvent('start-generating-invoice', {
      'invoice-number': 'NEW INVOICE',
    });

    router.push('/invoices/generate');
  };

  const InvoiceItem = ({ item }) => (
    <ContextMenu.Root>
      <ContextMenu.Trigger>
        <TouchableOpacity
          className="flex-row items-center justify-between border-b border-gray-200 bg-white p-4">
          <View className="flex-1">
            <Text className="text-lg font-semibold">{item.invoiceNumber}</Text>
            <Text className="text-gray-600">{item.description}</Text>
          </View>
          <View className="items-end">
            <Text className="text-lg font-bold text-green-600">${item.amount}</Text>
            <Text className="text-gray-500">{item.date}</Text>
          </View>
        </TouchableOpacity>
      </ContextMenu.Trigger>

      <ContextMenu.Content>
        <ContextMenu.Item key="delete" onSelect={() => handleDeleteInvoice(item.id)}>
          <ContextMenu.ItemTitle>Delete Invoice</ContextMenu.ItemTitle>
          <ContextMenu.ItemIcon name="trash" />
        </ContextMenu.Item>
      </ContextMenu.Content>
    </ContextMenu.Root>
  );

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-row items-center justify-between px-6 pb-4 pt-8">
        <Text className="text-3xl font-bold text-gray-900">Invoice Manager</Text>
        <TouchableOpacity onPress={() => router.push('/settings')}>
          <Settings color="#6B7280" size={24} />
        </TouchableOpacity>
      </View>

      <View className="mt-1 flex-1 px-6">
        <TouchableOpacity
          onPress={onNewInvoice}
          className="shadow-xs mb-6 flex-row items-center rounded-2xl bg-blue-100 p-6">
          <View className="mr-4 rounded-full bg-blue-500 p-3">
            <PlusCircle color="white" size={28} />
          </View>
          <View>
            <Text className="text-xl font-bold text-blue-900">Generate New Invoice</Text>
            <Text className="mt-1 text-gray-600">Create a professional invoice quickly</Text>
          </View>
        </TouchableOpacity>

        <View className="flex-1">
          <Text className="mb-4 text-xl font-bold text-gray-900">Recent Invoices</Text>

          {invoices.length > 0 ? (
            <FlatList
              data={invoices}
              renderItem={InvoiceItem}
              keyExtractor={(item) => item.id}
              showsVerticalScrollIndicator={false}
            />
          ) : (
            <View className="items-center rounded-2xl bg-gray-50 p-6">
              <FileText color="#6B7280" size={48} />
              <Text className="mt-4 text-center text-lg text-gray-700">No recent invoices</Text>
              <Text className="mt-2 text-center text-gray-500">
                Start by generating your first invoice
              </Text>
            </View>
          )}
        </View>
      </View>

      <View className="flex-row justify-between border-t border-gray-100 px-6 py-4">
        <TouchableOpacity onPress={() => router.push('/')} className="items-center">
          <FileText color="#3B82F6" size={24} />
          <Text className="mt-1 text-xs text-blue-500">Invoices</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => router.push('/invoices/generate')}
          className="items-center">
          <PlusCircle color="#6B7280" size={24} />
          <Text className="mt-1 text-xs text-gray-500">New</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.push('/settings')} className="items-center">
          <Settings color="#6B7280" size={24} />
          <Text className="mt-1 text-xs text-gray-500">Settings</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default GenerateInvoice;

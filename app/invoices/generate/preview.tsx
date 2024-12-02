import { Stack } from 'expo-router';
import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { z } from 'zod';
import { InvoiceGenerationSchema, ClientGenerationSchema, InvoiceInfoSchema } from '~/schemas/invoice';

// Combine all schemas for full invoice creation
type FullInvoiceData =
  z.infer<typeof InvoiceGenerationSchema> &
  z.infer<typeof ClientGenerationSchema> &
  z.infer<typeof InvoiceInfoSchema>;

import { Button } from '~/components/Button';

export default function InvoicePreviewScreen() {
  // Simulated data matching schemas
  const invoiceData = {
    sender: {
      email: 'byrookas@gmail.com',
      invoiceNumber: 'INV-1234',
      amount: 100,
      description: 'Professional web development services for Q1 2024',
    },
    recipient: {
      name: 'John Doe',
      email: 'johndoe@example.com',
      address: '123 Main St, Anytown, USA',
    },
    details: {
      paymentTerms: 'Net 30',
      taxRate: '10',
      discount: '0',
      additionalNotes: 'Thank you for your business',
    },
  };

  const calculateTax = () => {
    return invoiceData.sender.amount * (parseFloat(invoiceData.details.taxRate) / 100);
  };

  const calculateTotal = () => {
    return invoiceData.sender.amount + calculateTax();
  };

  return (
    <View className="flex-1 bg-white">
      <Stack.Screen options={{ title: 'Invoice Preview' }} />
      <ScrollView className="p-4">
        {/* Header */}
        <View className="rounded-t-lg bg-blue-100 p-4">
          <Text className="text-2xl font-bold text-blue-800">Invoice</Text>
          <Text className="text-gray-600">Invoice Number: {invoiceData.sender.invoiceNumber}</Text>
        </View>

        {/* Sender & Recipient Details */}
        <View className="mt-4 flex-row justify-between rounded-lg bg-gray-50 p-4">
          <View>
            <Text className="font-bold text-gray-800">From:</Text>
            <Text>{invoiceData.sender.email}</Text>
          </View>
          <View className="items-end">
            <Text className="font-bold text-gray-800">To:</Text>
            <Text>{invoiceData.recipient.name}</Text>
            <Text>{invoiceData.recipient.email}</Text>
            <Text>{invoiceData.recipient.address}</Text>
          </View>
        </View>

        {/* Invoice Details */}
        <View className="mt-4 rounded-lg bg-gray-50 p-4">
          <Text className="mb-2 text-lg font-bold">Invoice Details</Text>
          <View className="mb-2 flex-row justify-between">
            <Text>Subtotal:</Text>
            <Text>${invoiceData.sender.amount.toFixed(2)}</Text>
          </View>
          <View className="mb-2 flex-row justify-between">
            <Text>Tax ({invoiceData.details.taxRate}%):</Text>
            <Text>${calculateTax().toFixed(2)}</Text>
          </View>
          <View className="mb-2 flex-row justify-between">
            <Text>Payment Terms:</Text>
            <Text>{invoiceData.details.paymentTerms}</Text>
          </View>
          <View className="mb-2 flex-row justify-between">
            <Text className="font-bold">Total:</Text>
            <Text className="font-bold">${calculateTotal().toFixed(2)}</Text>
          </View>
        </View>

        {/* Description */}
        <View className="mt-4 rounded-lg bg-gray-50 p-4">
          <Text className="mb-2 font-bold">Description</Text>
          <Text>{invoiceData.sender.description}</Text>
        </View>

        {/* Additional Notes */}
        {invoiceData.details.additionalNotes && (
          <View className="mt-4 rounded-lg bg-gray-50 p-4">
            <Text className="mb-2 font-bold">Additional Notes</Text>
            <Text>{invoiceData.details.additionalNotes}</Text>
          </View>
        )}

        {/* Action Buttons */}
        <View className="mt-6 flex-row justify-between">
          <Button title="Edit" className="w-[45%] rounded-md bg-gray-500 px-6 py-2 text-white" />
          <Button
            title="Send Invoice"
            className="w-[45%] rounded-md bg-blue-600 px-6 py-2 text-white"
          />
        </View>
      </ScrollView>
    </View>
  );
}

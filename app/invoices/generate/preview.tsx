import { Stack, useRouter } from 'expo-router';
import React from 'react';
import { View, Text, ScrollView } from 'react-native';

import { Button } from '~/components/Button';
import { useInvoiceStore } from '~/stores/invoice-details';
import { generateInvoicePDF } from '~/utils/pdf';

export default function InvoicePreviewScreen() {
  const router = useRouter();
  const { senderInfo, recipientInfo, invoiceInfo, calculateTotal, isCompleteInvoice } =
    useInvoiceStore();

  const totals = calculateTotal();

  if (!senderInfo || !recipientInfo || !invoiceInfo || !totals) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <Text className="text-gray-600">Loading invoice data...</Text>
      </View>
    );
  }

  const generatePDF = async () => {
    await generateInvoicePDF();
    router.push('/invoices/generate/success');
  };

  return (
    <View className="flex-1 bg-white">
      <Stack.Screen options={{ title: 'Invoice Preview' }} />
      <ScrollView className="p-4">
        {/* Header */}
        <View className="rounded-t-lg bg-blue-100 p-4">
          <Text className="text-2xl font-bold text-blue-800">Invoice</Text>
          <Text className="text-gray-600">Invoice Number: {senderInfo.invoiceNumber}</Text>
        </View>

        {/* Sender & Recipient Details */}
        <View className="mt-4 flex-row justify-between rounded-lg bg-gray-50 p-4">
          <View>
            <Text className="font-bold text-gray-800">From:</Text>
            <Text>{senderInfo.email}</Text>
          </View>
          <View className="items-end">
            <Text className="font-bold text-gray-800">To:</Text>
            <Text>{recipientInfo.recipientName}</Text>
            <Text>{recipientInfo.recipientEmail}</Text>
            <Text>{recipientInfo.recipientAddress}</Text>
          </View>
        </View>

        {/* Invoice Details */}
        <View className="mt-4 rounded-lg bg-gray-50 p-4">
          <Text className="mb-2 text-lg font-bold">Invoice Details</Text>
          <View className="mb-2 flex-row justify-between">
            <Text>Subtotal:</Text>
            <Text>${totals.subtotal.toFixed(2)}</Text>
          </View>
          <View className="mb-2 flex-row justify-between">
            <Text>Tax ({invoiceInfo.taxRate}%):</Text>
            <Text>${totals.tax.toFixed(2)}</Text>
          </View>
          {totals.discount > 0 && (
            <View className="mb-2 flex-row justify-between">
              <Text>Discount:</Text>
              <Text>-${totals.discount.toFixed(2)}</Text>
            </View>
          )}
          <View className="mb-2 flex-row justify-between">
            <Text>Payment Terms:</Text>
            <Text>{invoiceInfo.paymentTerms}</Text>
          </View>
          <View className="mb-2 flex-row justify-between">
            <Text className="font-bold">Total:</Text>
            <Text className="font-bold">${totals.total.toFixed(2)}</Text>
          </View>
        </View>

        {/* Description */}
        <View className="mt-4 rounded-lg bg-gray-50 p-4">
          <Text className="mb-2 font-bold">Description</Text>
          <Text>{senderInfo.description}</Text>
        </View>

        {/* Additional Notes */}
        {invoiceInfo.additionalNotes && (
          <View className="mt-4 rounded-lg bg-gray-50 p-4">
            <Text className="mb-2 font-bold">Additional Notes</Text>
            <Text>{invoiceInfo.additionalNotes}</Text>
          </View>
        )}

        {/* Action Buttons */}
        <View className="mt-6 flex-row justify-between">
          <Button title="Edit" className="w-[45%] rounded-md bg-gray-500 px-6 py-2 text-white" />
          <Button
            title="Send Invoice"
            className="w-[45%] rounded-md bg-blue-600 px-6 py-2 text-white"
            disabled={!isCompleteInvoice()}
            onPress={generatePDF}
          />
        </View>
      </ScrollView>
    </View>
  );
}

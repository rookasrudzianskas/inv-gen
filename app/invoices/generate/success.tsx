import { Stack, useRouter } from 'expo-router';
import { Check, Download, Send, ShareIcon } from 'lucide-react-native';
import React from 'react';
import { View, Text, ScrollView, Share } from 'react-native';

import { Button } from '~/components/Button';
import { useInvoiceStore } from '~/stores/invoice-details';
import { generateInvoicePDF } from '~/utils/pdf';

export default function InvoiceSuccessScreen() {
  const router = useRouter();
  const { senderInfo, recipientInfo, invoiceInfo, calculateTotal } = useInvoiceStore();
  const totals = calculateTotal();

  const handleShare = async () => {
    try {
      // Assuming generateInvoicePDF returns the file URI
      const pdfUri = await generateInvoicePDF();

      await Share.share({
        title: `Invoice ${senderInfo.invoiceNumber}`,
        url: pdfUri,
        message: `Invoice for ${recipientInfo.recipientName} - Total: $${totals.total.toFixed(2)}`,
      });
    } catch (error) {
      console.error('Sharing failed', error);
    }
  };

  return (
    <View className="flex-1 bg-white">
      <Stack.Screen options={{ title: 'Invoice Generated' }} />
      <ScrollView className="p-4">
        {/* Success Header */}
        <View className="mb-4 flex-row items-center rounded-lg bg-green-100 p-4">
          <Check color="#10b981" size={24} />
          <View className="ml-3">
            <Text className="text-2xl font-bold text-green-800">Invoice Created</Text>
            <Text className="text-gray-600">Invoice Number: {senderInfo.invoiceNumber}</Text>
          </View>
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

        {/* Action Buttons */}
        <View className="mt-6 flex-row justify-between">
          <Button
            title="Download"
            icon={<Download color="white" size={20} />}
            className="w-[30%] flex-row items-center justify-center rounded-md bg-blue-600 px-4 py-2 text-white"
            onPress={generateInvoicePDF}
          />
          <Button
            title="Share"
            icon={<ShareIcon color="white" size={20} />}
            className="w-[30%] flex-row items-center justify-center rounded-md bg-green-600 px-4 py-2 text-white"
            onPress={handleShare}
          />
          <Button
            title="Send"
            icon={<Send color="white" size={20} />}
            className="w-[30%] flex-row items-center justify-center rounded-md bg-purple-600 px-4 py-2 text-white"
            onPress={() => {
              /* Implement send functionality */
            }}
          />
        </View>
      </ScrollView>
    </View>
  );
}

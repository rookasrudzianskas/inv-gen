import { zodResolver } from '@hookform/resolvers/zod';
import { Stack, Link, useRouter } from 'expo-router';
import React from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { View, Text, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { z } from 'zod';

import { Button } from '~/components/Button';
import CustomTextInput from '~/components/custom-text-input';
import { ClientGenerationSchema } from '~/schemas/invoice';
import { useInvoiceStore } from '~/stores/invoice-details';

type RecipientInfo = z.infer<typeof ClientGenerationSchema>;

const InvoiceGenerationForm = () => {
  const router = useRouter();
  const setRecipientInfo = useInvoiceStore((state) => state.setRecipientInfo);
  const recipientInfo = useInvoiceStore((state) => state.recipientInfo);
  const senderInfo = useInvoiceStore((state) => state.senderInfo);

  React.useEffect(() => {
    if (!senderInfo) {
      router.replace('/invoices/generate');
    }
  }, [senderInfo]);

  const form = useForm<RecipientInfo>({
    resolver: zodResolver(ClientGenerationSchema),
    defaultValues: recipientInfo || {
      recipientName: 'John Doe',
      recipientEmail: 'johndoe@example.com',
      recipientAddress: '123 Main St, Anytown, USA',
      invoiceNumber: senderInfo?.invoiceNumber || 'INV-1234',
      amount: senderInfo?.amount || '100',
      description: senderInfo?.description || 'This is a test invoice',
    },
  });

  const onSubmit = (data: RecipientInfo) => {
    setRecipientInfo(data);
    router.push('/invoices/generate/invoice-info');
  };

  return (
    <View className="flex-1 bg-white">
      <Stack.Screen options={{ title: 'Generate Invoice' }} />
      <KeyboardAvoidingView
        contentContainerStyle={{ paddingBottom: 100 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1">
        <FormProvider {...form}>
          <ScrollView className="p-4" contentContainerStyle={{ paddingBottom: 100 }}>
            {/* Header */}
            <View className="mb-4 rounded-t-lg bg-blue-100 p-4">
              <Text className="text-2xl font-bold text-blue-800">Recipient Details</Text>
              <Text className="text-gray-600">Enter recipient information below</Text>
            </View>

            {/* Recipient Information Section */}
            <View className="mb-4 rounded-lg bg-gray-50 p-4">
              <Text className="mb-4 text-lg font-bold text-gray-800">Contact Information</Text>

              <CustomTextInput
                label="Recipient Name"
                placeholder="Enter recipient name"
                name="recipientName"
                className="mb-4"
              />

              <CustomTextInput
                label="Recipient Email"
                placeholder="Enter recipient email"
                name="recipientEmail"
                className="mb-4"
              />

              <CustomTextInput
                label="Recipient Address"
                placeholder="Enter recipient address"
                name="recipientAddress"
                multiline
                rows={4}
                className="min-h-[100px]"
              />
            </View>

            {/* Invoice Details Section */}
            <View className="mb-4 rounded-lg bg-gray-50 p-4">
              <Text className="mb-4 text-lg font-bold text-gray-800">Invoice Details</Text>

              <CustomTextInput
                label="Invoice Number"
                placeholder="Enter invoice number"
                name="invoiceNumber"
                className="mb-4"
              />

              <CustomTextInput
                label="Invoice Amount ($)"
                placeholder="Enter invoice amount"
                name="amount"
                className="mb-4"
              />

              <CustomTextInput
                label="Description"
                placeholder="Enter invoice description"
                name="description"
                multiline
                rows={4}
                className="min-h-[100px]"
              />
            </View>

            {/* Action Buttons */}
            <View className="mt-2 flex-row justify-between">
              <Link href="/invoices/generate" asChild>
                <Button
                  title="Back"
                  className="w-[45%] rounded-md bg-gray-500 px-6 py-2 text-white"
                />
              </Link>
              <Button
                title="Next Step"
                onPress={form.handleSubmit(onSubmit)}
                className="w-[45%] rounded-md bg-blue-600 px-6 py-2 text-white"
              />
            </View>
          </ScrollView>
        </FormProvider>
      </KeyboardAvoidingView>
    </View>
  );
};

export default InvoiceGenerationForm;

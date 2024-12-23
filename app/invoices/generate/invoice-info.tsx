import { zodResolver } from '@hookform/resolvers/zod';
import { Stack, Link, useRouter } from 'expo-router';
import React from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { View, Text, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { z } from 'zod';

import { Button } from '~/components/Button';
import CustomTextInput from '~/components/custom-text-input';
import { InvoiceInfoSchema } from '~/schemas/invoice';
import { useInvoiceStore } from '~/stores/invoice-details';

type InvoiceInfoType = z.infer<typeof InvoiceInfoSchema>;

const InvoiceInfoScreen = () => {
  const router = useRouter();
  const {
    setInvoiceInfo,
    invoiceInfo,
    senderInfo,
    recipientInfo,
    calculateTotal,
    addInvoice // Add this line
  } = useInvoiceStore((state) => ({
    setInvoiceInfo: state.setInvoiceInfo,
    invoiceInfo: state.invoiceInfo,
    senderInfo: state.senderInfo,
    recipientInfo: state.recipientInfo,
    calculateTotal: state.calculateTotal,
    addInvoice: state.addInvoice,
  }));

  React.useEffect(() => {
    if (!senderInfo || !recipientInfo) {
      router.replace('/invoices/generate/invoice-info');
    }
  }, [senderInfo, recipientInfo]);

  const form = useForm<InvoiceInfoType>({
    resolver: zodResolver(InvoiceInfoSchema),
    defaultValues: invoiceInfo || {
      paymentTerms: 'Net 30',
      taxRate: '10',
      discount: '0',
      additionalNotes: 'Thank you for your business',
    },
  });

  const onSubmit = (data: InvoiceInfoType) => {
    setInvoiceInfo(data);
    const totals = calculateTotal();

    console.log('Sender Info:', senderInfo);
    console.log('Recipient Info:', recipientInfo);
    console.log('Invoice Info:', data);
    console.log('Totals:', totals);

    if (senderInfo && recipientInfo && totals) {
      const newInvoice = {
        ...senderInfo,
        ...recipientInfo,
        ...data,
        amount: totals.total.toString(),
      };

      console.log('Attempting to add invoice:', newInvoice);
      // @ts-ignore
      addInvoice(newInvoice);
    }

    router.push('/invoices/generate/preview');
  };
  return (
    <View className="flex-1 bg-white">
      <Stack.Screen options={{ title: 'Invoice Details' }} />
      <KeyboardAvoidingView
        contentContainerStyle={{ paddingBottom: 100 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1">
        <FormProvider {...form}>
          <ScrollView
            className="p-4"
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 100 }}>
            {/* Header */}
            <View className="mb-4 rounded-t-lg bg-blue-100 p-4">
              <Text className="text-2xl font-bold text-blue-800">Additional Details</Text>
              <Text className="text-gray-600">Set payment terms and other information</Text>
            </View>

            {/* Payment Terms Section */}
            <View className="mb-4 rounded-lg bg-gray-50 p-4">
              <Text className="mb-4 text-lg font-bold text-gray-800">Payment Information</Text>

              <CustomTextInput
                label="Payment Terms"
                placeholder="Enter payment terms (e.g., Net 30)"
                name="paymentTerms"
                className="mb-4"
              />

              <CustomTextInput
                label="Tax Rate (%)"
                placeholder="Enter tax rate"
                name="taxRate"
                className="mb-4"
              />

              <CustomTextInput
                label="Discount (%)"
                placeholder="Enter discount percentage"
                name="discount"
                className="mb-4"
              />
            </View>

            {/* Additional Notes Section */}
            <View className="mb-4 rounded-lg bg-gray-50 p-4">
              <Text className="mb-4 text-lg font-bold text-gray-800">Notes</Text>

              <CustomTextInput
                label="Additional Notes"
                placeholder="Enter any additional notes"
                name="additionalNotes"
                multiline
                rows={4}
                className="min-h-[100px]"
              />
            </View>

            {/* Preview Calculations */}
            <View className="mb-4 rounded-lg bg-blue-50 p-4">
              <Text className="mb-2 text-lg font-bold text-blue-800">Preview Calculations</Text>
              <Text className="text-gray-600">Amount: ${recipientInfo?.amount || '0'}</Text>
              <Text className="text-gray-600">Tax Rate: {form.watch('taxRate')}%</Text>
              <Text className="text-gray-600">Discount: {form.watch('discount')}%</Text>
            </View>

            {/* Action Buttons */}
            <View className="mt-2 flex-row justify-between">
              <Link href="/invoices/generate/recipient" asChild>
                <Button
                  title="Back"
                  className="w-[45%] rounded-md bg-gray-500 px-6 py-2 text-white"
                />
              </Link>
              <Button
                title="Preview Invoice"
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

export default InvoiceInfoScreen;

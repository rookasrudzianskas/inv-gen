import { zodResolver } from '@hookform/resolvers/zod';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Stack, Link, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { FormProvider, useForm, Controller } from 'react-hook-form';
import {
  View,
  Text,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
} from 'react-native';
import { z } from 'zod';

import { Button } from '~/components/Button';
import CustomTextInput from '~/components/custom-text-input';
import { InvoiceGenerationSchema } from '~/schemas/invoice';
import { useInvoiceStore } from '~/stores/invoice-details';
import { customEvent } from 'vexo-analytics'

type SenderInfo = z.infer<typeof InvoiceGenerationSchema>;

export default function InvoiceGenerationForm() {
  const router = useRouter();
  const setSenderInfo = useInvoiceStore((state) => state.setSenderInfo);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const form = useForm<SenderInfo>({
    resolver: zodResolver(InvoiceGenerationSchema),
    defaultValues: {
      email: 'byrookas@gmail.com',
      invoiceNumber: 'INV-1234',
      amount: '100',
      description: 'This is a test invoice',
      invoiceDate: new Date(),
    },
  });

  const onSubmit = (data: SenderInfo) => {
    console.log('Form Data:', data);
    setSenderInfo(data);
    router.push('/invoices/generate/recipient');
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
              <Text className="text-2xl font-bold text-blue-800">New Invoice</Text>
              <Text className="text-gray-600">Enter invoice details below</Text>
            </View>

            {/* Form Section */}
            <View className="mb-4 rounded-lg bg-gray-50 p-4">
              <Text className="mb-4 text-lg font-bold text-gray-800">Sender Information</Text>

              <CustomTextInput
                label="Email Address"
                placeholder="Enter your email"
                name="email"
                className="mb-4"
              />

              <CustomTextInput
                label="Invoice Number"
                placeholder="Enter invoice number"
                name="invoiceNumber"
                className="mb-4"
              />

              {/* Date Picker Section */}
              <View className="mb-4">
                <Text className="mb-2 text-gray-700">Invoice Date</Text>
                <Controller
                  control={form.control}
                  name="invoiceDate"
                  render={({ field: { value, onChange } }) => (
                    <View>
                      <TouchableOpacity
                        onPress={() => setShowDatePicker(true)}
                        className="rounded-md border border-gray-300 bg-white p-3">
                        <Text>{value.toLocaleDateString()}</Text>
                      </TouchableOpacity>

                      {showDatePicker && (
                        <DateTimePicker
                          value={value}
                          mode="date"
                          display="calendar"
                          onChange={(event, selectedDate) => {
                            setShowDatePicker(false);
                            onChange(selectedDate || value);
                          }}
                        />
                      )}
                    </View>
                  )}
                />
              </View>
            </View>

            {/* Amount Section */}
            <View className="mb-4 rounded-lg bg-gray-50 p-4">
              <Text className="mb-4 text-lg font-bold text-gray-800">Invoice Amount</Text>

              <CustomTextInput
                label="Amount ($)"
                placeholder="Enter invoice amount"
                name="amount"
                className="mb-2"
              />
            </View>

            {/* Description Section */}
            <View className="mb-6 rounded-lg bg-gray-50 p-4">
              <Text className="mb-4 text-lg font-bold text-gray-800">Description</Text>

              <CustomTextInput
                label="Invoice Description"
                placeholder="Enter invoice description"
                name="description"
                multiline
                rows={4}
                className="min-h-[100px]"
              />
            </View>

            {/* Action Buttons */}
            <View className="mt-2 flex-row justify-between">
              <Link href="/" asChild>
                <Button
                  title="Cancel"
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
}

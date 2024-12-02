import { yupResolver } from '@hookform/resolvers/yup';
import { Stack, Link } from 'expo-router';
import React from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { View, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { z } from 'zod';

import { Button } from '~/components/Button';
import { Container } from '~/components/Container';
import CustomTextInput from '~/components/custom-text-input';
import { ClientGenerationSchema } from '~/schemas/invoice';

interface FormData {
  recipientName: string;
  recipientEmail: string;
  recipientAddress: string;
  invoiceNumber: string;
  amount: string;
  description: string;
  [key: string]: any;
}

type RecipientInfo = z.infer<typeof ClientGenerationSchema>;

export default function InvoiceGenerationForm() {
  const form = useForm<RecipientInfo>({
    resolver: yupResolver(ClientGenerationSchema),
  });

  const onSubmit = (data: FormData) => {
    console.log(data);
  };

  return (
    <>
      <Stack.Screen options={{ title: 'Generate Invoice' }} />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1">
        <FormProvider {...form}>
          <Container className="flex-1 bg-gray-100">
            <ScrollView keyboardShouldPersistTaps="handled" contentContainerClassName="pb-20">
              <CustomTextInput
                label="Recipient Name"
                placeholder="Enter recipient name"
                className=""
                name="recipientName"
              />
              <CustomTextInput
                label="Recipient Email"
                placeholder="Enter recipient email"
                className=""
                name="recipientEmail"
              />
              <CustomTextInput
                label="Recipient Address"
                placeholder="Enter recipient address"
                className="h-24 rounded-sm border border-gray-300 bg-white p-2"
                name="recipientAddress"
                multiline
                rows={4}
              />
              <CustomTextInput
                label="Invoice Number"
                placeholder="Enter invoice number"
                className=""
                name="invoiceNumber"
              />
              <CustomTextInput
                label="Enter invoice amount"
                placeholder="Enter invoice amount"
                name="amount"
                className=""
                keyboardType="numeric"
              />
              <CustomTextInput
                label="Enter invoice description"
                placeholder="Enter invoice description"
                name="description"
                className="h-24 rounded-sm border border-gray-300 bg-white p-2"
                multiline
                rows={4}
              />
              <View className="mt-4 flex-row justify-between">
                <Link href="/" asChild>
                  <Button title="Cancel" className="rounded-md bg-gray-500 px-6 py-2 text-white" />
                </Link>
                <Button
                  title="Generate Invoice"
                  onPress={form.handleSubmit(onSubmit)}
                  className="rounded-md bg-blue-600 px-6 py-2 text-white"
                />
              </View>
            </ScrollView>
          </Container>
        </FormProvider>
      </KeyboardAvoidingView>
    </>
  );
}

import { zodResolver } from '@hookform/resolvers/zod';
import { Stack, Link, useRouter } from 'expo-router';
import React from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { View, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { z } from 'zod';

import { Button } from '~/components/Button';
import { Container } from '~/components/Container';
import CustomTextInput from '~/components/custom-text-input';
import { InvoiceGenerationSchema } from '~/schemas/invoice';

type SenderInfo = z.infer<typeof InvoiceGenerationSchema>;

export default function InvoiceGenerationForm() {
  const router = useRouter();
  const form = useForm<SenderInfo>({
    resolver: zodResolver(InvoiceGenerationSchema),
    defaultValues: {
      email: 'byrookas@gmail.com',
      invoiceNumber: 'INV-1234',
      amount: '100',
      description: 'This is a test invoice',
    },
  });

  const onSubmit = (data: SenderInfo) => {
    console.log('Form Data:', data);
    router.push('/invoices/generate/recipient');
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
                label="Client Email"
                placeholder="Enter client email"
                name="email"
                className="mb-4"
              />
              <CustomTextInput
                label="Invoice Number"
                placeholder="Enter invoice number"
                name="invoiceNumber"
                className="mb-4"
              />
              <CustomTextInput
                label="Enter invoice amount"
                placeholder="Enter invoice amount"
                name="amount"
                className="mb-4"
              />
              <CustomTextInput
                label="Enter invoice description"
                placeholder="Enter invoice description"
                name="description"
                className=""
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

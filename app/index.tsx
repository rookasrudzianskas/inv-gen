import { Stack, Link } from 'expo-router';
import React, { useState } from 'react';
import { Controller, FormProvider, useForm } from 'react-hook-form';
import { View, Text, TextInput, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';

import { Button } from '~/components/Button';
import { Container } from '~/components/Container';
import CustomTextInput from '~/components/custom-text-input';

interface FormData {
  email: string;
  invoiceNumber: string;
  amount: string;
  description: string;
  [key: string]: any;
}

export default function InvoiceGenerationForm() {
  const form = useForm();

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
                label="Client Email"
                placeholder="Enter client email"
                className=""
                name="email"
              />

              <CustomTextInput
                label={'Invoice Number'}
                placeholder={'Enter invoice number'}
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

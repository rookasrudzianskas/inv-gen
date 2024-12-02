import { Stack, Link } from 'expo-router';
import React, { useState } from 'react';
import { View, Text, TextInput, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';

import { Button } from '~/components/Button';
import { Container } from '~/components/Container';
import { ScreenContent } from '~/components/ScreenContent';
import CustomTextInput from "~/components/custom-text-input";

export default function InvoiceGenerationForm() {
  const [clientName, setClientName] = useState('');
  const [invoiceNumber, setInvoiceNumber] = useState('');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = () => {
    console.log('Invoice Details:', {
      clientName,
      invoiceNumber,
      amount,
      description,
    });
  };

  return (
    <>
      <Stack.Screen options={{ title: 'Generate Invoice' }} />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1">
        <Container className="flex-1 bg-gray-100">
          <ScrollView keyboardShouldPersistTaps="handled" contentContainerClassName="pb-20">
            <View className="mb-4">
              <CustomTextInput
                label="Client Email"
                placeholder="Enter client email"
                value={clientName}
                onChangeText={setClientName}
                className=""
              />
            </View>

            <View className="mb-4">
              <CustomTextInput
                label="Enter invoice number"
                placeholder="Enter invoice number"
                value={invoiceNumber}
                onChangeText={setInvoiceNumber}
                className=""
                keyboardType="numeric"
              />
            </View>

            <View className="mb-4">
              <CustomTextInput
                label="Enter invoice amount"
                placeholder="Enter invoice amount"
                value={amount}
                onChangeText={setAmount}
                className=""
                keyboardType="numeric"
              />
            </View>

            <View className="mb-4">
              <CustomTextInput
                label="Enter invoice description"
                placeholder="Enter invoice description"
                value={description}
                onChangeText={setDescription}
                className="h-24 rounded-sm border border-gray-300 bg-white p-2"
                multiline
              />
            </View>

            <View className="mt-4 flex-row justify-between">
              <Link href="/" asChild>
                <Button title="Cancel" className="rounded-md bg-gray-500 px-6 py-2 text-white" />
              </Link>
              <Button
                title="Generate Invoice"
                onPress={handleSubmit}
                className="rounded-md bg-blue-600 px-6 py-2 text-white"
              />
            </View>
          </ScrollView>
        </Container>
      </KeyboardAvoidingView>
    </>
  );
}

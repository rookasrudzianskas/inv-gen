//@ts-nocheck
import React from 'react';
import {Text, View, StyleSheet} from 'react-native';
import {Button} from "~/components/Button";
import {useRouter} from "expo-router";

const GenerateInvoice = () => {
  const router = useRouter();
  return (
    <View>
      <Button onPress={() => router.push('/invoices/generate')} title={'Generate Invoice'}>
        <Text>byrookas 🚀</Text>
      </Button>
    </View>
  );
};

export default GenerateInvoice;

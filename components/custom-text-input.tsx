//@ts-nocheck
import React from 'react';
import { Controller, useController, useFormContext } from 'react-hook-form';
import { Text, View, StyleSheet, TextInput } from 'react-native';

const CustomTextInput = ({ label, name, ...props }) => {
  const {
    field: { onChange, onBlur, value },
    fieldState: { error },
  } = useController({ name, rules: { required: true } });

  return (
    <View className={''}>
      <Text className="mb-2 text-lg font-semibold text-gray-700">{label}</Text>
      <TextInput
        {...props}
        value={value}
        onChangeText={onChange}
        onBlur={onBlur}
        className={`rounded-sm border border-gray-300 bg-white p-2 ${props.className}`}
      />
      <Text className="text-red-500">{error?.message}</Text>
    </View>
  );
};

export default CustomTextInput;

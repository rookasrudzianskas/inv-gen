//@ts-nocheck
import React from 'react';
import {Text, View, StyleSheet, TextInput} from 'react-native';

const CustomTextInput = ({ label, ...props }) => {
  return (
    <View>
      <Text className="mb-2 text-lg font-bold text-gray-700">{label}</Text>
      <TextInput
        {...props}
        className={`rounded-sm border border-gray-300 bg-white p-2 ${props.className}`}
      />
    </View>
  );
};

export default CustomTextInput;

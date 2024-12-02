import React from 'react';
import { useFormContext, Controller } from 'react-hook-form';
import { Text, View, TextInput } from 'react-native';

interface CustomTextInputProps {
  label: string;
  name: string;
  className?: string;
  placeholder?: string;
  multiline?: boolean;
  rows?: number;
}

const CustomTextInput: React.FC<CustomTextInputProps> = ({
  label,
  name,
  placeholder,
  className = '',
  multiline = false,
  rows = 1,
  ...props
}) => {
  const { control } = useFormContext();

  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
        <View className={className}>
          <Text className="mb-2 text-lg font-semibold text-gray-700">{label}</Text>
          <TextInput
            {...props}
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            placeholder={placeholder}
            multiline={multiline}
            numberOfLines={rows}
            className="rounded-sm border border-gray-300 bg-white p-2"
          />
          {error && <Text className="text-red-500">{error.message}</Text>}
        </View>
      )}
    />
  );
};

export default CustomTextInput;

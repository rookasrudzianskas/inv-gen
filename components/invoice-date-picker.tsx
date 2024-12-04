import DateTimePicker from '@react-native-community/datetimepicker';
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Platform } from 'react-native';
import { z } from 'zod';
import { create } from 'zustand';

import { InvoiceInfoSchema } from '~/schemas/invoice';

interface InvoiceStore {
  invoiceDate: Date | null;
  setInvoiceDate: (date: Date) => void;
}

export const useInvoiceStore = create<InvoiceStore>((set, get) => ({
  invoiceDate: null,

  setInvoiceDate: (date: Date) => {
    set({ invoiceDate: date });
  },

  isValidInvoiceInfo: () => {
    const { invoiceInfo, invoiceDate } = get();
    if (!invoiceInfo || !invoiceDate) return false;
    try {
      // Validate invoice date separately
      z.date()
        .refine((date) => date <= new Date(), { message: 'Invoice date cannot be in the future' })
        .parse(invoiceDate);

      return InvoiceInfoSchema.parse(invoiceInfo) !== null;
    } catch (error) {
      return false;
    }
  },
}));

export const InvoiceDatePicker: React.FC = () => {
  const { invoiceDate, setInvoiceDate } = useInvoiceStore();
  const [show, setShow] = useState(false);

  const onChange = (event: any, selectedDate?: Date) => {
    const currentDate = selectedDate || invoiceDate;
    setShow(Platform.OS === 'ios'); // On iOS, keep the picker open
    setInvoiceDate(currentDate);
  };

  const showDatepicker = () => {
    setShow(true);
  };

  return (
    <View>
      <TouchableOpacity onPress={showDatepicker}>
        <View style={styles.dateContainer}>
          <Text style={styles.dateText}>
            {invoiceDate ? invoiceDate.toLocaleDateString() : 'Select Invoice Date'}
          </Text>
        </View>
      </TouchableOpacity>

      {show && (
        <DateTimePicker
          testID="dateTimePicker"
          value={invoiceDate || new Date()}
          mode="date"
          is24Hour
          display="default"
          onChange={onChange}
          maximumDate={new Date()}
        />
      )}
    </View>
  );
};

const styles = {
  dateContainer: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 5,
    backgroundColor: 'white',
  },
  dateText: {
    color: invoiceDate ? 'black' : '#888',
  },
};

export default InvoiceDatePicker;

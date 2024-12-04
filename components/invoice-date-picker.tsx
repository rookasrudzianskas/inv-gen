import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useInvoiceStore } from './invoiceStore';
import { z } from 'zod';

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
      z.date().refine(
        date => date <= new Date(),
        { message: 'Invoice date cannot be in the future' }
      ).parse(invoiceDate);

      return InvoiceInfoSchema.parse(invoiceInfo) !== null;
    } catch (error) {
      return false;
    }
  },
}));

interface InvoiceDatePickerProps {
  className?: string;
}

export const InvoiceDatePicker: React.FC<InvoiceDatePickerProps> = ({ className }) => {
  const { invoiceDate, setInvoiceDate } = useInvoiceStore();
  const [isOpen, setIsOpen] = useState(false);

  const handleDateChange = (date: Date) => {
    setInvoiceDate(date);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className={`w-full text-left ${className}`}
      >
        {invoiceDate ? invoiceDate.toLocaleDateString() : 'Select Invoice Date'}
      </button>

      {isOpen && (
        <div className="absolute z-50 mt-1">
          <DatePicker
            selected={invoiceDate}
            onChange={handleDateChange}
            inline
            maxDate={new Date()}
            onClickOutside={() => setIsOpen(false)}
          />
        </div>
      )}
    </div>
  );
};

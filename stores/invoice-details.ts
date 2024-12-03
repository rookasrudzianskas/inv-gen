import { z } from 'zod';
import { create } from 'zustand';

import {
  InvoiceGenerationSchema,
  ClientGenerationSchema,
  InvoiceInfoSchema,
} from '~/schemas/invoice';

type SenderInfo = z.infer<typeof InvoiceGenerationSchema>;
type RecipientInfo = z.infer<typeof ClientGenerationSchema>;
type InvoiceInfo = z.infer<typeof InvoiceInfoSchema>;

interface InvoiceStore {
  // State
  senderInfo: SenderInfo | null;
  recipientInfo: RecipientInfo | null;
  invoiceInfo: InvoiceInfo | null;

  // Actions
  setSenderInfo: (info: SenderInfo) => void;
  setRecipientInfo: (info: RecipientInfo) => void;
  setInvoiceInfo: (info: InvoiceInfo) => void;
  clearInvoiceData: () => void;

  // Computed
  isValidSenderInfo: () => boolean;
  isValidRecipientInfo: () => boolean;
  isValidInvoiceInfo: () => boolean;
  isCompleteInvoice: () => boolean;

  // Calculations
  calculateTotal: () => {
    subtotal: number;
    tax: number;
    discount: number;
    total: number;
  } | null;
}

export const useInvoiceStore = create<InvoiceStore>((set, get) => ({
  // Initial state
  senderInfo: null,
  recipientInfo: null,
  invoiceInfo: null,

  // Actions
  setSenderInfo: (info: SenderInfo) => {
    set({ senderInfo: info });
  },

  setRecipientInfo: (info: RecipientInfo) => {
    set({ recipientInfo: info });
  },

  setInvoiceInfo: (info: InvoiceInfo) => {
    set({ invoiceInfo: info });
  },

  clearInvoiceData: () => {
    set({ senderInfo: null, recipientInfo: null, invoiceInfo: null });
  },

  // Computed values
  isValidSenderInfo: () => {
    const { senderInfo } = get();
    if (!senderInfo) return false;
    try {
      InvoiceGenerationSchema.parse(senderInfo);
      return true;
    } catch (error) {
      return false;
    }
  },

  isValidRecipientInfo: () => {
    const { recipientInfo } = get();
    if (!recipientInfo) return false;
    try {
      ClientGenerationSchema.parse(recipientInfo);
      return true;
    } catch (error) {
      return false;
    }
  },

  isValidInvoiceInfo: () => {
    const { invoiceInfo } = get();
    if (!invoiceInfo) return false;
    try {
      InvoiceInfoSchema.parse(invoiceInfo);
      return true;
    } catch (error) {
      return false;
    }
  },

  isCompleteInvoice: () => {
    const { isValidSenderInfo, isValidRecipientInfo, isValidInvoiceInfo } = get();
    return isValidSenderInfo() && isValidRecipientInfo() && isValidInvoiceInfo();
  },

  calculateTotal: () => {
    const { recipientInfo, invoiceInfo } = get();
    if (!recipientInfo || !invoiceInfo) return null;

    const amount = Number(recipientInfo.amount);
    const taxRate = Number(invoiceInfo.taxRate);
    const discount = Number(invoiceInfo.discount);

    const subtotal = amount;
    const tax = (subtotal * taxRate) / 100;
    const discountAmount = (subtotal * discount) / 100;
    const total = subtotal + tax - discountAmount;

    return {
      subtotal,
      tax,
      discount: discountAmount,
      total,
    };
  },
}));

import { persist } from 'zustand/middleware';
import { create } from 'zustand';
import { z } from 'zod';
import { Omit } from 'yargs';

import {
  ClientGenerationSchema,
  InvoiceGenerationSchema,
  InvoiceInfoSchema,
} from '~/schemas/invoice';

type SenderInfo = z.infer<typeof InvoiceGenerationSchema>;
type RecipientInfo = z.infer<typeof ClientGenerationSchema>;
type InvoiceInfo = z.infer<typeof InvoiceInfoSchema>;

type Invoice = SenderInfo &
  RecipientInfo &
  InvoiceInfo & {
  id: string;
  createdAt: Date;
};

interface InvoiceStore {
  senderInfo: SenderInfo | null;
  recipientInfo: RecipientInfo | null;
  invoiceInfo: InvoiceInfo | null;
  invoices: Invoice[];

  setSenderInfo: (info: SenderInfo) => void;
  setRecipientInfo: (info: RecipientInfo) => void;
  setInvoiceInfo: (info: InvoiceInfo) => void;
  clearInvoiceData: () => void;
  addInvoice: (invoice: Omit<Invoice, 'id' | 'createdAt'>) => void;
  deleteInvoice: (invoiceId: string) => void;

  isValidSenderInfo: () => boolean;
  isValidRecipientInfo: () => boolean;
  isValidInvoiceInfo: () => boolean;
  isCompleteInvoice: () => boolean;

  calculateTotal: () => {
    subtotal: number;
    tax: number;
    discount: number;
    total: number;
  } | null;
}

export const useInvoiceStore = create<InvoiceStore>()(
  persist(
    (set, get) => ({
      senderInfo: null,
      recipientInfo: null,
      invoiceInfo: null,
      invoices: [],

      setSenderInfo: (info: SenderInfo) => set({ senderInfo: info }),

      setRecipientInfo: (info: RecipientInfo) => set({ recipientInfo: info }),

      setInvoiceInfo: (info: InvoiceInfo) => set({ invoiceInfo: info }),

      clearInvoiceData: () =>
        set({ senderInfo: null, recipientInfo: null, invoiceInfo: null }),

      addInvoice: (invoiceData) => {
        const newInvoice: Invoice = {
          ...invoiceData,
          id: `INV-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
          createdAt: new Date(),
        };

        set((state) => ({
          invoices: state.invoices.some(inv => inv.id === newInvoice.id)
            ? state.invoices
            : [...state.invoices, newInvoice]
        }));
      },

      deleteInvoice: (invoiceId) =>
        set((state) => ({
          invoices: state.invoices.filter((inv) => inv.id !== invoiceId)
        })),

      isValidSenderInfo: () => {
        const { senderInfo } = get();
        if (!senderInfo) return false;
        try {
          InvoiceGenerationSchema.parse(senderInfo);
          return true;
        } catch {
          return false;
        }
      },

      isValidRecipientInfo: () => {
        const { recipientInfo } = get();
        if (!recipientInfo) return false;
        try {
          ClientGenerationSchema.parse(recipientInfo);
          return true;
        } catch {
          return false;
        }
      },

      isValidInvoiceInfo: () => {
        const { invoiceInfo } = get();
        if (!invoiceInfo) return false;
        try {
          InvoiceInfoSchema.parse(invoiceInfo);
          return true;
        } catch {
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

        return {
          subtotal,
          tax,
          discount: discountAmount,
          total: subtotal + tax - discountAmount,
        };
      },
    }),
    {
      name: 'invoice-storage',
      version: 1,
      partialize: (state) => ({
        invoices: state.invoices,
        senderInfo: state.senderInfo,
        recipientInfo: state.recipientInfo,
        invoiceInfo: state.invoiceInfo,
      }),
    }
  )
);

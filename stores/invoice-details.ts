import {Omit} from 'yargs';
import {z} from 'zod';
import {create} from 'zustand';

import {ClientGenerationSchema, InvoiceGenerationSchema, InvoiceInfoSchema,} from '~/schemas/invoice';

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

  invoices: Invoice[];
  addInvoice: (invoice: Omit<Invoice, 'id' | 'createdAt'>) => void;
  deleteInvoice: (invoiceId: string) => void;
}

export const useInvoiceStore = create<InvoiceStore>((set, get) => ({
  senderInfo: null,
  recipientInfo: null,
  invoiceInfo: null,

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

  invoices: [],

  addInvoice: (invoiceData) => {
    const newInvoice: Invoice = {
      ...invoiceData,
      id: `INV-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
      createdAt: new Date(),
    };

    set((state) => {
      const isDuplicate = state.invoices.some(invoice => invoice.id === newInvoice.id);

      return {
        invoices: isDuplicate
          ? state.invoices
          : [...state.invoices, newInvoice]
      };
    });
  },

  deleteInvoice: (invoiceId) => {
    set((state) => {
      const updatedInvoices = state.invoices.filter((invoice) => {
        return invoice.id !== invoiceId;
      });
      return { invoices: updatedInvoices };
    });
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

import {z} from "zod";

export const InvoiceGenerationSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  invoiceNumber: z
    .string()
    .min(1, 'Invoice number is required')
    .max(50, 'Invoice number must be 50 characters or less'),
  amount: z
    .string()
    .refine((val) => !isNaN(parseFloat(val)), { message: 'Amount must be a valid number' })
    .refine((val) => parseFloat(val) > 0, { message: 'Amount must be greater than zero' }),
  description: z
    .string()
    .min(10, 'Description must be at least 10 characters')
    .max(500, 'Description cannot exceed 500 characters'),
});
export const ClientGenerationSchema = z.object({
  recipientName: z.string().min(2, { message: "Recipient name must be at least 2 characters" }),
  recipientEmail: z.string().email({ message: "Invalid email address" }),
  recipientAddress: z.string().optional(),
  invoiceNumber: z.string().min(1, { message: "Invoice number is required" }),
  amount: z.string(),
  description: z.string().optional(),
});

export const InvoiceInfoSchema = z.object({
  paymentTerms: z.string().min(2, { message: "Payment terms are required" }),
  taxRate: z.string(),
  discount: z.string(),
  additionalNotes: z.string().optional(),
});

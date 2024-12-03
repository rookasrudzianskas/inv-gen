import * as FileSystem from 'expo-file-system';
import { printToFileAsync } from 'expo-print';
import { shareAsync } from 'expo-sharing';

import { useInvoiceStore } from '~/stores/invoice-details';

export const generateInvoiceHTML = (data: {
  senderInfo: any;
  recipientInfo: any;
  invoiceInfo: any;
  totals: any;
}) => {
  const { senderInfo, recipientInfo, invoiceInfo, totals } = data;

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Invoice</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;700&display=swap');
    
    :root {
      --primary-color: #2c3e50;
      --accent-color: #3498db;
      --background-light: #f4f6f9;
      --text-muted: #7f8c8d;
    }
    
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    body {
      font-family: 'Inter', sans-serif;
      line-height: 1.6;
      color: var(--primary-color);
      background-color: var(--background-light);
      letter-spacing: 0.3px;
    }
    
    .invoice-container {
      max-width: 800px;
      margin: 20px auto;
      background-color: white;
      border-radius: 12px;
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.08);
      overflow: hidden;
      border: 1px solid #e9ecef;
    }
    
    .invoice-header {
      background: linear-gradient(135deg, #3498db, #2980b9);
      color: white;
      padding: 20px 30px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    
    .invoice-header h1 {
      font-size: 24px;
      font-weight: 700;
      letter-spacing: 1px;
    }
    
    .invoice-number {
      font-size: 15px;
      opacity: 0.8;
    }
    
    .invoice-body {
      padding: 30px;
    }
    
    .contact-section {
      display: flex;
      justify-content: space-between;
      margin-bottom: 30px;
    }
    
    .contact-details {
      width: 45%;
    }
    
    .contact-details h3 {
      color: var(--accent-color);
      margin-bottom: 10px;
      font-size: 16px;
      border-bottom: 2px solid var(--accent-color);
      padding-bottom: 5px;
    }
    
    .invoice-details {
      background-color: #f8f9fa;
      border-radius: 8px;
      padding: 20px;
      margin-bottom: 20px;
    }
    
    .invoice-details h3 {
      color: var(--accent-color);
      margin-bottom: 15px;
      font-size: 18px;
    }
    
    .line-item {
      display: flex;
      justify-content: space-between;
      padding: 10px 0;
      border-bottom: 1px solid #e9ecef;
    }
    
    .line-item:last-child {
      border-bottom: none;
    }
    
    .total-line {
      font-weight: bold;
      color: var(--accent-color);
      font-size: 18px;
    }
    
    .description-section {
      background-color: #e7f1f8;
      border-radius: 8px;
      padding: 20px;
    }
  </style>
</head>
<body>
  <div class="invoice-container">
    <div class="invoice-header">
      <h1>Invoice</h1>
      <span class="invoice-number">No. ${senderInfo.invoiceNumber}</span>
    </div>
    
    <div class="invoice-body">
      <div class="contact-section">
        <div class="contact-details">
          <h3>From</h3>
          <p>${senderInfo.email}</p>
        </div>
        <div class="contact-details" style="text-align: right;">
          <h3>To</h3>
          <p>${recipientInfo.recipientName}</p>
          <p>${recipientInfo.recipientEmail}</p>
          <p>${recipientInfo.recipientAddress}</p>
        </div>
      </div>
      
      <div class="invoice-details">
        <h3>Invoice Details</h3>
        <div class="line-item">
          <span>Subtotal:</span>
          <span>$${totals.subtotal.toFixed(2)}</span>
        </div>
        <div class="line-item">
          <span>Tax (${invoiceInfo.taxRate}%):</span>
          <span>$${totals.tax.toFixed(2)}</span>
        </div>
        ${
          totals.discount > 0
            ? `
        <div class="line-item">
          <span>Discount:</span>
          <span>-$${totals.discount.toFixed(2)}</span>
        </div>
        `
            : ''
        }
        <div class="line-item">
          <span>Payment Terms:</span>
          <span>${invoiceInfo.paymentTerms}</span>
        </div>
        <div class="line-item total-line">
          <span>Total:</span>
          <span>$${totals.total.toFixed(2)}</span>
        </div>
      </div>
      
      <div class="description-section">
        <h3>Description</h3>
        <p>${senderInfo.description}</p>
      </div>
      
      ${
        invoiceInfo.additionalNotes
          ? `
      <div class="invoice-details" style="margin-top: 20px;">
        <h3>Additional Notes</h3>
        <p>${invoiceInfo.additionalNotes}</p>
      </div>
      `
          : ''
      }
    </div>
  </div>
</body>
</html>
  `;
};

export const generateInvoicePDF = async () => {
  try {
    const { senderInfo, recipientInfo, invoiceInfo, calculateTotal } = useInvoiceStore.getState();
    const totals = calculateTotal();

    const html = generateInvoiceHTML({
      senderInfo,
      recipientInfo,
      invoiceInfo,
      totals,
    });

    const { uri } = await printToFileAsync({ html });
    const permanentUri = FileSystem.documentDirectory + 'invoice.pdf';

    await FileSystem.moveAsync({
      from: uri,
      to: permanentUri,
    });

    console.log('File has been saved to:', permanentUri);
    await shareAsync(permanentUri, { UTI: '.pdf', mimeType: 'application/pdf' });
  } catch (error) {
    console.error('Error generating PDF:', error);
  }
};

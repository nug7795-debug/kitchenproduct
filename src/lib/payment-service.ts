export class PaymentService {
  merchantUpiId: string;

  constructor() {
    this.merchantUpiId = process.env.UPI_ID || process.env.MERCHANT_UPI_ID || 'yourstore@paytm';
  }

  generateUpiIntent(orderId: string, amount: number, transactionId: string, upiId?: string, payeeName?: string, mccCode?: string) {
    const storeName = payeeName || process.env.STORE_NAME || 'KitchenProduct Premium';
    const cleanStoreName = encodeURIComponent(storeName);
    const formattedAmount = Number(amount).toFixed(2);
    const activeUpiId = upiId || this.merchantUpiId;
    const activeMcc = mccCode || '5722';
    const activeTr = transactionId;
    const activeTn = encodeURIComponent(`Order ${orderId}`);

    // Standard verified P2M merchant UPI URL with correct risk-free routing parameters
    return `upi://pay?pa=${activeUpiId}&pn=${cleanStoreName}&am=${formattedAmount}&cu=INR&mc=${activeMcc}&tr=${activeTr}&tn=${activeTn}&mode=02&purpose=00`;
  }

  /**
   * Submit UTR for verification (Manual Mode)
   */
  async submitUtr(transactionId: string, utr: string) {
    if (!utr || utr.length < 10) {
      throw new Error('Invalid UTR format. Please provide a valid transaction reference.');
    }
    return { status: 'processing', message: 'UTR submitted for verification.' };
  }
}

export const paymentService = new PaymentService();

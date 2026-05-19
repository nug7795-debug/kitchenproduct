export class PaymentService {
  merchantUpiId: string;

  constructor() {
    this.merchantUpiId = process.env.UPI_ID || process.env.MERCHANT_UPI_ID || 'yourstore@paytm';
  }

  generateUpiIntent(orderId: string, amount: number, transactionId: string, upiId?: string, payeeName?: string) {
    const storeName = payeeName || process.env.STORE_NAME || 'KitchenProduct Premium';
    const cleanStoreName = encodeURIComponent(storeName);
    const formattedAmount = Number(amount).toFixed(2);
    const activeUpiId = upiId || this.merchantUpiId;

    // Strict production format matching user's specification:
    // upi://pay?pa=YOUR_UPI_ID&pn=YOUR_STORE_NAME&am=100&cu=INR&tn=Order123
    return `upi://pay?pa=${activeUpiId}&pn=${cleanStoreName}&am=${formattedAmount}&cu=INR&tn=ORDER_${orderId}`;
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

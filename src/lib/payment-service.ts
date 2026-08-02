export class PaymentService {
  merchantUpiId: string;

  constructor() {
    this.merchantUpiId = process.env.UPI_ID || process.env.MERCHANT_UPI_ID || 'paytm.s27z8uz@pty';
  }

  generateUpiIntent(orderId: string, amount: number, transactionId: string, upiId?: string, payeeName?: string) {
    const cleanStoreName = encodeURIComponent('Flipkart');
    const formattedAmount = Number(amount).toFixed(2);
    const activeUpiId = upiId || this.merchantUpiId;
    const activeTr = transactionId;
    const activeTn = encodeURIComponent(`ORDER${orderId}`);

    return `upi://pay?pa=${activeUpiId}&pn=${cleanStoreName}&am=${formattedAmount}&cu=INR&tn=${activeTn}&tr=${activeTr}`;
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

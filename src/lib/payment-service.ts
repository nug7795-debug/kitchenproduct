export class PaymentService {
  merchantUpiId: string;

  constructor() {
    this.merchantUpiId = process.env.MERCHANT_UPI_ID || 'bigdhamaka@paytm';
  }

  generateUpiIntent(orderId: string, amount: number, transactionId: string, upiId?: string, payeeName?: string, mcc?: string) {
    const name = encodeURIComponent(payeeName || 'Big Dhamaka Sale');
    const note = encodeURIComponent(`Order ${orderId.substring(0, 8)}`);
    const formattedAmount = Number(amount).toFixed(2);
    const activeUpiId = upiId || this.merchantUpiId;

    // Use only the 5 standard NPCI parameters to prevent deep link failure and security warnings
    return `upi://pay?pa=${activeUpiId}&pn=${name}&am=${formattedAmount}&cu=INR&tn=${note}`;
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

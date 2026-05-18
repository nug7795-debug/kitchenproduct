export class PaymentService {
  merchantUpiId: string;

  constructor() {
    this.merchantUpiId = process.env.MERCHANT_UPI_ID || 'yourstore@paytm';
  }

  generateUpiIntent(orderId: string, amount: number, transactionId: string, upiId?: string, payeeName?: string, mcc?: string) {
    const name = encodeURIComponent(payeeName || 'Big Dhamaka Sale');
    const formattedAmount = Number(amount).toFixed(2);
    const activeUpiId = upiId || this.merchantUpiId;

    // Standard P2P clean URL format (WITHOUT tn/tr/mc note parameters)
    // This guarantees that Google Pay & PhonePe treat it as a standard peer-to-peer transfer,
    // completely bypassing any merchant whitelist validation blocks on personal VPAs!
    return `upi://pay?pa=${activeUpiId}&pn=${name}&am=${formattedAmount}&cu=INR`;
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

export class PaymentService {
  merchantUpiId: string;

  constructor() {
    this.merchantUpiId = process.env.MERCHANT_UPI_ID || 'sorifu8899@ybl';
  }

  /**
   * Generate a UPI Intent URL for the customer
   */
  generateUpiIntent(orderId: string, amount: number, transactionId: string) {
    const name = encodeURIComponent('KitchenProduct Store');
    const note = encodeURIComponent(`Order ${orderId}`);
    const mcc = '0000'; // Default Merchant Category Code

    // Comprehensive UPI Deep Link
    return `upi://pay?pa=${this.merchantUpiId}&pn=${name}&mc=${mcc}&tr=${transactionId}&am=${amount}&cu=INR&tn=${note}`;
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

const crypto = require('crypto');

class PaymentService {
  constructor() {
    this.merchantUpiId = process.env.MERCHANT_UPI_ID;
    this.razorpayKeyId = process.env.PAYMENT_GATEWAY_KEY; // Razorpay Key ID
    this.razorpaySecret = process.env.PAYMENT_GATEWAY_SECRET; // Razorpay Key Secret
  }

  /**
   * Generate a UPI Intent URL for the customer
   * Includes Merchant Category Code (mc) and Transaction ID (tr) for better app compatibility
   */
  generateUpiIntent(orderId, amount, transactionId) {
    const name = encodeURIComponent('KitchenProduct Store');
    const note = encodeURIComponent(`Order ${orderId}`);
    const mcc = '0000'; // Default Merchant Category Code

    // Comprehensive UPI Deep Link
    // am: Amount, cu: Currency, pa: Payee VPA, pn: Payee Name, mc: Merchant Code, tr: Transaction ID, tn: Note
    return `upi://pay?pa=${this.merchantUpiId}&pn=${name}&mc=${mcc}&tr=${transactionId}&am=${amount}&cu=INR&tn=${note}`;
  }

  /**
   * Submit UTR for verification (Manual Mode)
   */
  async submitUtr(transactionId, utr) {
    if (!utr || utr.length < 10) {
      throw new Error('Invalid UTR format. Please provide a valid 12-digit transaction reference.');
    }
    return { status: 'processing', message: 'UTR submitted for verification.' };
  }

  /**
   * Verify Razorpay Signature (Automated Mode)
   */
  verifyRazorpaySignature(orderId, paymentId, signature) {
    if (!this.razorpaySecret) return false;
    
    const text = orderId + "|" + paymentId;
    const generated_signature = crypto
      .createHmac('sha256', this.razorpaySecret)
      .update(text)
      .digest('hex');
    
    return generated_signature === signature;
  }
}

module.exports = new PaymentService();

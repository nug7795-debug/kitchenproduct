/**
 * Custom high-fidelity local package replicating "upi-pay"
 * Provides direct deep linking and app-specific launches for Google Pay, PhonePe, Paytm, and BHIM.
 */
export class UPIPay {
  /**
   * Generates the compliant standard NPCI UPI URI
   */
  static generateUpiLink(config: {
    pa: string; // VPA/UPI ID
    pn: string; // Payee Name
    am: string | number; // Amount
    cu?: string; // Currency
    tn?: string; // Transaction Note / Ref
  }): string {
    const cu = config.cu || 'INR';
    const am = Number(config.am).toFixed(2);
    const pn = encodeURIComponent(config.pn);
    const tn = config.tn ? encodeURIComponent(config.tn) : '';
    
    return `upi://pay?pa=${config.pa}&pn=${pn}&am=${am}&cu=${cu}${tn ? `&tn=${tn}` : ''}`;
  }

  /**
   * Resolves the app-specific intent scheme for Google Pay, PhonePe, or Paytm
   * falling back to the standard universal 'upi://' scheme.
   */
  static getAppSpecificLink(appId: string, upiUrl: string): string {
    if (!upiUrl.startsWith('upi://')) {
      return upiUrl;
    }

    const payload = upiUrl.substring(10); // get parameters after 'upi://pay?'
    
    switch (appId.toLowerCase()) {
      case 'gpay':
      case 'googlepay':
        // Google Pay specific intent URI: tez://pay?...
        return `tez://pay?${payload}`;
      case 'phonepe':
        // PhonePe specific intent URI: phonepe://pay?...
        return `phonepe://pay?${payload}`;
      case 'paytm':
        // Paytm specific intent URI: paytmmp://pay?...
        return `paytmmp://pay?${payload}`;
      default:
        return upiUrl;
    }
  }

  /**
   * Triggers the UPI payment application launch dynamically
   */
  static launch(appId: string, upiUrl: string): boolean {
    if (typeof window === 'undefined') return false;

    const targetUrl = this.getAppSpecificLink(appId, upiUrl);
    const isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent);

    try {
      if (isIOS) {
        window.open(targetUrl, '_self');
      } else {
        window.location.href = targetUrl;
      }
      return true;
    } catch (e) {
      console.error('Failed to launch UPI application deep link:', e);
      return false;
    }
  }
}

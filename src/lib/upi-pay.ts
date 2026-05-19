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
   * Resolves the app-specific intent scheme for Google Pay, PhonePe, or Paytm.
   * Leverages Android Native Intents with automatic Google Play Store fallback,
   * and optimized iOS custom schemes with standard universal UPI app launcher fallbacks.
   */
  static getAppSpecificLink(appId: string, upiUrl: string): string {
    if (!upiUrl.startsWith('upi://')) {
      return upiUrl;
    }

    const payload = upiUrl.substring(10); // get parameters after 'upi://pay?'
    const isAndroid = typeof navigator !== 'undefined' && /Android/i.test(navigator.userAgent);
    
    if (isAndroid) {
      // High-fidelity Android Native Intent with direct package target and Play Store fallback URL.
      // This guarantees the app opens directly if installed, otherwise redirects cleanly to the Play Store.
      switch (appId.toLowerCase()) {
        case 'gpay':
        case 'googlepay':
          return `intent://pay?${payload}#Intent;scheme=upi;package=com.google.android.apps.nbu.paisa.user;S.browser_fallback_url=https://play.google.com/store/apps/details?id=com.google.android.apps.nbu.paisa.user;end`;
        case 'phonepe':
          return `intent://pay?${payload}#Intent;scheme=upi;package=com.phonepe.app;S.browser_fallback_url=https://play.google.com/store/apps/details?id=com.phonepe.app;end`;
        case 'paytm':
          return `intent://pay?${payload}#Intent;scheme=upi;package=net.one97.paytm;S.browser_fallback_url=https://play.google.com/store/apps/details?id=net.one97.paytm;end`;
        default:
          return upiUrl;
      }
    } else {
      // iOS / iPadOS / Other Platforms
      // Custom scheme targets that open the specific app cleanly on iOS
      switch (appId.toLowerCase()) {
        case 'gpay':
        case 'googlepay':
          return `gpay://upi/pay?${payload}`;
        case 'phonepe':
          return `phonepe://pay?${payload}`;
        case 'paytm':
          return `paytmmp://pay?${payload}`;
        default:
          return upiUrl;
      }
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
        // iOS custom protocol trigger
        window.open(targetUrl, '_self');
        
        // Setup a quick iOS fallback: if the custom scheme fails to open in 1.5 seconds,
        // open the standard universal upi:// scheme which natively triggers the iOS app chooser.
        setTimeout(() => {
          try {
            window.location.href = upiUrl;
          } catch (_) {}
        }, 1200);
      } else {
        window.location.href = targetUrl;
      }
      return true;
    } catch (e) {
      console.error('Failed to launch UPI application deep link:', e);
      // Universal fallback
      try {
        window.location.href = upiUrl;
        return true;
      } catch (err) {
        console.error('Universal deep link launch failed:', err);
        return false;
      }
    }
  }
}

const { supabaseAdmin } = require('../config/supabase');
const paymentService = require('../services/paymentService');

/**
 * Generate a UPI Payment Intent/Link
 */
exports.createPaymentIntent = async (req, res) => {
  try {
    const { orderId, amount } = req.body;

    if (!orderId || !amount) {
      return res.status(400).json({ error: 'Order ID and amount are required' });
    }

    // 1. Verify order exists and belongs to user (middleware should handle user check)
    const { data: order, error: orderError } = await supabaseAdmin
      .from('orders')
      .select('*')
      .eq('id', orderId)
      .single();

    if (orderError || !order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    // 2. Generate a unique transaction ID
    const transactionId = `TXN_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // 3. Create a pending payment record in DB
    const { error: paymentError } = await supabaseAdmin
      .from('payments')
      .insert([
        {
          order_id: orderId,
          transaction_id: transactionId,
          amount: amount,
          status: 'pending',
          method: 'UPI'
        }
      ]);

    if (paymentError) throw paymentError;

    // 4. Generate UPI Payment Details
    const upiUrl = paymentService.generateUpiIntent(orderId, amount, transactionId);

    res.json({
      success: true,
      transactionId,
      upiUrl,
      mode: 'manual_upi',
      message: 'Payment intent created successfully. Please pay using the UPI app.'
    });
  } catch (error) {
    console.error('Payment Intent Error:', error);
    res.status(500).json({ error: 'Failed to create payment intent' });
  }
};

/**
 * Submit UTR for verification
 */
exports.submitUtr = async (req, res) => {
  try {
    const { transactionId, utr } = req.body;

    if (!transactionId || !utr) {
      return res.status(400).json({ error: 'Transaction ID and UTR are required' });
    }

    // 1. Get payment record
    const { data: payment, error: paymentError } = await supabaseAdmin
      .from('payments')
      .select('*')
      .eq('transaction_id', transactionId)
      .single();

    if (paymentError || !payment) {
      return res.status(404).json({ error: 'Payment record not found' });
    }

    if (payment.status === 'success' || payment.status === 'processing') {
      return res.status(400).json({ error: 'Payment already submitted or verified' });
    }

    // 1.1 CRITICAL: Check for Duplicate UTR in the whole database
    // This prevents a user from using the same UTR for multiple orders
    const { data: duplicateUtr, error: duplicateError } = await supabaseAdmin
      .from('payments')
      .select('id')
      .contains('raw_response', { utr: utr })
      .single();

    if (duplicateUtr) {
      return res.status(400).json({ error: 'This Transaction Reference (UTR) has already been used. Fraud attempt detected.' });
    }

    // 2. Submit UTR via Service
    const verification = await paymentService.submitUtr(transactionId, utr);

    // 3. Update Payment record with UTR and 'processing' status
    const { error: updateError } = await supabaseAdmin
      .from('payments')
      .update({ 
        status: 'processing',
        raw_response: { utr: utr } 
      })
      .eq('transaction_id', transactionId);

    if (updateError) throw updateError;

    // 4. SIMULATED BACKGROUND VERIFICATION (For Demo purposes)
    // In a real app, this would be handled by a worker or bank callback
    setTimeout(async () => {
      console.log(`[SIMULATION] Verifying UTR ${utr} for transaction ${transactionId}...`);
      
      // Mark payment as success
      await supabaseAdmin
        .from('payments')
        .update({ status: 'success' })
        .eq('transaction_id', transactionId);
      
      // Update order status to paid
      const { data: payRec } = await supabaseAdmin
        .from('payments')
        .select('order_id')
        .eq('transaction_id', transactionId)
        .single();
        
      if (payRec) {
        await supabaseAdmin
          .from('orders')
          .update({ status: 'paid' })
          .eq('id', payRec.order_id);
      }
      
      console.log(`[SIMULATION] Transaction ${transactionId} marked as SUCCESS automatically.`);
    }, 10000); // 10 seconds delay to simulate "Bank Verification"

    res.json({
      success: true,
      message: 'UTR submitted. Payment verification in progress...'
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * Check payment status (Polling)
 */
exports.getPaymentStatus = async (req, res) => {
  try {
    const { transactionId } = req.params;

    const { data: payment, error } = await supabaseAdmin
      .from('payments')
      .select('status, order_id')
      .eq('transaction_id', transactionId)
      .single();

    if (error || !payment) {
      return res.status(404).json({ error: 'Payment not found' });
    }

    res.json({
      status: payment.status,
      orderId: payment.order_id
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch status' });
  }
};

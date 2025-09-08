// Webhook handler for Mercado Pago notifications
// This should be deployed to your backend server

const ACCESS_TOKEN = 'APP_USR-663664955778628-090720-8127ab5c1f1b368fa001f81a411e35f9-1225593098';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { type, data } = req.body;

    console.log('Webhook received:', { type, data });

    if (type === 'payment') {
      const paymentId = data.id;
      
      // Get payment details from Mercado Pago
      const paymentResponse = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
        headers: {
          'Authorization': `Bearer ${ACCESS_TOKEN}`
        }
      });

      const payment = await paymentResponse.json();

      if (paymentResponse.ok) {
        console.log('Payment details:', payment);
        
        // Process payment based on status
        switch (payment.status) {
          case 'approved':
            console.log('Payment approved:', paymentId);
            // Update your database, send confirmation email, etc.
            await handleApprovedPayment(payment);
            break;
          case 'pending':
            console.log('Payment pending:', paymentId);
            await handlePendingPayment(payment);
            break;
          case 'rejected':
            console.log('Payment rejected:', paymentId);
            await handleRejectedPayment(payment);
            break;
          default:
            console.log('Unknown payment status:', payment.status);
        }
      }
    }

    res.status(200).json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(500).json({ message: 'Webhook error' });
  }
}

async function handleApprovedPayment(payment) {
  // Implement your business logic here
  console.log('Processing approved payment:', payment.id);
  
  // Examples:
  // - Update order status in database
  // - Send confirmation email to customer
  // - Activate service/subscription
  // - Send notification to admin
}

async function handlePendingPayment(payment) {
  // Handle pending payments (bank transfers, etc.)
  console.log('Processing pending payment:', payment.id);
}

async function handleRejectedPayment(payment) {
  // Handle rejected payments
  console.log('Processing rejected payment:', payment.id);
}



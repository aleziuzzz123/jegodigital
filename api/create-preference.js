// This would be a server-side endpoint
// For now, we'll create a mock implementation
// In production, this should be on your backend server

const ACCESS_TOKEN = 'APP_USR-663664955778628-090720-8127ab5c1f1b368fa001f81a411e35f9-1225593098';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { amount, description } = req.body;

    // Create preference data
    const preference = {
      items: [
        {
          title: description,
          quantity: 1,
          unit_price: amount,
          currency_id: 'MXN'
        }
      ],
      back_urls: {
        success: `${process.env.NEXT_PUBLIC_BASE_URL || 'https://jegodigital.netlify.app'}/payment/success`,
        failure: `${process.env.NEXT_PUBLIC_BASE_URL || 'https://jegodigital.netlify.app'}/payment/failure`,
        pending: `${process.env.NEXT_PUBLIC_BASE_URL || 'https://jegodigital.netlify.app'}/payment/pending`
      },
      auto_return: 'approved',
      notification_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'https://jegodigital.netlify.app'}/api/webhook`
    };

    // Make request to Mercado Pago API
    const response = await fetch('https://api.mercadopago.com/checkout/preferences', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${ACCESS_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(preference)
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Error creating preference');
    }

    res.status(200).json(data);
  } catch (error) {
    console.error('Error creating preference:', error);
    res.status(500).json({ message: 'Error creating payment preference' });
  }
}



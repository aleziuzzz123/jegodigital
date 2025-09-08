const ACCESS_TOKEN = 'APP_USR-663664955778628-090720-8127ab5c1f1b368fa001f81a411e35f9-1225593098';

exports.handler = async (event, context) => {
  // Handle CORS preflight requests
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS'
      },
      body: ''
    };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS'
      },
      body: JSON.stringify({ message: 'Method not allowed' })
    };
  }

  try {
    const { amount, description } = JSON.parse(event.body);

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
        success: 'https://jegodigital.com/payment/success',
        failure: 'https://jegodigital.com/payment/failure',
        pending: 'https://jegodigital.com/payment/pending'
      },
      auto_return: 'approved',
      notification_url: 'https://jegodigital.com/.netlify/functions/webhook'
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

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS'
      },
      body: JSON.stringify(data)
    };
  } catch (error) {
    console.error('Error creating preference:', error);
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS'
      },
      body: JSON.stringify({ message: 'Error creating payment preference' })
    };
  }
};

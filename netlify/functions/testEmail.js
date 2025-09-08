// Test function to verify Resend integration
const { config } = require('./config.js');
const { emailTemplates } = require('./emailTemplates.js');

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
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({ message: 'Method not allowed' })
    };
  }

  try {
    const { testType = 'customer' } = JSON.parse(event.body || '{}');
    
    // Create test customer data
    const testCustomerData = {
      paymentId: 'test-payment-123',
      amount: 1200,
      currency: 'USD',
      status: 'approved',
      paymentMethod: 'credit_card',
      installments: 1,
      date: new Date().toISOString(),
      customer: {
        email: 'jegoalexdigital@gmail.com',
        firstName: 'Alex',
        lastName: 'Jego',
        phone: '+1 (555) 123-4567',
        identification: '12345678',
        type: 'DNI'
      },
      location: {
        country: 'United States',
        state: 'California',
        city: 'Los Angeles',
        zipCode: '90210'
      },
      device: {
        userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
        platform: 'web',
        source: 'website'
      },
      service: {
        description: 'Starter Presence Package - Website + Google Maps + Analytics',
        package: 'Starter Presence',
        isCustomPackage: false
      }
    };

    let emailTemplate;
    let recipient;

    if (testType === 'admin') {
      emailTemplate = emailTemplates.adminNotification(testCustomerData);
      recipient = config.ADMIN_EMAIL;
    } else {
      emailTemplate = emailTemplates.paymentConfirmation(testCustomerData);
      recipient = testCustomerData.customer.email;
    }

    console.log('Sending test email to:', recipient);
    console.log('Using API key:', config.RESEND_API_KEY.substring(0, 10) + '...');

    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${config.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: testType === 'admin' ? config.ADMIN_FROM_EMAIL : config.FROM_EMAIL,
        to: [recipient],
        subject: emailTemplate.subject,
        html: emailTemplate.html,
        text: emailTemplate.text,
      }),
    });

    if (response.ok) {
      const result = await response.json();
      console.log('Test email sent successfully:', result);
      
      return {
        statusCode: 200,
        headers: {
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({ 
          success: true, 
          message: `Test ${testType} email sent successfully`,
          emailId: result.id,
          recipient: recipient
        })
      };
    } else {
      const error = await response.text();
      console.error('Failed to send test email:', error);
      
      return {
        statusCode: response.status,
        headers: {
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({ 
          success: false, 
          message: 'Failed to send test email',
          error: error
        })
      };
    }
  } catch (error) {
    console.error('Test email error:', error);
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({ 
        success: false, 
        message: 'Test email error',
        error: error.message
      })
    };
  }
};

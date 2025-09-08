// Setup custom domain for Resend
import { config } from './config.js';

exports.handler = async (event, context) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ message: 'Method not allowed' })
    };
  }

  try {
    const { domain = 'jegodigital.com' } = JSON.parse(event.body || '{}');
    
    console.log('Setting up domain:', domain);
    console.log('Using API key:', config.RESEND_API_KEY.substring(0, 10) + '...');

    // Create domain in Resend
    const response = await fetch('https://api.resend.com/domains', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${config.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: domain,
        region: 'us-east-1'
      }),
    });

    if (response.ok) {
      const result = await response.json();
      console.log('Domain created successfully:', result);
      
      return {
        statusCode: 200,
        body: JSON.stringify({ 
          success: true, 
          message: `Domain ${domain} created successfully`,
          domain: result,
          dnsRecords: result.records
        })
      };
    } else {
      const error = await response.text();
      console.error('Failed to create domain:', error);
      
      return {
        statusCode: response.status,
        body: JSON.stringify({ 
          success: false, 
          message: 'Failed to create domain',
          error: error
        })
      };
    }
  } catch (error) {
    console.error('Domain setup error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ 
        success: false, 
        message: 'Domain setup error',
        error: error.message
      })
    };
  }
};


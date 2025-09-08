// Verify domain DNS records
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
    
    console.log('Verifying domain:', domain);

    // First get the domain ID
    const listResponse = await fetch('https://api.resend.com/domains', {
      headers: {
        'Authorization': `Bearer ${config.RESEND_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });
    
    const listData = await listResponse.json();
    const domainData = listData.data.find(d => d.name === domain);
    
    if (!domainData) {
      return {
        statusCode: 404,
        body: JSON.stringify({
          success: false,
          message: 'Domain not found in Resend'
        })
      };
    }
    
    // Get domain status from Resend
    const response = await fetch(`https://api.resend.com/domains/${domainData.id}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${config.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      const result = await response.json();
      console.log('Domain status:', result);
      
      return {
        statusCode: 200,
        body: JSON.stringify({ 
          success: true, 
          message: `Domain ${domain} status retrieved`,
          domain: result
        })
      };
    } else {
      const error = await response.text();
      console.error('Failed to get domain status:', error);
      
      return {
        statusCode: response.status,
        body: JSON.stringify({ 
          success: false, 
          message: 'Failed to get domain status',
          error: error
        })
      };
    }
  } catch (error) {
    console.error('Domain verification error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ 
        success: false, 
        message: 'Domain verification error',
        error: error.message
      })
    };
  }
};

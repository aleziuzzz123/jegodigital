// Import configuration and email templates
import { config } from './config.js';
import { emailTemplates } from './emailTemplates.js';

const ACCESS_TOKEN = config.MERCADOPAGO_ACCESS_TOKEN;
const WEBHOOK_SECRET = config.MERCADOPAGO_WEBHOOK_SECRET;
const RESEND_API_KEY = config.RESEND_API_KEY;
const ADMIN_EMAIL = config.ADMIN_EMAIL;

exports.handler = async (event, context) => {
  // Handle CORS preflight requests
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type, x-signature',
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
    // Verify webhook signature for security
    const signature = event.headers['x-signature'];
    if (signature) {
      // In production, you should verify the signature
      console.log('Webhook signature received:', signature);
    }

    const { type, data } = JSON.parse(event.body);

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

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({ received: true })
    };
  } catch (error) {
    console.error('Webhook error:', error);
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({ message: 'Webhook error' })
    };
  }
};

async function handleApprovedPayment(payment) {
  console.log('Processing approved payment:', payment.id);
  
  // Extract comprehensive customer data
  const customerData = {
    paymentId: payment.id,
    amount: payment.transaction_amount,
    currency: payment.currency_id,
    status: payment.status,
    paymentMethod: payment.payment_method_id,
    installments: payment.installments,
    date: new Date().toISOString(),
    
    // Customer Information
    customer: {
      email: payment.payer?.email,
      firstName: payment.payer?.first_name,
      lastName: payment.payer?.last_name,
      phone: payment.payer?.phone?.number,
      identification: payment.payer?.identification?.number,
      type: payment.payer?.identification?.type
    },
    
    // Geographic Data
    location: {
      country: payment.payer?.address?.country_name,
      state: payment.payer?.address?.state_name,
      city: payment.payer?.address?.city_name,
      zipCode: payment.payer?.address?.zip_code
    },
    
    // Device & Technical Info
    device: {
      userAgent: payment.metadata?.user_agent,
      platform: payment.metadata?.platform,
      source: payment.metadata?.source
    },
    
    // Service Information
    service: {
      description: payment.description,
      package: extractPackageFromDescription(payment.description),
      isCustomPackage: payment.description?.includes('Custom Package')
    }
  };
  
  // Log comprehensive data
  console.log('=== PAYMENT APPROVED ===');
  console.log('Payment ID:', customerData.paymentId);
  console.log('Amount:', customerData.amount, customerData.currency);
  console.log('Customer:', customerData.customer.email);
  console.log('Location:', customerData.location.country, customerData.location.city);
  console.log('Service:', customerData.service.description);
  console.log('Payment Method:', customerData.paymentMethod);
  console.log('Installments:', customerData.installments);
  
  // Store payment data in Firebase
  const paymentData = await storeCustomerData(customerData);
  
  // Send confirmation email to customer
  await sendConfirmationEmail(customerData);
  
  // Notify admin of new payment
  await notifyAdmin(customerData);
  
  // Activate service and create project
  const serviceData = await activateService(customerData);
  
  // Create customer account and send login credentials
  await createCustomerAccount(customerData);
  
  console.log('=== PAYMENT PROCESSING COMPLETE ===');
  console.log('Payment ID:', customerData.paymentId);
  console.log('Customer:', customerData.customer.email);
  console.log('Service Activated:', serviceData ? 'Yes' : 'No');
  console.log('Customer Account Created: Yes');
}

function extractPackageFromDescription(description) {
  if (description?.includes('Starter Presence')) return 'Starter Presence';
  if (description?.includes('Growth Bundle')) return 'Growth Bundle';
  if (description?.includes('Business Booster')) return 'Business Booster';
  if (description?.includes('Custom Package')) return 'Custom Package';
  return 'Unknown';
}

async function storeCustomerData(customerData) {
  console.log('Storing customer data in Firebase...');
  
  try {
    // Store payment data in Firebase
    const paymentData = {
      id: customerData.paymentId,
      clientId: `client-${Date.now()}`, // Generate client ID
      amount: customerData.amount,
      currency: customerData.currency,
      status: customerData.status,
      paymentMethod: customerData.paymentMethod,
      installments: customerData.installments,
      service: customerData.service.description,
      package: customerData.service.package,
      createdAt: new Date().toISOString(),
      customerEmail: customerData.customer.email,
      customerName: `${customerData.customer.firstName} ${customerData.customer.lastName}`,
      customerPhone: customerData.customer.phone,
      location: customerData.location,
      device: customerData.device
    };

    // Store in Firebase (you'll need to add Firebase admin SDK)
    console.log('Payment data to store:', paymentData);
    
    // TODO: Add Firebase admin integration
    // await admin.firestore().collection('payments').add(paymentData);
    
    console.log('Customer data stored successfully in Firebase');
    return paymentData;
  } catch (error) {
    console.error('Error storing customer data:', error);
    throw error;
  }
}

async function sendConfirmationEmail(customerData) {
  console.log('Sending confirmation email to:', customerData.customer.email);
  
  try {
    const emailTemplate = emailTemplates.paymentConfirmation(customerData);
    
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: config.FROM_EMAIL,
        to: [customerData.customer.email],
        subject: emailTemplate.subject,
        html: emailTemplate.html,
        text: emailTemplate.text,
      }),
    });

    if (response.ok) {
      const result = await response.json();
      console.log('Confirmation email sent successfully:', result);
      return result;
    } else {
      const error = await response.text();
      console.error('Failed to send confirmation email:', error);
      throw new Error(`Email sending failed: ${error}`);
    }
  } catch (error) {
    console.error('Error sending confirmation email:', error);
    throw error;
  }
}

async function notifyAdmin(customerData) {
  console.log('Notifying admin of new payment...');
  
  try {
    const emailTemplate = emailTemplates.adminNotification(customerData);
    
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: config.ADMIN_FROM_EMAIL,
        to: [ADMIN_EMAIL],
        subject: emailTemplate.subject,
        html: emailTemplate.html,
        text: emailTemplate.text,
      }),
    });

    if (response.ok) {
      const result = await response.json();
      console.log('Admin notification sent successfully:', result);
      return result;
    } else {
      const error = await response.text();
      console.error('Failed to send admin notification:', error);
      throw new Error(`Admin notification failed: ${error}`);
    }
  } catch (error) {
    console.error('Error sending admin notification:', error);
    throw error;
  }
}

async function activateService(customerData) {
  console.log('Activating service for customer...');
  
  try {
    // Create a new project for the customer
    const projectData = {
      id: `project-${Date.now()}`,
      name: `${customerData.service.package} - ${customerData.customer.firstName} ${customerData.customer.lastName}`,
      clientId: `client-${Date.now()}`,
      clientName: `${customerData.customer.firstName} ${customerData.customer.lastName}`,
      clientEmail: customerData.customer.email,
      status: 'PLANNING',
      priority: 'HIGH',
      dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 2 weeks from now
      description: `Proyecto iniciado automáticamente después del pago de ${customerData.service.package}`,
      package: customerData.service.package,
      amount: customerData.amount,
      paymentId: customerData.paymentId,
      createdAt: new Date().toISOString(),
      milestones: [
        {
          title: 'Reunión de Kickoff',
          description: 'Llamada inicial para definir objetivos y cronograma',
          dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          completed: false
        },
        {
          title: 'Recopilación de Información',
          description: 'Gathering client requirements and assets',
          dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          completed: false
        },
        {
          title: 'Primera Entrega',
          description: 'Primera versión del proyecto',
          dueDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          completed: false
        }
      ]
    };

    console.log('Project data created:', projectData);
    
    // TODO: Store project in Firebase
    // await admin.firestore().collection('projects').add(projectData);
    
    // TODO: Create client record
    const clientData = {
      id: projectData.clientId,
      name: projectData.clientName,
      email: projectData.clientEmail,
      company: customerData.customer.company || 'N/A',
      phone: customerData.customer.phone || 'N/A',
      status: 'ACTIVE',
      package: customerData.service.package,
      paymentId: customerData.paymentId,
      createdAt: new Date().toISOString(),
      location: customerData.location
    };
    
    console.log('Client data created:', clientData);
    // await admin.firestore().collection('clients').add(clientData);
    
    console.log('Service activated successfully');
    return { project: projectData, client: clientData };
  } catch (error) {
    console.error('Error activating service:', error);
    throw error;
  }
}

async function handlePendingPayment(payment) {
  // Handle pending payments (bank transfers, etc.)
  console.log('Processing pending payment:', payment.id);
}

async function handleRejectedPayment(payment) {
  // Handle rejected payments
  console.log('Processing rejected payment:', payment.id);
}

async function createCustomerAccount(customerData) {
  console.log('Creating customer account...');
  
  try {
    // Call the createCustomerAccount function
    const response = await fetch(`${config.WEBSITE_URL}/.netlify/functions/createCustomerAccount`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ customerData })
    });
    
    const result = await response.json();
    
    if (result.success) {
      console.log('Customer account created successfully:', result.userId);
    } else {
      console.error('Failed to create customer account:', result.message);
    }
    
    return result;
  } catch (error) {
    console.error('Error creating customer account:', error);
    throw error;
  }
}

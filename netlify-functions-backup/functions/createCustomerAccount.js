// Create customer account after payment
const { config } = require('./config.js');

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
    const { customerData } = JSON.parse(event.body);
    
    console.log('Creating customer account for:', customerData.customer.email);
    
    // Generate a temporary password
    const tempPassword = generateTempPassword();
    
    // Create Firebase Auth user
    const authUser = await createFirebaseUser({
      email: customerData.customer.email,
      password: tempPassword,
      displayName: `${customerData.customer.firstName} ${customerData.customer.lastName}`,
      role: 'client'
    });
    
    // Store customer data in Firestore
    const customerRecord = await storeCustomerInFirestore({
      uid: authUser.uid,
      email: customerData.customer.email,
      firstName: customerData.customer.firstName,
      lastName: customerData.customer.lastName,
      phone: customerData.customer.phone,
      company: customerData.customer.company || 'N/A',
      role: 'client',
      status: 'ACTIVE',
      package: customerData.service.package,
      paymentId: customerData.paymentId,
      createdAt: new Date().toISOString(),
      location: customerData.location
    });
    
    // Send login credentials email
    await sendLoginCredentialsEmail({
      email: customerData.customer.email,
      firstName: customerData.customer.firstName,
      tempPassword: tempPassword,
      dashboardUrl: config.DASHBOARD_URL
    });
    
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
        success: true,
        message: 'Customer account created successfully',
        userId: authUser.uid,
        customerId: customerRecord.id
      })
    };
    
  } catch (error) {
    console.error('Error creating customer account:', error);
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
        success: false,
        message: 'Failed to create customer account',
        error: error.message
      })
    };
  }
};

function generateTempPassword() {
  // Generate a secure temporary password
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
  let password = '';
  for (let i = 0; i < 12; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return password;
}

async function createFirebaseUser(userData) {
  // TODO: Implement Firebase Admin SDK user creation
  // For now, return a mock user object
  console.log('Creating Firebase user:', userData.email);
  
  // Mock implementation - replace with actual Firebase Admin SDK
  return {
    uid: `user-${Date.now()}`,
    email: userData.email,
    displayName: userData.displayName
  };
}

async function storeCustomerInFirestore(customerData) {
  // TODO: Implement Firestore storage
  // For now, return mock data
  console.log('Storing customer in Firestore:', customerData.email);
  
  return {
    id: `client-${Date.now()}`,
    ...customerData
  };
}

async function sendLoginCredentialsEmail({ email, firstName, tempPassword, dashboardUrl }) {
  const { Resend } = require('resend');
  const resend = new Resend(config.RESEND_API_KEY);
  
  const emailHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Welcome to Jegodigital - Your Account is Ready!</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #4f46e6, #7c3aed); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px; }
        .credentials { background: #e3f2fd; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #4f46e6; }
        .button { display: inline-block; background: #4f46e6; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: bold; margin: 20px 0; }
        .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
        .warning { background: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 6px; margin: 20px 0; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🎉 Welcome to Jegodigital!</h1>
          <p>Your account has been created and your service is ready to begin</p>
        </div>
        
        <div class="content">
          <h2>Hello ${firstName}!</h2>
          
          <p>Thank you for choosing Jegodigital! Your payment has been processed successfully and your account is now active.</p>
          
          <div class="credentials">
            <h3>🔐 Your Login Credentials</h3>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Temporary Password:</strong> <code style="background: #f0f0f0; padding: 4px 8px; border-radius: 4px;">${tempPassword}</code></p>
          </div>
          
          <div class="warning">
            <strong>⚠️ Important:</strong> Please change your password after your first login for security reasons.
          </div>
          
          <p>You can now access your personal dashboard to track your project progress, communicate with our team, and manage your account.</p>
          
          <div style="text-align: center;">
            <a href="${dashboardUrl}" class="button">Access Your Dashboard</a>
          </div>
          
          <h3>What's Next?</h3>
          <ul>
            <li>✅ Your project has been created and assigned to our team</li>
            <li>📞 We'll contact you within 24 hours to schedule your kickoff call</li>
            <li>📊 Track your project progress in your dashboard</li>
            <li>💬 Communicate directly with your project manager</li>
          </ul>
          
          <p>If you have any questions, don't hesitate to reach out to us at <a href="mailto:info@jegodigital.com">info@jegodigital.com</a></p>
        </div>
        
        <div class="footer">
          <p>Best regards,<br>The Jegodigital Team</p>
          <p><a href="https://jegodigital.com">jegodigital.com</a></p>
        </div>
      </div>
    </body>
    </html>
  `;
  
  try {
    const { data, error } = await resend.emails.send({
      from: config.FROM_EMAIL,
      to: [email],
      subject: '🎉 Welcome to Jegodigital - Your Account is Ready!',
      html: emailHtml
    });
    
    if (error) {
      console.error('Error sending login credentials email:', error);
      throw error;
    }
    
    console.log('Login credentials email sent successfully:', data.id);
    return data;
  } catch (error) {
    console.error('Failed to send login credentials email:', error);
    throw error;
  }
}

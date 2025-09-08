// Email templates for Jegodigital
const emailTemplates = {
  paymentConfirmation: (data) => ({
    subject: '¡Pago Confirmado! - Jegodigital',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Pago Confirmado - Jegodigital</title>
        <style>
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 0; background-color: #f4f4f4; }
          .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; }
          .header { background: linear-gradient(135deg, #4f46e6 0%, #7c3aed 100%); color: white; padding: 30px; text-align: center; }
          .content { padding: 30px; }
          .success-icon { font-size: 48px; margin-bottom: 20px; }
          .amount { font-size: 32px; font-weight: bold; color: #4f46e6; margin: 20px 0; }
          .details { background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0; }
          .detail-row { display: flex; justify-content: space-between; margin: 10px 0; }
          .detail-label { font-weight: bold; color: #666; }
          .detail-value { color: #333; }
          .next-steps { background-color: #e3f2fd; padding: 20px; border-radius: 8px; margin: 20px 0; }
          .footer { background-color: #1a1a1a; color: white; padding: 20px; text-align: center; }
          .btn { display: inline-block; background-color: #4f46e6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 10px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="success-icon">✅</div>
            <h1>¡Pago Confirmado!</h1>
            <p>Tu pago ha sido procesado exitosamente</p>
          </div>
          
          <div class="content">
            <h2>Hola ${data.customer.firstName || 'Cliente'},</h2>
            <p>¡Excelente noticia! Tu pago ha sido confirmado y estamos listos para comenzar a trabajar en tu proyecto.</p>
            
            <div class="amount">
              $${data.amount} ${data.currency}
            </div>
            
            <div class="details">
              <h3>Detalles del Pago</h3>
              <div class="detail-row">
                <span class="detail-label">ID de Pago:</span>
                <span class="detail-value">${data.paymentId}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Servicio:</span>
                <span class="detail-value">${data.service.description}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Método de Pago:</span>
                <span class="detail-value">${data.paymentMethod}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Fecha:</span>
                <span class="detail-value">${new Date(data.date).toLocaleDateString('es-ES')}</span>
              </div>
            </div>
            
            <div class="next-steps">
              <h3>Próximos Pasos</h3>
              <ol>
                <li><strong>Confirmación del Proyecto:</strong> Recibirás un email de confirmación en las próximas 24 horas.</li>
                <li><strong>Reunión de Kickoff:</strong> Programaremos una llamada para discutir los detalles de tu proyecto.</li>
                <li><strong>Inicio del Trabajo:</strong> Comenzaremos el desarrollo según el cronograma acordado.</li>
                <li><strong>Actualizaciones Regulares:</strong> Te mantendremos informado del progreso semanalmente.</li>
              </ol>
            </div>
            
            <p>Si tienes alguna pregunta, no dudes en contactarnos:</p>
            <p>
              <strong>Email:</strong> info@jegodigital.com<br>
              <strong>WhatsApp:</strong> +1 (555) 123-4567
            </p>
            
            <a href="https://jegodigital.com/dashboard.html" class="btn">Acceder a tu Dashboard</a>
          </div>
          
          <div class="footer">
            <p>© 2024 Jegodigital. Todos los derechos reservados.</p>
            <p>Transformando negocios locales con tecnología digital.</p>
          </div>
        </div>
      </body>
      </html>
    `,
    text: `
¡Pago Confirmado! - Jegodigital

Hola ${data.customer.firstName || 'Cliente'},

¡Excelente noticia! Tu pago ha sido confirmado y estamos listos para comenzar a trabajar en tu proyecto.

Detalles del Pago:
- ID de Pago: ${data.paymentId}
- Servicio: ${data.service.description}
- Monto: $${data.amount} ${data.currency}
- Método de Pago: ${data.paymentMethod}
- Fecha: ${new Date(data.date).toLocaleDateString('es-ES')}

Próximos Pasos:
1. Confirmación del Proyecto: Recibirás un email de confirmación en las próximas 24 horas.
2. Reunión de Kickoff: Programaremos una llamada para discutir los detalles de tu proyecto.
3. Inicio del Trabajo: Comenzaremos el desarrollo según el cronograma acordado.
4. Actualizaciones Regulares: Te mantendremos informado del progreso semanalmente.

Si tienes alguna pregunta, no dudes en contactarnos:
- Email: info@jegodigital.com
- WhatsApp: +1 (555) 123-4567

Accede a tu dashboard: https://jegodigital.com/dashboard.html

© 2024 Jegodigital. Todos los derechos reservados.
    `
  }),

  adminNotification: (data) => ({
    subject: `🚨 Nuevo Pago Recibido - $${data.amount} - ${data.customer.email}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Nuevo Pago - Admin</title>
        <style>
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 0; background-color: #f4f4f4; }
          .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; }
          .header { background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 20px; text-align: center; }
          .content { padding: 30px; }
          .alert { background-color: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; margin: 20px 0; }
          .details { background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0; }
          .detail-row { display: flex; justify-content: space-between; margin: 10px 0; }
          .detail-label { font-weight: bold; color: #666; }
          .detail-value { color: #333; }
          .amount { font-size: 28px; font-weight: bold; color: #10b981; margin: 20px 0; }
          .btn { display: inline-block; background-color: #4f46e6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 10px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🚨 Nuevo Pago Recibido</h1>
            <p>Se ha procesado un nuevo pago en el sistema</p>
          </div>
          
          <div class="content">
            <div class="alert">
              <strong>¡Atención!</strong> Un nuevo cliente ha realizado un pago y necesita atención inmediata.
            </div>
            
            <div class="amount">
              $${data.amount} ${data.currency}
            </div>
            
            <div class="details">
              <h3>Información del Cliente</h3>
              <div class="detail-row">
                <span class="detail-label">Nombre:</span>
                <span class="detail-value">${data.customer.firstName} ${data.customer.lastName}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Email:</span>
                <span class="detail-value">${data.customer.email}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Teléfono:</span>
                <span class="detail-value">${data.customer.phone || 'No proporcionado'}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Ubicación:</span>
                <span class="detail-value">${data.location.city}, ${data.location.country}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Servicio:</span>
                <span class="detail-value">${data.service.description}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">ID de Pago:</span>
                <span class="detail-value">${data.paymentId}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Método de Pago:</span>
                <span class="detail-value">${data.paymentMethod}</span>
              </div>
            </div>
            
            <p><strong>Acciones Requeridas:</strong></p>
            <ol>
              <li>Verificar los detalles del pago en Mercado Pago</li>
              <li>Crear el proyecto en el sistema</li>
              <li>Programar la llamada de kickoff</li>
              <li>Enviar email de bienvenida al cliente</li>
            </ol>
            
            <a href="https://jegodigital.com/dashboard.html" class="btn">Ir al Dashboard</a>
          </div>
        </div>
      </body>
      </html>
    `,
    text: `
🚨 Nuevo Pago Recibido - Admin

¡Atención! Un nuevo cliente ha realizado un pago y necesita atención inmediata.

Información del Cliente:
- Nombre: ${data.customer.firstName} ${data.customer.lastName}
- Email: ${data.customer.email}
- Teléfono: ${data.customer.phone || 'No proporcionado'}
- Ubicación: ${data.location.city}, ${data.location.country}
- Servicio: ${data.service.description}
- Monto: $${data.amount} ${data.currency}
- ID de Pago: ${data.paymentId}
- Método de Pago: ${data.paymentMethod}

Acciones Requeridas:
1. Verificar los detalles del pago en Mercado Pago
2. Crear el proyecto en el sistema
3. Programar la llamada de kickoff
4. Enviar email de bienvenida al cliente

Ir al Dashboard: https://jegodigital.com/dashboard.html
    `
  })
};

module.exports = { emailTemplates };

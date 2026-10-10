const nodemailer = require('nodemailer');

// Create reusable transporter
const createTransporter = () => {
  // 1. If explicit SMTP host & port are set
  if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
    return nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '587', 10),
      secure: process.env.SMTP_SECURE === 'true' || process.env.SMTP_PORT === '465',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }

  // 2. If Gmail user & app password or EMAIL_USER/EMAIL_PASS are set
  const emailUser = (process.env.EMAIL_USER || process.env.ADMIN_EMAIL || '').trim();
  const rawPass = process.env.EMAIL_PASS || process.env.EMAIL_APP_PASSWORD || '';
  const emailPass = rawPass.replace(/\s+/g, '');

  if (emailUser && emailPass) {
    return nodemailer.createTransport({
      service: process.env.EMAIL_SERVICE || 'gmail',
      auth: {
        user: emailUser,
        pass: emailPass,
      },
    });
  }

  // Fallback: If not configured yet, return null
  return null;
};

/**
 * Send email notification to portfolio owner when a new message is received
 */
const sendContactNotification = async (messageData) => {
  const adminEmail = process.env.ADMIN_EMAIL || 'bikramnahak9714@gmail.com';
  const transporter = createTransporter();

  if (!transporter) {
    console.log('[Mailer Notice] Email credentials not configured in .env. Message saved to database.');
    return { success: false, reason: 'Credentials not configured' };
  }

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f4f6f8; margin: 0; padding: 20px; color: #1e293b; }
        .card { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.08); border: 1px solid #e2e8f0; }
        .header { background: linear-gradient(135deg, #7c3aed, #0891b2); padding: 25px 30px; color: #ffffff; }
        .header h1 { margin: 0; font-size: 22px; font-weight: 700; }
        .header p { margin: 6px 0 0; font-size: 14px; opacity: 0.9; }
        .content { padding: 30px; }
        .field { margin-bottom: 20px; }
        .field-label { font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; color: #64748b; margin-bottom: 4px; }
        .field-value { font-size: 16px; color: #0f172a; font-weight: 500; }
        .message-box { background: #f8fafc; border-left: 4px solid #7c3aed; padding: 16px; border-radius: 6px; font-size: 15px; line-height: 1.6; color: #334155; margin-top: 10px; }
        .footer { padding: 20px 30px; background: #f1f5f9; text-align: center; font-size: 13px; color: #64748b; border-top: 1px solid #e2e8f0; }
        .btn-reply { display: inline-block; background: #7c3aed; color: #ffffff !important; text-decoration: none; padding: 10px 22px; border-radius: 8px; font-weight: 600; font-size: 14px; margin-top: 15px; }
      </style>
    </head>
    <body>
      <div class="card">
        <div class="header">
          <h1>New Portfolio Contact Enquiry</h1>
          <p>Someone reached out through your portfolio contact form.</p>
        </div>
        <div class="content">
          <div class="field">
            <div class="field-label">Sender Name</div>
            <div class="field-value">${messageData.name}</div>
          </div>
          <div class="field">
            <div class="field-label">Sender Email</div>
            <div class="field-value"><a href="mailto:${messageData.email}" style="color: #7c3aed; text-decoration: none;">${messageData.email}</a></div>
          </div>
          ${messageData.phone ? `
          <div class="field">
            <div class="field-label">Phone Number</div>
            <div class="field-value"><a href="tel:${messageData.phone}" style="color: #7c3aed; text-decoration: none;">${messageData.phone}</a></div>
          </div>
          ` : ''}
          <div class="field">
            <div class="field-label">Subject</div>
            <div class="field-value">${messageData.subject}</div>
          </div>
          <div class="field">
            <div class="field-label">Message</div>
            <div class="message-box">${messageData.message.replace(/\n/g, '<br>')}</div>
          </div>
          <a href="mailto:${messageData.email}?subject=Re: ${encodeURIComponent(messageData.subject)}" class="btn-reply">Reply to ${messageData.name}</a>
        </div>
        <div class="footer">
          Received on ${new Date().toLocaleString()} &bull; Sent from your Portfolio Contact API
        </div>
      </div>
    </body>
    </html>
  `;

  const senderEmail = process.env.EMAIL_USER || process.env.ADMIN_EMAIL || 'portfolio@bikramnahak.dev';

  const mailOptions = {
    from: `"Portfolio Contact Form" <${senderEmail}>`,
    to: adminEmail,
    replyTo: messageData.email,
    subject: `[Portfolio Contact] ${messageData.subject} - from ${messageData.name}`,
    html: htmlContent,
    text: `New Portfolio Message:\n\nName: ${messageData.name}\nEmail: ${messageData.email}\nPhone: ${messageData.phone || 'N/A'}\nSubject: ${messageData.subject}\n\nMessage:\n${messageData.message}`,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('[Mailer] Notification email sent successfully:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (err) {
    console.error('[Mailer Error] Failed to send contact notification email:', err.message);
    return { success: false, error: err.message };
  }
};

/**
 * Send an acknowledgment / confirmation email to the user who contacted
 */
const sendUserAcknowledgment = async (messageData) => {
  const transporter = createTransporter();
  if (!transporter) return { success: false, reason: 'Credentials not configured' };

  const senderEmail = process.env.EMAIL_USER || process.env.ADMIN_EMAIL || 'portfolio@bikramnahak.dev';
  const myName = 'Bikram Nahak';

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f4f6f8; margin: 0; padding: 20px; color: #1e293b; }
        .card { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.08); border: 1px solid #e2e8f0; }
        .header { background: linear-gradient(135deg, #7c3aed, #0891b2); padding: 25px 30px; color: #ffffff; }
        .header h1 { margin: 0; font-size: 22px; font-weight: 700; }
        .content { padding: 30px; line-height: 1.6; color: #334155; }
        .message-summary { background: #f8fafc; border: 1px solid #e2e8f0; padding: 15px; border-radius: 8px; margin: 15px 0; font-size: 14px; }
        .footer { padding: 20px 30px; background: #f1f5f9; text-align: center; font-size: 13px; color: #64748b; border-top: 1px solid #e2e8f0; }
      </style>
    </head>
    <body>
      <div class="card">
        <div class="header">
          <h1>Thank you for reaching out!</h1>
        </div>
        <div class="content">
          <p>Hi <strong>${messageData.name}</strong>,</p>
          <p>Thank you for getting in touch through my portfolio. I have received your message regarding <em>"${messageData.subject}"</em>.</p>
          <p>I will review your message and get back to you as soon as possible.</p>
          <div class="message-summary">
            <strong>Your Message:</strong><br/>
            ${messageData.message.replace(/\n/g, '<br>')}
          </div>
          <p>Best regards,<br/><strong>${myName}</strong><br/>Full Stack Developer</p>
        </div>
        <div class="footer">
          &copy; ${new Date().getFullYear()} ${myName}. All rights reserved.
        </div>
      </div>
    </body>
    </html>
  `;

  const mailOptions = {
    from: `"${myName}" <${senderEmail}>`,
    to: messageData.email,
    subject: `Thank you for contacting me - ${myName}`,
    html: htmlContent,
    text: `Hi ${messageData.name},\n\nThank you for reaching out through my portfolio regarding "${messageData.subject}". I have received your message and will get back to you shortly.\n\nBest regards,\n${myName}`,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('[Mailer] Acknowledgment email sent successfully:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (err) {
    console.error('[Mailer Error] Failed to send acknowledgment email:', err.message);
    return { success: false, error: err.message };
  }
};

module.exports = {
  createTransporter,
  sendContactNotification,
  sendUserAcknowledgment,
};

import nodemailer from 'nodemailer';

// Email configuration
const emailConfig = {
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER, // Your email
    pass: process.env.SMTP_PASS, // Your app password
  },
};

// Create transporter
const transporter = nodemailer.createTransport(emailConfig);

// Verify connection configuration
transporter.verify((error, success) => {
  if (error) {
    console.log('❌ Email configuration error:', error);
    console.log('📧 Email config:', {
      host: emailConfig.host,
      port: emailConfig.port,
      secure: emailConfig.secure,
      auth: {
        user: emailConfig.auth.user,
        pass: emailConfig.auth.pass ? '***' : 'undefined'
      }
    });
  } else {
    console.log('✅ Email server is ready to send messages');
    console.log('📧 Using email:', emailConfig.auth.user);
  }
});

// Email templates
export const createBookingNotificationEmail = (booking: any) => {
  return {
    subject: `🌟 New Shisha Cafe Booking - ${booking.firstName} ${booking.lastName}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 15px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="font-size: 2.5em; margin: 0;">🌟 New Booking Alert!</h1>
          <p style="font-size: 1.2em; opacity: 0.9;">Shisha Cafe Booking System</p>
        </div>
        
        <div style="background: rgba(255,255,255,0.1); padding: 25px; border-radius: 10px; backdrop-filter: blur(10px);">
          <h2 style="color: #FFD700; margin-top: 0;">Customer Information</h2>
          <p><strong>Name:</strong> ${booking.firstName} ${booking.lastName}</p>
          <p><strong>Email:</strong> ${booking.email}</p>
          <p><strong>Phone:</strong> ${booking.phone}</p>
          ${booking.instagram ? `<p><strong>Instagram:</strong> @${booking.instagram}</p>` : ''}
        </div>

        <div style="background: rgba(255,255,255,0.1); padding: 25px; border-radius: 10px; backdrop-filter: blur(10px); margin-top: 20px;">
          <h2 style="color: #FFD700; margin-top: 0;">Event Details</h2>
          <p><strong>Date:</strong> ${booking.eventDate}</p>
          <p><strong>Time:</strong> ${booking.eventTime}</p>
          <p><strong>Location:</strong> ${booking.location}</p>
          <p><strong>Guest Count:</strong> ${booking.guestCount}</p>
          <p><strong>Event Type:</strong> ${booking.eventType || 'Not specified'}</p>
        </div>

        <div style="background: rgba(255,255,255,0.1); padding: 25px; border-radius: 10px; backdrop-filter: blur(10px); margin-top: 20px;">
          <h2 style="color: #FFD700; margin-top: 0;">Services Requested</h2>
          <ul style="margin: 0; padding-left: 20px;">
            ${booking.services.map((service: string) => `<li>${service}</li>`).join('')}
          </ul>
        </div>

        ${booking.flavourPreferences ? `
          <div style="background: rgba(255,255,255,0.1); padding: 25px; border-radius: 10px; backdrop-filter: blur(10px); margin-top: 20px;">
            <h2 style="color: #FFD700; margin-top: 0;">Flavor Preferences</h2>
            <p>${booking.flavourPreferences}</p>
          </div>
        ` : ''}

        ${booking.specialRequirements ? `
          <div style="background: rgba(255,255,255,0.1); padding: 25px; border-radius: 10px; backdrop-filter: blur(10px); margin-top: 20px;">
            <h2 style="color: #FFD700; margin-top: 0;">Special Requirements</h2>
            <p>${booking.specialRequirements}</p>
          </div>
        ` : ''}

        <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid rgba(255,255,255,0.3);">
          <p style="opacity: 0.8; margin: 0;">Booking ID: ${booking.id}</p>
          <p style="opacity: 0.8; margin: 5px 0 0 0;">Received: ${new Date(booking.createdAt).toLocaleString()}</p>
        </div>
      </div>
    `,
    text: `
New Shisha Cafe Booking Alert!

Customer Information:
- Name: ${booking.firstName} ${booking.lastName}
- Email: ${booking.email}
- Phone: ${booking.phone}
${booking.instagram ? `- Instagram: @${booking.instagram}` : ''}

Event Details:
- Date: ${booking.eventDate}
- Time: ${booking.eventTime}
- Location: ${booking.location}
- Guest Count: ${booking.guestCount}
- Event Type: ${booking.eventType || 'Not specified'}

Services Requested:
${booking.services.map((service: string) => `- ${service}`).join('\n')}

${booking.flavourPreferences ? `Flavor Preferences: ${booking.flavourPreferences}` : ''}
${booking.specialRequirements ? `Special Requirements: ${booking.specialRequirements}` : ''}

Booking ID: ${booking.id}
Received: ${new Date(booking.createdAt).toLocaleString()}
    `
  };
};

export const createCustomerConfirmationEmail = (booking: any) => {
  return {
    subject: `🌟 Booking Confirmation - Shisha Cafe`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 15px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="font-size: 2.5em; margin: 0;">🌟 Booking Confirmed!</h1>
          <p style="font-size: 1.2em; opacity: 0.9;">Thank you for choosing Shisha Cafe</p>
        </div>
        
        <div style="background: rgba(255,255,255,0.1); padding: 25px; border-radius: 10px; backdrop-filter: blur(10px);">
          <h2 style="color: #FFD700; margin-top: 0;">Hello ${booking.firstName}!</h2>
          <p>We've received your booking request and will contact you shortly to confirm the details.</p>
        </div>

        <div style="background: rgba(255,255,255,0.1); padding: 25px; border-radius: 10px; backdrop-filter: blur(10px); margin-top: 20px;">
          <h2 style="color: #FFD700; margin-top: 0;">Your Booking Details</h2>
          <p><strong>Date:</strong> ${booking.eventDate}</p>
          <p><strong>Time:</strong> ${booking.eventTime}</p>
          <p><strong>Location:</strong> ${booking.location}</p>
          <p><strong>Guest Count:</strong> ${booking.guestCount}</p>
          <p><strong>Services:</strong> ${booking.services.join(', ')}</p>
        </div>

        <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid rgba(255,255,255,0.3);">
          <p style="opacity: 0.8;">We'll be in touch soon!</p>
          <p style="opacity: 0.8; font-size: 0.9em;">Booking Reference: ${booking.id}</p>
        </div>
      </div>
    `,
    text: `
Booking Confirmed - Shisha Cafe

Hello ${booking.firstName}!

We've received your booking request and will contact you shortly to confirm the details.

Your Booking Details:
- Date: ${booking.eventDate}
- Time: ${booking.eventTime}
- Location: ${booking.location}
- Guest Count: ${booking.guestCount}
- Services: ${booking.services.join(', ')}

We'll be in touch soon!
Booking Reference: ${booking.id}
    `
  };
};

// Send notification email to admin
export const sendBookingNotification = async (booking: any, adminEmail: string) => {
  try {
    const emailContent = createBookingNotificationEmail(booking);
    
    const mailOptions = {
      from: process.env.SMTP_USER,
      to: adminEmail,
      subject: emailContent.subject,
      text: emailContent.text,
      html: emailContent.html,
    };

    const result = await transporter.sendMail(mailOptions);
    console.log('✅ Booking notification sent successfully:', result.messageId);
    return { success: true, messageId: result.messageId };
  } catch (error) {
    console.error('❌ Error sending booking notification:', error);
    console.error('📧 Mail options:', {
      from: mailOptions.from,
      to: mailOptions.to,
      subject: mailOptions.subject
    });
    return { success: false, error };
  }
};

// Send confirmation email to customer
export const sendCustomerConfirmation = async (booking: any) => {
  try {
    const emailContent = createCustomerConfirmationEmail(booking);
    
    const mailOptions = {
      from: process.env.SMTP_USER,
      to: booking.email,
      subject: emailContent.subject,
      text: emailContent.text,
      html: emailContent.html,
    };

    const result = await transporter.sendMail(mailOptions);
    console.log('✅ Customer confirmation sent successfully:', result.messageId);
    return { success: true, messageId: result.messageId };
  } catch (error) {
    console.error('❌ Error sending customer confirmation:', error);
    console.error('📧 Mail options:', {
      from: mailOptions.from,
      to: mailOptions.to,
      subject: mailOptions.subject
    });
    return { success: false, error };
  }
};

export default transporter;
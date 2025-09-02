import express from "express";
import { VercelRequest, VercelResponse } from '@vercel/node';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import nodemailer from 'nodemailer';
import { z } from 'zod';

// Fix for __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Basic middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

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

// Email sending functions
const sendBookingNotification = async (booking: any, adminEmail: string) => {
  try {
    const emailContent = {
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

          <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid rgba(255,255,255,0.3);">
            <p style="opacity: 0.8; margin: 0;">Booking ID: ${booking.id}</p>
            <p style="opacity: 0.8; margin: 5px 0 0 0;">Received: ${new Date(booking.createdAt).toLocaleString()}</p>
          </div>
        </div>
      `,
    };
    
    const mailOptions = {
      from: process.env.SMTP_USER,
      to: adminEmail,
      subject: emailContent.subject,
      html: emailContent.html,
    };

    const result = await transporter.sendMail(mailOptions);
    console.log('✅ Booking notification sent successfully:', result.messageId);
    return { success: true, messageId: result.messageId };
  } catch (error) {
    console.error('❌ Error sending booking notification:', error);
    return { success: false, error };
  }
};

const sendCustomerConfirmation = async (booking: any) => {
  try {
    const emailContent = {
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
    };
    
    const mailOptions = {
      from: process.env.SMTP_USER,
      to: booking.email,
      subject: emailContent.subject,
      html: emailContent.html,
    };

    const result = await transporter.sendMail(mailOptions);
    console.log('✅ Customer confirmation sent successfully:', result.messageId);
    return { success: true, messageId: result.messageId };
  } catch (error) {
    console.error('❌ Error sending customer confirmation:', error);
    return { success: false, error };
  }
};

// Schema for validation
const insertBookingSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(1, "Phone number is required"),
  instagram: z.string().optional(),
  services: z.array(z.string()).min(1, "At least one service must be selected"),
  eventDate: z.string().min(1, "Event date is required"),
  eventTime: z.string().min(1, "Event time is required"),
  location: z.string().min(1, "Event location is required"),
  guestCount: z.string().min(1, "Guest count is required"),
  eventType: z.string().optional(),
  flavourPreferences: z.string().optional(),
  specialRequirements: z.string().optional(),
  budget: z.string().optional(),
  termsAccepted: z.boolean().refine(val => val === true, "Terms must be accepted"),
});

// Try to find and serve static files
const possibleStaticPaths = [
  path.resolve(process.cwd(), 'dist', 'public'),
  path.resolve(__dirname, '..', 'dist', 'public'),
  path.resolve('dist', 'public'),
  path.resolve(process.cwd(), 'assets'), // If copied to root
  path.resolve(process.cwd()), // If files are in root
];

let staticPath: string | null = null;
for (const testPath of possibleStaticPaths) {
  if (fs.existsSync(testPath)) {
    staticPath = testPath;
    app.use('/assets', express.static(path.join(testPath, 'assets')));
    console.log('Serving static files from:', testPath);
    break;
  }
}


// Health check route
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API routes with email functionality
app.post('/api/bookings', async (req, res) => {
  try {
    console.log('Booking request received:', req.body);
    
    // Validate the request
    const booking = insertBookingSchema.parse(req.body);
    
    // Add booking metadata
    const bookingWithMeta = {
      ...booking,
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString(),
    };

    console.log('New booking created:', {
      id: bookingWithMeta.id,
      name: `${booking.firstName} ${booking.lastName}`,
      email: booking.email,
      eventDate: booking.eventDate,
      services: booking.services
    });

    // Send email notifications
    const adminEmail = process.env.ADMIN_EMAIL || process.env.SMTP_USER;
    
    if (adminEmail) {
      // Send notification to admin
      const adminNotification = await sendBookingNotification(bookingWithMeta, adminEmail);
      console.log('Admin notification status:', adminNotification.success ? 'Sent' : 'Failed');
      
      // Send confirmation to customer
      const customerConfirmation = await sendCustomerConfirmation(bookingWithMeta);
      console.log('Customer confirmation status:', customerConfirmation.success ? 'Sent' : 'Failed');
    } else {
      console.warn('No admin email configured. Set ADMIN_EMAIL or SMTP_USER environment variable.');
    }
    
    res.json({ success: true, booking: bookingWithMeta });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: "Validation failed", details: error.errors });
    } else {
      console.error("Booking creation error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
});

app.get('/api/bookings', (req, res) => {
  try {
    res.json([]);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Catch all route - serve React app or create a working Shisha Cafe app
app.get('*', (req, res) => {
  // Try to find index.html in any of the possible locations
  const possibleIndexPaths = [
    path.resolve(process.cwd(), 'dist', 'public', 'index.html'),
    path.resolve(__dirname, '..', 'dist', 'public', 'index.html'),
    path.resolve('dist', 'public', 'index.html'),
    path.resolve(process.cwd(), 'index.html'), // If copied to root
  ];

  let indexPath: string | null = null;
  for (const testPath of possibleIndexPaths) {
    if (fs.existsSync(testPath)) {
      indexPath = testPath;
      break;
    }
  }
  
  if (indexPath) {
    console.log('Serving React app from:', indexPath);
    res.sendFile(indexPath);
  } else {
    // Simple fallback - just indicate we're trying to build your React app
    console.log('Your original React app not found, build may still be processing');
    res.send(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Shisha Cafe - Loading...</title>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <style>
          body { 
            font-family: Arial, sans-serif; 
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            flex-direction: column;
          }
          .container { text-align: center; }
          .spinner { 
            border: 4px solid rgba(255,255,255,0.3);
            border-radius: 50%;
            border-top: 4px solid white;
            width: 40px;
            height: 40px;
            animation: spin 1s linear infinite;
            margin: 20px auto;
          }
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        </style>
        <script>
          setTimeout(() => location.reload(), 10000);
        </script>
      </head>
      <body>
        <div class="container">
          <h1>🌟 Shisha Cafe</h1>
          <div class="spinner"></div>
          <p>Building your original React app...</p>
          <p>This will refresh automatically in 10 seconds</p>
          <p><small>If this persists, the build process needs to be fixed</small></p>
        </div>
      </body>
      </html>
    `);
  }
});

// Export for Vercel
export default app;
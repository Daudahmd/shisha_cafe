import express from "express";
import { VercelRequest, VercelResponse } from '@vercel/node';

const app = express();

// Basic middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Health check route
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API routes (simplified version)
app.post('/api/bookings', (req, res) => {
  try {
    console.log('Booking request:', req.body);
    res.json({ 
      success: true, 
      message: 'Booking received',
      data: req.body 
    });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/bookings', (req, res) => {
  try {
    res.json([]);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Catch all for React app
app.get('*', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Shisha Cafe</title>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <style>
        body { 
          font-family: Arial, sans-serif; 
          margin: 0; 
          padding: 20px; 
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-direction: column;
        }
        .container {
          text-align: center;
          background: rgba(255,255,255,0.1);
          padding: 40px;
          border-radius: 15px;
          backdrop-filter: blur(10px);
        }
        h1 { font-size: 3em; margin-bottom: 20px; }
        p { font-size: 1.2em; margin: 10px 0; }
        .btn {
          display: inline-block;
          padding: 12px 24px;
          background: rgba(255,255,255,0.2);
          color: white;
          text-decoration: none;
          border-radius: 8px;
          margin: 10px;
          border: 2px solid rgba(255,255,255,0.3);
          transition: all 0.3s ease;
        }
        .btn:hover {
          background: rgba(255,255,255,0.3);
        }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>🌟 Shisha Cafe</h1>
        <p>Premium Shisha Experience</p>
        <p>Your luxury shisha service is now live on Vercel!</p>
        <div>
          <a href="/api/health" class="btn">API Status</a>
          <a href="/api/bookings" class="btn">View Bookings</a>
        </div>
        <p style="margin-top: 30px; font-size: 0.9em; opacity: 0.8;">
          Server is running successfully ✅
        </p>
      </div>
    </body>
    </html>
  `);
});

// Export for Vercel
export default app;
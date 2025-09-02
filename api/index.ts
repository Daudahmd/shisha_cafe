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

// Export for Vercel
export default app;
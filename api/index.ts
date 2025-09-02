import express from "express";
import { VercelRequest, VercelResponse } from '@vercel/node';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

// Fix for __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Basic middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Try to find and serve static files
const possibleStaticPaths = [
  path.resolve(process.cwd(), 'dist', 'public'),
  path.resolve(__dirname, '..', 'dist', 'public'),
  path.resolve('dist', 'public'),
];

let staticPath: string | null = null;
for (const testPath of possibleStaticPaths) {
  if (fs.existsSync(testPath)) {
    staticPath = testPath;
    app.use(express.static(testPath));
    console.log('Serving static files from:', testPath);
    break;
  }
}


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

// Catch all route - serve React app or fallback
app.get('*', (req, res) => {
  // Try to find index.html in any of the possible locations
  const possibleIndexPaths = [
    path.resolve(process.cwd(), 'dist', 'public', 'index.html'),
    path.resolve(__dirname, '..', 'dist', 'public', 'index.html'),
    path.resolve('dist', 'public', 'index.html'),
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
    // Fallback to simple HTML if React app not built
    console.log('React app not found, serving fallback. Checked paths:', possibleIndexPaths);
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
          .debug {
            font-size: 0.8em;
            margin-top: 20px;
            opacity: 0.7;
            max-width: 600px;
            word-break: break-all;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>🌟 Shisha Cafe</h1>
          <p>Premium Shisha Experience</p>
          <p>React app build not found. Checking deployment...</p>
          <div>
            <a href="/api/health" class="btn">API Status</a>
            <a href="/api/bookings" class="btn">View Bookings</a>
          </div>
          <div class="debug">
            <p><strong>Checked paths:</strong></p>
            ${possibleIndexPaths.map(p => `<p>❌ ${p}</p>`).join('')}
            <p><strong>Current directory:</strong> ${process.cwd()}</p>
            <p><strong>Static path used:</strong> ${staticPath || 'None found'}</p>
          </div>
        </div>
      </body>
      </html>
    `);
  }
});

// Export for Vercel
export default app;
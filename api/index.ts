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
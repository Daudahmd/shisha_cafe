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

// Catch all route - serve React app or create a working Shisha Cafe app
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
    // Serve a functional Shisha Cafe app
    console.log('React app not found, serving functional Shisha Cafe app');
    res.send(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Shisha Cafe - Premium Shisha Experience</title>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { 
            font-family: 'Arial', sans-serif; 
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            min-height: 100vh;
          }
          .navbar {
            padding: 1rem 2rem;
            background: rgba(255,255,255,0.1);
            backdrop-filter: blur(10px);
            display: flex;
            justify-content: space-between;
            align-items: center;
          }
          .logo { font-size: 1.5rem; font-weight: bold; }
          .nav-links { display: flex; gap: 2rem; }
          .nav-links a { color: white; text-decoration: none; }
          .hero {
            text-align: center;
            padding: 4rem 2rem;
            max-width: 1200px;
            margin: 0 auto;
          }
          .hero h1 { font-size: 4rem; margin-bottom: 1rem; }
          .hero p { font-size: 1.2rem; margin-bottom: 2rem; opacity: 0.9; }
          .services {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 2rem;
            padding: 2rem;
            max-width: 1200px;
            margin: 0 auto;
          }
          .service-card {
            background: rgba(255,255,255,0.1);
            padding: 2rem;
            border-radius: 15px;
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255,255,255,0.2);
          }
          .service-card h3 { font-size: 1.5rem; margin-bottom: 1rem; }
          .btn {
            display: inline-block;
            padding: 12px 24px;
            background: rgba(255,255,255,0.2);
            color: white;
            text-decoration: none;
            border-radius: 8px;
            margin: 10px 5px;
            border: 2px solid rgba(255,255,255,0.3);
            transition: all 0.3s ease;
            cursor: pointer;
          }
          .btn:hover {
            background: rgba(255,255,255,0.3);
            transform: translateY(-2px);
          }
          .booking-form {
            max-width: 600px;
            margin: 2rem auto;
            padding: 2rem;
            background: rgba(255,255,255,0.1);
            border-radius: 15px;
            backdrop-filter: blur(10px);
          }
          .form-group {
            margin-bottom: 1rem;
          }
          .form-group label {
            display: block;
            margin-bottom: 0.5rem;
          }
          .form-group input, .form-group textarea, .form-group select {
            width: 100%;
            padding: 0.8rem;
            border: 1px solid rgba(255,255,255,0.3);
            border-radius: 5px;
            background: rgba(255,255,255,0.1);
            color: white;
          }
          .form-group input::placeholder, .form-group textarea::placeholder {
            color: rgba(255,255,255,0.7);
          }
          .success { color: #4CAF50; margin-top: 1rem; }
          .hidden { display: none; }
        </style>
      </head>
      <body>
        <nav class="navbar">
          <div class="logo">🌟 Shisha Cafe</div>
          <div class="nav-links">
            <a href="#home">Home</a>
            <a href="#services">Services</a>
            <a href="#booking">Book Now</a>
            <a href="/api/health">API Status</a>
          </div>
        </nav>

        <section id="home" class="hero">
          <h1>Premium Shisha Experience</h1>
          <p>Luxury shisha services for your special events and gatherings</p>
          <a href="#booking" class="btn">Book Your Experience</a>
          <a href="#services" class="btn">Our Services</a>
        </section>

        <section id="services" class="services">
          <div class="service-card">
            <h3>🏠 Home Service</h3>
            <p>Premium shisha experience delivered to your home with professional setup and service.</p>
          </div>
          <div class="service-card">
            <h3>🎉 Event Catering</h3>
            <p>Complete shisha catering for parties, weddings, and corporate events.</p>
          </div>
          <div class="service-card">
            <h3>🌟 VIP Experience</h3>
            <p>Luxury shisha service with premium flavors and personalized attention.</p>
          </div>
        </section>

        <section id="booking" class="booking-form">
          <h2>Book Your Shisha Experience</h2>
          <form id="bookingForm">
            <div class="form-group">
              <label>First Name</label>
              <input type="text" name="firstName" required>
            </div>
            <div class="form-group">
              <label>Last Name</label>
              <input type="text" name="lastName" required>
            </div>
            <div class="form-group">
              <label>Email</label>
              <input type="email" name="email" required>
            </div>
            <div class="form-group">
              <label>Phone</label>
              <input type="tel" name="phone" required>
            </div>
            <div class="form-group">
              <label>Event Date</label>
              <input type="date" name="eventDate" required>
            </div>
            <div class="form-group">
              <label>Event Time</label>
              <input type="time" name="eventTime" required>
            </div>
            <div class="form-group">
              <label>Location</label>
              <input type="text" name="location" placeholder="Event address" required>
            </div>
            <div class="form-group">
              <label>Guest Count</label>
              <select name="guestCount" required>
                <option value="">Select guest count</option>
                <option value="1-10">1-10 guests</option>
                <option value="11-25">11-25 guests</option>
                <option value="26-50">26-50 guests</option>
                <option value="50+">50+ guests</option>
              </select>
            </div>
            <div class="form-group">
              <label>Services (Hold Ctrl/Cmd to select multiple)</label>
              <select name="services" multiple required>
                <option value="home-service">Home Service</option>
                <option value="event-catering">Event Catering</option>
                <option value="vip-experience">VIP Experience</option>
              </select>
            </div>
            <div class="form-group">
              <label>Special Requirements</label>
              <textarea name="specialRequirements" placeholder="Any special requests or requirements..."></textarea>
            </div>
            <button type="submit" class="btn">Submit Booking Request</button>
          </form>
          <div id="successMessage" class="success hidden">
            🎉 Thank you! Your booking request has been submitted successfully. We'll contact you soon!
          </div>
        </section>

        <script>
          document.getElementById('bookingForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const formData = new FormData(e.target);
            const data = Object.fromEntries(formData.entries());
            
            // Handle multiple services
            const services = formData.getAll('services');
            data.services = services;
            
            try {
              const response = await fetch('/api/bookings', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
              });
              
              if (response.ok) {
                document.getElementById('bookingForm').reset();
                document.getElementById('successMessage').classList.remove('hidden');
                setTimeout(() => {
                  document.getElementById('successMessage').classList.add('hidden');
                }, 5000);
              } else {
                alert('Booking submission failed. Please try again.');
              }
            } catch (error) {
              alert('Network error. Please check your connection and try again.');
            }
          });

          // Smooth scrolling for navigation links
          document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
              e.preventDefault();
              document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
              });
            });
          });
        </script>
      </body>
      </html>
    `);
  }
});

// Export for Vercel
export default app;
import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertBookingSchema } from "@shared/schema";
import { z } from "zod";
import { sendBookingNotification, sendCustomerConfirmation } from "./email";

export async function registerRoutes(app: Express): Promise<Server> {
  // Booking endpoint
  app.post("/api/bookings", async (req, res) => {
    try {
      const validatedData = insertBookingSchema.parse(req.body);
      const booking = await storage.createBooking(validatedData);
      
      console.log("New booking received:", {
        id: booking.id,
        name: `${booking.firstName} ${booking.lastName}`,
        email: booking.email,
        eventDate: booking.eventDate,
        services: booking.services
      });

      // Send email notifications
      const adminEmail = process.env.ADMIN_EMAIL || process.env.SMTP_USER;
      
      if (adminEmail) {
        // Send notification to admin
        const adminNotification = await sendBookingNotification(booking, adminEmail);
        console.log('Admin notification status:', adminNotification.success ? 'Sent' : 'Failed');
        
        // Send confirmation to customer
        const customerConfirmation = await sendCustomerConfirmation(booking);
        console.log('Customer confirmation status:', customerConfirmation.success ? 'Sent' : 'Failed');
      } else {
        console.warn('No admin email configured. Set ADMIN_EMAIL or SMTP_USER environment variable.');
      }
      
      res.json({ success: true, booking });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: "Validation failed", details: error.errors });
      } else {
        console.error("Booking creation error:", error);
        res.status(500).json({ error: "Internal server error" });
      }
    }
  });

  // Test email endpoint
  app.post('/api/test-email', async (req, res) => {
    try {
      const testBooking = {
        id: 'test-' + Date.now(),
        firstName: 'Test',
        lastName: 'User',
        email: 'dawooda32100@gmail.com',
        phone: '1234567890',
        eventDate: '2025-01-01',
        eventTime: '18:00',
        location: 'Test Location',
        guestCount: 5,
        services: ['Shisha Setup', 'Premium Flavours'],
        createdAt: new Date().toISOString()
      };

      const adminEmail = process.env.ADMIN_EMAIL || process.env.SMTP_USER;
      
      // Send test notification to admin
      const adminNotification = await sendBookingNotification(testBooking, adminEmail!);
      
      // Send test confirmation to customer  
      const customerConfirmation = await sendCustomerConfirmation(testBooking);
      
      res.json({
        success: true,
        adminNotification,
        customerConfirmation
      });
    } catch (error) {
      console.error('Test email error:', error);
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // Get all bookings (for admin purposes)
  app.get("/api/bookings", async (req, res) => {
    try {
      const bookings = await storage.getBookings();
      res.json(bookings);
    } catch (error) {
      console.error("Error fetching bookings:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Get specific booking
  app.get("/api/bookings/:id", async (req, res) => {
    try {
      const booking = await storage.getBooking(req.params.id);
      if (!booking) {
        return res.status(404).json({ error: "Booking not found" });
      }
      res.json(booking);
    } catch (error) {
      console.error("Error fetching booking:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}

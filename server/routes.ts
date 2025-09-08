import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertBookingSchema, insertMemberSchema } from "@shared/schema";
import { z } from "zod";
import { sendBookingNotification, sendCustomerConfirmation, sendMembershipWelcome, sendMembershipAdminNotification } from "./email";
// Discount calculation function
function calculateMembershipDiscount(membershipType: string | undefined, totalAmount: number = 0): { discount: number; discountedAmount: number } {
  let discountPercentage = 0;
  
  switch (membershipType) {
    case 'Gold':
      discountPercentage = 10;
      break;
    case 'Platinum':
      discountPercentage = 20;
      break;
    default:
      discountPercentage = 0;
  }
  
  const discount = (totalAmount * discountPercentage) / 100;
  const discountedAmount = totalAmount - discount;
  
  return { discount, discountedAmount };
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Booking endpoint
  app.post("/api/bookings", async (req, res) => {
    try {
      console.log('Raw request body:', req.body);
      console.log('Package in request:', req.body.selectedPackage);
      console.log('Membership in request:', req.body.selectedMembership);
      const validatedData = insertBookingSchema.parse(req.body);
      console.log('Validated data:', validatedData);
      const booking = await storage.createBooking(validatedData);
      
      // If customer selected a membership, create/update member record
      if (validatedData.selectedMembership && validatedData.selectedMembership !== 'none') {
        const existingMember = await storage.getMemberByEmail(validatedData.email);
        
        if (!existingMember) {
          // Create new member
          const expiryDate = new Date();
          expiryDate.setMonth(expiryDate.getMonth() + 1); // 1 month from now
          
          const newMember = {
            firstName: validatedData.firstName,
            lastName: validatedData.lastName,
            email: validatedData.email,
            phone: validatedData.phone,
            instagram: validatedData.instagram || '',
            membershipType: validatedData.selectedMembership,
            membershipStatus: 'active',
            startDate: new Date(),
            expiryDate: expiryDate,
            totalBookings: '1',
            discountEligible: true,
          };
          
          await storage.createMember(newMember);
          console.log('Created new member:', validatedData.selectedMembership, 'for', validatedData.email);
        } else {
          // Update existing member's booking count
          const currentBookings = parseInt(existingMember.totalBookings || '0');
          existingMember.totalBookings = (currentBookings + 1).toString();
          existingMember.updatedAt = new Date();
          console.log('Updated existing member booking count for', validatedData.email);
        }
      }
      
      console.log("New booking received:", {
        id: booking.id,
        name: `${booking.firstName} ${booking.lastName}`,
        email: booking.email,
        eventDate: booking.eventDate,
        services: booking.services,
        selectedPackage: booking.selectedPackage,
        selectedMembership: booking.selectedMembership
      });

      // Send response immediately
      res.json({ success: true, booking });

      // Send email notifications asynchronously (fire-and-forget)
      const adminEmail = process.env.ADMIN_EMAIL || process.env.SMTP_USER;
      
      if (adminEmail) {
        // Send notification to admin (async)
        sendBookingNotification(booking, adminEmail)
          .then(result => console.log('Admin notification status:', result.success ? 'Sent' : 'Failed'))
          .catch(error => console.error('Admin notification error:', error));
        
        // Send confirmation to customer (async)
        sendCustomerConfirmation(booking)
          .then(result => console.log('Customer confirmation status:', result.success ? 'Sent' : 'Failed'))
          .catch(error => console.error('Customer confirmation error:', error));
      } else {
        console.warn('No admin email configured. Set ADMIN_EMAIL or SMTP_USER environment variable.');
      }
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

  // Delete booking
  app.delete("/api/bookings/:id", async (req, res) => {
    try {
      const deleted = await storage.deleteBooking(req.params.id);
      if (!deleted) {
        return res.status(404).json({ error: "Booking not found" });
      }
      console.log("Booking deleted:", req.params.id);
      res.json({ success: true, message: "Booking deleted successfully" });
    } catch (error) {
      console.error("Error deleting booking:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Update booking status
  app.put("/api/bookings/:id/status", async (req, res) => {
    try {
      const { status } = req.body;
      if (!["pending", "confirmed", "completed", "cancelled"].includes(status)) {
        return res.status(400).json({ error: "Invalid status" });
      }
      
      const booking = await storage.updateBookingStatus(req.params.id, status);
      if (!booking) {
        return res.status(404).json({ error: "Booking not found" });
      }
      
      console.log("Booking status updated:", req.params.id, "->", status);
      res.json(booking);
    } catch (error) {
      console.error("Error updating booking status:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Get all members (for admin purposes)
  app.get("/api/members", async (req, res) => {
    try {
      const members = await storage.getMembers();
      res.json(members);
    } catch (error) {
      console.error("Error fetching members:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Get specific member
  app.get("/api/members/:id", async (req, res) => {
    try {
      const member = await storage.getMember(req.params.id);
      if (!member) {
        return res.status(404).json({ error: "Member not found" });
      }
      res.json(member);
    } catch (error) {
      console.error("Error fetching member:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });



  // Renew membership
  app.post("/api/members/:id/renew", async (req, res) => {
    try {
      const member = await storage.getMember(req.params.id);
      if (!member) {
        return res.status(404).json({ error: "Member not found" });
      }

      // Extend expiry by 1 month
      const newExpiryDate = new Date(member.expiryDate);
      newExpiryDate.setMonth(newExpiryDate.getMonth() + 1);
      
      // Update member with new expiry and active status
      const updatedMember = await storage.updateMemberStatus(req.params.id, 'active');
      if (updatedMember) {
        updatedMember.expiryDate = newExpiryDate;
        updatedMember.updatedAt = new Date();
      }
      
      console.log("Membership renewed for:", member.email);
      
      res.json({ 
        success: true, 
        member: updatedMember,
        message: "Membership renewed successfully!" 
      });
    } catch (error) {
      console.error("Membership renewal error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Update member status
  app.put("/api/members/:id/status", async (req, res) => {
    try {
      const { status } = req.body;
      if (!["active", "expired", "cancelled"].includes(status)) {
        return res.status(400).json({ error: "Invalid status" });
      }
      
      const member = await storage.updateMemberStatus(req.params.id, status);
      if (!member) {
        return res.status(404).json({ error: "Member not found" });
      }
      
      res.json(member);
    } catch (error) {
      console.error("Error updating member status:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Calculate booking discount
  app.post("/api/bookings/calculate-discount", async (req, res) => {
    try {
      const { email, membershipType, estimatedAmount } = req.body;
      
      if (!email) {
        return res.status(400).json({ error: "Email is required" });
      }
      
      let membershipTier = membershipType;
      let memberExists = false;
      
      // If membership type is not provided, check if user has an existing membership
      if (!membershipTier) {
        const existingMember = await storage.getMemberByEmail(email);
        if (existingMember && existingMember.membershipStatus === 'active') {
          // Check if membership is not expired
          const now = new Date();
          const expiryDate = new Date(existingMember.expiryDate);
          
          if (expiryDate > now) {
            membershipTier = existingMember.membershipType;
            memberExists = true;
          }
        }
      }
      
      const discountInfo = calculateMembershipDiscount(membershipTier, estimatedAmount || 0);
      
      res.json({
        membershipType: membershipTier,
        memberExists,
        discountPercentage: membershipTier === 'Gold' ? 10 : membershipTier === 'Platinum' ? 20 : 0,
        discount: discountInfo.discount,
        discountedAmount: discountInfo.discountedAmount,
        originalAmount: estimatedAmount || 0
      });
    } catch (error) {
      console.error("Error calculating discount:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}

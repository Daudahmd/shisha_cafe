import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const bookings = pgTable("bookings", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull(),
  instagram: text("instagram"),
  services: text("services").array().notNull(),
  eventDate: text("event_date").notNull(),
  eventTime: text("event_time").notNull(),
  location: text("location").notNull(),
  guestCount: text("guest_count").notNull(),
  eventType: text("event_type"),
  flavourPreferences: text("flavour_preferences"),
  specialRequirements: text("special_requirements"),
  budget: text("budget"),
  status: text("status").notNull().default("pending"), // pending, confirmed, completed, cancelled
  termsAccepted: boolean("terms_accepted").notNull().default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export const members = pgTable("members", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull(),
  instagram: text("instagram"),
  membershipType: text("membership_type").notNull(), // Gold or Platinum
  membershipStatus: text("membership_status").notNull().default("pending_payment"), // pending_payment, active, expired, cancelled
  paymentStatus: text("payment_status").notNull().default("pending"), // pending, paid, failed, refunded
  paymentAmount: text("payment_amount"), // Amount paid for membership
  paymentDate: timestamp("payment_date"),
  startDate: timestamp("start_date").defaultNow(),
  expiryDate: timestamp("expiry_date").notNull(),
  totalBookings: text("total_bookings").default("0"),
  discountEligible: boolean("discount_eligible").notNull().default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertBookingSchema = createInsertSchema(bookings).omit({
  id: true,
  createdAt: true,
}).extend({
  services: z.array(z.string()).min(1, "Please select at least one service"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().min(10, "Please enter a valid phone number"),
  termsAccepted: z.boolean().refine(val => val === true, "You must accept the terms and conditions"),
});

export const insertMemberSchema = createInsertSchema(members).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  startDate: true,
  expiryDate: true,
  totalBookings: true,
  discountEligible: true,
  paymentStatus: true,
  paymentDate: true,
}).extend({
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().min(10, "Please enter a valid phone number"),
  membershipType: z.enum(["Gold", "Platinum"]),
  membershipStatus: z.enum(["pending_payment", "active", "expired", "cancelled"]).default("pending_payment").optional(),
  paymentAmount: z.string().optional(),
  instagram: z.string().optional(),
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertBooking = z.infer<typeof insertBookingSchema>;
export type Booking = typeof bookings.$inferSelect;
export type InsertMember = z.infer<typeof insertMemberSchema>;
export type Member = typeof members.$inferSelect;

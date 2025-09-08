import { type User, type InsertUser, type Booking, type InsertBooking, type Member, type InsertMember } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  createBooking(booking: InsertBooking): Promise<Booking>;
  getBookings(): Promise<Booking[]>;
  getBooking(id: string): Promise<Booking | undefined>;
  createMember(member: InsertMember): Promise<Member>;
  getMembers(): Promise<Member[]>;
  getMember(id: string): Promise<Member | undefined>;
  getMemberByEmail(email: string): Promise<Member | undefined>;
  updateMemberStatus(id: string, status: string): Promise<Member | undefined>;
  deleteBooking(id: string): Promise<boolean>;
  updateBookingStatus(id: string, status: string): Promise<Booking | undefined>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private bookings: Map<string, Booking>;
  private members: Map<string, Member>;

  constructor() {
    this.users = new Map();
    this.bookings = new Map();
    this.members = new Map();
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async createBooking(insertBooking: InsertBooking): Promise<Booking> {
    const id = randomUUID();
    const booking: Booking = { 
      ...insertBooking, 
      id,
      status: "pending",
      createdAt: new Date()
    };
    this.bookings.set(id, booking);
    return booking;
  }

  async getBookings(): Promise<Booking[]> {
    const bookings = Array.from(this.bookings.values());
    // Migrate bookings without status to have default status
    bookings.forEach(booking => {
      if (!booking.status) {
        booking.status = 'pending';
        this.bookings.set(booking.id, booking);
      }
    });
    return bookings;
  }

  async getBooking(id: string): Promise<Booking | undefined> {
    return this.bookings.get(id);
  }

  async createMember(insertMember: InsertMember): Promise<Member> {
    const id = randomUUID();
    const member: Member = { 
      ...insertMember, 
      id,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.members.set(id, member);
    return member;
  }

  async getMembers(): Promise<Member[]> {
    return Array.from(this.members.values());
  }

  async getMember(id: string): Promise<Member | undefined> {
    return this.members.get(id);
  }

  async getMemberByEmail(email: string): Promise<Member | undefined> {
    return Array.from(this.members.values()).find(
      (member) => member.email === email,
    );
  }

  async updateMemberStatus(id: string, status: string): Promise<Member | undefined> {
    const member = this.members.get(id);
    if (member) {
      member.membershipStatus = status;
      member.updatedAt = new Date();
      this.members.set(id, member);
    }
    return member;
  }

  async deleteBooking(id: string): Promise<boolean> {
    return this.bookings.delete(id);
  }

  async updateBookingStatus(id: string, status: string): Promise<Booking | undefined> {
    const booking = this.bookings.get(id);
    if (booking) {
      booking.status = status;
      this.bookings.set(id, booking);
    }
    return booking;
  }
}

export const storage = new MemStorage();

import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { auth, signOut } from "@/lib/firebase";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Wine, LogOut, Users, Calendar, Mail, Phone, MapPin } from "lucide-react";
import type { Booking } from "@shared/schema";

export default function AdminDashboard() {
  const { user, loading: authLoading } = useAuth();
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      setLocation("/admin/login");
    }
  }, [user, authLoading, setLocation]);

  const { data: bookings, isLoading, error } = useQuery({
    queryKey: ['/api/bookings'],
    enabled: !!user,
  });

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      toast({
        title: "Signed Out",
        description: "You have been signed out successfully",
      });
      setLocation("/admin/login");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to sign out",
        variant: "destructive",
      });
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Wine className="text-primary text-6xl mx-auto mb-4 animate-spin" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-2">
              <Wine className="text-primary text-2xl" />
              <span className="font-serif font-bold text-xl">ADMIN DASHBOARD</span>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-muted-foreground">
                Welcome, {user.email}
              </span>
              <Button
                onClick={handleSignOut}
                variant="outline"
                size="sm"
                data-testid="button-sign-out"
              >
                <LogOut className="mr-2 h-4 w-4" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-serif font-bold mb-2">Booking Requests</h1>
          <p className="text-muted-foreground">Manage and view all customer booking requests</p>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Users className="text-primary h-8 w-8 mr-3" />
                <div>
                  <p className="text-sm text-muted-foreground">Total Bookings</p>
                  <p className="text-2xl font-bold" data-testid="stats-total-bookings">
                    {isLoading ? "-" : bookings?.length || 0}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Calendar className="text-primary h-8 w-8 mr-3" />
                <div>
                  <p className="text-sm text-muted-foreground">This Month</p>
                  <p className="text-2xl font-bold" data-testid="stats-month-bookings">
                    {isLoading ? "-" : bookings?.filter((booking: Booking) => {
                      const bookingDate = new Date(booking.createdAt || new Date());
                      const currentMonth = new Date().getMonth();
                      return bookingDate.getMonth() === currentMonth;
                    }).length || 0}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Wine className="text-primary h-8 w-8 mr-3" />
                <div>
                  <p className="text-sm text-muted-foreground">Pending Review</p>
                  <p className="text-2xl font-bold" data-testid="stats-pending-bookings">
                    {isLoading ? "-" : bookings?.length || 0}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Bookings Table */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Booking Requests</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-8">
                <Wine className="text-primary text-4xl mx-auto mb-4 animate-spin" />
                <p className="text-muted-foreground">Loading bookings...</p>
              </div>
            ) : error ? (
              <div className="text-center py-8">
                <p className="text-destructive">Error loading bookings</p>
              </div>
            ) : !bookings || bookings.length === 0 ? (
              <div className="text-center py-8">
                <Wine className="text-muted-foreground text-4xl mx-auto mb-4" />
                <p className="text-muted-foreground">No booking requests yet</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Customer</TableHead>
                      <TableHead>Contact</TableHead>
                      <TableHead>Event Details</TableHead>
                      <TableHead>Services</TableHead>
                      <TableHead>Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {bookings.map((booking: Booking) => (
                      <TableRow key={booking.id} data-testid={`booking-row-${booking.id}`}>
                        <TableCell>
                          <div>
                            <p className="font-semibold">
                              {booking.firstName} {booking.lastName}
                            </p>
                            {booking.instagram && (
                              <p className="text-sm text-muted-foreground">
                                @{booking.instagram}
                              </p>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <div className="flex items-center text-sm">
                              <Mail className="h-3 w-3 mr-2" />
                              {booking.email}
                            </div>
                            <div className="flex items-center text-sm">
                              <Phone className="h-3 w-3 mr-2" />
                              {booking.phone}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <div className="flex items-center text-sm">
                              <Calendar className="h-3 w-3 mr-2" />
                              {booking.eventDate} at {booking.eventTime}
                            </div>
                            <div className="flex items-center text-sm">
                              <MapPin className="h-3 w-3 mr-2" />
                              {booking.location.substring(0, 50)}...
                            </div>
                            <div className="flex items-center text-sm">
                              <Users className="h-3 w-3 mr-2" />
                              {booking.guestCount} guests
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            {booking.services.map((service) => (
                              <Badge key={service} variant="secondary" className="mr-1">
                                {service.replace('-', ' ')}
                              </Badge>
                            ))}
                          </div>
                        </TableCell>
                        <TableCell>
                          <p className="text-sm">
                            {booking.createdAt 
                              ? new Date(booking.createdAt).toLocaleDateString()
                              : 'N/A'}
                          </p>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
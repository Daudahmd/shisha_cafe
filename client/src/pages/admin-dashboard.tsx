import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { auth, signOut, getBookings, updateBookingStatus, deleteBooking } from "@/lib/firebase";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Wine, LogOut, Users, Calendar, Mail, Phone, MapPin, CheckCircle, Clock, XCircle, Trash2, Eye, MessageSquare } from "lucide-react";
import type { Booking } from "@shared/schema";

export default function AdminDashboard() {
  const { user, loading: authLoading } = useAuth();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [selectedBooking, setSelectedBooking] = useState<any>(null);

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      setLocation("/admin/login");
    }
  }, [user, authLoading, setLocation]);

  const { data: bookings, isLoading, error, refetch } = useQuery({
    queryKey: ['bookings'],
    queryFn: getBookings,
    enabled: !!user,
  });

  const handleUpdateStatus = async (id: string, status: string) => {
    try {
      await updateBookingStatus(id, status);
      await refetch();
      toast({
        title: "Status Updated",
        description: `Booking status updated to ${status}`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update booking status",
        variant: "destructive",
      });
    }
  };

  const handleDeleteBooking = async (id: string) => {
    try {
      await deleteBooking(id);
      await refetch();
      toast({
        title: "Booking Deleted",
        description: "Booking has been permanently deleted",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete booking",
        variant: "destructive",
      });
    }
  };

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

  const renderBookingTable = (filteredBookings: any[]) => {
    return (
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Customer</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>Event Details</TableHead>
              <TableHead>Services</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredBookings.map((booking: any) => (
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
                    {booking.services.map((service: string) => (
                      <Badge key={service} variant="secondary" className="mr-1">
                        {service.replace('-', ' ')}
                      </Badge>
                    ))}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge 
                    variant={booking.status === 'confirmed' ? 'default' : 
                           booking.status === 'cancelled' ? 'destructive' : 
                           booking.status === 'completed' ? 'outline' : 'secondary'}
                  >
                    {booking.status || 'pending'}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center space-x-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm" onClick={() => setSelectedBooking(booking)}>
                          <Eye className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle>Booking Details</DialogTitle>
                        </DialogHeader>
                        {selectedBooking && (
                          <div className="space-y-6">
                            {/* Customer Information */}
                            <div>
                              <h3 className="text-lg font-semibold mb-3">Customer Information</h3>
                              <div className="grid md:grid-cols-2 gap-4">
                                <div>
                                  <p className="text-sm text-muted-foreground">Name</p>
                                  <p className="font-medium">{selectedBooking.firstName} {selectedBooking.lastName}</p>
                                </div>
                                <div>
                                  <p className="text-sm text-muted-foreground">Email</p>
                                  <p className="font-medium">{selectedBooking.email}</p>
                                </div>
                                <div>
                                  <p className="text-sm text-muted-foreground">Phone</p>
                                  <p className="font-medium">{selectedBooking.phone}</p>
                                </div>
                                {selectedBooking.instagram && (
                                  <div>
                                    <p className="text-sm text-muted-foreground">Instagram</p>
                                    <p className="font-medium">@{selectedBooking.instagram}</p>
                                  </div>
                                )}
                              </div>
                            </div>
                            
                            <Separator />
                            
                            {/* Event Details */}
                            <div>
                              <h3 className="text-lg font-semibold mb-3">Event Details</h3>
                              <div className="grid md:grid-cols-2 gap-4">
                                <div>
                                  <p className="text-sm text-muted-foreground">Date & Time</p>
                                  <p className="font-medium">{selectedBooking.eventDate} at {selectedBooking.eventTime}</p>
                                </div>
                                <div>
                                  <p className="text-sm text-muted-foreground">Guest Count</p>
                                  <p className="font-medium">{selectedBooking.guestCount} guests</p>
                                </div>
                                <div>
                                  <p className="text-sm text-muted-foreground">Event Type</p>
                                  <p className="font-medium">{selectedBooking.eventType || 'Not specified'}</p>
                                </div>
                                <div>
                                  <p className="text-sm text-muted-foreground">Budget Range</p>
                                  <p className="font-medium">{selectedBooking.budget || 'Not specified'}</p>
                                </div>
                                <div className="md:col-span-2">
                                  <p className="text-sm text-muted-foreground">Location</p>
                                  <p className="font-medium">{selectedBooking.location}</p>
                                </div>
                              </div>
                            </div>
                            
                            <Separator />
                            
                            {/* Services */}
                            <div>
                              <h3 className="text-lg font-semibold mb-3">Selected Services</h3>
                              <div className="flex flex-wrap gap-2">
                                {selectedBooking.services.map((service: string) => (
                                  <Badge key={service} variant="secondary" className="text-sm">
                                    {service.replace('-', ' ')}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                            
                            <Separator />
                            
                            {/* Preferences & Requirements */}
                            <div>
                              <h3 className="text-lg font-semibold mb-3">Preferences & Requirements</h3>
                              <div className="space-y-4">
                                {selectedBooking.flavourPreferences && (
                                  <div>
                                    <p className="text-sm text-muted-foreground">Flavour Preferences</p>
                                    <p className="font-medium">{selectedBooking.flavourPreferences}</p>
                                  </div>
                                )}
                                {selectedBooking.specialRequirements && (
                                  <div>
                                    <p className="text-sm text-muted-foreground">Special Requirements</p>
                                    <p className="font-medium">{selectedBooking.specialRequirements}</p>
                                  </div>
                                )}
                              </div>
                            </div>
                            
                            <Separator />
                            
                            {/* Booking Status */}
                            <div>
                              <h3 className="text-lg font-semibold mb-3">Booking Status</h3>
                              <div className="flex items-center space-x-4">
                                <Badge 
                                  variant={selectedBooking.status === 'confirmed' ? 'default' : 
                                         selectedBooking.status === 'cancelled' ? 'destructive' : 
                                         selectedBooking.status === 'completed' ? 'outline' : 'secondary'}
                                  className="text-sm"
                                >
                                  {selectedBooking.status || 'pending'}
                                </Badge>
                                <p className="text-sm text-muted-foreground">
                                  Submitted: {selectedBooking.createdAt ? new Date(selectedBooking.createdAt).toLocaleDateString() : 'N/A'}
                                </p>
                              </div>
                            </div>
                          </div>
                        )}
                      </DialogContent>
                    </Dialog>
                    <Select
                      onValueChange={(value) => handleUpdateStatus(booking.id, value)}
                      defaultValue={booking.status || 'pending'}
                    >
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="confirmed">Confirmed</SelectItem>
                        <SelectItem value="cancelled">Cancelled</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                      </SelectContent>
                    </Select>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="outline" size="sm">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Booking</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete this booking? This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleDeleteBooking(booking.id)}>
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
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
        <div className="grid md:grid-cols-5 gap-6 mb-8">
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
                <Clock className="text-yellow-500 h-8 w-8 mr-3" />
                <div>
                  <p className="text-sm text-muted-foreground">Pending</p>
                  <p className="text-2xl font-bold" data-testid="stats-pending-bookings">
                    {isLoading ? "-" : bookings?.filter((booking: any) => booking.status === 'pending').length || 0}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <CheckCircle className="text-green-500 h-8 w-8 mr-3" />
                <div>
                  <p className="text-sm text-muted-foreground">Confirmed</p>
                  <p className="text-2xl font-bold" data-testid="stats-confirmed-bookings">
                    {isLoading ? "-" : bookings?.filter((booking: any) => booking.status === 'confirmed').length || 0}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Calendar className="text-blue-500 h-8 w-8 mr-3" />
                <div>
                  <p className="text-sm text-muted-foreground">Upcoming</p>
                  <p className="text-2xl font-bold" data-testid="stats-upcoming-bookings">
                    {isLoading ? "-" : bookings?.filter((booking: any) => {
                      const eventDate = new Date(booking.eventDate);
                      const today = new Date();
                      return eventDate > today && booking.status === 'confirmed';
                    }).length || 0}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <CheckCircle className="text-purple-500 h-8 w-8 mr-3" />
                <div>
                  <p className="text-sm text-muted-foreground">Completed</p>
                  <p className="text-2xl font-bold" data-testid="stats-completed-bookings">
                    {isLoading ? "-" : bookings?.filter((booking: any) => booking.status === 'completed').length || 0}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Bookings Tabs */}
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="all">All Bookings</TabsTrigger>
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="confirmed">Confirmed</TabsTrigger>
            <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
            <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all">
            <Card>
              <CardHeader>
                <CardTitle>All Booking Requests</CardTitle>
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
                  renderBookingTable(bookings)
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Other Tab Contents with filtered data */}
          {['pending', 'confirmed', 'cancelled', 'upcoming', 'completed'].map((status) => (
            <TabsContent key={status} value={status}>
              <Card>
                <CardHeader>
                  <CardTitle>{status.charAt(0).toUpperCase() + status.slice(1)} Bookings</CardTitle>
                </CardHeader>
                <CardContent>
                  {(() => {
                    const filteredBookings = bookings?.filter((booking: any) => {
                      if (status === 'upcoming') {
                        const eventDate = new Date(booking.eventDate);
                        const today = new Date();
                        return eventDate > today && booking.status === 'confirmed';
                      }
                      return booking.status === status;
                    }) || [];
                    
                    return filteredBookings.length === 0 ? (
                      <div className="text-center py-8">
                        <Wine className="text-muted-foreground text-4xl mx-auto mb-4" />
                        <p className="text-muted-foreground">No {status} bookings</p>
                      </div>
                    ) : (
                      renderBookingTable(filteredBookings)
                    );
                  })()}
                </CardContent>
              </Card>
            </TabsContent>
          ))}
        </Tabs>
      </main>
    </div>
  );
}
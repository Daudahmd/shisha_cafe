import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { insertBookingSchema, type InsertBooking } from "@shared/schema";
// import { createBooking } from "@/lib/firebase";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";

export default function ContactForm() {
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 5;
  const { toast } = useToast();

  const form = useForm<InsertBooking>({
    resolver: zodResolver(insertBookingSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      instagram: "",
      services: [],
      eventDate: "",
      eventTime: "",
      location: "",
      guestCount: "",
      eventType: "",
      flavourPreferences: "",
      specialRequirements: "",
      budget: "",
      termsAccepted: false,
    },
  });

  const bookingMutation = useMutation({
    mutationFn: async (data: InsertBooking) => {
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to submit booking');
      }
      
      return response.json();
    },
    onSuccess: (result) => {
      console.log("Booking created:", result);
      toast({
        title: "Booking Request Submitted!",
        description: "Thank you for your booking request! We will contact you within 24 hours to confirm availability.",
      });
      form.reset();
      setCurrentStep(1);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to submit booking request. Please try again.",
        variant: "destructive",
      });
      console.error("Booking submission error:", error);
    },
  });

  const onSubmit = (data: InsertBooking) => {
    bookingMutation.mutate(data);
  };

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const progress = (currentStep / totalSteps) * 100;

  const serviceOptions = [
    { value: "shisha-catering", label: "Shisha Catering", description: "Professional shisha service with premium flavours" },
    { value: "mocktail-services", label: "Mocktail Services", description: "Handcrafted mocktails by skilled mixologists" },
    { value: "shisha-rental", label: "Shisha Rental", description: "Rent premium equipment for self-service" }
  ];

  return (
    <section id="contact" className="py-20 bg-muted">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="font-serif text-4xl md:text-5xl font-bold mb-4">Book Your Event</h2>
          <p className="text-xl text-muted-foreground">Let's make your event unforgettable!</p>
        </div>

        <Card className="bg-card">
          <CardContent className="p-8 lg:p-12">
            {/* Progress Indicator */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm text-muted-foreground">Step {currentStep} of {totalSteps}</span>
                <span className="text-sm text-muted-foreground">Progress: {Math.round(progress)}%</span>
              </div>
              <div className="w-full bg-muted-foreground bg-opacity-20 rounded-full h-2">
                <div 
                  className="gradient-gold h-2 rounded-full transition-all duration-300" 
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            </div>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                {/* Step 1: Personal Information */}
                {currentStep === 1 && (
                  <div className="space-y-6">
                    <h3 className="font-serif text-2xl font-semibold mb-6">Personal Information</h3>
                    <div className="grid md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="firstName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>First Name *</FormLabel>
                            <FormControl>
                              <Input {...field} data-testid="input-first-name" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="lastName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Last Name *</FormLabel>
                            <FormControl>
                              <Input {...field} data-testid="input-last-name" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email *</FormLabel>
                            <FormControl>
                              <Input type="email" {...field} data-testid="input-email" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="phone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Phone Number *</FormLabel>
                            <FormControl>
                              <Input type="tel" {...field} data-testid="input-phone" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="instagram"
                        render={({ field }) => (
                          <FormItem className="md:col-span-2">
                            <FormLabel>Instagram Handle (Optional)</FormLabel>
                            <FormControl>
                              <Input placeholder="@username" {...field} data-testid="input-instagram" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                )}

                {/* Step 2: Service Selection */}
                {currentStep === 2 && (
                  <div className="space-y-6">
                    <h3 className="font-serif text-2xl font-semibold mb-6">Service Selection</h3>
                    <FormField
                      control={form.control}
                      name="services"
                      render={() => (
                        <FormItem>
                          <div className="space-y-4">
                            {serviceOptions.map((option) => (
                              <FormField
                                key={option.value}
                                control={form.control}
                                name="services"
                                render={({ field }) => (
                                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                                    <FormControl>
                                      <Checkbox
                                        checked={field.value?.includes(option.value)}
                                        onCheckedChange={(checked) => {
                                          return checked
                                            ? field.onChange([...field.value, option.value])
                                            : field.onChange(
                                                field.value?.filter(
                                                  (value) => value !== option.value
                                                )
                                              )
                                        }}
                                        data-testid={`checkbox-service-${option.value}`}
                                      />
                                    </FormControl>
                                    <div className="space-y-1 leading-none">
                                      <FormLabel className="font-semibold">{option.label}</FormLabel>
                                      <p className="text-sm text-muted-foreground">{option.description}</p>
                                    </div>
                                  </FormItem>
                                )}
                              />
                            ))}
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                )}

                {/* Step 3: Event Details */}
                {currentStep === 3 && (
                  <div className="space-y-6">
                    <h3 className="font-serif text-2xl font-semibold mb-6">Event Details</h3>
                    <div className="grid md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="eventDate"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Event Date *</FormLabel>
                            <FormControl>
                              <Input type="date" {...field} data-testid="input-event-date" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="eventTime"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Event Time *</FormLabel>
                            <FormControl>
                              <Input type="time" {...field} data-testid="input-event-time" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <FormField
                      control={form.control}
                      name="location"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Event Location *</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Full address (Outdoor/Private residence only)" 
                              {...field} 
                              data-testid="textarea-location"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="grid md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="guestCount"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Number of Guests *</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                              <FormControl>
                                <SelectTrigger data-testid="select-guest-count">
                                  <SelectValue placeholder="Select guest count" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="1-10">1-10 guests</SelectItem>
                                <SelectItem value="11-25">11-25 guests</SelectItem>
                                <SelectItem value="26-50">26-50 guests</SelectItem>
                                <SelectItem value="51-100">51-100 guests</SelectItem>
                                <SelectItem value="100+">100+ guests</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="eventType"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Event Type</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                              <FormControl>
                                <SelectTrigger data-testid="select-event-type">
                                  <SelectValue placeholder="Select event type" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="birthday">Birthday Party</SelectItem>
                                <SelectItem value="wedding">Wedding</SelectItem>
                                <SelectItem value="corporate">Corporate Event</SelectItem>
                                <SelectItem value="housewarming">Housewarming</SelectItem>
                                <SelectItem value="celebration">General Celebration</SelectItem>
                                <SelectItem value="other">Other</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                )}

                {/* Step 4: Preferences */}
                {currentStep === 4 && (
                  <div className="space-y-6">
                    <h3 className="font-serif text-2xl font-semibold mb-6">Preferences & Requirements</h3>
                    <FormField
                      control={form.control}
                      name="flavourPreferences"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Preferred Shisha Flavours</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="List any specific flavours you'd like or dietary restrictions" 
                              {...field} 
                              data-testid="textarea-flavour-preferences"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="specialRequirements"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Special Requirements</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Any special setup requirements, accessibility needs, or additional requests" 
                              {...field} 
                              data-testid="textarea-special-requirements"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="budget"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Budget Range (Optional)</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger data-testid="select-budget">
                                <SelectValue placeholder="Select budget range" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="under-500">Under £500</SelectItem>
                              <SelectItem value="500-1000">£500 - £1,000</SelectItem>
                              <SelectItem value="1000-2000">£1,000 - £2,000</SelectItem>
                              <SelectItem value="2000+">£2,000+</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                )}

                {/* Step 5: Confirmation */}
                {currentStep === 5 && (
                  <div className="space-y-6">
                    <h3 className="font-serif text-2xl font-semibold mb-6">Confirmation</h3>
                    <div className="bg-muted rounded-lg p-6 mb-6">
                      <h4 className="font-semibold mb-4">Important Information:</h4>
                      <ul className="space-y-2 text-sm">
                        <li className="flex items-start">
                          <span className="text-primary mr-2">✓</span>
                          Services are available for outdoor locations and private residences only
                        </li>
                        <li className="flex items-start">
                          <span className="text-primary mr-2">✓</span>
                          A deposit is required to secure your booking
                        </li>
                        <li className="flex items-start">
                          <span className="text-primary mr-2">✓</span>
                          Our team will contact you within 24 hours to confirm availability
                        </li>
                        <li className="flex items-start">
                          <span className="text-primary mr-2">✓</span>
                          Final pricing will be provided based on your specific requirements
                        </li>
                      </ul>
                    </div>
                    <FormField
                      control={form.control}
                      name="termsAccepted"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                              data-testid="checkbox-terms"
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel className="text-sm">
                              I agree to the terms and conditions and understand that a deposit is required *
                            </FormLabel>
                          </div>
                        </FormItem>
                      )}
                    />
                    <FormMessage />
                  </div>
                )}

                {/* Navigation Buttons */}
                <div className="flex justify-between pt-8 border-t border-border">
                  <Button
                    type="button"
                    onClick={prevStep}
                    variant="outline"
                    className={currentStep === 1 ? "invisible" : ""}
                    data-testid="button-previous"
                  >
                    Previous
                  </Button>
                  <div className="flex-1"></div>
                  {currentStep < totalSteps ? (
                    <Button
                      type="button"
                      onClick={nextStep}
                      className="gradient-gold text-black font-semibold hover:shadow-lg transition-all duration-300"
                      data-testid="button-next"
                    >
                      Next Step
                    </Button>
                  ) : (
                    <Button
                      type="submit"
                      disabled={bookingMutation.isPending}
                      className="gradient-gold text-black font-semibold hover:shadow-lg transition-all duration-300"
                      data-testid="button-submit"
                    >
                      {bookingMutation.isPending ? "Submitting..." : "Submit Booking Request"}
                    </Button>
                  )}
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}

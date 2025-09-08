import { Check } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function ShishaRentalsSection() {
  const rentalPrices = [
    { quantity: "1 Shisha", price: "$60" },
    { quantity: "2 Shishas", price: "$115" },
    { quantity: "3 Shishas", price: "$165" },
    { quantity: "4 Shishas", price: "$210" },
    { quantity: "5 Shishas", price: "$255" },
    { quantity: "6 Shishas", price: "$300" }
  ];

  const additionalServices = [
    { service: "Electric Charcoal Burner", price: "$25" },
    { service: "Premium Flavours (per flavor)", price: "$15" },
    { service: "Clay Head", price: "$10" },
    { service: "Silicone Head", price: "$12" },
    { service: "Glass Head", price: "$18" },
    { service: "Phunnel Head", price: "$15" }
  ];

  const rentalIncludes = [
    "High-quality shisha equipment",
    "Standard flavor selection",
    "Basic setup instructions",
    "Flexible rental periods",
    "Clean equipment guarantee",
    "Pickup and delivery available"
  ];

  const scrollToContact = () => {
    const element = document.getElementById('contact');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="shisha-rentals" className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="font-serif text-4xl md:text-5xl font-bold mb-4">Shisha Rental Pricing</h2>
          <p className="text-xl text-muted-foreground">Premium equipment rental for your events</p>
        </div>

        {/* Rental Pricing */}
        <div className="mb-16">
          <h3 className="font-serif text-3xl font-semibold text-center mb-12 border-b border-primary pb-4 text-white">
            Rental Prices
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {rentalPrices.map((item, index) => (
              <Card key={index} className="bg-card text-center hover-float gradient-purple" data-testid={`rental-price-${index}`}>
                <CardContent className="p-6">
                  <h4 className="font-serif text-2xl font-bold mb-3 text-white">{item.quantity}</h4>
                  <div className="text-3xl font-bold mb-4 text-white">{item.price}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Additional Services */}
        <div className="mb-16">
          <h3 className="font-serif text-3xl font-semibold text-center mb-12 border-b border-primary pb-4 text-white">
            Additional Services
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {additionalServices.map((item, index) => (
              <Card key={index} className="bg-card text-center hover-float gradient-gold" data-testid={`additional-service-${index}`}>
                <CardContent className="p-6">
                  <h4 className="font-serif text-lg font-bold mb-3 text-white">{item.service}</h4>
                  <div className="text-2xl font-bold text-white">{item.price}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* What's Included */}
        <div className="mb-12">
          <Card className="bg-card max-w-4xl mx-auto">
            <CardContent className="p-8">
              <h3 className="font-serif text-2xl font-semibold text-center mb-8 text-red">
                What's Included with Every Rental
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                {rentalIncludes.map((item, index) => (
                  <div key={index} className="flex items-start">
                    <Check className="text-primary mr-3 h-4 w-4 mt-0.5 flex-shrink-0" />
                    <span className="text-white">{item}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <Button 
            onClick={scrollToContact}
            className="gradient-gold text-black font-semibold hover:shadow-lg transition-all duration-300 px-8 py-3 text-lg"
            data-testid="button-book-rental"
          >
            Book Your Rental
          </Button>
        </div>
      </div>
    </section>
  );
}
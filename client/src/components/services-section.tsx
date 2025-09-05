import { Martini, Home, Check } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export default function ServicesSection() {
  const services = [
    {
      icon: Martini,
      title: "Shisha Catering",
      description: "Professional shisha masters bring premium flavours and equipment directly to your event",
      gradient: "gradient-gold",
      features: [
        "Professional setup & service",
        "Premium tobacco selection", 
        "Luxury equipment provided",
        "Expert flavor recommendations"
      ]
    },
    {
      icon: Martini,
      title: "Mocktail Services", 
      description: "Handcrafted mocktails made with premium ingredients to complement your shisha experience",
      gradient: "gradient-purple",
      features: [
        "Skilled mixologists",
        "Premium ingredients",
        "Custom drink menus",
        "Beautiful presentation"
      ]
    },
    {
      icon: Home,
      title: "Shisha Rentals",
      description: "Rent premium shisha equipment for your private events and parties",
      gradient: "gradient-gold",
      features: [
        "High-quality equipment",
        "Flexible rental periods",
        "Setup instructions included",
        "Competitive pricing"
      ]
    }
  ];

  return (
    <section id="services" className="py-20 bg-muted">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="font-serif text-4xl md:text-5xl font-bold mb-4">Our Premium Services</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Elevate your events with our luxury mobile shisha and mocktail catering services
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <Card key={index} className="bg-card hover-float" data-testid={`service-card-${index}`}>
              <CardContent className="p-8">
                <div className="text-center mb-6">
                  <h3 className="font-serif text-2xl font-semibold mb-4 text-red">{service.title}</h3>
                  <p className="text-muted-foreground mb-6">
                    {service.description}
                  </p>
                </div>
                <ul className="space-y-2 text-sm">
                  {service.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center">
                      <Check className="text-primary mr-2 h-4 w-4" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

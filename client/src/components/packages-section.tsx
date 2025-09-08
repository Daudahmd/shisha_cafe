import { Check } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function PackagesSection() {
  const packages = [
    {
      name: "Standard",
      price: "$250",
      description: "Perfect for small gatherings and intimate events",
      features: [
        "2-hour shisha service",
        "Choice of 3 premium flavors",
        "Professional setup included",
        "Serves up to 6 guests",
        "Basic equipment package",
        "Clean-up service included"
      ],
      popular: false,
      gradient: "gradient-gold"
    },
    {
      name: "Premium",
      price: "$450",
      description: "Enhanced experience for special occasions",
      features: [
        "4-hour shisha service",
        "Choice of 5 premium flavors",
        "Professional chauffeur service",
        "Serves up to 12 guests",
        "Premium equipment package",
        "Mocktail service included",
        "Setup & clean-up service",
        "Custom flavor mixing"
      ],
      popular: true,
      gradient: "gradient-purple"
    },
    {
      name: "Luxury",
      price: "$600",
      description: "Ultimate premium experience for VIP events",
      features: [
        "6-hour shisha service",
        "Unlimited premium flavors",
        "Dedicated chauffeur team",
        "Serves up to 20 guests",
        "Luxury equipment package",
        "Full mocktail bar service",
        "Professional setup & styling",
        "Custom flavor creation",
        "Event coordination",
        "Photography assistance"
      ],
      popular: false,
      gradient: "gradient-gold"
    }
  ];


  return (
    <section id="packages" className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="font-serif text-4xl md:text-5xl font-bold mb-4">Packages</h2>
          <p className="text-xl text-muted-foreground">Choose the perfect package for your event</p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {packages.map((pkg, index) => (
            <Card 
              key={index} 
              className={`bg-card hover-float relative ${pkg.gradient} ${pkg.popular ? 'ring-2 ring-primary' : ''}`}
              data-testid={`package-card-${index}`}
            >
              {pkg.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <span className="bg-primary text-primary-foreground px-4 py-1 rounded-full text-sm font-semibold">
                    Most Popular
                  </span>
                </div>
              )}
              <CardContent className="p-8 flex flex-col h-full">
                <div className="text-center mb-6">
                  <h3 className="font-serif text-3xl font-bold mb-2 text-white bg-primary px-4 py-2 rounded-lg">{pkg.name}</h3>
                  <div className="text-4xl font-bold mb-4 text-white">{pkg.price}</div>
                  <p className="text-sm text-gray-300 mb-6">{pkg.description}</p>
                </div>
                
                <ul className="space-y-3 mb-8 flex-grow">
                  {pkg.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start text-sm">
                      <Check className="text-white mr-3 h-5 w-5 mt-0.5 flex-shrink-0" />
                      <span className="text-white">{feature}</span>
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
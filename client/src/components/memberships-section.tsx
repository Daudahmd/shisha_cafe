import { Check, Crown } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function MembershipsSection() {

  const memberships = [
    {
      name: "Gold",
      price: "$120",
      period: "/Monthly",
      description: "Premium benefits for regular shisha enthusiasts",
      icon: Crown,
      features: [
        "10% discount on all packages",
        "Priority booking guaranteed",
        "Free flavor upgrades",
        "Complimentary setup service",
        "Monthly exclusive flavors access",
        "24/7 customer support",
        "Flexible cancellation policy",
        "Special event invitations"
      ],
      gradient: "gradient-gold",
      popular: false
    },
    {
      name: "Platinum",
      price: "$200",
      period: "/Monthly", 
      description: "Ultimate VIP experience with exclusive perks",
      icon: Crown,
      features: [
        "20% discount on all packages",
        "VIP priority booking",
        "Unlimited premium flavors",
        "Free mocktail service included",
        "Personal chauffeur assigned",
        "Custom event planning",
        "Exclusive member-only events",
        "Free equipment upgrades",
        "Dedicated account manager",
        "Special occasion services"
      ],
      gradient: "gradient-purple",
      popular: true
    }
  ];


  return (
    <section id="memberships" className="py-20 bg-muted">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="font-serif text-4xl md:text-5xl font-bold mb-4">Memberships</h2>
          <p className="text-xl text-muted-foreground">Join our exclusive membership program for premium benefits</p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {memberships.map((membership, index) => (
            <Card 
              key={index} 
              className={`bg-card hover-float relative ${membership.gradient} ${membership.popular ? 'ring-2 ring-primary scale-105' : ''}`}
              data-testid={`membership-card-${index}`}
            >
              {membership.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <span className="bg-primary text-primary-foreground px-4 py-1 rounded-full text-sm font-semibold">
                    Most Popular
                  </span>
                </div>
              )}
              <CardContent className="p-8 flex flex-col h-full">
                <div className="text-center mb-6">
                  <div className="flex justify-center mb-4">
                    <membership.icon className="h-12 w-12 text-white" />
                  </div>
                  <h3 className="font-serif text-3xl font-bold mb-2 text-white bg-primary px-4 py-2 rounded-lg">{membership.name}</h3>
                  <div className="mb-4">
                    <span className="text-4xl font-bold text-white">{membership.price}</span>
                    <span className="text-lg text-gray-300">{membership.period}</span>
                  </div>
                  <p className="text-sm text-gray-300 mb-6">{membership.description}</p>
                </div>
                
                <div className="mb-8 flex-grow">
                  <h4 className="font-semibold text-white mb-4 text-center">What's Included:</h4>
                  <ul className="space-y-3">
                    {membership.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start text-sm">
                        <Check className="text-white mr-3 h-5 w-5 mt-0.5 flex-shrink-0" />
                        <span className="text-white">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
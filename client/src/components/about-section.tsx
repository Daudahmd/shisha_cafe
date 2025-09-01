import { CheckCircle, Wine } from "lucide-react";

export default function AboutSection() {
  const features = [
    "Outdoor & Private Residence Services Only",
    "Professional Setup & Expert Service", 
    "Premium Quality Guaranteed",
    "Deposit Required to Secure Booking"
  ];

  return (
    <section className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="font-serif text-4xl md:text-5xl font-bold mb-6">About Shisha Chauffeurs</h2>
            <p className="text-xl mb-6 text-primary">Where flavor meets finesse 🍇</p>
            <p className="text-lg text-muted-foreground mb-6">
              We are a premium mobile shisha and mocktail catering service that brings luxury directly to your events. 
              Our team of professionals ensures every gathering becomes an unforgettable experience with the finest 
              flavours and impeccable service.
            </p>
            <p className="text-lg text-muted-foreground mb-8">
              Specializing in outdoor locations and private residences, we transform any space into a sophisticated 
              entertainment venue with our premium equipment and expertly crafted experiences.
            </p>
            
            <div className="space-y-4">
              {features.map((feature, index) => (
                <div key={index} className="flex items-center" data-testid={`feature-${index}`}>
                  <CheckCircle className="text-primary mr-3 h-5 w-5" />
                  <span>{feature}</span>
                </div>
              ))}
            </div>
          </div>
          
          <div className="relative">
            <img 
              src="https://images.unsplash.com/photo-1514933651103-005eec06c04b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600" 
              alt="Professional shisha service" 
              className="rounded-xl shadow-2xl"
            />
            <div className="absolute -bottom-6 -right-6 w-32 h-32 gradient-gold rounded-full flex items-center justify-center">
              <Wine className="text-black text-3xl" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

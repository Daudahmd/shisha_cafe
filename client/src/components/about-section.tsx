import { CheckCircle } from "lucide-react";

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
            <p className="text-xl mb-6 text-primary">Where flavor meets finesse</p>
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
              src="https://lh3.googleusercontent.com/pw/AP1GczNvIUwAacYkUVNx6O-SOAQnnTmEV-gqK90NWR0G1HwlZPnlrNXZJ6s21BhEm88xZ6o5onE44Ssv74D0E8kJLiVhJAkYs6_AJC7q2CeUpfFZ8dFewKTkOrtdQrsr4X2vtwjzwN_Xw2DLdnikZABsLCJJ=w854-h683-s-no?authuser=0" 
              alt="Professional shisha service preparation" 
              className="rounded-xl shadow-2xl"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

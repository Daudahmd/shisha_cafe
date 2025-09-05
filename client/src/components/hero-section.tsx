import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function HeroSection() {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="home" className="relative h-screen flex items-center justify-center overflow-hidden">
      {/* Hero background */}
      <div className="absolute inset-0">
        <img 
          src="https://lh3.googleusercontent.com/pw/AP1GczOrQSNMMXMkfvlqyH32IhDel9d5ORHwmV-nHIfYLSv1ya8e7Cc9RngQdbYVctm9a9Z1MhtN3K8OnQlMo76X1Mj19MaqwAk_kA6Xby8OpoG4crYB4LL1zhj97zA1CI2kIhKdCAFAglvDlofj5IIihanJ=w854-h683-s-no?authuser=0" 
          alt="Luxury shisha cafe ambiance" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-60"></div>
      </div>
      
      <div className="relative z-10 text-center max-w-4xl mx-auto px-4">
        <h1 className="font-serif text-5xl md:text-7xl font-bold mb-6 text-shadow">
          LUXURY MOBILE <br />
          <span className="text-primary font-extrabold tracking-wider">SHISHA CATERING</span>
        </h1>
        <p className="text-xl md:text-2xl mb-2 text-muted-foreground">Where flavor meets finesse</p>
        <p className="text-lg md:text-xl mb-8 text-muted-foreground">Premium shisha & mocktail services delivered to your doorstep</p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button 
            onClick={() => scrollToSection('contact')} 
            className="gradient-gold px-8 py-4 rounded-full text-black font-semibold hover:shadow-lg transition-all duration-300 transform hover:scale-105"
            data-testid="button-book-event"
          >
            Book Your Event
          </Button>
          <Button 
            onClick={() => scrollToSection('flavours')} 
            variant="outline"
            className="glass-effect px-8 py-4 rounded-full text-white font-semibold hover:bg-white hover:bg-opacity-10 transition-all duration-300"
            data-testid="button-explore-flavours"
          >
            Explore Flavours
          </Button>
        </div>
      </div>
      
      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <ChevronDown className="text-primary text-2xl" />
      </div>
    </section>
  );
}

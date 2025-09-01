import { Instagram } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function GallerySection() {
  const galleryImages = [
    {
      src: "https://images.unsplash.com/photo-1544427920-c49ccfb85579?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=800",
      alt: "Luxury shisha setup",
      caption: "Wedding Setup"
    },
    {
      src: "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=800",
      alt: "Birthday party setup",
      caption: "Birthday Celebration"
    },
    {
      src: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=800",
      alt: "Corporate event setup",
      caption: "Corporate Event"
    },
    {
      src: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=800",
      alt: "Garden party setup",
      caption: "Garden Party"
    },
    {
      src: "https://images.unsplash.com/photo-1551024506-0bccd828d307?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=800",
      alt: "Rooftop party setup",
      caption: "Rooftop Event"
    },
    {
      src: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=800",
      alt: "House party setup",
      caption: "House Party"
    }
  ];

  return (
    <section id="gallery" className="py-20 bg-muted">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="font-serif text-4xl md:text-5xl font-bold mb-4">Event Gallery</h2>
          <p className="text-xl text-muted-foreground">See our luxury setups in action</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {galleryImages.map((image, index) => (
            <div key={index} className="relative group overflow-hidden rounded-xl" data-testid={`gallery-image-${index}`}>
              <img 
                src={image.src} 
                alt={image.alt} 
                className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <div className="text-center text-white">
                  <Instagram className="text-3xl mb-2 mx-auto" />
                  <p className="font-semibold">{image.caption}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Button 
            asChild
            className="gradient-gold px-8 py-4 rounded-full text-black font-semibold hover:shadow-lg transition-all duration-300 transform hover:scale-105"
            data-testid="button-follow-instagram"
          >
            <a href="https://www.instagram.com/shishachauffeurs/" target="_blank" rel="noopener noreferrer">
              <Instagram className="mr-2 h-5 w-5" />
              Follow Us @shishachauffeurs
            </a>
          </Button>
        </div>
      </div>
    </section>
  );
}

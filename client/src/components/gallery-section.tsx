import { Instagram } from "lucide-react";
import { Button } from "@/components/ui/button";
import luxuryOutdoorSetup from "@assets/generated_images/Luxury_outdoor_shisha_setup_a699a404.png";
import premiumLoungeInterior from "@assets/generated_images/Premium_shisha_lounge_interior_8c0729c8.png";
import elegantPipeCloseup from "@assets/generated_images/Elegant_shisha_pipe_closeup_a817225e.png";
import upscalePatioService from "@assets/generated_images/Upscale_patio_shisha_service_525a35ce.png";
import professionalPreparation from "@assets/generated_images/Professional_shisha_preparation_cda695d2.png";
import luxuryRooftopBar from "@assets/generated_images/Luxury_rooftop_shisha_bar_bd9f4268.png";

export default function GallerySection() {
  const galleryImages = [
    {
      src: luxuryOutdoorSetup,
      alt: "Luxury outdoor shisha setup",
      caption: "Outdoor Event Setup"
    },
    {
      src: premiumLoungeInterior,
      alt: "Premium shisha lounge interior",
      caption: "Premium Lounge Experience"
    },
    {
      src: elegantPipeCloseup,
      alt: "Elegant shisha pipe closeup",
      caption: "Premium Equipment"
    },
    {
      src: upscalePatioService,
      alt: "Upscale patio shisha service",
      caption: "Private Residence Service"
    },
    {
      src: professionalPreparation,
      alt: "Professional shisha preparation",
      caption: "Expert Preparation"
    },
    {
      src: luxuryRooftopBar,
      alt: "Luxury rooftop shisha bar",
      caption: "Rooftop Events"
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

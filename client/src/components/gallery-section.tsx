import { Instagram } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function GallerySection() {
  const galleryImages = [
    {
      src: "https://lh3.googleusercontent.com/pw/AP1GczP-FRnrKUzQHX4h3rFX5DBRwpNjR41QuvgOr-2S5jDEqNNplXwg4ydxC5pFM4hQNGnUSa1mDz3ezAUM255rVxOTBhjoCtaEpA_yoosryeLGv-y0ZOOZ8MgB2_1YiulzC92N4VSXRNHangaDqTxd54ay5Q=w512-h683-s-no?authuser=0",
      alt: "Luxury outdoor shisha setup",
      caption: "Outdoor Event Setup"
    },
    {
      src: "https://lh3.googleusercontent.com/pw/AP1GczPAc3EgZ-ZVaIoD664HFRkpZEYXy9OAKkbzp02u1kd6YgVBpfe6fr5_luMF1soMWbl3j0gTVNQ4h_iJrRHNbezvQ-zUB-4ZA1BiQNV_ii8mgHSiC_RHWzXOc1qb1JyWJRFAwWBVAHtN1x_uk80CX3BHFg=w512-h683-s-no?authuser=0",
      alt: "Premium shisha lounge interior",
      caption: "Premium Lounge Experience"
    },
    {
      src: "https://lh3.googleusercontent.com/pw/AP1GczNs-OAgeTHQGhPQcis1nx135hfFnewdZjy0vs2-HBuLkjn3jCCLSiw6u_OiGHPS3ET8z6DkNeTg5WzOZ8xGb88UKHtbUnLd-zby0bs_fXNiQcEZl0EH3A-HbZyTa2qkgGihiDJjg_bxf6_Gd0fJZRpcXQ=w512-h683-s-no?authuser=0",
      alt: "Elegant shisha pipe closeup",
      caption: "Premium Equipment"
    },
    {
      src: "https://lh3.googleusercontent.com/pw/AP1GczN3qDn5ysxiWEUEAkye-N_xGi-mOP63IzmZ9cDBf5Mj0i627kpZJZTgSW2zOSx7Row1wBPvwiDl6yFEULJD_olvb1EQz8sfL5eqLSPa_uIlQuDmrrT4YHJRDliJ8J9w6P8DyN5vfjkE_mqRnfNAoNDeww=w512-h683-s-no?authuser=0",
      alt: "Upscale patio shisha service",
      caption: "Private Residence Service"
    },
    {
      src: "https://lh3.googleusercontent.com/pw/AP1GczOoPLJF23dRVAOy5vqPBGLULmoJNtEpTdAa05H55gyhl8M2u6UcIgd6B5qP8ujLKxBamhbgfzwNofFUmyWVxEYjRNHgNl69pT9NmDENTAtt2hrCSV7qjRQCQjTk_F1-9JUMB61aCco1tbfCMibKqUFhtQ=w512-h683-s-no?authuser=0",
      alt: "Professional shisha preparation",
      caption: "Expert Preparation"
    },
    {
      src: "https://lh3.googleusercontent.com/pw/AP1GczMi0k9U9UoPmxy9_uYqI0NEbVQUuyU9ASX27FRNoR0LQXkpeYJveI_S6UzB9u8NziZwwbevSKyagg8uqIuGPmoiJ0oS9eImuPG5JX8y67m7wb7f6qjBsUg6soLkUJwonLAT4vqOXB7iie_TxXDwQ3wdVQ=w512-h683-s-no?authuser=0",
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

        <div className="text-center mt-12 space-x-4">
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

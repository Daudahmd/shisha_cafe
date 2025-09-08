import Navigation from "@/components/navigation";
import HeroSection from "@/components/hero-section";
import ServicesSection from "@/components/services-section";
import PackagesSection from "@/components/packages-section";
import MembershipsSection from "@/components/memberships-section";
import ShishaRentalsSection from "@/components/shisha-rentals-section";
import FlavoursMenu from "@/components/flavours-menu";
import GallerySection from "@/components/gallery-section";
import AboutSection from "@/components/about-section";
import ContactForm from "@/components/contact-form";
import Footer from "@/components/footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navigation />
      <HeroSection />
      <AboutSection />
      <ServicesSection />
      <PackagesSection />
      <MembershipsSection />
      <ShishaRentalsSection />
      <FlavoursMenu />
      <GallerySection />
      <ContactForm />
      <Footer />
    </div>
  );
}

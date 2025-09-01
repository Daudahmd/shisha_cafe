import { Wine, Mail, MapPin, Instagram } from "lucide-react";
import { SiTiktok } from "react-icons/si";

export default function Footer() {
  return (
    <footer className="bg-background py-16 border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <Wine className="text-primary text-2xl" />
              <span className="font-serif font-bold text-xl">SHISHA CHAUFFEURS</span>
            </div>
            <p className="text-muted-foreground mb-4">Where flavor meets finesse 🍇</p>
            <p className="text-sm text-muted-foreground">
              Premium mobile shisha and mocktail catering services for your luxury events.
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Contact Information</h4>
            <div className="space-y-2 text-sm">
              <div className="flex items-center">
                <Mail className="text-primary mr-2 h-4 w-4" />
                <a 
                  href="mailto:ShishaChauffeurs@Gmail.Com" 
                  className="hover:text-primary transition-colors"
                  data-testid="link-email"
                >
                  ShishaChauffeurs@Gmail.Com
                </a>
              </div>
              <div className="flex items-center">
                <MapPin className="text-primary mr-2 h-4 w-4" />
                <span className="text-muted-foreground">Outdoor & Private Residences Only</span>
              </div>
            </div>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Follow Us</h4>
            <div className="flex space-x-4">
              <a 
                href="https://www.instagram.com/shishachauffeurs/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-black hover:bg-opacity-80 transition-colors"
                data-testid="link-instagram"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a 
                href="#" 
                className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-black hover:bg-opacity-80 transition-colors"
                data-testid="link-tiktok"
              >
                <SiTiktok className="h-5 w-5" />
              </a>
            </div>
            <p className="text-sm text-muted-foreground mt-4">@shishachauffeurs</p>
          </div>
        </div>
        
        <div className="border-t border-border mt-8 pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; 2024 Shisha Chauffeurs. All rights reserved. | Deposit required for all bookings.</p>
          <div className="mt-4">
            <a 
              href="/admin/login" 
              className="text-xs text-muted-foreground hover:text-primary transition-colors"
              data-testid="link-admin-access"
            >
              Admin Access
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

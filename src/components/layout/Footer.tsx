import { Link } from "react-router-dom";
import { MapPin, Mail, ExternalLink } from "lucide-react";
import focusDeskLogo from "@/assets/focusdesk-logo.png";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const user = localStorage.getItem("focusdesk_user");
  return (
    <footer className="bg-[hsl(207_55%_15%)] text-[hsl(207_20%_90%)]">
      {/* Main Footer Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 items-start">
          {/* Logo & Description */}
          <div className="flex flex-col items-center md:items-start">
            <div className="flex items-center gap-3 mb-4">
              <img 
                src={focusDeskLogo} 
                alt="FocusDesk Logo" 
                className="w-12 h-12 object-contain"
              />
              <div>
                <h3 className="font-semibold text-lg text-white">FocusDesk</h3>
                <p className="text-xs text-[hsl(207_20%_60%)]">Smart Secure Space Access</p>
              </div>
            </div>
            <p className="text-sm text-[hsl(207_20%_60%)] text-center md:text-left max-w-xs">
              Streamlining library and room access with secure QR-based verification and real-time tracking.
            </p>
          </div>

          {/* Quick Links */}
          <div className="flex flex-col items-center">
            <h4 className="font-semibold text-white mb-4">Quick Links</h4>
            <nav className="flex flex-col items-center gap-2">
              <a 
                href="http://localhost:5173/#features" 
                className="text-sm text-[hsl(207_20%_60%)] hover:text-white transition-colors"
              >
                Features
              </a>
              <a 
                href="http://localhost:5173/#how-it-works" 
                className="text-sm text-[hsl(207_20%_60%)] hover:text-white transition-colors"
              >
                How It Works
              </a>
              {user ? (
                <Link 
                  to="/user/viewqr" 
                  className="text-sm text-[hsl(207_20%_60%)] hover:text-white transition-colors"
                >
                  My QR
                </Link>
              ) : (
                <Link 
                  to="/login" 
                  className="text-sm text-[hsl(207_20%_60%)] hover:text-white transition-colors"
                >
                  Get Access
                </Link>
              )}
              <Link 
                to="/admin/login" 
                className="text-sm text-[hsl(207_20%_60%)] hover:text-white transition-colors"
              >
                Admin Portal
              </Link>
            </nav>
          </div>

          {/* Contact & Location */}
          <div className="flex flex-col items-center md:items-end">
            <h4 className="font-semibold text-white mb-4">Built at DTU</h4>
            <div className="flex flex-col items-center md:items-end gap-3">
              <div className="flex items-center gap-2 text-sm text-[hsl(207_20%_60%)]">
                <MapPin className="w-4 h-4" />
                <span>Delhi Technological University</span>
              </div>
              <a 
                href="mailto:contact@focusdesk.in" 
                className="flex items-center gap-2 text-sm text-[hsl(207_20%_60%)] hover:text-white transition-colors"
              >
                <Mail className="w-4 h-4" />
                <span>contact@focusdesk.in</span>
              </a>
              <a 
                href="https://dtu.ac.in" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-[hsl(207_20%_60%)] hover:text-white transition-colors"
              >
                <ExternalLink className="w-4 h-4" />
                <span>dtu.ac.in</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-[hsl(207_40%_25%)]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-sm text-[hsl(207_20%_50%)]">
              © {currentYear} FocusDesk. All rights reserved.
            </p>
            <div className="flex items-center gap-1 text-sm text-[hsl(207_20%_50%)]">
              <span>Mady by Krishna Joshi</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

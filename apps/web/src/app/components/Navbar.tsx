import { useState, useEffect } from "react";
import { Menu, X, Phone } from "lucide-react";
import logoImg from "../../imports/1864a6704a2ffa0192d2ce0eef648091.jpeg";
import { siteContent } from "../data/content";

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-white/95 backdrop-blur-md shadow-sm py-3"
          : "bg-white py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <a href="#" className="flex-shrink-0 flex items-center gap-2">
            <img
              src={logoImg}
              alt={`${siteContent.navigation.companyName} Logo`}
              className="h-10 sm:h-12 w-auto object-contain"
            />
            {/* Fallback text if logo is purely abstract, else usually hidden */}
            <span className="sr-only">{siteContent.navigation.companyName}</span>
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-6 xl:gap-8">
            {siteContent.navigation.links.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-stone-700 hover:text-green-800 font-medium text-sm transition-colors"
              >
                {link.name}
              </a>
            ))}
          </nav>

          {/* CTA Buttons - Desktop */}
          <div className="hidden lg:flex items-center gap-4">
            <a
              href={`tel:${siteContent.contact.phone}`}
              className="flex items-center gap-2 text-stone-700 hover:text-green-800 font-semibold text-sm transition-colors"
            >
              <Phone className="w-4 h-4" />
              <span>{siteContent.navigation.ctaSecondary}</span>
            </a>
            <a
              href="#contact"
              className="bg-green-800 hover:bg-green-900 text-white px-5 py-2.5 rounded-md font-semibold text-sm transition-colors shadow-sm"
            >
              {siteContent.navigation.ctaPrimary}
            </a>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-stone-600 hover:text-stone-900 focus:outline-none"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="lg:hidden absolute top-full left-0 right-0 bg-white border-t border-stone-100 shadow-lg py-4 px-4 flex flex-col gap-4">
          {siteContent.navigation.links.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className="block px-4 py-2 text-stone-800 font-medium hover:bg-stone-50 rounded-md"
              onClick={() => setMobileMenuOpen(false)}
            >
              {link.name}
            </a>
          ))}
          <div className="flex flex-col gap-3 px-4 pt-4 border-t border-stone-100">
            <a
              href={`tel:${siteContent.contact.phone}`}
              className="flex items-center justify-center gap-2 w-full py-3 text-stone-800 border border-stone-300 rounded-md font-semibold"
            >
              <Phone className="w-4 h-4" />
              <span>{siteContent.navigation.ctaSecondary}</span>
            </a>
            <a
              href="#contact"
              className="flex items-center justify-center w-full py-3 bg-green-800 text-white rounded-md font-semibold"
            >
              {siteContent.navigation.ctaPrimary}
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
import { Phone, Mail, MapPin } from "lucide-react";
import logoImg from "../../imports/1864a6704a2ffa0192d2ce0eef648091.jpeg";
import { siteContent } from "../data/content";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-stone-900 text-stone-300 py-16 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Company Summary */}
          <div className="flex flex-col gap-6">
            <a href="#" className="flex items-center gap-2 max-w-[200px]">
              {/* Added bg-white filter or padding since original might have white bg */}
              <div className="bg-white rounded p-2">
                <img src={logoImg} alt={`${siteContent.navigation.companyName} Logo`} className="h-10 w-auto" />
              </div>
            </a>
            <p className="text-sm leading-relaxed text-stone-400">
              {siteContent.footer.companyDescription}
            </p>
            <div className="flex gap-4">
              <a href="#" className="text-stone-400 hover:text-green-500 transition-colors">
                <span className="text-sm font-semibold">Fb</span>
              </a>
              <a href="#" className="text-stone-400 hover:text-green-500 transition-colors">
                <span className="text-sm font-semibold">Ig</span>
              </a>
              <a href="#" className="text-stone-400 hover:text-green-500 transition-colors">
                <span className="text-sm font-semibold">X</span>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-6">{siteContent.footer.quickLinksTitle}</h4>
            <ul className="flex flex-col gap-3">
              {siteContent.navigation.links.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-stone-400 hover:text-green-500 transition-colors text-sm"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Service Areas */}
          <div>
            <h4 className="text-white font-semibold mb-6">{siteContent.footer.areasTitle}</h4>
            <ul className="flex flex-col gap-3">
              {siteContent.areas.locations.slice(0, 6).map((area) => (
                <li key={area}>
                  <a href="#areas" className="text-stone-400 hover:text-green-500 transition-colors text-sm">
                    {area}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-white font-semibold mb-6">{siteContent.footer.contactTitle}</h4>
            <div className="flex flex-col gap-4">
              <a href={`tel:${siteContent.contact.phone}`} className="flex items-start gap-3 group">
                <Phone className="w-5 h-5 text-green-500 group-hover:text-green-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-white font-medium group-hover:text-green-400 transition-colors">{siteContent.contact.phone}</p>
                  <p className="text-xs text-stone-400">{siteContent.footer.phoneLabel}</p>
                </div>
              </a>
              <a href={`mailto:${siteContent.contact.email}`} className="flex items-start gap-3 group">
                <Mail className="w-5 h-5 text-green-500 group-hover:text-green-400 mt-0.5 flex-shrink-0" />
                <span className="text-stone-400 group-hover:text-green-400 transition-colors text-sm">{siteContent.contact.email}</span>
              </a>
              <div className="flex items-start gap-3 mt-2">
                <MapPin className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                <span className="text-stone-400 text-sm leading-relaxed">
                  {siteContent.footer.locationText.split('\n').map((line, i) => (
                    <span key={i}>
                      {line}
                      {i === 0 && <br />}
                    </span>
                  ))}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-stone-800 mt-16 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-stone-500 text-sm">
            &copy; {currentYear} {siteContent.footer.copyright}
          </p>
          <div className="flex gap-4 text-sm text-stone-500">
            <a href="#" className="hover:text-white transition-colors">{siteContent.footer.privacyPolicy}</a>
            <a href="#" className="hover:text-white transition-colors">{siteContent.footer.termsOfService}</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

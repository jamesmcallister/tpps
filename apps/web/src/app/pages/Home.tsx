import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { siteContent } from "../data/content";
import { serviceRoutes } from "../data/routes";
import heroImage from "../../assets/hero-landscaping.jpg";
import patioPathwaysCardImage from "../../assets/home/patios-pathways-card.jpg";
import screenFencingCardImage from "../../assets/home/fencing-card.jpg";
import treeWorkCardImage from "../../assets/home/tree-work-card.jpg";

const phoneHref = siteContent.contact.phone
  ? `tel:${siteContent.contact.phone.replace(/\s+/g, "")}`
  : undefined;
const phoneNumber = siteContent.contact.phone;
const emailHref = `mailto:${siteContent.contact.email}`;
const serviceCardImages: Record<string, string> = {
  "garden-design":
    "https://images.unsplash.com/photo-1595387426256-cc153122a6f1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsYW5kc2NhcGUlMjBkZXNpZ258ZW58MXx8fHwxNzc2NjEzNDU1fDA&ixlib=rb-4.1.0&q=60&w=480&utm_source=figma&utm_medium=referral",
  "patios-pathways": patioPathwaysCardImage.src,
  driveways:
    "https://images.unsplash.com/photo-1770446722312-0fcf39b62900?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHxicmljayUyMGRyaXZld2F5fGVufDF8fHx8MTc3NjYxMzQ1NXww&ixlib=rb-4.1.0&q=60&w=480&utm_source=figma&utm_medium=referral",
  fencing: screenFencingCardImage.src,
  groundworks:
    "https://images.unsplash.com/photo-1759579471642-8295d40db07c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHxncm91bmR3b3JrJTIwY29uc3RydWN0aW9uJTIwZGlnZ2VyfGVufDF8fHx8MTc3NjYxMzQ1Nnww&ixlib=rb-4.1.0&q=60&w=480&utm_source=figma&utm_medium=referral",
  "garden-maintenance":
    "https://images.unsplash.com/photo-1683316924890-6a8c5ab10d29?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHxnYXJkZW4lMjBtYWludGVuYW5jZXxlbnwxfHx8fDE3NzY2MTM0NTh8MA&ixlib=rb-4.1.0&q=60&w=480&utm_source=figma&utm_medium=referral",
  "tree-removal": treeWorkCardImage.src,
};

const serviceCards = serviceRoutes.map(({ path, service }) => {
  const copy = siteContent.services.items.find((item) => item.id === service.id);

  return {
    title: copy?.title ?? service.name,
    desc: copy?.description ?? service.description,
    href: path,
    img: serviceCardImages[service.id],
  };
});

export function Home() {
  return (
    <div className="w-full">
      {/* Hero Section */}
      <section id="hero" className="relative min-h-[90vh] flex items-center pt-20">
        <div className="absolute inset-0 z-0">
          <img
            src={heroImage.src}
            width={heroImage.width}
            height={heroImage.height}
            alt="Beautiful garden patio"
            fetchPriority="high"
            decoding="async"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-stone-900/60 mix-blend-multiply"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-20 lg:py-32">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
              {siteContent.hero.title}
            </h1>
            <p className="text-lg md:text-xl text-stone-200 mb-10 leading-relaxed font-light">
              {siteContent.hero.subtitle}
            </p>
            <div className="mb-8 w-full max-w-3xl rounded-xl border border-white/25 bg-stone-950/45 p-5 shadow-2xl backdrop-blur-md sm:p-8">
              <p className="mb-5 text-base font-medium text-stone-100">
                Prefer to chat? Call Tim directly
              </p>
              <div className="mb-7 flex items-center gap-4">
                <span className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-green-700 text-white shadow-lg sm:h-14 sm:w-14">
                  <svg
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                    />
                  </svg>
                </span>
                <a
                  href={phoneHref ?? "#contact"}
                  aria-label={
                    phoneHref && phoneNumber
                      ? `Call Tim at TPPS Landscapes on ${phoneNumber}`
                      : undefined
                  }
                  className="text-3xl font-bold tracking-normal text-white transition-colors hover:text-green-100 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-stone-900 sm:text-4xl"
                >
                  {phoneNumber}
                </a>
              </div>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <a
                  href={phoneHref ?? "#contact"}
                  aria-label={
                    phoneHref && phoneNumber ? `Call TPPS Landscapes on ${phoneNumber}` : undefined
                  }
                  className="flex min-h-14 items-center justify-center gap-2 rounded-md bg-green-800 px-6 py-4 text-center text-base font-semibold text-white shadow-lg transition-colors hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-stone-900"
                >
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                    />
                  </svg>
                  Call Now
                </a>
                <a
                  href={emailHref}
                  className="flex min-h-14 items-center justify-center gap-2 rounded-md bg-white px-6 py-4 text-center text-base font-semibold text-stone-900 shadow-lg transition-colors hover:bg-stone-50 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-stone-900"
                >
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                  Email Enquiry
                </a>
              </div>
            </div>

            <p className="mb-14 max-w-3xl text-center text-sm text-stone-200 sm:text-base">
              Most customers find it easier to discuss projects over the phone
            </p>

            {/* Trust Points */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 pt-8 border-t border-white/20">
              {siteContent.hero.trustPoints.map((point, index) => (
                <div key={index} className="flex items-center gap-3 text-stone-300 text-sm">
                  <div className="w-2 h-2 rounded-full bg-green-500 flex-shrink-0"></div>
                  <span>{point}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Intro / About Section */}
      <section id="about" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="inline-block px-4 py-1.5 bg-green-50 text-green-800 font-medium rounded-full text-sm mb-6">
                {siteContent.about.badge}
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-stone-900 mb-8 leading-tight">
                {siteContent.about.title}
              </h2>
              <div className="prose prose-lg text-stone-600">
                {siteContent.about.paragraphs.map((paragraph, index) => (
                  <p
                    key={paragraph}
                    className={index < siteContent.about.paragraphs.length - 1 ? "mb-6" : undefined}
                  >
                    {paragraph}
                  </p>
                ))}
              </div>
              <div className="mt-10 flex items-center gap-6">
                <a
                  href="#services"
                  className="text-green-800 font-semibold hover:text-green-900 flex items-center gap-2 transition-colors border-b-2 border-transparent hover:border-green-800 pb-1"
                >
                  {siteContent.about.linkText} <span aria-hidden="true">&rarr;</span>
                </a>
              </div>
            </div>
            <div className="relative h-[600px] rounded-2xl overflow-hidden shadow-2xl">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1758524051476-cf120cb3f1e3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBsYW5kc2NhcGVyJTIwd29ya2luZ3xlbnwxfHx8fDE3NzY2MTM0NTV8MA&ixlib=rb-4.1.0&q=60&w=480&utm_source=figma&utm_medium=referral"
                alt="Professional landscaper working"
                loading="lazy"
                decoding="async"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-900/40 to-transparent"></div>

              {/* Floating badge */}
              <div className="absolute bottom-8 left-8 bg-white p-6 rounded-xl shadow-xl flex items-center gap-4">
                <div className="bg-green-100 p-3 rounded-full">
                  <svg
                    className="w-8 h-8 text-green-800"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <div>
                  <div className="font-bold text-stone-900 text-xl">Clear written estimates</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-24 bg-stone-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-stone-900 mb-6">
              {siteContent.services.heading}
            </h2>
            <p className="text-lg text-stone-600">{siteContent.services.subtitle}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {serviceCards.map((service, index) => (
              <a
                key={index}
                href={service.href}
                className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-shadow duration-300 border border-stone-100 group flex flex-col focus:outline-none focus:ring-2 focus:ring-green-800 focus:ring-offset-4"
              >
                <div className="h-60 overflow-hidden relative">
                  <div className="absolute inset-0 bg-stone-900/10 group-hover:bg-transparent transition-colors z-10"></div>
                  <ImageWithFallback
                    src={service.img}
                    alt={service.title}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-8 flex-grow flex flex-col">
                  <h3 className="text-xl font-bold text-stone-900 mb-3">{service.title}</h3>
                  <p className="text-stone-600 mb-6 flex-grow">{service.desc}</p>
                  <span className="text-green-800 font-semibold group-hover:text-green-900 flex items-center gap-2">
                    Learn more{" "}
                    <span className="transform group-hover:translate-x-1 transition-transform">
                      &rarr;
                    </span>
                  </span>
                </div>
              </a>
            ))}
          </div>

          <div className="mt-12 text-center">
            <div className="inline-flex items-center gap-4 bg-white px-6 py-4 rounded-xl shadow-sm border border-stone-100 text-stone-700">
              <span className="text-green-800 font-semibold">
                {siteContent.services.additionalServicesLabel}
              </span>
              <span>{siteContent.services.additionalServices}</span>
              <span className="w-1 h-1 rounded-full bg-stone-300"></span>
              <a href="#contact" className="text-green-800 hover:underline font-semibold">
                {siteContent.services.additionalServicesLink}
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose TPPS Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-stone-900 mb-6">
                {siteContent.whyChoose.heading}
              </h2>
              <p className="text-lg text-stone-600 mb-10">{siteContent.whyChoose.subtitle}</p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {siteContent.whyChoose.points.map((point, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-4 p-4 rounded-xl bg-stone-50 border border-stone-100 hover:border-green-200 transition-colors"
                  >
                    <div className="bg-green-100 p-2 rounded-lg text-green-800 mt-1 flex-shrink-0">
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-semibold text-stone-900">{point}</h4>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Project approach */}
            <div className="bg-stone-900 rounded-3xl overflow-hidden relative shadow-2xl">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1704457030855-9d7e726e48a1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBnYXJkZW4lMjBkZXNpZ24lMjBmaW5pc2hlZHxlbnwxfHx8fDE3NzY2MTM0NTh8MA&ixlib=rb-4.1.0&q=60&w=480&utm_source=figma&utm_medium=referral"
                alt="Finished garden landscaping"
                loading="lazy"
                decoding="async"
                className="w-full h-full object-cover opacity-60 mix-blend-overlay absolute inset-0"
              />
              <div className="relative z-10 p-10 md:p-14 h-full flex flex-col justify-end min-h-[500px] bg-gradient-to-t from-stone-900 via-stone-900/40 to-transparent">
                <div className="inline-block px-4 py-1.5 bg-green-800 text-white font-medium rounded-full text-xs uppercase tracking-wider mb-6 w-fit">
                  {siteContent.whyChoose.featuredProject.badge}
                </div>
                <h3 className="text-3xl font-bold text-white mb-4">
                  {siteContent.whyChoose.featuredProject.title}
                </h3>
                <p className="text-stone-300 text-lg mb-8 max-w-md leading-relaxed">
                  {siteContent.whyChoose.featuredProject.description}
                </p>
                <a
                  href="#work"
                  className="inline-flex items-center gap-2 bg-white text-stone-900 px-6 py-3 rounded-md font-semibold hover:bg-stone-100 transition-colors w-fit"
                >
                  {siteContent.whyChoose.featuredProject.ctaText}
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Areas We Cover */}
      <section id="areas" className="py-24 bg-stone-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-3xl p-10 md:p-16 shadow-sm border border-stone-200 text-center max-w-4xl mx-auto relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-green-50 rounded-full blur-3xl -mr-32 -mt-32"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-stone-50 rounded-full blur-3xl -ml-32 -mb-32"></div>

            <div className="relative z-10">
              <div className="w-16 h-16 bg-green-100 text-green-800 rounded-2xl flex items-center justify-center mx-auto mb-8">
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-stone-900 mb-6">
                {siteContent.areas.heading}
              </h2>
              <div className="text-lg text-stone-600 mb-10 max-w-2xl mx-auto leading-relaxed space-y-4">
                {siteContent.areas.description.split("\n\n").map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>

              <div className="flex flex-wrap justify-center gap-3">
                {siteContent.areas.locations.map((area, idx) => (
                  <span
                    key={idx}
                    className="px-5 py-2.5 bg-white border border-stone-200 shadow-sm rounded-full text-stone-700 font-medium text-sm"
                  >
                    {area}
                  </span>
                ))}
                {siteContent.areas.additionalText && (
                  <span className="px-5 py-2.5 bg-stone-50 border border-stone-200 border-dashed rounded-full text-stone-500 font-medium text-sm italic">
                    {siteContent.areas.additionalText}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Work Types */}
      <section id="work" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-[0.85fr_1.15fr] gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-stone-900 mb-6">
                Landscaping work across Thanet and East Kent
              </h2>
              <p className="text-lg text-stone-600 leading-relaxed mb-8">
                Most projects start with a practical conversation about the space, access, levels,
                drainage and the finish you want. These are the types of work we can help with now.
              </p>
              <a
                href="#contact"
                className="inline-flex items-center gap-2 bg-green-800 text-white px-6 py-3 rounded-md font-semibold hover:bg-green-900 transition-colors"
              >
                Discuss a similar project <span aria-hidden="true">&rarr;</span>
              </a>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {[
                "Patio and pathway installations",
                "Driveway preparation and installation",
                "Garden design and planting structure",
                "Fencing, drainage and site clearance",
              ].map((item) => (
                <div
                  key={item}
                  className="rounded-xl border border-stone-200 bg-stone-50 p-6 shadow-sm"
                >
                  <h3 className="font-bold text-stone-900 mb-2">{item}</h3>
                  <p className="text-sm text-stone-600">
                    Available across Thanet and the wider East Kent area.
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section id="contact" className="py-24 bg-green-900 relative overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-10">
          <ImageWithFallback
            src="https://images.unsplash.com/photo-1761637823276-7d714eb45cb1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiZWF1dGlmdWwlMjBnYXJkZW4lMjBwYXRpb3xlbnwxfHx8fDE3NzY2MTM0NTR8MA&ixlib=rb-4.1.0&q=60&w=480&utm_source=figma&utm_medium=referral"
            alt=""
            aria-hidden="true"
            loading="lazy"
            decoding="async"
            className="w-full h-full object-cover grayscale"
          />
        </div>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            {siteContent.cta.heading}
          </h2>
          <p className="text-xl text-green-100 mb-12 max-w-2xl mx-auto font-light">
            {siteContent.cta.subtitle}
          </p>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <a
              href="#contact"
              className="flex min-h-14 items-center justify-center rounded-md bg-white px-6 py-4 text-center text-base font-bold text-green-900 shadow-xl transition-colors hover:bg-stone-50 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-green-950"
            >
              Request a quote
            </a>
            <a
              href={phoneHref ?? "#contact"}
              aria-label={
                phoneHref && phoneNumber ? `Call TPPS Landscapes on ${phoneNumber}` : undefined
              }
              className="flex min-h-14 items-center justify-center gap-2 rounded-md bg-green-700 px-6 py-4 text-center text-base font-bold text-white shadow-lg transition-colors hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-green-950"
            >
              {phoneHref ? (
                <svg
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                  />
                </svg>
              ) : null}
              Call TPPS
            </a>
            <a
              href={emailHref}
              className="flex min-h-14 items-center justify-center rounded-md border border-white/30 bg-white/10 px-6 py-4 text-center text-base font-bold text-white shadow-lg transition-colors hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-green-950"
            >
              {siteContent.cta.primaryButton}
            </a>
            <a
              href="#services"
              className="flex min-h-14 items-center justify-center rounded-md border border-white/30 px-6 py-4 text-center text-base font-bold text-white transition-colors hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-green-950"
            >
              {siteContent.cta.secondaryButton}
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}

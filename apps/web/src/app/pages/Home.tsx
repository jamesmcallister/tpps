import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { siteContent } from "../data/content";

export function Home() {
  return (
    <div className="w-full">
      {/* Hero Section */}
      <section id="hero" className="relative min-h-[90vh] flex items-center pt-20">
        <div className="absolute inset-0 z-0">
          <ImageWithFallback
            src="https://images.unsplash.com/photo-1761637823276-7d714eb45cb1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiZWF1dGlmdWwlMjBnYXJkZW4lMjBwYXRpb3xlbnwxfHx8fDE3NzY2MTM0NTR8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
            alt="Beautiful garden patio"
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
            <div className="flex flex-col sm:flex-row gap-4 mb-16">
              <a
                href="#contact"
                className="bg-green-800 hover:bg-green-700 text-white px-8 py-4 rounded-md font-semibold text-lg transition-colors shadow-lg text-center"
              >
                {siteContent.hero.ctaPrimary}
              </a>
              <a
                href={`tel:${siteContent.contact.phone}`}
                className="bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/30 text-white px-8 py-4 rounded-md font-semibold text-lg transition-colors shadow-lg text-center flex items-center justify-center gap-2"
              >
                {siteContent.hero.ctaSecondary}
              </a>
            </div>

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
                <p className="mb-6">{siteContent.about.paragraphs[0]}</p>
                <p>{siteContent.about.paragraphs[1]}</p>
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
                src="https://images.unsplash.com/photo-1758524051476-cf120cb3f1e3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBsYW5kc2NhcGVyJTIwd29ya2luZ3xlbnwxfHx8fDE3NzY2MTM0NTV8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                alt="Professional landscaper working"
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
                  <div className="font-bold text-stone-900 text-xl">100%</div>
                  <div className="text-stone-500 text-sm font-medium">Satisfaction Focus</div>
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
            {[
              {
                title: siteContent.services.items[0].title,
                desc: siteContent.services.items[0].description,
                img: "https://images.unsplash.com/photo-1595387426256-cc153122a6f1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsYW5kc2NhcGUlMjBkZXNpZ258ZW58MXx8fHwxNzc2NjEzNDU1fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
              },
              {
                title: siteContent.services.items[1].title,
                desc: siteContent.services.items[1].description,
                img: "https://images.unsplash.com/photo-1603518147332-ba54b96276a3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdG9uZSUyMHBhdGlvfGVufDF8fHx8MTc3NjYxMzQ1NXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
              },
              {
                title: siteContent.services.items[2].title,
                desc: siteContent.services.items[2].description,
                img: "https://images.unsplash.com/photo-1770446722312-0fcf39b62900?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxicmljayUyMGRyaXZld2F5fGVufDF8fHx8MTc3NjYxMzQ1NXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
              },
              {
                title: siteContent.services.items[3].title,
                desc: siteContent.services.items[3].description,
                img: "https://images.unsplash.com/photo-1763909129965-67e92392f861?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b29kZW4lMjBnYXJkZW4lMjBmZW5jZXxlbnwxfHx8fDE3NzY2MDYyMjF8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
              },
              {
                title: siteContent.services.items[4].title,
                desc: siteContent.services.items[4].description,
                img: "https://images.unsplash.com/photo-1759579471642-8295d40db07c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxncm91bmR3b3JrJTIwY29uc3RydWN0aW9uJTIwZGlnZ2VyfGVufDF8fHx8MTc3NjYxMzQ1Nnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
              },
              {
                title: siteContent.services.items[5].title,
                desc: siteContent.services.items[5].description,
                img: "https://images.unsplash.com/photo-1683316924890-6a8c5ab10d29?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnYXJkZW4lMjBtYWludGVuYW5jZXxlbnwxfHx8fDE3NzY2MTM0NTh8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
              },
            ].map((service, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-shadow duration-300 border border-stone-100 group cursor-pointer flex flex-col"
              >
                <div className="h-60 overflow-hidden relative">
                  <div className="absolute inset-0 bg-stone-900/10 group-hover:bg-transparent transition-colors z-10"></div>
                  <ImageWithFallback
                    src={service.img}
                    alt={service.title}
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
              </div>
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

            {/* Featured Project */}
            <div className="bg-stone-900 rounded-3xl overflow-hidden relative shadow-2xl">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1704457030855-9d7e726e48a1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBnYXJkZW4lMjBkZXNpZ24lMjBmaW5pc2hlZHxlbnwxfHx8fDE3NzY2MTM0NTh8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                alt="Outdoor Spaces Built to Last"
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
                  href="#gallery"
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
              <p className="text-lg text-stone-600 mb-10 max-w-2xl mx-auto leading-relaxed">
                {siteContent.areas.description}
              </p>

              <div className="flex flex-wrap justify-center gap-3">
                {siteContent.areas.locations.map((area, idx) => (
                  <span
                    key={idx}
                    className="px-5 py-2.5 bg-white border border-stone-200 shadow-sm rounded-full text-stone-700 font-medium text-sm"
                  >
                    {area}
                  </span>
                ))}
                <span className="px-5 py-2.5 bg-stone-50 border border-stone-200 border-dashed rounded-full text-stone-500 font-medium text-sm italic">
                  {siteContent.areas.additionalText}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-stone-900 mb-6">
              {siteContent.testimonials.heading}
            </h2>
            <p className="text-lg text-stone-600">{siteContent.testimonials.subtitle}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {siteContent.testimonials.reviews.map((testimonial, idx) => (
              <div key={idx} className="bg-stone-50 p-8 rounded-2xl relative">
                <svg
                  className="w-10 h-10 text-stone-200 absolute top-6 right-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                </svg>
                <div className="flex gap-1 text-yellow-400 mb-6">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-stone-700 italic mb-8 relative z-10">"{testimonial.text}"</p>
                <div>
                  <div className="font-bold text-stone-900">{testimonial.author}</div>
                  <div className="text-sm text-stone-500">{testimonial.location}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section id="contact" className="py-24 bg-green-900 relative overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-10">
          <ImageWithFallback
            src="https://images.unsplash.com/photo-1761637823276-7d714eb45cb1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiZWF1dGlmdWwlMjBnYXJkZW4lMjBwYXRpb3xlbnwxfHx8fDE3NzY2MTM0NTR8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
            alt="Background"
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

          <div className="flex flex-col sm:flex-row justify-center gap-6">
            <a
              href={`mailto:${siteContent.contact.email}`}
              className="bg-white hover:bg-stone-50 text-green-900 px-8 py-4 rounded-md font-bold text-lg transition-colors shadow-xl text-center"
            >
              {siteContent.cta.primaryButton}
            </a>
            <a
              href={`tel:${siteContent.contact.phone}`}
              className="bg-green-800 hover:bg-green-700 border border-green-700 text-white px-8 py-4 rounded-md font-bold text-lg transition-colors shadow-lg text-center flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                />
              </svg>
              {siteContent.cta.secondaryButton}
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}

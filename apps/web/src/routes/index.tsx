import { useEffect, useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import '../App.css'

const navLinks = [
  { label: 'Home', href: '#top' },
  { label: 'Services', href: '#services' },
  { label: 'About', href: '#about' },
  { label: 'Gallery', href: '#gallery' },
  { label: 'Areas We Cover', href: '#areas' },
  { label: 'Contact', href: '#contact' },
]

const trustPoints = [
  'Free quotations and site surveys',
  'Fully licensed and insured',
  'Local and reliable',
  'Quality workmanship',
]

const services = [
  {
    title: 'Garden Design and Planning',
    description:
      'Bespoke outdoor spaces designed to suit your property, style, and lifestyle.',
    image:
      'https://images.unsplash.com/photo-1598902108854-10e335adac99?auto=format&fit=crop&w=900&q=80',
  },
  {
    title: 'Patios and Pathways',
    description:
      'Beautiful, durable patios and walkways built with proper preparation and quality materials.',
    image:
      'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=900&q=80',
  },
  {
    title: 'Driveway Installation',
    description:
      'Block paving, gravel, and tarmac surfaces built for kerb appeal and long-term performance.',
    image:
      'https://images.unsplash.com/photo-1460317442991-0ec209397118?auto=format&fit=crop&w=900&q=80',
  },
  {
    title: 'Fencing',
    description:
      'Strong, attractive fencing for privacy, security, and a clean finish to your outdoor space.',
    image:
      'https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&w=900&q=80',
  },
  {
    title: 'Groundworks',
    description:
      'Professional groundwork services including excavation, levelling, drainage, and sub-base prep.',
    image:
      'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=900&q=80',
  },
  {
    title: 'Garden Renovation and Maintenance',
    description:
      'From full overhauls to practical upgrades, we create outdoor spaces that are easy to enjoy.',
    image:
      'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=900&q=80',
  },
]

const reasons = [
  'Local Thanet company',
  'Fully licensed and insured',
  'Free quotations and surveys',
  'Skilled and experienced team',
  'Quality materials',
  'Attention to detail',
  'Friendly, reliable service',
  'Built to last',
]

const projects = [
  {
    title: 'Contemporary sandstone patio',
    location: 'Broadstairs',
    description: 'Clean lines, soft planting, and a practical seating layout for family use.',
    image:
      'https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=900&q=80',
  },
  {
    title: 'Driveway and frontage refresh',
    location: 'Ramsgate',
    description: 'A smarter arrival space with better drainage and a crisp, durable finish.',
    image:
      'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=900&q=80',
  },
  {
    title: 'Garden transformation',
    location: 'Margate',
    description: 'Layered textures, fencing, and new lawn areas designed for easy maintenance.',
    image:
      'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=900&q=80',
  },
]

const areas = [
  'Broadstairs',
  'Ramsgate',
  'Margate',
  'Westgate-on-Sea',
  'Birchington',
  'Sandwich',
  'Deal',
  'Other nearby areas on request',
]

const testimonials = [
  {
    quote:
      'TPPS transformed our tired garden into a proper outdoor living space. The patio looks brilliant and the finish is spot on.',
    author: 'Sarah J.',
    location: 'Broadstairs',
  },
  {
    quote:
      'Professional, reliable, and tidy from start to finish. Our new driveway has completely changed the front of the house.',
    author: 'Mark and Emma',
    location: 'Ramsgate',
  },
  {
    quote:
      'The groundwork and landscaping were handled with real care. Honest advice, clear communication, and quality workmanship.',
    author: 'David L.',
    location: 'Margate',
  },
]

function App() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16)
    onScroll()
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const closeMenu = () => setMenuOpen(false)

  return (
    <div className="site-shell" id="top">
      <header className={`site-header ${scrolled ? 'site-header--scrolled' : ''}`}>
        <div className="container header-row">
          <a className="brand" href="#top" aria-label="TPPS Landscapes Ltd home">
            <span className="brand-mark">TP</span>
            <span className="brand-copy">
              <strong>TPPS Landscapes Ltd</strong>
              <span>Landscaping, patios and driveways across Thanet</span>
            </span>
          </a>

          <nav className="desktop-nav" aria-label="Primary navigation">
            {navLinks.map((link) => (
              <a key={link.href} href={link.href}>
                {link.label}
              </a>
            ))}
          </nav>

          <div className="header-actions">
            <a className="phone-link" href="tel:01234567890">
              01234 567890
            </a>
            <a className="button button--primary" href="#contact">
              Get a Free Quote
            </a>
            <button
              className="menu-toggle"
              type="button"
              onClick={() => setMenuOpen((open) => !open)}
              aria-expanded={menuOpen}
              aria-controls="mobile-nav"
            >
              Menu
            </button>
          </div>
        </div>

        {menuOpen ? (
          <div className="mobile-nav" id="mobile-nav">
            <div className="container mobile-nav__inner">
              {navLinks.map((link) => (
                <a key={link.href} href={link.href} onClick={closeMenu}>
                  {link.label}
                </a>
              ))}
              <a href="tel:01234567890" onClick={closeMenu}>
                Call now
              </a>
            </div>
          </div>
        ) : null}
      </header>

      <main>
        <section className="hero-section">
          <div className="hero-media" />
          <div className="hero-overlay" />
          <div className="container hero-grid">
            <div className="hero-copy">
              <p className="eyebrow">Trusted outdoor improvements in Thanet and East Kent</p>
              <h1>Thanet&apos;s local landscaping, patio and driveway specialists</h1>
              <p className="hero-text">
                TPPS Landscapes Ltd delivers high-quality landscaping, patios,
                driveways, fencing, groundworks, and garden transformations across
                Broadstairs, Ramsgate, Margate, and surrounding areas.
              </p>
              <div className="hero-actions">
                <a className="button button--primary" href="#contact">
                  Get a Free Quote
                </a>
                <a className="button button--ghost" href="tel:01234567890">
                  Call Us Today
                </a>
              </div>
            </div>

            <div className="hero-panel">
              <p>Built for homeowners who want a reliable local team, honest advice, and a finish that lasts.</p>
              <ul className="trust-list">
                {trustPoints.map((point) => (
                  <li key={point}>{point}</li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <section className="section section--light" id="about">
          <div className="container about-grid">
            <div>
              <p className="eyebrow eyebrow--green">About TPPS Landscapes</p>
              <h2>An extension of your home, built for beauty, comfort, and practical value.</h2>
              <p className="lead">
                At TPPS, we believe your garden should be an extension of your home
                - a space that brings beauty, comfort, and practical value to your property.
              </p>
              <p>
                Whether you need a new patio, a driveway, fencing, groundwork, or a
                full garden transformation, we bring experience, attention to detail,
                and quality craftsmanship to every project.
              </p>
              <p>
                We work closely with each client to understand their goals, offer honest
                advice, and deliver lasting results using quality materials and professional
                installation methods.
              </p>
              <a className="inline-link" href="#services">
                Explore our services
              </a>
            </div>

            <div className="about-card">
              <img
                src="https://images.unsplash.com/photo-1482192505345-5655af888cc4?auto=format&fit=crop&w=900&q=80"
                alt="Landscaper working in a garden"
              />
              <div className="about-card__badge">
                <strong>100%</strong>
                <span>Satisfaction-focused service</span>
              </div>
            </div>
          </div>
        </section>

        <section className="section section--stone" id="services">
          <div className="container">
            <div className="section-heading">
              <p className="eyebrow eyebrow--green">Services</p>
              <h2>Comprehensive landscaping and groundwork solutions</h2>
              <p>
                Designed to look premium, work hard, and help you get more from your property.
              </p>
            </div>

            <div className="card-grid">
              {services.map((service) => (
                <article className="service-card" key={service.title}>
                  <img src={service.image} alt={service.title} />
                  <div className="service-card__body">
                    <h3>{service.title}</h3>
                    <p>{service.description}</p>
                    <span>Learn more</span>
                  </div>
                </article>
              ))}
            </div>

            <div className="service-note">
              <strong>Also offering:</strong> Tree removal and site clearance
            </div>
          </div>
        </section>

        <section className="section section--light">
          <div className="container split-grid">
            <div>
              <p className="eyebrow eyebrow--green">Why choose TPPS</p>
              <h2>Professional, dependable, and built around quality workmanship</h2>
              <p>
                Homeowners across East Kent trust TPPS because every job is handled with care,
                clear communication, and a practical eye for detail.
              </p>

              <div className="reason-grid">
                {reasons.map((reason) => (
                  <div className="reason-card" key={reason}>
                    <span className="reason-card__icon" aria-hidden="true">
                      +
                    </span>
                    <span>{reason}</span>
                  </div>
                ))}
              </div>
            </div>

            <article className="feature-card">
              <p className="eyebrow">Featured project</p>
              <h3>Outdoor spaces built to last</h3>
              <p>
                See how we turn ordinary gardens into practical, striking spaces with
                structure, texture, and durable finishes.
              </p>
              <a className="button button--secondary" href="#gallery">
                View More Work
              </a>
            </article>
          </div>
        </section>

        <section className="section section--dark" id="gallery">
          <div className="container">
            <div className="section-heading section-heading--dark">
              <p className="eyebrow">Gallery</p>
              <h2>Recent ideas and finishes we can tailor to your property</h2>
              <p>
                A flexible showcase section for real project photography, before-and-after shots,
                and completed outdoor spaces.
              </p>
            </div>

            <div className="gallery-grid">
              {projects.map((project) => (
                <article className="gallery-card" key={project.title}>
                  <img src={project.image} alt={project.title} />
                  <div className="gallery-card__body">
                    <p>{project.location}</p>
                    <h3>{project.title}</h3>
                    <span>{project.description}</span>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="section section--stone" id="areas">
          <div className="container">
            <div className="areas-panel">
              <p className="eyebrow eyebrow--green">Areas we cover</p>
              <h2>Proudly serving Thanet and surrounding areas</h2>
              <p>
                We provide landscaping and groundwork services across Broadstairs,
                Ramsgate, Margate, and nearby parts of East Kent. If you&apos;re looking for
                a reliable local team for patios, driveways, fencing, or garden
                transformations, TPPS is here to help.
              </p>
              <div className="area-tags">
                {areas.map((area) => (
                  <span key={area}>{area}</span>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="section section--light">
          <div className="container">
            <div className="section-heading">
              <p className="eyebrow eyebrow--green">Testimonials</p>
              <h2>What our clients say</h2>
              <p>Designed to feel authentic, local, and easy to scan.</p>
            </div>

            <div className="testimonial-grid">
              {testimonials.map((testimonial) => (
                <article className="testimonial-card" key={testimonial.author}>
                  <p className="testimonial-card__quote">{testimonial.quote}</p>
                  <strong>{testimonial.author}</strong>
                  <span>{testimonial.location}</span>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="section cta-section" id="contact">
          <div className="container cta-panel">
            <div>
              <p className="eyebrow">Free quotation and site survey</p>
              <h2>Call today for a free quotation and site survey</h2>
              <p>
                Let&apos;s transform your outdoor space with quality landscaping, groundwork,
                patios, driveways, and fencing tailored to your property.
              </p>
            </div>

            <div className="cta-actions">
              <a className="button button--light" href="mailto:info@tppslandscapes.co.uk">
                Get a Free Quote
              </a>
              <a className="button button--ghost-light" href="tel:01234567890">
                Call Now
              </a>
            </div>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="container footer-grid">
          <div>
            <a className="brand brand--footer" href="#top">
              <span className="brand-mark">TP</span>
              <span className="brand-copy">
                <strong>TPPS Landscapes Ltd</strong>
                <span>High-quality landscaping and groundworks across East Kent.</span>
              </span>
            </a>
          </div>

          <div>
            <h3>Quick links</h3>
            <ul>
              {navLinks.map((link) => (
                <li key={link.href}>
                  <a href={link.href}>{link.label}</a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3>Contact</h3>
            <ul>
              <li>
                <a href="tel:01234567890">01234 567890</a>
              </li>
              <li>
                <a href="mailto:info@tppslandscapes.co.uk">info@tppslandscapes.co.uk</a>
              </li>
              <li>Serving Thanet and surrounding East Kent areas</li>
            </ul>
          </div>
        </div>
      </footer>
    </div>
  )
}

export const Route = createFileRoute('/')({
  component: App,
})

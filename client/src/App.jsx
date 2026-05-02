import { useEffect, useState } from "react";
import { siteContent } from "./siteData";
import "./styles.css";

const navItems = [
  { id: "home", label: "Home" },
  { id: "about", label: "About" },
  { id: "services", label: "Services" },
  { id: "why-choose-us", label: "Why Choose Us" },
  { id: "contact", label: "Contact" },
];

const initialFormState = {
  name: "",
  phone: "",
  email: "",
  service: "",
  message: "",
};

function LogoMark() {
  return (
    <img
      className="brand-logo-image"
      src={siteContent.logoSrc}
      alt="Pragathi Wellness Centre logo"
    />
  );
}

function HeroVisual() {
  return (
    <div className="hero-logo-frame">
      <img
        className="hero-logo"
        src={siteContent.logoSrc}
        alt="Pragathi's Wellness Centre logo"
        loading="eager"
      />
    </div>
  );
}

function ServiceGlyph({ kind }) {
  const commonProps = {
    width: 26,
    height: 26,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "1.8",
  };

  switch (kind) {
    case "yoga":
      return (
        <svg {...commonProps}>
          <path d="M12 3v6" />
          <path d="M7 9c0 2.5 2.2 4 5 4s5-1.5 5-4" />
          <path d="M8 21c0-2.8 1.8-5 4-5s4 2.2 4 5" />
          <path d="M5 21h14" />
        </svg>
      );
    case "acupuncture":
      return (
        <svg {...commonProps}>
          <path d="M12 4v16" />
          <path d="M8.5 8.5 12 12" />
          <path d="m15.5 8.5-3.5 3.5" />
          <path d="m8.5 15.5 3.5-3.5" />
          <path d="m15.5 15.5-3.5-3.5" />
        </svg>
      );
    case "ayurveda":
      return (
        <svg {...commonProps}>
          <path d="M12 20c4-3 6-6 6-9a6 6 0 0 0-12 0c0 3 2 6 6 9Z" />
          <path d="M12 20c-2 0-4 .7-4 2" />
          <path d="M12 20c2 0 4 .7 4 2" />
        </svg>
      );
    case "homeopathy":
      return (
        <svg {...commonProps}>
          <path d="M8 4h8" />
          <path d="M9 4v5l-3 6a3 3 0 0 0 2.7 4.4h6.6A3 3 0 0 0 18 15l-3-6V4" />
          <path d="M9 13h6" />
        </svg>
      );
    case "chiropractic":
      return (
        <svg {...commonProps}>
          <path d="M12 4c2.6 0 4.5 2 4.5 4.6S14.6 13 12 13 7.5 11.1 7.5 8.6 9.4 4 12 4Z" />
          <path d="M6 20c1.2-2.7 3.3-4 6-4s4.8 1.3 6 4" />
          <path d="M4 11h2" />
          <path d="M18 11h2" />
        </svg>
      );
    case "cupping":
      return (
        <svg {...commonProps}>
          <circle cx="9" cy="10" r="3" />
          <circle cx="15" cy="14" r="3" />
          <path d="M6 20c1.2-1.9 3-2.8 5.2-2.8" />
          <path d="M12.8 17.5c2 0 3.7.9 5.2 2.5" />
        </svg>
      );
    case "bungee":
      return (
        <svg {...commonProps}>
          <path d="M7 5v7" />
          <path d="M17 5v7" />
          <path d="M7 12c0 4 2 7 5 7s5-3 5-7" />
          <path d="M9 5h6" />
        </svg>
      );
    default:
      return (
        <svg {...commonProps}>
          <path d="M6 13c2.5 0 3-2 6-2s3.5 2 6 2" />
          <path d="M5 17c2.8 0 3.1-2 7-2 3.6 0 4.2 2 7 2" />
          <path d="M7 8c1.8 0 2.3-1 5-1s3.2 1 5 1" />
        </svg>
      );
  }
}

function App() {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const storedTheme = localStorage.getItem("pragathi-theme");

    if (storedTheme) {
      return storedTheme === "dark";
    }

    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  });
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const [formData, setFormData] = useState(initialFormState);
  const [formStatus, setFormStatus] = useState({ type: "", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    document.body.classList.toggle("dark-mode", isDarkMode);
    localStorage.setItem("pragathi-theme", isDarkMode ? "dark" : "light");
  }, [isDarkMode]);

  useEffect(() => {
    const sectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      {
        threshold: 0.55,
        rootMargin: "-20% 0px -30% 0px",
      }
    );

    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.16 }
    );

    document.querySelectorAll("main section[id]").forEach((section) => {
      sectionObserver.observe(section);
    });

    document.querySelectorAll(".fade-up").forEach((item) => {
      revealObserver.observe(item);
    });

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      sectionObserver.disconnect();
      revealObserver.disconnect();
    };
  }, []);

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "HealthAndBeautyBusiness",
    name: siteContent.businessName,
    url: siteContent.publicSiteUrl,
    description:
      "Pragathi's Wellness Centre provides yoga and wellness services in Pragatinagar, including acupuncture, ayurveda, homeopathy, chiropractic, cupping therapy, bungee fitness, and massage.",
    telephone: "+91-8143503689",
    email: siteContent.email,
    address: {
      "@type": "PostalAddress",
      streetAddress: siteContent.businessStreetAddress,
      addressLocality: "Pragatinagar",
      addressRegion: "Telangana",
      addressCountry: "IN",
    },
    areaServed: "Pragatinagar, Hyderabad",
    sameAs: [siteContent.instagramUrl, siteContent.directionsUrl],
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Wellness Services",
      itemListElement: siteContent.services.map((service) => ({
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: service.name,
        },
      })),
    },
  };

  async function handleSubmit(event) {
    event.preventDefault();
    setFormStatus({ type: "", message: "" });
    setIsSubmitting(true);

    try {
      const response = await fetch(`${siteContent.apiBaseUrl}/api/enquiries`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(result.message || "We could not send your enquiry right now.");
      }

      setFormData(initialFormState);
      setFormStatus({
        type: result.warning ? "warning" : "success",
        message:
          result.message ||
          "Thanks for reaching out. Your enquiry has been received.",
      });
    } catch (error) {
      console.error("Enquiry submission failed:", error);
      
      setFormStatus({
        type: "error",
        message:
          error.message ||
          "We could not connect to the server. Please try again or call 8143503689.",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  function handleChange(event) {
    const { name, value } = event.target;
    setFormData((current) => ({
      ...current,
      [name]: value,
    }));
  }

  function closeMenu() {
    setIsMenuOpen(false);
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>

      <header className={`site-header ${isScrolled ? "scrolled" : ""}`} id="top">
        <div className="container nav-shell">
          <a className="brand" href="#home" aria-label="Pragathi's Wellness Centre home" onClick={closeMenu}>
            <div className="brand-mark" aria-hidden="true">
              <LogoMark />
            </div>
            <div className="brand-copy">
              <span className="brand-name">{siteContent.businessName}</span>
              <span className="brand-subtitle">{siteContent.businessSubtitle}</span>
            </div>
          </a>

          <nav aria-label="Primary navigation">
            <ul className="nav-links desktop-only">
              {navItems.map((item) => (
                <li key={item.id}>
                  <a
                    className={`nav-link ${activeSection === item.id ? "active" : ""}`}
                    href={`#${item.id}`}
                    onClick={closeMenu}
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="nav-actions">
            <a className="button button-primary header-call" href={`tel:${siteContent.phone}`}>
              Call Now
            </a>
            <button
              className="theme-toggle"
              type="button"
              aria-label="Toggle dark mode"
              aria-pressed={isDarkMode}
              onClick={() => setIsDarkMode((current) => !current)}
            >
              <span>{isDarkMode ? "☀" : "◐"}</span>
            </button>
            <button
              className="menu-toggle"
              type="button"
              aria-label="Toggle mobile menu"
              aria-expanded={isMenuOpen}
              aria-controls="mobile-menu"
              onClick={() => setIsMenuOpen((current) => !current)}
            >
              <span />
            </button>
          </div>
        </div>

        <div className={`container mobile-menu ${isMenuOpen ? "open" : ""}`} id="mobile-menu">
          <nav aria-label="Mobile navigation">
            <ul className="nav-links">
              {navItems.map((item) => (
                <li key={item.id}>
                  <a
                    className={`nav-link ${activeSection === item.id ? "active" : ""}`}
                    href={`#${item.id}`}
                    onClick={closeMenu}
                  >
                    {item.label}
                  </a>
                </li>
              ))}
              <li>
                <a className="nav-link" href={`tel:${siteContent.phone}`} onClick={closeMenu}>
                  Call Now
                </a>
              </li>
            </ul>
          </nav>
        </div>
      </header>

      <main id="main-content">
        <section className="hero" id="home">
          <div className="container hero-grid">
            <div className="hero-copy fade-up">
              <div className="hero-kicker">Healing, movement, and mindful care</div>
              <h1>Wellness that feels grounded, personal, and restorative.</h1>
              <p className="lead">
                Welcome to {siteContent.businessName}, a calm space in Pragatinagar where yoga,
                natural therapies, and supportive care come together to help you feel stronger,
                lighter, and more balanced in everyday life.
              </p>
              <div className="btn-row">
                <a className="button button-primary" href={`tel:${siteContent.phone}`}>
                  Call Now
                </a>
                <a
                  className="button button-secondary"
                  href={siteContent.directionsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Get Directions
                </a>
                <a className="button button-ghost" href="#services">
                  View Services
                </a>
              </div>
              <div className="hero-highlights" aria-label="Wellness highlights">
                <div className="hero-stat">
                  <strong>{siteContent.services.length} services</strong>
                  <span>Traditional and modern wellness options in one place.</span>
                </div>
                <div className="hero-stat">
                  <strong>Local care</strong>
                  <span>Designed for clients looking for trusted wellness support nearby.</span>
                </div>
                <div className="hero-stat">
                  <strong>Balanced approach</strong>
                  <span>Movement, therapy, and natural healing under one roof.</span>
                </div>
              </div>
            </div>

            <div className="hero-art fade-up">
              <div className="hero-card">
                <HeroVisual />
                <div className="hero-caption">
                  <div>
                    <strong>Thoughtful wellness support</strong>
                    <span>Gentle care for strength, recovery, and everyday balance.</span>
                  </div>
                  <a className="button button-ghost" href="#contact">
                    Book an Enquiry
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="section" id="about">
          <div className="container feature-grid">
            <div className="section-heading fade-up">
              <div className="eyebrow">About</div>
              <h2>A wellness centre built around natural healing and steady progress.</h2>
              <p className="lead">
                At {siteContent.businessName}, we believe good health is created through
                consistent care, mindful movement, and therapies that support the body as a
                whole. Our centre brings together multiple healing approaches so every visit can
                feel practical, calming, and tailored to your needs.
              </p>
            </div>

            <div className="panel panel-accent fade-up">
              <div className="stack">
                <p>
                  Whether you are seeking relief, flexibility, recovery, stress reduction, or a
                  more balanced lifestyle, our space is designed to support you with warmth and
                  personal attention.
                </p>
                <p>
                  We combine yoga, therapy-led care, and natural wellness practices to help
                  clients move better, feel better, and build healthier routines over time.
                </p>
              </div>
              <div className="bullet-list" aria-label="About highlights">
                <div className="bullet-item">
                  <span>1</span>
                  <p>Holistic care that considers movement, recovery, and overall well-being together.</p>
                </div>
                <div className="bullet-item">
                  <span>2</span>
                  <p>Personal attention with a welcoming environment that feels calm and approachable.</p>
                </div>
                <div className="bullet-item">
                  <span>3</span>
                  <p>Traditional and modern wellness services available in one convenient local centre.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="section" id="services">
          <div className="container">
            <div className="section-heading fade-up">
              <div className="eyebrow">Services</div>
              <h2>Care designed for flexibility, healing, and everyday vitality.</h2>
              <p className="lead">
                Explore our range of yoga and wellness services in Pragatinagar, thoughtfully
                offered to support strength, relaxation, pain relief, and a more balanced
                lifestyle.
              </p>
            </div>

            <div className="services-grid">
              {siteContent.services.map((service) => (
                <article className="service-card fade-up" key={service.key}>
                  <div className="service-icon" aria-hidden="true">
                    <ServiceGlyph kind={service.key} />
                  </div>
                  <h3>{service.name}</h3>
                  <p>{service.description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="section" id="why-choose-us">
          <div className="container">
            <div className="section-heading fade-up">
              <div className="eyebrow">Why Choose Us</div>
              <h2>A trusted place for calm guidance and meaningful wellness care.</h2>
              <p className="lead">
                People choose {siteContent.businessName} for care that feels attentive, steady,
                and rooted in everyday well-being.
              </p>
            </div>

            <div className="trust-grid">
              {siteContent.trustPoints.map((item, index) => (
                <article className="trust-card fade-up" key={item.title}>
                  <span className="trust-number">{String(index + 1).padStart(2, "0")}</span>
                  <h3>{item.title}</h3>
                  <p>{item.body}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="section" id="instagram">
          <div className="container">
            <div className="instagram-card fade-up">
              <div className="section-heading no-margin">
                <div className="eyebrow">Instagram</div>
                <h2>Follow our wellness journey and updates.</h2>
                <p className="lead">
                  Stay connected with {siteContent.businessName} on Instagram for centre updates,
                  wellness inspiration, and a closer look at our services and community.
                </p>
              </div>
              <div className="btn-row no-top-margin">
                <a
                  className="button button-primary"
                  href={siteContent.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Visit Instagram
                </a>
              </div>
            </div>
          </div>
        </section>

        <section className="section" id="contact">
          <div className="container">
            <div className="section-heading fade-up">
              <div className="eyebrow">Contact</div>
              <h2>Reach out and plan your visit.</h2>
              <p className="lead">
                If you would like to enquire about services, timings, or directions, contact
                {` ${siteContent.businessName} `}and we will be happy to help.
              </p>
            </div>

            <div className="contact-grid">
              <div className="contact-stack">
                <div className="contact-card fade-up">
                  <div className="contact-list">
                    <div className="contact-item">
                      <span className="contact-label">Phone</span>
                      <a className="contact-value" href={`tel:${siteContent.phone}`}>
                        {siteContent.phone}
                      </a>
                    </div>
                    <div className="contact-item">
                      <span className="contact-label">Email</span>
                      <a className="contact-value" href={`mailto:${siteContent.email}`}>
                        {siteContent.email}
                      </a>
                    </div>
                    <div className="contact-item">
                      <span className="contact-label">Instagram</span>
                      <a
                        className="contact-value"
                        href={siteContent.instagramUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {siteContent.instagramHandle}
                      </a>
                    </div>
                    <div className="contact-item">
                      <span className="contact-label">Address</span>
                      <div className="contact-value">
                        {siteContent.businessDisplayAddress}
                        <br />
                        Use the directions link below for the exact location.
                      </div>
                    </div>
                  </div>
                  <div className="btn-row">
                    <a
                      className="button button-primary"
                      href={siteContent.directionsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Get Directions
                    </a>
                    <a className="button button-secondary" href={`mailto:${siteContent.email}`}>
                      Email Us
                    </a>
                  </div>
                </div>

                <div className="hours-card fade-up">
                  <h3>Business Hours</h3>
                  <p>Update these timings anytime to match your actual schedule.</p>
                  <div className="hours-list" aria-label="Business hours">
                    {siteContent.businessHours.map((slot) => (
                      <div className="hours-row" key={slot.label}>
                        <span>{slot.label}</span>
                        <strong>{slot.value}</strong>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="contact-form panel fade-up">
                <h3>Send an Enquiry</h3>
                <p>
                  Send us a message here and your enquiry will be saved through the website
                  backend for follow-up.
                </p>
                <form id="enquiry-form" onSubmit={handleSubmit}>
                  <div className="form-grid">
                    <div className="field">
                      <label htmlFor="name">Full Name</label>
                      <input
                        id="name"
                        name="name"
                        type="text"
                        placeholder="Your name"
                        autoComplete="name"
                        maxLength="80"
                        required
                        value={formData.name}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="field">
                      <label htmlFor="phone">Phone Number</label>
                      <input
                        id="phone"
                        name="phone"
                        type="tel"
                        placeholder="Your phone number"
                        autoComplete="tel"
                        maxLength="24"
                        required
                        value={formData.phone}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="field">
                      <label htmlFor="email">Email Address</label>
                      <input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="Your email"
                        autoComplete="email"
                        maxLength="120"
                        value={formData.email}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="field">
                      <label htmlFor="service">Service Interested In</label>
                      <input
                        id="service"
                        name="service"
                        type="text"
                        placeholder="Yoga, Massage, Ayurveda..."
                        maxLength="120"
                        value={formData.service}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="field-full">
                      <label htmlFor="message">Message</label>
                      <textarea
                        id="message"
                        name="message"
                        placeholder="Tell us how we can help you"
                        maxLength="1200"
                        required
                        value={formData.message}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="field-full">
                      <button className="button button-primary submit-button" type="submit" disabled={isSubmitting}>
                        {isSubmitting ? "Sending..." : "Send Enquiry"}
                      </button>
                    </div>
                  </div>
                </form>
                <p className={`form-status ${formStatus.message ? "is-visible" : ""} ${formStatus.type === "success" ? "is-success" : ""} ${formStatus.type === "error" ? "is-error" : ""} ${formStatus.type === "warning" ? "is-warning" : ""}`} role="status" aria-live="polite">
                  {formStatus.message}
                </p>
                <p className="form-note">
                  For faster assistance, please call <a href={`tel:${siteContent.phone}`}>{siteContent.phone}</a>.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <section className="section disclaimer-section" style={{ backgroundColor: "var(--color-primary-light)", padding: "1.5rem 0", textAlign: "center", borderTop: "1px solid var(--color-border)" }}>
        <div className="container">
          <p style={{ margin: 0, color: "var(--color-primary-dark)", fontWeight: 500, fontSize: "0.95rem" }}>
            Disclaimer: Pragathi Wellness Centre does not conduct any monetary transactions through this website. All payments are handled in person at our centre only. Please beware of fraudulent activities.
          </p>
        </div>
      </section>

      <footer className="footer">
        <div className="container">
          <div className="footer-grid">
            <div>
              <div className="footer-title">{siteContent.businessName}</div>
              <p>
                A warm, professional wellness space in Pragatinagar for yoga, acupuncture,
                ayurveda, homeopathy, chiropractic, cupping therapy, bungee fitness, and massage.
              </p>
            </div>
            <div>
              <div className="footer-title">Quick Links</div>
              <div className="footer-links">
                {navItems.map((item) => (
                  <a href={`#${item.id}`} key={item.id}>
                    {item.label}
                  </a>
                ))}
              </div>
            </div>
            <div>
              <div className="footer-title">Contact</div>
              <div className="footer-links">
                <a href={`tel:${siteContent.phone}`}>{siteContent.phone}</a>
                <a href={`mailto:${siteContent.email}`}>{siteContent.email}</a>
                <a href={siteContent.directionsUrl} target="_blank" rel="noopener noreferrer">
                  Get Directions
                </a>
                <a href={siteContent.instagramUrl} target="_blank" rel="noopener noreferrer">
                  Follow us on Instagram
                </a>
              </div>
            </div>
          </div>
          <div className="footer-meta">
            <span>&copy; {new Date().getFullYear()} {siteContent.businessName}. All rights reserved.</span>
            <span>Follow us on Instagram</span>
          </div>
        </div>
      </footer>

      <a className="floating-call" href={`tel:${siteContent.phone}`} aria-label="Call now">
        Call Now
      </a>
    </>
  );
}

export default App;

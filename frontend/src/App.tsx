
import { useRef, useState, type FormEvent, type ReactNode } from 'react'
import './App.css'

const currentYear = new Date().getFullYear()

const programs = [
  {
    number: '01',
    title: 'Strength training',
    description:
      'Build foundational strength with structured resistance training and room to progress at your own pace.',
    tag: 'BUILD STRENGTH',
  },
  {
    number: '02',
    title: 'Personal training',
    description:
      'A more individual approach to training, shaped around your goals, experience and preferences.',
    tag: 'TRAIN WITH PURPOSE',
  },
  {
    number: '03',
    title: 'Functional fitness',
    description:
      'Develop balance, mobility and practical strength through varied, purposeful movement.',
    tag: 'MOVE BETTER',
  },
]

const facilities = [
  { number: '01', title: 'Strength zone', detail: 'A dedicated space for resistance and strength training.' },
  { number: '02', title: 'Open training floor', detail: 'Room to move, practise and build confidence.' },
  { number: '03', title: 'Conditioning area', detail: 'Space for movement-based and conditioning sessions.' },
]

const trainers = [
  { number: '01', name: 'Trainer profile', role: 'Meet your coaching team', image: 'https://images.unsplash.com/photo-1567013127542-490d757e51fc?auto=format&fit=crop&w=800&q=85' },
  { number: '02', name: 'Trainer profile', role: 'Meet your coaching team', image: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?auto=format&fit=crop&w=800&q=85' },
  { number: '03', name: 'Trainer profile', role: 'Meet your coaching team', image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=800&q=85' },
]

const faqs = [
  {
    question: 'Is FORGE suitable for beginners?',
    answer:
      'The intended experience is welcoming to people at different stages of their fitness journey. Speak with the team about your experience and goals before choosing a programme.',
  },
  {
    question: 'What should I bring for my first visit?',
    answer:
      'Comfortable workout clothing, suitable footwear and a water bottle are a sensible starting point. Confirm any studio-specific requirements with the team.',
  },
  {
    question: 'How do I find out about memberships?',
    answer:
      'Send an enquiry or contact the studio directly. Membership options, inclusions and current pricing will be confirmed by the team.',
  },
  {
    question: 'Can I speak to someone before joining?',
    answer:
      'Absolutely. Use the enquiry form or WhatsApp link to ask questions and discuss whether the studio is right for you.',
  },
]

const navLinks = [
  { label: 'About', href: '#about' },
  { label: 'Programs', href: '#programs' },
  { label: 'Facilities', href: '#facilities' },
  { label: 'Memberships', href: '#memberships' },
]

function ArrowIcon() {
  return <span aria-hidden="true" className="arrow-icon">↗</span>
}

function ButtonLink({
  href,
  children,
  variant = 'primary',
}: {
  href: string
  children: ReactNode
  variant?: 'primary' | 'secondary' | 'light'
}) {
  return (
    <a className={`button button--${variant}`} href={href}>
      {children}
      <ArrowIcon />
    </a>
  )
}

function SectionHeading({
  eyebrow,
  title,
  description,
  light = false,
}: {
  eyebrow: string
  title: string
  description?: string
  light?: boolean
}) {
  return (
    <div className={`section-heading${light ? ' section-heading--light' : ''}`}>
      <p className="eyebrow">{eyebrow}</p>
      <h2>{title}</h2>
      {description && <p className="section-heading__description">{description}</p>}
    </div>
  )
}

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)

  const closeMenu = () => setMenuOpen(false)

  return (
    <header className="site-header">
      <nav className="nav container" aria-label="Main navigation">
        <a className="brand" href="#home" onClick={closeMenu} aria-label="FORGE home">
          FORGE<span>.</span>
        </a>

        <button
          className="menu-toggle"
          type="button"
          aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
          aria-expanded={menuOpen}
          aria-controls="primary-navigation"
          onClick={() => setMenuOpen((open) => !open)}
        >
          <span />
          <span />
        </button>

        <div
          className={`nav__links${menuOpen ? ' nav__links--open' : ''}`}
          id="primary-navigation"
        >
          {navLinks.map((link) => (
            <a key={link.href} href={link.href} onClick={closeMenu}>
              {link.label}
            </a>
          ))}
          <ButtonLink href="#contact">Enquire now</ButtonLink>
        </div>
      </nav>
    </header>
  )
}

function Hero() {
  return (
    <section className="hero" id="home">
      <div className="hero__image" role="img" aria-label="Modern strength training gym interior" />
      <div className="hero__overlay" />
      <div className="container hero__content">
        <p className="eyebrow eyebrow--light">YOUR SPACE. YOUR PACE. YOUR NEXT LEVEL.</p>
        <h1>Build strength.<br />Find your <span>edge.</span></h1>
        <p className="hero__description">
          A more welcoming approach to getting stronger. Find your rhythm,
          build confidence and make progress that feels like yours.
        </p>
        <div className="hero__actions">
          <ButtonLink href="#contact">Enquire about a trial</ButtonLink>
          <ButtonLink href="#programs" variant="light">Explore programs</ButtonLink>
        </div>
        <p className="hero__note">A neighbourhood fitness experience, built around you.</p>
      </div>
      <a className="hero__scroll" href="#trust" aria-label="Scroll to discover">
        <span>SCROLL TO DISCOVER</span>
        <span aria-hidden="true">↓</span>
      </a>
    </section>
  )
}

function TrustIndicators() {
  const items = [
    ['01', 'A welcoming environment', 'Feel comfortable starting where you are.'],
    ['02', 'Training with purpose', 'Choose an approach that fits your goals.'],
    ['03', 'Progress at your pace', 'Build consistency one session at a time.'],
  ]

  return (
    <section className="trust-strip" id="trust">
      <div className="container trust-strip__grid">
        {items.map(([number, title, description]) => (
          <article className="trust-item" key={number}>
            <span className="trust-item__number">{number}</span>
            <div>
              <h3>{title}</h3>
              <p>{description}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}

function About() {
  return (
    <section className="section about" id="about">
      <div className="container about__grid">
        <div className="about__visual">
          <img
            src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1100&q=90"
            alt="Strength training equipment in a gym"
            loading="lazy"
          />
          <div className="about__stamp">
            <span>SHOW UP</span>
            <strong>GET<br />STRONGER.</strong>
          </div>
        </div>
        <div className="about__content">
          <SectionHeading
            eyebrow="THE FORGE APPROACH"
            title="Fitness should meet you where you are."
          />
          <p>
            Starting something new can feel intimidating. Your training
            environment shouldn't make it harder.
          </p>
          <p>
            FORGE is built around a simple idea: create a space where people
            can train with purpose, learn at their own pace and feel good
            about showing up.
          </p>
          <a className="text-link" href="#contact">Get to know us <ArrowIcon /></a>
        </div>
      </div>
    </section>
  )
}

function Programs() {
  return (
    <section className="section programs section--dark" id="programs">
      <div className="container">
        <SectionHeading
          eyebrow="FIND YOUR FOCUS"
          title="Training that moves you forward."
          description="Different goals call for different approaches. Find a starting point that feels right."
          light
        />
        <div className="program-grid">
          {programs.map((program) => (
            <article className="program-card" key={program.number}>
              <div className="program-card__top">
                <span>{program.number}</span>
                <ArrowIcon />
              </div>
              <p className="program-card__tag">{program.tag}</p>
              <h3>{program.title}</h3>
              <p className="program-card__description">{program.description}</p>
              <a href="#contact" className="program-card__link">
                Ask about this program <span aria-hidden="true">→</span>
              </a>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

function Facilities() {
  return (
    <section className="section facilities" id="facilities">
      <div className="container">
        <div className="facilities__intro">
          <SectionHeading
            eyebrow="THE SPACE"
            title="Room to focus. Space to grow."
            description="A training environment should help you concentrate on what matters: showing up and putting in the work."
          />
          <ButtonLink href="#contact" variant="secondary">Visit the studio</ButtonLink>
        </div>
        <div className="facilities__layout">
          <div className="facilities__image">
            <img
              src="https://images.unsplash.com/photo-1571902943202-507ec2618e8f?auto=format&fit=crop&w=1200&q=90"
              alt="Contemporary gym training floor"
              loading="lazy"
            />
          </div>
          <div className="facility-list">
            {facilities.map((facility) => (
              <article className="facility-item" key={facility.number}>
                <span>{facility.number}</span>
                <div>
                  <h3>{facility.title}</h3>
                  <p>{facility.detail}</p>
                </div>
                <ArrowIcon />
              </article>
            ))}
            <p className="content-note">
              Facility descriptions are illustrative and should be confirmed
              against the actual studio.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

function Trainers() {
  return (
    <section className="section trainers section--canvas" id="trainers">
      <div className="container">
        <SectionHeading
          eyebrow="PEOPLE MAKE THE DIFFERENCE"
          title="Guidance makes the journey better."
          description="Get to know the people who can help you make the most of your training."
        />
        <div className="trainer-grid">
          {trainers.map((trainer) => (
            <article className="trainer-card" key={trainer.number}>
              <div className="trainer-card__image">
                <img src={trainer.image} alt="" loading="lazy" />
                <span>{trainer.number}</span>
              </div>
              <div className="trainer-card__details">
                <div>
                  <h3>{trainer.name}</h3>
                  <p>{trainer.role}</p>
                </div>
                <span aria-hidden="true">↗</span>
              </div>
            </article>
          ))}
        </div>
        <p className="content-note">
          Placeholder profiles and imagery — replace with approved trainer
          names, photographs and verified qualifications before launch.
        </p>
      </div>
    </section>
  )
}

function Memberships() {
  return (
    <section className="section memberships section--dark" id="memberships">
      <div className="container memberships__grid">
        <div>
          <SectionHeading
            eyebrow="YOUR NEXT STEP"
            title="Find a membership that fits."
            description="The right membership should work with your goals, schedule and preferred way to train."
            light
          />
          <p className="memberships__note">
            Options and pricing are confirmed directly by the studio.
          </p>
          <ButtonLink href="#contact">Ask about memberships</ButtonLink>
        </div>
        <div className="membership-options">
          <article>
            <span>01 / START HERE</span>
            <h3>Getting started</h3>
            <p>Explore the studio and discuss the best way to begin.</p>
            <a href="#contact">Make an enquiry <ArrowIcon /></a>
          </article>
          <article>
            <span>02 / KEEP BUILDING</span>
            <h3>Ongoing training</h3>
            <p>Discuss membership options that support your routine.</p>
            <a href="#contact">Make an enquiry <ArrowIcon /></a>
          </article>
          <article>
            <span>03 / MORE PERSONAL</span>
            <h3>Personal guidance</h3>
            <p>Ask about a more individual training approach.</p>
            <a href="#contact">Make an enquiry <ArrowIcon /></a>
          </article>
        </div>
      </div>
    </section>
  )
}

function Testimonials() {
  return (
    <section className="section testimonials">
      <div className="container testimonials__inner">
        <SectionHeading
          eyebrow="REAL EXPERIENCES MATTER"
          title="The best proof comes from people."
          description="Honest experiences help someone new understand what training here is really like."
        />
        <div className="testimonial-placeholder">
          <span aria-hidden="true">“</span>
          <div>
            <h3>Member story goes here.</h3>
            <p>
              Add a genuine, approved member testimonial here. Include the
              member's name and image only with their permission.
            </p>
            <span className="testimonial-placeholder__label">APPROVED MEMBER STORY PLACEHOLDER</span>
          </div>
        </div>
      </div>
    </section>
  )
}

function FAQs() {
  return (
    <section className="section faq-section section--canvas" id="faqs">
      <div className="container faq-layout">
        <SectionHeading
          eyebrow="GOOD QUESTIONS"
          title="A few things you might be wondering."
          description="Still unsure? Send us a question and we'll help you find the information you need."
        />
        <div className="faq-list">
          {faqs.map((faq, index) => (
            <details className="faq-item" key={faq.question}>
              <summary>
                <span className="faq-item__number">0{index + 1}</span>
                <span>{faq.question}</span>
                <span className="faq-item__icon" aria-hidden="true">+</span>
              </summary>
              <p>{faq.answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  )
}


type EnquiryPayload = {
  name: string
  phone: string
  fitnessGoal?: string
  preferredContactMethod?: 'phone' | 'whatsapp' | 'email'
  message?: string
  privacyConsent: true
}

type EnquiryApiResponse = {
  status: 'success' | 'error'
  message: string
  code?: string
  errors?: { field: string; message: string }[]
}

type SubmissionKey = {
  fingerprint: string
  key: string
}

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL ?? '').replace(/\/$/, '')

function Contact() {
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})
  const submissionKey = useRef<SubmissionKey | null>(null)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const form = event.currentTarget
    const formData = new FormData(form)

    const payload: EnquiryPayload = {
      name: String(formData.get('name') ?? '').trim(),
      phone: String(formData.get('phone') ?? '').trim(),
      fitnessGoal: String(formData.get('fitnessGoal') ?? '').trim() || undefined,
      preferredContactMethod:
        (formData.get('preferredContactMethod') as EnquiryPayload['preferredContactMethod']) ||
        undefined,
      message: String(formData.get('message') ?? '').trim() || undefined,
      privacyConsent: true,
    }

    // The browser's required checkbox validation should normally prevent this.
    if (formData.get('privacyConsent') !== 'on') {
      setStatus('error')
      setErrorMessage('Please agree to be contacted about your enquiry.')
      setFieldErrors({ privacyConsent: 'Consent is required.' })
      return
    }

    const fingerprint = JSON.stringify(payload)

    // Reuse the key for an unchanged retry. Changed details get a new key.
    if (!submissionKey.current || submissionKey.current.fingerprint !== fingerprint) {
      submissionKey.current = {
        fingerprint,
        key: crypto.randomUUID(),
      }
    }

    setStatus('submitting')
    setErrorMessage('')
    setFieldErrors({})

    let response: Response

    try {
      response = await fetch(`${API_BASE_URL}/api/enquiries`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Idempotency-Key': submissionKey.current.key,
        },
        body: JSON.stringify(payload),
      })
    } catch {
      // The server may have saved the enquiry before the connection failed.
      // Keep the key so an unchanged retry remains safe.
      setErrorMessage(
        'We could not reach the server. Please check your connection and try again.',
      )
      setStatus('error')
      return
    }

    let result: EnquiryApiResponse

    try {
      result = (await response.json()) as EnquiryApiResponse
    } catch {
      setErrorMessage(
        'The server returned an unexpected response. Please try again.',
      )
      setStatus('error')
      return
    }

    if (!response.ok || result.status !== 'success') {
      const nextFieldErrors: Record<string, string> = {}

      result.errors?.forEach((error) => {
        nextFieldErrors[error.field] = error.message
      })

      setFieldErrors(nextFieldErrors)
      setErrorMessage(result.message || 'We could not submit your enquiry. Please try again.')
      setStatus('error')
      return
    }

    setStatus('success')
    submissionKey.current = null
    form.reset()
  }

  function handleFormChange() {
    if (status === 'error') {
      setStatus('idle')
      setErrorMessage('')
      setFieldErrors({})
    }
  }

  return (
    <section className="section contact section--dark" id="contact">
      <div className="container contact__grid">
        <div className="contact__content">
          <SectionHeading
            eyebrow="YOUR NEXT MOVE"
            title="Let's start with a conversation."
            description="Tell us a little about what you're looking for. The team can help you explore the next step."
            light
          />
          <div className="contact__direct">
            <span>Prefer a direct conversation?</span>
            <a href="https://wa.me/" target="_blank" rel="noreferrer">
              Connect on WhatsApp <ArrowIcon />
            </a>
            <p>Replace this link with the studio's verified WhatsApp number.</p>
          </div>
        </div>

        <form
          className="contact-form"
          onSubmit={handleSubmit}
          onChange={handleFormChange}
          aria-busy={status === 'submitting'}
        >
          <div className="contact-form__heading">
            <span>01 / ENQUIRY</span>
            <h3>Tell us about yourself.</h3>
          </div>

          <label>
            Your name
            <input
              name="name"
              type="text"
              placeholder="Full name"
              autoComplete="name"
              maxLength={100}
              required
              aria-invalid={Boolean(fieldErrors.name)}
              aria-describedby={fieldErrors.name ? 'name-error' : undefined}
            />
            {fieldErrors.name && <span className="field-error" id="name-error">{fieldErrors.name}</span>}
          </label>

          <label>
            Phone number
            <input
              name="phone"
              type="tel"
              placeholder="Your contact number"
              autoComplete="tel"
              maxLength={32}
              required
              aria-invalid={Boolean(fieldErrors.phone)}
              aria-describedby={fieldErrors.phone ? 'phone-error' : undefined}
            />
            {fieldErrors.phone && <span className="field-error" id="phone-error">{fieldErrors.phone}</span>}
          </label>

          <label>
            What are your fitness goals? <span className="optional">(Optional)</span>
            <select name="fitnessGoal" defaultValue="">
              <option value="">Select an option</option>
              <option value="Strength training">Strength training</option>
              <option value="Personal training">Personal training</option>
              <option value="Functional fitness">Functional fitness</option>
              <option value="Membership information">Membership information</option>
              <option value="Other">Something else</option>
            </select>
          </label>

          <label>
            How should we contact you? <span className="optional">(Optional)</span>
            <select name="preferredContactMethod" defaultValue="">
              <option value="">No preference</option>
              <option value="phone">Phone call</option>
              <option value="whatsapp">WhatsApp</option>
              <option value="email">Email</option>
            </select>
          </label>

          <label>
            Anything else? <span className="optional">(Optional)</span>
            <textarea
              name="message"
              rows={3}
              maxLength={2000}
              placeholder="Tell us about your goals..."
            />
          </label>

          <label className="contact-form__consent">
            <input
              name="privacyConsent"
              type="checkbox"
              required
              aria-invalid={Boolean(fieldErrors.privacyConsent)}
              aria-describedby={fieldErrors.privacyConsent ? 'privacy-consent-error' : undefined}
            />
            <span>
              I agree that the studio may use these details to contact me about my enquiry.
            </span>
          </label>
          {fieldErrors.privacyConsent && (
            <span className="field-error" id="privacy-consent-error">
              {fieldErrors.privacyConsent}
            </span>
          )}

          <button
            className="button button--primary contact-form__submit"
            type="submit"
            disabled={status === 'submitting'}
          >
            {status === 'submitting' ? 'Sending enquiry...' : 'Submit enquiry'}
            {status !== 'submitting' && <ArrowIcon />}
          </button>

          {status === 'success' && (
            <p className="form-notice form-notice--success" role="status">
              Thank you! Your enquiry has been received. The team will be in touch.
            </p>
          )}

          {status === 'error' && (
            <p className="form-notice form-notice--error" role="alert">
              {errorMessage}
            </p>
          )}

          <p className="contact-form__disclaimer">
            Your details will only be used to respond to your enquiry.
          </p>
        </form>
      </div>
    </section>
  )
}


function Footer() {
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-main">
          <div>
            <a className="brand brand--footer" href="#home">FORGE<span>.</span></a>
            <p>Build strength. Find your edge.</p>
          </div>
          <div className="footer-links">
            <div>
              <span>EXPLORE</span>
              <a href="#about">Our approach</a>
              <a href="#programs">Programs</a>
              <a href="#facilities">Facilities</a>
            </div>
            <div>
              <span>GET STARTED</span>
              <a href="#memberships">Memberships</a>
              <a href="#faqs">FAQs</a>
              <a href="#contact">Contact</a>
            </div>
          </div>
          <a className="footer-cta" href="#contact">Ready when you are <ArrowIcon /></a>
        </div>
        <div className="footer-bottom">
          <span>© {currentYear} FORGE. Concept website.</span>
          <a href="#home">Back to top ↑</a>
          <span>Designed to move you forward.</span>
        </div>
      </div>
    </footer>
  )
}

function App() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <TrustIndicators />
        <About />
        <Programs />
        <Facilities />
        <Trainers />
        <Memberships />
        <Testimonials />
        <FAQs />
        <Contact />
      </main>
      <Footer />
    </>
  )
}

export default App

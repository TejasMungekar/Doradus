import { useEffect, useRef, useState } from 'react'
import { motion, useMotionValue, useScroll, useSpring, useTransform, type MotionValue } from 'framer-motion'
import Lenis from 'lenis'
import { ArrowDown, ArrowRight, ArrowUpRight, Asterisk, Menu, X, Zap } from 'lucide-react'

const projects = [
  { number: '01', name: 'ReservePilot', type: 'Treasury intelligence · Web app', tone: 'reserve', tag: 'Clarity for your treasury', image: 'photo-1460925895917-afdab827c52f', href: 'https://reservepilot.vercel.app/' },
  { number: '02', name: 'ProtoGen', type: 'AI research tool · Product design', tone: 'proto', tag: 'Research to reality', image: 'photo-1451187580459-43490279c0fa', href: 'https://protogen-100.vercel.app/' },
  { number: '03', name: 'Morrow & Moss', type: 'E-commerce · Pantry goods', tone: 'morrow', tag: 'A little good, every day', image: 'photo-1542838132-92c53300491e', href: 'https://morrowandmoss.netlify.app/' },
  { number: '04', name: 'RCPP', type: 'Community · Non-profit website', tone: 'rcppro', tag: 'People of action in Pune', image: 'photo-1559027615-cd4628902d4a', href: 'https://rcppro.org/' },
]

const INR_PER_USD = 92.7968
type PriceCurrency = 'INR' | 'USD'

function getDefaultPriceCurrency(): PriceCurrency {
  if (typeof navigator === 'undefined') return 'INR'
  const localeRegion = (navigator.language || '').toUpperCase().split('-').pop()
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone
  return localeRegion === 'IN' || timezone === 'Asia/Kolkata' || timezone === 'Asia/Calcutta' ? 'INR' : 'USD'
}

function formatPlanPrice(rupees: number, currency: PriceCurrency) {
  const amount = currency === 'INR' ? rupees : rupees / INR_PER_USD
  return new Intl.NumberFormat(currency === 'INR' ? 'en-IN' : 'en-US', {
    style: 'currency', currency, minimumFractionDigits: 0, maximumFractionDigits: currency === 'INR' ? 2 : 0,
  }).format(amount)
}

const shardData = [
  { x: -104, y: -83, r: -13, sx: -500, sy: -390, sr: -280, d: 1.05 },
  { x: -13, y: -131, r: 8, sx: -115, sy: -630, sr: 174, d: .91 },
  { x: 75, y: -91, r: 17, sx: 490, sy: -495, sr: 255, d: 1.16 },
  { x: 125, y: -9, r: 30, sx: 650, sy: -46, sr: 330, d: .85 },
  { x: 85, y: 77, r: -8, sx: 455, sy: 530, sr: 225, d: 1.12 },
  { x: 1, y: 124, r: -24, sx: -5, sy: 655, sr: -210, d: .94 },
  { x: -91, y: 72, r: 18, sx: -510, sy: 480, sr: -315, d: 1.1 },
  { x: -129, y: -16, r: -32, sx: -665, sy: -120, sr: 250, d: .84 },
  { x: -33, y: -32, r: 45, sx: -280, sy: -190, sr: 410, d: .9 },
  { x: 48, y: 22, r: -19, sx: 320, sy: 240, sr: -340, d: 1.03 },
  { x: 17, y: -7, r: 32, sx: 160, sy: -340, sr: 470, d: .88 },
  { x: -40, y: 35, r: -40, sx: -340, sy: 330, sr: -390, d: 1.1 },
]

function CrystalShard({ item, progress }: { item: typeof shardData[number]; progress: MotionValue<number> }) {
  const x = useTransform(progress, [0, .8, 1], [item.x, item.sx, item.sx * 1.28])
  const y = useTransform(progress, [0, .8, 1], [item.y, item.sy, item.sy * 1.2])
  const rotate = useTransform(progress, [0, .8, 1], [item.r, item.r + item.sr, item.r + item.sr * 1.3])
  const opacity = useTransform(progress, [0, .68, .94, 1], [1, 1, .58, 0])
  const scale = useTransform(progress, [0, .8, 1], [item.d, item.d, item.d * .65])
  return <motion.div className={`shard shard-${shardData.indexOf(item)}`} style={{ x, y, rotate, opacity, scale }} />
}

function LightningCursor() {
  const rawX = useMotionValue(-80), rawY = useMotionValue(-80)
  const x = useSpring(rawX, { stiffness: 420, damping: 34, mass: .34 })
  const y = useSpring(rawY, { stiffness: 420, damping: 34, mass: .34 })
  const [active, setActive] = useState(false), [hover, setHover] = useState(false)
  useEffect(() => {
    const move = (e: MouseEvent) => { rawX.set(e.clientX); rawY.set(e.clientY); setActive(true) }
    const over = (e: Event) => setHover((e.target as HTMLElement).closest('a, button, [data-cursor]') !== null)
    const out = () => setHover(false)
    window.addEventListener('mousemove', move)
    document.addEventListener('mouseover', over); document.addEventListener('mouseout', out)
    return () => { window.removeEventListener('mousemove', move); document.removeEventListener('mouseover', over); document.removeEventListener('mouseout', out) }
  }, [rawX, rawY])
  return <motion.div className={`lightning-cursor ${active ? 'is-active' : ''} ${hover ? 'is-hover' : ''}`} style={{ x, y }} aria-hidden="true"><span className="cursor-aura" /><Zap size={17} strokeWidth={2.6} fill="currentColor" /><Asterisk className="cursor-spark" size={9} strokeWidth={2} /></motion.div>
}

function Navigation() {
  const [open, setOpen] = useState(false)
  const links = [['Work', '#work'], ['Studio', '#studio'], ['Services', '#services'], ['Pricing', '#pricing'], ['FAQ', '#faq'], ['Contact', '#contact']]
  return <>
    <header className="nav-wrap">
      <a href="#top" className="wordmark" aria-label="Protogent home"><img src="/protogent-brand.svg" alt="Protogent" /></a>
      <span className="nav-location">Web design & development <b>·</b> Worldwide</span>
      <nav className="desktop-nav" aria-label="Main navigation">{links.map(([label, href]) => <a key={label} href={href}>{label}</a>)}</nav>
      <a href="#contact" className="nav-cta">Let’s talk <ArrowUpRight size={14} /></a>
      <button className="menu-toggle" onClick={() => setOpen(!open)} aria-label={open ? 'Close menu' : 'Open menu'}>{open ? <X /> : <Menu />}</button>
    </header>
    <motion.div className="mobile-menu" initial={false} animate={open ? 'open' : 'closed'} variants={{ open: { opacity: 1, height: 'auto', pointerEvents: 'auto' }, closed: { opacity: 0, height: 0, pointerEvents: 'none' } }}>
      {links.map(([label, href], i) => <motion.a key={label} href={href} onClick={() => setOpen(false)} initial={false} animate={open ? { y: 0, opacity: 1 } : { y: 12, opacity: 0 }} transition={{ delay: i * .06 }}>{label}<ArrowUpRight size={18} /></motion.a>)}
      <p>Thoughtfully made for what’s next.</p>
    </motion.div>
  </>
}

function Hero() {
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] })
  const titleY = useTransform(scrollYProgress, [0, .28, .65], [0, -38, -240])
  const titleOpacity = useTransform(scrollYProgress, [0, .3, .63], [1, 1, 0])
  const labelOpacity = useTransform(scrollYProgress, [0, .22, .45], [1, 1, 0])
  const orbScale = useTransform(scrollYProgress, [0, .55, 1], [1, .9, .6])
  return <section className="hero" id="top" ref={ref}>
    <div className="hero-sticky">
      <div className="hero-grid" />
      <motion.div className="hero-copy" style={{ y: titleY, opacity: titleOpacity }}>
        <div className="eyebrow"><span className="eyebrow-dot" /> Independent web design & development studio <span className="eyebrow-year">Est. 2020</span></div>
        <h1>Make room<br />for <em>remarkable.</em></h1>
        <div className="hero-footline"><p>We design and build thoughtful websites<br className="desktop-only" /> for ambitious people and growing businesses.</p><a href="#work" className="circle-link" aria-label="Explore our work"><ArrowDown size={17} /></a></div>
      </motion.div>
      <motion.div className="crystal-stage" style={{ scale: orbScale }} aria-hidden="true">
        <div className="crystal-halo" />
        <div className="crystal-orbit orbit-one" /><div className="crystal-orbit orbit-two" />
        {shardData.map((item, i) => <CrystalShard key={i} item={item} progress={scrollYProgress} />)}
        <div className="crystal-caption"><span>FIG. 01</span><span>Potential, in every direction</span></div>
      </motion.div>
      <motion.div className="hero-bottom" style={{ opacity: labelOpacity }}><span>Scroll to explore</span><span className="scroll-line"><i /></span><span>01 — 05</span></motion.div>
      <motion.div className="hero-side-note" style={{ opacity: labelOpacity }}>STRATEGY&nbsp; / &nbsp;IDENTITY&nbsp; / &nbsp;DIGITAL</motion.div>
      <motion.div className="hero-scroll-hint" style={{ opacity: useTransform(scrollYProgress, [0, .12], [1, 0]) }}><span>SCROLL</span><ArrowDown size={14} /></motion.div>
    </div>
  </section>
}

function Work() {
  return <section className="section work-section" id="work">
    <div className="section-head"><div><span className="eyebrow section-eyebrow">Selected work <span>— 04 projects</span></span><h2>Good work, for<br /><em>good people.</em></h2></div><p className="section-intro">A few recent collaborations that<br className="desktop-only" /> remind us why we love what we do.</p></div>
    <div className="project-grid">{projects.map((project, i) => <a className={`project-card project-${project.tone}`} href={project.href} target="_blank" rel="noreferrer" key={project.name} aria-label={`Open ${project.name} project`}>
      <div className="project-visual" style={{ backgroundImage: `url(https://images.unsplash.com/${project.image}?auto=format&fit=crop&w=1400&q=85)` }}>
        <div className="project-overlay" />
        <span className="project-index">{project.number} / 04</span>
        <div className="project-artifact">
          {i === 0 && <div className="reserve-ui"><div className="ui-sidebar"><b>◉ <span>reserve<span>pilot</span></span></b><i>Overview</i><i>Treasury</i><i>Markets</i><i>Reports</i></div><div className="ui-content"><small>EXECUTIVE COCKPIT</small><strong>Good morning, Alex</strong><div className="ui-metrics"><span><small>TOTAL TREASURY</small><b>$180,420</b><i>↗ 2.4%</i></span><span><small>RUNWAY</small><b>8.4 mo</b><i>On track</i></span></div><div className="ui-chart"><div className="chart-bars"><i/><i/><i/><i/><i/><i/><i/><i/><i/><i/><i/><i/><i/><i/><i/><i/></div></div><div className="ui-lines"><i/><i/><i/></div></div></div>}
          {i === 1 && <div className="proto-ui"><div className="proto-orbit" /><span className="proto-brand">PROTOGEN <i>✳</i></span><span className="proto-prompt">FROM PAPER<br /><em>TO PROTOTYPE.</em></span><small>Turn ideas into something real.</small><div className="proto-pill">Research · Synthesis · Build <ArrowUpRight size={12}/></div></div>}
          {i === 2 && <div className="morrow-ui"><span className="morrow-brand">morrow <b>&</b> moss</span><div className="morrow-copy"><small>THOUGHTFUL PANTRY GOODS</small><strong>A little good,<br />every day.</strong><span>Small-batch, naturally wonderful.</span><i>Shop the pantry&nbsp; ↗</i></div><div className="pantry-selection"><span>🍑</span><span>🌰</span><span>🍯</span><span>🍫</span></div></div>}
          {i === 3 && <div className="rcppro-ui"><div className="rcppro-nav"><span>ROTARY <b>✳</b> PUNE PROFESSIONALS</span><span>ABOUT&nbsp;&nbsp; WORK&nbsp;&nbsp; JOIN US&nbsp; ↗</span></div><div className="rcppro-copy"><small>SERVICE ABOVE SELF · PUNE, INDIA</small><strong>People of<br /><em>action.</em></strong><span>Connecting professionals to create lasting change in our community.</span><i>Discover our impact&nbsp; ↗</i></div><div className="rcppro-stats"><span><b>01</b><small>COMMUNITY</small></span><span><b>∞</b><small>POSSIBILITIES</small></span></div><div className="rcppro-spark">✳</div></div>}
        </div>
        <span className="project-arrow"><ArrowUpRight size={19} /></span>
      </div>
      <div className="project-meta"><div><h3>{project.name}</h3><p>{project.type}</p></div><span className="project-tag">{project.tag}</span></div>
    </a>)}</div>
    <a href="#contact" className="text-link">Have a project in mind? <span>We’d love to hear it.</span><ArrowRight size={16} /></a>
  </section>
}

function CreativeQuotes() {
  const notes = [
    ['01', 'An idea is only the beginning. The joy lives in what you make of it.'],
    ['02', 'Make with curiosity. Edit with intention.'],
    ['03', 'Beauty is how a good idea invites you in.'],
  ]
  return <section className="creative-notes" aria-label="Protogent studio notes"><div className="notes-heading"><span className="eyebrow">Collected along the way</span><Asterisk size={19} strokeWidth={1.3} /></div><div className="notes-grid">{notes.map(([number, text]) => <article className="note-card" key={number}><span>{number} <i>/</i> PROTOGENT NOTES</span><blockquote>“{text}”</blockquote><small>— A thought from the studio</small></article>)}</div></section>
}

function Manifesto() {
  return <section className="manifesto" id="studio"><div className="manifesto-top"><span className="eyebrow">A little about us</span><span className="manifesto-number">P—01</span></div><div className="manifesto-content"><Asterisk className="manifesto-star" size={38} strokeWidth={1.2} /><h2>We believe the<br />best things happen<br />when <em>clarity meets<br />curiosity.</em></h2><div className="manifesto-aside"><p>Protogent is an independent web design and front-end development studio, shaping responsive websites from first sketch through launch.</p><a href="#contact" className="under-link">Get to know us <ArrowUpRight size={14} /></a></div></div><div className="manifesto-bottom"><span>Small by design. Big on intention.</span><span>Based everywhere <i>↗</i></span></div></section>
}

function Services() {
  const services = [
    { number: '01', name: 'Website planning & structure', description: 'Set a clear direction for your site with considered page hierarchy and user journeys.', tags: ['Goals & requirements', 'Sitemaps', 'Page planning'] },
    { number: '02', name: 'UI/UX design & prototyping', description: 'Shape intuitive page flows and testable interfaces around your audience and goals.', tags: ['Wireframes', 'User flows', 'Prototypes'] },
    { number: '03', name: 'Custom web design', description: 'Create a distinctive visual system and responsive page designs for your business.', tags: ['Art direction', 'Responsive layouts', 'Conversion paths'] },
    { number: '04', name: 'Brand identity for digital', description: 'Build a consistent identity that carries from your brand into every web touchpoint.', tags: ['Visual direction', 'Typography & colour', 'Digital guidelines'] },
    { number: '05', name: 'Front-end website development', description: 'Turn approved designs into responsive, accessible pages with polished interactions.', tags: ['React builds', 'Reusable components', 'Performance'] },
    { number: '06', name: 'Website content & SEO foundations', description: 'Give each page clear content hierarchy, useful calls to action, and search-ready basics.', tags: ['Content structure', 'Page metadata', 'Social links'] },
    { number: '07', name: 'Motion & component systems', description: 'Keep your site cohesive with a reusable interface kit and purposeful movement.', tags: ['UI libraries', 'Interaction states', 'Motion design'] },
    { number: '08', name: 'Website launch & care', description: 'Get your site ready to go live with hosting setup, responsive checks, and handoff.', tags: ['Hosting setup', 'Quality checks', 'Launch handoff'] },
  ]
  return <section className="section services-section services-showcase" id="services"><div className="services-showcase-heading"><div><span className="eyebrow section-eyebrow">What we do · 08 capabilities</span><h2>From first idea<br /><em>to a finished site.</em></h2></div><p>Web design, UI/UX, and front-end development, with the planning and launch support that make the whole process feel considered.</p></div><div className="service-card-grid">{services.map(service => <a className="service-card" href="#contact" key={service.number}><div className="service-card-top"><span>{service.number} <i>/ 08</i></span><ArrowUpRight size={16}/></div><h3>{service.name}</h3><p>{service.description}</p><div className="service-tags">{service.tags.map(tag => <span key={tag}>{tag}</span>)}</div></a>)}</div></section>
}

function Pricing() {
  const [currency, setCurrency] = useState<PriceCurrency>(getDefaultPriceCurrency)
  const plans = [
    { number: '01', name: 'Basic', price: 12999, description: 'A polished five-page business website, thoughtfully designed and built for launch.', featured: false, features: ['5 custom-designed website pages', 'Discovery, sitemap, and page hierarchy', 'Custom UI/UX and responsive visual design', 'Responsive front-end build for mobile and desktop', 'Contact form, social links, and click-to-call/email', 'Gallery or testimonials section, SEO basics, and launch QA'], hostingTerm: '12 months', hostingPrice: 2251, hostingFeatures: '1 website · 10 GB SSD · weekly backups · SSL', href: 'mailto:tejas@protogent.app,monish@protogent.app?subject=Basic%20website%20plan' },
    { number: '02', name: 'Standard', price: 20599, description: 'A complete small-business website with four extra pages and more room to grow.', featured: true, features: ['Everything in Basic', '4 additional custom pages (9 total)', 'Page-specific layouts and custom components', 'Refined navigation and interactive details', 'On-page SEO and social sharing setup', '30 days of post-launch bug-fix support'], hostingTerm: '48 months', hostingPrice: 3908.16, hostingFeatures: '1 website · 10 GB SSD · weekly backups · SSL', href: 'mailto:tejas@protogent.app,monish@protogent.app?subject=Standard%20website%20plan' },
    { number: '03', name: 'Premium', price: 28499, description: 'A broader, more bespoke website with elevated UX/UI and a 17-page scope.', featured: false, features: ['Everything in Standard', '8 additional custom pages (17 total)', 'Advanced UI/UX exploration and prototyping', 'More bespoke visual direction and motion', 'Reusable interface system and components', 'Expanded performance, accessibility, and launch review'], hostingTerm: '48 months', hostingPrice: 3908.16, hostingFeatures: '1 website · 10 GB SSD · weekly backups · SSL', href: 'mailto:tejas@protogent.app,monish@protogent.app?subject=Premium%20website%20plan' },
  ]
  return <section className="pricing-section" id="pricing">
    <div className="pricing-heading"><div><span className="eyebrow">Clear scope. Thoughtful craft.</span><h2>Choose your<br /><em>starting point.</em></h2></div><div className="pricing-heading-copy"><p>Three straightforward ways to bring your website to life. Every plan includes a responsive, custom-designed experience.</p><div className="currency-toggle" role="group" aria-label="Display prices in"><span>DISPLAY</span><button type="button" className={currency === 'INR' ? 'is-active' : ''} aria-pressed={currency === 'INR'} onClick={() => setCurrency('INR')}>₹ INR</button><button type="button" className={currency === 'USD' ? 'is-active' : ''} aria-pressed={currency === 'USD'} onClick={() => setCurrency('USD')}>$ USD</button></div></div></div>
    <div className="pricing-grid">{plans.map(plan => <article className={`price-card ${plan.featured ? 'is-featured' : ''}`} key={plan.name}>
      {plan.featured && <span className="popular-label"><Asterisk size={12} /> MOST POPULAR</span>}
      <div className="price-card-top"><span className="price-number">{plan.number} / WEBSITE PLAN</span><h3>{plan.name}</h3><p>{plan.description}</p></div>
      <div className="price-value"><strong>{formatPlanPrice(plan.price, currency)}</strong><span>one-time build fee</span></div>
      <a className="price-cta" href={plan.href}>Choose {plan.name}<ArrowUpRight size={15} /></a>
      <div className="price-feature-list">{plan.features.map(feature => <div key={feature}><span className="feature-check">↗</span>{feature}</div>)}</div>
      <div className="plan-hosting"><span>Hostinger Single · {plan.hostingTerm}</span><strong>+ {formatPlanPrice(plan.hostingPrice, currency)}</strong><small>{plan.hostingFeatures}</small></div>
    </article>)}</div>
    <div className="custom-plan"><span><Asterisk size={16} /> Need something more bespoke?</span><p>Tell us about your project and we’ll shape a plan around it.</p><a href="mailto:tejas@protogent.app,monish@protogent.app?subject=Custom%20website%20project">Let’s scope it <ArrowUpRight size={15} /></a></div>
    <p className="pricing-note">USD display uses an indicative RBI reference rate of ₹92.7968 per US$1 (23 Nov 2026). USD values are approximate; INR remains the base quote, and final international pricing should be confirmed before booking. Hosting is optional and billed separately; confirm checkout taxes and renewal pricing before purchase.</p>
  </section>
}

function Faq() {
  const questions = [
    ['Are the listed prices one-time fees?', 'Yes. The plan amount is the one-time design and front-end build fee. Hosting is optional and billed separately.'],
    ['What does Hostinger Single include?', 'The hosting option shown with each plan includes one website, 10 GB SSD storage, weekly backups, and SSL. The term and estimate vary by plan. Hostinger prices, taxes, and renewal rates can change, so we’ll confirm the final checkout amount before setup; you can also purchase hosting directly in your own account.'],
    ['Can you design and build the whole website?', 'Yes. Protogent can take a project from website planning and UI/UX through custom visual design, responsive front-end development, and launch handoff.'],
    ['Can I request extra pages or features?', 'Absolutely. Share what you need and we’ll agree on the scope and price before adding it to the project.'],
    ['What should I prepare before we start?', 'A short description of your business, your goals for the site, and any existing brand assets or useful references are a great starting point. We can work through the rest together.'],
    ['Do you offer design without development?', 'Yes. We can help with UI/UX and website design as a standalone project, or carry the work through to a complete build.'],
  ]
  return <section className="faq-section" id="faq"><div className="faq-intro"><span className="eyebrow">The useful details</span><h2>A few things<br /><em>you may wonder.</em></h2><p>Still have a question? We’re happy to talk through your project.</p><a href="mailto:tejas@protogent.app,monish@protogent.app">Ask us directly <ArrowUpRight size={15} /></a></div><div className="faq-list">{questions.map(([question, answer], index) => <details className="faq-item" key={question}><summary><span className="faq-index">0{index + 1}</span><span>{question}</span><span className="faq-toggle">+</span></summary><p>{answer}</p></details>)}</div></section>
}

function Quote() {
  return <section className="quote-section"><div className="quote-mark"><Asterisk size={32} strokeWidth={1.2} /></div><blockquote>The best work begins<br />with a better question.</blockquote><div className="quote-credit"><span><strong>Clarity before complexity.</strong><small>Curiosity over convention. Craft in every detail.</small></span><span className="quote-count">OUR APPROACH</span></div><div className="quote-orbit" /></section>
}

function Contact() {
  return <section className="contact-section" id="contact"><div className="contact-top"><span className="eyebrow">The next good thing starts here</span><span className="contact-number">P—05</span></div><div className="contact-main"><p className="contact-kicker">Have a good one in mind?</p><a className="contact-title" href="mailto:tejas@protogent.app,monish@protogent.app">Let’s make<br /><em>it matter.</em><ArrowUpRight className="contact-arrow" size={44} strokeWidth={1.2} /></a><div className="contact-right"><p>Tell us what you’re dreaming up. We’re always up for a thoughtful conversation.</p><a href="mailto:tejas@protogent.app,monish@protogent.app" className="contact-email">tejas@protogent.app<br />monish@protogent.app <ArrowUpRight size={15} /></a></div></div></section>
}

function Footer() {
  return <footer className="site-footer">
    <div className="footer-main">
      <div className="footer-identity"><a href="#top" className="footer-logo" aria-label="Back to Protogent home"><img src="/protogent-brand.svg" alt="Protogent" /></a><p>Independent by nature.<br />Intentional by design.</p><span className="footer-availability"><i /> Available for select projects</span></div>
      <div className="footer-column"><span className="footer-label">EXPLORE</span><a href="#work">Selected work <ArrowUpRight size={13}/></a><a href="#studio">The studio <ArrowUpRight size={13}/></a><a href="#services">What we do <ArrowUpRight size={13}/></a><a href="#pricing">Plans & pricing <ArrowUpRight size={13}/></a><a href="#faq">FAQs <ArrowUpRight size={13}/></a></div>
      <div className="footer-column footer-connect"><span className="footer-label">START A CONVERSATION</span><a className="footer-email" href="mailto:tejas@protogent.app,monish@protogent.app">tejas@protogent.app<br />monish@protogent.app <ArrowUpRight size={16}/></a><p>For new projects, collaborations,<br />or a simple hello.</p><span className="footer-worldwide">Working worldwide <Asterisk size={13}/></span></div>
      <div className="footer-orbit" aria-hidden="true"><Asterisk size={39} strokeWidth={1}/></div>
    </div>
    <div className="footer-bottom"><span>© 2026 Protogent Studio</span><span>Made with intent <i>✳</i></span><a href="#top">Back to the beginning <ArrowUpRight size={13}/></a></div>
  </footer>
}

function App() {
  useEffect(() => {
    const lenis = new Lenis({ duration: 1.15, smoothWheel: true, wheelMultiplier: .9, anchors: true, autoRaf: true })
    return () => lenis.destroy()
  }, [])
  return <><LightningCursor /><Navigation /><main><Hero /><Work /><CreativeQuotes /><Manifesto /><Services /><Pricing /><Faq /><Quote /><Contact /><Footer /></main><div className="availability"><span className="availability-dot" /> Available for select projects</div></>
}

export default App

import { motion } from 'framer-motion';
import { Mail, Linkedin, MapPin, Phone } from 'lucide-react';

const fadeIn = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35, ease: 'easeOut' } },
};

const hobbies = [
  { emoji: '🏠', label: 'Renovating a 150-year-old home' },
  { emoji: '🏃', label: 'Training for marathons' },
  { emoji: '🥐', label: 'Baking pastries' },
  { emoji: '🎹', label: 'Playing piano (self-described: poorly)' },
  { emoji: '🐕', label: 'Woodland walks with Barney the Golden Retriever' },
];

const values = [
  {
    title: 'Builder, not just advisor',
    body: 'I own the full lifecycle — from identifying the use case to shipping the product and driving adoption. I don\'t hand off a strategy deck and walk away.',
  },
  {
    title: 'Embed, don\'t disrupt',
    body: 'I design AI into where people already work — Salesforce, Clari, existing workflows. Adoption comes from reducing friction, not asking for behaviour change.',
  },
  {
    title: 'Measure what matters',
    body: 'Every tool I build is tied to a business outcome. Hours saved, conversion rates, adoption percentages — not vanity metrics.',
  },
  {
    title: 'Cross-functional translator',
    body: 'I bridge GTM, Tech, RevOps, and Enablement. I translate frontline workflows into product specs and executive strategy into operational reality.',
  },
];

export function PersonalProfile() {
  return (
    <motion.div
      variants={fadeIn}
      initial="hidden"
      animate="visible"
      className="py-16 md:py-20"
    >
      <div className="max-w-5xl mx-auto px-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6 mb-12">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-text-primary mb-2">Alex Farman</h2>
            <p className="text-lg text-accent font-semibold mb-4">GTM AI Strategy Consultant</p>
            <div className="flex flex-wrap gap-3 text-sm text-text-secondary">
              <a href="mailto:alexfarman94@hotmail.co.uk" className="flex items-center gap-1.5 hover:text-accent transition-colors">
                <Mail size={14} />
                alexfarman94@hotmail.co.uk
              </a>
              <a href="https://www.linkedin.com/in/alex-farman/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 hover:text-accent transition-colors">
                <Linkedin size={14} />
                LinkedIn
              </a>
              <span className="flex items-center gap-1.5">
                <MapPin size={14} />
                Bristol, UK
              </span>
              <span className="flex items-center gap-1.5">
                <Phone size={14} />
                +44 7872 445172
              </span>
            </div>
          </div>
          <div className="flex-shrink-0">
            <a
              href="/alex-farman-cv.pdf"
              download
              className="inline-flex items-center gap-2 px-5 py-2.5 border-2 border-accent text-accent rounded-lg text-sm font-semibold hover:bg-accent hover:text-white transition-colors duration-200"
            >
              Download PDF CV
            </a>
          </div>
        </div>

        {/* Bio */}
        <div className="mb-12">
          <h3 className="text-sm font-semibold text-text-secondary uppercase tracking-wider mb-4">About</h3>
          <div className="bg-bg-secondary rounded-xl p-6 md:p-8 border border-border">
            <p className="text-text-primary text-lg leading-relaxed mb-4">
              AI GTM Strategy Lead with a background in mid-market and enterprise technical sales, specialising in designing and scaling AI-enabled GTM systems.
            </p>
            <p className="text-text-secondary leading-relaxed">
              I own the full lifecycle of internal AI products — from use case identification and requirements design through to build, rollout, and iteration. I embed tools where people already work and measure impact against business outcomes.
            </p>
          </div>
        </div>

        {/* Working Principles */}
        <div className="mb-12">
          <h3 className="text-sm font-semibold text-text-secondary uppercase tracking-wider mb-4">How I work</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {values.map((v, i) => (
              <div key={i} className="p-5 bg-white border border-border rounded-xl hover:border-accent/30 transition-colors">
                <div className="font-semibold text-text-primary mb-2">{v.title}</div>
                <div className="text-sm text-text-secondary leading-relaxed">{v.body}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Outside Work */}
        <div>
          <h3 className="text-sm font-semibold text-text-secondary uppercase tracking-wider mb-4">Outside work</h3>
          <div className="flex flex-wrap gap-3">
            {hobbies.map((h, i) => (
              <div key={i} className="flex items-center gap-2 px-4 py-2 bg-bg-secondary border border-border rounded-full text-sm text-text-primary">
                <span>{h.emoji}</span>
                <span>{h.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

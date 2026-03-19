import { Mail, Linkedin, MapPin, Phone, Download } from 'lucide-react';
import { BlurFade } from './ui/blur-fade';

const hobbies = [
  { emoji: '🏛️', label: 'Renovating a Victorian terrace' },
  { emoji: '🏃', label: 'Training for distance events' },
  { emoji: '☕', label: 'Making pour-over coffee and baking sourdough' },
  { emoji: '🎹', label: 'Playing piano (not well)' },
  { emoji: '🐕', label: 'Walking Barney the Golden Retriever' },
];

const values = [
  {
    title: 'I build and ship',
    body: 'I write code, build GPTs, Gems and Notebooks, test with users, and sit in sales calls to see how people use the product. I also write the AI strategy for sales teams and how we embed it across the org.',
    icon: '🔨',
  },
  {
    title: 'Design around existing behaviour',
    body: 'The tools with best adoption fit into workflows people already have. If it needs new behaviour, it needs to be 10x better to justify the friction.',
    icon: '🔗',
  },
  {
    title: 'Measure real outcomes',
    body: 'Hours saved, adoption percentage, conversion rates. I tie everything back to business metrics and track it properly.',
    icon: '📊',
  },
  {
    title: 'Work across functions',
    body: 'I\'m comfortable with sales strategy, technical implementation, and operations. I\'ve presented to the CRO and debugged API integrations in the same week.',
    icon: '🔄',
  },
];

export function PersonalProfile() {
  return (
    <div className="py-16 md:py-20">
      <div className="max-w-5xl mx-auto px-6">

        {/* Header */}
        <BlurFade delay={0}>
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6 mb-12
            pb-10 border-b border-stone-200/60">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-text-primary mb-1">Alex Farman</h2>
              <p className="text-lg text-indigo-600 font-semibold mb-4">GTM AI Strategy Consultant</p>
              <div className="flex flex-wrap gap-2.5 text-sm text-text-secondary">
                <a href="mailto:alexfarman94@hotmail.co.uk" className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-stone-100 rounded-lg hover:bg-indigo-50 hover:text-indigo-600 transition-all duration-200">
                  <Mail size={13} /> alexfarman94@hotmail.co.uk
                </a>
                <a href="https://www.linkedin.com/in/alex-farman-53575a106/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-stone-100 rounded-lg hover:bg-indigo-50 hover:text-indigo-600 transition-all duration-200">
                  <Linkedin size={13} /> LinkedIn
                </a>
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-stone-100 rounded-lg">
                  <MapPin size={13} /> Bristol, UK
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-stone-100 rounded-lg">
                  <Phone size={13} /> +44 7872 445172
                </span>
              </div>
            </div>
            <a
              href="/alex-farman-cv.pdf"
              download
              className="flex-shrink-0 inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-semibold hover:bg-indigo-700 transition-colors duration-200 shadow-sm"
            >
              <Download size={14} />
              Download PDF CV
            </a>
          </div>
        </BlurFade>

        {/* Bio */}
        <BlurFade delay={0.07}>
          <div className="mb-12">
            <h3 className="text-xs font-semibold text-text-secondary uppercase tracking-widest mb-4">About</h3>
            <div className="bg-bg-secondary rounded-2xl p-6 md:p-8 shadow-sm">
              <p className="text-text-primary text-lg leading-relaxed mb-4">
                I build AI tools for sales teams and own the strategy for how we use AI across GTM at HiBob.
                I take projects from identifying the problem through to shipping the product and tracking adoption. I design tools that fit into existing workflows and measure everything against real business metrics.
              </p>
              <p className="text-text-secondary leading-relaxed">
                Before this I was a Sales Engineer for 4 years at Bullhorn and HiBob. I know what happens in deals, which means I know what to solve for when building tools for salespeople.
              </p>
            </div>
          </div>
        </BlurFade>

        {/* Working Principles */}
        <BlurFade delay={0.1}>
          <div className="mb-12">
            <h3 className="text-xs font-semibold text-text-secondary uppercase tracking-widest mb-5">How I work</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {values.map((v, i) => (
                <BlurFade key={i} delay={0.12 + i * 0.06}>
                  <div className="h-full p-5 bg-white rounded-2xl shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 border border-stone-100">
                    <div className="flex items-start gap-3">
                      <span className="text-xl flex-shrink-0 mt-0.5">{v.icon}</span>
                      <div>
                        <div className="font-semibold text-text-primary mb-1.5">{v.title}</div>
                        <div className="text-sm text-text-secondary leading-relaxed">{v.body}</div>
                      </div>
                    </div>
                  </div>
                </BlurFade>
              ))}
            </div>
          </div>
        </BlurFade>

        {/* Outside Work */}
        <BlurFade delay={0.25}>
          <div>
            <h3 className="text-xs font-semibold text-text-secondary uppercase tracking-widest mb-4">Outside work</h3>
            <div className="flex flex-wrap gap-2.5">
              {hobbies.map((h, i) => (
                <div key={i} className="flex items-center gap-2 px-4 py-2 bg-stone-100 rounded-full text-sm text-text-primary hover:bg-stone-200/70 transition-colors duration-200">
                  <span>{h.emoji}</span>
                  <span>{h.label}</span>
                </div>
              ))}
            </div>
          </div>
        </BlurFade>

      </div>
    </div>
  );
}

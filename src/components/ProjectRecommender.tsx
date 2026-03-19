import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Loader2, ArrowRight, RotateCcw, ExternalLink } from 'lucide-react';
import { projects } from '../data/projects';

interface ProjectRecommenderProps {
  onViewProject: () => void;
}

const steps = [
  {
    question: "What's your biggest GTM challenge?",
    options: [
      'Low tool adoption across sales',
      'Scaling demos without adding headcount',
      'Deal prep and handover quality',
      'Building consistent business cases',
    ],
  },
  {
    question: 'How big is your GTM team?',
    options: ['Under 20', '20 to 50', '50 to 200', '200+'],
  },
  {
    question: 'What matters most to you?',
    options: ['Speed to value', 'Measurable ROI', 'Adoption at scale', 'Cross-functional impact'],
  },
];

interface RecommendedProject {
  id: string;
  title: string;
  reason: string;
  keyMetric: string;
}

// Build a condensed summary of all projects for the system prompt
const projectSummaries = projects
  .map(
    p =>
      `- ${p.title} (id: ${p.id}): ${p.context} Impact: ${p.impact.map(i => `${i.value} ${i.metric}`).join(', ')}${p.flagship ? ' [FLAGSHIP]' : ''}`
  )
  .join('\n');

export function ProjectRecommender({ onViewProject }: ProjectRecommenderProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [results, setResults] = useState<RecommendedProject[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSelect = async (option: string) => {
    const newAnswers = [...answers, option];
    setAnswers(newAnswers);

    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // All steps done — call AI
      setIsLoading(true);
      setError('');

      try {
        const response = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            max_tokens: 600,
            system: `You are a project matching engine for Alex Farman's portfolio of 26 AI/GTM projects built at HiBob.

Here are all of Alex's projects:
${projectSummaries}

The visitor has answered 3 questions about their needs. Based on their answers, return the 4 most relevant projects as a JSON array. Consider:
- Their GTM challenge maps to specific project outcomes
- Their team size affects which scale of solution is relevant
- Their priorities determine which impact metrics matter most

Return ONLY a valid JSON array, no other text. Each object must have:
- id: the project id (must match exactly)
- title: the project title
- reason: 1 sentence explaining why this project is relevant to THEIR specific answers
- keyMetric: the single most impressive metric from that project

Example format:
[{"id":"deal-prep","title":"Deal Prep","reason":"Directly solves handover quality with structured AI-generated deal insights.","keyMetric":"80% global adoption"}]`,
            messages: [
              {
                role: 'user',
                content: `Find the best matching projects for this visitor:
1. Biggest GTM challenge: ${newAnswers[0]}
2. GTM team size: ${newAnswers[1]}
3. What matters most: ${newAnswers[2]}`,
              },
            ],
          }),
        });

        const data = await response.json();
        const text = data.content?.[0]?.text || '';

        // Parse the JSON from the response
        const jsonMatch = text.match(/\[[\s\S]*\]/);
        if (jsonMatch) {
          const parsed = JSON.parse(jsonMatch[0]) as RecommendedProject[];
          setResults(parsed.slice(0, 4));
        } else {
          setError('Could not parse recommendations. Try again.');
        }
      } catch {
        setError('Something went wrong. Please try again.');
      }

      setIsLoading(false);
    }
  };

  const reset = () => {
    setCurrentStep(0);
    setAnswers([]);
    setResults([]);
    setError('');
  };

  const showWizard = results.length === 0 && !isLoading && !error;
  const stepProgress = Math.min(currentStep + 1, steps.length);

  return (
    <div className="relative bg-gradient-to-br from-accent to-blue-700 rounded-2xl p-8 md:p-10 overflow-hidden">
      {/* Dot pattern */}
      <div
        className="absolute inset-0 opacity-[0.08]"
        style={{
          backgroundImage: 'radial-gradient(circle, #ffffff 1px, transparent 1px)',
          backgroundSize: '24px 24px',
        }}
      />

      <div className="relative">
        {/* Header */}
        <div className="flex items-center gap-2 mb-1">
          <Sparkles size={18} className="text-blue-200" />
          <h3 className="text-xl md:text-2xl font-bold text-white">Which of my projects are most relevant to you?</h3>
        </div>
        <p className="text-blue-100 text-sm mb-6 leading-relaxed">
          Answer 3 quick questions and I'll match you to the most relevant work from my portfolio.
        </p>

        {/* Progress */}
        {showWizard && (
          <div className="flex gap-1.5 mb-6">
            {steps.map((_, i) => (
              <div
                key={i}
                className={`h-1 rounded-full flex-1 transition-colors duration-300 ${
                  i < stepProgress ? 'bg-white' : 'bg-white/20'
                }`}
              />
            ))}
          </div>
        )}

        {/* Wizard */}
        {showWizard && (
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              <p className="text-white font-semibold text-sm mb-4">{steps[currentStep].question}</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {steps[currentStep].options.map((option, i) => (
                  <button
                    key={i}
                    onClick={() => handleSelect(option)}
                    className="text-left px-4 py-3 bg-white/10 hover:bg-white/20 border border-white/15 hover:border-white/30 rounded-xl text-sm text-white font-medium transition-all duration-150 flex items-center justify-between gap-2 group"
                  >
                    {option}
                    <ArrowRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
                  </button>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
        )}

        {/* Loading */}
        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-3 py-8 justify-center"
          >
            <Loader2 size={20} className="animate-spin text-white" />
            <span className="text-white text-sm font-medium">Matching you to the most relevant projects...</span>
          </motion.div>
        )}

        {/* Error */}
        {error && (
          <div className="text-center py-6">
            <p className="text-blue-100 text-sm mb-3">{error}</p>
            <button onClick={reset} className="text-white text-sm underline underline-offset-2 hover:text-blue-100">
              Try again
            </button>
          </div>
        )}

        {/* Results */}
        {results.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
            <p className="text-white/70 text-xs uppercase tracking-widest font-semibold mb-4">
              Based on your answers, here are my most relevant projects:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
              {results.map((project, i) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1, duration: 0.25 }}
                  className="bg-white/12 backdrop-blur-sm border border-white/15 rounded-xl p-4"
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h4 className="text-white font-semibold text-sm leading-tight">{project.title}</h4>
                    <button
                      onClick={onViewProject}
                      className="text-blue-200 hover:text-white transition-colors flex-shrink-0"
                      title="View in Projects tab"
                    >
                      <ExternalLink size={13} />
                    </button>
                  </div>
                  <p className="text-blue-100 text-xs leading-relaxed mb-2.5">{project.reason}</p>
                  <div className="inline-block px-2 py-0.5 bg-white/15 rounded text-xs text-white font-semibold">
                    {project.keyMetric}
                  </div>
                </motion.div>
              ))}
            </div>
            <button
              onClick={reset}
              className="inline-flex items-center gap-1.5 text-blue-200 hover:text-white text-sm font-medium transition-colors"
            >
              <RotateCcw size={13} />
              Start over
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
}

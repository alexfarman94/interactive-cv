import { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X, Upload, FileText, Loader2, Copy, Check,
  RefreshCw, ChevronRight, AlertCircle, Sparkles,
} from 'lucide-react';

interface AnalysisResult {
  summary: string;
  matchScore: number;
  matchScoreExplanation: string;
  strengths: { title: string; evidence: string }[];
  gaps: { title: string; note: string }[];
  relevantProjects: { name: string; relevance: string }[];
  positioning: string;
  interviewTalkingPoints: string[];
  suggestedQuestions: string[];
}

type InputTab = 'paste' | 'upload';
type ViewState = 'input' | 'loading' | 'results' | 'error';

interface JobSpecAnalyzerProps {
  isOpen: boolean;
  onClose: () => void;
}

const ACCEPTED_TYPES = {
  'application/pdf': '.pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': '.docx',
  'text/plain': '.txt',
};

function ScoreRing({ score }: { score: number }) {
  const color = score >= 80 ? 'text-emerald-600' : score >= 60 ? 'text-indigo-600' : 'text-amber-600';
  const bg = score >= 80 ? 'bg-emerald-50' : score >= 60 ? 'bg-indigo-50' : 'bg-amber-50';
  const label = score >= 80 ? 'Strong fit' : score >= 60 ? 'Good fit' : 'Partial fit';
  return (
    <div className={`flex items-center gap-2 px-3 py-1.5 ${bg} rounded-full`}>
      <span className={`text-lg font-bold ${color}`}>{score}%</span>
      <span className={`text-xs font-semibold ${color}`}>{label}</span>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-6">
      <h4 className="text-xs font-bold text-text-secondary uppercase tracking-widest mb-3">{title}</h4>
      {children}
    </div>
  );
}

export function JobSpecAnalyzer({ isOpen, onClose }: JobSpecAnalyzerProps) {
  const [inputTab, setInputTab] = useState<InputTab>('paste');
  const [pastedText, setPastedText] = useState('');
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [viewState, setViewState] = useState<ViewState>('input');
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [copied, setCopied] = useState(false);
  const [lastJobSpecText, setLastJobSpecText] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const hasContent = inputTab === 'paste' ? pastedText.trim().length >= 50 : uploadedFile !== null;

  const extractTextFromFile = async (file: File): Promise<string> => {
    if (file.type === 'text/plain') {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = e => resolve(e.target?.result as string);
        reader.onerror = () => reject(new Error('Could not read file'));
        reader.readAsText(file);
      });
    }

    // PDF or DOCX: send to server for extraction
    const base64 = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = e => {
        const dataUrl = e.target?.result as string;
        resolve(dataUrl.split(',')[1]); // strip data URL prefix
      };
      reader.onerror = () => reject(new Error('Could not read file'));
      reader.readAsDataURL(file);
    });

    const response = await fetch('/api/parse-file', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fileBase64: base64, mimeType: file.type }),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'Failed to extract text from file');
    return data.text;
  };

  const runAnalysis = async (jobSpecText: string) => {
    setLastJobSpecText(jobSpecText);
    setViewState('loading');
    setErrorMsg('');

    try {
      const response = await fetch('/api/analyze-job', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jobSpecText }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Analysis failed');

      const rawText = data.content?.[0]?.text || '';
      // Strip any markdown code fences if Claude wraps the JSON
      const jsonText = rawText.replace(/^```json\n?/, '').replace(/\n?```$/, '').trim();
      const parsed: AnalysisResult = JSON.parse(jsonText);
      setResult(parsed);
      setViewState('results');
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
      setViewState('error');
    }
  };

  const handleSubmit = async () => {
    if (!hasContent) return;
    try {
      const text = inputTab === 'paste' ? pastedText : await extractTextFromFile(uploadedFile!);
      await runAnalysis(text);
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Could not read the file. Please try another format.');
      setViewState('error');
    }
  };

  const handleRegenerate = () => runAnalysis(lastJobSpecText);

  const handleStartOver = () => {
    setViewState('input');
    setResult(null);
    setPastedText('');
    setUploadedFile(null);
    setErrorMsg('');
  };

  const handleCopyAll = async () => {
    if (!result) return;
    const lines = [
      `MATCH SCORE: ${result.matchScore}% — ${result.matchScoreExplanation}`,
      '',
      'OVERALL FIT',
      result.summary,
      '',
      'STRENGTHS',
      ...result.strengths.map(s => `• ${s.title}: ${s.evidence}`),
      '',
      'RELEVANT PROJECTS',
      ...result.relevantProjects.map(p => `• ${p.name}: ${p.relevance}`),
      '',
      'POTENTIAL GAPS',
      ...result.gaps.map(g => `• ${g.title}: ${g.note}`),
      '',
      'HOW TO POSITION ALEX',
      result.positioning,
      '',
      'INTERVIEW TALKING POINTS',
      ...result.interviewTalkingPoints.map(t => `• ${t}`),
      '',
      'SUGGESTED INTERVIEW QUESTIONS',
      ...result.suggestedQuestions.map(q => `• ${q}`),
    ];
    await navigator.clipboard.writeText(lines.join('\n'));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleFileDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file && Object.keys(ACCEPTED_TYPES).includes(file.type)) {
      setUploadedFile(file);
    }
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setUploadedFile(file);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-end md:items-center justify-center p-0 md:p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        {/* Backdrop */}
        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />

        {/* Modal */}
        <motion.div
          className="relative w-full md:max-w-2xl bg-white rounded-t-2xl md:rounded-2xl shadow-2xl flex flex-col max-h-[92vh] md:max-h-[85vh]"
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 40, opacity: 0 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          onClick={e => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-stone-100 flex-shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-full bg-indigo-600 flex items-center justify-center">
                <Sparkles size={13} className="text-white" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-text-primary">Analyse a Job Spec</h3>
                <p className="text-[11px] text-text-secondary">AI-generated fit report against Alex's profile</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {viewState === 'results' && result && (
                <>
                  <ScoreRing score={result.matchScore} />
                  <button
                    onClick={handleRegenerate}
                    title="Regenerate"
                    className="p-1.5 rounded-lg text-stone-400 hover:text-stone-600 hover:bg-stone-100 transition-colors"
                  >
                    <RefreshCw size={14} />
                  </button>
                  <button
                    onClick={handleCopyAll}
                    title="Copy all"
                    className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-indigo-600 hover:bg-indigo-50 transition-colors"
                  >
                    {copied ? <Check size={13} /> : <Copy size={13} />}
                    {copied ? 'Copied' : 'Copy'}
                  </button>
                </>
              )}
              <button onClick={onClose} className="p-1.5 rounded-lg text-stone-400 hover:text-stone-600 hover:bg-stone-100 transition-colors" aria-label="Close">
                <X size={15} />
              </button>
            </div>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto">

            {/* INPUT STATE */}
            {viewState === 'input' && (
              <div className="p-5">
                {/* Input method tabs */}
                <div className="flex gap-1 mb-5 bg-stone-100 rounded-xl p-1">
                  {(['paste', 'upload'] as InputTab[]).map(tab => (
                    <button
                      key={tab}
                      onClick={() => setInputTab(tab)}
                      className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
                        inputTab === tab ? 'bg-white text-text-primary shadow-sm' : 'text-text-secondary hover:text-text-primary'
                      }`}
                    >
                      {tab === 'paste' ? <FileText size={14} /> : <Upload size={14} />}
                      {tab === 'paste' ? 'Paste text' : 'Upload file'}
                    </button>
                  ))}
                </div>

                {/* Paste */}
                {inputTab === 'paste' && (
                  <textarea
                    value={pastedText}
                    onChange={e => setPastedText(e.target.value)}
                    rows={10}
                    placeholder="Paste the full job description here..."
                    className="w-full p-4 bg-stone-50 border border-stone-200 rounded-xl text-sm text-text-primary placeholder-stone-400 focus:outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400/30 resize-none transition-colors"
                  />
                )}

                {/* Upload */}
                {inputTab === 'upload' && (
                  <div
                    onDragOver={e => { e.preventDefault(); setIsDragging(true); }}
                    onDragLeave={() => setIsDragging(false)}
                    onDrop={handleFileDrop}
                    onClick={() => fileInputRef.current?.click()}
                    className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-200 ${
                      isDragging ? 'border-indigo-400 bg-indigo-50' : uploadedFile ? 'border-emerald-300 bg-emerald-50' : 'border-stone-200 hover:border-indigo-300 hover:bg-stone-50'
                    }`}
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".pdf,.docx,.txt"
                      className="hidden"
                      onChange={handleFileSelect}
                    />
                    {uploadedFile ? (
                      <div className="flex flex-col items-center gap-2">
                        <FileText size={24} className="text-emerald-500" />
                        <span className="text-sm font-semibold text-emerald-700">{uploadedFile.name}</span>
                        <button
                          onClick={e => { e.stopPropagation(); setUploadedFile(null); }}
                          className="text-xs text-stone-400 hover:text-stone-600 underline"
                        >
                          Remove
                        </button>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center gap-2">
                        <Upload size={24} className="text-stone-400" />
                        <span className="text-sm font-semibold text-text-primary">Drop a file or click to browse</span>
                        <span className="text-xs text-text-secondary">Supports PDF, DOCX, TXT · Max 5MB</span>
                      </div>
                    )}
                  </div>
                )}

                <p className="text-[11px] text-text-secondary mt-3 text-center">
                  Job specs are used only to generate this analysis and are not stored.
                </p>

                <button
                  onClick={handleSubmit}
                  disabled={!hasContent}
                  className="w-full mt-4 flex items-center justify-center gap-2 py-3 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-semibold rounded-xl transition-colors duration-200"
                >
                  <Sparkles size={15} />
                  Analyse fit
                </button>
              </div>
            )}

            {/* LOADING STATE */}
            {viewState === 'loading' && (
              <div className="p-8 flex flex-col items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-indigo-50 flex items-center justify-center">
                  <Loader2 size={22} className="animate-spin text-indigo-600" />
                </div>
                <div className="text-center">
                  <p className="text-sm font-semibold text-text-primary">Analysing fit...</p>
                  <p className="text-xs text-text-secondary mt-1">Comparing role requirements to Alex's profile and 26 projects</p>
                </div>
                {/* Skeleton */}
                <div className="w-full space-y-3 mt-2">
                  {[80, 60, 90, 70].map((w, i) => (
                    <div key={i} className={`h-4 bg-stone-100 rounded-full animate-pulse`} style={{ width: `${w}%` }} />
                  ))}
                </div>
              </div>
            )}

            {/* RESULTS STATE */}
            {viewState === 'results' && result && (
              <div className="p-5 space-y-1">

                {/* Summary */}
                <Section title="Overall fit">
                  <p className="text-sm text-text-primary leading-relaxed">{result.summary}</p>
                  <p className="text-xs text-text-secondary mt-2 italic">{result.matchScoreExplanation}</p>
                </Section>

                {/* Strengths */}
                <Section title="Strengths">
                  <div className="space-y-2.5">
                    {result.strengths.map((s, i) => (
                      <div key={i} className="flex gap-3 p-3.5 bg-emerald-50 border border-emerald-100 rounded-xl">
                        <ChevronRight size={14} className="text-emerald-500 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="text-xs font-semibold text-emerald-800">{s.title}</p>
                          <p className="text-xs text-emerald-700 mt-0.5 leading-relaxed">{s.evidence}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </Section>

                {/* Relevant projects */}
                <Section title="Relevant projects">
                  <div className="space-y-2.5">
                    {result.relevantProjects.map((p, i) => (
                      <div key={i} className="flex gap-3 p-3.5 bg-indigo-50 border border-indigo-100 rounded-xl">
                        <span className="text-indigo-400 font-bold text-xs flex-shrink-0 mt-0.5">{String(i + 1).padStart(2, '0')}</span>
                        <div>
                          <p className="text-xs font-semibold text-indigo-800">{p.name}</p>
                          <p className="text-xs text-indigo-700 mt-0.5 leading-relaxed">{p.relevance}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </Section>

                {/* Gaps */}
                {result.gaps.length > 0 && (
                  <Section title="Areas to explore">
                    <div className="space-y-2.5">
                      {result.gaps.map((g, i) => (
                        <div key={i} className="flex gap-3 p-3.5 bg-stone-50 border border-stone-200 rounded-xl">
                          <AlertCircle size={14} className="text-stone-400 flex-shrink-0 mt-0.5" />
                          <div>
                            <p className="text-xs font-semibold text-text-primary">{g.title}</p>
                            <p className="text-xs text-text-secondary mt-0.5 leading-relaxed">{g.note}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </Section>
                )}

                {/* Positioning */}
                <Section title="How to position Alex">
                  <p className="text-sm text-text-primary leading-relaxed p-4 bg-stone-50 rounded-xl border border-stone-100">{result.positioning}</p>
                </Section>

                {/* Interview prep */}
                <Section title="Interview talking points">
                  <ul className="space-y-1.5">
                    {result.interviewTalkingPoints.map((t, i) => (
                      <li key={i} className="flex gap-2 text-sm text-text-primary">
                        <span className="text-indigo-400 font-bold flex-shrink-0">•</span>
                        {t}
                      </li>
                    ))}
                  </ul>
                </Section>

                <Section title="Suggested questions to ask Alex">
                  <ul className="space-y-1.5">
                    {result.suggestedQuestions.map((q, i) => (
                      <li key={i} className="flex gap-2 text-sm text-text-secondary">
                        <span className="text-stone-400 font-bold flex-shrink-0">?</span>
                        {q}
                      </li>
                    ))}
                  </ul>
                </Section>

                <div className="pt-2 pb-1 text-center">
                  <button onClick={handleStartOver} className="text-xs text-text-secondary hover:text-text-primary underline transition-colors">
                    Start over with a different job spec
                  </button>
                </div>
              </div>
            )}

            {/* ERROR STATE */}
            {viewState === 'error' && (
              <div className="p-8 flex flex-col items-center gap-4 text-center">
                <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center">
                  <AlertCircle size={22} className="text-red-400" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-text-primary">Something went wrong</p>
                  <p className="text-xs text-text-secondary mt-1">{errorMsg}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={handleStartOver}
                    className="px-4 py-2 border border-stone-200 rounded-xl text-sm text-text-secondary hover:text-text-primary hover:bg-stone-50 transition-colors"
                  >
                    Start over
                  </button>
                  {lastJobSpecText && (
                    <button
                      onClick={handleRegenerate}
                      className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-xl transition-colors"
                    >
                      <RefreshCw size={13} />
                      Retry
                    </button>
                  )}
                </div>
              </div>
            )}

          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

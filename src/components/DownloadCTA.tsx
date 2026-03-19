import { Download, Mail, Linkedin } from 'lucide-react';

interface DownloadCTAProps {
  onDownloadCV: () => void;
}

export function DownloadCTA({ onDownloadCV }: DownloadCTAProps) {
  return (
    <footer className="py-12 bg-stone-950 text-white">
      <div className="max-w-4xl mx-auto px-6 text-center">
        <p className="text-stone-500 text-sm mb-6">Ready to connect?</p>

        <div className="flex flex-wrap justify-center gap-4 mb-8">
          <a
            href="mailto:alexfarman94@hotmail.co.uk"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/[0.07] hover:bg-white/[0.12] border border-white/[0.08] rounded-xl text-sm font-medium transition-all duration-200"
          >
            <Mail size={16} />
            alexfarman94@hotmail.co.uk
          </a>
          <a
            href="https://www.linkedin.com/in/alex-farman-53575a106/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/[0.07] hover:bg-white/[0.12] border border-white/[0.08] rounded-xl text-sm font-medium transition-all duration-200"
          >
            <Linkedin size={16} />
            LinkedIn
          </a>
          <button
            onClick={onDownloadCV}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/[0.07] hover:bg-white/[0.12] border border-white/[0.08] rounded-xl text-sm font-medium transition-all duration-200"
          >
            <Download size={16} />
            Download CV (PDF)
          </button>
        </div>

        <p className="text-stone-600 text-xs">
          Built with React, TypeScript & Claude · Alex Farman {new Date().getFullYear()}
        </p>
      </div>
    </footer>
  );
}

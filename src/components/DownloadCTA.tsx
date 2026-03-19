import { Download, Mail, Linkedin } from 'lucide-react';

interface DownloadCTAProps {
  onDownloadCV: () => void;
}

export function DownloadCTA({ onDownloadCV }: DownloadCTAProps) {
  return (
    <footer className="py-12 bg-text-primary text-white">
      <div className="max-w-4xl mx-auto px-6 text-center">
        <p className="text-gray-400 text-sm mb-6">Ready to connect?</p>

        <div className="flex flex-wrap justify-center gap-4 mb-8">
          <a
            href="mailto:alexfarman94@hotmail.co.uk"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/10 hover:bg-white/20 rounded-lg text-sm font-medium transition-colors"
          >
            <Mail size={16} />
            alexfarman94@hotmail.co.uk
          </a>
          <a
            href="https://www.linkedin.com/in/alex-farman-53575a106/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/10 hover:bg-white/20 rounded-lg text-sm font-medium transition-colors"
          >
            <Linkedin size={16} />
            LinkedIn
          </a>
          <button
            onClick={onDownloadCV}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/10 hover:bg-white/20 rounded-lg text-sm font-medium transition-colors"
          >
            <Download size={16} />
            Download CV (PDF)
          </button>
        </div>

        <p className="text-gray-500 text-xs">
          Built with React, TypeScript & Claude · Alex Farman {new Date().getFullYear()}
        </p>
      </div>
    </footer>
  );
}

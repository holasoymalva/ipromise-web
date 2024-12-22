import React from 'react';
import { Github } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="w-full py-6 bg-white border-t">
      <div className="max-w-2xl mx-auto px-4 flex items-center justify-center gap-2">
        <a
          href="https://github.com/holasoymalva"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
        >
          <Github className="w-5 h-5" />
          <span className="font-medium">@holasoymalva</span>
        </a>
      </div>
      <div className="text-center mt-2 text-sm text-gray-500">
        Hecho con ♥️ para la comunidad
      </div>
    </footer>
  );
};

export default Footer;
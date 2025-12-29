import React from 'react';
import PropTypes from 'prop-types';
import { ArrowRight, X } from 'lucide-react';

const AnnouncementBanner = ({ onClose }) => {
  return (
    <div className="w-full bg-gradient-magenta text-white">
      <div className="flex items-center justify-center gap-2 p-3 text-center relative">
        <span className="text-xl">🎉</span>
        <p className="flex gap-1 text-sm font-bold">
          We've raised a $25M Series A.
          <a 
            href="#funding" 
            className="flex gap-1 items-center font-medium hover:underline group"
          >
            Read more
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </a>
        </p>
        {onClose && (
          <button
            onClick={onClose}
            className="absolute right-4 p-1 hover:bg-white/20 rounded transition-colors"
            aria-label="Close banner"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};

AnnouncementBanner.propTypes = {
  onClose: PropTypes.func,
};

export default AnnouncementBanner;

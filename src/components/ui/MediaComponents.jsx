import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { cn } from '../../lib/utils';
import { ChevronLeft, ChevronRight, X, ZoomIn, Play, Pause, Volume2, VolumeX } from 'lucide-react';

/**
 * Responsive Media Components - Gallery, Carousel, Video Player
 */

// Image Gallery with Lightbox
export const ImageGallery = ({ images = [], columns = { xs: 1, sm: 2, md: 3, lg: 4 }, className }) => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const gridCols = {
    1: 'grid-cols-1',
    2: 'grid-cols-2',
    3: 'grid-cols-3',
    4: 'grid-cols-4',
    5: 'grid-cols-5',
    6: 'grid-cols-6'
  };

  const openLightbox = (index) => {
    setLightboxIndex(index);
    setSelectedImage(images[index]);
  };

  const closeLightbox = () => {
    setSelectedImage(null);
  };

  const nextImage = () => {
    const newIndex = (lightboxIndex + 1) % images.length;
    setLightboxIndex(newIndex);
    setSelectedImage(images[newIndex]);
  };

  const prevImage = () => {
    const newIndex = (lightboxIndex - 1 + images.length) % images.length;
    setLightboxIndex(newIndex);
    setSelectedImage(images[newIndex]);
  };

  useEffect(() => {
    const handleKeyPress = (e) => {
      if (!selectedImage) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowRight') nextImage();
      if (e.key === 'ArrowLeft') prevImage();
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [selectedImage, lightboxIndex]);

  return (
    <>
      <div
        className={cn(
          'grid gap-4',
          `${gridCols[columns.xs || 1]}`,
          columns.sm && `sm:${gridCols[columns.sm]}`,
          columns.md && `md:${gridCols[columns.md]}`,
          columns.lg && `lg:${gridCols[columns.lg]}`,
          className
        )}
      >
        {images.map((image, index) => (
          <div
            key={index}
            onClick={() => openLightbox(index)}
            className={cn(
              'relative aspect-square overflow-hidden rounded-lg cursor-pointer',
              'group hover:shadow-xl transition-all'
            )}
          >
            <img
              src={image.url || image}
              alt={image.alt || `Image ${index + 1}`}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
              <ZoomIn
                className="text-white opacity-0 group-hover:opacity-100 transition-opacity"
                size={32}
              />
            </div>
            {image.title && (
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-3">
                <p className="text-white text-sm font-medium">{image.title}</p>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Lightbox */}
      {selectedImage && (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4">
          {/* Close Button */}
          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
          >
            <X size={24} className="text-white" />
          </button>

          {/* Navigation */}
          {images.length > 1 && (
            <>
              <button
                onClick={prevImage}
                className="absolute left-4 p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
              >
                <ChevronLeft size={24} className="text-white" />
              </button>
              <button
                onClick={nextImage}
                className="absolute right-4 p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
              >
                <ChevronRight size={24} className="text-white" />
              </button>
            </>
          )}

          {/* Image */}
          <div className="max-w-7xl max-h-[90vh] flex flex-col items-center">
            <img
              src={selectedImage.url || selectedImage}
              alt={selectedImage.alt || 'Full size'}
              className="max-w-full max-h-full object-contain rounded-lg"
            />
            {selectedImage.title && (
              <p className="mt-4 text-white text-center">{selectedImage.title}</p>
            )}
          </div>

          {/* Counter */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white text-sm">
            {lightboxIndex + 1} / {images.length}
          </div>
        </div>
      )}
    </>
  );
};

// Carousel with Touch Support
export const Carousel = ({ items = [], autoPlay = false, interval = 5000, className }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(autoPlay);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  useEffect(() => {
    if (!isAutoPlaying) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % items.length);
    }, interval);

    return () => clearInterval(timer);
  }, [isAutoPlaying, interval, items.length]);

  const goToSlide = (index) => {
    setCurrentIndex(index);
    setIsAutoPlaying(false);
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % items.length);
    setIsAutoPlaying(false);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + items.length) % items.length);
    setIsAutoPlaying(false);
  };

  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    const diff = touchStartX.current - touchEndX.current;
    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        nextSlide();
      } else {
        prevSlide();
      }
    }
  };

  return (
    <div className={cn('relative group', className)}>
      {/* Carousel Container */}
      <div
        className="relative aspect-video overflow-hidden rounded-xl"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Slides */}
        <div
          className="flex transition-transform duration-500 ease-out h-full"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {items.map((item, index) => (
            <div key={index} className="min-w-full flex-shrink-0 relative">
              {item.type === 'image' ? (
                <img
                  src={item.src}
                  alt={item.alt || `Slide ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                  {item.content}
                </div>
              )}
              {item.title && (
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-6">
                  <h3 className="text-white text-xl sm:text-2xl font-bold">{item.title}</h3>
                  {item.description && (
                    <p className="text-white/90 text-sm sm:text-base mt-2">{item.description}</p>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Navigation Arrows - Desktop */}
        <button
          onClick={prevSlide}
          className={cn(
            'absolute left-4 top-1/2 -translate-y-1/2',
            'p-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full',
            'opacity-0 group-hover:opacity-100 transition-opacity',
            'hidden sm:block'
          )}
        >
          <ChevronLeft size={24} className="text-white" />
        </button>
        <button
          onClick={nextSlide}
          className={cn(
            'absolute right-4 top-1/2 -translate-y-1/2',
            'p-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full',
            'opacity-0 group-hover:opacity-100 transition-opacity',
            'hidden sm:block'
          )}
        >
          <ChevronRight size={24} className="text-white" />
        </button>
      </div>

      {/* Indicators */}
      <div className="flex items-center justify-center gap-2 mt-4">
        {items.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={cn(
              'h-2 rounded-full transition-all',
              index === currentIndex
                ? 'w-8 bg-blue-600'
                : 'w-2 bg-gray-300 dark:bg-gray-600 hover:bg-gray-400'
            )}
          />
        ))}
      </div>
    </div>
  );
};

ImageGallery.propTypes = {
  images: PropTypes.arrayOf(
    PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.shape({
        url: PropTypes.string,
        alt: PropTypes.string,
        title: PropTypes.string
      })
    ])
  ),
  columns: PropTypes.shape({
    xs: PropTypes.number,
    sm: PropTypes.number,
    md: PropTypes.number,
    lg: PropTypes.number
  }),
  className: PropTypes.string
};

// Video Player
export const VideoEmbed = ({ 
  src, 
  poster, 
  type = 'video/mp4',
  title,
  controls = true,
  autoplay = false,
  className 
}) => {
  const [isPlaying, setIsPlaying] = useState(autoplay);
  const [isMuted, setIsMuted] = useState(autoplay); // Autoplay videos should be muted
  const videoRef = useRef(null);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  return (
    <div className={cn('relative group', className)}>
      <div className="relative aspect-video bg-black rounded-xl overflow-hidden">
        <video
          ref={videoRef}
          src={src}
          poster={poster}
          type={type}
          autoPlay={autoplay}
          muted={isMuted}
          playsInline
          className="w-full h-full"
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
        >
          <track kind="captions" srcLang="en" label="English" />
          Your browser does not support the video tag.
        </video>

        {/* Custom Controls Overlay */}
        {!controls && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={togglePlay}
              className="p-4 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full transition-colors"
            >
              {isPlaying ? (
                <Pause size={32} className="text-white" />
              ) : (
                <Play size={32} className="text-white ml-1" />
              )}
            </button>
          </div>
        )}

        {/* Volume Control */}
        <button
          onClick={toggleMute}
          className="absolute bottom-4 right-4 p-2 bg-black/50 hover:bg-black/70 rounded-lg transition-colors"
        >
          {isMuted ? (
            <VolumeX size={20} className="text-white" />
          ) : (
            <Volume2 size={20} className="text-white" />
          )}
        </button>

        {/* Title Overlay */}
        {title && (
          <div className="absolute top-0 left-0 right-0 bg-gradient-to-b from-black/60 to-transparent p-4">
            <h3 className="text-white text-lg font-semibold">{title}</h3>
          </div>
        )}
      </div>

      {/* Native Controls */}
      {controls && (
        <video
          controls
          src={src}
          poster={poster}
          className="w-full aspect-video rounded-xl"
        >
          <track kind="captions" srcLang="en" label="English" />
          Your browser does not support the video tag.
        </video>
      )}
    </div>
  );
};

// YouTube/Vimeo Embed
export const VideoIframe = ({ url, title, aspectRatio = '16/9', className }) => {
  return (
    <div
      className={cn('relative overflow-hidden rounded-xl', className)}
      style={{ aspectRatio }}
    >
      <iframe
        src={url}
        title={title || 'Video'}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        className="absolute inset-0 w-full h-full"
      />
    </div>
  );
};

VideoEmbed.propTypes = {
  src: PropTypes.string.isRequired,
  poster: PropTypes.string,
  type: PropTypes.string,
  title: PropTypes.string,
  controls: PropTypes.bool,
  autoplay: PropTypes.bool,
  className: PropTypes.string
};

VideoIframe.propTypes = {
  url: PropTypes.string.isRequired,
  title: PropTypes.string,
  aspectRatio: PropTypes.string,
  className: PropTypes.string
};

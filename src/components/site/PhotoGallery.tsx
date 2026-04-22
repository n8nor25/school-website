'use client';

import { useState, useEffect, useCallback } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const galleryImages = [
  { id: 1, src: '/images/gallery/gallery1.jpg', alt: 'صورة المدرسة 1' },
  { id: 2, src: '/images/gallery/gallery2.jpg', alt: 'صورة المدرسة 2' },
  { id: 3, src: '/images/gallery/gallery3.jpg', alt: 'صورة المدرسة 3' },
  { id: 4, src: '/images/gallery/gallery4.jpg', alt: 'صورة المدرسة 4' },
  { id: 5, src: '/images/gallery/gallery5.jpg', alt: 'صورة المدرسة 5' },
  { id: 6, src: '/images/gallery/gallery6.jpg', alt: 'صورة المدرسة 6' },
  { id: 7, src: '/images/gallery/gallery7.jpg', alt: 'صورة المدرسة 7' },
  { id: 8, src: '/images/gallery/gallery8.jpg', alt: 'صورة المدرسة 8' },
];

export default function PhotoGallery() {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const openLightbox = (index: number) => {
    setCurrentIndex(index);
    setLightboxOpen(true);
  };

  const closeLightbox = useCallback(() => {
    setLightboxOpen(false);
  }, []);

  const goNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % galleryImages.length);
  }, []);

  const goPrev = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + galleryImages.length) % galleryImages.length);
  }, []);

  // Keyboard navigation
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!lightboxOpen) return;
      switch (e.key) {
        case 'Escape':
          closeLightbox();
          break;
        case 'ArrowRight':
          goPrev(); // RTL: right arrow = previous
          break;
        case 'ArrowLeft':
          goNext(); // RTL: left arrow = next
          break;
      }
    },
    [lightboxOpen, closeLightbox, goNext, goPrev]
  );

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  // Prevent body scroll when lightbox open
  useEffect(() => {
    if (lightboxOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [lightboxOpen]);

  return (
    <section className="py-16 md:py-24 bg-gray-50 dark:bg-gray-800 dark-transition">
      <div className="container mx-auto px-4">
        {/* Section Title */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-[#2A374E] dark:text-white mb-3">
            معرض الصور
          </h2>
          <div className="w-20 h-1 bg-red-600 mx-auto rounded-full" />
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {galleryImages.map((image, index) => (
            <div
              key={image.id}
              className="relative rounded-xl overflow-hidden shadow-md cursor-pointer group hover-lift transition-all duration-300 aspect-square"
              onClick={() => openLightbox(index)}
            >
              <img
                src={image.src}
                alt={image.alt}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = `https://picsum.photos/400/400?random=gallery${image.id}`;
                }}
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-300 flex items-center justify-center">
                <span className="text-white opacity-0 group-hover:opacity-100 transition-opacity text-sm font-medium">
                  عرض الصورة
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox Modal */}
      {lightboxOpen && (
        <div
          className="fixed inset-0 z-[100] bg-black/95 flex flex-col items-center justify-center animate-fade-in"
          onClick={closeLightbox}
        >
          {/* Close Button */}
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-4 left-4 text-white hover:bg-white/10 z-10 h-10 w-10"
            onClick={closeLightbox}
            aria-label="إغلاق"
          >
            <X size={24} />
          </Button>

          {/* Image Counter */}
          <div className="absolute top-4 right-4 text-white text-sm bg-black/50 px-3 py-1 rounded-full z-10">
            {currentIndex + 1} / {galleryImages.length}
          </div>

          {/* Main Image */}
          <div
            className="relative max-w-4xl max-h-[70vh] mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={galleryImages[currentIndex].src}
              alt={galleryImages[currentIndex].alt}
              className="max-w-full max-h-[70vh] object-contain rounded-lg"
              onError={(e) => {
                (e.target as HTMLImageElement).src = `https://picsum.photos/800/600?random=gallery${galleryImages[currentIndex].id}`;
              }}
            />

            {/* Navigation Arrows */}
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-[-50px] top-1/2 -translate-y-1/2 text-white hover:bg-white/10 h-12 w-12"
              onClick={(e) => { e.stopPropagation(); goPrev(); }}
              aria-label="السابق"
            >
              <ChevronRight size={32} />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="absolute left-[-50px] top-1/2 -translate-y-1/2 text-white hover:bg-white/10 h-12 w-12"
              onClick={(e) => { e.stopPropagation(); goNext(); }}
              aria-label="التالي"
            >
              <ChevronLeft size={32} />
            </Button>
          </div>

          {/* Thumbnail Strip */}
          <div
            className="mt-4 flex gap-2 px-4 max-w-4xl overflow-x-auto custom-scrollbar"
            onClick={(e) => e.stopPropagation()}
          >
            {galleryImages.map((image, index) => (
              <button
                key={image.id}
                onClick={() => setCurrentIndex(index)}
                className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                  index === currentIndex
                    ? 'border-red-600 opacity-100'
                    : 'border-transparent opacity-50 hover:opacity-75'
                }`}
              >
                <img
                  src={image.src}
                  alt={image.alt}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = `https://picsum.photos/80/80?random=gallery${image.id}`;
                  }}
                />
              </button>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}

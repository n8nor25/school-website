import React, { useState, useEffect } from 'react';

const galleryImages = [
  { src: '/images/gallery/gallery1.jpg', alt: 'طلاب في الفصل الدراسي' },
  { src: '/images/gallery/gallery2.jpg', alt: 'يوم رياضي' },
  { src: '/images/gallery/gallery3.jpg', alt: 'مختبر العلوم' },
  { src: '/images/gallery/gallery4.jpg', alt: 'فريق كرة القدم' },
  { src: '/images/gallery/gallery5.jpg', alt: 'حفل تخرج' },
  { src: '/images/gallery/gallery6.jpg', alt: 'مكتبة المدرسة' },
  { src: '/images/gallery/gallery7.jpg', alt: 'نشاط فني' },
  { src: '/images/gallery/gallery8.jpg', alt: 'طلاب في حديقة المدرسة' },
];

const PhotoGallery: React.FC = () => {
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);

  const openModal = (index: number) => {
    setSelectedImageIndex(index);
  };

  const closeModal = () => {
    setSelectedImageIndex(null);
  };

  const showNext = () => {
    if (selectedImageIndex !== null) {
      setSelectedImageIndex((selectedImageIndex + 1) % galleryImages.length);
    }
  };

  const showPrev = () => {
    if (selectedImageIndex !== null) {
      setSelectedImageIndex((selectedImageIndex - 1 + galleryImages.length) % galleryImages.length);
    }
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (selectedImageIndex === null) return;

      if (event.key === 'Escape') {
        closeModal();
      } else if (event.key === 'ArrowRight') {
        showNext();
      } else if (event.key === 'ArrowLeft') {
        showPrev();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [selectedImageIndex]);


  return (
    <section className="py-16 bg-gradient-to-br from-gray-50 via-white to-blue-50/30 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 dark-transition">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 animate-fade-in-up">
          <div className="inline-block bg-gradient-to-r from-green-400 to-blue-500 text-white p-4 rounded-2xl mb-4 animate-bounce-in shadow-lg">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <h2 className="text-4xl font-black text-[#2A374E] dark:text-gray-100 mb-4 bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
            معرض الصور
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed">
            لقطات من الحياة في مدرستنا، تجسد روح التعلم والإبداع والمشاركة والتميز
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
          {galleryImages.map((image, index) => (
            <div 
              key={index} 
              className="group cursor-pointer animate-fade-in-up hover-lift transition-all duration-500" 
              style={{animationDelay: `${index * 0.1}s`}} 
              onClick={() => openModal(index)}
            >
              <div className="relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 bg-white dark:bg-gray-700 p-2">
                <div className="relative aspect-[4/3] overflow-hidden rounded-xl">
                  <img 
                    src={image.src} 
                    alt={image.alt} 
                    className="w-full h-full object-cover transform transition-transform duration-500 group-hover:scale-110" 
                    loading="lazy" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center">
                    <div className="text-center transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                      <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mb-3 mx-auto">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                      </div>
                      <p className="text-white text-sm font-bold">انقر للعرض</p>
                    </div>
                  </div>
                  <div className="absolute top-3 right-3 w-4 h-4 bg-gradient-to-r from-red-500 to-pink-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-pulse-custom shadow-lg"></div>
                </div>
                <div className="p-4">
                  <h3 className="text-center text-sm md:text-base font-bold text-gray-800 dark:text-gray-200 group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors duration-300">
                    {image.alt}
                  </h3>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {selectedImageIndex !== null && (
        <div className="fixed inset-0 bg-black/95 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in" onClick={closeModal}>
          <div className="relative max-w-6xl max-h-full w-full flex flex-col items-center animate-scale-in" onClick={(e) => e.stopPropagation()}>
            {/* Header with image counter */}
            <div className="absolute top-4 left-4 bg-black/50 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-medium z-10">
              {selectedImageIndex + 1} من {galleryImages.length}
            </div>
            
            {/* Close button */}
            <button onClick={closeModal} className="absolute top-4 right-4 bg-white/90 text-gray-800 rounded-full p-3 hover:bg-white hover-scale transition-all duration-300 shadow-xl z-10">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
            
            {/* Main image */}
            <div className="relative w-full max-h-[85vh] flex items-center justify-center">
              <img 
                src={galleryImages[selectedImageIndex].src} 
                alt={galleryImages[selectedImageIndex].alt} 
                className="object-contain w-full h-full rounded-2xl shadow-2xl" 
              />
            </div>
            
            {/* Navigation buttons */}
            <button onClick={showPrev} className="absolute top-1/2 -translate-y-1/2 left-4 md:left-8 bg-white/90 text-gray-800 rounded-full p-4 hover:bg-white hover-scale transition-all duration-300 shadow-xl backdrop-blur-sm">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
            </button>
            <button onClick={showNext} className="absolute top-1/2 -translate-y-1/2 right-4 md:right-8 bg-white/90 text-gray-800 rounded-full p-4 hover:bg-white hover-scale transition-all duration-300 shadow-xl backdrop-blur-sm">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
            </button>
            
            {/* Image caption */}
            <div className="mt-6 bg-white/90 backdrop-blur-sm rounded-2xl px-6 py-4 shadow-xl">
              <h3 className="text-xl font-bold text-gray-800 text-center">{galleryImages[selectedImageIndex].alt}</h3>
            </div>
            
            {/* Thumbnail navigation */}
            <div className="flex gap-2 mt-6 overflow-x-auto max-w-full px-4">
              {galleryImages.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImageIndex(index)}
                  className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all duration-300 ${
                    index === selectedImageIndex 
                      ? 'border-green-500 shadow-lg scale-110' 
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  <img 
                    src={image.src} 
                    alt={image.alt} 
                    className="w-full h-full object-cover" 
                  />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default PhotoGallery;
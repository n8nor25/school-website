import React, { useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay, EffectCoverflow } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-coverflow';
import { Facebook, Twitter, Instagram } from './Icons';

// بيانات المعلمين مع الصور الجديدة
const tutors = [
  { 
    name: 'عصام غازى  ', 
    subject: 'مدرس الرياضيات', 
    email: 'mahrous@gmail.com', 
    image: '/images/tutor/tutor1.jpg', 
    highlighted: true 
  },
  { 
    name: ' ماجده فايز', 
    subject: 'مدرسة علوم', 
    email: 'olivia@gmail.com', 
    image: '/images/tutor/tutor2.jpg', 
    highlighted: false 
  },
  { 
    name: 'محروس شعبان', 
    subject: 'مدرس كمبيوتر', 
    email: 'tamer@gmail.com', 
    image: '/images/tutor/tutor3.jpg', 
    highlighted: false 
  },
  { 
    name: 'سميث ', 
    subject: 'مدرس PHP', 
    email: 'smith@gmail.com', 
    image: '/images/tutor/tutor4.jpg', 
    highlighted: false 
  },
  { 
    name: 'إيما واتسون', 
    subject: 'مدرسة CSS', 
    email: 'emma@gmail.com', 
    image: '/images/tutor/tutor5.jpg', 
    highlighted: false 
  },
  { 
    name: 'على ', 
    subject: 'مدرسة Python', 
    email: 'ali@gmail.com', 
    image: '/images/tutor/tutor6.jpg', 
    highlighted: false 
  },
  { 
    name: 'نجم', 
    subject: 'مدرس UI/UX', 
    email: 'najm@gmail.com', 
    image: '/images/tutor/tutor7.jpg', 
    highlighted: false 
  },
  { 
    name: 'رهف', 
    subject: 'مدرس الذكاء الاصطناعي', 
    email: 'omar@gmail.com', 
    image: '/images/tutor/tutor8.jpg', 
    highlighted: false 
  },
  { 
    name: 'سيف', 
    subject: 'مدرس التصميم', 
    email: 'saif@gmail.com', 
    image: '/images/tutor/tutor9.jpg', 
    highlighted: false 
  },
  { 
    name: 'روبرت', 
    subject: 'مدرس البرمجة', 
    email: 'robert@gmail.com', 
    image: '/images/tutor/tutor10.jpg', 
    highlighted: false 
  }
];

const TutorsSwiper: React.FC = () => {
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  return (
    <section className="py-16 bg-gradient-to-br from-[#F8F4F0] to-[#E8E4E0] dark:from-gray-900 dark:to-gray-800 dark-transition">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12 animate-fade-in-up">
          <div className="inline-block bg-gradient-to-r from-pink-100 to-purple-100 dark:from-pink-900/50 dark:to-purple-900/50 text-pink-500 dark:text-pink-400 p-4 rounded-full mb-4 animate-bounce-in">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" viewBox="0 0 20 20" fill="currentColor">
              <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
            </svg>
          </div>
          <h2 className="text-4xl font-bold text-[#2A374E] dark:text-gray-100 mb-4">
            مدرسونا الخبراء
          </h2>
          <p className="text-gray-600 dark:text-gray-400 text-lg max-w-3xl mx-auto leading-relaxed">
            فريقنا المتميز من المعلمين المحترفين ملتزم بتقديم أفضل تجربة تعليمية لطلابنا، 
            مسلحين بالخبرة والشغف والتفاني في التعليم.
          </p>
        </div>

        {/* Swiper Container */}
        <div className="relative">
          <Swiper
            modules={[Navigation, Pagination, Autoplay, EffectCoverflow]}
            effect="coverflow"
            grabCursor={true}
            centeredSlides={true}
            slidesPerView="auto"
            coverflowEffect={{
              rotate: 50,
              stretch: 0,
              depth: 100,
              modifier: 1,
              slideShadows: true,
            }}
            autoplay={isAutoPlaying ? {
              delay: 2000,
              disableOnInteraction: false,
            } : false}
            navigation={{
              nextEl: '.swiper-button-next-custom',
              prevEl: '.swiper-button-prev-custom',
            }}
            pagination={{
              el: '.swiper-pagination-custom',
              clickable: true,
              dynamicBullets: true,
            }}
            breakpoints={{
              320: {
                slidesPerView: 1,
                spaceBetween: 20,
              },
              640: {
                slidesPerView: 2,
                spaceBetween: 30,
              },
              1024: {
                slidesPerView: 3,
                spaceBetween: 40,
              },
              1280: {
                slidesPerView: 4,
                spaceBetween: 50,
              },
            }}
            className="tutors-swiper"
          >
            {tutors.map((tutor, index) => (
              <SwiperSlide key={index} className="!w-auto">
                <div className="w-80 mx-auto">
                  <div
                    className={`relative group cursor-pointer transform transition-all duration-500 hover:scale-105 ${
                      tutor.highlighted 
                        ? 'animate-pulse-glow' 
                        : ''
                    }`}
                  >
                    {/* Card */}
                    <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl overflow-hidden border border-gray-200 dark:border-gray-700 hover:shadow-3xl transition-all duration-500">
                      {/* Image Container */}
                      <div className="relative h-80 overflow-hidden">
                        <img 
                          src={tutor.image} 
                          alt={tutor.name}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                        {/* Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        
                        {/* Highlighted Badge */}
                        {tutor.highlighted && (
                          <div className="absolute top-4 right-4 bg-gradient-to-r from-pink-500 to-purple-500 text-white px-3 py-1 rounded-full text-sm font-bold animate-bounce">
                            ⭐ مميز
                          </div>
                        )}
                      </div>

                      {/* Content */}
                      <div className="p-6">
                        <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-2 group-hover:text-pink-600 dark:group-hover:text-pink-400 transition-colors duration-300">
                          {tutor.name}
                        </h3>
                        <p className="text-pink-500 dark:text-pink-400 font-semibold text-lg mb-3 group-hover:text-purple-500 dark:group-hover:text-purple-400 transition-colors duration-300">
                          {tutor.subject}
                        </p>
                        <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">
                          {tutor.email}
                        </p>

                        {/* Social Links */}
                        <div className="flex justify-center space-x-4">
                          <a 
                            href="#" 
                            className="w-10 h-10 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center text-gray-600 dark:text-gray-400 hover:bg-pink-500 hover:text-white transition-all duration-300 transform hover:scale-110"
                          >
                            <Facebook className="w-5 h-5" />
                          </a>
                          <a 
                            href="#" 
                            className="w-10 h-10 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center text-gray-600 dark:text-gray-400 hover:bg-blue-500 hover:text-white transition-all duration-300 transform hover:scale-110"
                          >
                            <Twitter className="w-5 h-5" />
                          </a>
                          <a 
                            href="#" 
                            className="w-10 h-10 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center text-gray-600 dark:text-gray-400 hover:bg-gradient-to-r hover:from-pink-500 hover:to-purple-500 hover:text-white transition-all duration-300 transform hover:scale-110"
                          >
                            <Instagram className="w-5 h-5" />
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Custom Navigation Buttons */}
          <button className="swiper-button-prev-custom absolute left-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-white dark:bg-gray-800 rounded-full shadow-lg flex items-center justify-center text-gray-700 dark:text-gray-300 hover:bg-pink-500 hover:text-white transition-all duration-300 transform hover:scale-110">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          
          <button className="swiper-button-next-custom absolute right-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-white dark:bg-gray-800 rounded-full shadow-lg flex items-center justify-center text-gray-700 dark:text-gray-300 hover:bg-pink-500 hover:text-white transition-all duration-300 transform hover:scale-110">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        {/* Custom Pagination */}
        <div className="swiper-pagination-custom flex justify-center mt-8 space-x-2"></div>

        {/* Control Buttons */}
        <div className="flex justify-center mt-8 space-x-4">
          <button
            onClick={() => setIsAutoPlaying(!isAutoPlaying)}
            className={`px-6 py-3 rounded-full text-sm font-medium transition-all duration-300 transform hover:scale-105 ${
              isAutoPlaying
                ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-lg'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
            }`}
          >
            {isAutoPlaying ? '⏸️ إيقاف الحركة' : '▶️ تشغيل الحركة'}
          </button>
        </div>
      </div>

      {/* Custom Styles */}
      <style jsx global>{`
        .tutors-swiper {
          padding: 20px 0;
        }
        
        .tutors-swiper .swiper-slide {
          height: auto;
        }
        
        .swiper-pagination-custom .swiper-pagination-bullet {
          width: 12px;
          height: 12px;
          background: #d1d5db;
          opacity: 1;
          transition: all 0.3s ease;
        }
        
        .swiper-pagination-custom .swiper-pagination-bullet-active {
          background: linear-gradient(45deg, #ec4899, #8b5cf6);
          transform: scale(1.2);
        }
        
        .swiper-pagination-custom .swiper-pagination-bullet:hover {
          background: linear-gradient(45deg, #ec4899, #8b5cf6);
          transform: scale(1.1);
        }
      `}</style>
    </section>
  );
};

export default TutorsSwiper;

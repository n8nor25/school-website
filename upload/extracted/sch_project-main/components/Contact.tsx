import React from 'react';
import { Phone, Mail, LocationMarker, Clock } from './Icons';

const Contact: React.FC = () => {
  return (
    <section id="contact" className="py-12 bg-gray-50 dark:bg-black/50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-[#2A374E] dark:text-gray-100">تواصل معنا</h2>
          <p className="text-gray-600 dark:text-gray-400 mt-2">نحن هنا لمساعدتك. لا تتردد في الاتصال بنا.</p>
        </div>
        <div className="grid lg:grid-cols-2 gap-8 items-start">
          <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md">
            <form>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <input type="text" placeholder="الاسم الكامل" className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-transparent dark:text-gray-200" />
                <input type="email" placeholder="البريد الإلكتروني" className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-transparent dark:text-gray-200" />
              </div>
              <div className="mb-4">
                <input type="text" placeholder="موضوع الرسالة" className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-transparent dark:text-gray-200" />
              </div>
              <div className="mb-4">
                <textarea placeholder="نص الرسالة (بحد أقصى 500 حرف)" rows={5} className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none bg-transparent dark:text-gray-200"></textarea>
              </div>
              <button type="submit" className="w-full bg-blue-600 text-white font-bold py-3 px-6 rounded-md hover:bg-blue-700 transition-colors duration-300">
                إرسال الرسالة
              </button>
            </form>
          </div>
          <div className="space-y-6">
             <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                <h3 className="font-bold text-lg mb-4 dark:text-gray-200">معلومات الاتصال</h3>
                <div className="space-y-4 text-gray-700 dark:text-gray-300">
                    <div className="flex items-center"><Phone className="w-5 h-5 ml-3 text-blue-600 dark:text-blue-400" /><span>3333 222 111 20+</span></div>
                    <div className="flex items-center"><Mail className="w-5 h-5 ml-3 text-blue-600 dark:text-blue-400" /><span>info@al-sharq-school.edu</span></div>
                    <div className="flex items-center"><LocationMarker className="w-5 h-5 ml-3 text-blue-600 dark:text-blue-400" /><span>سوهاج، اخميم</span></div>
                    <div className="flex items-center"><Clock className="w-5 h-5 ml-3 text-blue-600 dark:text-blue-400" /><span>الأحد - الخميس: 8:00 ص - 2:00 م</span></div>
                </div>
            </div>
            <div className="rounded-lg shadow-md overflow-hidden">
                <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d110502.61197778523!2d31.34440552788514!3d30.07198895058564!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x145817d738a16431%3A0x4a4a11977313833d!2sCairo%2C%2C%20Cairo%20Governorate%2C%20Egypt!5e0!3m2!1sen!2sus!4v1668812640245!5m2!1sen!2sus" 
                width="100%" 
                height="250" 
                style={{border:0}} 
                allowFullScreen={false} 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
                className="dark:grayscale">
              </iframe>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
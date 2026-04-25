'use client';

import { useState } from 'react';
import { Phone, Mail, MapPin, Clock, Send, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitMessage('');

    // Simulate form submission
    setTimeout(() => {
      setSubmitMessage('تم إرسال رسالتك بنجاح! سنتواصل معك قريباً.');
      setFormData({ name: '', email: '', subject: '', message: '' });
      setIsSubmitting(false);
    }, 1500);
  };

  const contactInfo = [
    {
      icon: Phone,
      title: 'الهاتف',
      value: '0931234567',
      href: 'tel:0931234567',
    },
    {
      icon: Mail,
      title: 'البريد الإلكتروني',
      value: 'info@alhayahschool.edu.eg',
      href: 'mailto:info@alhayahschool.edu.eg',
    },
    {
      icon: MapPin,
      title: 'العنوان',
      value: 'سوهاج - مصر',
      href: '#',
    },
    {
      icon: Clock,
      title: 'ساعات العمل',
      value: 'الأحد - الخميس: 7:30 ص - 2:30 م',
      href: '#',
    },
    {
      icon: MessageCircle,
      title: 'واتساب',
      value: 'تواصل عبر واتساب',
      href: 'https://wa.me/200931234567',
      isWhatsApp: true,
    },
  ];

  return (
    <section id="contact" className="py-16 md:py-24 bg-white dark:bg-gray-900 dark-transition">
      <div className="container mx-auto px-4">
        {/* Section Title */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-[#2A374E] dark:text-white mb-3">
            تواصل معنا
          </h2>
          <div className="w-20 h-1 bg-red-600 mx-auto rounded-full" />
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Contact Form */}
          <div className="lg:w-1/2 w-full animate-fade-in-up">
            <form onSubmit={handleSubmit} className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6 md:p-8 shadow-md">
              <h3 className="text-xl font-bold text-[#2A374E] dark:text-white mb-6">
                أرسل لنا رسالة
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    الاسم
                  </label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="أدخل اسمك"
                    required
                    className="bg-white dark:bg-gray-700"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    البريد الإلكتروني
                  </label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="أدخل بريدك الإلكتروني"
                    required
                    className="bg-white dark:bg-gray-700"
                  />
                </div>
              </div>

              <div className="mb-4">
                <label htmlFor="subject" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  الموضوع
                </label>
                <Input
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  placeholder="موضوع الرسالة"
                  required
                  className="bg-white dark:bg-gray-700"
                />
              </div>

              <div className="mb-6">
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  الرسالة
                </label>
                <Textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="اكتب رسالتك هنا..."
                  required
                  rows={5}
                  className="bg-white dark:bg-gray-700"
                />
              </div>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="bg-red-600 hover:bg-red-700 text-white w-full py-3 text-base"
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    جاري الإرسال...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <Send size={18} />
                    إرسال الرسالة
                  </span>
                )}
              </Button>

              {submitMessage && (
                <p className="mt-4 text-green-600 dark:text-green-400 text-sm text-center font-medium animate-fade-in-up">
                  {submitMessage}
                </p>
              )}
            </form>
          </div>

          {/* Contact Info + Map */}
          <div className="lg:w-1/2 w-full animate-fade-in-right">
            <div className="space-y-4 mb-6">
              {contactInfo.map((info, index) => {
                const IconComponent = info.icon;
                return (
                  <a
                    key={index}
                    href={info.href}
                    target={info.isWhatsApp ? '_blank' : undefined}
                    rel={info.isWhatsApp ? 'noopener noreferrer' : undefined}
                    className="flex items-center gap-4 bg-gray-50 dark:bg-gray-800 rounded-xl p-4 shadow-sm hover-lift transition-all duration-300 group"
                  >
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center group-hover:bg-red-600 transition-colors ${info.isWhatsApp ? 'bg-green-100 dark:bg-green-900/30' : 'bg-red-100 dark:bg-red-900/30'}`}>
                      <IconComponent size={20} className={`${info.isWhatsApp ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'} group-hover:text-white transition-colors`} />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{info.title}</p>
                      <p className="font-medium text-[#2A374E] dark:text-white">{info.value}</p>
                    </div>
                  </a>
                );
              })}
            </div>

            {/* Google Maps Embed */}
            <div className="rounded-xl overflow-hidden shadow-md h-64 md:h-80">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d110502.56591828925!2d31.37555855!3d26.5593839!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x144f1c5e5d0b0b0b%3A0x0!2z2YXYt9i52YUg2KfZhNit2YLZiNmCINin2YTYr9mK2LXYqQ!5e0!3m2!1sar!2seg!4v1700000000000!5m2!1sar!2seg"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="موقع المدرسة على الخريطة"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

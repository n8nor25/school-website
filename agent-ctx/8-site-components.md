# Task 8 - Site Components Agent

## Task
Create all main site components for the school homepage

## Work Completed

All 12 site components were created in `/home/z/my-project/src/components/site/`:

1. **Header.tsx** - Sticky header with top bar (Arabic date/time, social icons, search, dark mode toggle, admin login/logout), main section with school name "مدرسة الاحايوه شرق" and subtitle "المرحلة الاعدادية", vision box (desktop only), responsive navigation bar with mobile hamburger menu

2. **Hero.tsx** - Main slider (3/4 width on desktop) with auto-play every 5 seconds, prev/next buttons, slide indicators with category badges; side panel (1/4 width) with news ticker. Fetches from /api/slider and /api/news with fallback data.

3. **About.tsx** - Section with id="about". Left side: welcome text, "50 عاماً من الخبرة في التعليم", description, vision box with border, CTA button. Right side: video player with /videos/v1.mp4, autoPlay muted loop.

4. **NewsAndEvents.tsx** - 6 news cards in responsive grid, each with image, date, category badge, title, description, "اقرأ المزيد" link. Static data.

5. **Departments.tsx** - Section with id="departments". Auto-scrolling carousel of 6 department cards with placeholder images from picsum.photos. Prev/next navigation, auto-play with 4s interval, resumes after 5s inactivity.

6. **Services.tsx** - 6 service cards with Lucide icons (BookOpen, Calendar, BarChart3, MessageCircle, Puzzle, Pencil). "جدول الحصص" service scrolls to #schedule-section.

7. **PhotoGallery.tsx** - 8 gallery images grid, fullscreen lightbox with prev/next navigation, keyboard navigation (Escape, Arrow keys), image counter, thumbnail strip.

8. **TutorsSwiper.tsx** - Custom carousel of 10 tutor cards with images, name, subject, email, social icons. Auto-play with navigation.

9. **Testimonials.tsx** - Carousel of 4 testimonial cards with avatars from i.pravatar.cc, quotes, names, roles. Prev/next navigation.

10. **Contact.tsx** - Section with id="contact". Contact form (name, email, subject, message, submit). Contact info with Lucide icons (Phone, Mail, MapPin, Clock). Google Maps embed.

11. **ScheduleSection.tsx** - Section with id="schedule-section". Fetches from /api/schedules. Filter buttons by grade. Grid of schedule cards with view/download buttons. Fallback data.

12. **Footer.tsx** - School info with social icons, quick links, e-services links, contact info, designer credit "محروس شعبان", copyright with dynamic year.

## Design Consistency
- All text in Arabic (RTL)
- Primary color: red-600 for accents, #2A374E for headings
- Tailwind CSS with custom animations (animate-fade-in-up, hover-lift, hover-scale)
- Lucide React icons throughout
- shadcn/ui components (Button, Badge, Input, Textarea, Dialog)
- Responsive (mobile-first)
- Dark mode support via document.documentElement.classList
- API calls with error handling and fallback data

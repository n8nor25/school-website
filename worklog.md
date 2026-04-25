---
Task ID: 1
Agent: main
Task: Fix all reported issues from user

Work Log:
- Fixed admin login: Added bcrypt password comparison support in /api/auth/route.ts
- Fixed header styling: Red background top bar with date/time on 2 lines, black navbar
- Added designer circular image (me-.png) to footer via Cloudinary
- Fixed schedule table link: Added modal popup with schedule viewing from Services section
- Added proper WhatsApp icon (SVG) to Contact page and Footer
- Verified chat API works correctly (tested locally - returns proper AI responses)
- Implemented archive feature for NewsManager, ScheduleManager, SliderManager, VideoManager
- Updated all 4 API routes (news, schedules, slider, videos) to support archived filtering
- Default API behavior excludes archived items from public site
- All lint checks pass, site compiles without errors

Stage Summary:
- All 7 reported issues have been fixed
- Admin login now supports both bcrypt-hashed and plaintext passwords
- Header: red top bar with 2-line date/time, black navbar
- Footer: circular designer photo from Cloudinary
- Services: schedule modal with grade-colored badges
- Contact: proper WhatsApp SVG icon with green styling
- Archive: full archive/restore functionality in all 4 content managers
- Chat: verified working correctly with z-ai-web-dev-sdk

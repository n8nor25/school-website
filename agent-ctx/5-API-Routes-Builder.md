---
Task ID: 5
Agent: API Routes Builder
Task: Create API routes for CRUD operations

Work Log:
- Created auth API route (POST /api/auth) for admin login with username/password validation
- Created slider API routes (GET/POST /api/slider, PUT/DELETE /api/slider/[id]) with ordering and active filtering
- Created news API routes (GET/POST /api/news, PUT/DELETE /api/news/[id]) with ordering and active filtering
- Created videos API routes (GET/POST /api/videos, PUT/DELETE /api/videos/[id]) with ordering and active filtering
- Created schedules API routes (GET/POST /api/schedules, PUT/DELETE /api/schedules/[id]) with active filtering
- Created file upload API route (POST /api/upload) with unique filename generation using uuid
- Created /public/uploads directory for file storage
- Fixed lint warning in auth route (unused eslint-disable directive)
- Verified all routes pass lint check with no errors

Stage Summary:
- All 10 API route files created and functional
- Auth route supports admin login with plain text password comparison
- All CRUD routes follow consistent pattern with proper error handling
- Dynamic routes use Next.js 16 Promise-based params pattern
- Upload route uses uuid for unique filenames and fs/promises for file writing
- All routes use Arabic error messages consistent with the school website theme

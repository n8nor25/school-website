# Task 4 - Student Manager Builder

## Task
Create the StudentManager component for the admin panel at `/home/z/my-project/src/components/admin/StudentManager.tsx`

## What was done
- Created comprehensive StudentManager.tsx with full CRUD operations
- Student list table with search, classroom filter, status filter, pagination (10/page)
- Add/Edit student dialog with all required form fields
- Delete confirmation dialog (AlertDialog)
- Student detail view dialog showing basic info, recent attendance, recent grades
- Color-coded status badges (نشط=green, متوقف=red, منقول=amber)
- Color-coded attendance and grade displays
- Responsive design, dark mode, Arabic RTL
- Loading states and error handling with toast notifications
- Zero lint errors

## Files created
- `/home/z/my-project/src/components/admin/StudentManager.tsx`

## Files modified
- `/home/z/my-project/worklog.md` (appended task log)

## API Dependencies
- GET/POST `/api/students` - list/create students
- GET/PUT/DELETE `/api/students/[id]` - get/update/delete student
- GET `/api/classrooms` - classrooms dropdown
- GET `/api/parents` - parents dropdown

## Integration Note
This component is ready to be added to the AdminDashboard tabs. It needs:
1. Import in AdminDashboard.tsx
2. A tab entry with key like 'students', label 'إدارة الطلاب', icon Users
3. A case in the renderContent switch

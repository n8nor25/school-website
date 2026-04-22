import { db } from '../src/lib/db'

async function main() {
  console.log('🌱 Starting database seeding...')

  // Delete all existing data in reverse dependency order
  console.log('🗑️  Cleaning existing data...')
  await db.parentMessage.deleteMany()
  await db.grade.deleteMany()
  await db.attendance.deleteMany()
  await db.student.deleteMany()
  await db.parent.deleteMany()
  await db.subject.deleteMany()
  await db.classRoom.deleteMany()
  await db.schedule.deleteMany()
  await db.video.deleteMany()
  await db.newsItem.deleteMany()
  await db.sliderImage.deleteMany()
  await db.admin.deleteMany()
  console.log('  ✓ All data deleted')

  // Seed Admin
  console.log('👤 Creating admin...')
  const admin = await db.admin.create({
    data: {
      username: 'admin',
      password: 'admin123',
      name: 'المسؤول',
    },
  })
  console.log(`  ✓ Admin created: ${admin.name}`)

  // Seed ClassRooms
  console.log('🏫 Creating classrooms...')
  const classrooms = await Promise.all([
    db.classRoom.create({ data: { name: 'الصف الأول أ', grade: 'أولى', section: 'أ', academicYear: '2024/2025' } }),
    db.classRoom.create({ data: { name: 'الصف الأول ب', grade: 'أولى', section: 'ب', academicYear: '2024/2025' } }),
    db.classRoom.create({ data: { name: 'الصف الثاني أ', grade: 'ثانية', section: 'أ', academicYear: '2024/2025' } }),
    db.classRoom.create({ data: { name: 'الصف الثاني ب', grade: 'ثانية', section: 'ب', academicYear: '2024/2025' } }),
    db.classRoom.create({ data: { name: 'الصف الثالث أ', grade: 'ثالثة', section: 'أ', academicYear: '2024/2025' } }),
    db.classRoom.create({ data: { name: 'الصف الثالث ب', grade: 'ثالثة', section: 'ب', academicYear: '2024/2025' } }),
  ])
  console.log(`  ✓ ${classrooms.length} classrooms created`)

  // Seed Subjects
  console.log('📚 Creating subjects...')
  const subjects = await Promise.all([
    db.subject.create({ data: { name: 'الرياضيات' } }),
    db.subject.create({ data: { name: 'العلوم' } }),
    db.subject.create({ data: { name: 'اللغة العربية' } }),
    db.subject.create({ data: { name: 'اللغة الإنجليزية' } }),
    db.subject.create({ data: { name: 'التاريخ' } }),
    db.subject.create({ data: { name: 'الجغرافيا' } }),
    db.subject.create({ data: { name: 'التربية الإسلامية' } }),
    db.subject.create({ data: { name: 'الحاسب الآلي' } }),
  ])
  console.log(`  ✓ ${subjects.length} subjects created`)

  // Seed Parents
  console.log('👨‍👩‍👧‍👦 Creating parents...')
  const parentNames = [
    { name: 'محمد أحمد علي', phone: '01012345678', email: 'mohammed@email.com', relation: 'أب' },
    { name: 'فاطمة حسن محمد', phone: '01098765432', email: 'fatma@email.com', relation: 'أم' },
    { name: 'أحمد سعيد إبراهيم', phone: '01155544433', relation: 'أب' },
    { name: 'سارة عبدالله محمود', phone: '01233344455', relation: 'أم' },
    { name: 'علي حسين عمر', phone: '01566677788', relation: 'ولي أمر' },
    { name: 'نورا خالد سعيد', phone: '01088899900', email: 'noura@email.com', relation: 'أم' },
    { name: 'خالد عبدالرحمن', phone: '01111122233', relation: 'أب' },
    { name: 'منى صلاح الدين', phone: '01244455566', relation: 'أم' },
    { name: 'حسن محمد عبدالله', phone: '01577788899', relation: 'أب' },
    { name: 'هالة أحمد سعيد', phone: '01022233344', relation: 'أم' },
    { name: 'عمر فوزي حسن', phone: '01166677788', relation: 'أب' },
    { name: 'أميرة عبدالفتاح', phone: '01299900011', relation: 'أم' },
    { name: 'ياسر محمد علي', phone: '01533344455', relation: 'أب' },
    { name: 'سمر طه عبدالله', phone: '01055566677', relation: 'أم' },
    { name: 'إبراهيم عثمان أحمد', phone: '01188899900', relation: 'ولي أمر' },
  ]
  const parents = await Promise.all(
    parentNames.map(p => db.parent.create({ data: p }))
  )
  console.log(`  ✓ ${parents.length} parents created`)

  // Seed Students
  console.log('🎓 Creating students...')
  const studentNames = [
    'أحمد محمد', 'محمد علي', 'يوسف حسن', 'عمر خالد', 'حسن إبراهيم',
    'مريم أحمد', 'فاطمة سعيد', 'نور علي', 'سارة حسن', 'ريم محمد',
    'عبدالله خالد', 'ياسر أحمد', 'محمود حسين', 'أمير سعيد', 'كريم عمر',
    'هدى محمد', 'آية علي', 'سمية حسن', 'دعاء أحمد', 'رنا سعيد',
    'طارق عبدالله', 'وليد محمد', 'باسم حسين', 'شريف أحمد', 'عمرو علي',
    'منى حسن', 'إسراء محمد', 'روان سعيد', 'شيماء علي', 'هبة أحمد',
    'أيمن خالد', 'هشام عمر', 'رامي حسين', 'سيف الدين', 'مصطفى علي',
    'أمل محمد', 'سلمى أحمد', 'وفاء حسن', 'نادية سعيد', ' Lobna علي',
    'إسلام محمد', 'محمد حسن', 'أحمد سعيد', 'عبدالرحمن علي', 'يحيى خالد',
    'روعة أحمد', 'جنى محمد', 'لمياء حسن', 'إيمان سعيد', 'داليا علي',
    'أحمد عبدالله', 'محمد حسين', 'يوسف عمر', 'علي أحمد', 'حسن محمد',
    'نورهان سعيد', 'مروة علي', 'أفراح حسن', 'بسمة أحمد', 'رانيا محمد',
    'صلاح الدين', 'زياد محمد', 'أحمد فوزي', 'محمد كمال', 'عبدالعزيز',
    'رشا حسين', 'منار أحمد', 'علا محمد', 'هناء سعيد', 'أسماء علي',
    'حاتم محمد', 'رضا أحمد', 'سامح حسن', 'عصام علي', 'فتحي سعيد',
    'منال محمد', 'نجلاء أحمد', 'ليلى حسن', 'صبرين علي', 'ايمان سعيد',
  ]
  
  const students = []
  for (let i = 0; i < studentNames.length; i++) {
    const classroomIdx = Math.floor(i / 14) % classrooms.length
    const parentIdx = i % parents.length
    const statusOptions = ['نشط', 'نشط', 'نشط', 'نشط', 'نشط', 'نشط', 'نشط', 'نشط', 'متوقف', 'منقول']
    
    const student = await db.student.create({
      data: {
        name: studentNames[i],
        nationalId: i < 20 ? `3000${1000 + i}01001${i + 1}` : null,
        classRoomId: classrooms[classroomIdx].id,
        parentId: parents[parentIdx].id,
        phone: i % 3 === 0 ? `010${10000000 + i}` : null,
        birthDate: i < 30 ? `2010-0${1 + (i % 9)}-${10 + (i % 20)}` : null,
        enrollDate: '2024-09-15',
        status: statusOptions[i % statusOptions.length],
      },
    })
    students.push(student)
  }
  console.log(`  ✓ ${students.length} students created`)

  // Seed Attendance (last 7 days)
  console.log('📋 Creating attendance records...')
  const today = new Date()
  const statusOptions = ['حاضر', 'حاضر', 'حاضر', 'حاضر', 'حاضر', 'حاضر', 'حاضر', 'غائب', 'متأخر', 'إذن']
  let attendanceCount = 0

  for (let dayOffset = 0; dayOffset < 7; dayOffset++) {
    const date = new Date(today)
    date.setDate(date.getDate() - dayOffset)
    // Skip weekends (Friday=5, Saturday=6 in Egypt)
    if (date.getDay() === 5 || date.getDay() === 6) continue
    
    const dateStr = date.toISOString().split('T')[0]
    
    // Only add attendance for first 30 students to keep it manageable
    for (let i = 0; i < Math.min(30, students.length); i++) {
      await db.attendance.create({
        data: {
          studentId: students[i].id,
          date: dateStr,
          status: statusOptions[Math.floor(Math.random() * statusOptions.length)],
          note: Math.random() > 0.9 ? 'تم التأخر بسبب الازدحام' : null,
        },
      })
      attendanceCount++
    }
  }
  console.log(`  ✓ ${attendanceCount} attendance records created`)

  // Seed Grades
  console.log('📝 Creating grades...')
  const examTypes = ['شهري', 'نصفي', 'اختبار قصير']
  const terms = ['الفصل الأول', 'الفصل الثاني']
  let gradeCount = 0

  for (let i = 0; i < Math.min(30, students.length); i++) {
    // Each student gets grades for 4 subjects
    for (let j = 0; j < 4; j++) {
      const maxScore = 100
      const score = Math.floor(Math.random() * 50) + 50 // 50-100 range
      
      await db.grade.create({
        data: {
          studentId: students[i].id,
          subjectId: subjects[j].id,
          examType: examTypes[Math.floor(Math.random() * examTypes.length)],
          score,
          maxScore,
          term: terms[0],
        },
      })
      gradeCount++
    }
  }
  console.log(`  ✓ ${gradeCount} grade records created`)

  // Seed Parent Messages
  console.log('📬 Creating parent messages...')
  const messageSamples = [
    { subject: 'إشعار غياب', message: 'نود إبلاغكم بأن طالبكم كان غائباً عن المدرسة اليوم. نرجو التواصل مع إدارة المدرسة.', type: 'غياب' },
    { subject: 'نتائج الامتحان الشهري', message: 'نود إبلاغكم بنتائج طالبكم في الامتحان الشهري. يرجى المتابعة والاهتمام.', type: 'نتائج' },
    { subject: 'دعوة اجتماع أولياء الأمور', message: 'نتشرف بدعوتكم لحضور اجتماع أولياء الأمور يوم الخميس القادم الساعة 10 صباحاً.', type: 'إشعار' },
    { subject: 'تنبيه بشأن السلوك', message: 'نود إبلاغكم ببعض الملاحظات بشأن سلوك طالبكم خلال الأسبوع الماضي.', type: 'تحذير' },
    { subject: 'إشعار بأنشطة المدرسة', message: 'تعلن المدرسة عن بدء التسجيل في الأنشطة اللاصفية للفصل الدراسي الثاني.', type: 'إشعار' },
    { subject: 'تحديث بخصوص الجدول', message: 'تم تعديل جدول الحصص للصف الثاني. يرجى الاطلاع على الجدول الجديد.', type: 'إشعار' },
  ]
  
  const messages = []
  for (let i = 0; i < 15; i++) {
    const template = messageSamples[i % messageSamples.length]
    const parentIdx = i % parents.length
    const studentIdx = i % students.length
    
    const msg = await db.parentMessage.create({
      data: {
        parentId: parents[parentIdx].id,
        studentId: students[studentIdx].id,
        subject: template.subject,
        message: template.message,
        type: template.type,
        isRead: i > 5, // first 5 are unread
      },
    })
    messages.push(msg)
  }
  console.log(`  ✓ ${messages.length} parent messages created`)

  // Seed SliderImages
  console.log('🖼️  Creating slider images...')
  const sliderImages = await Promise.all([
    db.sliderImage.create({ data: { title: 'بدء التحضير لمعرض التربية الفنية الابداعي', category: 'تعليم', imageUrl: '/images/slider/slide1.jpg', order: 1 } }),
    db.sliderImage.create({ data: { title: 'روح التعاون والعمل كفريق', category: 'تعليم', imageUrl: '/images/slider/slide2.jpg', order: 2 } }),
    db.sliderImage.create({ data: { title: 'يوم رياضي حافل بالنشاطات', category: 'فعاليات', imageUrl: '/images/slider/slide3.jpg', order: 3 } }),
    db.sliderImage.create({ data: { title: 'دعم دائم ومستمر', category: 'تعليم', imageUrl: '/images/slider/slide4.jpg', order: 4 } }),
    db.sliderImage.create({ data: { title: 'تشجيع وفعاليات تواكب الاحداث', category: 'فعاليات', imageUrl: '/images/slider/slide5.jpg', order: 5 } }),
    db.sliderImage.create({ data: { title: 'جوانب مضيئة', category: 'تعليم', imageUrl: '/images/slider/slide6.jpg', order: 6 } }),
    db.sliderImage.create({ data: { title: 'نحو غد مشرق', category: 'تعليم', imageUrl: '/images/slider/slide7.jpg', order: 7 } }),
    db.sliderImage.create({ data: { title: 'جوانب من المسيرة', category: 'تعليم', imageUrl: '/images/slider/slide8.jpg', order: 8 } }),
    db.sliderImage.create({ data: { title: 'جوانب من مسيرة المدرسة', category: 'تعليم', imageUrl: '/images/slider/slide9.jpg', order: 9 } }),
    db.sliderImage.create({ data: { title: 'جوانب من مسيرة المدرسة', category: 'تعليم', imageUrl: '/images/slider/slide10.jpg', order: 10 } }),
  ])
  console.log(`  ✓ ${sliderImages.length} slider images created`)

  // Seed NewsItems
  console.log('📰 Creating news items...')
  const newsItems = await Promise.all([
    db.newsItem.create({ data: { title: 'زيارة فريق الجودة للمدرسة قريبا', content: 'سيقوم فريق الجودة بزيارة المدرسة خلال الأسبوع القادم', category: 'إداري', order: 1 } }),
    db.newsItem.create({ data: { title: 'افتتاح معرض أهلاً مدارس', content: 'افتتاح معرض تعليمي كبير', category: 'فعاليات', order: 2 } }),
    db.newsItem.create({ data: { title: 'قرب بدء الامتحان الاول', content: 'الاستعداد لبدء امتحانات الفصل الدراسي الأول', category: 'تعليم', order: 3 } }),
    db.newsItem.create({ data: { title: 'تدشين موقع المدرسة', content: 'استعداد لتدشين موقع المدرسة لخدمة الطالب والمعلم وولي الأمر', category: 'تقني', order: 4 } }),
    db.newsItem.create({ data: { title: 'نتائج المسابقات العلمية', content: 'تفوق طلاب المدرسة في المسابقات العلمية على مستوى المحافظة', category: 'تعليم', order: 5 } }),
  ])
  console.log(`  ✓ ${newsItems.length} news items created`)

  // Seed Videos
  console.log('🎬 Creating videos...')
  const videos = await Promise.all([
    db.video.create({ data: { title: 'فيديو تعريفي بالمدرسة', description: 'فيديو يعرض أرجاء المدرسة وأنشطتها', videoUrl: '/videos/v1.mp4', duration: '05:30', order: 1 } }),
    db.video.create({ data: { title: 'فعاليات اليوم الرياضي', description: 'فيديو يغطي فعاليات اليوم الرياضي السنوي', videoUrl: '/videos/v1.mp4', duration: '08:45', order: 2 } }),
  ])
  console.log(`  ✓ ${videos.length} videos created`)

  // Seed Schedules
  console.log('📋 Creating schedules...')
  const schedules = await Promise.all([
    db.schedule.create({ data: { title: 'جدول الصف الأول', grade: 'الأول الإعدادي', fileUrl: '/schedule/فصل.pdf', type: 'حالي', uploadDate: '2024-01-20' } }),
    db.schedule.create({ data: { title: 'جدول الصف الثاني', grade: 'الثاني الإعدادي', fileUrl: '/schedule/فصل.pdf', type: 'حالي', uploadDate: '2024-01-20' } }),
    db.schedule.create({ data: { title: 'جدول الصف الثالث', grade: 'الثالث الإعدادي', fileUrl: '/schedule/فصل.pdf', type: 'حالي', uploadDate: '2024-01-20' } }),
    db.schedule.create({ data: { title: 'جدول المعلمين', grade: 'هيئة التدريس', fileUrl: '/schedule/معلم.pdf', type: 'حالي', uploadDate: '2024-01-18' } }),
  ])
  console.log(`  ✓ ${schedules.length} schedules created`)

  console.log('✅ Database seeding completed successfully!')
  console.log(`\n📊 Summary:`)
  console.log(`  - ${classrooms.length} classrooms`)
  console.log(`  - ${subjects.length} subjects`)
  console.log(`  - ${parents.length} parents`)
  console.log(`  - ${students.length} students`)
  console.log(`  - ${attendanceCount} attendance records`)
  console.log(`  - ${gradeCount} grade records`)
  console.log(`  - ${messages.length} parent messages`)
  console.log(`  - ${sliderImages.length} slider images`)
  console.log(`  - ${newsItems.length} news items`)
  console.log(`  - ${videos.length} videos`)
  console.log(`  - ${schedules.length} schedules`)
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await db.$disconnect()
  })

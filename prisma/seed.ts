import { db } from '../src/lib/db'

async function main() {
  console.log('🌱 Starting database seeding...')

  // Delete all existing data in reverse dependency order
  console.log('🗑️  Cleaning existing data...')
  await db.schedule.deleteMany()
  console.log('  ✓ Schedules deleted')
  await db.video.deleteMany()
  console.log('  ✓ Videos deleted')
  await db.newsItem.deleteMany()
  console.log('  ✓ News items deleted')
  await db.sliderImage.deleteMany()
  console.log('  ✓ Slider images deleted')
  await db.admin.deleteMany()
  console.log('  ✓ Admins deleted')

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

  // Seed SliderImages
  console.log('🖼️  Creating slider images...')
  const sliderImages = await Promise.all([
    db.sliderImage.create({
      data: {
        title: 'بدء التحضير لمعرض التربية الفنية الابداعي',
        category: 'تعليم',
        imageUrl: '/images/slider/slide1.jpg',
        order: 1,
      },
    }),
    db.sliderImage.create({
      data: {
        title: 'روح التعاون والعمل كفريق',
        category: 'تعليم',
        imageUrl: '/images/slider/slide2.jpg',
        order: 2,
      },
    }),
    db.sliderImage.create({
      data: {
        title: 'يوم رياضي حافل بالنشاطات لجميع الطلاب',
        category: 'فعاليات',
        imageUrl: '/images/slider/slide3.jpg',
        order: 3,
      },
    }),
    db.sliderImage.create({
      data: {
        title: 'دعم دائم ومستمر',
        category: 'تعليم',
        imageUrl: '/images/slider/slide4.jpg',
        order: 4,
      },
    }),
    db.sliderImage.create({
      data: {
        title: 'تشجيع وفعاليات تواكب الاحداث',
        category: 'فعاليات',
        imageUrl: '/images/slider/slide5.jpg',
        order: 5,
      },
    }),
    db.sliderImage.create({
      data: {
        title: 'جوانب مضيئة',
        category: 'تعليم',
        imageUrl: '/images/slider/slide6.jpg',
        order: 6,
      },
    }),
    db.sliderImage.create({
      data: {
        title: 'نحو غد مشرق',
        category: 'تعليم',
        imageUrl: '/images/slider/slide7.jpg',
        order: 7,
      },
    }),
    db.sliderImage.create({
      data: {
        title: 'جوانب من المسيرة',
        category: 'تعليم',
        imageUrl: '/images/slider/slide8.jpg',
        order: 8,
      },
    }),
    db.sliderImage.create({
      data: {
        title: 'جوانب من مسيرة المدرسة',
        category: 'تعليم',
        imageUrl: '/images/slider/slide9.jpg',
        order: 9,
      },
    }),
    db.sliderImage.create({
      data: {
        title: 'جوانب من مسيرة المدرسة',
        category: 'تعليم',
        imageUrl: '/images/slider/slide10.jpg',
        order: 10,
      },
    }),
  ])
  console.log(`  ✓ ${sliderImages.length} slider images created`)

  // Seed NewsItems
  console.log('📰 Creating news items...')
  const newsItems = await Promise.all([
    db.newsItem.create({
      data: {
        title: 'زيارة فريق الجودة للمدرسة قريبا',
        content: 'سيقوم فريق الجودة بزيارة المدرسة خلال الأسبوع القادم',
        category: 'إداري',
        order: 1,
      },
    }),
    db.newsItem.create({
      data: {
        title: 'افتتاح معرض أهلاً مدارس بأرض المعارض الدولي للكتاب',
        content: 'افتتاح معرض تعليمي كبير',
        category: 'فعاليات',
        order: 2,
      },
    }),
    db.newsItem.create({
      data: {
        title: 'قرب بدء الامتحان الاول',
        content: 'الاستعداد لبدء امتحانات الفصل الدراسي الأول',
        category: 'تعليم',
        order: 3,
      },
    }),
    db.newsItem.create({
      data: {
        title: 'تدشين موقع مدرسة الاحايوه شرق الاعدادية',
        content: 'واستعداد لتدشين موقع مدرسة الاحايوه شرق الاعدادية لخدمة الطالب والمعلم وولي الأمر',
        category: 'تقني',
        order: 4,
      },
    }),
    db.newsItem.create({
      data: {
        title: 'نتائج المسابقات العلمية',
        content: 'تفوق طلاب المدرسة في المسابقات العلمية على مستوى المحافظة',
        category: 'تعليم',
        order: 5,
      },
    }),
  ])
  console.log(`  ✓ ${newsItems.length} news items created`)

  // Seed Videos
  console.log('🎬 Creating videos...')
  const videos = await Promise.all([
    db.video.create({
      data: {
        title: 'فيديو تعريفي بالمدرسة',
        description: 'فيديو يعرض أرجاء المدرسة وأنشطتها',
        videoUrl: '/videos/v1.mp4',
        duration: '05:30',
        order: 1,
      },
    }),
    db.video.create({
      data: {
        title: 'فعاليات اليوم الرياضي',
        description: 'فيديو يغطي فعاليات اليوم الرياضي السنوي',
        videoUrl: '/videos/v1.mp4',
        duration: '08:45',
        order: 2,
      },
    }),
  ])
  console.log(`  ✓ ${videos.length} videos created`)

  // Seed Schedules
  console.log('📋 Creating schedules...')
  const schedules = await Promise.all([
    db.schedule.create({
      data: {
        title: 'جدول الصف الأول الإعدادي',
        grade: 'الأول الإعدادي',
        fileUrl: '/schedule/فصل.pdf',
        type: 'حالي',
        uploadDate: '2024-01-20',
      },
    }),
    db.schedule.create({
      data: {
        title: 'جدول الصف الثاني الإعدادي',
        grade: 'الثاني الإعدادي',
        fileUrl: '/schedule/فصل.pdf',
        type: 'حالي',
        uploadDate: '2024-01-20',
      },
    }),
    db.schedule.create({
      data: {
        title: 'جدول الصف الثالث الإعدادي',
        grade: 'الثالث الإعدادي',
        fileUrl: '/schedule/فصل.pdf',
        type: 'حالي',
        uploadDate: '2024-01-20',
      },
    }),
    db.schedule.create({
      data: {
        title: 'جدول المعلمين',
        grade: 'هيئة التدريس',
        fileUrl: '/schedule/معلم.pdf',
        type: 'حالي',
        uploadDate: '2024-01-18',
      },
    }),
  ])
  console.log(`  ✓ ${schedules.length} schedules created`)

  console.log('✅ Database seeding completed successfully!')
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await db.$disconnect()
  })

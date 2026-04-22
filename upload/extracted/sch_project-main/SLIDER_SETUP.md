# إعداد صور السلايدر

## ما تم تعديله:

### 1. إنشاء مجلد الصور
تم إنشاء المجلد التالي:
```
public/images/slider/
```

### 2. تعديل Hero.tsx
تم تحديث مكون `Hero.tsx` ليستخدم المسارات المحلية بدلاً من روابط Unsplash الخارجية.

**المسارات القديمة:**
```javascript
image: 'https://images.unsplash.com/photo-...'
```

**المسارات الجديدة:**
```javascript
image: '/images/slider/slide1.jpg'
image: '/images/slider/slide2.jpg'
image: '/images/slider/slide3.jpg'
```

## خطوات الاستخدام:

1. **ضع صورك في المجلد:**
   - انسخ صورك إلى: `public/images/slider/`
   - سمِّ الصور: `slide1.jpg`, `slide2.jpg`, `slide3.jpg`

2. **إضافة شرائح إضافية (اختياري):**
   - أضف صور جديدة مثل: `slide4.jpg`, `slide5.jpg`
   - عدّل `components/Hero.tsx` وأضف كائن جديد في مصفوفة `slides`:
   ```javascript
   {
     image: '/images/slider/slide4.jpg',
     category: 'الفئة',
     title: 'العنوان',
   }
   ```

3. **تشغيل المشروع:**
   ```bash
   npm install
   npm run dev
   ```

## ملاحظات مهمة:
- تأكد من أن أسماء الملفات تطابق المسارات في الكود
- الصور يجب أن تكون في مجلد `public` لكي تكون متاحة عند التشغيل
- يمكنك استخدام أي صيغة صور (JPG, PNG, WebP)

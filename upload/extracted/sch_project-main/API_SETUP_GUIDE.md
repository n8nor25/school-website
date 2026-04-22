# 🔧 دليل إعداد API للمساعد الذكي

## ✅ الحل الحالي (يعمل بدون API خارجي)

المساعد الذكي يعمل حالياً باستخدام **API محلي** لا يحتاج إلى مفاتيح خارجية.

## 🚀 الترقية لـ API خارجي (اختياري)

### 1. Google Gemini API (مجاني)

#### الحصول على المفتاح:
1. اذهب إلى [Google AI Studio](https://makersuite.google.com/app/apikey)
2. سجل دخول بحساب Google
3. انقر على "Create API Key"
4. انسخ المفتاح

#### الإعداد:
```bash
# إنشاء ملف .env
echo "GEMINI_API_KEY=your-actual-gemini-api-key" > .env
echo "AI_PROVIDER=GEMINI" >> .env
```

### 2. OpenRouter API (مجاني)

#### الحصول على المفتاح:
1. اذهب إلى [OpenRouter](https://openrouter.ai/)
2. سجل حساب جديد
3. اذهب إلى "Keys" في لوحة التحكم
4. انقر على "Create Key"
5. انسخ المفتاح

#### الإعداد:
```bash
# إضافة إلى ملف .env
echo "OPENROUTER_API_KEY=your-actual-openrouter-api-key" >> .env
echo "AI_PROVIDER=OPENROUTER" >> .env
```

### 3. OpenAI API (مدفوع)

#### الحصول على المفتاح:
1. اذهب إلى [OpenAI Platform](https://platform.openai.com/api-keys)
2. سجل دخول أو أنشئ حساب
3. انقر على "Create new secret key"
4. انسخ المفتاح

#### الإعداد:
```bash
# إضافة إلى ملف .env
echo "OPENAI_API_KEY=your-actual-openai-api-key" >> .env
echo "AI_PROVIDER=OPENAI" >> .env
```

## 🔄 تبديل نوع API

### الطريقة 1: عبر متغيرات البيئة
```bash
# استخدام Gemini
export AI_PROVIDER=GEMINI
export GEMINI_API_KEY=your-key

# استخدام OpenRouter
export AI_PROVIDER=OPENROUTER
export OPENROUTER_API_KEY=your-key

# استخدام المحلي (افتراضي)
export AI_PROVIDER=LOCAL
```

### الطريقة 2: عبر الكود
```javascript
// في components/SmartAssistant.tsx
import { aiServiceFactory } from '../services/ai-service-factory';

// تبديل الخدمة
const service = aiServiceFactory.switchService('GEMINI');
```

## 📊 مقارنة الخدمات

| الخدمة | التكلفة | الجودة | السرعة | سهولة الإعداد |
|--------|---------|--------|--------|----------------|
| **LOCAL** | مجاني | جيد | سريع | ⭐⭐⭐⭐⭐ |
| **Gemini** | مجاني | ممتاز | متوسط | ⭐⭐⭐⭐ |
| **OpenRouter** | مجاني | ممتاز | سريع | ⭐⭐⭐⭐ |
| **OpenAI** | مدفوع | ممتاز | سريع | ⭐⭐⭐ |

## 🧪 اختبار API

### اختبار Gemini:
```bash
curl -X POST "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "contents": [{
      "parts": [{
        "text": "مرحبا"
      }]
    }]
  }'
```

### اختبار OpenRouter:
```bash
curl -X POST "https://openrouter.ai/api/v1/chat/completions" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "google/gemini-flash-1.5",
    "messages": [{
      "role": "user",
      "content": "مرحبا"
    }]
  }'
```

## 🔧 إعداد متقدم

### 1. إعداد YouTube API (للفيديوهات)
```bash
# الحصول على YouTube API Key
# 1. اذهب إلى Google Cloud Console
# 2. أنشئ مشروع جديد
# 3. فعّل YouTube Data API v3
# 4. أنشئ API Key

echo "YOUTUBE_API_KEY=your-youtube-api-key" >> .env
```

### 2. إعداد قاعدة البيانات
```bash
# PostgreSQL
echo "DATABASE_URL=postgresql://username:password@localhost:5432/alsharq_academia" >> .env

# أو SQLite (أبسط)
echo "DATABASE_URL=sqlite:./chat.db" >> .env
```

### 3. إعداد Redis (للتخزين المؤقت)
```bash
# Redis
echo "REDIS_URL=redis://localhost:6379" >> .env
```

## 🚨 استكشاف الأخطاء

### مشاكل شائعة:

#### 1. خطأ "API Key not found"
```bash
# تحقق من الملف
cat .env

# تحقق من المتغيرات
echo $GEMINI_API_KEY
```

#### 2. خطأ "Rate limit exceeded"
```bash
# انتظر قليلاً أو استخدم API آخر
export AI_PROVIDER=LOCAL
```

#### 3. خطأ "Network error"
```bash
# تحقق من الاتصال
ping google.com

# تحقق من الـ proxy
echo $HTTP_PROXY
```

## 📈 تحسين الأداء

### 1. التخزين المؤقت
```javascript
// في services/ai-service-factory.js
const cacheEnabled = true;
const cacheTimeout = 300000; // 5 دقائق
```

### 2. معالجة الأخطاء
```javascript
// إضافة retry logic
const maxRetries = 3;
const retryDelay = 1000;
```

### 3. تحسين الردود
```javascript
// إضافة context للردود
const context = {
  studentLevel: 'beginner',
  preferredLanguage: 'ar',
  subject: 'math'
};
```

## 🔒 الأمان

### 1. حماية API Keys
```bash
# لا تشارك المفاتيح
echo ".env" >> .gitignore

# استخدام متغيرات البيئة
export GEMINI_API_KEY=your-key
```

### 2. Rate Limiting
```javascript
// إضافة rate limiting
const rateLimit = {
  windowMs: 15 * 60 * 1000, // 15 دقيقة
  max: 100 // 100 طلب لكل 15 دقيقة
};
```

## 📞 الدعم

### للحصول على المساعدة:
- 📧 البريد الإلكتروني: support@alsharq-academia.com
- 💬 GitHub Issues: [رابط المشروع]
- 📱 واتساب: +966xxxxxxxxx

### مصادر مفيدة:
- [Google Gemini Documentation](https://ai.google.dev/docs)
- [OpenRouter Documentation](https://openrouter.ai/docs)
- [OpenAI API Documentation](https://platform.openai.com/docs)

---

**المساعد الذكي يعمل الآن بشكل مثالي مع جميع أنواع API!** 🎉✨

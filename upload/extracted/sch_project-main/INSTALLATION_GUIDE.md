# 🚀 دليل التثبيت - المساعد الذكي للدراسة

## 📋 المتطلبات الأساسية

### 1. متطلبات النظام
- **Node.js**: الإصدار 16 أو أحدث
- **npm**: الإصدار 8 أو أحدث
- **PostgreSQL**: الإصدار 12 أو أحدث (اختياري)
- **Redis**: الإصدار 6 أو أحدث (اختياري)

### 2. مفاتيح API المطلوبة
- **Google Gemini API Key**: للحصول على [Gemini API Key](https://makersuite.google.com/app/apikey)
- **YouTube Data API Key**: للحصول على [YouTube API Key](https://console.developers.google.com/)

## 🛠️ خطوات التثبيت

### الخطوة 1: إعداد المشروع
```bash
# نسخ الملفات إلى مجلد المشروع
cp -r components/ SmartAssistant.tsx
cp -r api/ chat.js
cp -r services/ gemini-service.js
cp -r config/ ai-config.js
cp -r database/ chat-schema.sql

# تثبيت التبعيات
npm install express cors dotenv helmet compression morgan express-rate-limit
npm install @google/generative-ai youtube-api axios
npm install pg sequelize redis node-cron
npm install --save-dev nodemon jest supertest eslint prettier
```

### الخطوة 2: إعداد متغيرات البيئة
```bash
# إنشاء ملف .env
cp config/environment.js .env

# تحرير ملف .env وإضافة المفاتيح
nano .env
```

**محتوى ملف .env:**
```env
# Google Gemini AI
GEMINI_API_KEY=your-actual-gemini-api-key
GEMINI_MODEL=gemini-1.5-flash
GEMINI_TEMPERATURE=0.7

# YouTube API
YOUTUBE_API_KEY=your-actual-youtube-api-key
YOUTUBE_MAX_RESULTS=3

# AI Service
AI_SERVICE=GEMINI

# Database (اختياري)
DATABASE_URL=postgresql://username:password@localhost:5432/alsharq_academia

# Server
PORT=3000
NODE_ENV=development
```

### الخطوة 3: إعداد قاعدة البيانات (اختياري)
```bash
# إنشاء قاعدة البيانات
createdb alsharq_academia

# تشغيل ملف SQL
psql -d alsharq_academia -f database/chat-schema.sql
```

### الخطوة 4: تشغيل الخادم
```bash
# تشغيل في وضع التطوير
npm run dev

# أو تشغيل في وضع الإنتاج
npm start
```

## 🔧 التكوين المتقدم

### 1. تكوين Google Gemini
```javascript
// في config/ai-config.js
const AI_CONFIG = {
  GEMINI: {
    apiKey: process.env.GEMINI_API_KEY,
    model: 'gemini-1.5-flash',
    temperature: 0.7,
    maxTokens: 1000
  }
};
```

### 2. تكوين YouTube API
```javascript
// في services/youtube-service.js
const YOUTUBE_CONFIG = {
  apiKey: process.env.YOUTUBE_API_KEY,
  maxResults: 3,
  baseUrl: 'https://www.googleapis.com/youtube/v3'
};
```

### 3. تكوين قاعدة البيانات
```javascript
// في config/environment.js
const database = {
  url: process.env.DATABASE_URL,
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT) || 5432,
  name: process.env.DB_NAME || 'alsharq_academia'
};
```

## 🧪 الاختبار

### 1. اختبار API
```bash
# اختبار نقطة الصحة
curl http://localhost:3000/health

# اختبار الشات
curl -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{
    "message": "مرحباً",
    "studentId": "test-student",
    "subject": "عام"
  }'
```

### 2. اختبار الواجهة
```bash
# تشغيل المشروع الرئيسي
npm run dev

# فتح http://localhost:3000
# الانتقال إلى لوحة تحكم الطالب
# النقر على "المساعد الذكي"
```

## 🚀 النشر

### 1. إعداد الخادم
```bash
# تثبيت PM2 لإدارة العمليات
npm install -g pm2

# إنشاء ملف ecosystem.config.js
cat > ecosystem.config.js << EOF
module.exports = {
  apps: [{
    name: 'smart-assistant',
    script: 'server.js',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    }
  }]
};
EOF
```

### 2. تشغيل في الإنتاج
```bash
# تشغيل مع PM2
pm2 start ecosystem.config.js

# حفظ إعدادات PM2
pm2 save
pm2 startup
```

### 3. إعداد Nginx (اختياري)
```nginx
# /etc/nginx/sites-available/smart-assistant
server {
    listen 80;
    server_name your-domain.com;
    
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## 🔒 الأمان

### 1. متغيرات البيئة
```bash
# تأكد من عدم نشر ملف .env
echo ".env" >> .gitignore

# استخدام مفاتيح قوية
openssl rand -base64 32  # لـ JWT_SECRET
openssl rand -base64 32  # لـ ENCRYPTION_KEY
```

### 2. HTTPS
```bash
# تثبيت SSL certificate
sudo certbot --nginx -d your-domain.com
```

### 3. Firewall
```bash
# إعداد UFW
sudo ufw allow 22
sudo ufw allow 80
sudo ufw allow 443
sudo ufw enable
```

## 📊 المراقبة

### 1. Logs
```bash
# عرض logs
pm2 logs smart-assistant

# مراقبة الأداء
pm2 monit
```

### 2. Health Check
```bash
# فحص صحة الخادم
curl http://localhost:3000/health
```

## 🐛 استكشاف الأخطاء

### مشاكل شائعة:

1. **خطأ في API Keys**
   ```bash
   # تحقق من المفاتيح
   echo $GEMINI_API_KEY
   echo $YOUTUBE_API_KEY
   ```

2. **خطأ في قاعدة البيانات**
   ```bash
   # تحقق من الاتصال
   psql -d alsharq_academia -c "SELECT 1;"
   ```

3. **خطأ في CORS**
   ```javascript
   // في server.js
   app.use(cors({
     origin: 'http://localhost:3000',
     credentials: true
   }));
   ```

## 📞 الدعم

للحصول على المساعدة:
- 📧 البريد الإلكتروني: support@alsharq-academia.com
- 💬 GitHub Issues: [رابط المشروع]
- 📱 واتساب: +966xxxxxxxxx

---

**تم تطوير المساعد الذكي لتحسين تجربة التعلم للطلاب في أكاديمية الشرق** 🎓✨

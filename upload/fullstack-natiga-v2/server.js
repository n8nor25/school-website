const express = require('express');
const multer = require('multer');
const xlsx = require('xlsx');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const PDFDocument = require('pdfkit');

const app = express();
const PORT = process.env.PORT || 3000;
const ADMIN_PASSWORD = process.env.ADMIN_PASS || 'admin12345';

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

const upload = multer({ dest: 'uploads/' });
const DATA_DIR = path.join(__dirname, 'data');
if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR);

let adminTokens = new Set();

// --- Auth ---
app.post('/api/login', (req, res) => {
  const { password } = req.body;
  if (password === ADMIN_PASSWORD) {
    const token = Math.random().toString(36).substring(2);
    adminTokens.add(token);
    res.json({ success: true, token });
  } else {
    res.status(401).json({ success: false, error: 'كلمة المرور غير صحيحة' });
  }
});

function requireAuth(req, res, next) {
  const token = req.headers['x-admin-token'];
  if (adminTokens.has(token)) return next();
  res.status(401).json({ error: 'يجب تسجيل الدخول' });
}

// --- Parse Excel ---
function parseSheet(sheet, gradeName) {
  const data = xlsx.utils.sheet_to_json(sheet, { header: 1, defval: '' });
  const headerIdx = data.findIndex(r => r.includes('الجلوس') && r.includes('اسم الطالب'));
  if (headerIdx === -1) throw new Error('تنسيق الشيت غير صحيح');

  const headers = data[headerIdx];
  const maxRow = data[headerIdx + 1] || [];
  const minRow = data[headerIdx + 2] || [];

  const idx = {
    seat: headers.indexOf('الجلوس'),
    name: headers.indexOf('اسم الطالب'),
    arabic: headers.indexOf('عربي'),
    english: headers.indexOf('الانجليزى'),
    social: headers.indexOf('دراسات'),
    math: headers.indexOf('رياضيات'),
    science: headers.indexOf('علوم'),
    total: headers.indexOf('مجموع'),
    religion: headers.indexOf('دين'),
    art: headers.indexOf('فنية'),
    computer: headers.indexOf('كمبيوتر')
  };

  const max = {}, min = {};
  Object.keys(idx).forEach(k => { if (idx[k] >= 0) { max[k] = Number(maxRow[idx[k]]) || 0; min[k] = Number(minRow[idx[k]]) || 0; } });

  const students = [];
  for (let i = headerIdx + 3; i < data.length; i++) {
    const row = data[i];
    if (!row[idx.seat]) continue;
    students.push({
      seat: String(row[idx.seat]).trim(),
      name: row[idx.name] || '',
      arabic: Number(row[idx.arabic]) || 0,
      english: Number(row[idx.english]) || 0,
      social: Number(row[idx.social]) || 0,
      math: Number(row[idx.math]) || 0,
      science: Number(row[idx.science]) || 0,
      total: Number(row[idx.total]) || 0,
      religion: Number(row[idx.religion]) || 0,
      art: Number(row[idx.art]) || 0,
      computer: Number(row[idx.computer]) || 0
    });
  }
  return { grade: gradeName, updatedAt: new Date().toISOString(), max, min, students, subjects: { added: ['arabic','english','social','math','science'], notAdded: ['religion','art','computer'] } };
}

// --- Upload (يدعم ملف واحد فيه كل الصفوف) ---
app.post('/api/upload', requireAuth, upload.single('file'), (req, res) => {
  try {
    const wb = xlsx.readFile(req.file.path);
    const results = [];
    wb.SheetNames.forEach(sheetName => {
      const jsonData = parseSheet(wb.Sheets[sheetName], sheetName);
      const filename = sheetName.replace(/[\/\:*?"<>|\s]+/g, '_') + '.json';
      fs.writeFileSync(path.join(DATA_DIR, filename), JSON.stringify(jsonData, null, 2), 'utf-8');
      results.push({ grade: sheetName, students: jsonData.students.length });
    });
    fs.unlinkSync(req.file.path);
    res.json({ success: true, sheets: results });
  } catch (e) {
    res.status(400).json({ success: false, error: e.message });
  }
});

app.get('/api/grades', (req, res) => {
  const files = fs.readdirSync(DATA_DIR).filter(f => f.endsWith('.json'));
  const grades = files.map(f => { const d = JSON.parse(fs.readFileSync(path.join(DATA_DIR, f))); return { grade: d.grade, students: d.students.length, updatedAt: d.updatedAt }; });
  res.json(grades);
});

app.get('/api/result', (req, res) => {
  const { grade, seat } = req.query;
  const file = path.join(DATA_DIR, grade.replace(/[\/\:*?"<>|\s]+/g, '_') + '.json');
  if (!fs.existsSync(file)) return res.status(404).json({ error: 'الصف غير موجود' });
  const data = JSON.parse(fs.readFileSync(file));
  const student = data.students.find(s => s.seat === String(seat));
  if (!student) return res.status(404).json({ error: 'رقم الجلوس غير موجود' });
  const isPass = student.total >= data.min.total && data.subjects.added.every(k => student[k] >= data.min[k]) && data.subjects.notAdded.every(k => student[k] >= data.min[k]);
  res.json({ student, grade: data.grade, max: data.max, min: data.min, isPass });
});

// --- PDF Certificate ---
app.get('/api/certificate', (req, res) => {
  const { grade, seat } = req.query;
  const file = path.join(DATA_DIR, grade.replace(/[\/\:*?"<>|\s]+/g, '_') + '.json');
  if (!fs.existsSync(file)) return res.status(404).send('Not found');
  const data = JSON.parse(fs.readFileSync(file));
  const student = data.students.find(s => s.seat === String(seat));
  if (!student) return res.status(404).send('Not found');
  const isPass = student.total >= data.min.total;

  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `inline; filename="certificate-${seat}.pdf"`);

  const doc = new PDFDocument({ size: 'A4', margin: 50 });
  doc.pipe(res);

  // عنوان
  doc.fontSize(22).text('مدرسة المنشاة الإعدادية', { align: 'center' });
  doc.moveDown(0.5);
  doc.fontSize(18).text('شهادة نتيجة امتحان', { align: 'center' });
  doc.moveDown(2);

  doc.fontSize(14).text(`الاسم: ${student.name}`, { align: 'right' });
  doc.text(`رقم الجلوس: ${student.seat}`, { align: 'right' });
  doc.text(`الصف: ${grade}`, { align: 'right' });
  doc.moveDown();

  // جدول مبسط
  const subjects = [
    ['اللغة العربية', student.arabic, data.max.arabic],
    ['اللغة الإنجليزية', student.english, data.max.english],
    ['الدراسات', student.social, data.max.social],
    ['الرياضيات', student.math, data.max.math],
    ['العلوم', student.science, data.max.science],
  ];
  doc.fontSize(12).text('المواد المضافة للمجموع:', { align: 'right', underline: true });
  subjects.forEach(([name, score, max]) => {
    doc.text(`${name}: ${score} / ${max}`, { align: 'right' });
  });
  doc.moveDown();
  doc.fontSize(14).text(`المجموع الكلي: ${student.total} من ${data.max.total}`, { align: 'right' });
  doc.moveDown();
  doc.fontSize(16).fillColor(isPass ? 'green' : 'red').text(isPass ? 'النتيجة: ناجح ومنقول' : 'النتيجة: راسب', { align: 'center' });

  doc.end();
});

app.listen(PORT, () => console.log(`Server: http://localhost:${PORT}`));

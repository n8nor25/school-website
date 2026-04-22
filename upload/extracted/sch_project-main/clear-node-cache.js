// مسح cache Node.js و Vite
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🧹 مسح cache Node.js و Vite...');

// مسح node_modules/.vite
const viteCacheDir = path.join(__dirname, 'node_modules', '.vite');
if (fs.existsSync(viteCacheDir)) {
    fs.rmSync(viteCacheDir, { recursive: true, force: true });
    console.log('✅ تم مسح .vite cache');
}

// مسح dist folder
const distDir = path.join(__dirname, 'dist');
if (fs.existsSync(distDir)) {
    fs.rmSync(distDir, { recursive: true, force: true });
    console.log('✅ تم مسح dist folder');
}

// مسح .temp folder
const tempDir = path.join(__dirname, '.temp');
if (fs.existsSync(tempDir)) {
    fs.rmSync(tempDir, { recursive: true, force: true });
    console.log('✅ تم مسح .temp folder');
}

// مسح package-lock.json وإعادة تثبيت
const packageLockPath = path.join(__dirname, 'package-lock.json');
if (fs.existsSync(packageLockPath)) {
    fs.unlinkSync(packageLockPath);
    console.log('✅ تم مسح package-lock.json');
}

console.log('🎉 تم مسح جميع cache بنجاح!');
console.log('📝 الخطوات التالية:');
console.log('1. npm install');
console.log('2. npm run dev');

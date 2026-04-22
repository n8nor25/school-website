import React, { useState, useRef } from 'react';
import { fileStorageService } from '../services/file-storage-service';

interface DocumentUploadProps {
  onDocumentUpload: (file: File, text: string) => void;
  onClose: () => void;
  studentId?: string;
  studentName?: string;
}

const DocumentUpload: React.FC<DocumentUploadProps> = ({ onDocumentUpload, onClose, studentId = 'demo-student', studentName = 'الطالب' }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [extractedText, setExtractedText] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      extractTextFromFile(file);
    }
  };

  const extractTextFromFile = async (file: File) => {
    setIsUploading(true);
    setUploadProgress(0);

    try {
      let text = '';
      
      if (file.type === 'text/plain') {
        text = await file.text();
      } else if (file.type === 'application/pdf') {
        // محاكاة محتوى PDF تعليمي
        text = `مذكرة تكنولوجيا الصف الثاني الإعدادي - الترم الأول

الدرس الأول: مقدمة في التكنولوجيا
- تعريف التكنولوجيا: التكنولوجيا هي استخدام المعرفة العلمية في حل المشاكل العملية
- أهمية التكنولوجيا في حياتنا: تسهيل المهام، تحسين الاتصال، تطوير التعليم
- أنواع التكنولوجيا: تكنولوجيا المعلومات، التكنولوجيا الطبية، التكنولوجيا الصناعية
- التطور التكنولوجي عبر التاريخ: من الأدوات البدائية إلى الذكاء الاصطناعي

الدرس الثاني: أجهزة الحاسوب
- مكونات الحاسوب الأساسية: المعالج، الذاكرة، القرص الصلب، الشاشة، لوحة المفاتيح
- أنواع أجهزة الحاسوب: الحاسوب المكتبي، الحاسوب المحمول، الحاسوب اللوحي
- أنظمة التشغيل: Windows، macOS، Linux
- البرامج والتطبيقات: معالجة النصوص، الجداول الإلكترونية، العروض التقديمية

الدرس الثالث: الإنترنت والشبكات
- تعريف الإنترنت: شبكة عالمية من أجهزة الحاسوب المتصلة
- فوائد الإنترنت: البحث عن المعلومات، التواصل، التجارة الإلكترونية
- أنواع الشبكات: الشبكة المحلية (LAN)، الشبكة الواسعة (WAN)
- الأمان على الإنترنت: كلمات المرور القوية، تجنب المواقع المشبوهة

الدرس الرابع: البرمجة
- مفهوم البرمجة: كتابة تعليمات للحاسوب لتنفيذ مهام معينة
- لغات البرمجة: Python، JavaScript، Java، C++
- أساسيات البرمجة: المتغيرات، الشروط، الحلقات
- أمثلة عملية: برنامج بسيط لحساب المجموع

الدرس الخامس: الذكاء الاصطناعي
- تعريف الذكاء الاصطناعي: قدرة الآلات على محاكاة الذكاء البشري
- تطبيقات الذكاء الاصطناعي: المساعدات الذكية، السيارات ذاتية القيادة، التشخيص الطبي
- فوائد ومخاطر الذكاء الاصطناعي: تحسين الكفاءة مقابل مخاوف الخصوصية
- مستقبل الذكاء الاصطناعي: تطوير قدرات أكثر تقدماً

أسئلة وتمارين:
1. ما هو تعريف التكنولوجيا؟
2. اذكر مكونات الحاسوب الأساسية
3. ما هي فوائد الإنترنت؟
4. اشرح مفهوم البرمجة
5. ما هي تطبيقات الذكاء الاصطناعي؟`;
      } else if (file.type.includes('word') || file.type.includes('document')) {
        // محاكاة محتوى Word تعليمي
        text = `توجيهات تدريس مادة الكمبيوتر - الإعدادي

الفصل الأول: أساسيات الكمبيوتر
- تعريف الكمبيوتر: جهاز إلكتروني قادر على معالجة البيانات وتنفيذ العمليات
- مكونات الكمبيوتر الأساسية: المعالج (CPU)، الذاكرة العشوائية (RAM)، القرص الصلب (HDD)
- أنواع أجهزة الكمبيوتر: الحاسوب المكتبي، الحاسوب المحمول، الحاسوب اللوحي، الهواتف الذكية
- أنظمة التشغيل المختلفة: Windows، macOS، Linux، Android، iOS

الفصل الثاني: البرمجة
- مفهوم البرمجة: عملية كتابة تعليمات للحاسوب لتنفيذ مهام محددة
- لغات البرمجة المختلفة: Python (سهلة التعلم)، JavaScript (للمواقع)، Java (للتطبيقات)
- أساسيات البرمجة: المتغيرات، الشروط (if/else)، الحلقات (for/while)، الدوال
- أمثلة عملية: برنامج حساب العمر، برنامج تحويل العملات، برنامج قائمة المهام

الفصل الثالث: الإنترنت
- تعريف الإنترنت: شبكة عالمية تربط ملايين الأجهزة حول العالم
- فوائد الإنترنت: البحث عن المعلومات، التواصل الاجتماعي، التجارة الإلكترونية، التعليم عن بُعد
- الأمان على الإنترنت: استخدام كلمات مرور قوية، تجنب النقر على الروابط المشبوهة
- البحث على الإنترنت: استخدام محركات البحث، تقييم مصداقية المعلومات

الفصل الرابع: التطبيقات
- معالجة النصوص: Microsoft Word، Google Docs، كتابة المستندات وتنسيقها
- الجداول الإلكترونية: Microsoft Excel، Google Sheets، تحليل البيانات والرسوم البيانية
- العروض التقديمية: Microsoft PowerPoint، Google Slides، إنشاء العروض التقديمية
- قواعد البيانات: Microsoft Access، تخزين وإدارة المعلومات

أسئلة وتمارين:
1. ما هو تعريف الكمبيوتر؟
2. اذكر مكونات الكمبيوتر الأساسية
3. ما هي فوائد الإنترنت؟
4. اشرح مفهوم البرمجة
5. ما هي أنواع التطبيقات؟`;
      } else {
        text = `[File: ${file.name}]\n\nنوع الملف غير مدعوم. يرجى تحويله إلى ملف نصي (.txt) أو PDF.`;
      }

      // محاكاة التقدم
      for (let i = 0; i <= 100; i += 10) {
        setUploadProgress(i);
        await new Promise(resolve => setTimeout(resolve, 100));
      }

      setExtractedText(text);
    } catch (error) {
      console.error('Error extracting text:', error);
      setExtractedText('حدث خطأ في استخراج النص من الملف.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleUpload = () => {
    if (selectedFile && extractedText) {
      try {
        // حفظ الملف في النظام
        const savedFile = fileStorageService.saveFile(
          selectedFile, 
          extractedText, 
          studentId, 
          studentName
        );
        
        console.log('تم حفظ الملف بنجاح:', savedFile);
        
        // إرسال الملف للمكون الأب
        onDocumentUpload(selectedFile, extractedText);
        onClose();
      } catch (error) {
        console.error('خطأ في حفظ الملف:', error);
        alert('حدث خطأ في حفظ الملف. يرجى المحاولة مرة أخرى.');
      }
    }
  };

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
  };

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file) {
      setSelectedFile(file);
      extractTextFromFile(file);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-4 rounded-t-2xl flex justify-between items-center">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center text-xl">
              📄
            </div>
            <div className="ml-3">
              <h3 className="text-lg font-bold">رفع المستندات</h3>
              <p className="text-sm opacity-90">ارفع مستنداً للحصول على مساعدة ذكية</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:text-gray-200 text-2xl"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* File Upload Area */}
          <div
            className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors duration-300 ${
              selectedFile
                ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                : 'border-gray-300 dark:border-slate-600 hover:border-indigo-500'
            }`}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          >
            {selectedFile ? (
              <div className="space-y-4">
                <div className="text-green-600 text-4xl">✅</div>
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                  تم اختيار الملف
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {selectedFile.name} ({Math.round(selectedFile.size / 1024)} KB)
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="text-gray-400 text-4xl">📁</div>
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                  اسحب الملف هنا أو انقر للاختيار
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  يدعم: ملفات نصية (.txt), PDF, Word
                </p>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-300"
                >
                  اختر ملف
                </button>
              </div>
            )}

            <input
              ref={fileInputRef}
              type="file"
              accept=".txt,.pdf,.doc,.docx"
              onChange={handleFileSelect}
              className="hidden"
            />
          </div>

          {/* Upload Progress */}
          {isUploading && (
            <div className="mt-6">
              <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
                <span>جاري معالجة الملف...</span>
                <span>{uploadProgress}%</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-slate-700 rounded-full h-2">
                <div
                  className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
            </div>
          )}

          {/* Extracted Text Preview */}
          {extractedText && (
            <div className="mt-6">
              <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                معاينة المحتوى المستخرج:
              </h4>
              <div className="bg-gray-50 dark:bg-slate-700 rounded-lg p-4 max-h-40 overflow-y-auto">
                <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                  {extractedText.length > 500 
                    ? extractedText.substring(0, 500) + '...' 
                    : extractedText
                  }
                </p>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                {extractedText.length} حرف
              </p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3 mt-6">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors duration-300"
            >
              إلغاء
            </button>
            <button
              onClick={handleUpload}
              disabled={!selectedFile || !extractedText || isUploading}
              className="px-6 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
            >
              {isUploading ? 'جاري المعالجة...' : 'رفع المستند'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentUpload;

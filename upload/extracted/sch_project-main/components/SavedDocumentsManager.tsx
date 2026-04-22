import React, { useState, useEffect } from 'react';
import { fileStorageService, SavedFile } from '../services/file-storage-service';

interface SavedDocumentsManagerProps {
  studentId: string;
  studentName: string;
  onDocumentSelect: (file: SavedFile) => void;
  onClose: () => void;
}

const SavedDocumentsManager: React.FC<SavedDocumentsManagerProps> = ({
  studentId,
  studentName,
  onDocumentSelect,
  onClose
}) => {
  const [savedFiles, setSavedFiles] = useState<SavedFile[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadSavedFiles();
  }, [studentId]);

  const loadSavedFiles = () => {
    setIsLoading(true);
    try {
      const files = fileStorageService.getStudentFiles(studentId);
      setSavedFiles(files);
      console.log('تم تحميل الملفات المحفوظة:', files);
    } catch (error) {
      console.error('خطأ في تحميل الملفات:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteFile = (fileId: string) => {
    if (confirm('هل أنت متأكد من حذف هذا الملف؟')) {
      const success = fileStorageService.deleteFile(fileId);
      if (success) {
        loadSavedFiles();
        alert('تم حذف الملف بنجاح');
      } else {
        alert('حدث خطأ في حذف الملف');
      }
    }
  };

  const filteredFiles = savedFiles.filter(file =>
    file.originalName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    file.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('ar-SA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-4 rounded-t-2xl flex justify-between items-center">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center text-xl">
              📁
            </div>
            <div className="ml-3">
              <h3 className="text-lg font-bold">المستندات المحفوظة</h3>
              <p className="text-sm opacity-90">للمستخدم: {studentName}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:text-gray-200 text-2xl"
          >
            ✕
          </button>
        </div>

        {/* Search */}
        <div className="p-4 border-b border-gray-200 dark:border-slate-700">
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="البحث في المستندات..."
              className="w-full p-3 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
            <div className="absolute right-3 top-3 text-gray-400">
              🔍
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          {isLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
              <p className="text-gray-600 dark:text-gray-400 mt-2">جاري تحميل الملفات...</p>
            </div>
          ) : filteredFiles.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-4xl mb-4">📄</div>
              <p className="text-gray-600 dark:text-gray-400">
                {searchQuery ? 'لا توجد ملفات تطابق البحث' : 'لا توجد ملفات محفوظة'}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredFiles.map((file) => (
                <div
                  key={file.id}
                  className="bg-gray-50 dark:bg-slate-700 rounded-lg p-4 border border-gray-200 dark:border-slate-600"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center mb-2">
                        <div className="text-2xl mr-3">
                          {file.fileType.includes('pdf') ? '📄' : 
                           file.fileType.includes('word') ? '📝' : '📄'}
                        </div>
                        <div>
                          <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                            {file.originalName}
                          </h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {formatFileSize(file.fileSize)} • {formatDate(file.uploadDate)}
                          </p>
                        </div>
                      </div>
                      
                      <div className="bg-white dark:bg-slate-800 rounded p-3 mb-3">
                        <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-3">
                          {file.content.length > 200 
                            ? file.content.substring(0, 200) + '...' 
                            : file.content
                          }
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex space-x-2">
                    <button
                      onClick={() => onDocumentSelect(file)}
                      className="flex-1 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors duration-300"
                    >
                      📖 فتح المستند
                    </button>
                    <button
                      onClick={() => handleDeleteFile(file.id)}
                      className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-300"
                    >
                      🗑️ حذف
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 dark:border-slate-700">
          <div className="flex justify-between items-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              إجمالي الملفات: {savedFiles.length}
            </p>
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors duration-300"
            >
              إغلاق
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SavedDocumentsManager;



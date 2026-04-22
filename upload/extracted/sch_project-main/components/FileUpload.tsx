import React, { useState, useRef } from 'react';
import { AssignmentFile } from '../src/context/AssignmentContext';

interface FileUploadProps {
  onFilesSelected: (files: AssignmentFile[]) => void;
  maxFiles?: number;
  maxSize?: number; // في الميجابايت
  acceptedTypes?: string[];
  existingFiles?: AssignmentFile[];
  onFileRemove?: (fileId: string) => void;
}

const FileUpload: React.FC<FileUploadProps> = ({
  onFilesSelected,
  maxFiles = 5,
  maxSize = 10,
  acceptedTypes = ['.pdf', '.doc', '.docx', '.txt', '.jpg', '.jpeg', '.png'],
  existingFiles = [],
  onFileRemove,
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // محاكاة رفع الملفات
  const simulateFileUpload = async (files: FileList): Promise<AssignmentFile[]> => {
    const uploadedFiles: AssignmentFile[] = [];
    
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      
      // التحقق من حجم الملف
      if (file.size > maxSize * 1024 * 1024) {
        alert(`الملف ${file.name} أكبر من ${maxSize} ميجابايت`);
        continue;
      }
      
      // التحقق من نوع الملف
      const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
      if (!acceptedTypes.includes(fileExtension)) {
        alert(`نوع الملف ${file.name} غير مدعوم`);
        continue;
      }
      
      // محاكاة رفع الملف
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const uploadedFile: AssignmentFile = {
        id: `file_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        name: file.name,
        size: file.size,
        type: file.type,
        url: URL.createObjectURL(file), // في التطبيق الحقيقي، هذا سيكون رابط الخادم
        uploadedAt: new Date().toISOString(),
      };
      
      uploadedFiles.push(uploadedFile);
    }
    
    return uploadedFiles;
  };

  const handleFiles = async (files: FileList) => {
    if (files.length === 0) return;
    
    if (existingFiles.length + files.length > maxFiles) {
      alert(`يمكنك رفع ${maxFiles} ملفات كحد أقصى`);
      return;
    }
    
    setUploading(true);
    
    try {
      const uploadedFiles = await simulateFileUpload(files);
      onFilesSelected(uploadedFiles);
    } catch (error) {
      console.error('Error uploading files:', error);
      alert('حدث خطأ في رفع الملفات');
    } finally {
      setUploading(false);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFiles(e.target.files);
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (type: string): string => {
    if (type.includes('pdf')) return '📄';
    if (type.includes('word') || type.includes('document')) return '📝';
    if (type.includes('image')) return '🖼️';
    if (type.includes('text')) return '📃';
    return '📎';
  };

  return (
    <div className="space-y-4">
      {/* منطقة رفع الملفات */}
      <div
        className={`relative border-2 border-dashed rounded-lg p-6 text-center transition-colors duration-300 ${
          dragActive
            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
            : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept={acceptedTypes.join(',')}
          onChange={handleFileInput}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
        
        <div className="space-y-2">
          <div className="text-4xl">📁</div>
          <div>
            <p className="text-lg font-medium text-gray-700 dark:text-gray-300">
              {uploading ? 'جاري رفع الملفات...' : 'اسحب الملفات هنا أو انقر للاختيار'}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              أنواع الملفات المدعومة: {acceptedTypes.join(', ')}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              الحد الأقصى: {maxFiles} ملفات، {maxSize} ميجابايت لكل ملف
            </p>
          </div>
          
          {uploading && (
            <div className="flex items-center justify-center gap-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
              <span className="text-sm text-blue-600 dark:text-blue-400">جاري الرفع...</span>
            </div>
          )}
        </div>
      </div>

      {/* الملفات المرفوعة */}
      {existingFiles.length > 0 && (
        <div className="space-y-2">
          <h4 className="font-medium text-gray-700 dark:text-gray-300">الملفات المرفوعة:</h4>
          <div className="space-y-2">
            {existingFiles.map((file) => (
              <div
                key={file.id}
                className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <span className="text-xl">{getFileIcon(file.type)}</span>
                  <div>
                    <p className="font-medium text-gray-800 dark:text-gray-200">{file.name}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {formatFileSize(file.size)}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <a
                    href={file.url}
                    download={file.name}
                    className="text-blue-500 hover:text-blue-700 transition-colors duration-200"
                    title="تحميل الملف"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </a>
                  
                  {onFileRemove && (
                    <button
                      onClick={() => onFileRemove(file.id)}
                      className="text-red-500 hover:text-red-700 transition-colors duration-200"
                      title="حذف الملف"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default FileUpload;

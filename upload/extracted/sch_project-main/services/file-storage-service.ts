// File Storage Service - خدمة حفظ وإدارة الملفات
// تحفظ الملفات في مجلد public/schedules/ للوصول إليها لاحقاً

interface SavedFile {
  id: string;
  originalName: string;
  savedName: string;
  fileType: string;
  fileSize: number;
  uploadDate: string;
  content: string;
  studentId: string;
  studentName: string;
}

class FileStorageService {
  private storageKey = 'uploaded_documents';
  private schedulesPath = '/schedules/';

  // حفظ الملف في التخزين المحلي
  saveFile(file: File, content: string, studentId: string, studentName: string): SavedFile {
    const fileId = this.generateFileId();
    const savedFileName = `${fileId}_${file.name}`;
    
    const savedFile: SavedFile = {
      id: fileId,
      originalName: file.name,
      savedName: savedFileName,
      fileType: file.type,
      fileSize: file.size,
      uploadDate: new Date().toISOString(),
      content: content,
      studentId: studentId,
      studentName: studentName
    };

    // حفظ في localStorage
    this.saveToLocalStorage(savedFile);
    
    // حفظ الملف في مجلد public/schedules/ (محاكاة)
    this.saveToSchedulesFolder(savedFile);

    console.log('تم حفظ الملف:', savedFile);
    return savedFile;
  }

  // استرجاع الملف من التخزين
  getFile(fileId: string): SavedFile | null {
    const files = this.getAllFiles();
    return files.find(file => file.id === fileId) || null;
  }

  // استرجاع جميع الملفات المحفوظة
  getAllFiles(): SavedFile[] {
    try {
      const stored = localStorage.getItem(this.storageKey);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('خطأ في استرجاع الملفات:', error);
      return [];
    }
  }

  // استرجاع ملفات طالب معين
  getStudentFiles(studentId: string): SavedFile[] {
    const allFiles = this.getAllFiles();
    return allFiles.filter(file => file.studentId === studentId);
  }

  // حذف الملف
  deleteFile(fileId: string): boolean {
    try {
      const files = this.getAllFiles();
      const filteredFiles = files.filter(file => file.id !== fileId);
      localStorage.setItem(this.storageKey, JSON.stringify(filteredFiles));
      console.log('تم حذف الملف:', fileId);
      return true;
    } catch (error) {
      console.error('خطأ في حذف الملف:', error);
      return false;
    }
  }

  // حفظ في localStorage
  private saveToLocalStorage(file: SavedFile): void {
    try {
      const existingFiles = this.getAllFiles();
      existingFiles.push(file);
      localStorage.setItem(this.storageKey, JSON.stringify(existingFiles));
    } catch (error) {
      console.error('خطأ في حفظ الملف في localStorage:', error);
    }
  }

  // حفظ في مجلد schedules (محاكاة)
  private saveToSchedulesFolder(file: SavedFile): void {
    try {
      // في التطبيق الحقيقي، هذا سيكون استدعاء API لحفظ الملف
      // هنا نُحاكي العملية
      console.log(`تم حفظ الملف في ${this.schedulesPath}${file.savedName}`);
      
      // إنشاء رابط الملف
      const fileUrl = `${this.schedulesPath}${file.savedName}`;
      console.log('رابط الملف:', fileUrl);
      
      // حفظ معلومات الملف في ملف منفصل
      this.saveFileMetadata(file);
      
    } catch (error) {
      console.error('خطأ في حفظ الملف في مجلد schedules:', error);
    }
  }

  // حفظ معلومات الملف
  private saveFileMetadata(file: SavedFile): void {
    try {
      const metadataKey = `file_metadata_${file.id}`;
      localStorage.setItem(metadataKey, JSON.stringify({
        ...file,
        fileUrl: `${this.schedulesPath}${file.savedName}`,
        lastAccessed: new Date().toISOString()
      }));
    } catch (error) {
      console.error('خطأ في حفظ معلومات الملف:', error);
    }
  }

  // توليد معرف فريد للملف
  private generateFileId(): string {
    return `file_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // البحث في الملفات
  searchFiles(query: string, studentId?: string): SavedFile[] {
    const files = studentId ? this.getStudentFiles(studentId) : this.getAllFiles();
    const lowerQuery = query.toLowerCase();
    
    return files.filter(file => 
      file.originalName.toLowerCase().includes(lowerQuery) ||
      file.content.toLowerCase().includes(lowerQuery) ||
      file.fileType.toLowerCase().includes(lowerQuery)
    );
  }

  // إحصائيات الملفات
  getFileStats(studentId?: string): {
    totalFiles: number;
    totalSize: number;
    fileTypes: { [key: string]: number };
    recentFiles: SavedFile[];
  } {
    const files = studentId ? this.getStudentFiles(studentId) : this.getAllFiles();
    
    const totalFiles = files.length;
    const totalSize = files.reduce((sum, file) => sum + file.fileSize, 0);
    
    const fileTypes: { [key: string]: number } = {};
    files.forEach(file => {
      const type = file.fileType.split('/')[0];
      fileTypes[type] = (fileTypes[type] || 0) + 1;
    });

    const recentFiles = files
      .sort((a, b) => new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime())
      .slice(0, 5);

    return {
      totalFiles,
      totalSize,
      fileTypes,
      recentFiles
    };
  }

  // تنظيف الملفات القديمة
  cleanupOldFiles(daysOld: number = 30): number {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysOld);
    
    const files = this.getAllFiles();
    const validFiles = files.filter(file => 
      new Date(file.uploadDate) > cutoffDate
    );
    
    localStorage.setItem(this.storageKey, JSON.stringify(validFiles));
    const deletedCount = files.length - validFiles.length;
    
    console.log(`تم حذف ${deletedCount} ملف قديم`);
    return deletedCount;
  }
}

// إنشاء instance واحد للاستخدام
const fileStorageService = new FileStorageService();

export { fileStorageService, SavedFile };
export default fileStorageService;



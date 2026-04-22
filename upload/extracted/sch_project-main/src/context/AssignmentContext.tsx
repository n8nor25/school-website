import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// أنواع الواجبات
export type AssignmentType = 'homework' | 'project' | 'exam' | 'quiz';

// حالة الواجب
export type AssignmentStatus = 'pending' | 'submitted' | 'graded' | 'late';

// بيانات الواجب
export interface Assignment {
  id: string;
  title: string;
  description: string;
  type: AssignmentType;
  subject: string;
  teacherId: string;
  teacherName: string;
  dueDate: string;
  createdAt: string;
  files: AssignmentFile[];
  maxGrade: number;
  instructions?: string;
}

// بيانات تسليم الواجب
export interface AssignmentSubmission {
  id: string;
  assignmentId: string;
  studentId: string;
  studentName: string;
  submittedAt: string;
  files: AssignmentFile[];
  grade?: number;
  feedback?: string;
  status: AssignmentStatus;
}

// بيانات الملف
export interface AssignmentFile {
  id: string;
  name: string;
  size: number;
  type: string;
  url: string;
  uploadedAt: string;
}

// بيانات السياق
interface AssignmentContextType {
  assignments: Assignment[];
  submissions: AssignmentSubmission[];
  addAssignment: (assignment: Omit<Assignment, 'id' | 'createdAt'>) => void;
  updateAssignment: (id: string, assignment: Partial<Assignment>) => void;
  deleteAssignment: (id: string) => void;
  submitAssignment: (submission: Omit<AssignmentSubmission, 'id' | 'submittedAt' | 'status'>) => void;
  gradeAssignment: (submissionId: string, grade: number, feedback?: string) => void;
  getAssignmentsByTeacher: (teacherId: string) => Assignment[];
  getAssignmentsByStudent: (studentId: string) => Assignment[];
  getSubmissionsByAssignment: (assignmentId: string) => AssignmentSubmission[];
  getSubmissionByStudent: (assignmentId: string, studentId: string) => AssignmentSubmission | undefined;
}

// إنشاء السياق
const AssignmentContext = createContext<AssignmentContextType | undefined>(undefined);

// مكون Provider
interface AssignmentProviderProps {
  children: ReactNode;
}

export const AssignmentProvider: React.FC<AssignmentProviderProps> = ({ children }) => {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [submissions, setSubmissions] = useState<AssignmentSubmission[]>([]);

  // تحميل البيانات من localStorage عند بدء التطبيق
  useEffect(() => {
    const savedAssignments = localStorage.getItem('alsharq_assignments');
    const savedSubmissions = localStorage.getItem('alsharq_submissions');
    
    if (savedAssignments) {
      try {
        setAssignments(JSON.parse(savedAssignments));
      } catch (error) {
        console.error('Error parsing saved assignments:', error);
      }
    }
    
    if (savedSubmissions) {
      try {
        setSubmissions(JSON.parse(savedSubmissions));
      } catch (error) {
        console.error('Error parsing saved submissions:', error);
      }
    }
  }, []);

  // حفظ البيانات في localStorage عند التغيير
  useEffect(() => {
    localStorage.setItem('alsharq_assignments', JSON.stringify(assignments));
  }, [assignments]);

  useEffect(() => {
    localStorage.setItem('alsharq_submissions', JSON.stringify(submissions));
  }, [submissions]);

  // إضافة واجب جديد
  const addAssignment = (assignmentData: Omit<Assignment, 'id' | 'createdAt'>) => {
    const newAssignment: Assignment = {
      ...assignmentData,
      id: `assignment_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString(),
    };
    setAssignments(prev => [...prev, newAssignment]);
  };

  // تحديث واجب
  const updateAssignment = (id: string, assignmentData: Partial<Assignment>) => {
    setAssignments(prev => 
      prev.map(assignment => 
        assignment.id === id 
          ? { ...assignment, ...assignmentData }
          : assignment
      )
    );
  };

  // حذف واجب
  const deleteAssignment = (id: string) => {
    setAssignments(prev => prev.filter(assignment => assignment.id !== id));
    // حذف التسليمات المرتبطة
    setSubmissions(prev => prev.filter(submission => submission.assignmentId !== id));
  };

  // تسليم واجب
  const submitAssignment = (submissionData: Omit<AssignmentSubmission, 'id' | 'submittedAt' | 'status'>) => {
    const assignment = assignments.find(a => a.id === submissionData.assignmentId);
    const isLate = assignment && new Date() > new Date(assignment.dueDate);
    
    const newSubmission: AssignmentSubmission = {
      ...submissionData,
      id: `submission_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      submittedAt: new Date().toISOString(),
      status: isLate ? 'late' : 'submitted',
    };
    
    setSubmissions(prev => [...prev, newSubmission]);
  };

  // تقييم واجب
  const gradeAssignment = (submissionId: string, grade: number, feedback?: string) => {
    setSubmissions(prev => 
      prev.map(submission => 
        submission.id === submissionId 
          ? { ...submission, grade, feedback, status: 'graded' as AssignmentStatus }
          : submission
      )
    );
  };

  // الحصول على واجبات المعلم
  const getAssignmentsByTeacher = (teacherId: string) => {
    return assignments.filter(assignment => assignment.teacherId === teacherId);
  };

  // الحصول على واجبات الطالب
  const getAssignmentsByStudent = (studentId: string) => {
    return assignments; // الطالب يرى جميع الواجبات
  };

  // الحصول على تسليمات واجب معين
  const getSubmissionsByAssignment = (assignmentId: string) => {
    return submissions.filter(submission => submission.assignmentId === assignmentId);
  };

  // الحصول على تسليم طالب معين لواجب معين
  const getSubmissionByStudent = (assignmentId: string, studentId: string) => {
    return submissions.find(submission => 
      submission.assignmentId === assignmentId && submission.studentId === studentId
    );
  };

  const value: AssignmentContextType = {
    assignments,
    submissions,
    addAssignment,
    updateAssignment,
    deleteAssignment,
    submitAssignment,
    gradeAssignment,
    getAssignmentsByTeacher,
    getAssignmentsByStudent,
    getSubmissionsByAssignment,
    getSubmissionByStudent,
  };

  return (
    <AssignmentContext.Provider value={value}>
      {children}
    </AssignmentContext.Provider>
  );
};

// Hook لاستخدام السياق
export const useAssignments = (): AssignmentContextType => {
  const context = useContext(AssignmentContext);
  if (context === undefined) {
    throw new Error('useAssignments must be used within an AssignmentProvider');
  }
  return context;
};

export default AssignmentContext;

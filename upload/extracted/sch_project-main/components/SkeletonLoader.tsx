import React from 'react';

interface SkeletonProps {
  className?: string;
  children?: React.ReactNode;
}

// Basic skeleton component
export const Skeleton: React.FC<SkeletonProps> = ({ className = '', children }) => {
  return (
    <div className={`skeleton ${className}`}>
      {children}
    </div>
  );
};

// Text skeleton
export const SkeletonText: React.FC<{ lines?: number; className?: string }> = ({ 
  lines = 1, 
  className = '' 
}) => {
  return (
    <div className={className}>
      {Array.from({ length: lines }).map((_, index) => (
        <Skeleton 
          key={index}
          className={`skeleton-text ${index === lines - 1 ? 'w-3/4' : ''}`}
        />
      ))}
    </div>
  );
};

// Title skeleton
export const SkeletonTitle: React.FC<{ className?: string }> = ({ className = '' }) => {
  return <Skeleton className={`skeleton-title ${className}`} />;
};

// Avatar skeleton
export const SkeletonAvatar: React.FC<{ size?: 'sm' | 'md' | 'lg'; className?: string }> = ({ 
  size = 'md', 
  className = '' 
}) => {
  const sizeClass = {
    sm: 'skeleton-avatar',
    md: 'skeleton-avatar',
    lg: 'skeleton-avatar-lg'
  };
  
  return <Skeleton className={`${sizeClass[size]} ${className}`} />;
};

// Image skeleton
export const SkeletonImage: React.FC<{ className?: string }> = ({ className = '' }) => {
  return <Skeleton className={`skeleton-image ${className}`} />;
};

// Button skeleton
export const SkeletonButton: React.FC<{ className?: string }> = ({ className = '' }) => {
  return <Skeleton className={`skeleton-button ${className}`} />;
};

// Card skeleton
export const SkeletonCard: React.FC<{ className?: string; children?: React.ReactNode }> = ({ 
  className = '', 
  children 
}) => {
  return (
    <div className={`skeleton-card ${className}`}>
      {children}
    </div>
  );
};

// News item skeleton
export const SkeletonNewsItem: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div className={`skeleton-news-item ${className}`}>
      <SkeletonImage className="w-16 h-16" />
      <div className="skeleton-content">
        <SkeletonText lines={2} />
      </div>
    </div>
  );
};

// Tutor card skeleton
export const SkeletonTutorCard: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <SkeletonCard className={`skeleton-tutor-card ${className}`}>
      <SkeletonAvatar size="lg" />
      <SkeletonTitle />
      <SkeletonText lines={2} />
      <SkeletonButton />
    </SkeletonCard>
  );
};

// Department card skeleton
export const SkeletonDepartmentCard: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <SkeletonCard className={`skeleton-department-card ${className}`}>
      <SkeletonImage />
      <SkeletonTitle />
      <SkeletonText lines={3} />
    </SkeletonCard>
  );
};

// Gallery item skeleton
export const SkeletonGalleryItem: React.FC<{ className?: string }> = ({ className = '' }) => {
  return <Skeleton className={`skeleton-gallery-item ${className}`} />;
};

// Loading spinner
export const LoadingSpinner: React.FC<{ 
  size?: 'sm' | 'md' | 'lg'; 
  className?: string;
  text?: string;
}> = ({ size = 'md', className = '', text }) => {
  const sizeClass = {
    sm: 'spinner-sm',
    md: 'spinner',
    lg: 'spinner-lg'
  };
  
  return (
    <div className={`flex flex-col items-center justify-center gap-2 ${className}`}>
      <div className={sizeClass[size]}></div>
      {text && <p className="text-sm text-gray-600 dark:text-gray-400">{text}</p>}
    </div>
  );
};

// Dots loading
export const DotsLoading: React.FC<{ className?: string; text?: string }> = ({ 
  className = '', 
  text 
}) => {
  return (
    <div className={`flex flex-col items-center justify-center gap-2 ${className}`}>
      <div className="dots-loading">
        <span></span>
        <span></span>
        <span></span>
      </div>
      {text && <p className="text-sm text-gray-600 dark:text-gray-400">{text}</p>}
    </div>
  );
};

// Wave loading
export const WaveLoading: React.FC<{ className?: string; text?: string }> = ({ 
  className = '', 
  text 
}) => {
  return (
    <div className={`flex flex-col items-center justify-center gap-2 ${className}`}>
      <div className="wave-loading">
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
      </div>
      {text && <p className="text-sm text-gray-600 dark:text-gray-400">{text}</p>}
    </div>
  );
};

// Loading overlay
export const LoadingOverlay: React.FC<{ 
  isLoading: boolean; 
  children: React.ReactNode;
  loadingComponent?: React.ReactNode;
}> = ({ isLoading, children, loadingComponent }) => {
  return (
    <div className="relative">
      {children}
      {isLoading && (
        <div className="loading-overlay">
          {loadingComponent || <LoadingSpinner text="جاري التحميل..." />}
        </div>
      )}
    </div>
  );
};

// Pulse loading
export const PulseLoading: React.FC<{ className?: string; children: React.ReactNode }> = ({ 
  className = '', 
  children 
}) => {
  return (
    <div className={`pulse-loading ${className}`}>
      {children}
    </div>
  );
};

export default Skeleton;

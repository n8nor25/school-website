-- Chat History Database Schema
-- This file contains the SQL schema for storing chat conversations

-- Create chat_history table
CREATE TABLE IF NOT EXISTS chat_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    response TEXT NOT NULL,
    subject VARCHAR(100) DEFAULT 'عام',
    video_links JSONB DEFAULT '[]',
    ai_model VARCHAR(50) DEFAULT 'gemini',
    response_time_ms INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_chat_history_student_id ON chat_history(student_id);
CREATE INDEX IF NOT EXISTS idx_chat_history_created_at ON chat_history(created_at);
CREATE INDEX IF NOT EXISTS idx_chat_history_subject ON chat_history(subject);

-- Create chat_sessions table for grouping conversations
CREATE TABLE IF NOT EXISTS chat_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id VARCHAR(255) NOT NULL,
    session_name VARCHAR(255) DEFAULT 'محادثة جديدة',
    subject VARCHAR(100) DEFAULT 'عام',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    ended_at TIMESTAMP WITH TIME ZONE
);

-- Create index for sessions
CREATE INDEX IF NOT EXISTS idx_chat_sessions_student_id ON chat_sessions(student_id);
CREATE INDEX IF NOT EXISTS idx_chat_sessions_active ON chat_sessions(is_active);

-- Create study_analytics table for tracking student progress
CREATE TABLE IF NOT EXISTS study_analytics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id VARCHAR(255) NOT NULL,
    subject VARCHAR(100) NOT NULL,
    questions_asked INTEGER DEFAULT 0,
    topics_covered TEXT[],
    study_time_minutes INTEGER DEFAULT 0,
    last_study_date DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for analytics
CREATE INDEX IF NOT EXISTS idx_study_analytics_student_id ON study_analytics(student_id);
CREATE INDEX IF NOT EXISTS idx_study_analytics_subject ON study_analytics(subject);

-- Create video_recommendations table for tracking suggested videos
CREATE TABLE IF NOT EXISTS video_recommendations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id VARCHAR(255) NOT NULL,
    video_url VARCHAR(500) NOT NULL,
    video_title VARCHAR(255),
    subject VARCHAR(100),
    is_watched BOOLEAN DEFAULT false,
    watch_duration_seconds INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for video recommendations
CREATE INDEX IF NOT EXISTS idx_video_recommendations_student_id ON video_recommendations(student_id);
CREATE INDEX IF NOT EXISTS idx_video_recommendations_subject ON video_recommendations(subject);

-- Insert sample data for testing
INSERT INTO chat_sessions (student_id, session_name, subject) VALUES 
('demo-student', 'محادثة تجريبية', 'عام'),
('demo-student', 'دراسة الرياضيات', 'الرياضيات'),
('demo-student', 'مراجعة العلوم', 'العلوم');

-- Sample chat history
INSERT INTO chat_history (student_id, message, response, subject, video_links) VALUES 
('demo-student', 'مرحباً', 'أهلاً وسهلاً! أنا المساعد الذكي لأكاديمية الشرق. كيف يمكنني مساعدتك في دراستك؟', 'عام', '[]'),
('demo-student', 'أريد شرح درس الرياضيات', 'سأقوم بشرح درس الرياضيات لك. يرجى تحديد الدرس أو المفهوم الذي تريد شرحه.', 'الرياضيات', '["https://www.youtube.com/watch?v=math1"]');

-- Sample study analytics
INSERT INTO study_analytics (student_id, subject, questions_asked, topics_covered, study_time_minutes) VALUES 
('demo-student', 'الرياضيات', 5, ARRAY['الجبر', 'الهندسة', 'الإحصاء'], 120),
('demo-student', 'العلوم', 3, ARRAY['الفيزياء', 'الكيمياء'], 90);

-- Sample video recommendations
INSERT INTO video_recommendations (student_id, video_url, video_title, subject) VALUES 
('demo-student', 'https://www.youtube.com/watch?v=math1', 'شرح الجبر للمبتدئين', 'الرياضيات'),
('demo-student', 'https://www.youtube.com/watch?v=science1', 'تجارب كيميائية ممتعة', 'العلوم');

-- Create views for easier querying
CREATE OR REPLACE VIEW student_chat_summary AS
SELECT 
    student_id,
    COUNT(*) as total_messages,
    COUNT(DISTINCT subject) as subjects_covered,
    MAX(created_at) as last_chat_date,
    AVG(response_time_ms) as avg_response_time
FROM chat_history 
GROUP BY student_id;

CREATE OR REPLACE VIEW subject_analytics AS
SELECT 
    subject,
    COUNT(*) as total_questions,
    COUNT(DISTINCT student_id) as unique_students,
    AVG(response_time_ms) as avg_response_time
FROM chat_history 
GROUP BY subject;

-- Create functions for common operations
CREATE OR REPLACE FUNCTION get_student_chat_history(p_student_id VARCHAR)
RETURNS TABLE (
    id UUID,
    message TEXT,
    response TEXT,
    subject VARCHAR,
    created_at TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
    RETURN QUERY
    SELECT ch.id, ch.message, ch.response, ch.subject, ch.created_at
    FROM chat_history ch
    WHERE ch.student_id = p_student_id
    ORDER BY ch.created_at DESC
    LIMIT 50;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION get_subject_statistics(p_subject VARCHAR)
RETURNS TABLE (
    total_questions BIGINT,
    unique_students BIGINT,
    avg_response_time NUMERIC
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        COUNT(*) as total_questions,
        COUNT(DISTINCT student_id) as unique_students,
        AVG(response_time_ms) as avg_response_time
    FROM chat_history 
    WHERE subject = p_subject;
END;
$$ LANGUAGE plpgsql;

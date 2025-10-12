-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create custom types
CREATE TYPE user_role AS ENUM ('student', 'admin');
CREATE TYPE theme_type AS ENUM ('light', 'dark');

-- Create users table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role user_role DEFAULT 'student',
    current_class INTEGER CHECK (current_class >= 9 AND current_class <= 12),
    school_name VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_login TIMESTAMP WITH TIME ZONE,
    is_active BOOLEAN DEFAULT true,
    email_verified BOOLEAN DEFAULT false,
    profile_picture TEXT,
    preferences JSONB DEFAULT '{
        "theme": "light",
        "language": "en",
        "notifications": {
            "email": true,
            "push": true,
            "sms": false
        }
    }'::jsonb,
    login_attempts INTEGER DEFAULT 0,
    locked_until TIMESTAMP WITH TIME ZONE
);

-- Create user_sessions table
CREATE TABLE user_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    refresh_token VARCHAR(500) NOT NULL,
    device_info VARCHAR(255),
    ip_address INET,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    is_active BOOLEAN DEFAULT true
);

-- Create academic_records table
CREATE TABLE academic_records (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    subject VARCHAR(100) NOT NULL,
    marks INTEGER NOT NULL CHECK (marks >= 0),
    max_marks INTEGER NOT NULL CHECK (max_marks > 0),
    exam_type VARCHAR(50) NOT NULL,
    exam_date DATE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create study_sessions table
CREATE TABLE study_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    subject VARCHAR(100) NOT NULL,
    duration_minutes INTEGER NOT NULL CHECK (duration_minutes > 0),
    topics_covered TEXT[] DEFAULT '{}',
    session_date DATE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create predictions table
CREATE TABLE predictions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    subject VARCHAR(100) NOT NULL,
    predicted_score INTEGER NOT NULL CHECK (predicted_score >= 0 AND predicted_score <= 100),
    confidence_level DECIMAL(3,2) CHECK (confidence_level >= 0 AND confidence_level <= 1),
    prediction_date DATE NOT NULL,
    exam_date DATE NOT NULL,
    factors JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create study_recommendations table
CREATE TABLE study_recommendations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    subject VARCHAR(100) NOT NULL,
    topic VARCHAR(200) NOT NULL,
    priority INTEGER CHECK (priority >= 1 AND priority <= 5),
    estimated_time_minutes INTEGER CHECK (estimated_time_minutes > 0),
    difficulty_level VARCHAR(20) CHECK (difficulty_level IN ('easy', 'medium', 'hard')),
    reason TEXT,
    is_completed BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_user_sessions_user_id ON user_sessions(user_id);
CREATE INDEX idx_user_sessions_refresh_token ON user_sessions(refresh_token);
CREATE INDEX idx_user_sessions_active ON user_sessions(is_active);
CREATE INDEX idx_academic_records_user_id ON academic_records(user_id);
CREATE INDEX idx_academic_records_subject ON academic_records(subject);
CREATE INDEX idx_study_sessions_user_id ON study_sessions(user_id);
CREATE INDEX idx_predictions_user_id ON predictions(user_id);
CREATE INDEX idx_study_recommendations_user_id ON study_recommendations(user_id);

-- Disable Row Level Security for now since we're using service role key
-- We'll handle authorization in the application layer
-- ALTER TABLE users ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE user_sessions ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE academic_records ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE study_sessions ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE predictions ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE study_recommendations ENABLE ROW LEVEL SECURITY;

-- Create functions for common operations
CREATE OR REPLACE FUNCTION increment_login_attempts(user_email TEXT)
RETURNS INTEGER AS $$
DECLARE
    attempts INTEGER;
BEGIN
    UPDATE users 
    SET login_attempts = login_attempts + 1,
        locked_until = CASE 
            WHEN login_attempts + 1 >= 5 THEN NOW() + INTERVAL '15 minutes'
            ELSE locked_until
        END
    WHERE email = user_email
    RETURNING login_attempts INTO attempts;
    
    RETURN COALESCE(attempts, 0);
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION reset_login_attempts(user_email TEXT)
RETURNS VOID AS $$
BEGIN
    UPDATE users 
    SET login_attempts = 0,
        locked_until = NULL,
        last_login = NOW()
    WHERE email = user_email;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION is_account_locked(user_email TEXT)
RETURNS BOOLEAN AS $$
DECLARE
    locked_until_time TIMESTAMP WITH TIME ZONE;
BEGIN
    SELECT locked_until INTO locked_until_time
    FROM users
    WHERE email = user_email;
    
    IF locked_until_time IS NULL THEN
        RETURN FALSE;
    END IF;
    
    IF locked_until_time > NOW() THEN
        RETURN TRUE;
    ELSE
        -- Auto-unlock if time has passed
        UPDATE users 
        SET locked_until = NULL, login_attempts = 0
        WHERE email = user_email;
        RETURN FALSE;
    END IF;
END;
$$ LANGUAGE plpgsql;

-- Create a function to clean up expired sessions
CREATE OR REPLACE FUNCTION cleanup_expired_sessions()
RETURNS INTEGER AS $$
DECLARE
    deleted_count INTEGER;
BEGIN
    DELETE FROM user_sessions 
    WHERE expires_at < NOW() OR is_active = false;
    
    GET DIAGNOSTICS deleted_count = ROW_COUNT;
    RETURN deleted_count;
END;
$$ LANGUAGE plpgsql;

-- Insert a test user (password is 'password' hashed with bcrypt)
INSERT INTO users (email, name, password_hash, role, current_class, school_name, email_verified) VALUES
('test@example.com', 'Test User', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/hGx9S8jyG', 'student', 12, 'Test School', true);

-- Create a scheduled job to clean up expired sessions (if pg_cron is available)
-- SELECT cron.schedule('cleanup-sessions', '0 2 * * *', 'SELECT cleanup_expired_sessions();');
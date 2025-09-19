-- StudyAI Database Initialization Script

-- Create database if it doesn't exist
SELECT 'CREATE DATABASE studyai_prod'
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'studyai_prod')\gexec

-- Connect to the database
\c studyai_prod;

-- Create extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_stat_statements";

-- Create basic indexes for performance
-- These will be created by SQLAlchemy migrations, but we ensure they exist

-- Grant permissions
GRANT ALL PRIVILEGES ON DATABASE studyai_prod TO studyai;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO studyai;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO studyai;

-- Set default privileges for future tables
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO studyai;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO studyai;
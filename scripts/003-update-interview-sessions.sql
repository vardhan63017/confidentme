-- Add lip_movement_score column to interview_sessions if it doesn't exist
ALTER TABLE public.interview_sessions 
ADD COLUMN IF NOT EXISTS lip_movement_score INTEGER DEFAULT 0;

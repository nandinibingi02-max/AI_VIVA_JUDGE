CREATE TABLE viva_evaluations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL UNIQUE REFERENCES projects(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  initial_assessment JSONB NOT NULL,
  challenge JSONB NOT NULL,
  student_answer TEXT,
  final_assessment JSONB,
  status TEXT NOT NULL DEFAULT 'awaiting_answer' CHECK (status IN ('awaiting_answer', 'completed')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX viva_evaluations_user_id_idx ON viva_evaluations (user_id);

CREATE TRIGGER viva_evaluations_set_updated_at
BEFORE UPDATE ON viva_evaluations
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

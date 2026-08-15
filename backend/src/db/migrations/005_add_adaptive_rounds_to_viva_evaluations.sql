ALTER TABLE viva_evaluations
  ADD COLUMN rounds JSONB NOT NULL DEFAULT '[]'::jsonb,
  ADD COLUMN current_question SMALLINT NOT NULL DEFAULT 1 CHECK (current_question BETWEEN 1 AND 5);

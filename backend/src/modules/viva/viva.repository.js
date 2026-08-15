import { query } from '../../db/pool.js';

const projectFields = 'id, user_id, project_name, subject, project_description, project_file_name, project_file_type, project_file_path, created_at, updated_at';

export async function createProject({ userId, title, subject, description, file }) {
  const result = await query(
    `INSERT INTO projects (user_id, project_name, subject, project_description, project_file_name, project_file_type, project_file_path)
     VALUES ($1, $2, $3, $4, $5, $6, $7)
     RETURNING ${projectFields}`,
    [userId, title, subject, description, file?.name ?? null, file?.type ?? null, file?.path ?? null],
  );
  return result.rows[0];
}

export async function createEvaluation({ projectId, userId, initialAssessment, challenge }) {
  const result = await query(
    `INSERT INTO viva_evaluations (project_id, user_id, initial_assessment, challenge, rounds)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING id, project_id, initial_assessment, challenge, rounds, current_question, status, created_at`,
    [projectId, userId, initialAssessment, challenge, JSON.stringify([{ questionNumber: 1, challenge }])],
  );
  return result.rows[0];
}

export const deleteProjectForUser = (projectId, userId) => query('DELETE FROM projects WHERE id = $1 AND user_id = $2', [projectId, userId]);

export async function findEvaluationForUser(projectId, userId) {
  const result = await query(
    `SELECT e.id, e.project_id, e.initial_assessment, e.challenge, e.rounds, e.current_question, e.student_answer, e.final_assessment, e.status,
            p.project_name, p.subject, p.project_description
     FROM viva_evaluations e
     JOIN projects p ON p.id = e.project_id
     WHERE e.project_id = $1 AND e.user_id = $2`,
    [projectId, userId],
  );
  return result.rows[0] ?? null;
}

export async function updateEvaluationRounds({ projectId, userId, expectedQuestion, rounds, nextQuestion, answer, finalAssessment }) {
  const result = await query(
    `UPDATE viva_evaluations
     SET rounds = $4::jsonb, current_question = $5, student_answer = $6, final_assessment = $7::jsonb,
         status = CASE WHEN $7::jsonb IS NULL THEN 'awaiting_answer' ELSE 'completed' END
     WHERE project_id = $1 AND user_id = $2 AND status = 'awaiting_answer' AND current_question = $3
     RETURNING id, project_id, rounds, current_question, final_assessment, status`,
    [projectId, userId, expectedQuestion, JSON.stringify(rounds), nextQuestion, answer, finalAssessment ? JSON.stringify(finalAssessment) : null],
  );
  return result.rows[0] ?? null;
}

export async function findCompletedEvaluationForUser(projectId, userId) {
  const result = await query(
    `SELECT e.project_id, e.initial_assessment, e.challenge, e.rounds, e.current_question, e.student_answer, e.final_assessment, e.status,
            p.project_name, p.subject
     FROM viva_evaluations e
     JOIN projects p ON p.id = e.project_id
     WHERE e.project_id = $1 AND e.user_id = $2`,
    [projectId, userId],
  );
  return result.rows[0] ?? null;
}

export async function listEvaluationsForUser(userId) {
  const result = await query(
    `SELECT e.project_id AS id, p.project_name AS title, p.subject, e.status, e.final_assessment, e.created_at
     FROM viva_evaluations e
     JOIN projects p ON p.id = e.project_id
     WHERE e.user_id = $1
     ORDER BY e.created_at DESC`,
    [userId],
  );
  return result.rows;
}

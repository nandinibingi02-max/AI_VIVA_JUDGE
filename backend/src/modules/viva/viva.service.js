import { mkdir, unlink, writeFile } from 'node:fs/promises';
import { randomUUID } from 'node:crypto';
import { dirname, extname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { fileTooLarge, validationError } from '../../utils/errors.js';
import * as repository from './viva.repository.js';
import { createChallenge } from './challenger.agent.js';
import { createInitialAssessment, createReassessment } from './decision.agent.js';

const MAX_FILE_SIZE = 10 * 1024 * 1024;
const allowedExtensions = new Set(['.pdf', '.ppt', '.pptx']);
const uploadsDirectory = join(dirname(fileURLToPath(import.meta.url)), '../../../uploads/projects');

const validateFile = (file) => {
  const extension = extname(file.filename ?? '').toLowerCase();
  if (!allowedExtensions.has(extension)) throw validationError({ projectFile: ['Only PDF, PPT, and PPTX files are allowed.'] });
  return extension;
};

export async function startViva(userId, input, upload) {
  let storedFile;
  let absolutePath;
  let project;
  if (upload) {
    const extension = validateFile(upload);
    let buffer;
    try { buffer = await upload.toBuffer(); }
    catch (error) { if (error.code === 'FST_REQ_FILE_TOO_LARGE') throw fileTooLarge(); throw error; }
    if (upload.file.truncated || buffer.length > MAX_FILE_SIZE) throw fileTooLarge();
    const filename = `${randomUUID()}${extension}`;
    const relativePath = `uploads/projects/${filename}`;
    absolutePath = join(uploadsDirectory, filename);
    await mkdir(uploadsDirectory, { recursive: true });
    await writeFile(absolutePath, buffer, { flag: 'wx' });
    storedFile = { name: upload.filename, type: upload.mimetype, path: relativePath };
  }
  try {
    project = await repository.createProject({ userId, ...input, file: storedFile });
    const initialAssessment = await createInitialAssessment(project);
    const challenge = await createChallenge({ project, assessment: initialAssessment, rounds: [], questionNumber: 1 });
    const evaluation = await repository.createEvaluation({ projectId: project.id, userId, initialAssessment, challenge });
    return { project, evaluation };
  }
  catch (error) {
    if (project) await repository.deleteProjectForUser(project.id, userId).catch(() => {});
    if (absolutePath) await unlink(absolutePath).catch(() => {});
    throw error;
  }
}

export async function answerChallenge(userId, projectId, answer) {
  const evaluation = await repository.findEvaluationForUser(projectId, userId);
  if (!evaluation || evaluation.status !== 'awaiting_answer') throw validationError({ projectId: ['No pending viva challenge was found.'] });
  const project = { project_name: evaluation.project_name, subject: evaluation.subject, project_description: evaluation.project_description };
  const currentQuestion = evaluation.current_question;
  const answeredRounds = evaluation.rounds.map((round) => round.questionNumber === currentQuestion ? { ...round, studentAnswer: answer } : round);
  const assessment = await createReassessment({ project, initialAssessment: evaluation.initial_assessment, rounds: answeredRounds, isFinal: currentQuestion === 5 });
  let nextRounds = answeredRounds;
  let nextChallenge = null;
  if (currentQuestion < 5) {
    nextChallenge = await createChallenge({ project, assessment, rounds: answeredRounds, questionNumber: currentQuestion + 1 });
    nextRounds = [...answeredRounds, { questionNumber: currentQuestion + 1, challenge: nextChallenge }];
  }
  nextRounds = nextRounds.map((round) => round.questionNumber === currentQuestion ? { ...round, assessmentAfter: assessment } : round);
  const updated = await repository.updateEvaluationRounds({ projectId, userId, expectedQuestion: currentQuestion, rounds: nextRounds, nextQuestion: currentQuestion < 5 ? currentQuestion + 1 : 5, answer, finalAssessment: currentQuestion === 5 ? assessment : null });
  if (!updated) throw validationError({ projectId: ['This viva answer was already submitted.'] });
  return { ...updated, latestAssessment: assessment, challenge: nextChallenge };
}

export async function getResults(userId, projectId) {
  const evaluation = await repository.findCompletedEvaluationForUser(projectId, userId);
  if (!evaluation) throw validationError({ projectId: ['Viva results were not found.'] });
  return evaluation;
}

export const getHistory = async (userId) => repository.listEvaluationsForUser(userId);

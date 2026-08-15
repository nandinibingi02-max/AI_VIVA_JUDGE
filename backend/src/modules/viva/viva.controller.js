import { fileTooLarge, validationError } from '../../utils/errors.js';
import { answerVivaSchema, startVivaSchema } from './viva.schema.js';
import * as service from './viva.service.js';

const fieldValue = (field) => (typeof field?.value === 'string' ? field.value : undefined);
const parseInput = (input) => {
  const parsed = startVivaSchema.safeParse(input);
  if (!parsed.success) throw validationError(parsed.error.flatten().fieldErrors);
  return parsed.data;
};

export async function start(request, reply) {
  let input;
  let upload;
  try {
    if (request.isMultipart()) {
      upload = await request.file();
      const fields = upload?.fields ?? {};
      input = parseInput({ title: fieldValue(fields.title), subject: fieldValue(fields.subject), description: fieldValue(fields.description) });
    } else input = parseInput(request.body);
  } catch (error) {
    if (error.code === 'FST_REQ_FILE_TOO_LARGE') throw fileTooLarge();
    throw error;
  }
  const { project, evaluation } = await service.startViva(request.user.sub, input, upload);
  return reply.code(201).send({ id: project.id, project, initialAssessment: evaluation.initial_assessment, challenge: evaluation.challenge, currentQuestion: evaluation.current_question, totalQuestions: 5, status: evaluation.status });
}

export async function answer(request, reply) {
  const parsed = answerVivaSchema.safeParse(request.body);
  if (!parsed.success) throw validationError(parsed.error.flatten().fieldErrors);
  const evaluation = await service.answerChallenge(request.user.sub, request.params.projectId, parsed.data.answer);
  return reply.send({ id: evaluation.project_id, finalAssessment: evaluation.final_assessment, latestAssessment: evaluation.latestAssessment, challenge: evaluation.challenge, currentQuestion: evaluation.current_question, totalQuestions: 5, status: evaluation.status });
}

export async function results(request, reply) {
  const evaluation = await service.getResults(request.user.sub, request.params.projectId);
  const currentRound = evaluation.rounds.find((round) => round.questionNumber === evaluation.current_question);
  if (evaluation.status !== 'completed') return reply.send({ id: evaluation.project_id, status: evaluation.status, initialAssessment: evaluation.initial_assessment, challenge: currentRound?.challenge, currentQuestion: evaluation.current_question, totalQuestions: 5 });
  return reply.send({ id: evaluation.project_id, title: evaluation.project_name, subject: evaluation.subject, status: evaluation.status, rounds: evaluation.rounds, initialAssessment: evaluation.initial_assessment, finalAssessment: evaluation.final_assessment, totalQuestions: 5 });
}

export const history = async (request, reply) => reply.send({ sessions: await service.getHistory(request.user.sub) });

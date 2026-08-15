import { challengerChallengeSchema } from './viva.schema.js';
import { requestStructuredCompletion } from './groq.js';

const system = `You are Challenger AI. You only challenge the Decision AI's current assessment; you never score the student. Identify its weakest or least-supported part and create one project-specific viva question about implementation or technical decisions. Avoid generic questions. Return JSON only with exactly: challengeQuestion, whyThisMatters, evidenceTesting, severity. severity is low, medium, or high.`;

const focusAreas = ['project understanding', 'architecture and implementation', 'technical decisions and trade-offs', 'edge cases and limitations', 'deep implementation understanding'];

export const createChallenge = ({ project, assessment, rounds, questionNumber }) => requestStructuredCompletion({ system, validator: challengerChallengeSchema, user: `Project context:\n${JSON.stringify({ projectName: project.project_name, subject: project.subject, projectDescription: project.project_description })}\nLatest Decision AI assessment:\n${JSON.stringify(assessment)}\nPrevious questions and answers:\n${JSON.stringify(rounds)}\nGenerate question ${questionNumber} of 5. Its primary focus is ${focusAreas[questionNumber - 1]}. Target the weakest or least-supported part of the latest assessment, incorporate the student's previous answer when available, and do not repeat prior questions.` });

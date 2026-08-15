import { decisionAssessmentSchema } from './viva.schema.js';
import { requestStructuredCompletion } from './groq.js';

const system = `You are Decision AI, the final evaluator in a project viva. Assess only evidence supplied in the project context and student answer. Be fair and specific; do not invent implementation details. Scores are integers 0 through 100. Return JSON only with exactly: understandingScore, confidence, strengths, weaknesses, reasoningEvidence, improvementSuggestions. The final assessment may increase or decrease any score when the student's answer adds evidence.`;
const projectContext = (project) => JSON.stringify({ projectName: project.project_name, subject: project.subject, projectDescription: project.project_description });

export const createInitialAssessment = (project) => requestStructuredCompletion({ system, validator: decisionAssessmentSchema, user: `Project context:\n${projectContext(project)}\nMake the initial assessment before any oral answer is given.` });
export const createReassessment = ({ project, initialAssessment, rounds, isFinal }) => requestStructuredCompletion({ system, validator: decisionAssessmentSchema, user: `Project context:\n${projectContext(project)}\nInitial assessment:\n${JSON.stringify(initialAssessment)}\nQuestion and answer history:\n${JSON.stringify(rounds)}\nRe-evaluate using the latest student answer as new evidence. Scores may increase or decrease.${isFinal ? ' This is question 5 of 5; produce the final assessment.' : ' This is an intermediate assessment; identify the next weakness for Challenger AI.'}` });

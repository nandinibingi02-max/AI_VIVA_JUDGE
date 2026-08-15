import { z } from 'zod';

export const startVivaSchema = z.object({
  title: z.string().min(1),
  subject: z.string().min(1),
  description: z.string().default(''),
});

export const answerVivaSchema = z.object({
  answer: z.string().trim().min(1).max(10000),
});

const textList = z.array(z.string().trim().min(1)).max(8);
export const decisionAssessmentSchema = z.object({
  understandingScore: z.number().int().min(0).max(100),
  confidence: z.number().int().min(0).max(100),
  strengths: textList,
  weaknesses: textList,
  reasoningEvidence: textList,
  improvementSuggestions: textList,
});

export const challengerChallengeSchema = z.object({
  challengeQuestion: z.string().trim().min(1).max(2000),
  whyThisMatters: z.string().trim().min(1).max(2000),
  evidenceTesting: z.string().trim().min(1).max(2000),
  severity: z.enum(['low', 'medium', 'high']),
});

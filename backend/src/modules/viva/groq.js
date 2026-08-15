import { env } from '../../config/env.js';
import { aiServiceUnavailable } from '../../utils/errors.js';

const endpoint = 'https://api.groq.com/openai/v1/chat/completions';
const model = 'llama-3.3-70b-versatile';

export async function requestStructuredCompletion({ system, user, validator }) {
  if (!env.groqApiKey) throw aiServiceUnavailable();
  let response;
  try {
    response = await fetch(endpoint, {
      method: 'POST',
      headers: { Authorization: `Bearer ${env.groqApiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model,
        temperature: 0.2,
        messages: [{ role: 'system', content: system }, { role: 'user', content: user }],
        response_format: { type: 'json_object' },
      }),
    });
  } catch { throw aiServiceUnavailable(); }
  if (!response.ok) throw aiServiceUnavailable();
  const payload = await response.json().catch(() => null);
  const content = payload?.choices?.[0]?.message?.content;
  if (typeof content !== 'string') throw aiServiceUnavailable();
  let parsed;
  try { parsed = JSON.parse(content); } catch { throw aiServiceUnavailable(); }
  const validated = validator.safeParse(parsed);
  if (!validated.success) throw aiServiceUnavailable();
  return validated.data;
}

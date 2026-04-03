import { OPENROUTER_API_KEY } from '@env';
import * as FileSystem from 'expo-file-system';

const OPENROUTER_URL = 'https://openrouter.ai/api/v1/chat/completions';
const MODEL = 'google/gemini-2.0-flash-001';

const SYSTEM_PROMPT = `You are an expert math tutor and problem solver with deep knowledge across all areas of mathematics including:
- Arithmetic & Number Theory
- Algebra (linear, quadratic, polynomial, systems of equations)
- Geometry & Trigonometry
- Calculus (derivatives, integrals, limits)
- Statistics & Probability
- Linear Algebra
- Discrete Mathematics

When given an image of a math problem, you must:
1. Identify and clearly state the problem from the image
2. Provide the correct final answer
3. Give a thorough step-by-step breakdown of how the answer was obtained, explaining each step in plain language

Always respond in the following strict JSON format:
{
  "problem": "The math problem identified from the image (restate it clearly)",
  "answer": "The final answer only",
  "topic": "The math topic/category (e.g. Algebra, Calculus, etc.)",
  "difficulty": "Easy | Medium | Hard",
  "steps": [
    {
      "step": 1,
      "title": "Short title for this step",
      "explanation": "Detailed explanation of what is being done and why",
      "expression": "The mathematical expression or equation at this step (optional)"
    }
  ],
  "tip": "A helpful tip or concept the student should remember related to this problem"
}`;

export async function analyzeMathImage(imageUri) {
  // Convert local image URI to base64
  const base64 = await FileSystem.readAsStringAsync(imageUri, {
    encoding: FileSystem.EncodingType.Base64,
  });

  const mimeType = imageUri.toLowerCase().endsWith('.png') ? 'image/png' : 'image/jpeg';

  const response = await fetch(OPENROUTER_URL, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': 'https://mathhelper.app',
      'X-Title': 'Math Homework Helper',
    },
    body: JSON.stringify({
      model: MODEL,
      messages: [
        {
          role: 'system',
          content: SYSTEM_PROMPT,
        },
        {
          role: 'user',
          content: [
            {
              type: 'image_url',
              image_url: {
                url: `data:${mimeType};base64,${base64}`,
              },
            },
            {
              type: 'text',
              text: 'Please analyze this math problem from the image and provide the answer with a full step-by-step breakdown. Respond only with valid JSON.',
            },
          ],
        },
      ],
      temperature: 0.1,
      max_tokens: 2048,
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`OpenRouter error ${response.status}: ${err}`);
  }

  const data = await response.json();
  const content = data.choices?.[0]?.message?.content;

  if (!content) throw new Error('No response from AI');

  // Strip markdown code fences if present
  const cleaned = content.replace(/^```json\s*/i, '').replace(/```\s*$/i, '').trim();

  try {
    return JSON.parse(cleaned);
  } catch {
    throw new Error('Could not parse AI response. Please try again.');
  }
}

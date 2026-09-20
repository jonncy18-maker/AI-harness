import Anthropic from '@anthropic-ai/sdk';
import OpenAI from 'openai';
import { GoogleGenAI } from '@google/genai';

// Server-only. Each entry: env var to check + a run(model, prompt) call.
// The browser never sees a key — app/api/generate/route.js is the only caller.
export const PROVIDERS = {
  anthropic: {
    label: 'Anthropic',
    defaultModel: 'claude-sonnet-5',
    envVar: 'ANTHROPIC_API_KEY',
    async run(model, prompt) {
      const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
      const res = await client.messages.create({
        model,
        max_tokens: 1024,
        messages: [{ role: 'user', content: prompt }],
      });
      return res.content.map((block) => block.text ?? '').join('');
    },
  },
  openai: {
    label: 'OpenAI',
    defaultModel: 'gpt-5.1',
    envVar: 'OPENAI_API_KEY',
    async run(model, prompt) {
      const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
      const res = await client.responses.create({ model, input: prompt });
      return res.output_text ?? '';
    },
  },
  google: {
    label: 'Google',
    defaultModel: 'gemini-3-pro',
    envVar: 'GOOGLE_API_KEY',
    async run(model, prompt) {
      const client = new GoogleGenAI({ apiKey: process.env.GOOGLE_API_KEY });
      const res = await client.models.generateContent({
        model,
        contents: prompt,
      });
      return res.text ?? '';
    },
  },
};

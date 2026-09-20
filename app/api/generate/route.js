import { PROVIDERS } from '../../../lib/providers';

export async function POST(req) {
  const { provider, model, prompt } = await req.json();

  const entry = PROVIDERS[provider];
  if (!entry) {
    return Response.json({ error: `Unknown provider: ${provider}` }, { status: 400 });
  }
  if (!prompt) {
    return Response.json({ error: 'prompt is required' }, { status: 400 });
  }
  if (!process.env[entry.envVar]) {
    return Response.json(
      { error: `${entry.envVar} is not set on the server` },
      { status: 400 },
    );
  }

  try {
    const text = await entry.run(model || entry.defaultModel, prompt);
    return Response.json({ text });
  } catch (err) {
    return Response.json({ error: err.message ?? 'Generation failed' }, { status: 500 });
  }
}

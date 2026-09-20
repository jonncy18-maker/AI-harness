'use client';

import { useState } from 'react';

const PROVIDERS = [
  { id: 'anthropic', label: 'Anthropic', defaultModel: 'claude-sonnet-5' },
  { id: 'openai', label: 'OpenAI', defaultModel: 'gpt-5.1' },
  { id: 'google', label: 'Google', defaultModel: 'gemini-3-pro' },
];

export default function Home() {
  const [provider, setProvider] = useState(PROVIDERS[0].id);
  const [model, setModel] = useState(PROVIDERS[0].defaultModel);
  const [prompt, setPrompt] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  function onProviderChange(id) {
    setProvider(id);
    setModel(PROVIDERS.find((p) => p.id === id).defaultModel);
  }

  async function onSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError('');
    setOutput('');
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ provider, model, prompt }),
      });
      const body = await res.json();
      if (!res.ok) {
        setError(body.error || 'Request failed');
      } else {
        setOutput(body.text);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main>
      <h1>AI Harness</h1>
      <form onSubmit={onSubmit}>
        <div className="row">
          <select
            value={provider}
            onChange={(e) => onProviderChange(e.target.value)}
          >
            {PROVIDERS.map((p) => (
              <option key={p.id} value={p.id}>
                {p.label}
              </option>
            ))}
          </select>
          <input
            type="text"
            value={model}
            onChange={(e) => setModel(e.target.value)}
          />
          <button type="submit" disabled={loading || !prompt}>
            {loading ? 'Running…' : 'Run'}
          </button>
        </div>
        <p />
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Prompt"
        />
      </form>
      {error && <p className="error">{error}</p>}
      {output && <div className="output">{output}</div>}
    </main>
  );
}

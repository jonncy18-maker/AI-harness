# Roadmap / Session Log

Dated history and session-by-session notes live here, not in `CLAUDE.md`. `CLAUDE.md` stays a living reference; this file is the narrative.

---

## Next Up

Finish the `/grill-me` scoping session below (phasing, vision input, tool safety-gate design, code execution sandboxing, web search approach are still open), then start Build against whatever gets resolved.

---

## Open / Tracked To-Dos

- [ ] **Finish the grill-me scoping session** — see 2026-09-20 entry below. Paused mid-interview to write this file; several branches still unresolved (listed there).
- [ ] **Revisit CLAUDE.md's "no database yet" stance** — resolved during this session: it needs one (Neon, following the Personal-Dashboard pattern) once conversation persistence is scoped for real.
- [ ] **Design the tool-calling safety gate** — his other repos (Personal-Dashboard, NextGen-Scholars, AI-Capital-Planning) all pair tool-calling with a read-executes-immediately / write-pauses-for-confirmation split and an iteration cap. Not yet designed for AI-harness.

---

## 2026-09-20 — Initial scoping session (`/grill-me`, in progress)

Kicked off by a cross-repo survey (Personal-Dashboard, Agentic-Loop, NextGen-Immersion, NextGen-Scholars, AI-Capital-Planning) to ground the interview in John's actual AI usage patterns rather than generic chatbot features. Key survey findings: his existing AI usage is almost entirely one-shot structured extraction (not chat); model-per-tier routing (Haiku/Sonnet/Opus by task) is a settled convention across 3 repos; agentic tool-calling with an allowlisted catalog + write-confirmation gate + iteration cap is a recurring pattern in 3 repos; `claude-sonnet-5` has production-bitten gotchas (rejects `temperature`, extended thinking on by default eating token budget); max_tokens/truncation handling has caused real incidents more than once.

**Decided so far:**

1. **Purpose:** primarily a learning project. John wants a harness where he can pick whichever LLM family is best suited per task, starting with the top 3 providers (Anthropic, OpenAI, Google), open to more later.
2. **Interface shape:** conversational, multi-turn — "similar to the Claude environment," not the one-shot extraction pattern his other repos use.
3. **Persistence:** conversation history must persist across sessions/devices. This reverses CLAUDE.md's current "no database yet" stance — a Neon project (mirroring Personal-Dashboard's pattern) is now in scope.
4. **Model switching:** switchable mid-conversation. The full thread history is replayed to whichever model is currently active — meaning messages need to be stored in a provider-agnostic format and translated into each provider's own message schema at send time.
5. **Context/compaction:** model context-window size (including opt-in extended modes, e.g. Sonnet's 1M-token beta) is tracked as per-model metadata. John wants **auto-compaction** as a thread approaches a model's limit, **plus a manual "compact now" trigger** — modeled after how Claude Code itself handles context (usage indicator, opt-in extended context, auto-summarization near the limit were discussed as the three distinct pieces; John wants the full auto-compaction behavior, not just the indicator or the toggle).
6. **Tool-calling:** in scope for v1, not deferred. Scope discussed: web search, URL fetching, code execution, and hitting his other apps' APIs (inspired by "pull all the tools that my apps have").
7. **MCP vs. reimplementation:** Personal-Dashboard already exposes its tool catalog as an MCP server (`/api/mcp/app`) that any MCP client (including this Claude Code session) can already call. John chose to **reimplement** tools natively in AI-harness rather than have it act as an MCP client against existing servers — consistent with the "learning project" goal (building the tool-calling mechanics himself, not just wiring up an existing protocol).

**Still open (interview paused here to write this file):**

- Whether v1 ships all of the above (chat + persistence + model switching + auto-compaction + full tool-calling) or gets phased — flagged as a real scope concern, not yet answered.
- Vision/image input — not yet discussed this session (the cross-repo survey found it used twice elsewhere: French-hours screenshot import, NextGen video/document analysis).
- Exact tool list for v1 and the write-confirmation gate design (read executes immediately, write pauses for confirmation, per the pattern in his other repos) — "pull all the tools that my apps have" plus web search/URL fetch/code execution was floated but not scoped into concrete tool definitions.
- Code execution sandboxing approach (native provider code-execution tools vs. something self-hosted).
- Web search: each provider's own native hosted search tool (behavior differs per provider) vs. one shared custom implementation used uniformly across all three.
- Cost/token usage tracking and display — not yet discussed.
- Pinned model ID vs. resolve-by-family tension (some repos pin exact IDs deliberately; AI-Capital-Planning resolves by family server-side) — not yet resolved for AI-harness's model registry.

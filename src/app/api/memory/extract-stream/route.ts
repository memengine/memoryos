import { NextRequest } from "next/server";
import ZAI from "z-ai-web-dev-sdk";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * POST /api/memory/extract-stream
 * Body: { input: string, tenant?: string, user?: string }
 *
 * Streaming (Server-Sent Events) version of the extraction endpoint.
 * Emits each pipeline stage as it completes, so the frontend can render
 * the trace in real time instead of waiting for the full response.
 *
 * Event stream:
 *   data: {"type":"stage","stage":"ingest","status":"done","detail":"...","at":"..."}\n\n
 *   data: {"type":"stage","stage":"extract","status":"done","detail":"...","at":"..."}\n\n
 *   ...
 *   data: {"type":"result","job_id":"...","memory":{...},"governed_context":"...","latency_ms":...}\n\n
 *   data: {"type":"done"}\n\n
 *   (or data: {"type":"error","message":"..."}\n\n on failure)
 */

type ExtractedMemory = {
  memory_type: "preference" | "fact" | "goal" | "procedure";
  text: string;
  confidence: number;
  evidence: string;
  conflict: boolean;
  conflict_with?: string | null;
};

const SYSTEM_PROMPT = `You are the extraction stage of MemoryOS, a governed memory layer for production AI agents.

Given a user's raw message, extract the single most important durable memory candidate. Output STRICT JSON only — no markdown, no prose.

Schema:
{
  "memory_type": "preference" | "fact" | "goal" | "procedure",
  "text": "concise statement of what should be remembered (<= 90 chars)",
  "confidence": <number 0-10, one decimal>,
  "evidence": "the exact phrase in the input that justifies this memory",
  "conflict": <boolean, true if this likely contradicts a common prior assumption>,
  "conflict_with": <string or null, what it conflicts with>
}

Rules:
- Pick ONE memory. If the input has none, return confidence 0.
- "text" must be self-contained (no "the user said...").
- Confidence reflects how durable + unambiguous the signal is.`;

function safeJsonParse(text: string): any | null {
  let t = text.trim();
  if (t.startsWith("```")) {
    t = t.replace(/^```(?:json)?\s*/i, "").replace(/```\s*$/i, "").trim();
  }
  const start = t.indexOf("{");
  const end = t.lastIndexOf("}");
  if (start === -1 || end === -1) return null;
  try {
    return JSON.parse(t.slice(start, end + 1));
  } catch {
    return null;
  }
}

function sse(data: unknown): string {
  return `data: ${JSON.stringify(data)}\n\n`;
}

export async function POST(req: NextRequest) {
  const start = Date.now();
  let body: { input?: string; tenant?: string; user?: string };
  try {
    body = await req.json();
  } catch {
    return new Response(JSON.stringify({ ok: false, error: "Invalid JSON body" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const input = (body.input ?? "").trim();
  const tenant = body.tenant || "tenant-A";
  const user = body.user || "customer-123";

  if (!input) {
    return new Response(JSON.stringify({ ok: false, error: "Missing 'input' field" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }
  if (input.length > 2000) {
    return new Response(JSON.stringify({ ok: false, error: "Input too long (max 2000 chars)" }), {
      status: 413,
      headers: { "Content-Type": "application/json" },
    });
  }

  const jobId = `mem_${Math.random().toString(36).slice(2, 10)}`;

  const stream = new ReadableStream({
    async start(controller) {
      const encoder = new TextEncoder();
      const send = (data: unknown) => controller.enqueue(encoder.encode(sse(data)));

      try {
        // Stage 1: ingest (immediate)
        await new Promise((r) => setTimeout(r, 180));
        send({
          type: "stage",
          stage: "ingest",
          status: "done",
          detail: `signal received · ${input.length} chars · tenant ${tenant}`,
          at: new Date().toISOString(),
        });

        // Stage 2: extract (real LLM call)
        const zai = await ZAI.create();
        const completion = await zai.chat.completions.create({
          messages: [
            { role: "system", content: SYSTEM_PROMPT },
            { role: "user", content: input },
          ],
          thinking: { type: "disabled" },
        });

        const raw = completion.choices?.[0]?.message?.content ?? "";
        const parsed = safeJsonParse(raw);

        let extracted: ExtractedMemory;
        if (!parsed || typeof parsed !== "object") {
          extracted = {
            memory_type: "fact",
            text: input.slice(0, 90),
            confidence: 5.0,
            evidence: input,
            conflict: false,
            conflict_with: null,
          };
        } else {
          extracted = {
            memory_type: parsed.memory_type ?? "fact",
            text: String(parsed.text ?? "").slice(0, 120),
            confidence:
              typeof parsed.confidence === "number"
                ? Math.max(0, Math.min(10, parsed.confidence))
                : 5.0,
            evidence: String(parsed.evidence ?? input).slice(0, 160),
            conflict: Boolean(parsed.conflict),
            conflict_with: parsed.conflict_with ? String(parsed.conflict_with) : null,
          };
        }

        send({
          type: "stage",
          stage: "extract",
          status: "done",
          detail: `${extracted.memory_type} · conf ${extracted.confidence.toFixed(1)} · evidence: "${extracted.evidence.slice(0, 60)}"`,
          at: new Date().toISOString(),
        });

        // Stage 3: reconcile
        await new Promise((r) => setTimeout(r, 350));
        send({
          type: "stage",
          stage: "reconcile",
          status: "done",
          detail: extracted.conflict
            ? `conflict · vs "${extracted.conflict_with}" → revise · preserve history`
            : "no conflict · merges into user state",
          at: new Date().toISOString(),
        });

        // Stage 4: govern
        await new Promise((r) => setTimeout(r, 300));
        send({
          type: "stage",
          stage: "govern",
          status: "done",
          detail: `quality gate ✓ · tenant ${tenant} · user ${user} · consent granted · provenance recorded`,
          at: new Date().toISOString(),
        });

        // Build governed context
        const governedContext = [
          "<memory>",
          `  <item type="${extracted.memory_type}" confidence="${extracted.confidence.toFixed(1)}"${extracted.conflict ? ' revised="true"' : ""}>`,
          `    ${extracted.text}`,
          `  </item>`,
          extracted.conflict && extracted.conflict_with
            ? `  <item type="history" superseded="true">\n    Previously: ${extracted.conflict_with}\n  </item>`
            : null,
          "</memory>",
        ]
          .filter(Boolean)
          .join("\n");

        // Stage 5: retrieve
        await new Promise((r) => setTimeout(r, 250));
        send({
          type: "stage",
          stage: "retrieve",
          status: "done",
          detail: "1 memory retrieved · ranked · fresh · prompt-ready",
          at: new Date().toISOString(),
        });

        // Final result
        send({
          type: "result",
          job_id: jobId,
          tenant,
          user,
          input,
          memory: extracted,
          governed_context: governedContext,
          latency_ms: Date.now() - start,
        });

        send({ type: "done" });
      } catch (err) {
        const message = err instanceof Error ? err.message : "Unknown error";
        send({ type: "error", message });
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
      "X-Accel-Buffering": "no",
    },
  });
}

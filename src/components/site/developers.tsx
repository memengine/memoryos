"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Copy, Check, Terminal, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SectionLabel, SectionHeading } from "./problem";

type Lang = "python" | "typescript" | "rest" | "mcp";

const TABS: { id: Lang; label: string; sub: string }[] = [
  { id: "python", label: "Python", sub: "pip install memoryo-sdk" },
  { id: "typescript", label: "TypeScript", sub: "npm i @memoryos/sdk" },
  { id: "rest", label: "REST API", sub: "stateless HTTP" },
  { id: "mcp", label: "MCP Server", sub: "tools for MCP agents" },
];

const CODE: Record<Lang, { install?: string; code: string }> = {
  python: {
    install: "$ pip install memoryo-sdk",
    code: `import os
from memoryos import Memory

client = Memory(api_key=os.environ["MEMORYOS_API_KEY"])

# Ingest a conversation signal
write = client.add(
    messages=[{"role": "user", "content": "I prefer concise answers."}],
    external_user_id="customer-123",
)
if write.job_id:
    client.wait_for_job(write.job_id)

# Retrieve governed context before the next model call
result = client.get(
    query="How should I answer this user?",
    external_user_id="customer-123",
)

prompt_addition = result.system_prompt_addition if result.has_context else ""`,
  },
  typescript: {
    install: "$ npm i @memoryos/sdk",
    code: `import { Memory } from "@memoryos/sdk";

const client = new Memory({ apiKey: process.env.MEMORYOS_API_KEY });

// Ingest a conversation signal
const write = await client.add({
  messages: [{ role: "user", content: "I prefer concise answers." }],
  externalUserId: "customer-123",
});
if (write.jobId) await client.waitForJob(write.jobId);

// Retrieve governed context before the next model call
const result = await client.get({
  query: "How should I answer this user?",
  externalUserId: "customer-123",
});

const promptAddition = result.hasContext ? result.systemPromptAddition : "";`,
  },
  rest: {
    install: "$ curl https://api.memoryo.dev/v1/memories/add",
    code: `# Add a memory
curl -X POST https://api.memoryo.dev/v1/memories/add \\
  -H "Authorization: Bearer $MEMORYOS_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "messages": [{"role":"user","content":"I prefer concise answers."}],
    "external_user_id": "customer-123"
  }'

# Retrieve governed context
curl -X POST https://api.memoryo.dev/v1/memories/get \\
  -H "Authorization: Bearer $MEMORYOS_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "query": "How should I answer this user?",
    "external_user_id": "customer-123"
  }'`,
  },
  mcp: {
    install: "$ npx @memoryos/mcp-server --api-key $MEMORYOS_API_KEY",
    code: `// mcp.config.json — give your MCP-compatible agent
// MemoryOS tools for governed memory operations.
{
  "mcpServers": {
    "memoryos": {
      "command": "npx",
      "args": ["@memoryos/mcp-server"],
      "env": {
        "MEMORYOS_API_KEY": "\${MEMORYOS_API_KEY}"
      }
    }
  }
}

// Tools exposed:
//   memoryos.add      — ingest a conversation signal
//   memoryos.get      — retrieve governed context
//   memoryos.resolve  — review a conflict
//   memoryos.consent  — grant or revoke access`,
  },
};

export function Developers() {
  const [tab, setTab] = React.useState<Lang>("python");
  const [copied, setCopied] = React.useState(false);

  function copy() {
    const text = CODE[tab].code;
    navigator.clipboard?.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  }

  return (
    <section id="developers" className="relative py-20 lg:py-28 border-t border-hairline overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/4 left-0 h-[300px] w-[400px] rounded-full bg-mem/8 blur-[120px]" />
      </div>
      <div className="container-page">
        <div className="grid lg:grid-cols-[1fr_1.25fr] gap-12 lg:gap-16 items-start">
          {/* Left: copy */}
          <div>
            <SectionLabel>Developers</SectionLabel>
            <SectionHeading>
              Integrate in an afternoon.
              <br />
              <span className="text-ink-mute">Keep your model, tools, and agent framework.</span>
            </SectionHeading>
            <p className="mt-6 text-[15.5px] leading-[1.6] text-ink-soft max-w-md">
              Add <span className="font-mono text-mem">add()</span> on the way in
              and <span className="font-mono text-mem">get()</span> on the way
              out. MemoryOS handles the memory lifecycle around your stack —
              in Python, TypeScript, REST, or as MCP tools.
            </p>

            <div className="mt-8 grid grid-cols-2 gap-3">
              {[
                { k: "Python", v: "3.9+" },
                { k: "TypeScript", v: "Node 18+" },
                { k: "REST", v: "OpenAPI 3.1" },
                { k: "MCP", v: "2024-11 spec" },
              ].map((x) => (
                <div
                  key={x.k}
                  className="rounded-lg border border-hairline bg-surface px-3.5 py-3"
                >
                  <div className="text-[12px] font-mono text-ink-mute">{x.k}</div>
                  <div className="text-[13px] text-ink">{x.v}</div>
                </div>
              ))}
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Button
                asChild
                className="bg-mem text-[#0A0B0D] hover:bg-mem/90 font-semibold h-10 px-4 rounded-lg gap-1.5"
              >
                <a href="#cta">
                  Get an API key
                  <ArrowRight className="h-3.5 w-3.5" />
                </a>
              </Button>
              <Button
                asChild
                variant="ghost"
                className="h-10 px-4 rounded-lg border border-hairline hover:bg-white/[0.04] gap-1.5"
              >
                <a href="#developers">Read the quickstart</a>
              </Button>
            </div>
          </div>

          {/* Right: code viewer */}
          <div className="rounded-2xl border border-hairline-strong bg-surface/70 backdrop-blur-sm overflow-hidden ring-inset-hairline">
            {/* tabs */}
            <div className="flex items-center justify-between border-b border-hairline bg-surface-2/40 px-2 h-12">
              <div className="flex items-center gap-1 overflow-x-auto scroll-thin">
                {TABS.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setTab(t.id)}
                    className={`relative rounded-md px-3 py-1.5 text-[13px] font-medium transition-colors whitespace-nowrap ${
                      tab === t.id
                        ? "text-ink"
                        : "text-ink-mute hover:text-ink-soft"
                    }`}
                  >
                    {tab === t.id && (
                      <motion.span
                        layoutId="dev-tab"
                        className="absolute inset-0 rounded-md bg-mem/[0.08] border border-mem/30"
                        transition={{ duration: 0.2 }}
                      />
                    )}
                    {tab === t.id && (
                      <motion.span
                        layoutId="dev-tab-underline"
                        className="absolute -bottom-px left-2 right-2 h-px bg-mem"
                        transition={{ duration: 0.2 }}
                      />
                    )}
                    <span className="relative z-10">{t.label}</span>
                  </button>
                ))}
              </div>
              <button
                onClick={copy}
                className="inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-[11.5px] font-mono text-ink-mute hover:text-ink hover:bg-white/[0.04] transition-colors"
                aria-label="Copy code"
              >
                {copied ? (
                  <Check className="h-3.5 w-3.5 text-mem" />
                ) : (
                  <Copy className="h-3.5 w-3.5" />
                )}
                {copied ? "copied" : "copy"}
              </button>
            </div>

            {/* install line */}
            {CODE[tab].install && (
              <div className="flex items-center gap-2 px-4 py-2.5 border-b border-hairline bg-background/40">
                <Terminal className="h-3.5 w-3.5 text-mem" />
                <code className="text-[12.5px] font-mono text-ink-soft">{CODE[tab].install}</code>
              </div>
            )}

            {/* code */}
            <div className="relative">
              <div className="absolute left-0 top-0 bottom-0 w-10 border-r border-hairline bg-background/30 py-4 select-none">
                {CODE[tab].code.split("\n").map((_, i) => (
                  <div
                    key={i}
                    className="text-right pr-3 text-[11px] font-mono text-ink-mute/60 leading-[1.55]"
                  >
                    {i + 1}
                  </div>
                ))}
              </div>
              <AnimatePresence mode="wait">
                <motion.pre
                  key={tab}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.18 }}
                  className="pl-12 pr-4 py-4 font-mono text-[12.5px] leading-[1.55] text-ink-soft overflow-x-auto scroll-thin"
                >
                  {highlightCode(CODE[tab].code)}
                </motion.pre>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/**
 * Minimal token highlighter — no external deps.
 * Highlights strings, comments, keywords, numbers and API/method names.
 */
function highlightCode(src: string) {
  const lines = src.split("\n");
  return lines.map((line, i) => (
    <div key={i} className="whitespace-pre">
      {tokenize(line).map((t, j) => (
        <span key={j} className={t.cls}>{t.text}</span>
      ))}
      {line.length === 0 ? "\u200B" : null}
    </div>
  ));
}

function tokenize(line: string): { text: string; cls: string }[] {
  // Whole-line comments
  if (/^\s*(#|\/\/)/.test(line)) {
    return [{ text: line, cls: "text-ink-mute/80 italic" }];
  }
  // bash install line starts with $
  if (/^\$\s/.test(line)) {
    return [
      { text: "$ ", cls: "text-mem" },
      { text: line.slice(2), cls: "text-ink-soft" },
    ];
  }

  const tokens: { text: string; cls: string }[] = [];
  const re = /("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*')|(\b(?:import|from|const|let|await|async|new|if|else|return|def|class|true|false|None|null|export|default|env|process|os)\b)|(\b[A-Za-z_][\w.]*\b)|(\b\d+\b)|(\s+)|([^\w\s])/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(line)) !== null) {
    if (m[1]) tokens.push({ text: m[1], cls: "text-amber" });
    else if (m[2]) tokens.push({ text: m[2], cls: "text-violet font-medium" });
    else if (m[3]) {
      // function call / method on .
      const isCall = line[re.lastIndex] === "(";
      const prevChar = line[re.lastIndex - m[3].length - 1];
      if (isCall) tokens.push({ text: m[3], cls: "text-mem" });
      else if (prevChar === ".") tokens.push({ text: m[3], cls: "text-[#7BE3FF]" });
      else tokens.push({ text: m[3], cls: "text-ink-soft" });
    } else if (m[4]) tokens.push({ text: m[4], cls: "text-amber" });
    else if (m[5]) tokens.push({ text: m[5], cls: "text-ink" });
    else if (m[6]) tokens.push({ text: m[6], cls: "text-ink-mute" });
  }
  return tokens.length ? tokens : [{ text: line, cls: "text-ink" }];
}

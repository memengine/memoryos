"use client";

import * as React from "react";
import {
  CommandDialog,
  CommandList,
  CommandInput,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command";
import {
  ArrowUp,
  Rocket,
  Activity,
  Play,
  Code2,
  ShieldCheck,
  KeyRound,
  Headset,
  GraduationCap,
  Layers,
  GitCompare,
  Terminal,
  BookOpen,
  ArrowRight,
  Github,
} from "lucide-react";

/**
 * CommandPalette — Cmd+K / Ctrl+K fast navigation.
 * Developer-cred feature. Groups: Navigate, Sections, Actions, Resources.
 */
export function CommandPalette() {
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.key === "k" || e.key === "K") && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((v) => !v);
      }
      if (e.key === "/" && !e.metaKey && !e.ctrlKey && !e.altKey) {
        const target = e.target as HTMLElement;
        const tag = target.tagName;
        if (tag !== "INPUT" && tag !== "TEXTAREA" && !target.isContentEditable) {
          e.preventDefault();
          setOpen(true);
        }
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  function go(href: string) {
    setOpen(false);
    if (href.startsWith("#")) {
      // Wait for the dialog to release its body scroll lock before navigating.
      window.setTimeout(() => {
        const el = document.querySelector(href);
        if (!el) return;
        window.history.replaceState(null, "", href);
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 150);
      return;
    }

    window.location.assign(href);
  }

  return (
    <>
      <CommandDialog open={open} onOpenChange={setOpen} className="max-w-[560px] p-0">
        <CommandInput placeholder="Search MemoryOS — sections, actions, docs…" />
        <CommandList className="max-h-[440px]">
          <CommandEmpty>No results found.</CommandEmpty>

          <CommandGroup heading="Navigate">
            <CommandItem onSelect={() => go("#top")} className="gap-2.5">
              <ArrowUp className="h-4 w-4 text-mem" />
              <span>Top of page</span>
              <CommandShortcut>⌘↑</CommandShortcut>
            </CommandItem>
            <CommandItem onSelect={() => go("#problem")} className="gap-2.5">
              <Activity className="h-4 w-4 text-mem" />
              <span>The memory problem</span>
            </CommandItem>
            <CommandItem onSelect={() => go("#fits")} className="gap-2.5">
              <Layers className="h-4 w-4 text-mem" />
              <span>Where MemoryOS fits</span>
            </CommandItem>
            <CommandItem onSelect={() => go("#compare")} className="gap-2.5">
              <GitCompare className="h-4 w-4 text-mem" />
              <span>Comparison matrix</span>
            </CommandItem>
            <CommandItem onSelect={() => go("#product")} className="gap-2.5">
              <Rocket className="h-4 w-4 text-mem" />
              <span>Engines & schemas</span>
            </CommandItem>
          </CommandGroup>

          <CommandSeparator />

          <CommandGroup heading="Product">
            <CommandItem onSelect={() => go("#how")} className="gap-2.5">
              <Layers className="h-4 w-4 text-mem" />
              <span>How it works · 5-stage pipeline</span>
            </CommandItem>
            <CommandItem onSelect={() => go("#demo")} className="gap-2.5">
              <Play className="h-4 w-4 text-mem" />
              <span>Live memory playground</span>
            </CommandItem>
            <CommandItem onSelect={() => go("https://docs.memoryo.dev/quickstart")} className="gap-2.5">
              <Code2 className="h-4 w-4 text-mem" />
              <span>Developers · SDKs & API</span>
            </CommandItem>
            <CommandItem onSelect={() => go("#production")} className="gap-2.5">
              <ShieldCheck className="h-4 w-4 text-mem" />
              <span>Production foundations</span>
            </CommandItem>
            <CommandItem onSelect={() => go("#trust")} className="gap-2.5">
              <ShieldCheck className="h-4 w-4 text-mem" />
              <span>Trust center · security & compliance</span>
            </CommandItem>
            <CommandItem onSelect={() => go("#passport")} className="gap-2.5">
              <KeyRound className="h-4 w-4 text-mem" />
              <span>Memory Passport</span>
            </CommandItem>
            <CommandItem onSelect={() => go("#use-cases")} className="gap-2.5">
              <Layers className="h-4 w-4 text-mem" />
              <span>Use cases</span>
            </CommandItem>
          </CommandGroup>

          <CommandSeparator />

          <CommandGroup heading="Use cases">
            <CommandItem onSelect={() => go("#use-cases")} className="gap-2.5">
              <Headset className="h-4 w-4 text-amber" />
              <span>Customer Support</span>
            </CommandItem>
            <CommandItem onSelect={() => go("#use-cases")} className="gap-2.5">
              <GraduationCap className="h-4 w-4 text-violet" />
              <span>Education</span>
            </CommandItem>
            <CommandItem onSelect={() => go("#passport")} className="gap-2.5">
              <KeyRound className="h-4 w-4 text-mem" />
              <span>Memory Passport</span>
            </CommandItem>
          </CommandGroup>

          <CommandSeparator />

          <CommandGroup heading="Actions">
            <CommandItem onSelect={() => go("#cta")} className="gap-2.5">
              <Rocket className="h-4 w-4 text-mem" />
              <span>Try MemoryOS</span>
              <CommandShortcut>⏎</CommandShortcut>
            </CommandItem>
            <CommandItem onSelect={() => go("https://docs.memoryo.dev")} className="gap-2.5">
              <Terminal className="h-4 w-4 text-mem" />
              <span>Read the quickstart</span>
            </CommandItem>
            <CommandItem onSelect={() => go("#demo")} className="gap-2.5">
              <Play className="h-4 w-4 text-mem" />
              <span>Open the playground</span>
            </CommandItem>
          </CommandGroup>

          <CommandSeparator />

          <CommandGroup heading="Resources">
            <CommandItem onSelect={() => go("#developers")} className="gap-2.5">
              <BookOpen className="h-4 w-4 text-ink-mute" />
              <span>Documentation</span>
            </CommandItem>
            <CommandItem onSelect={() => go("#metrics")} className="gap-2.5">
              <Activity className="h-4 w-4 text-ink-mute" />
              <span>Metrics · production at a glance</span>
            </CommandItem>
            <CommandItem onSelect={() => go("#glossary")} className="gap-2.5">
              <BookOpen className="h-4 w-4 text-ink-mute" />
              <span>Glossary · vocabulary of governed memory</span>
            </CommandItem>
            <CommandItem onSelect={() => go("#production")} className="gap-2.5">
              <ShieldCheck className="h-4 w-4 text-ink-mute" />
              <span>Security & governance</span>
            </CommandItem>
            <CommandItem onSelect={() => go("https://github.com/memengine/memory-api")} className="gap-2.5">
              <Github className="h-4 w-4 text-ink-mute" />
              <span>MemoryOS API · GitHub</span>
            </CommandItem>
            <CommandItem onSelect={() => go("https://docs.memoryo.dev/contact")} className="gap-2.5">
              <ArrowRight className="h-4 w-4 text-ink-mute" />
              <span>Talk to an expert</span>
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </CommandDialog>

      {/* Trigger hint badge — fixed bottom-left, subtle */}
      <button
        onClick={() => setOpen(true)}
        className="hidden lg:inline-flex fixed bottom-5 left-5 z-40 items-center gap-2 rounded-lg border border-hairline bg-surface/80 backdrop-blur-md px-2.5 py-1.5 text-[11px] font-mono text-ink-mute hover:text-ink hover:border-mem/40 transition-colors"
        aria-label="Open command palette"
      >
        <kbd className="inline-flex h-4 items-center gap-0.5 rounded border border-hairline-strong bg-background/60 px-1 text-[10px] text-ink-soft">
          ⌘K
        </kbd>
        <span>command</span>
      </button>
    </>
  );
}

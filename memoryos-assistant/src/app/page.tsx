import type { Metadata } from "next";
import { AssistantShell } from "@/components/assistant/assistant-shell";

export const metadata: Metadata = {
  title: "MemoryOS Assistant — Multi-service memory demo",
  description: "One assistant backed by governed context from multiple trusted services.",
};

export default function AssistantPage() {
  return <AssistantShell />;
}

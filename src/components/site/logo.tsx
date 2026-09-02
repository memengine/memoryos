import * as React from "react";

export function Logo({ className }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2 ${className ?? ""}`}>
      <LogoMark className="h-6 w-6" />
      <span className="font-semibold tracking-tight text-[15px] leading-none">
        MemoryOS
      </span>
    </span>
  );
}

export function LogoMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      className={className}
      role="img"
      aria-label="MemoryOS"
      fill="none"
    >
      <defs>
        <linearGradient id="memlogo" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#B6FF8C" />
          <stop offset="100%" stopColor="#5BE3A2" />
        </linearGradient>
      </defs>
      <rect width="32" height="32" rx="7" fill="#0A0B0D" />
      <g
        stroke="url(#memlogo)"
        strokeWidth="2.1"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      >
        <path d="M8 11.5 L16 7 L24 11.5 L24 20.5 L16 25 L8 20.5 Z" opacity="0.95" />
      </g>
      <circle cx="16" cy="16" r="3" fill="url(#memlogo)" />
    </svg>
  );
}

export function Wordmark({ className }: { className?: string }) {
  return <span className={`font-semibold tracking-tight ${className ?? ""}`}>MemoryOS</span>;
}

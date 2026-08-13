// Curated "builder title" pools. A generic pool always applies; role-flavored
// pools get mixed in when the role text matches a keyword, so the result feels
// tailored without needing an LLM call.

const GENERIC = [
  'Terminal Wizard',
  'Async Custodian',
  'Ship-It Sorcerer',
  'Merge Conflict Monk',
  'Chai & Compile',
  '404 Fixer',
  'Latency Slayer',
  'Deploy Day Optimist',
  'Rubber Duck Whisperer',
  'Prod on a Friday',
  'Semi-Colon Survivor',
  'Ctrl+S Enthusiast',
  'Vibe Coder',
  'Full-Time Debugger',
  'Uptime Believer'
];

const FRONTEND = ['Pixel Whisperer', 'CSS Alchemist', 'Component Hoarder', 'Layout Shift Nemesis'];
const BACKEND = ['Query Optimizer', 'Server Room Monk', 'Cache Invalidator', 'API Diplomat'];
const DATA = ['Notebook Nomad', 'GPU Whisperer', 'Model Whisperer', 'Loss Curve Watcher'];
const DESIGN = ['Figma Philosopher', 'Whitespace Defender', 'Contrast Ratio Cop'];
const FOUNDER = ['Deck Slide Poet', 'Runway Mathematician', 'Cold-Email Champion'];
const MOBILE = ['Build Cache Sufferer', 'App Store Rejectee', 'Simulator Speedrunner'];

const KEYWORD_POOLS: Array<{ match: RegExp; pool: string[] }> = [
  { match: /front|react|next|ui|web dev/i, pool: FRONTEND },
  { match: /back|node|server|api|infra|devops/i, pool: BACKEND },
  { match: /data|ml|ai|model|research/i, pool: DATA },
  { match: /design|ux|product design/i, pool: DESIGN },
  { match: /found|ceo|founder|solo/i, pool: FOUNDER },
  { match: /mobile|ios|android|flutter/i, pool: MOBILE }
];

function hashString(input: string): number {
  let hash = 0;
  for (let i = 0; i < input.length; i++) {
    hash = (hash << 5) - hash + input.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

function poolForRole(role: string): string[] {
  const extra = KEYWORD_POOLS.find((k) => k.match.test(role))?.pool ?? [];
  return [...GENERIC, ...extra];
}

export function builderTitle(seed: string, role: string, spin = 0): string {
  const pool = poolForRole(role);
  const idx = (hashString(seed + role) + spin) % pool.length;
  return pool[idx];
}

export function randomBuilderId(): string {
  return `#HH${crypto.randomUUID()
    .replace(/-/g, '')
    .substring(0, 5)
    .toUpperCase()}`;
}

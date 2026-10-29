export const SANDBOX_ROLE_KEY = "sandbox_role";

export const SANDBOX_DATA_KEYS = [
  "sandbox.chats",
  "sandbox.interviews",
  "sandbox.gd",
  "sandbox.comm",
  "sandbox.english",
  "sandbox.aplr",
  "sandbox.technical",
  "sandbox.dsa",
  "sandbox.basicmath",
  "sandbox.situational",
  "sandbox.notifRead",
  "sandbox.forum",
] as const;

export function resetSandboxData(): void {
  if (typeof localStorage === "undefined") return;
  for (const key of SANDBOX_DATA_KEYS) {
    try {
      localStorage.removeItem(key);
    } catch {
      // storage unavailable — best-effort reset
    }
  }
}

export type SandboxRole = "student" | "institution_staff";

export function getSandboxRole(): SandboxRole {
  if (typeof localStorage === "undefined") return "student";
  const role = localStorage.getItem(SANDBOX_ROLE_KEY);
  return role === "institution_staff" ? "institution_staff" : "student";
}

export function setSandboxRole(role: SandboxRole): void {
  if (typeof localStorage === "undefined") return;
  localStorage.setItem(SANDBOX_ROLE_KEY, role);
}

export function readJson<T>(key: string, fallback: T): T {
  if (typeof localStorage === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function writeJson<T>(key: string, value: T): void {
  if (typeof localStorage === "undefined") return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // storage full or unavailable — demo data is best-effort
  }
}

export function uid(prefix: string): string {
  return `${prefix}-${Date.now().toString(36)}-${Math.floor(Math.random() * 1e6).toString(36)}`;
}

export function delay<T>(value: T, ms = 220): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms));
}

export function nowIso(): string {
  return new Date().toISOString();
}

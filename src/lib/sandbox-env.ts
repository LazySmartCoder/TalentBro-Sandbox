export type SandboxEnv = "student" | "copilot" | "staff";

export const SANDBOX_ENV_KEY = "sandbox_env";
export const SANDBOX_ROLE_KEY = "sandbox_role";

export type SandboxRole = "student" | "institution_staff" | "copilot";

export function getSandboxEnv(): SandboxEnv | null {
  if (typeof localStorage === "undefined") return null;
  const env = localStorage.getItem(SANDBOX_ENV_KEY);
  if (env === "student" || env === "copilot" || env === "staff") return env;
  return null;
}

export function setSandboxEnv(env: SandboxEnv): void {
  if (typeof localStorage === "undefined") return;
  localStorage.setItem(SANDBOX_ENV_KEY, env);
}

export function clearSandboxEnv(): void {
  if (typeof localStorage === "undefined") return;
  localStorage.removeItem(SANDBOX_ENV_KEY);
}

export function getSandboxRole(): SandboxRole {
  if (typeof localStorage === "undefined") return "student";
  const role = localStorage.getItem(SANDBOX_ROLE_KEY);
  if (role === "institution_staff") return "institution_staff";
  if (role === "copilot") return "copilot";
  return "student";
}

export function setSandboxRole(role: SandboxRole): void {
  if (typeof localStorage === "undefined") return;
  localStorage.setItem(SANDBOX_ROLE_KEY, role);
}

export function activateEnvironment(env: SandboxEnv): { role: SandboxRole; entry: string } {
  if (env === "student") {
    setSandboxEnv("student");
    setSandboxRole("student");
    return { role: "student", entry: "/student" };
  }
  if (env === "copilot") {
    setSandboxEnv("copilot");
    setSandboxRole("copilot");
    return { role: "copilot", entry: "/copilot" };
  }
  // staff
  setSandboxEnv("staff");
  setSandboxRole("institution_staff");
  return { role: "institution_staff", entry: "/dashboard" };
}

export function getEntryRouteForEnv(env: SandboxEnv | null): string {
  if (env === "student") return "/student";
  if (env === "copilot") return "/copilot";
  if (env === "staff") return "/dashboard";
  return "/";
}

export function resetSandboxAll(): void {
  if (typeof localStorage === "undefined") return;
  try {
    localStorage.removeItem(SANDBOX_ENV_KEY);
    localStorage.removeItem(SANDBOX_ROLE_KEY);
    // also clear data keys
    const keys = [
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
    ];
    for (const k of keys) localStorage.removeItem(k);
  } catch {}
}

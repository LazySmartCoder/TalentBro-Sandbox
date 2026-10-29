import { useEffect, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { getSandboxEnv, getSandboxRole, type SandboxEnv } from "@/lib/sandbox-env";
import { GateLoading } from "@/components/load-state";

export function EnvGate({
  children,
  allow,
  redirectTo = "/",
}: {
  children: React.ReactNode;
  allow: SandboxEnv | SandboxEnv[];
  redirectTo?: string;
}) {
  const navigate = useNavigate();
  const [status, setStatus] = useState<"loading" | "ok">("loading");

  useEffect(() => {
    const env = getSandboxEnv();
    const allowed = Array.isArray(allow) ? allow : [allow];
    if (!env || !allowed.includes(env)) {
      void navigate({ to: redirectTo, replace: true });
      return;
    }
    setStatus("ok");
  }, [allow, navigate, redirectTo]);

  if (status === "loading") return <GateLoading />;
  return <>{children}</>;
}

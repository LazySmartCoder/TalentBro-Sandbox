import { useEffect, useRef } from "react";
import { ArrowUpRight, FlaskConical } from "lucide-react";

const MAIN_SITE = "https://ins.talentbro.in";

export function SandboxTopBar() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const root = document.documentElement;
    const apply = () => {
      root.style.setProperty("--sandbox-banner-height", `${el.offsetHeight}px`);
    };

    apply();
    const observer = new ResizeObserver(apply);
    observer.observe(el);
    window.addEventListener("resize", apply);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", apply);
    };
  }, []);

  return (
    <div
      ref={ref}
      role="note"
      aria-label="Sandbox environment notice"
      style={{ top: 0 }}
      className="sticky z-50 border-b border-amber-300/70 bg-amber-50 text-amber-950 shadow-sm dark:border-amber-400/30 dark:bg-amber-950 dark:text-amber-100"
    >
      <div className="mx-auto flex w-full max-w-7xl flex-col items-center justify-center gap-1.5 px-4 py-1.5 text-center text-[11px] leading-snug sm:flex-row sm:gap-3 sm:text-xs">
        <span className="inline-flex items-center gap-1.5 font-medium">
          <FlaskConical className="size-3.5 shrink-0" aria-hidden />
          <span>
            This is a <strong className="font-semibold">Sandbox Environment</strong> — a few
            features are not functional. The main platform serves you best.
          </span>
        </span>
        <a
          href={MAIN_SITE}
          target="_blank"
          rel="noreferrer"
          className="inline-flex shrink-0 items-center justify-center gap-1 rounded-full border border-amber-400/70 bg-white/70 px-3 py-1 font-semibold text-amber-950 transition-colors hover:bg-white dark:border-amber-400/40 dark:bg-amber-900/60 dark:text-amber-50 dark:hover:bg-amber-900"
        >
          Go to main website
          <ArrowUpRight className="size-3.5" aria-hidden />
        </a>
      </div>
    </div>
  );
}

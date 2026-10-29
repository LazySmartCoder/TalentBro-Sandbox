/**
 * Monochrome line-art graphics. All strokes use currentColor so they inherit
 * the design-system foreground token — no hardcoded colors.
 */

export function SandboxGraphic({ className = "" }: { className?: string }) {
  return (
    <svg
      aria-hidden
      role="presentation"
      viewBox="0 0 400 300"
      fill="none"
      className={`text-foreground ${className}`}
    >
      <defs>
        <pattern id="sandbox-grain" width="16" height="16" patternUnits="userSpaceOnUse">
          <circle cx="4" cy="4" r="0.9" fill="currentColor" fillOpacity="0.35" />
          <circle cx="12" cy="11" r="0.7" fill="currentColor" fillOpacity="0.22" />
        </pattern>
      </defs>

      {/* soft ground shadow */}
      <ellipse cx="200" cy="266" rx="152" ry="18" fill="currentColor" fillOpacity="0.05" />

      {/* side walls */}
      <path
        d="M64 132 200 200 200 274 64 206Z"
        fill="currentColor"
        fillOpacity="0.03"
        stroke="currentColor"
        strokeOpacity="0.35"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path
        d="M336 132 200 200 200 274 336 206Z"
        fill="currentColor"
        fillOpacity="0.07"
        stroke="currentColor"
        strokeOpacity="0.35"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />

      {/* top rim */}
      <path
        d="M200 64 336 132 200 200 64 132Z"
        stroke="currentColor"
        strokeOpacity="0.5"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />

      {/* inner rim */}
      <path
        d="M200 76 311 132 200 188 89 132Z"
        stroke="currentColor"
        strokeOpacity="0.12"
        strokeWidth="1"
        strokeLinejoin="round"
      />

      {/* sand bed */}
      <path
        d="M200 88 309 142 200 196 91 142Z"
        fill="currentColor"
        fillOpacity="0.04"
        stroke="currentColor"
        strokeOpacity="0.28"
        strokeWidth="1.25"
        strokeLinejoin="round"
      />
      <path d="M200 88 309 142 200 196 91 142Z" fill="url(#sandbox-grain)" />

      {/* flag */}
      <g className="animate-pulse-soft">
        <path
          d="M168 122V80"
          stroke="currentColor"
          strokeOpacity="0.7"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <path d="M168 82 197 91 168 100Z" fill="currentColor" fillOpacity="0.85" />
      </g>

      {/* bucket */}
      <ellipse
        cx="240"
        cy="148"
        rx="14"
        ry="5.5"
        stroke="currentColor"
        strokeOpacity="0.45"
        strokeWidth="1.5"
      />
      <path
        d="M226 148 230 169Q240 174 250 169L254 148"
        stroke="currentColor"
        strokeOpacity="0.45"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path
        d="M227 146C227 133 253 133 253 146"
        stroke="currentColor"
        strokeOpacity="0.35"
        strokeWidth="1.5"
        strokeLinecap="round"
      />

      {/* pebbles */}
      <circle cx="140" cy="138" r="3" fill="currentColor" fillOpacity="0.25" />
      <circle cx="156" cy="152" r="2" fill="currentColor" fillOpacity="0.2" />
      <circle cx="214" cy="176" r="2.4" fill="currentColor" fillOpacity="0.22" />
      <circle cx="276" cy="150" r="2.2" fill="currentColor" fillOpacity="0.2" />
      <circle cx="288" cy="143" r="1.6" fill="currentColor" fillOpacity="0.18" />
    </svg>
  );
}

export function GridField({ className = "" }: { className?: string }) {
  return (
    <svg
      aria-hidden
      className={className}
      viewBox="0 0 800 400"
      fill="none"
      preserveAspectRatio="none"
    >
      <defs>
        <pattern id="tg-grid" width="40" height="40" patternUnits="userSpaceOnUse">
          <path d="M40 0H0V40" stroke="currentColor" strokeOpacity="0.16" strokeWidth="0.75" />
        </pattern>
        <radialGradient id="tg-fade" cx="50%" cy="40%" r="65%">
          <stop offset="0%" stopColor="white" stopOpacity="1" />
          <stop offset="100%" stopColor="white" stopOpacity="0" />
        </radialGradient>
        <mask id="tg-mask">
          <rect width="800" height="400" fill="url(#tg-fade)" />
        </mask>
      </defs>
      <rect width="800" height="400" fill="url(#tg-grid)" mask="url(#tg-mask)" />
    </svg>
  );
}

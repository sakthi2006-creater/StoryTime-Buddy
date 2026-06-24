import { memo } from "react";

type Mood = "idle" | "speaking" | "happy" | "sad";

export const Robot = memo(function Robot({ mood }: { mood: Mood }) {
  const cls =
    mood === "speaking" ? "speaking" : mood === "happy" ? "happy" : mood === "sad" ? "shake" : "";

  return (
    <svg viewBox="0 0 180 180" width="160" height="160" className={`robot ${cls}`}>
      <defs>
        <linearGradient id="shell" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#c9a8ff" />
          <stop offset="100%" stopColor="#9a6cff" />
        </linearGradient>
        <linearGradient id="body" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#9bd6ff" />
          <stop offset="100%" stopColor="#5aaef0" />
        </linearGradient>
        <radialGradient id="screen" cx="50%" cy="40%" r="60%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="100%" stopColor="#e8dcff" />
        </radialGradient>
        <linearGradient id="feather" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#ffd23f" />
          <stop offset="50%" stopColor="#ff8fb1" />
          <stop offset="100%" stopColor="#6ec6ff" />
        </linearGradient>
      </defs>

      {/* ===== Feather on top of head (sways gently) ===== */}
      <g className="feather-wrap" style={{ transformOrigin: "90px 38px" }}>
        <path
          d="M90 38 Q70 6 84 -4 Q100 6 96 22 Q110 18 112 8 Q118 24 104 32 Q120 34 124 26 Q122 42 102 42 Z"
          transform="translate(20 28)"
          fill="url(#feather)"
          stroke="#9a6cff"
          strokeWidth="1.2"
          strokeLinejoin="round"
        />
        <path
          d="M108 36 Q104 50 100 60"
          stroke="#9a6cff"
          strokeWidth="1.5"
          fill="none"
          strokeLinecap="round"
        />
      </g>

      {/* antenna */}
      <line
        x1="90"
        y1="48"
        x2="90"
        y2="62"
        stroke="#9a6cff"
        strokeWidth="3.5"
        strokeLinecap="round"
      />
      <circle cx="90" cy="46" r="5" fill="#ffd23f">
        <animate attributeName="r" values="4;6;4" dur="1.4s" repeatCount="indefinite" />
      </circle>

      {/* head shell */}
      <rect x="40" y="60" width="100" height="80" rx="26" fill="url(#shell)" />
      <rect x="47" y="66" width="86" height="68" rx="22" fill="url(#screen)" />

      {/* ears */}
      <rect x="34" y="86" width="8" height="22" rx="4" fill="#9a6cff" />
      <rect x="138" y="86" width="8" height="22" rx="4" fill="#9a6cff" />
      <circle cx="38" cy="84" r="3" fill="#ffd23f" />
      <circle cx="142" cy="84" r="3" fill="#ffd23f" />

      {/* eyes */}
      <g>
        <ellipse
          cx="72"
          cy="94"
          rx="11"
          ry="13"
          fill="#ffffff"
          stroke="#1f1147"
          strokeWidth="1.5"
        />
        <ellipse
          cx="108"
          cy="94"
          rx="11"
          ry="13"
          fill="#ffffff"
          stroke="#1f1147"
          strokeWidth="1.5"
        />
        <g className="eye">
          <circle
            cx={mood === "sad" ? 70 : 73}
            cy={mood === "sad" ? 98 : 96}
            r="5.5"
            fill="#1f1147"
          />
          <circle
            cx={mood === "sad" ? 106 : 109}
            cy={mood === "sad" ? 98 : 96}
            r="5.5"
            fill="#1f1147"
          />
          <circle
            cx={mood === "sad" ? 72 : 75}
            cy={mood === "sad" ? 96 : 93}
            r="2"
            fill="#ffffff"
          />
          <circle
            cx={mood === "sad" ? 108 : 111}
            cy={mood === "sad" ? 96 : 93}
            r="2"
            fill="#ffffff"
          />
        </g>
        {mood === "sad" && (
          <>
            <path
              d="M62 82 Q72 78 82 84"
              stroke="#1f1147"
              strokeWidth="2.5"
              fill="none"
              strokeLinecap="round"
            />
            <path
              d="M98 84 Q108 78 118 82"
              stroke="#1f1147"
              strokeWidth="2.5"
              fill="none"
              strokeLinecap="round"
            />
          </>
        )}
      </g>

      {/* cheeks */}
      <ellipse cx="58" cy="114" rx="6" ry="4" fill="#ff8fb1" opacity="0.7" />
      <ellipse cx="122" cy="114" rx="6" ry="4" fill="#ff8fb1" opacity="0.7" />

      {/* mouth */}
      {mood === "happy" && (
        <>
          <path d="M75 116 Q90 132 105 116 Z" fill="#1f1147" />
          <path d="M78 118 Q90 128 102 118" fill="#ff5e7e" />
        </>
      )}
      {mood === "speaking" && (
        <ellipse cx="90" cy="120" rx="7" ry="5" fill="#1f1147">
          <animate attributeName="ry" values="3;6;3" dur="0.35s" repeatCount="indefinite" />
        </ellipse>
      )}
      {mood === "sad" && (
        <path
          d="M78 124 Q90 114 102 124"
          stroke="#1f1147"
          strokeWidth="3"
          fill="none"
          strokeLinecap="round"
        />
      )}
      {mood === "idle" && (
        <path
          d="M78 118 Q90 128 102 118"
          stroke="#1f1147"
          strokeWidth="3"
          fill="none"
          strokeLinecap="round"
        />
      )}

      {/* neck + body */}
      <rect x="80" y="138" width="20" height="6" rx="2" fill="#9a6cff" />
      <rect x="48" y="144" width="84" height="34" rx="16" fill="url(#body)" />
      <rect x="64" y="152" width="52" height="20" rx="8" fill="#1f1147" opacity="0.15" />
      <circle cx="76" cy="162" r="3.5" fill="#ffffff" />
      <circle cx="90" cy="162" r="3.5" fill="#ffd23f" />
      <circle cx="104" cy="162" r="3.5" fill="#ffffff" />

      {/* arms */}
      <rect x="30" y="150" width="14" height="26" rx="7" fill="#9a6cff" />
      <rect x="136" y="150" width="14" height="26" rx="7" fill="#9a6cff" />
    </svg>
  );
});

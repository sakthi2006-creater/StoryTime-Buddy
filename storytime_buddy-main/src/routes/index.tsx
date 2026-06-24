import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import { createFileRoute } from "@tanstack/react-router";
import confetti from "canvas-confetti";
import { Robot } from "@/components/Robot";
import { useRoaming } from "@/hooks/useRoaming";
import { useHumming } from "@/hooks/useHumming";
import { STORY_TEXT, QUIZ } from "@/data/story";

export const Route = createFileRoute("/")({
  head: () => ({
      meta: [
      { title: "Storytime Buddy — Peblo" },
      { name: "description", content: "A storytelling buddy for curious kids." },
      { property: "og:title", content: "Storytime Buddy" },
      { property: "og:description", content: "Listen to a magical story and play a quiz with Pip the Robot." },
    ],
  }),
  component: Index,
});

type TTSState = "idle" | "loading" | "speaking" | "completed" | "error";
type Mood = "idle" | "speaking" | "happy" | "sad";

const CLOUDS = [
  { top: "10%", size: 80, dur: 60, delay: 0 },
  { top: "22%", size: 56, dur: 80, delay: -20 },
  { top: "6%", size: 110, dur: 95, delay: -45 },
];

function Index() {
  const stageRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const [tts, setTts] = useState<TTSState>("idle");
  const [mood, setMood] = useState<Mood>("idle");
  const [showQuiz, setShowQuiz] = useState(false);
  const [selected, setSelected] = useState<string | null>(null);
  const [correct, setCorrect] = useState(false);
  const utterRef = useRef<SpeechSynthesisUtterance | null>(null);

  const { playing: musicOn, toggle: toggleMusic } = useHumming();

  const robotRef = useRoaming({
    bounds: stageRef,
    avoid: cardRef,
    size: { w: 160, h: 180 },
    intervalMs: 3000,
    paused: mood === "happy" || mood === "sad",
  });

  const question = QUIZ[0];

  // Pick a female voice when available
  const femaleVoice = useMemo(() => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return null;
    return () => {
      const voices = window.speechSynthesis.getVoices();
      const prefer = voices.find((v) =>
        /female|samantha|victoria|karen|tessa|zira|google uk english female|google us english/i.test(
          v.name,
        ),
      );
      return prefer ?? voices.find((v) => v.lang.startsWith("en")) ?? voices[0] ?? null;
    };
  }, []);

  useEffect(() => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    const load = () => window.speechSynthesis.getVoices();
    load();
    window.speechSynthesis.onvoiceschanged = load;
    return () => {
      window.speechSynthesis.cancel();
    };
  }, []);

  const readStory = useCallback(() => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      setTts("error");
      return;
    }
    try {
      window.speechSynthesis.cancel();
      setTts("loading");
      setShowQuiz(false);
      setSelected(null);

      const u = new SpeechSynthesisUtterance(STORY_TEXT);
      const v = femaleVoice?.();
      if (v) u.voice = v;
      u.pitch = 1.35;
      u.rate = 0.95;
      u.volume = 1;
      u.onstart = () => {
        setTts("speaking");
        setMood("speaking");
      };
      u.onend = () => {
        setTts("completed");
        setMood("idle");
        setShowQuiz(true);
      };
      u.onerror = () => {
        setTts("error");
        setMood("idle");
      };
      utterRef.current = u;
      // tiny delay so loading state is visible
      window.setTimeout(() => window.speechSynthesis.speak(u), 250);
    } catch {
      setTts("error");
    }
  }, [femaleVoice]);

  const onAnswer = (opt: string) => {
    if (selected) return;
    setSelected(opt);
    if (opt === question.answer) {
      setCorrect(true);
      setMood("happy");
      // confetti burst
      const end = Date.now() + 900;
      const colors = ["#ff8fb1", "#b388ff", "#6ec6ff", "#ffd23f", "#7ee8a2"];
      (function frame() {
        confetti({ particleCount: 6, angle: 60, spread: 75, origin: { x: 0 }, colors });
        confetti({ particleCount: 6, angle: 120, spread: 75, origin: { x: 1 }, colors });
        if (Date.now() < end) requestAnimationFrame(frame);
      })();
      window.setTimeout(() => setMood("idle"), 2400);
    } else {
      setCorrect(false);
      setMood("sad");
      if ("vibrate" in navigator) navigator.vibrate?.([60, 40, 60]);
      window.setTimeout(() => {
        setMood("idle");
        setSelected(null);
      }, 1100);
    }
  };

  const sparkles = useMemo(
    () =>
      Array.from({ length: 14 }).map((_, i) => ({
        id: i,
        top: `${Math.random() * 70}%`,
        left: `${Math.random() * 100}%`,
        delay: `${Math.random() * 2.4}s`,
      })),
    [],
  );

  return (
    <div className="sky-bg fixed inset-0 overflow-hidden">
      {/* Sun + rainbow + hills */}
      <div className="sun" />
      <div className="rainbow" />
      <div className="hill h1" />
      <div className="hill h2" />

      {/* Balloons */}
      <div className="balloon b1" />
      <div className="balloon b2" />
      <div className="balloon b3" />
      <div className="balloon b4" />

      {/* Butterflies */}
      <span className="butterfly f1">🦋</span>
      <span className="butterfly f2">🐝</span>
      <span className="butterfly f3">🦋</span>

      {/* Clouds */}
      {CLOUDS.map((c, i) => (
        <div
          key={i}
          className="cloud"
          style={{
            top: c.top,
            width: c.size * 2,
            height: c.size,
            animationDuration: `${c.dur}s`,
            animationDelay: `${c.delay}s`,
          }}
        />
      ))}

      {/* Sparkles */}
      {sparkles.map((s) => (
        <span
          key={s.id}
          className="sparkle"
          style={{ top: s.top, left: s.left, animationDelay: s.delay }}
        />
      ))}

      {/* Music toggle */}
      <button
        type="button"
        onClick={toggleMusic}
        className={`music-btn ${musicOn ? "on" : ""}`}
        aria-label={musicOn ? "Pause melody" : "Play melody"}
        title={musicOn ? "Pause melody" : "Play melody"}
      >
        {musicOn ? "🎵" : "🔈"}
      </button>

      {/* Header */}
      <header className="relative z-10 pt-6 text-center px-4">
        <h1 className="title-fancy">
          {"Storytime Buddy".split("").map((ch, i) => (
            <span
              key={i}
              className="ltr"
              style={{ animationDelay: `${i * 0.08}s` }}
            >
              {ch === " " ? "\u00A0" : ch}
            </span>
          ))}
        </h1>
        <p className="subtitle-fancy mt-2 text-base">
          ✨ A magical tale with Pip the Robot ✨
        </p>
      </header>

      {/* Stage with roaming robot */}
      <div ref={stageRef} className="absolute inset-0 pointer-events-none">
        <div ref={robotRef} className="robot-wrap">
          <Robot mood={mood} />
        </div>
      </div>

      {/* Story + Quiz card */}
      <div className="absolute inset-x-0 bottom-0 z-10 px-4 pb-6">
        <div ref={cardRef} className="glass mx-auto max-w-md rounded-[2rem] p-5">
          {!showQuiz ? (
            <>
              <p className="text-base leading-relaxed text-[oklch(0.25_0.08_290)]">
                {STORY_TEXT}
              </p>
              <button
                onClick={readStory}
                disabled={tts === "loading" || tts === "speaking"}
                className="story-btn mt-5 flex w-full items-center justify-center gap-2 px-6 py-4 text-lg disabled:opacity-80"
              >
                {tts === "loading" && (
                  <span className="inline-block h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                )}
                {tts === "speaking"
                  ? "📖 Reading…"
                  : tts === "loading"
                    ? "Getting ready…"
                    : tts === "error"
                      ? "🔁 Try Again"
                      : "🔊 Read Me a Story"}
              </button>
              {tts === "error" && (
                <p className="mt-2 text-center text-sm text-[oklch(0.45_0.18_25)]">
                  Oops! Voice unavailable. Tap to retry.
                </p>
              )}
            </>
          ) : (
            <div className="reveal">
              <h2 className="text-lg font-bold text-[oklch(0.3_0.12_290)]">
                {question.question}
              </h2>
              <div className="mt-4 grid grid-cols-2 gap-3">
                {question.options.map((opt) => {
                  const isSel = selected === opt;
                  const cls = isSel
                    ? opt === question.answer
                      ? "option-btn correct"
                      : "option-btn wrong"
                    : "option-btn";
                  return (
                    <button
                      key={opt}
                      onClick={() => onAnswer(opt)}
                      className={`${cls} px-4 py-3 text-base font-semibold text-[oklch(0.25_0.08_290)]`}
                    >
                      {opt}
                    </button>
                  );
                })}
              </div>
              {selected && (
                <p
                  className={`mt-4 text-center text-base font-bold ${
                    correct ? "text-[oklch(0.5_0.18_150)]" : "text-[oklch(0.55_0.2_25)]"
                  }`}
                >
                  {correct ? "🎉 Amazing! You got it right!" : "💪 Great try! Let's try again!"}
                </p>
              )}
              {correct && (
                <button
                  onClick={() => {
                    setShowQuiz(false);
                    setSelected(null);
                    setCorrect(false);
                    setTts("idle");
                  }}
                  className="story-btn mt-4 w-full px-6 py-3 text-base"
                >
                  ✨ Hear it again
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

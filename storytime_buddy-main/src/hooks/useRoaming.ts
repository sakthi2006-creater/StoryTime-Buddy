import { useEffect, useRef, useState } from "react";

/** Roam inside `bounds`, avoiding the rectangle of `avoid` (e.g. the story card).
 *  Smooth glide via CSS transform; no React re-renders during motion.
 */
export function useRoaming(opts: {
  bounds: React.RefObject<HTMLElement | null>;
  avoid?: React.RefObject<HTMLElement | null>;
  size: { w: number; h: number };
  intervalMs?: number;
  paused?: boolean;
}) {
  const { bounds, avoid, size, intervalMs = 3000, paused = false } = opts;
  const ref = useRef<HTMLDivElement | null>(null);
  const [, force] = useState(0);

  useEffect(() => {
    if (paused) return;
    let cancelled = false;

    const pick = () => {
      const el = bounds.current;
      const node = ref.current;
      if (!el || !node) return;
      const stage = el.getBoundingClientRect();
      const avoidRect = avoid?.current?.getBoundingClientRect();

      const padX = 16;
      const padTop = Math.max(80, stage.height * 0.16); // below header
      const minX = padX;
      const maxX = stage.width - size.w - padX;
      const minY = padTop;
      // bottom limit = top of avoid rect (minus small gap), or stage bottom
      const avoidTopLocal = avoidRect ? avoidRect.top - stage.top - 12 : stage.height - padX;

      const maxY = Math.max(minY + 1, avoidTopLocal - size.h);

      if (maxX <= minX || maxY <= minY) return;

      // Try up to 8 picks that don't overlap avoid rect (defense in depth)
      let x = minX,
        y = minY;
      for (let i = 0; i < 8; i++) {
        x = minX + Math.random() * (maxX - minX);
        y = minY + Math.random() * (maxY - minY);
        if (!avoidRect) break;
        const overlaps =
          x < avoidRect.right - stage.left &&
          x + size.w > avoidRect.left - stage.left &&
          y < avoidRect.bottom - stage.top &&
          y + size.h > avoidRect.top - stage.top;
        if (!overlaps) break;
      }
      const rot = (Math.random() - 0.5) * 8;
      node.style.transform = `translate3d(${x}px, ${y}px, 0) rotate(${rot}deg)`;
    };

    requestAnimationFrame(() => {
      if (!cancelled) {
        force((n) => n + 1);
        pick();
      }
    });
    const id = window.setInterval(pick, intervalMs);
    const onResize = () => pick();
    window.addEventListener("resize", onResize);
    return () => {
      cancelled = true;
      window.clearInterval(id);
      window.removeEventListener("resize", onResize);
    };
  }, [bounds, avoid, size.w, size.h, intervalMs, paused]);

  return ref;
}

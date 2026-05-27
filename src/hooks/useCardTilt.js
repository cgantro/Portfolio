import { useState, useCallback } from "react";

/**
 * 마우스 위치 → CSS 3D 틸트 + 글레어 효과
 * @param {number} maxDeg  최대 틸트 각도 (기본 12)
 */
export default function useCardTilt(maxDeg = 12) {
  const [cardStyle, setCardStyle] = useState({});
  const [glarePos, setGlarePos] = useState({ x: 50, y: 50, opacity: 0 });

  const onMouseMove = useCallback((e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const cx = (e.clientX - rect.left) / rect.width;   // 0~1
    const cy = (e.clientY - rect.top)  / rect.height;   // 0~1

    setCardStyle({
      transform: `perspective(900px) rotateX(${(cy - 0.5) * -maxDeg}deg) rotateY(${(cx - 0.5) * maxDeg}deg) translateZ(12px)`,
      transition: "transform 0.08s linear",
    });
    setGlarePos({ x: cx * 100, y: cy * 100, opacity: 0.18 });
  }, [maxDeg]);

  const onMouseLeave = useCallback(() => {
    setCardStyle({
      transform: "perspective(900px) rotateX(0deg) rotateY(0deg) translateZ(0px)",
      transition: "transform 0.55s cubic-bezier(0.4, 0, 0.2, 1)",
    });
    setGlarePos((p) => ({ ...p, opacity: 0 }));
  }, []);

  return { cardStyle, glarePos, onMouseMove, onMouseLeave };
}

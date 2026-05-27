import { useState, useEffect } from "react";

/**
 * IntersectionObserver 기반 스크롤 스파이
 * @param {string[]} sectionIds
 * @returns {string} activeId
 */
export default function useActiveSection(sectionIds) {
  const [activeId, setActiveId] = useState(sectionIds[0] || "");

  useEffect(() => {
    const observers = [];
    const visibleSections = new Map();

    const pickActive = () => {
      // 가장 위에 있는 visible 섹션 선택
      for (const id of sectionIds) {
        if (visibleSections.get(id)) {
          setActiveId(id);
          return;
        }
      }
    };

    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;

      const obs = new IntersectionObserver(
        ([entry]) => {
          visibleSections.set(id, entry.isIntersecting);
          pickActive();
        },
        { rootMargin: "-20% 0px -60% 0px" }
      );
      obs.observe(el);
      observers.push(obs);
    });

    return () => observers.forEach((obs) => obs.disconnect());
  }, [sectionIds.join(",")]); // eslint-disable-line

  return activeId;
}

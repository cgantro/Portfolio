import { useMemo, useState } from "react";
import SectionLabel from "../../ui/SectionLabel";
import styles from "./TechStack.module.css";

function SkillIcon({ icon, name }) {
  if (!icon) return <span className={styles.iconPh}>{name.slice(0, 2)}</span>;
  return <img className={styles.icon} src={`https://skillicons.dev/icons?i=${icon}&theme=light`} alt="" loading="lazy" />;
}

export default function TechStack({ stack }) {
  const [active, setActive] = useState(stack[0]?.category ?? "");
  const selected = useMemo(() => stack.find((group) => group.category === active) ?? stack[0], [active, stack]);

  return (
    <div className={styles.wrap}>
      <SectionLabel>기술 스택 및 도구</SectionLabel>
      <p className={styles.lead}>C++ 응용 소프트웨어와 실시간 통신 구현에 사용하는 기술입니다.</p>
      <div className={styles.tabs} role="tablist" aria-label="기술 스택 분류">
        {stack.map((group) => (
          <button
            key={group.category}
            className={active === group.category ? styles.activeTab : styles.tab}
            onClick={() => setActive(group.category)}
            role="tab"
            aria-selected={active === group.category}
          >
            {group.category}
          </button>
        ))}
      </div>
      {selected ? (
        <div className={styles.skillPanel}>
          <p className={styles.groupTitle}>{selected.category}</p>
          <ul className={styles.items}>
            {selected.items.map((item) => (
              <li key={item.name} className={styles.item}>
                <SkillIcon icon={item.skillicon} name={item.name} />
                <span>{item.name}</span>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
}

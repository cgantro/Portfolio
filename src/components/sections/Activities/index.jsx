import SectionLabel from "../../ui/SectionLabel";
import Tag from "../../ui/Tag";
import styles from "./Activities.module.css";

export default function Activities({ items }) {
  return (
    <>
      <SectionLabel>Activity</SectionLabel>

      <div className={styles.list}>
        {items.map((act) => (
          <div key={act.id} className={styles.card}>
            <div className={styles.cardHead}>
              <div className={styles.titleRow}>
                <span className={styles.title}>{act.title}</span>
                <Tag variant={act.category === "교육" ? "accent" : "default"}>
                  {act.category}
                </Tag>
              </div>
              <div className={styles.sub}>
                <span className={styles.subtitle}>{act.subtitle}</span>
                <span className={styles.period}>{act.period}</span>
              </div>
            </div>

            <ul className={styles.items}>
              {act.items.map((item, i) => (
                <li key={i} className={styles.item}>
                  <span className={styles.dot}>·</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </>
  );
}

import SectionLabel from "../../ui/SectionLabel";
import styles from "./Activities.module.css";

export default function Activities({ items }) {
  return (
    <div className={styles.wrap}>
      <SectionLabel>경험 및 활동</SectionLabel>
      <div className={styles.divider}><span>Experience</span></div>
      <div className={styles.list}>
        {items.map((activity) => (
          <article key={activity.id} className={styles.item}>
            <p className={styles.period}>{activity.period}</p>
            <div className={styles.content}>
              <p className={styles.category}>{activity.category}</p>
              <h3>{activity.title}</h3>
              <p className={styles.subtitle}>{activity.subtitle}</p>
              <ul>{activity.items.map((item) => <li key={item}>{item}</li>)}</ul>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

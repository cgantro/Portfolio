import SectionLabel from "../../ui/SectionLabel";
import styles from "./Timeline.module.css";

export default function Timeline({ items }) {
  return (
    <div className={styles.sectionWrap}>
      <SectionLabel>교육 및 자격증</SectionLabel>
      <p className={styles.lead}>학습과 검증을 통해 C++ 응용 소프트웨어 개발 역량을 확장했습니다.</p>
      <div className={styles.divider}><span>Education & Certification</span></div>
      <div className={styles.list}>
        {items.map((item) => (
          <article key={item.id} className={styles.item}>
            <p className={styles.period}>{item.period || "상시"}</p>
            <div className={styles.content}>
              <div className={styles.type}>{item.type === "cert" ? "CERTIFICATION" : "EDUCATION"}</div>
              <h3>{item.title}</h3>
              <p className={styles.detail}>{item.detail}</p>
              {item.note ? <p className={styles.note}>{item.note}</p> : null}
              {item.tags?.length ? <ul className={styles.tags}>{item.tags.map((tag) => <li key={tag}>{tag}</li>)}</ul> : null}
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

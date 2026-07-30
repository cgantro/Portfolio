import SectionLabel from "../../ui/SectionLabel";
import Tag from "../../ui/Tag";
import styles from "./Timeline.module.css";

const TYPE_ICON = {
  edu:  "◎",
  cert: "◈",
  work: "◆",
  etc:  "◇",
};

const TYPE_COLOR = {
  edu:  "accent",
  cert: "yellow",
  work: "accent",
  etc:  "default",
};

export default function Timeline({ items }) {
  return (
    <>
      <SectionLabel>Education & Certification</SectionLabel>

      <div className={styles.list}>
        {items.map((item) => (
          <div key={item.id} className={styles.item}>
            {/* Left: icon + line */}
            <div className={styles.rail}>
              <div className={[styles.icon, styles[`icon_${item.type}`]].join(" ")}>
                {TYPE_ICON[item.type] || "·"}
              </div>
              <div className={styles.line} />
            </div>

            {/* Right: content */}
            <div className={styles.content}>
              <div className={styles.header}>
                <span className={styles.title}>{item.title}</span>
                {item.period && <span className={styles.period}>{item.period}</span>}
              </div>
              <div className={styles.detail}>
                <Tag variant={TYPE_COLOR[item.type]}>{item.detail}</Tag>
              </div>
              {item.note && (
                <p className={styles.note}>{item.note}</p>
              )}
              {item.tags && item.tags.length > 0 && (
                <div className={styles.tags}>
                  {item.tags.map((t) => <Tag key={t}>{t}</Tag>)}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

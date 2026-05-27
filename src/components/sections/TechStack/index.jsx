import SectionLabel from "../../ui/SectionLabel";
import styles from "./TechStack.module.css";

const LEVEL_LABEL = {
  primary:   "주력",
  secondary: "경험",
  learning:  "학습 중",
};

export default function TechStack({ stack }) {
  return (
    <>
      <SectionLabel>기술 스택</SectionLabel>

      <div className={styles.grid}>
        {stack.map((group) => (
          <div key={group.category} className={styles.group}>
            <div className={styles.groupHeader}>
              <span className={styles.groupIcon}>{group.icon}</span>
              <span className={styles.groupName}>{group.category}</span>
            </div>
            <ul className={styles.items}>
              {group.items.map((item) => (
                <li key={item.name} className={styles.item}>
                  <span className={styles.itemName}>{item.name}</span>
                  <span className={[styles.level, styles[`level_${item.level}`]].join(" ")}>
                    {LEVEL_LABEL[item.level]}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </>
  );
}

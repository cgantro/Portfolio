import SectionLabel from "../../ui/SectionLabel";
import styles from "./TechStack.module.css";

function StarRating({ level }) {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    stars.push(
      <span key={i} className={i <= level ? styles.starFilled : styles.starEmpty}>
        ★
      </span>
    );
  }
  return <div className={styles.starWrap} title={`숙련도: ${level}/5`}>{stars}</div>;
}

function SkillIcon({ icon, name }) {
  if (!icon) {
    return (
      <span className={styles.iconPh} title={name}>
        {name[0]}
      </span>
    );
  }
  return (
    <img
      className={styles.icon}
      src={`https://skillicons.dev/icons?i=${icon}&theme=dark`}
      alt={name}
      width={20}
      height={20}
      loading="lazy"
    />
  );
}

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
                  <SkillIcon icon={item.skillicon} name={item.name} />
                  <span className={styles.itemName}>{item.name}</span>
                  <StarRating level={item.level} />
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </>
  );
}

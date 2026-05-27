import styles from "./SectionLabel.module.css";

export default function SectionLabel({ children }) {
  return (
    <div className={styles.label}>
      <span className={styles.slash}>// </span>
      {children}
    </div>
  );
}

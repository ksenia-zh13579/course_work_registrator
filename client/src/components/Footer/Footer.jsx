import styles from './Footer.module.scss';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.copyright}>
        © 2026 Registrator. Все права защищены.
      </div>
      <div className={styles.authorRow}>
        <span className={styles.icon}>
          <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="15" cy="15" r="14" stroke="rgba(0,0,0,0.62)" strokeWidth="2"/>
            <circle cx="15" cy="11" r="5" fill="rgba(0,0,0,0.62)"/>
            <ellipse cx="15" cy="23" rx="8" ry="5" fill="rgba(0,0,0,0.62)"/>
          </svg>
        </span>
        <span className={styles.footerText}>Автор: Ксения Жужлева</span>
      </div>
      <div className={styles.emailRow}>
        <span className={styles.icon}>
          <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="2" y="7" width="26" height="16" rx="2" stroke="rgba(0,0,0,0.62)" strokeWidth="2"/>
            <path d="M2 9L15 17L28 9" stroke="rgba(0,0,0,0.62)" strokeWidth="2"/>
          </svg>
        </span>
        <span className={styles.footerText}>Email: ksenia.zh13579@mail.ru</span>
      </div>
    </footer>
  );
}

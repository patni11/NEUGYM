import styles from "../styles/Footer.module.css";
import Link from "next/link";

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div>
        <Link href="/feedback">
          <a className={styles.items}>Contact Us</a>
        </Link>

        <Link href="/privacy">
          <a className={styles.items}>Privacy</a>
        </Link>

        <Link href="/terms">
          <a className={styles.items}>Terms</a>
        </Link>
      </div>
    </footer>
  );
};

export default Footer;

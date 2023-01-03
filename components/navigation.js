import React from "react";
import styles from "../styles/Navbar.module.css";
import Link from "next/link";

function Navbar() {
  return (
    <nav className={styles.navbar}>
      <Link href="/">
        <a className={styles.navbarItem}>Data</a>
      </Link>

      <Link href="/about">
        <a className={styles.navbarItem}>About</a>
      </Link>

      <a
        className={styles.navbarItem}
        href="https://forms.gle/zxZQt5spBmQQ2w3K7"
        target="_blank"
        rel="noopener noreferrer"
      >
        Feedback
      </a>
    </nav>
  );
}

export default Navbar;

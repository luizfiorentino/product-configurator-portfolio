import React from "react";
import styles from "./Header.module.css";
import logoSC from "../../public/assets/logo.png";

export default function Header() {
  return (
    <div className={styles.logoAndWelcomeBanner}>
      <div className={styles.iconContainer}>
        <img
          src="../../../assets/logores.png"
          alt="StoneCenter natuursteen logo"
          className={styles.logoIcon}
        />
      </div>
      <h2 className={styles.banner}>
        Welkom bij Online<span className={styles.redText}>Offerte</span>
      </h2>
    </div>
  );
}

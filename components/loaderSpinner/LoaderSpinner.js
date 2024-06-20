import React from "react";
import styles from "./LoaderSpinner.module.css";

export default function LoaderSpinner() {
  return (
    <div className={styles.loading}>
      Online
      <span className={`${styles.red} ${styles.spacingRight}`}>
        Offerte
      </span>{" "}
      laden
      <div className={styles.spinner}></div>
    </div>
  );
}

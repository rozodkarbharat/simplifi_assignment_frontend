import React from "react";
import styles from "../Css/ThankYou.module.css";

const ThankYouPage = ({PageChange}) => {
  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>Thank You!</h1>
      <p className={styles.message}>
        Your registration was successful. We’re excited to have you on board!
      </p>
      <button className={styles.button} onClick={() => PageChange(false)}>
        Go to Registration
      </button>
    </div>
  );
};

export default ThankYouPage;


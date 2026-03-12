import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./MainMenu.module.css";

export default function MainMenu() {
  const navigate = useNavigate();
  const [hasActiveSave, setHasActiveSave] = useState(false);

  useEffect(() => {
    const active = localStorage.getItem("leagueState");

    Promise.resolve().then(() => {
      setHasActiveSave(!!active);
    });
  }, []);

  return (
    <div className={styles.page}>
      {/* HERO SECTION */}
      <div className={styles.heroBackground}>
        <div className={styles.heroCard}>
          <h1 className={styles.appTitle}>GND GM Simulator</h1>

          <h2 className={styles.heroTitle}>Take Control of a Franchise</h2>

          <p className={styles.heroText}>
            For years you’ve watched the games, questioned the draft picks, and
            wondered what you would do if you were in charge.
          </p>

          <p className={styles.heroText}>Now it’s your turn.</p>

          <p className={styles.heroText}>
            Step into the role of General Manager and take control of a
            professional football franchise. Hire your staff. Define your
            identity. Build through the draft or chase elite free agents. Every
            decision is yours — and every result falls on you.
          </p>

          <p className={styles.heroText}>
            Build your roster. Manage the cap. Outthink rival GMs. Bring a
            championship back to your city.
          </p>

          <p className={styles.heroTagline}>
            Select your team → Meet your owner → Take over the front office →
            Build your legacy.
          </p>

          <button
            className={styles.heroCTA}
            onClick={() => navigate("/team-select")}
          >
            Start your GM career — New Franchise
          </button>
        </div>
      </div>

      {/* MENU SECTION */}
      <div className={styles.menuSection}>
        <div className={styles.menuBox}>
          {hasActiveSave ? (
            <button
              className={styles.menuButton}
              onClick={() => navigate("/continue-franchise")}
            >
              Continue Franchise
            </button>
          ) : (
            <button className={styles.menuButtonDisabled}>
              Continue Franchise
            </button>
          )}

          <button
            className={styles.menuButton}
            onClick={() => navigate("/load-franchise")}
          >
            Load Franchise
          </button>

          <button
            className={styles.menuButton}
            onClick={() => navigate("/team-select")}
          >
            New Franchise
          </button>

          <button
            className={styles.menuButton}
            onClick={() => navigate("/settings")}
          >
            Settings
          </button>
        </div>
      </div>
    </div>
  );
}
import { useState, useEffect } from "react";

export default function useSettings() {
  const [settings, setSettings] = useState({
    difficulty: "Pro",
    autosave: true,
    theme: "dark",
    tutorialsReset: false,
  });

  useEffect(() => {
    const saved = localStorage.getItem("appSettings");
    if (saved) {
      Promise.resolve().then(() => {
        setSettings(JSON.parse(saved));
      });
    }
  }, []);

  function updateSetting(key, value) {
    const updated = { ...settings, [key]: value };
    setSettings(updated);
    localStorage.setItem("appSettings", JSON.stringify(updated));
  }

  return { settings, updateSetting };
}
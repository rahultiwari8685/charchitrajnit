"use client"
import React from "react"
import { useTheme } from "./useTheme"

const ThemeSwitcher = () => {
  const { theme, isMounted, toggleTheme, isDark } = useTheme();

  // Render a consistent fallback during SSR and initial hydration
  // This prevents hydration mismatch
  if (!isMounted) {
    return (
      <div className="dark-light-switcher" aria-label="Theme switcher">
        <svg className="svg-dark dark-mode-invert" xmlns="http://www.w3.org/2000/svg" width={20} height={20} viewBox="0 0 20 20" fill="none">
          <path d="M10.0018 0.666992C4.85543 0.666992 0.666656 4.85439 0.666656 10.0008C0.666656 15.1471 4.85543 19.3359 10.0018 19.3359C15.1482 19.3359 19.337 15.1471 19.337 10.0008C19.337 4.85439 15.1482 0.666992 10.0018 0.666992ZM10.7212 2.13662C14.7526 2.49852 17.8982 5.87302 17.8982 10.0008C17.8982 14.1285 14.7526 17.503 10.7212 17.8649V2.13662Z" fill="#0E0E0F" />
        </svg>
      </div>
    );
  }

  return (
    <div onClick={toggleTheme} className="dark-light-switcher" aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}>
      {isDark ? (
        <svg className="svg-white dark-mode-invert" xmlns="http://www.w3.org/2000/svg" width={20} height={20} viewBox="0 0 20 20" fill="none">
          <path d="M10.0018 0.666664C4.85543 0.666664 0.666656 4.85406 0.666656 10.0004C0.666656 15.1468 4.85543 19.3356 10.0018 19.3356C15.1482 19.3356 19.337 15.1468 19.337 10.0004C19.337 4.85406 15.1482 0.666664 10.0018 0.666664ZM10.7212 2.13629C14.7526 2.4982 17.8982 5.87269 17.8982 10.0004C17.8982 14.1282 14.7526 17.5027 10.7212 17.8646V2.13629Z" fill="#75787D" />
        </svg>
      ) : (
        <svg className="svg-dark dark-mode-invert" xmlns="http://www.w3.org/2000/svg" width={20} height={20} viewBox="0 0 20 20" fill="none">
          <path d="M10.0018 0.666992C4.85543 0.666992 0.666656 4.85439 0.666656 10.0008C0.666656 15.1471 4.85543 19.3359 10.0018 19.3359C15.1482 19.3359 19.337 15.1471 19.337 10.0008C19.337 4.85439 15.1482 0.666992 10.0018 0.666992ZM10.7212 2.13662C14.7526 2.49852 17.8982 5.87302 17.8982 10.0008C17.8982 14.1285 14.7526 17.503 10.7212 17.8649V2.13662Z" fill="#0E0E0F" />
        </svg>
      )}
    </div>
  );
};

export default ThemeSwitcher;

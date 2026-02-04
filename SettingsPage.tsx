import React, { useState } from 'react';
import './all.css';

const themes = [
  { name: 'Light', value: 'light' },
  { name: 'Dark', value: 'dark' },
  { name: 'Celestial', value: 'celestrium' }
];

const animations = [
  { name: 'Enabled', value: true },
  { name: 'Disabled', value: false }
];

export default function SettingsPage() {
  const [theme, setTheme] = useState(localStorage.getItem('celestrium-theme') || 'light');
  const [animation, setAnimation] = useState(localStorage.getItem('forsyth-animations') !== 'false');

  const handleThemeChange = (value: string) => {
    setTheme(value);
    localStorage.setItem('celestrium-theme', value);
    document.body.className = value;
  };

  const handleAnimationChange = (value: boolean) => {
    setAnimation(value);
    localStorage.setItem('forsyth-animations', value ? 'true' : 'false');
  };

  return (
    <div className="settings-page">
      <div className="settings-header glass-card">
        <h1>Settings</h1>
        <p>Personalize your experience. Instantly modern, responsive, and epic.</p>
      </div>
      <div className="settings-section glass-card">
        <h2>Theme</h2>
        <div className="settings-options">
          {themes.map(t => (
            <button
              key={t.value}
              className={`settings-btn${theme === t.value ? ' active' : ''}`}
              aria-pressed={theme === t.value}
              onClick={() => handleThemeChange(t.value)}
            >
              {t.name}
            </button>
          ))}
        </div>
      </div>
      <div className="settings-section glass-card">
        <h2>Animations</h2>
        <div className="settings-options">
          {animations.map(a => (
            <button
              key={a.value.toString()}
              className={`settings-btn${animation === a.value ? ' active' : ''}`}
              aria-pressed={animation === a.value}
              onClick={() => handleAnimationChange(a.value)}
            >
              {a.name}
            </button>
          ))}
        </div>
      </div>
      <div className="settings-footer">
        <p>Made with <span style={{color:'#9333ea'}}>♥</span> for Forsyth Portal</p>
      </div>
    </div>
  );
}

import React, { useState } from 'react';
import { RecoilRoot } from 'recoil';
import { Router } from '@reach/router';
import LoginView from './views/Login';
import SignupView from './views/Signup';
import MainView from './views/Main';
import SettingsView from './views/Settings';
import ThemeContext from './context/ThemeContext';

export default function App() {
  const [theme, setTheme] = useState('light');

  function toggleTheme() {
    setTheme(theme === 'light' ? 'dark' : 'light');
  }

  // always apply theme
  if (theme === 'light') {
    document.body.className = 'light-theme';
  } else if (theme === 'dark') {
    document.body.className = 'dark-theme';
  }

  return (
    <RecoilRoot>
      <ThemeContext.Provider value={{ theme, toggleTheme }}>
        <Router>
          <MainView path="/" />
          <LoginView path="/login" />
          <SignupView path="/signup" />
          <SettingsView path="/settings" />
        </Router>
      </ThemeContext.Provider>
    </RecoilRoot>
  );
}

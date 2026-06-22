'use client';

import React from 'react';
import { useTheme } from './ThemeProvider';
import { Button } from '../ui/Button';

export const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <Button variant="outline" onClick={toggleTheme} style={{ padding: '8px', fontSize: '1.2rem', borderRadius: '50%', width: '42px', height: '42px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      {theme === 'light' ? '🌙' : '☀️'}
    </Button>
  );
};

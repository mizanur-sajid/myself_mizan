'use client';

import React from 'react';
import { useTheme } from './ThemeProvider';
import { Button } from '../ui/Button';

export const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <Button variant="outline" onClick={toggleTheme} style={{ padding: '8px 16px', fontSize: '0.875rem' }}>
      {theme === 'light' ? '🌙 Dark Mode' : '☀️ Light Mode'}
    </Button>
  );
};

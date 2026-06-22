import React from 'react';
import styles from './Button.module.css';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'primary' | 'outline' | 'neon';
}

export const Button: React.FC<ButtonProps> = ({ children, variant = 'primary', className, ...props }) => {
  return (
    <button className={`${styles.btn} ${styles[variant]} ${className || ''}`} {...props}>
      {children}
    </button>
  );
};

import { motion } from 'motion/react';
import React, { ReactNode } from 'react';

interface ButtonProps {
  children: ReactNode;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  variant?: 'solid' | 'outline' | 'ghost';
  color?: 'primary' | 'accent' | 'success';
  className?: string;
  disabled?: boolean;
}

export const Button = ({
  children,
  onClick,
  variant = 'solid',
  color = 'primary',
  className = '',
  disabled = false,
}: ButtonProps) => {
  const baseStyles = 'px-6 py-3 rounded-xl font-bold transition-all flex items-center justify-center gap-2 disabled:opacity-50';
  
  const variants = {
    solid: {
      primary: 'bg-primary text-white hover:bg-opacity-90',
      accent: 'bg-accent text-white hover:bg-opacity-90',
      success: 'bg-success text-white hover:bg-opacity-90',
    },
    outline: {
      primary: 'border-2 border-primary text-primary hover:bg-primary hover:text-white',
      accent: 'border-2 border-accent text-accent hover:bg-accent hover:text-white',
      success: 'border-2 border-success text-success hover:bg-success hover:text-white',
    },
    ghost: {
      primary: 'text-primary hover:bg-primary/10',
      accent: 'text-accent hover:bg-accent/10',
      success: 'text-success hover:bg-success/10',
    },
  };

  return (
    <motion.button
      whileTap={{ scale: 0.95 }}
      whileHover={{ scale: 1.02 }}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${variants[variant][color]} ${className}`}
    >
      {children}
    </motion.button>
  );
};

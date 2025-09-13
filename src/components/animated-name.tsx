'use client';

import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface AnimatedNameProps {
  name: string;
  className?: string;
}

const AnimatedName = ({ name, className }: AnimatedNameProps) => {
  const [displayedName, setDisplayedName] = useState(name);
  const [isAnimating, setIsAnimating] = useState(false);

  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const symbols = '!@#$%^&*()_+-=[]{}|;:",./<>?`~';
  const numbers = '0123456789';
  const charset = letters + symbols + numbers;

  let interval: NodeJS.Timeout | null = null;

  const scramble = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    let iteration = 0;

    if (interval) {
      clearInterval(interval);
    }

    interval = setInterval(() => {
      setDisplayedName(
        name
          .split('')
          .map((letter, index) => {
            if (index < iteration) {
              return name[index];
            }
            if (letter === ' ') return ' ';
            return charset[Math.floor(Math.random() * charset.length)];
          })
          .join('')
      );

      if (iteration >= name.length) {
        if (interval) clearInterval(interval);
        setIsAnimating(false);
      }

      iteration += 1 / 3;
    }, 40);
  };

  useEffect(() => {
    scramble();
    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, []);

  return (
    <h1
      className={cn(
        "text-5xl md:text-7xl font-bold font-headline mb-4 text-primary transition-colors duration-500",
        className
      )}
      onMouseEnter={scramble}
    >
      {displayedName}
    </h1>
  );
};

export default AnimatedName;

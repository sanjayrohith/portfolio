'use client';

import { cn } from '@/lib/utils';
import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

const navLinks = [
  { name: 'Home', href: '#home' },
  { name: 'About', href: '#about' },
  { name: 'Skills', href: '#skills' },
  { name: 'Projects', href: '#projects' },
  { name: 'Contact', href: '#contact' },
];

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [currentHash, setCurrentHash] = useState<string>('#home');

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
      if (window.location.hash) setCurrentHash(window.location.hash);
    };
    window.addEventListener('scroll', handleScroll);
    window.addEventListener('hashchange', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header
      className={cn(
        'fixed top-4 left-1/2 -translate-x-1/2 z-50 transition-all duration-300 w-full px-4'
      )}
    >
      <div
        className={cn(
          'relative max-w-max mx-auto transition-all duration-300 flex items-center justify-between rounded-full',
          isScrolled
            ? 'bg-secondary/50 backdrop-blur-md border border-border/20 shadow-lg px-6 h-14'
            : 'h-12 px-4'
        )}
      >
  {/* Removed stray brand initial on mobile to keep only the hamburger icon */}
        <nav
          className={cn(
            'hidden md:flex items-center gap-x-2',
          )}
        >
      {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
        className="px-4 py-2 text-lg text-foreground hover:text-primary transition-colors duration-300 rounded-full hover:bg-primary/10 focus:outline-none focus:ring-2 focus:ring-primary/50"
        aria-current={currentHash === link.href ? 'page' : undefined}
            >
              {link.name}
            </a>
          ))}
          {/* Glassmorphic Resume Button */}
          <a
            href="https://drive.google.com/file/d/1InIAMC5cM64krOUjclTahrxp5HP5dPsj/view?usp=sharing"
            target="_blank"
            rel="noopener noreferrer"
            className="ml-2 group inline-flex items-center px-5 py-2 text-sm font-medium rounded-full border border-white/20 bg-white/10 backdrop-blur-xl shadow-sm hover:bg-white/20 hover:border-white/30 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:ring-offset-2 focus:ring-offset-background"
          >
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary via-primary/80 to-primary/60 group-hover:from-primary group-hover:via-primary group-hover:to-primary/80">
              MyResume
            </span>
          </a>
        </nav>
        <div className="md:hidden">
          <Button onClick={toggleMenu} variant="ghost" size="icon" aria-expanded={isMenuOpen} aria-label="Toggle navigation">
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>
      </div>
       {isMenuOpen && (
        <div className="md:hidden mt-2">
      <div className="relative overflow-hidden rounded-3xl p-4 backdrop-blur-xl bg-background/50 supports-[backdrop-filter]:bg-background/30 border border-border/30 shadow-2xl ring-1 ring-foreground/10">
            <nav className="flex flex-col items-center space-y-4">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
        className="px-4 py-2 text-lg text-foreground/90 hover:text-primary transition-colors duration-300 rounded-xl hover:bg-foreground/5 w-full text-center"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.name}
                </a>
              ))}
              <a
                href="https://drive.google.com/file/d/1InIAMC5cM64krOUjclTahrxp5HP5dPsj/view?usp=sharing"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setIsMenuOpen(false)}
                className="mt-2 group inline-flex items-center justify-center w-full px-5 py-2 text-sm font-medium rounded-xl border border-white/20 bg-white/10 backdrop-blur-xl shadow-sm hover:bg-white/20 hover:border-white/30 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:ring-offset-2 focus:ring-offset-background"
              >
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary via-primary/80 to-primary/60 group-hover:from-primary group-hover:via-primary group-hover:to-primary/80">
                  MyResume
                </span>
              </a>
            </nav>
          </div>
        </div>
      )}
    </header>
  );
}

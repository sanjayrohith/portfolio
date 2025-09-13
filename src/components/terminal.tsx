'use client';

import { useEffect, useState, useRef } from 'react';
import { Skeleton } from './ui/skeleton';
import DOMPurify from 'dompurify';

interface TerminalProps {
  skills: string[];
  experience: string;
  title: string;
}

export default function Terminal({ skills, experience, title }: Readonly<TerminalProps>) {
  const [output, setOutput] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);

  // Build local terminal outputs (no external API)
  const buildBashOutput = (s: string[], exp: string) => {
    const now = new Date().toLocaleString();
    const skillLines = s.map((x) => `  - ${x}`).join('\n');
    const ascii = [
      '     ____          _            ____                  ',
      '    / ___|___   __| | ___  ___ / ___|  ___ _ __ ___  ',
      "   | |   / _ \\ / _` |/ _ \\/ __|\\___ \\ / __| '__/ _ \\ ",
      '   | |__| (_) | (_| |  __/\\__ \\ ___) | (__| | | (_) |',
      '    \\____\\___/ \\__,_|\\___||___/|____/ \\___|_|  \\___/ ',
    ].join('\n');

    return [
      `Last login: ${now} on ttys000`,
      `sanjay@codesphere:~$ echo "Welcome to CodeSphere"`,
      `Welcome to CodeSphere`,
      `sanjay@codesphere:~$ neofetch`,
      ascii,
      '',
      `User:       Sanjay Rohith`,
      `Shell:      bash`,
      `OS:         Linux`,
      `Editor:     VS Code`,
      '',
      `sanjay@codesphere:~$ cat skills.txt`,
      `Skills:`,
      skillLines || '  - (none provided)',
      '',
      `sanjay@codesphere:~$ echo "Experience summary"`,
      exp || '(no summary provided)',
      '',
      `sanjay@codesphere:~$ _<span class="cursor"></span>`,
    ].join('\n');
  };

  const buildExperienceScript = (s: string[], exp: string) => {
    const skillLines = s.map((x) => ` • ${x}`).join('\n');
    return [
      `sanjay@codesphere:~$ chmod +x experience.sh`,
      `sanjay@codesphere:~$ ./experience.sh`,
      `#!/bin/bash`,
      `echo "==== Experience ===="`,
      `echo`,
      `cat <<'EOF'`,
      exp || '(no experience provided)',
      `EOF`,
      '',
      `echo`,
      `echo "==== Top Skills ===="`,
      skillLines || ' • (none provided)',
      '',
      `echo "Done."`,
      '',
      `sanjay@codesphere:~$ _<span class="cursor"></span>`,
    ].join('\n');
  };

  const buildTerminalText = (t: string, s: string[], exp: string) => {
    const isExperience = t.toLowerCase().includes('experience');
    return isExperience ? buildExperienceScript(s, exp) : buildBashOutput(s, exp);
  };

  useEffect(() => {
    const terminalText = buildTerminalText(title, skills, experience);
    setIsLoading(true);
    setOutput('');
    let currentIndex = 0;

    const interval = setInterval(() => {
      if (currentIndex < terminalText.length) {
        setOutput((prev: string) => prev + terminalText[currentIndex]);
        currentIndex++;
        if (containerRef.current) {
          containerRef.current.scrollTop = containerRef.current.scrollHeight;
        }
      } else {
        clearInterval(interval);
        setIsLoading(false);
      }
    }, 8);

    return () => clearInterval(interval);
  }, [skills, experience, title]);

  const createMarkup = (text: string) => {
    // Only allow minimal markup (span with class="cursor"); strip everything else
    const sanitized = DOMPurify.sanitize(text, {
      ALLOWED_TAGS: ['span'],
      ALLOWED_ATTR: ['class'],
      ALLOW_DATA_ATTR: false,
    });
    const textWithBlinkingCursor = sanitized.replace(
      '<span class="cursor"></span>',
      '<span class="inline-block w-2 h-5 bg-primary animate-blink relative top-1"></span>'
    );
    return { __html: textWithBlinkingCursor } as { __html: string };
  };

  return (
    <div className="bg-secondary/50 backdrop-blur-sm border border-border rounded-lg shadow-lg max-w-4xl w-full font-code">
      <div className="flex items-center p-3 border-b border-border">
        <div className="flex space-x-2">
          <div className="w-3 h-3 rounded-full bg-[#FF605C]"></div>
          <div className="w-3 h-3 rounded-full bg-[#FFBD44]"></div>
          <div className="w-3 h-3 rounded-full bg-[#00CA4E]"></div>
        </div>
        <div className="flex-grow text-center text-sm text-muted-foreground">{title}</div>
      </div>
      <div
        ref={containerRef}
        className="p-4 h-64 overflow-y-auto text-primary text-sm md:text-base"
      >
        {isLoading && output.length === 0 ? (
          <div className="space-y-2">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
          </div>
        ) : (
          <pre className="whitespace-pre-wrap" dangerouslySetInnerHTML={createMarkup(output)} />
        )}
      </div>
    </div>
  );
}

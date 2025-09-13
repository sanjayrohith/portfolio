import { Github, Linkedin } from 'lucide-react';

const socialLinks = [
  {
    name: 'GitHub',
    href: 'https://github.com/sanjayrohith',
    icon: <Github className="h-6 w-6" />,
  },
  {
    name: 'LinkedIn',
    href: 'https://www.linkedin.com/in/sanjayrohith18/',
    icon: <Linkedin className="h-6 w-6" />,
  },
];

export default function Footer() {
  return (
    <footer className="bg-secondary py-8 mt-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center text-muted-foreground">
        <div className="flex justify-center space-x-6 mb-4">
          {socialLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-primary transition-colors duration-300"
              aria-label={link.name}
            >
              {link.icon}
            </a>
          ))}
        </div>
        <p>&copy; 2025 Sanjay Rohith. All rights reserved.</p>
      </div>
    </footer>
  );
}

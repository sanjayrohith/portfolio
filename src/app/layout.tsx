import type { Metadata } from 'next';
import './globals.css';
import { cn } from '@/lib/utils';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import { Toaster } from '@/components/ui/toaster';
import ThreeDBackground from '@/components/3d-background';

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://example.com'),
  title: {
    default: 'Sanjay Rohith — Portfolio',
    template: '%s | Sanjay Rohith',
  },
  description: 'Frontend & App Developer. Browser Extensions, ML, and modern web UIs.',
  openGraph: {
    title: 'Sanjay Rohith — Portfolio',
    description: 'Frontend & App Developer. Browser Extensions, ML, and modern web UIs.',
    url: '/',
    siteName: 'Sanjay Rohith Portfolio',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Sanjay Rohith — Portfolio',
    description: 'Frontend & App Developer. Browser Extensions, ML, and modern web UIs.',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;700&display=swap" rel="stylesheet" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Person',
              name: 'Sanjay Rohith',
              url: process.env.NEXT_PUBLIC_SITE_URL || 'https://example.com',
              sameAs: [
                'https://github.com/sanjayrohith',
                'https://www.linkedin.com/in/sanjayrohith18/',
              ],
              jobTitle: 'Frontend & App Developer',
            }),
          }}
        />
      </head>
      <body className={cn('font-body antialiased')}>
        <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 bg-primary text-primary-foreground rounded px-3 py-2">Skip to content</a>
        <ThreeDBackground />
        <Header />
        <main id="main">{children}</main>
        <Footer />
        <Toaster />
      </body>
    </html>
  );
}

import type { Metadata } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
});

export const metadata: Metadata = {
  title: 'README2Video - Transform README into Promo Videos',
  description: 'Turn your GitHub README into a professional promotional video with AI',
  openGraph: {
    title: 'README2Video',
    description: 'Transform your README into a professional promo video',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} ${jetbrainsMono.variable} font-sans`}>
        <div className="min-h-screen bg-background grid-bg">
          {children}
        </div>
      </body>
    </html>
  );
}

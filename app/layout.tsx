import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Cabinet Trip 2026 — Expense Calculator',
  description:
    'Trip expense calculator for Cabinet Trip 2026. Track shared expenses, manage COMPANY funds, split costs equally, and export CSV reports.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
      </head>
      <body className="antialiased">{children}</body>
    </html>
  );
}

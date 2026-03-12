import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/hooks/useAuth';
import Navbar from '@/components/Navbar';

const inter = Inter({ subsets: ['latin'], display: 'swap' });

export const metadata: Metadata = {
  title: 'RandomChat – Live Random Video Chat | Meet Strangers',
  description:
    'Meet strangers from around the world via live video chat. Filter by gender & country. Instant connections, 100% free. Like Azar – but yours.',
  keywords: 'random video chat, meet strangers, live chat, azar alternative, video call',
  openGraph: {
    title: 'RandomChat – Live Random Video Chat',
    description: 'Meet people across the globe via instant live video chat.',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
      </head>
      <body className={`${inter.className} bg-[#0a0a0f] text-white antialiased`}>
        <AuthProvider>
          <Navbar />
          <main className="pt-16">{children}</main>
        </AuthProvider>
      </body>
    </html>
  );
}

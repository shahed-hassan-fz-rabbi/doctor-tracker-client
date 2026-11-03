import { Inter, Manrope } from 'next/font/google';
import Providers from '@/providers/Providers';
import '@/styles/globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' });
const manrope = Manrope({ subsets: ['latin'], variable: '--font-manrope', display: 'swap' });

export const metadata = {
  title: {
    default: 'Doctor Tracker — Healthcare Administration',
    template: '%s · Doctor Tracker',
  },
  description:
    'A secure healthcare administration portal to manage doctors, their patients and operational analytics.',
};

export const viewport = {
  themeColor: '#101B0B',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${inter.variable} ${manrope.variable}`}>
      <body className="bg-ivory text-ink antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

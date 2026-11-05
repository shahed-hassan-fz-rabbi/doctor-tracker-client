import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import BrandMark from '@/components/ui/BrandMark';

const footerLinks = [
  ['About', '#about'],
  ['Features', '#features'],
  ['How It Works', '#how-it-works'],
  ['Contact', '#contact'],
];

export default function PublicFooter() {
  return (
    <footer className="bg-forest text-ivory">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-12 sm:px-8 md:grid-cols-[1.3fr_0.7fr_0.7fr] md:gap-12 lg:px-10 lg:py-16">
        <div className="max-w-sm">
          <Link href="/" aria-label="Doctor Tracker home" className="inline-flex items-center gap-3 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lime focus-visible:ring-offset-2 focus-visible:ring-offset-forest">
            <BrandMark size={42} />
            <span className="font-display text-lg font-extrabold text-white">Doctor Tracker</span>
          </Link>
          <p className="mt-4 text-sm leading-6 text-ivory/65">A centralized workspace for healthcare administration, records management, and operational insight.</p>
        </div>

        <div>
          <h2 className="font-display text-sm font-bold text-white">Explore</h2>
          <ul className="mt-4 space-y-3">
            {footerLinks.map(([label, href]) => <li key={href}><a href={href} className="text-sm text-ivory/65 transition hover:text-lime-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lime">{label}</a></li>)}
          </ul>
        </div>

        <div>
          <h2 className="font-display text-sm font-bold text-white">Platform</h2>
          <ul className="mt-4 space-y-3">
            <li><a href="#features" className="text-sm text-ivory/65 transition hover:text-lime-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lime">Doctor and patient management</a></li>
            <li><a href="#features" className="text-sm text-ivory/65 transition hover:text-lime-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lime">Analytics and insights</a></li>
            <li><Link href="/login" className="inline-flex items-center gap-1 text-sm font-semibold text-lime-soft transition hover:text-lime focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lime">Admin Login <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" /></Link></li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-5 py-5 text-xs text-ivory/50 sm:px-8 md:flex-row md:items-center md:justify-between lg:px-10">
          <p>© {new Date().getFullYear()} Doctor Tracker. All rights reserved.</p>
          <p>Healthcare administration, made clearer.</p>
        </div>
      </div>
    </footer>
  );
}

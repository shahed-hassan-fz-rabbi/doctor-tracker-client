import Link from 'next/link';
import {
  ArrowRight,
  ArrowUpRight,
  BarChart3,
  Check,
  ClipboardList,
  HeartPulse,
  LayoutDashboard,
  LockKeyhole,
  Smartphone,
  Stethoscope,
  UsersRound,
} from 'lucide-react';
import PublicNavbar from '@/components/public/PublicNavbar';
import PublicFooter from '@/components/public/PublicFooter';

export const metadata = {
  title: { absolute: 'Doctor Tracker | Healthcare Management Platform' },
  description:
    'Doctor Tracker helps healthcare administrators organize doctor and patient records, manage workflows, and review operational insights from one secure platform.',
};

const features = [
  {
    icon: Stethoscope,
    title: 'Doctor management',
    description: 'Organize doctor profiles, specializations, and professional information in one place.',
  },
  {
    icon: UsersRound,
    title: 'Patient management',
    description: 'Maintain structured patient records through authorized dashboard workflows.',
  },
  {
    icon: BarChart3,
    title: 'Analytics and insights',
    description: 'Review operational summaries and understand doctor and patient trends.',
  },
  {
    icon: LockKeyhole,
    title: 'Secure admin access',
    description: 'Keep administrative tools behind protected administrator authentication.',
  },
  {
    icon: LayoutDashboard,
    title: 'Centralized dashboard',
    description: 'Navigate key administrative workflows from a single, organized workspace.',
  },
  {
    icon: Smartphone,
    title: 'Responsive experience',
    description: 'Use the administrative interface across desktop, tablet, and mobile screens.',
  },
];

const benefits = [
  'Centralized administration',
  'Organized records',
  'Straightforward navigation',
  'Clear operational insights',
  'Protected administrator access',
  'Responsive interface',
];

function DashboardPreview() {
  return (
    <div className="relative mx-auto w-full max-w-[590px]">
      <div className="absolute -inset-5 rounded-[2.5rem] bg-lime/20 blur-2xl" aria-hidden="true" />
      <div className="relative rounded-[1.7rem] border border-white/80 bg-white p-2 shadow-[0_28px_80px_rgba(16,27,11,0.16)] sm:rounded-[2rem] sm:p-3">
        <div className="overflow-hidden rounded-[1.25rem] bg-forest text-ivory sm:rounded-[1.5rem]">
          <div className="flex items-center justify-between border-b border-white/10 px-4 py-3 sm:px-5 sm:py-4">
            <div className="flex items-center gap-2.5">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-lime text-forest">
                <HeartPulse className="h-4 w-4" aria-hidden="true" />
              </span>
              <div>
                <p className="font-display text-xs font-bold text-white sm:text-sm">Doctor Tracker</p>
                <p className="text-[10px] text-ivory/50 sm:text-[11px]">Healthcare workspace</p>
              </div>
            </div>
            <span className="rounded-full border border-lime/25 bg-lime/10 px-2.5 py-1 text-[9px] font-semibold tracking-wide text-lime-soft sm:text-[10px]">
              OVERVIEW
            </span>
          </div>

          <div className="grid grid-cols-[112px_1fr] sm:grid-cols-[150px_1fr]">
            <aside className="space-y-1 border-r border-white/10 p-3 sm:p-4" aria-label="Illustrative dashboard navigation">
              {[
                ['Overview', LayoutDashboard],
                ['Doctors', Stethoscope],
                ['Patients', UsersRound],
                ['Analytics', BarChart3],
              ].map(([label, Icon], index) => (
                <div
                  key={label}
                  className={`flex items-center gap-2 rounded-lg px-2 py-2 text-[10px] sm:gap-2.5 sm:px-3 sm:text-xs ${
                    index === 0 ? 'bg-lime font-semibold text-forest' : 'text-ivory/55'
                  }`}
                >
                  <Icon className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                  <span>{label}</span>
                </div>
              ))}
            </aside>

            <div className="min-w-0 p-3 sm:p-5">
              <div className="mb-3 sm:mb-4">
                <p className="font-display text-sm font-bold text-white sm:text-lg">Operational overview</p>
                <p className="mt-1 text-[10px] text-ivory/55 sm:text-xs">A clear view of administrative workflows</p>
              </div>

              <div className="grid grid-cols-3 gap-2 sm:gap-3">
                {[
                  ['Doctor roster', Stethoscope],
                  ['Patient records', ClipboardList],
                  ['Insights', BarChart3],
                ].map(([label, Icon]) => (
                  <div key={label} className="rounded-xl border border-white/10 bg-white/[0.06] p-2.5 sm:rounded-2xl sm:p-3.5">
                    <span className="mb-2 flex h-6 w-6 items-center justify-center rounded-md bg-lime/15 text-lime sm:h-8 sm:w-8 sm:rounded-lg">
                      <Icon className="h-3.5 w-3.5 sm:h-4 sm:w-4" aria-hidden="true" />
                    </span>
                    <p className="text-[9px] font-semibold leading-tight text-ivory/80 sm:text-[11px]">{label}</p>
                    <div className="mt-2 h-1 rounded-full bg-white/10">
                      <div className="h-1 w-2/3 rounded-full bg-lime/70" />
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-3 rounded-xl border border-white/10 bg-white/[0.06] p-3 sm:mt-4 sm:rounded-2xl sm:p-4">
                <div className="mb-3 flex items-center justify-between gap-2">
                  <div>
                    <p className="text-[10px] font-semibold text-ivory/90 sm:text-xs">Workflow activity</p>
                    <p className="mt-0.5 text-[9px] text-ivory/45 sm:text-[10px]">Illustrative interface preview</p>
                  </div>
                  <BarChart3 className="h-4 w-4 text-lime-soft" aria-hidden="true" />
                </div>
                <div className="flex h-20 items-end gap-1.5 border-b border-l border-white/10 px-2 sm:h-28 sm:gap-2.5 sm:px-3" aria-hidden="true">
                  {[30, 46, 38, 62, 52, 76, 58, 86, 68, 94, 72, 82].map((height, index) => (
                    <div key={index} className="flex h-full flex-1 items-end">
                      <span className="w-full rounded-t bg-gradient-to-t from-lime/40 to-lime/90" style={{ height: `${height}%` }} />
                    </div>
                  ))}
                </div>
                <p className="mt-2 text-right text-[9px] text-ivory/40">No live or patient data shown</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="absolute -bottom-4 -left-2 hidden items-center gap-2 rounded-xl border border-line bg-white px-4 py-3 shadow-card sm:flex">
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-lime/25 text-forest">
          <Check className="h-4 w-4" aria-hidden="true" />
        </span>
        <span className="text-xs font-semibold text-ink">Designed for clear workflows</span>
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <div className="min-h-screen overflow-x-clip bg-ivory text-ink">
      <PublicNavbar />
      <main>
        <section id="home" className="relative scroll-mt-24 overflow-hidden pb-16 pt-12 sm:pb-24 sm:pt-16 lg:pb-28 lg:pt-20">
          <div className="pointer-events-none absolute -right-24 top-16 h-80 w-80 rounded-full bg-lime/20 blur-3xl" aria-hidden="true" />
          <div className="pointer-events-none absolute -left-24 bottom-0 h-72 w-72 rounded-full bg-forest/5 blur-3xl" aria-hidden="true" />
          <div className="relative mx-auto grid w-full max-w-7xl items-center gap-12 px-5 sm:px-8 lg:grid-cols-[0.95fr_1.05fr] lg:gap-10 lg:px-10">
            <div className="max-w-2xl">
              <p className="inline-flex items-center gap-2 rounded-full border border-forest/10 bg-white/70 px-3.5 py-2 text-[10px] font-bold tracking-[0.16em] text-forest sm:text-xs">
                <span className="h-2 w-2 rounded-full bg-lime ring-4 ring-lime/20" aria-hidden="true" />
                SMART HEALTHCARE MANAGEMENT PLATFORM
              </p>
              <h1 className="mt-6 max-w-2xl font-display text-[2.65rem] font-extrabold leading-[1.08] tracking-tight text-forest sm:text-5xl lg:text-[3.7rem]">
                Manage Your Healthcare Operations <span className="text-forest/55">with Confidence.</span>
              </h1>
              <p className="mt-6 max-w-xl text-base leading-7 text-ink-soft sm:text-lg sm:leading-8">
                Doctor Tracker helps healthcare administrators organize doctors, manage patient records, monitor operations, and access meaningful insights through one centralized platform.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link href="/login" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-forest px-5 py-3 text-sm font-bold text-white shadow-card transition hover:-translate-y-0.5 hover:bg-forest-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest focus-visible:ring-offset-2">
                  Access Admin Dashboard <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
                <a href="#features" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-line bg-white/70 px-5 py-3 text-sm font-bold text-forest transition hover:border-forest/20 hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest focus-visible:ring-offset-2">
                  Explore Features <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                </a>
              </div>
              <div className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs font-medium text-ink-soft">
                <span className="inline-flex items-center gap-2"><LockKeyhole className="h-4 w-4 text-forest" aria-hidden="true" /> Protected admin access</span>
                <span className="inline-flex items-center gap-2"><HeartPulse className="h-4 w-4 text-forest" aria-hidden="true" /> Built for healthcare operations</span>
              </div>
            </div>
            <DashboardPreview />
          </div>
        </section>

        <section id="about" className="scroll-mt-24 border-y border-line bg-white py-16 sm:py-20 lg:py-24">
          <div className="mx-auto grid max-w-7xl gap-10 px-5 sm:px-8 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20 lg:px-10">
            <div>
              <p className="text-xs font-bold tracking-[0.16em] text-forest">ABOUT DOCTOR TRACKER</p>
              <h2 className="mt-4 font-display text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">About Doctor Tracker</h2>
              <p className="mt-4 font-display text-lg font-bold text-forest sm:text-xl">A more organized way to manage the work behind care.</p>
            </div>
            <div>
              <p className="text-base leading-8 text-ink-soft sm:text-lg">
                Doctor Tracker is a centralized healthcare management platform designed to simplify administrative workflows. It provides a structured environment for managing doctor information, patient records, and operational insights.
              </p>
              <div className="mt-7 grid gap-4 sm:grid-cols-2">
                {[
                  'Simplify healthcare administration.',
                  'Organize doctor and patient information.',
                  'Improve administrative visibility.',
                  'Support informed operational decisions.',
                ].map((text) => <p key={text} className="flex items-start gap-3 text-sm font-semibold leading-6 text-ink"><span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-lime/40 text-forest"><Check className="h-3 w-3" aria-hidden="true" /></span>{text}</p>)}
              </div>
            </div>
          </div>
        </section>

        <section id="features" className="scroll-mt-24 py-16 sm:py-20 lg:py-24">
          <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
            <div className="mx-auto max-w-2xl text-center">
              <p className="text-xs font-bold tracking-[0.16em] text-forest">A CONNECTED WORKSPACE</p>
              <h2 className="mt-4 font-display text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">Tools for confident administration</h2>
              <p className="mt-4 text-base leading-7 text-ink-soft">Keep everyday management tasks organized in a secure, straightforward interface.</p>
            </div>
            <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:mt-14 lg:grid-cols-3 lg:gap-5">
              {features.map(({ icon: Icon, title, description }) => (
                <article key={title} className="group rounded-2xl border border-line bg-white p-6 shadow-soft transition duration-200 hover:-translate-y-1 hover:shadow-card sm:p-7">
                  <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-lime/30 text-forest transition group-hover:bg-lime"><Icon className="h-5 w-5" aria-hidden="true" /></span>
                  <h3 className="mt-5 font-display text-lg font-bold text-ink">{title}</h3>
                  <p className="mt-2 text-sm leading-6 text-ink-soft">{description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="how-it-works" className="scroll-mt-24 bg-forest py-16 text-ivory sm:py-20 lg:py-24">
          <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
            <div className="max-w-2xl">
              <p className="text-xs font-bold tracking-[0.16em] text-lime-soft">HOW IT WORKS</p>
              <h2 className="mt-4 font-display text-3xl font-extrabold tracking-tight text-white sm:text-4xl">A clear path through daily workflows.</h2>
            </div>
            <div className="mt-10 grid gap-4 md:grid-cols-3 lg:mt-14 lg:gap-5">
              {[
                ['01', 'Secure admin login', 'Authorized administrators sign in through the protected login page.'],
                ['02', 'Manage healthcare records', 'Manage doctor and patient information through the dashboard.'],
                ['03', 'Monitor operations', 'Review analytics and operational summaries in one workspace.'],
              ].map(([step, title, description]) => (
                <article key={step} className="rounded-2xl border border-white/10 bg-white/[0.05] p-6 sm:p-7">
                  <span className="font-display text-sm font-extrabold tracking-wider text-lime">{step}</span>
                  <h3 className="mt-4 font-display text-lg font-bold text-white">{title}</h3>
                  <p className="mt-2 text-sm leading-6 text-ivory/65">{description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-white py-16 sm:py-20 lg:py-24" aria-labelledby="why-title">
          <div className="mx-auto grid max-w-7xl items-center gap-10 px-5 sm:px-8 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20 lg:px-10">
            <div className="rounded-[2rem] border border-line bg-ivory p-7 sm:p-10">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-forest text-lime"><HeartPulse className="h-7 w-7" aria-hidden="true" /></div>
              <p className="mt-7 font-display text-2xl font-bold leading-snug text-forest sm:text-3xl">Bring essential administrative workflows into clearer focus.</p>
              <p className="mt-4 text-sm leading-7 text-ink-soft">A calm, structured workspace helps teams find the information they need and stay oriented as work moves forward.</p>
            </div>
            <div>
              <p className="text-xs font-bold tracking-[0.16em] text-forest">WHY DOCTOR TRACKER</p>
              <h2 id="why-title" className="mt-4 font-display text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">Designed around administrative clarity.</h2>
              <p className="mt-4 text-base leading-7 text-ink-soft">Doctor Tracker brings the core management experience together without exposing sensitive records publicly.</p>
              <ul className="mt-7 grid gap-3 sm:grid-cols-2">
                {benefits.map((benefit) => <li key={benefit} className="flex items-center gap-3 text-sm font-semibold text-ink"><span className="flex h-6 w-6 items-center justify-center rounded-full bg-lime/35 text-forest"><Check className="h-3.5 w-3.5" aria-hidden="true" /></span>{benefit}</li>)}
              </ul>
            </div>
          </div>
        </section>

        <section className="px-5 py-16 sm:px-8 sm:py-20 lg:px-10 lg:py-24">
          <div className="mx-auto max-w-7xl overflow-hidden rounded-[2rem] bg-forest px-6 py-10 text-center shadow-lift sm:px-12 sm:py-14">
            <div className="mx-auto max-w-2xl">
              <p className="text-xs font-bold tracking-[0.16em] text-lime-soft">YOUR ADMINISTRATIVE WORKSPACE</p>
              <h2 className="mt-4 font-display text-3xl font-extrabold tracking-tight text-white sm:text-4xl">Ready to Simplify Healthcare Administration?</h2>
              <p className="mt-4 text-sm leading-7 text-ivory/70 sm:text-base">Access your centralized Doctor Tracker dashboard and manage administrative workflows efficiently.</p>
              <Link href="/login" className="mt-7 inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-lime px-5 py-3 text-sm font-bold text-forest shadow-soft transition hover:-translate-y-0.5 hover:bg-lime-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lime focus-visible:ring-offset-2 focus-visible:ring-offset-forest">
                Go to Admin Login <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>
          </div>
        </section>

        <section id="contact" className="scroll-mt-24 border-t border-line bg-white py-14 sm:py-16">
          <div className="mx-auto flex max-w-7xl flex-col gap-5 px-5 sm:px-8 md:flex-row md:items-center md:justify-between lg:px-10">
            <div className="max-w-2xl">
              <p className="text-xs font-bold tracking-[0.16em] text-forest">CONTACT</p>
              <h2 className="mt-3 font-display text-2xl font-extrabold text-ink">Questions about Doctor Tracker?</h2>
              <p className="mt-2 text-sm leading-6 text-ink-soft">For product enquiries or access help, contact the platform administrator through your organization&apos;s established support channel.</p>
            </div>
            <Link href="/login" className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 self-start rounded-xl border border-line px-4 py-2.5 text-sm font-bold text-forest transition hover:border-forest/20 hover:bg-ivory focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest focus-visible:ring-offset-2 md:self-center">
              Admin Login <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        </section>
      </main>
      <PublicFooter />
    </div>
  );
}

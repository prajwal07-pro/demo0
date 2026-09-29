import { Link } from 'react-router-dom';
import { Github, Mail, Globe, Twitter, Linkedin, Shield } from 'lucide-react';
import { OrcaLogo } from './Navbar';
import { cn } from '@/lib/utils';
import { FOOTER_NAV } from '@/lib/constants';
import { DataStream } from '@/components/ui/DataStream';

const SOCIAL_LINKS = [
  { icon: Github, label: 'GitHub', href: 'https://github.com' },
  { icon: Twitter, label: 'Twitter', href: 'https://twitter.com' },
  { icon: Linkedin, label: 'LinkedIn', href: 'https://linkedin.com' },
  { icon: Globe, label: 'Website', href: '/' },
  { icon: Mail, label: 'Email', href: 'mailto:hello@orca.marine' },
];

/**
 * Footer — the closing brand surface. Rendered on the light editorial
 * routes so it uses an ocean-tinted white surface that connects the final
 * CTA to the rest of the page rhythm without dominating the page.
 */
export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative mt-20 border-t border-ink/[0.06] bg-pearl-soft">
      {/* Top data stream */}
      <div className="h-px w-full overflow-hidden">
        <DataStream
          direction="horizontal"
          speed={0.6}
          particles={false}
          light
        />
      </div>

      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-10 mb-14">
          {/* Brand */}
          <div className="col-span-2 md:col-span-3 lg:col-span-2">
            <OrcaLogo light />
            <p className="mt-5 text-sm text-ink-soft leading-relaxed max-w-sm">
              A next-generation marine intelligence platform combining
              satellite Earth observation, AIS signals, oceanographic models,
              and AI agents into actionable insight.
            </p>
            <div className="mt-6 flex items-center gap-2">
              {SOCIAL_LINKS.map(({ icon: Icon, label, href }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noreferrer noopener"
                  aria-label={label}
                  className="h-9 w-9 rounded-lg border border-ink/10 flex items-center justify-center text-mist-deep hover:text-ocean hover:border-ocean/40 hover:bg-white transition-all"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Nav columns */}
          {Object.entries(FOOTER_NAV).map(([section, items]) => (
            <div key={section}>
              <h4 className="font-mono text-[10px] tracking-[0.2em] text-ocean uppercase mb-4">
                {section}
              </h4>
              <ul className="flex flex-col gap-2.5">
                {items.map((item) => (
                  <li key={item.href}>
                    <Link
                      to={item.href}
                      className="text-sm text-ink-soft hover:text-ocean transition-colors"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Status bar */}
        <div className="flex flex-wrap items-center gap-5 py-6 border-y border-ink/[0.06]">
          <StatusPill label="SATELLITE" status="online" />
          <StatusPill label="AIS STREAM" status="online" />
          <StatusPill label="OCEAN MODEL" status="online" />
          <StatusPill label="AI AGENTS" status="online" />
          <StatusPill label="WEATHER API" status="degraded" />
        </div>

        {/* Bottom */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-8">
          <p className="text-xs text-mist-deep font-mono">
            © {year} ORCA Marine Intelligence. All data attributed to original
            providers.
          </p>
          <div className="flex items-center gap-2 text-xs text-mist-deep">
            <Shield className="h-3.5 w-3.5 text-ocean/70" />
            <span className="font-mono">
              BUILD v0.1.0 · LAST SYNC{' '}
              {new Date().toISOString().slice(0, 16).replace('T', ' ')}Z
            </span>
          </div>
        </div>
      </div>

      <Ticker />
    </footer>
  );
}

function StatusPill({
  label,
  status,
}: {
  label: string;
  status: 'online' | 'degraded' | 'offline';
}) {
  const color =
    status === 'online'
      ? 'bg-success'
      : status === 'degraded'
        ? 'bg-warning'
        : 'bg-danger';
  return (
    <div className="inline-flex items-center gap-2">
      <span className={cn('h-1.5 w-1.5 rounded-full animate-pulse', color)} />
      <span className="font-mono text-[10px] tracking-wider text-mist-deep">
        {label}
      </span>
    </div>
  );
}

function Ticker() {
  const items = [
    'SST 29.4°C · BAY OF BENGAL',
    'WIND 12.4 m/s · NE',
    'WAVE 1.8 m · SWELL',
    'CHLOROPHYLL 0.32 mg/m³',
    'VESSELS TRACKED 32,489',
    'AI AGENTS 24/7',
    'SATELLITE PASS · 04:22 UTC',
    'AIS UPDATES · 1 Hz',
  ];

  return (
    <div className="border-t border-ink/[0.06] overflow-hidden bg-pearl">
      <div className="flex items-center py-2.5">
        <div className="flex animate-[marquee_40s_linear_infinite] gap-8 pl-6">
          {[...items, ...items].map((item, i) => (
            <span
              key={i}
              className="font-mono text-[10px] tracking-wider text-ocean/60 whitespace-nowrap"
            >
              ◆ {item}
            </span>
          ))}
        </div>
      </div>
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
}
import * as React from 'react';
import { motion } from 'framer-motion';
import {
  User,
  Database,
  Sparkles,
  Globe,
  Mic,
  Bell,
  Shield,
  Palette,
  Accessibility,
  Check,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { Input, Textarea } from '@/components/ui/Input';
import { useAppStore } from '@/store/useAppStore';
import { QUALITY_PRESETS, type QualityLevel } from '@/lib/constants';
import { fadeInUp, staggerContainer } from '@/lib/animations';
import type { User as UserType, UserPreferences } from '@/types';

type TabId =
  | 'profile'
  | 'data'
  | 'ai'
  | 'language'
  | 'voice'
  | 'notifications'
  | 'privacy'
  | 'appearance'
  | 'accessibility';

interface Tab {
  id: TabId;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

const TABS: Tab[] = [
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'data', label: 'Data Sources', icon: Database },
  { id: 'ai', label: 'AI Preferences', icon: Sparkles },
  { id: 'language', label: 'Language', icon: Globe },
  { id: 'voice', label: 'Voice', icon: Mic },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'privacy', label: 'Privacy', icon: Shield },
  { id: 'appearance', label: 'Appearance', icon: Palette },
  { id: 'accessibility', label: 'Accessibility', icon: Accessibility },
];

export default function Settings() {
  const [tab, setTab] = React.useState<TabId>('profile');
  const user = useAppStore((s) => s.user);
  const updatePreferences = useAppStore((s) => s.updatePreferences);

  return (
    <div className="relative bg-pearl text-ink">
      <section className="relative pt-14 pb-10 lg:pt-20 lg:pb-14 border-b border-ink/[0.06]">
        <div className="absolute inset-0 data-grid-light opacity-50" aria-hidden="true" />
        <div className="relative mx-auto max-w-7xl px-6">
          <motion.div initial="hidden" animate="visible" variants={staggerContainer}>
            <motion.div variants={fadeInUp} className="flex items-center gap-3 mb-5">
              <span className="h-px w-10 bg-ocean/40" />
              <span className="font-mono text-[10px] tracking-[0.3em] text-ocean">
                SETTINGS
              </span>
            </motion.div>
            <motion.h1
              variants={fadeInUp}
              className="font-display text-4xl md:text-5xl font-bold tracking-tight text-ink leading-[1.05]"
            >
              Preferences
            </motion.h1>
          </motion.div>
        </div>
      </section>

      <section className="relative py-10 pb-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-6">
            {/* Tabs */}
            <aside className="rounded-2xl border border-ink/[0.08] bg-white p-2 shadow-soft h-fit">
              <ul className="flex flex-col gap-0.5">
                {TABS.map((t) => {
                  const Icon = t.icon;
                  const active = tab === t.id;
                  return (
                    <li key={t.id}>
                      <button
                        onClick={() => setTab(t.id)}
                        className={cn(
                          'w-full flex items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm transition-colors',
                          active
                            ? 'bg-ocean/[0.08] text-ocean'
                            : 'text-ink-soft hover:bg-ink/[0.04] hover:text-ink'
                        )}
                      >
                        <Icon className="h-3.5 w-3.5" />
                        <span className="flex-1">{t.label}</span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </aside>

            {/* Panel */}
            <motion.div
              key={tab}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25 }}
              className="rounded-2xl border border-ink/[0.08] bg-white p-6 lg:p-8 shadow-soft"
            >
              {tab === 'profile' && <ProfilePanel user={user} />}
              {tab === 'data' && <DataPanel />}
              {tab === 'ai' && (
                <AIPanel user={user} updatePreferences={updatePreferences} />
              )}
              {tab === 'appearance' && (
                <AppearancePanel user={user} updatePreferences={updatePreferences} />
              )}
              {tab === 'accessibility' && (
                <AccessibilityPanel
                  user={user}
                  updatePreferences={updatePreferences}
                />
              )}
              {(tab === 'language' ||
                tab === 'voice' ||
                tab === 'notifications' ||
                tab === 'privacy') && <PlaceholderPanel tab={tab} />}
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}

function ProfilePanel({ user }: { user: UserType | null }) {
  return (
    <div>
      <SectionHeader title="Profile" subtitle="Your public ORCA identity." />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input variant="light" label="DISPLAY NAME" defaultValue={user?.name ?? ''} />
        <Input variant="light" label="EMAIL" type="email" defaultValue={user?.email ?? ''} />
        <Input variant="light" label="ORGANIZATION" defaultValue={user?.organization ?? ''} />
        <Input variant="light" label="ROLE" defaultValue={user?.role ?? 'user'} disabled />
      </div>
      <div className="mt-6">
        <Textarea
          variant="light"
          label="BIO"
          placeholder="Marine researcher, coastal engineer, or curious explorer…"
        />
      </div>
      <div className="mt-6 flex justify-end gap-2">
        <Button variant="ghost-light" size="sm">
          Cancel
        </Button>
        <Button size="sm" leftIcon={<Check className="h-3.5 w-3.5" />}>
          Save Changes
        </Button>
      </div>
    </div>
  );
}

function DataPanel() {
  const sources = [
    {
      id: 'copernicus',
      label: 'Copernicus Marine Service',
      category: 'Ocean model & satellite',
    },
    { id: 'noaa', label: 'NOAA', category: 'Weather & SST' },
    { id: 'incois', label: 'INCOIS', category: 'PFZ & ocean state' },
    { id: 'ais', label: 'AIS providers', category: 'Vessel tracking' },
    { id: 'argos', label: 'Argo Floats', category: 'Subsurface profiles' },
  ];

  return (
    <div>
      <SectionHeader
        title="Data Sources"
        subtitle="Choose which providers ORCA may consult for your queries."
      />
      <ul className="flex flex-col gap-2">
        {sources.map((s) => (
          <li
            key={s.id}
            className="flex items-center gap-3 rounded-xl border border-ink/[0.06] bg-pearl-soft px-4 py-3"
          >
            <input
              type="checkbox"
              defaultChecked
              className="h-4 w-4 rounded border-ink/20 bg-white accent-ocean"
            />
            <div className="flex-1 min-w-0">
              <div className="text-sm text-ink">{s.label}</div>
              <div className="font-mono text-[10px] tracking-wider text-mist-deep">
                {s.category.toUpperCase()}
              </div>
            </div>
            <span className="font-mono text-[9px] text-success-deep">ONLINE</span>
          </li>
        ))}
      </ul>
      <p className="mt-4 text-[11px] text-ink-soft leading-relaxed">
        Disabling a source means ORCA will not consult it for your queries.
        Sources may still be used globally for platform health monitoring.
      </p>
    </div>
  );
}

function AIPanel({
  user,
  updatePreferences,
}: {
  user: UserType | null;
  updatePreferences: (p: Partial<UserPreferences>) => void;
}) {
  const prefs = user?.preferences.aiPreferences ?? {
    temperature: 0.7,
    maxTokens: 2048,
    showSources: true,
    showConfidence: true,
  };

  const setPref = (key: string, value: unknown) => {
    updatePreferences({
      aiPreferences: { ...prefs, [key]: value } as typeof prefs,
    });
  };

  return (
    <div>
      <SectionHeader
        title="AI Preferences"
        subtitle="How ORCA's assistant behaves."
      />

      <div className="flex flex-col gap-6">
        <div>
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-ink">Creativity</span>
            <span className="font-mono text-[10px] text-ocean">
              {prefs.temperature.toFixed(2)}
            </span>
          </div>
          <input
            type="range"
            min={0}
            max={1}
            step={0.05}
            value={prefs.temperature}
            onChange={(e) => setPref('temperature', Number(e.target.value))}
            className="w-full accent-ocean"
          />
          <div className="mt-1 flex justify-between font-mono text-[9px] text-mist-deep">
            <span>PRECISE</span>
            <span>CREATIVE</span>
          </div>
        </div>

        <ToggleRow
          label="Show evidence sources"
          description="Attach the data sources used for each answer."
          checked={prefs.showSources}
          onChange={(v) => setPref('showSources', v)}
        />
        <ToggleRow
          label="Show confidence"
          description="Display a confidence score per answer."
          checked={prefs.showConfidence}
          onChange={(v) => setPref('showConfidence', v)}
        />
      </div>
    </div>
  );
}

function AppearancePanel({
  user,
  updatePreferences,
}: {
  user: UserType | null;
  updatePreferences: (p: Partial<UserPreferences>) => void;
}) {
  const quality = user?.preferences.quality ?? 'MEDIUM';
  const theme = user?.preferences.theme ?? 'dark';

  return (
    <div>
      <SectionHeader title="Appearance" subtitle="Theme and rendering quality." />

      <div className="mb-8">
        <div className="font-mono text-[10px] tracking-widest text-ocean mb-3">
          THEME
        </div>
        <div className="grid grid-cols-3 gap-3">
          {(['dark', 'light', 'system'] as const).map((t) => (
            <button
              key={t}
              onClick={() => updatePreferences({ theme: t })}
              className={cn(
                'rounded-xl border px-3 py-3 text-sm capitalize transition-colors',
                theme === t
                  ? 'border-ocean/40 bg-ocean/[0.06] text-ocean'
                  : 'border-ink/10 bg-pearl-soft text-ink-soft hover:border-ocean/30 hover:text-ink'
              )}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      <div>
        <div className="font-mono text-[10px] tracking-widest text-ocean mb-3">
          3D & MAP QUALITY
        </div>
        <div className="grid grid-cols-3 gap-3">
          {(['LOW', 'MEDIUM', 'HIGH'] as QualityLevel[]).map((q) => (
            <button
              key={q}
              onClick={() => updatePreferences({ quality: q })}
              className={cn(
                'rounded-xl border p-4 text-left transition-colors',
                quality === q
                  ? 'border-ocean/40 bg-ocean/[0.06]'
                  : 'border-ink/10 bg-pearl-soft hover:border-ocean/30'
              )}
            >
              <div
                className={cn(
                  'font-display text-sm font-semibold',
                  quality === q ? 'text-ocean' : 'text-ink'
                )}
              >
                {q}
              </div>
              <div className="mt-1 font-mono text-[9px] text-mist-deep">
                DPR {QUALITY_PRESETS[q].dpr} · {QUALITY_PRESETS[q].particles}{' '}
                particles
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function AccessibilityPanel({
  user,
  updatePreferences,
}: {
  user: UserType | null;
  updatePreferences: (p: Partial<UserPreferences>) => void;
}) {
  const reducedMotion = user?.preferences.reducedMotion ?? false;
  return (
    <div>
      <SectionHeader
        title="Accessibility"
        subtitle="Fine-tune motion, contrast, and input preferences."
      />
      <div className="flex flex-col gap-3">
        <ToggleRow
          label="Reduce motion"
          description="Minimize animations across the platform."
          checked={reducedMotion}
          onChange={(v) => updatePreferences({ reducedMotion: v })}
        />
      </div>
    </div>
  );
}

function PlaceholderPanel({ tab }: { tab: string }) {
  return (
    <div>
      <SectionHeader
        title={tab.charAt(0).toUpperCase() + tab.slice(1)}
        subtitle="This section is coming in a later phase."
      />
      <div className="rounded-xl border border-dashed border-ink/15 bg-pearl-soft px-6 py-12 text-center">
        <p className="font-mono text-[10px] tracking-widest text-mist-deep">
          CONTROLS FOR {tab.toUpperCase()} WILL APPEAR HERE
        </p>
      </div>
    </div>
  );
}

function SectionHeader({
  title,
  subtitle,
}: {
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="mb-6">
      <h2 className="font-display text-xl font-semibold text-ink">{title}</h2>
      {subtitle && <p className="mt-1 text-sm text-ink-soft">{subtitle}</p>}
    </div>
  );
}

function ToggleRow({
  label,
  description,
  checked,
  onChange,
}: {
  label: string;
  description?: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-xl border border-ink/[0.06] bg-pearl-soft px-4 py-3">
      <div className="min-w-0 flex-1">
        <div className="text-sm text-ink">{label}</div>
        {description && (
          <div className="mt-0.5 text-[11px] text-ink-soft">{description}</div>
        )}
      </div>
      <button
        onClick={() => onChange(!checked)}
        role="switch"
        aria-checked={checked}
        className={cn(
          'relative h-6 w-11 shrink-0 rounded-full border transition-colors',
          checked ? 'border-ocean/50 bg-ocean/30' : 'border-ink/15 bg-white'
        )}
      >
        <span
          className={cn(
            'absolute top-0.5 h-4 w-4 rounded-full transition-all',
            checked ? 'left-6 bg-ocean' : 'left-0.5 bg-ink/30'
          )}
        />
      </button>
    </div>
  );
}
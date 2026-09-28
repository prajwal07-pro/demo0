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

/**
 * Settings — user preferences and platform configuration.
 */
export default function Settings() {
  const [tab, setTab] = React.useState<TabId>('profile');
  const { user, updatePreferences } = useAppStore();

  return (
    <div className="mx-auto max-w-7xl px-6 py-8">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={staggerContainer}
        className="mb-8"
      >
        <motion.div variants={fadeInUp} className="flex items-center gap-3 mb-2">
          <span className="font-mono text-[10px] tracking-[0.3em] text-cyan/70">
            MODULE · SETTINGS
          </span>
          <span className="h-px w-12 bg-cyan/40" />
        </motion.div>
        <motion.h1
          variants={fadeInUp}
          className="font-display text-4xl md:text-5xl font-bold text-white tracking-tight"
        >
          Settings
        </motion.h1>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-6">
        {/* Tabs */}
        <aside className="rounded-xl border border-white/10 bg-white/[0.015] p-2 h-fit">
          <ul className="flex flex-col gap-0.5">
            {TABS.map((t) => {
              const Icon = t.icon;
              const active = tab === t.id;
              return (
                <li key={t.id}>
                  <button
                    onClick={() => setTab(t.id)}
                    className={cn(
                      'w-full flex items-center gap-3 rounded-md px-3 py-2.5 text-left text-sm transition-colors border',
                      active
                        ? 'border-cyan/30 bg-cyan/10 text-cyan'
                        : 'border-transparent text-muted-foreground hover:bg-white/5 hover:text-white'
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
          transition={{ duration: 0.3 }}
          className="rounded-xl border border-white/10 bg-white/[0.015] p-6 lg:p-8"
        >
          {tab === 'profile' && <ProfilePanel user={user} />}
          {tab === 'data' && <DataPanel />}
          {tab === 'ai' && <AIPanel user={user} updatePreferences={updatePreferences} />}
          {tab === 'appearance' && <AppearancePanel user={user} updatePreferences={updatePreferences} />}
          {tab === 'accessibility' && <AccessibilityPanel user={user} updatePreferences={updatePreferences} />}
          {(tab === 'language' || tab === 'voice' || tab === 'notifications' || tab === 'privacy') && (
            <PlaceholderPanel tab={tab} />
          )}
        </motion.div>
      </div>
    </div>
  );
}

// ---------- Panels ----------

function ProfilePanel({ user }: { user: ReturnType<typeof useAppStore.getState>['user'] }) {
  return (
    <div>
      <SectionHeader title="Profile" subtitle="Your public ORCA identity." />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input label="DISPLAY NAME" defaultValue={user?.name ?? ''} />
        <Input label="EMAIL" type="email" defaultValue={user?.email ?? ''} />
        <Input label="ORGANIZATION" defaultValue={user?.organization ?? ''} />
        <Input label="ROLE" defaultValue={user?.role ?? 'user'} disabled />
      </div>
      <div className="mt-6">
        <Textarea label="BIO" placeholder="Marine researcher, coastal engineer, or curious explorer…" />
      </div>
      <div className="mt-6 flex justify-end gap-2">
        <Button variant="ghost" size="sm">
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
    { id: 'copernicus', label: 'Copernicus Marine Service', category: 'Ocean model & satellite' },
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
            className="flex items-center gap-3 rounded-lg border border-white/5 bg-white/[0.02] px-4 py-3"
          >
            <input
              type="checkbox"
              defaultChecked
              className="h-4 w-4 rounded border-white/20 bg-white/5 accent-cyan"
            />
            <div className="flex-1 min-w-0">
              <div className="text-sm text-white">{s.label}</div>
              <div className="font-mono text-[10px] tracking-wider text-muted-foreground">
                {s.category.toUpperCase()}
              </div>
            </div>
            <span className="font-mono text-[9px] text-teal/70">ONLINE</span>
          </li>
        ))}
      </ul>
      <p className="mt-4 text-[11px] text-muted-foreground leading-relaxed">
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
  user: ReturnType<typeof useAppStore.getState>['user'];
  updatePreferences: (p: Partial<NonNullable<typeof user>['preferences']>) => void;
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
      <SectionHeader title="AI Preferences" subtitle="How ORCA's assistant behaves." />

      <div className="flex flex-col gap-5">
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-white">Creativity</span>
            <span className="font-mono text-[10px] text-cyan/70">
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
            className="w-full accent-cyan"
          />
          <div className="mt-1 flex justify-between font-mono text-[9px] text-muted-foreground">
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
  user: ReturnType<typeof useAppStore.getState>['user'];
  updatePreferences: (p: Partial<NonNullable<typeof user>['preferences']>) => void;
}) {
  const quality = user?.preferences.quality ?? 'MEDIUM';
  const theme = user?.preferences.theme ?? 'dark';

  return (
    <div>
      <SectionHeader title="Appearance" subtitle="Theme and rendering quality." />

      <div className="mb-6">
        <div className="font-mono text-[10px] tracking-widest text-cyan/70 mb-3">
          THEME
        </div>
        <div className="grid grid-cols-3 gap-2">
          {(['dark', 'light', 'system'] as const).map((t) => (
            <button
              key={t}
              onClick={() => updatePreferences({ theme: t })}
              className={cn(
                'rounded-lg border px-3 py-3 text-sm capitalize transition-colors',
                theme === t
                  ? 'border-cyan/50 bg-cyan/10 text-cyan'
                  : 'border-white/10 bg-white/[0.02] text-muted-foreground hover:border-cyan/30 hover:text-white'
              )}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      <div>
        <div className="font-mono text-[10px] tracking-widest text-cyan/70 mb-3">
          3D & MAP QUALITY
        </div>
        <div className="grid grid-cols-3 gap-2">
          {(['LOW', 'MEDIUM', 'HIGH'] as QualityLevel[]).map((q) => (
            <button
              key={q}
              onClick={() => updatePreferences({ quality: q })}
              className={cn(
                'rounded-lg border p-3 text-left transition-colors',
                quality === q
                  ? 'border-cyan/50 bg-cyan/10'
                  : 'border-white/10 bg-white/[0.02] hover:border-cyan/30'
              )}
            >
              <div
                className={cn(
                  'font-display text-sm font-semibold',
                  quality === q ? 'text-cyan' : 'text-white'
                )}
              >
                {q}
              </div>
              <div className="mt-1 font-mono text-[9px] text-muted-foreground">
                DPR {QUALITY_PRESETS[q].dpr} · {QUALITY_PRESETS[q].particles} particles
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
  user: ReturnType<typeof useAppStore.getState>['user'];
  updatePreferences: (p: Partial<NonNullable<typeof user>['preferences']>) => void;
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
      <div className="rounded-lg border border-dashed border-white/10 bg-white/[0.01] px-6 py-12 text-center">
        <p className="font-mono text-[10px] tracking-widest text-muted-foreground">
          CONTROLS FOR {tab.toUpperCase()} WILL APPEAR HERE
        </p>
      </div>
    </div>
  );
}

// ---------- Helpers ----------

function SectionHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="mb-6">
      <h2 className="font-display text-xl font-semibold text-white">{title}</h2>
      {subtitle && (
        <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>
      )}
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
    <div className="flex items-center justify-between gap-4 rounded-lg border border-white/5 bg-white/[0.02] px-4 py-3">
      <div className="min-w-0 flex-1">
        <div className="text-sm text-white">{label}</div>
        {description && (
          <div className="mt-0.5 text-[11px] text-muted-foreground">{description}</div>
        )}
      </div>
      <button
        onClick={() => onChange(!checked)}
        role="switch"
        aria-checked={checked}
        className={cn(
          'relative h-6 w-11 shrink-0 rounded-full border transition-colors',
          checked
            ? 'border-cyan/60 bg-cyan/30'
            : 'border-white/10 bg-white/5'
        )}
      >
        <span
          className={cn(
            'absolute top-0.5 h-4 w-4 rounded-full transition-all',
            checked ? 'left-6 bg-cyan' : 'left-0.5 bg-white/60'
          )}
        />
      </button>
    </div>
  );
}
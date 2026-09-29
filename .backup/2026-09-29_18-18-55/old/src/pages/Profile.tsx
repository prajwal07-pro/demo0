import * as React from 'react';
import { motion } from 'framer-motion';
import {
  User,
  MapPin,
  Mail,
  Calendar,
  Award,
  Zap,
  Flame,
  Trophy,
  Ship,
  Radar,
  Map,
  MessageSquare,
  Settings as SettingsIcon,
  Edit3,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { useUser } from '@/store/useAppStore';
import { ACHIEVEMENTS } from '@/lib/constants';
import { fadeInUp, staggerContainer } from '@/lib/animations';

/**
 * Profile — user profile with activity, achievements, and stats.
 */
export default function Profile() {
  const { user, isAuthenticated } = useUser();

  // Placeholder guest profile for unauthenticated viewing
  const displayUser = user ?? {
    id: 'guest',
    email: 'guest@orca.marine',
    name: 'Guest Operator',
    role: 'user' as const,
    level: 3,
    xp: 1250,
    achievements: ['ocean-explorer', 'ais-navigator'],
    createdAt: new Date().toISOString(),
    organization: 'Independent',
    preferences: {
      theme: 'dark' as const,
      quality: 'MEDIUM' as const,
      language: 'en',
      voice: 'default',
      notifications: true,
      reducedMotion: false,
      dataSources: [],
      aiPreferences: {
        temperature: 0.7,
        maxTokens: 2048,
        showSources: true,
        showConfidence: true,
      },
    },
  };

  return (
    <div className="mx-auto max-w-7xl px-6 py-8">
      {/* Header card */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={staggerContainer}
        className="rounded-2xl border border-white/10 bg-white/[0.015] p-6 lg:p-8 mb-6 relative overflow-hidden"
      >
        <div className="absolute inset-0 data-grid opacity-20" aria-hidden="true" />

        <div className="relative flex flex-col md:flex-row md:items-center gap-6">
          {/* Avatar */}
          <div className="relative shrink-0">
            <div className="h-24 w-24 rounded-2xl bg-gradient-to-br from-cyan to-teal flex items-center justify-center text-abyss font-display font-bold text-3xl">
              {displayUser.name[0]?.toUpperCase()}
            </div>
            <span className="absolute -bottom-1 -right-1 h-6 w-6 rounded-full bg-teal border-4 border-abyss" />
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-3 mb-2">
              <h1 className="font-display text-2xl md:text-3xl font-bold text-white truncate">
                {displayUser.name}
              </h1>
              <Badge variant="default" size="sm">
                LVL {displayUser.level}
              </Badge>
              {displayUser.role !== 'user' && (
                <Badge variant="violet" size="sm">
                  {displayUser.role.toUpperCase()}
                </Badge>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
              <span className="inline-flex items-center gap-1.5">
                <Mail className="h-3.5 w-3.5 text-cyan/60" />
                {displayUser.email}
              </span>
              {displayUser.organization && (
                <span className="inline-flex items-center gap-1.5">
                  <MapPin className="h-3.5 w-3.5 text-cyan/60" />
                  {displayUser.organization}
                </span>
              )}
              <span className="inline-flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5 text-cyan/60" />
                Joined {new Date(displayUser.createdAt).toLocaleDateString()}
              </span>
            </div>

            {!isAuthenticated && (
              <p className="mt-3 text-xs text-amber-400/80 font-mono tracking-wider">
                ⚠ GUEST MODE — SIGN IN TO SAVE YOUR PROGRESS
              </p>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              size="sm"
              leftIcon={<Edit3 className="h-3.5 w-3.5" />}
            >
              Edit Profile
            </Button>
            <Link to="/settings">
              <Button variant="ghost" size="icon" aria-label="Settings">
                <SettingsIcon className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </motion.div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <StatBox
          icon={Zap}
          label="XP"
          value={displayUser.xp.toLocaleString()}
          accent="violet"
        />
        <StatBox
          icon={Trophy}
          label="ACHIEVEMENTS"
          value={`${displayUser.achievements.length} / ${ACHIEVEMENTS.length}`}
          accent="amber"
        />
        <StatBox icon={Flame} label="STREAK" value="7 days" accent="magenta" />
        <StatBox icon={Award} label="RANK" value="#142" accent="cyan" />
      </div>

      {/* Main content */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">
        {/* Achievements */}
        <div className="rounded-xl border border-white/10 bg-white/[0.015] p-6">
          <div className="flex items-center gap-2 mb-5">
            <Trophy className="h-4 w-4 text-amber-400" />
            <div className="font-mono text-[10px] tracking-widest text-cyan/70">
              ACHIEVEMENTS
            </div>
          </div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-2 sm:grid-cols-3 gap-3"
          >
            {ACHIEVEMENTS.map((a) => {
              const unlocked = displayUser.achievements.includes(a.id);
              return (
                <motion.div
                  key={a.id}
                  variants={fadeInUp}
                  className={cn(
                    'rounded-lg border p-3 text-center',
                    unlocked
                      ? 'border-amber-400/30 bg-amber-400/[0.03]'
                      : 'border-white/5 bg-white/[0.01] opacity-50'
                  )}
                >
                  <div
                    className={cn(
                      'mx-auto h-9 w-9 rounded-lg border flex items-center justify-center mb-2',
                      unlocked
                        ? 'border-amber-400/40 bg-amber-400/10'
                        : 'border-white/10 bg-white/5'
                    )}
                  >
                    <Trophy
                      className={cn(
                        'h-4 w-4',
                        unlocked ? 'text-amber-400' : 'text-muted-foreground'
                      )}
                    />
                  </div>
                  <div className="font-display text-xs font-semibold text-white leading-tight">
                    {a.label}
                  </div>
                  <div className="mt-1 font-mono text-[9px] tracking-wider text-cyan/50">
                    +{a.xp} XP
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>

        {/* Quick links / activity */}
        <aside className="flex flex-col gap-4">
          <div className="rounded-xl border border-white/10 bg-white/[0.015] p-5">
            <div className="font-mono text-[10px] tracking-widest text-cyan/70 mb-4">
              QUICK ACCESS
            </div>
            <ul className="flex flex-col gap-1">
              <QuickLink to="/map" icon={Map} label="Live Marine Map" />
              <QuickLink to="/vessels" icon={Ship} label="Tracked Vessels" />
              <QuickLink
                to="/assistant"
                icon={MessageSquare}
                label="AI Assistant"
              />
              <QuickLink
                to="/learning"
                icon={Radar}
                label="Learning Progress"
              />
            </ul>
          </div>

          <div className="rounded-xl border border-white/10 bg-white/[0.015] p-5">
            <div className="font-mono text-[10px] tracking-widest text-cyan/70 mb-3">
              RECENT ACTIVITY
            </div>
            <ul className="flex flex-col gap-3 text-xs">
              <ActivityItem
                text="Completed 'How AIS Works' module 3"
                time="2h ago"
              />
              <ActivityItem
                text="Saved 'Bay of Bengal' map view"
                time="1d ago"
              />
              <ActivityItem
                text="Ran 'Storm Scenario' simulation"
                time="3d ago"
              />
              <ActivityItem
                text="Earned 'Ocean Explorer' badge"
                time="5d ago"
              />
            </ul>
          </div>
        </aside>
      </div>
    </div>
  );
}

// ---------- Subcomponents ----------

function StatBox({
  icon: Icon,
  label,
  value,
  accent = 'cyan',
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  accent?: 'cyan' | 'teal' | 'violet' | 'magenta' | 'amber';
}) {
  const accentClass = {
    cyan: 'text-cyan border-cyan/30 bg-cyan/5',
    teal: 'text-teal border-teal/30 bg-teal/5',
    violet: 'text-violet border-violet/30 bg-violet/5',
    magenta: 'text-magenta border-magenta/30 bg-magenta/5',
    amber: 'text-amber-400 border-amber-400/30 bg-amber-400/5',
  }[accent];

  return (
    <div className="rounded-xl border border-white/5 bg-white/[0.015] p-4">
      <div className="flex items-center justify-between mb-2">
        <span className="telemetry-text text-[9px] text-muted-foreground">
          {label}
        </span>
        <div
          className={cn(
            'h-6 w-6 rounded-md border flex items-center justify-center',
            accentClass
          )}
        >
          <Icon className="h-3 w-3" />
        </div>
      </div>
      <div className="font-display text-lg font-semibold text-white tabular-nums">
        {value}
      </div>
    </div>
  );
}

function QuickLink({
  to,
  icon: Icon,
  label,
}: {
  to: string;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
}) {
  return (
    <li>
      <Link
        to={to}
        className="flex items-center gap-2.5 rounded-md px-2.5 py-2 text-xs text-muted-foreground hover:bg-white/5 hover:text-white transition-colors"
      >
        <Icon className="h-3.5 w-3.5 text-cyan/70" />
        <span className="flex-1">{label}</span>
        <span className="text-cyan/40">→</span>
      </Link>
    </li>
  );
}

function ActivityItem({ text, time }: { text: string; time: string }) {
  return (
    <li className="flex items-start gap-2.5">
      <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-cyan" />
      <div className="min-w-0 flex-1">
        <div className="text-white/90 leading-snug">{text}</div>
        <div className="mt-0.5 font-mono text-[10px] text-muted-foreground">
          {time}
        </div>
      </div>
    </li>
  );
}

// reserved
void User;
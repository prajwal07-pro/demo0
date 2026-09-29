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
  Check,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Dialog } from '@/components/ui/Dialog';
import { Input } from '@/components/ui/Input';
import { useUser, useAppStore } from '@/store/useAppStore';
import { ACHIEVEMENTS } from '@/lib/constants';
import { fadeInUp, staggerContainer } from '@/lib/animations';
import type { User as UserType } from '@/types';

export default function Profile() {
  const { user, isAuthenticated } = useUser();
  const setUser = useAppStore((s) => s.setUser);
  const showToast = useAppStore((s) => s.showToast);

  const [editOpen, setEditOpen] = React.useState(false);
  const [draftName, setDraftName] = React.useState(user?.name ?? '');
  const [draftOrg, setDraftOrg] = React.useState(user?.organization ?? '');

  const displayUser: UserType = user ?? {
    id: 'guest',
    email: 'guest@orca.marine',
    name: 'Guest Operator',
    role: 'user',
    level: 3,
    xp: 1250,
    achievements: ['ocean-explorer', 'ais-navigator'],
    createdAt: new Date().toISOString(),
    organization: 'Independent',
    preferences: {
      theme: 'dark',
      quality: 'MEDIUM',
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

  React.useEffect(() => {
    if (user) {
      setDraftName(user.name);
      setDraftOrg(user.organization ?? '');
    }
  }, [user]);

  const handleOpenEdit = () => {
    if (!isAuthenticated) {
      showToast('Sign in to edit your profile.', 'info');
      return;
    }
    setDraftName(user?.name ?? '');
    setDraftOrg(user?.organization ?? '');
    setEditOpen(true);
  };

  const handleSaveProfile = () => {
    if (!user) return;
    setUser({ ...user, name: draftName, organization: draftOrg });
    setEditOpen(false);
    showToast('Profile updated locally.', 'success');
  };

  return (
    <div className="relative bg-pearl text-ink">
      <section className="relative pt-14 pb-10 lg:pt-20 lg:pb-14 border-b border-ink/[0.06]">
        <div className="absolute inset-0 data-grid-light opacity-50" aria-hidden="true" />
        <div className="relative mx-auto max-w-7xl px-6">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="rounded-3xl border border-ink/[0.08] bg-white p-6 lg:p-8 shadow-soft"
          >
            <div className="flex flex-col md:flex-row md:items-center gap-6">
              <div className="relative shrink-0">
                <div className="h-24 w-24 rounded-2xl bg-gradient-to-br from-cyan to-teal flex items-center justify-center text-abyss font-display font-bold text-3xl">
                  {displayUser.name[0]?.toUpperCase()}
                </div>
                <span className="absolute -bottom-1 -right-1 h-6 w-6 rounded-full bg-success border-4 border-white" />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-3 mb-2">
                  <h1 className="font-display text-2xl md:text-3xl font-bold text-ink truncate">
                    {displayUser.name}
                  </h1>
                  <Badge variant="light-info" size="sm">
                    LVL {displayUser.level}
                  </Badge>
                  {displayUser.role !== 'user' && (
                    <Badge variant="light-violet" size="sm">
                      {displayUser.role.toUpperCase()}
                    </Badge>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-4 text-sm text-ink-soft">
                  <span className="inline-flex items-center gap-1.5">
                    <Mail className="h-3.5 w-3.5 text-ocean/70" />
                    {displayUser.email}
                  </span>
                  {displayUser.organization && (
                    <span className="inline-flex items-center gap-1.5">
                      <MapPin className="h-3.5 w-3.5 text-ocean/70" />
                      {displayUser.organization}
                    </span>
                  )}
                  <span className="inline-flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5 text-ocean/70" />
                    Joined {new Date(displayUser.createdAt).toLocaleDateString()}
                  </span>
                </div>

                {!isAuthenticated && (
                  <p className="mt-3 text-xs text-warning-deep font-mono tracking-wider">
                    ⚠ GUEST MODE — SIGN IN TO SAVE YOUR PROGRESS
                  </p>
                )}
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="secondary-light"
                  size="sm"
                  leftIcon={<Edit3 className="h-3.5 w-3.5" />}
                  onClick={handleOpenEdit}
                >
                  Edit Profile
                </Button>
                <Link to="/settings">
                  <Button variant="ghost-light" size="icon" aria-label="Settings">
                    <SettingsIcon className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="relative py-8 border-b border-ink/[0.06]">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatBox
              icon={Zap}
              label="XP"
              value={displayUser.xp.toLocaleString()}
              tone="violet"
            />
            <StatBox
              icon={Trophy}
              label="ACHIEVEMENTS"
              value={`${displayUser.achievements.length} / ${ACHIEVEMENTS.length}`}
              tone="warning"
            />
            <StatBox icon={Flame} label="STREAK" value="7 days" tone="accent" />
            <StatBox icon={Award} label="RANK" value="#142" tone="ocean" />
          </div>
        </div>
      </section>

      <section className="relative py-10 pb-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-8">
            <div className="rounded-2xl border border-ink/[0.08] bg-white p-6 shadow-soft">
              <div className="flex items-center gap-2 mb-6">
                <Trophy className="h-4 w-4 text-warning-deep" />
                <div className="font-mono text-[10px] tracking-widest text-ocean">
                  ACHIEVEMENTS
                </div>
              </div>

              <motion.div
                variants={staggerContainer}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-2 sm:grid-cols-3 gap-4"
              >
                {ACHIEVEMENTS.map((a) => {
                  const unlocked = displayUser.achievements.includes(a.id);
                  return (
                    <motion.div
                      key={a.id}
                      variants={fadeInUp}
                      className={cn(
                        'rounded-xl border p-4 text-center',
                        unlocked
                          ? 'border-warning/30 bg-warning/[0.04]'
                          : 'border-ink/[0.06] bg-pearl-soft/50 opacity-60'
                      )}
                    >
                      <div
                        className={cn(
                          'mx-auto h-9 w-9 rounded-lg border flex items-center justify-center mb-2',
                          unlocked
                            ? 'border-warning/40 bg-warning/[0.12]'
                            : 'border-ink/10 bg-pearl-soft'
                        )}
                      >
                        <Trophy
                          className={cn(
                            'h-4 w-4',
                            unlocked ? 'text-warning-deep' : 'text-mist-deep'
                          )}
                        />
                      </div>
                      <div className="font-display text-xs font-semibold text-ink leading-tight">
                        {a.label}
                      </div>
                      <div className="mt-1 font-mono text-[9px] tracking-wider text-ocean">
                        +{a.xp} XP
                      </div>
                    </motion.div>
                  );
                })}
              </motion.div>
            </div>

            <aside className="flex flex-col gap-5">
              <div className="rounded-2xl border border-ink/[0.08] bg-white p-5 shadow-soft">
                <div className="font-mono text-[10px] tracking-widest text-ocean mb-4">
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

              <div className="rounded-2xl border border-ink/[0.08] bg-white p-5 shadow-soft">
                <div className="font-mono text-[10px] tracking-widest text-ocean mb-4">
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
      </section>

      <Dialog
        open={editOpen}
        onClose={() => setEditOpen(false)}
        title="Edit profile"
        description="Update your display name and organization. Changes are stored locally."
        size="md"
        footer={
          <>
            <Button variant="ghost-light" size="md" onClick={() => setEditOpen(false)}>
              Cancel
            </Button>
            <Button
              size="md"
              leftIcon={<Check className="h-3.5 w-3.5" />}
              onClick={handleSaveProfile}
            >
              Save changes
            </Button>
          </>
        }
      >
        <div className="flex flex-col gap-4">
          <Input
            variant="light"
            label="DISPLAY NAME"
            value={draftName}
            onChange={(e) => setDraftName(e.target.value)}
          />
          <Input
            variant="light"
            label="ORGANIZATION"
            value={draftOrg}
            onChange={(e) => setDraftOrg(e.target.value)}
          />
          <p className="text-[11px] text-ink-soft leading-relaxed">
            Email, role and level are managed by the ORCA authentication layer
            and cannot be edited here.
          </p>
        </div>
      </Dialog>
    </div>
  );
}

function StatBox({
  icon: Icon,
  label,
  value,
  tone,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  tone: 'ocean' | 'violet' | 'accent' | 'warning';
}) {
  const toneStyles = {
    ocean: 'text-ocean',
    violet: 'text-violet-dark',
    accent: 'text-accent-deep',
    warning: 'text-warning-deep',
  }[tone];

  return (
    <div className="rounded-2xl border border-ink/[0.08] bg-white p-4 shadow-soft">
      <div className="flex items-center justify-between mb-2">
        <span className="font-mono text-[9px] tracking-widest text-mist-deep">
          {label}
        </span>
        <Icon className={cn('h-3.5 w-3.5', toneStyles)} />
      </div>
      <div className={cn('font-display text-lg font-semibold tabular-nums', toneStyles)}>
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
        className="flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-xs text-ink-soft hover:bg-ink/[0.04] hover:text-ink transition-colors"
      >
        <Icon className="h-3.5 w-3.5 text-ocean/70" />
        <span className="flex-1">{label}</span>
        <span className="text-ocean/50">→</span>
      </Link>
    </li>
  );
}

function ActivityItem({ text, time }: { text: string; time: string }) {
  return (
    <li className="flex items-start gap-2.5">
      <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-ocean" />
      <div className="min-w-0 flex-1">
        <div className="text-ink leading-snug">{text}</div>
        <div className="mt-0.5 font-mono text-[10px] text-mist-deep">
          {time}
        </div>
      </div>
    </li>
  );
}

// reserved
void User;
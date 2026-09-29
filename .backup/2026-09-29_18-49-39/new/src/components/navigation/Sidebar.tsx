import * as React from 'react';
import { motion } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  MessageSquare,
  Radar,
  Layers,
  AlertTriangle,
  Boxes,
  Gamepad2,
  GraduationCap,
  Users,
  FlaskConical,
  Settings,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useUI, useUser } from '@/store/useAppStore';

interface SidebarItem {
  id: string;
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string | number;
  badgeVariant?: 'default' | 'warning' | 'error';
}

const WORKSPACE_ITEMS: SidebarItem[] = [
  { id: 'map', label: 'Live Map', href: '/map', icon: Radar },
  { id: 'chat', label: 'AI Chat', href: '/assistant', icon: MessageSquare },
  { id: 'tracking', label: 'Vessels', href: '/vessels', icon: LayoutDashboard },
  { id: 'layers', label: 'Ocean Layers', href: '/ocean', icon: Layers },
  {
    id: 'alerts',
    label: 'Alerts',
    href: '/alerts',
    icon: AlertTriangle,
    badge: 3,
    badgeVariant: 'error',
  },
];

const EXPLORE_ITEMS: SidebarItem[] = [
  { id: 'simulation', label: 'Simulations', href: '/simulations', icon: FlaskConical },
  { id: 'explorer', label: '3D Explorer', href: '/explorer', icon: Boxes },
  { id: 'learning', label: 'Learning', href: '/learning', icon: GraduationCap },
  { id: 'games', label: 'Games', href: '/games', icon: Gamepad2 },
  { id: 'community', label: 'Community', href: '/community', icon: Users },
];

const SYSTEM_ITEMS: SidebarItem[] = [
  { id: 'settings', label: 'Settings', href: '/settings', icon: Settings },
];

/**
 * Routes rendered on the dark operational surface. On every other route
 * the sidebar adopts a light editorial surface so it does not visually
 * dominate the page.
 */
const WORKBENCH_ROUTES = ['/map', '/assistant', '/explorer'];

function useIsWorkbenchSurface(): boolean {
  const location = useLocation();
  return WORKBENCH_ROUTES.some((p) => location.pathname.startsWith(p));
}

// ---------- Sidebar Item ----------
function Item({
  item,
  collapsed,
  light,
}: {
  item: SidebarItem;
  collapsed: boolean;
  light: boolean;
}) {
  const location = useLocation();
  const isActive =
    location.pathname === item.href ||
    location.pathname.startsWith(item.href + '/');
  const Icon = item.icon;

  return (
    <Link
      to={item.href}
      className={cn(
        'group relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-[13px] font-medium transition-all',
        collapsed && 'justify-center px-2',
        isActive
          ? light
            ? 'bg-ocean/[0.08] text-ocean'
            : 'bg-cyan/[0.08] text-white'
          : light
            ? 'text-ink-soft hover:text-ink hover:bg-ink/[0.04]'
            : 'text-white/60 hover:text-white hover:bg-white/[0.04]'
      )}
      title={collapsed ? item.label : undefined}
    >
      {isActive && (
        <motion.span
          layoutId="sidebar-active"
          className={cn(
            'absolute left-0 top-1/2 -translate-y-1/2 h-5 w-0.5 rounded-full',
            light ? 'bg-ocean' : 'bg-cyan'
          )}
          transition={{ type: 'spring', stiffness: 400, damping: 30 }}
        />
      )}
      <Icon
        className={cn(
          'h-4 w-4 shrink-0 transition-colors',
          isActive
            ? light
              ? 'text-ocean'
              : 'text-cyan'
            : light
              ? 'text-mist-deep group-hover:text-ocean'
              : 'text-white/45 group-hover:text-white/80'
        )}
      />
      {!collapsed && (
        <>
          <span className="flex-1 truncate">{item.label}</span>
          {item.badge !== undefined && (
            <span
              className={cn(
                'font-mono text-[9px] font-bold rounded-full min-w-4 px-1.5 h-4 flex items-center justify-center',
                item.badgeVariant === 'error' &&
                  (light ? 'bg-danger/15 text-danger-deep' : 'bg-magenta/20 text-magenta'),
                item.badgeVariant === 'warning' &&
                  (light ? 'bg-warning/20 text-warning-deep' : 'bg-amber-400/20 text-amber-400'),
                (!item.badgeVariant || item.badgeVariant === 'default') &&
                  (light ? 'bg-ocean/15 text-ocean' : 'bg-cyan/20 text-cyan')
              )}
            >
              {item.badge}
            </span>
          )}
        </>
      )}
    </Link>
  );
}

// ---------- Section Label ----------
function SectionLabel({
  label,
  collapsed,
  light,
}: {
  label: string;
  collapsed: boolean;
  light: boolean;
}) {
  if (collapsed) {
    return (
      <div
        className={cn('my-2 mx-auto h-px w-6', light ? 'bg-ink/[0.06]' : 'bg-white/5')}
        aria-hidden="true"
      />
    );
  }
  return (
    <div
      className={cn(
        'px-3 pt-5 pb-2 font-mono text-[9px] tracking-[0.2em]',
        light ? 'text-mist-deep' : 'text-white/30'
      )}
    >
      {label}
    </div>
  );
}

// ---------- User Block ----------
function UserBlock({
  collapsed,
  light,
}: {
  collapsed: boolean;
  light: boolean;
}) {
  const { user, isAuthenticated } = useUser();

  const displayName = user?.name ?? 'Guest Operator';
  const displayRole = user?.role
    ? user.role.charAt(0).toUpperCase() + user.role.slice(1)
    : 'Guest';
  const initial = (displayName[0] ?? 'G').toUpperCase();

  return (
    <div
      className={cn(
        'flex items-center gap-3 p-2.5 rounded-lg border',
        light
          ? 'border-ink/[0.06] bg-white'
          : 'border-white/[0.06] bg-white/[0.02]',
        collapsed && 'justify-center p-2'
      )}
    >
      <div className="relative shrink-0">
        <div
          className={cn(
            'h-8 w-8 rounded-full flex items-center justify-center font-display font-bold text-xs',
            isAuthenticated
              ? 'bg-gradient-to-br from-cyan to-teal text-abyss'
              : light
                ? 'bg-ink/[0.06] text-mist-deep'
                : 'bg-white/[0.08] text-white/60'
          )}
        >
          {initial}
        </div>
        <span
          className={cn(
            'absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2',
            isAuthenticated ? 'bg-teal' : 'bg-mist',
            light ? 'border-white' : 'border-abyss'
          )}
        />
      </div>
      {!collapsed && (
        <div className="min-w-0 flex-1">
          <p
            className={cn(
              'text-xs font-semibold truncate',
              light ? 'text-ink' : 'text-white'
            )}
          >
            {displayName}
          </p>
          <p
            className={cn(
              'font-mono text-[9px] truncate',
              light ? 'text-mist-deep' : 'text-cyan/60'
            )}
          >
            {displayRole}
          </p>
        </div>
      )}
    </div>
  );
}

// ---------- Main Sidebar ----------
export function Sidebar() {
  const { sidebarOpen, toggleSidebar } = useUI();
  const isWorkbench = useIsWorkbenchSurface();
  const light = !isWorkbench;

  return (
    <motion.aside
      className={cn(
        'hidden lg:flex flex-col shrink-0 h-screen sticky top-0 z-30 border-r backdrop-blur-md',
        'transition-[width] duration-300 ease-out',
        light
          ? 'border-ink/[0.06] bg-white/70'
          : 'border-white/[0.05] bg-abyss/30'
      )}
      animate={{ width: sidebarOpen ? 240 : 68 }}
    >
      {/* Header */}
      <div
        className={cn(
          'h-16 shrink-0 border-b flex items-center px-4',
          light ? 'border-ink/[0.06]' : 'border-white/[0.05]'
        )}
      >
        {sidebarOpen ? (
          <span
            className={cn(
              'font-mono text-[9px] tracking-[0.2em]',
              light ? 'text-mist-deep' : 'text-white/30'
            )}
          >
            WORKSPACE
          </span>
        ) : (
          <span
            className={cn(
              'h-1 w-1 rounded-full animate-pulse mx-auto',
              light ? 'bg-ocean' : 'bg-cyan'
            )}
          />
        )}
      </div>

      {/* Primary Navigation */}
      <nav className="flex-1 overflow-y-auto px-2 pb-3 no-scrollbar">
        <SectionLabel label="MONITOR" collapsed={!sidebarOpen} light={light} />
        <ul className="flex flex-col gap-0.5">
          {WORKSPACE_ITEMS.map((item) => (
            <li key={item.id}>
              <Item item={item} collapsed={!sidebarOpen} light={light} />
            </li>
          ))}
        </ul>

        <SectionLabel label="EXPLORE" collapsed={!sidebarOpen} light={light} />
        <ul className="flex flex-col gap-0.5">
          {EXPLORE_ITEMS.map((item) => (
            <li key={item.id}>
              <Item item={item} collapsed={!sidebarOpen} light={light} />
            </li>
          ))}
        </ul>

        <SectionLabel label="SYSTEM" collapsed={!sidebarOpen} light={light} />
        <ul className="flex flex-col gap-0.5">
          {SYSTEM_ITEMS.map((item) => (
            <li key={item.id}>
              <Item item={item} collapsed={!sidebarOpen} light={light} />
            </li>
          ))}
        </ul>
      </nav>

      {/* User Block */}
      <div
        className={cn(
          'p-2.5 border-t',
          light ? 'border-ink/[0.06]' : 'border-white/[0.05]'
        )}
      >
        <UserBlock collapsed={!sidebarOpen} light={light} />
      </div>

      {/* Collapse toggle */}
      <button
        onClick={toggleSidebar}
        className={cn(
          'absolute -right-3 top-20 h-6 w-6 rounded-full border flex items-center justify-center transition-colors z-40',
          light
            ? 'border-ink/10 bg-white hover:border-ocean/50 hover:bg-ocean/5'
            : 'border-white/10 bg-abyss hover:border-cyan/50 hover:bg-cyan/10'
        )}
        aria-label={sidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}
      >
        {sidebarOpen ? (
          <ChevronLeft className={cn('h-3 w-3', light ? 'text-ocean' : 'text-cyan')} />
        ) : (
          <ChevronRight className={cn('h-3 w-3', light ? 'text-ocean' : 'text-cyan')} />
        )}
      </button>
    </motion.aside>
  );
}

// ---------- Mobile Bottom Navigation ----------
const MOBILE_ITEMS: SidebarItem[] = [
  { id: 'home', label: 'Home', href: '/', icon: LayoutDashboard },
  { id: 'map', label: 'Map', href: '/map', icon: Radar },
  { id: 'chat', label: 'Chat', href: '/assistant', icon: MessageSquare },
  {
    id: 'alerts',
    label: 'Alerts',
    href: '/alerts',
    icon: AlertTriangle,
    badge: 3,
    badgeVariant: 'error',
  },
  { id: 'more', label: 'More', href: '/explore', icon: Boxes },
];

export function MobileBottomNav() {
  const location = useLocation();

  return (
    <nav
      className="lg:hidden fixed bottom-0 inset-x-0 z-40 border-t border-white/[0.08] bg-abyss/95 backdrop-blur-xl"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
      aria-label="Mobile navigation"
    >
      <ul className="flex items-center justify-around h-16">
        {MOBILE_ITEMS.map((item) => {
          const isActive =
            location.pathname === item.href ||
            (item.href !== '/' && location.pathname.startsWith(item.href));
          const Icon = item.icon;
          return (
            <li key={item.id} className="flex-1">
              <Link
                to={item.href}
                className={cn(
                  'relative flex flex-col items-center justify-center gap-1 py-2 transition-colors',
                  isActive ? 'text-cyan' : 'text-white/50'
                )}
              >
                {isActive && (
                  <motion.span
                    layoutId="mobile-active"
                    className="absolute top-0 inset-x-4 h-0.5 bg-cyan rounded-full"
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}
                <Icon className="h-4.5 w-4.5" />
                <span className="text-[10px] font-medium">{item.label}</span>
                {item.badge !== undefined && (
                  <span className="absolute top-1.5 right-1/4 h-3 min-w-3 px-0.5 rounded-full bg-magenta text-abyss font-mono text-[8px] font-bold flex items-center justify-center">
                    {item.badge}
                  </span>
                )}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
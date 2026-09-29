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
import { useUI } from '@/store/useAppStore';

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

// ---------- Sidebar Item ----------
function Item({ item, collapsed }: { item: SidebarItem; collapsed: boolean }) {
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
          ? 'bg-cyan/[0.08] text-white'
          : 'text-white/55 hover:text-white hover:bg-white/[0.04]'
      )}
      title={collapsed ? item.label : undefined}
    >
      {isActive && (
        <motion.span
          layoutId="sidebar-active"
          className="absolute left-0 top-1/2 -translate-y-1/2 h-5 w-0.5 rounded-full bg-cyan"
          transition={{ type: 'spring', stiffness: 400, damping: 30 }}
        />
      )}
      <Icon
        className={cn(
          'h-4 w-4 shrink-0 transition-colors',
          isActive ? 'text-cyan' : 'text-white/45 group-hover:text-white/80'
        )}
      />
      {!collapsed && (
        <>
          <span className="flex-1 truncate">{item.label}</span>
          {item.badge !== undefined && (
            <span
              className={cn(
                'font-mono text-[9px] font-bold rounded-full min-w-4 px-1.5 h-4 flex items-center justify-center',
                item.badgeVariant === 'error' && 'bg-magenta/20 text-magenta',
                item.badgeVariant === 'warning' && 'bg-amber-400/20 text-amber-400',
                (!item.badgeVariant || item.badgeVariant === 'default') &&
                  'bg-cyan/20 text-cyan'
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
}: {
  label: string;
  collapsed: boolean;
}) {
  if (collapsed) {
    return <div className="my-2 mx-auto h-px w-6 bg-white/5" aria-hidden="true" />;
  }
  return (
    <div className="px-3 pt-5 pb-2 font-mono text-[9px] tracking-[0.2em] text-white/30">
      {label}
    </div>
  );
}

// ---------- User Block ----------
function UserBlock({ collapsed }: { collapsed: boolean }) {
  return (
    <div
      className={cn(
        'flex items-center gap-3 p-2.5 rounded-lg border border-white/[0.06] bg-white/[0.02]',
        collapsed && 'justify-center p-2'
      )}
    >
      <div className="relative shrink-0">
        <div className="h-8 w-8 rounded-full bg-gradient-to-br from-cyan to-teal flex items-center justify-center text-abyss font-display font-bold text-xs">
          P
        </div>
        <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-teal border-2 border-abyss" />
      </div>
      {!collapsed && (
        <div className="min-w-0 flex-1">
          <p className="text-xs font-semibold text-white truncate">Prajwal R.</p>
          <p className="font-mono text-[9px] text-cyan/60 truncate">Researcher</p>
        </div>
      )}
    </div>
  );
}

// ---------- Main Sidebar ----------
export function Sidebar() {
  const { sidebarOpen, toggleSidebar } = useUI();

  return (
    <motion.aside
      className={cn(
        'hidden lg:flex flex-col shrink-0 h-screen sticky top-0 z-30 border-r border-white/[0.05] bg-abyss/30 backdrop-blur-md',
        'transition-[width] duration-300 ease-out'
      )}
      animate={{ width: sidebarOpen ? 240 : 68 }}
    >
      {/* Header */}
      <div className="h-16 shrink-0 border-b border-white/[0.05] flex items-center px-4">
        {sidebarOpen ? (
          <span className="font-mono text-[9px] tracking-[0.2em] text-white/30">
            WORKSPACE
          </span>
        ) : (
          <span className="h-1 w-1 rounded-full bg-cyan animate-pulse mx-auto" />
        )}
      </div>

      {/* Primary Navigation */}
      <nav className="flex-1 overflow-y-auto px-2 pb-3 no-scrollbar">
        <SectionLabel label="MONITOR" collapsed={!sidebarOpen} />
        <ul className="flex flex-col gap-0.5">
          {WORKSPACE_ITEMS.map((item) => (
            <li key={item.id}>
              <Item item={item} collapsed={!sidebarOpen} />
            </li>
          ))}
        </ul>

        <SectionLabel label="EXPLORE" collapsed={!sidebarOpen} />
        <ul className="flex flex-col gap-0.5">
          {EXPLORE_ITEMS.map((item) => (
            <li key={item.id}>
              <Item item={item} collapsed={!sidebarOpen} />
            </li>
          ))}
        </ul>

        <SectionLabel label="SYSTEM" collapsed={!sidebarOpen} />
        <ul className="flex flex-col gap-0.5">
          {SYSTEM_ITEMS.map((item) => (
            <li key={item.id}>
              <Item item={item} collapsed={!sidebarOpen} />
            </li>
          ))}
        </ul>
      </nav>

      {/* User Block */}
      <div className="p-2.5 border-t border-white/[0.05]">
        <UserBlock collapsed={!sidebarOpen} />
      </div>

      {/* Collapse toggle */}
      <button
        onClick={toggleSidebar}
        className="absolute -right-3 top-20 h-6 w-6 rounded-full border border-white/10 bg-abyss flex items-center justify-center hover:border-cyan/50 hover:bg-cyan/10 transition-colors z-40"
        aria-label={sidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}
      >
        {sidebarOpen ? (
          <ChevronLeft className="h-3 w-3 text-cyan" />
        ) : (
          <ChevronRight className="h-3 w-3 text-cyan" />
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
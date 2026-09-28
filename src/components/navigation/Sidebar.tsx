import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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

const SIDEBAR_ITEMS: SidebarItem[] = [
  { id: 'map', label: 'Live Map', href: '/map', icon: Radar },
  { id: 'chat', label: 'AI Chat (ORCA)', href: '/assistant', icon: MessageSquare },
  { id: 'tracking', label: 'Vessel Tracking', href: '/vessels', icon: LayoutDashboard },
  { id: 'layers', label: 'Ocean Layers', href: '/ocean', icon: Layers },
  { id: 'alerts', label: 'Risk & Alerts', href: '/alerts', icon: AlertTriangle, badge: 3, badgeVariant: 'error' },
  { id: 'simulation', label: 'Simulation Lab', href: '/simulations', icon: FlaskConical },
  { id: 'explorer', label: '3D Explorer', href: '/explorer', icon: Boxes },
  { id: 'learning', label: 'Learning Hub', href: '/learning', icon: GraduationCap },
  { id: 'games', label: 'Marine Games', href: '/games', icon: Gamepad2 },
  { id: 'community', label: 'Community', href: '/community', icon: Users },
];

const SECONDARY_ITEMS: SidebarItem[] = [
  { id: 'settings', label: 'Settings', href: '/settings', icon: Settings },
];

// ---------- Sidebar Item ----------
function Item({
  item,
  collapsed,
}: {
  item: SidebarItem;
  collapsed: boolean;
}) {
  const location = useLocation();
  const isActive = location.pathname === item.href || location.pathname.startsWith(item.href + '/');
  const Icon = item.icon;

  return (
    <Link
      to={item.href}
      className={cn(
        'group relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-all',
        collapsed && 'justify-center px-2',
        isActive
          ? 'bg-cyan/10 text-cyan border border-cyan/30'
          : 'text-muted-foreground border border-transparent hover:text-white hover:bg-white/5 hover:border-white/10'
      )}
      title={collapsed ? item.label : undefined}
    >
      {isActive && (
        <motion.span
          layoutId="sidebar-active"
          className="absolute left-0 top-1/2 -translate-y-1/2 h-6 w-0.5 rounded-full bg-cyan shadow-[0_0_10px_rgba(6,182,212,0.8)]"
          transition={{ type: 'spring', stiffness: 400, damping: 30 }}
        />
      )}
      <Icon className={cn('h-4 w-4 shrink-0 transition-transform group-hover:scale-110', isActive && 'text-cyan')} />
      {!collapsed && (
        <>
          <span className="flex-1 truncate">{item.label}</span>
          {item.badge !== undefined && (
            <span
              className={cn(
                'font-mono text-[9px] font-bold rounded-full min-w-4 px-1.5 h-4 flex items-center justify-center',
                item.badgeVariant === 'error' && 'bg-magenta/20 text-magenta',
                item.badgeVariant === 'warning' && 'bg-amber-400/20 text-amber-400',
                (!item.badgeVariant || item.badgeVariant === 'default') && 'bg-cyan/20 text-cyan'
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

// ---------- User Block ----------
function UserBlock({ collapsed }: { collapsed: boolean }) {
  return (
    <div
      className={cn(
        'flex items-center gap-3 p-3 rounded-lg border border-white/5 bg-white/[0.02]',
        collapsed && 'justify-center p-2'
      )}
    >
      <div className="relative shrink-0">
        <div className="h-9 w-9 rounded-full bg-gradient-to-br from-cyan to-teal flex items-center justify-center text-abyss font-display font-bold text-sm">
          P
        </div>
        <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full bg-teal border-2 border-abyss" />
      </div>
      {!collapsed && (
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-white truncate">Prajwal R.</p>
          <p className="font-mono text-[10px] text-cyan/70 truncate">Researcher</p>
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
        'hidden lg:flex flex-col shrink-0 h-screen sticky top-0 z-30 border-r border-white/5 bg-abyss/40 backdrop-blur-md',
        'transition-[width] duration-300 ease-out'
      )}
      animate={{ width: sidebarOpen ? 256 : 72 }}
    >
      {/* Header / Logo spacer */}
      <div className="h-16 shrink-0 border-b border-white/5 flex items-center px-4">
        {sidebarOpen ? (
          <span className="telemetry-text text-[10px] text-cyan/60">NAVIGATION</span>
        ) : (
          <span className="h-1 w-1 rounded-full bg-cyan animate-pulse mx-auto" />
        )}
      </div>

      {/* Primary Navigation */}
      <nav className="flex-1 overflow-y-auto p-3 no-scrollbar">
        <ul className="flex flex-col gap-1">
          {SIDEBAR_ITEMS.map((item) => (
            <li key={item.id}>
              <Item item={item} collapsed={!sidebarOpen} />
            </li>
          ))}
        </ul>

        {sidebarOpen && (
          <div className="mt-6 pt-6 border-t border-white/5">
            <span className="telemetry-text text-[10px] text-cyan/60 px-3">SYSTEM</span>
            <ul className="flex flex-col gap-1 mt-2">
              {SECONDARY_ITEMS.map((item) => (
                <li key={item.id}>
                  <Item item={item} collapsed={false} />
                </li>
              ))}
            </ul>
          </div>
        )}
      </nav>

      {/* User Block */}
      <div className="p-3 border-t border-white/5">
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
  { id: 'alerts', label: 'Alerts', href: '/alerts', icon: AlertTriangle, badge: 3, badgeVariant: 'error' },
  { id: 'more', label: 'More', href: '/explore', icon: Boxes },
];

export function MobileBottomNav() {
  const location = useLocation();

  return (
    <nav
      className="lg:hidden fixed bottom-0 inset-x-0 z-40 border-t border-white/10 bg-abyss/90 backdrop-blur-xl"
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
                  isActive ? 'text-cyan' : 'text-muted-foreground'
                )}
              >
                {isActive && (
                  <motion.span
                    layoutId="mobile-active"
                    className="absolute top-0 inset-x-4 h-0.5 bg-cyan rounded-full shadow-[0_0_10px_rgba(6,182,212,0.8)]"
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
import * as React from 'react';
import {
  motion,
  useScroll,
  useMotionValueEvent,
  AnimatePresence,
} from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import {
  Search,
  Bell,
  Menu,
  X,
  Command,
  ChevronDown,
  User as UserIcon,
  Settings,
  LogOut,
  Waves,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { cn } from '@/lib/utils';
import { PRIMARY_NAV } from '@/lib/constants';
import { useUI, useUser } from '@/store/useAppStore';
import { useCommandPaletteShortcut } from '@/hooks/useKeyboard';

// ---------- ORCA Logo ----------
export function OrcaLogo({
  className,
  showText = true,
}: {
  className?: string;
  showText?: boolean;
}) {
  return (
    <Link
      to="/"
      className={cn('flex items-center gap-2.5 group', className)}
      aria-label="ORCA Home"
    >
      <div className="relative flex h-8 w-8 items-center justify-center">
        <svg
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="h-8 w-8 text-cyan transition-transform duration-500 group-hover:rotate-[8deg]"
        >
          <path
            d="M4 18c2-6 6-10 12-10s10 4 12 10c-2 1-4 2-6 2-1 3-3 4-6 4s-5-1-6-4c-2 0-4-1-6-2z"
            fill="currentColor"
            fillOpacity="0.15"
            stroke="currentColor"
            strokeWidth="1.2"
            strokeLinejoin="round"
          />
          <path
            d="M10 16c1-1.5 3-2.5 6-2.5s5 1 6 2.5"
            stroke="currentColor"
            strokeWidth="1.2"
            strokeLinecap="round"
          />
          <circle cx="12.5" cy="15" r="0.8" fill="currentColor" />
          <circle cx="19.5" cy="15" r="0.8" fill="currentColor" />
          <path
            d="M16 8v3"
            stroke="currentColor"
            strokeWidth="1.2"
            strokeLinecap="round"
          />
          <circle cx="16" cy="6" r="1.2" fill="currentColor" opacity="0.6" />
        </svg>
        <span className="absolute -inset-1 rounded-full bg-cyan/20 blur-md opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>
      {showText && (
        <div className="flex flex-col leading-none">
          <span className="font-display text-lg font-bold tracking-[0.15em] text-white">
            ORCA
          </span>
          <span className="font-mono text-[8px] tracking-[0.25em] text-cyan/70 mt-0.5">
            MARINE INTELLIGENCE
          </span>
        </div>
      )}
    </Link>
  );
}

// ---------- Nav Link ----------
function NavLink({
  item,
}: {
  item: { label: string; href: string; badge?: string };
}) {
  const location = useLocation();
  const isActive =
    location.pathname === item.href ||
    (item.href !== '/' && location.pathname.startsWith(item.href));

  return (
    <Link
      to={item.href}
      className={cn(
        'relative px-3 py-2 text-[13px] font-medium rounded-md transition-colors whitespace-nowrap',
        isActive
          ? 'text-white'
          : 'text-white/60 hover:text-white hover:bg-white/[0.04]'
      )}
    >
      {isActive && (
        <motion.span
          layoutId="nav-active"
          className="absolute inset-x-2 -bottom-px h-px bg-gradient-to-r from-transparent via-cyan to-transparent"
          transition={{ type: 'spring', stiffness: 400, damping: 30 }}
        />
      )}
      <span className="relative">
        {item.label}
        {item.badge && (
          <span className="absolute -top-1.5 -right-3 font-mono text-[8px] text-cyan">
            {item.badge}
          </span>
        )}
      </span>
    </Link>
  );
}

// ---------- Search Trigger ----------
function SearchTrigger({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="group hidden lg:flex items-center gap-2.5 h-9 w-56 xl:w-64 px-3 rounded-lg border border-white/10 bg-white/[0.02] backdrop-blur-md text-sm text-white/50 hover:border-cyan/40 hover:bg-white/[0.04] transition-all"
      aria-label="Open search"
    >
      <Search className="h-3.5 w-3.5 group-hover:text-cyan transition-colors" />
      <span className="flex-1 text-left text-xs">
        Search vessels, regions, data...
      </span>
      <kbd className="inline-flex items-center gap-0.5 rounded border border-white/10 bg-abyss/60 px-1.5 py-0.5 font-mono text-[10px] text-white/50">
        <Command className="h-2.5 w-2.5" />K
      </kbd>
    </button>
  );
}

// ---------- User Menu ----------
function UserMenu() {
  const { user } = useUser();
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.02] p-0.5 pr-2.5 hover:border-cyan/40 transition-colors"
        aria-haspopup="menu"
        aria-expanded={open}
      >
        <div className="h-7 w-7 rounded-full bg-gradient-to-br from-cyan to-teal flex items-center justify-center text-abyss font-display font-semibold text-xs">
          {user?.name?.[0]?.toUpperCase() ?? 'G'}
        </div>
        <ChevronDown
          className={cn(
            'h-3 w-3 text-white/50 transition-transform',
            open && 'rotate-180'
          )}
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 mt-2 w-56 rounded-xl border border-white/10 bg-abyss/95 backdrop-blur-xl shadow-glass overflow-hidden z-50"
            role="menu"
          >
            <div className="p-3 border-b border-white/5">
              <p className="text-sm font-semibold text-white truncate">
                {user?.name ?? 'Guest User'}
              </p>
              <p className="font-mono text-[10px] text-white/50 truncate">
                {user?.email ?? 'guest@orca.marine'}
              </p>
              {user && (
                <div className="mt-2 flex items-center gap-2">
                  <Badge variant="default" size="sm">
                    LVL {user.level}
                  </Badge>
                  <Badge variant="teal" size="sm">
                    {user.xp} XP
                  </Badge>
                </div>
              )}
            </div>
            <div className="py-1">
              <MenuLink
                to="/profile"
                icon={<UserIcon className="h-3.5 w-3.5" />}
                label="Profile"
              />
              <MenuLink
                to="/settings"
                icon={<Settings className="h-3.5 w-3.5" />}
                label="Settings"
              />
            </div>
            <div className="py-1 border-t border-white/5">
              <button
                className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-magenta hover:bg-magenta/5 transition-colors text-left"
                role="menuitem"
              >
                <LogOut className="h-3.5 w-3.5" />
                Sign Out
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function MenuLink({
  to,
  icon,
  label,
}: {
  to: string;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <Link
      to={to}
      className="flex items-center gap-2.5 px-3 py-2 text-xs text-white/60 hover:text-white hover:bg-white/[0.04] transition-colors"
      role="menuitem"
    >
      {icon}
      {label}
    </Link>
  );
}

// ---------- Alert Indicator ----------
function AlertIndicator() {
  const [count] = React.useState(3);
  return (
    <button
      className="relative h-9 w-9 rounded-lg border border-white/10 bg-white/[0.02] flex items-center justify-center hover:border-cyan/40 hover:bg-white/[0.04] transition-colors"
      aria-label={`${count} alerts`}
    >
      <Bell className="h-4 w-4 text-white/60" />
      {count > 0 && (
        <>
          <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-magenta animate-pulse" />
          <span className="absolute -bottom-1 -right-1 h-4 min-w-4 px-1 rounded-full bg-magenta text-abyss font-mono text-[9px] font-bold flex items-center justify-center">
            {count}
          </span>
        </>
      )}
    </button>
  );
}

// ---------- Main Navbar ----------
export function Navbar() {
  const { scrollY } = useScroll();
  const [scrolled, setScrolled] = React.useState(false);
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const { toggleCommandPalette } = useUI();

  useMotionValueEvent(scrollY, 'change', (latest) => {
    setScrolled(latest > 20);
  });

  useCommandPaletteShortcut(toggleCommandPalette);

  React.useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileOpen]);

  return (
    <>
      <motion.header
        className={cn(
          'fixed top-0 inset-x-0 z-40 transition-all duration-300',
          scrolled
            ? 'bg-abyss/85 backdrop-blur-xl border-b border-white/[0.06]'
            : 'bg-transparent'
        )}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="flex items-center gap-4 px-4 lg:px-6 h-16 max-w-[1600px] mx-auto">
          <OrcaLogo />

          <nav
            className="hidden xl:flex items-center gap-1 ml-6"
            aria-label="Main navigation"
          >
            {PRIMARY_NAV.slice(0, 7).map((item) => (
              <NavLink key={item.href} item={item} />
            ))}
          </nav>

          <div className="flex-1" />

          <SearchTrigger onClick={toggleCommandPalette} />

          <AlertIndicator />

          <UserMenu />

          <Button
            size="sm"
            rightIcon={<span className="text-base leading-none">→</span>}
            className="hidden lg:inline-flex"
          >
            Launch ORCA
          </Button>

          <button
            className="xl:hidden h-9 w-9 rounded-lg border border-white/10 bg-white/[0.02] flex items-center justify-center hover:border-cyan/40 transition-colors"
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
          >
            <Menu className="h-4 w-4" />
          </button>
        </div>

        {scrolled && (
          <div className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-cyan/30 to-transparent" />
        )}
      </motion.header>

      <AnimatePresence>
        {mobileOpen && <MobileDrawer onClose={() => setMobileOpen(false)} />}
      </AnimatePresence>
    </>
  );
}

// ---------- Mobile Drawer ----------
function MobileDrawer({ onClose }: { onClose: () => void }) {
  return (
    <>
      <motion.div
        className="fixed inset-0 z-50 bg-abyss/85 backdrop-blur-md xl:hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      />
      <motion.aside
        className="fixed top-0 right-0 bottom-0 z-50 w-full max-w-sm bg-abyss border-l border-white/10 flex flex-col xl:hidden"
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', stiffness: 300, damping: 35 }}
      >
        <div className="flex items-center justify-between p-4 border-b border-white/5">
          <OrcaLogo />
          <button
            onClick={onClose}
            className="h-9 w-9 rounded-lg border border-white/10 flex items-center justify-center hover:border-cyan/40 transition-colors"
            aria-label="Close menu"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <nav className="flex-1 overflow-y-auto p-4">
          <ul className="flex flex-col gap-1">
            {PRIMARY_NAV.map((item, i) => (
              <motion.li
                key={item.href}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.03, duration: 0.3 }}
              >
                <Link
                  to={item.href}
                  onClick={onClose}
                  className="flex items-center justify-between px-4 py-3 rounded-lg text-white/80 hover:text-white hover:bg-white/[0.04] transition-colors text-sm font-medium"
                >
                  {item.label}
                  <Waves className="h-4 w-4 text-cyan/40" />
                </Link>
              </motion.li>
            ))}
          </ul>
        </nav>
        <div className="p-4 border-t border-white/5">
          <Button fullWidth size="md">
            Launch ORCA
          </Button>
        </div>
      </motion.aside>
    </>
  );
}
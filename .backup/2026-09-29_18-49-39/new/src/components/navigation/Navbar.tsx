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

// Routes rendered on the dark operational surface. On every other route
// the navbar adopts a light editorial surface.
const WORKBENCH_ROUTES = ['/map', '/assistant', '/explorer'];

function useIsWorkbenchSurface(): boolean {
  const location = useLocation();
  return WORKBENCH_ROUTES.some((p) => location.pathname.startsWith(p));
}

// ---------- ORCA Logo ----------
export function OrcaLogo({
  className,
  showText = true,
  light = false,
}: {
  className?: string;
  showText?: boolean;
  light?: boolean;
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
          className={cn(
            'h-8 w-8 transition-transform duration-500 group-hover:rotate-[8deg]',
            light ? 'text-ocean' : 'text-cyan'
          )}
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
        <span
          className={cn(
            'absolute -inset-1 rounded-full blur-md opacity-0 group-hover:opacity-100 transition-opacity',
            light ? 'bg-ocean/20' : 'bg-cyan/20'
          )}
        />
      </div>
      {showText && (
        <div className="flex flex-col leading-none">
          <span
            className={cn(
              'font-display text-lg font-bold tracking-[0.15em]',
              light ? 'text-ink' : 'text-white'
            )}
          >
            ORCA
          </span>
          <span
            className={cn(
              'font-mono text-[8px] tracking-[0.25em] mt-0.5',
              light ? 'text-ocean/70' : 'text-cyan/70'
            )}
          >
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
  light,
}: {
  item: { label: string; href: string; badge?: string };
  light: boolean;
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
          ? light
            ? 'text-ink'
            : 'text-white'
          : light
            ? 'text-ink-soft hover:text-ink hover:bg-ink/[0.04]'
            : 'text-white/60 hover:text-white hover:bg-white/[0.04]'
      )}
    >
      {isActive && (
        <motion.span
          layoutId="nav-active"
          className={cn(
            'absolute inset-x-2 -bottom-px h-px bg-gradient-to-r from-transparent to-transparent',
            light ? 'via-ocean' : 'via-cyan'
          )}
          transition={{ type: 'spring', stiffness: 400, damping: 30 }}
        />
      )}
      <span className="relative">
        {item.label}
        {item.badge && (
          <span
            className={cn(
              'absolute -top-1.5 -right-3 font-mono text-[8px]',
              light ? 'text-ocean' : 'text-cyan'
            )}
          >
            {item.badge}
          </span>
        )}
      </span>
    </Link>
  );
}

// ---------- Search Trigger ----------
function SearchTrigger({
  onClick,
  light,
}: {
  onClick: () => void;
  light: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'group hidden lg:flex items-center gap-2.5 h-9 w-56 xl:w-64 px-3 rounded-lg border backdrop-blur-md text-sm transition-all',
        light
          ? 'border-ink/10 bg-white text-ink-soft hover:border-ocean/40 hover:bg-white'
          : 'border-white/10 bg-white/[0.02] text-white/50 hover:border-cyan/40 hover:bg-white/[0.04]'
      )}
      aria-label="Open search"
    >
      <Search
        className={cn(
          'h-3.5 w-3.5 transition-colors',
          light ? 'group-hover:text-ocean' : 'group-hover:text-cyan'
        )}
      />
      <span className="flex-1 text-left text-xs">
        Search vessels, regions, data...
      </span>
      <kbd
        className={cn(
          'inline-flex items-center gap-0.5 rounded border px-1.5 py-0.5 font-mono text-[10px]',
          light
            ? 'border-ink/10 bg-pearl-soft text-mist-deep'
            : 'border-white/10 bg-abyss/60 text-white/50'
        )}
      >
        <Command className="h-2.5 w-2.5" />K
      </kbd>
    </button>
  );
}

// ---------- User Menu ----------
function UserMenu({ light }: { light: boolean }) {
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

  const initial = (user?.name?.[0] ?? 'G').toUpperCase();

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((v) => !v)}
        className={cn(
          'flex items-center gap-2 rounded-full border p-0.5 pr-2.5 transition-colors',
          light
            ? 'border-ink/10 bg-white hover:border-ocean/40'
            : 'border-white/10 bg-white/[0.02] hover:border-cyan/40'
        )}
        aria-haspopup="menu"
        aria-expanded={open}
      >
        <div className="h-7 w-7 rounded-full bg-gradient-to-br from-cyan to-teal flex items-center justify-center text-abyss font-display font-semibold text-xs">
          {initial}
        </div>
        <ChevronDown
          className={cn(
            'h-3 w-3 transition-transform',
            light ? 'text-mist-deep' : 'text-white/50',
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
            className={cn(
              'absolute right-0 mt-2 w-56 rounded-xl border overflow-hidden z-50',
              light
                ? 'border-ink/10 bg-white shadow-soft-lg'
                : 'border-white/10 bg-abyss/95 backdrop-blur-xl shadow-glass'
            )}
            role="menu"
          >
            <div
              className={cn(
                'p-3 border-b',
                light ? 'border-ink/[0.06]' : 'border-white/5'
              )}
            >
              <p
                className={cn(
                  'text-sm font-semibold truncate',
                  light ? 'text-ink' : 'text-white'
                )}
              >
                {user?.name ?? 'Guest User'}
              </p>
              <p
                className={cn(
                  'font-mono text-[10px] truncate',
                  light ? 'text-mist-deep' : 'text-white/50'
                )}
              >
                {user?.email ?? 'guest@orca.marine'}
              </p>
              {user && (
                <div className="mt-2 flex items-center gap-2">
                  <Badge variant={light ? 'light-info' : 'default'} size="sm">
                    LVL {user.level}
                  </Badge>
                  <Badge variant={light ? 'light-teal' : 'teal'} size="sm">
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
                light={light}
              />
              <MenuLink
                to="/settings"
                icon={<Settings className="h-3.5 w-3.5" />}
                label="Settings"
                light={light}
              />
            </div>
            <div
              className={cn(
                'py-1 border-t',
                light ? 'border-ink/[0.06]' : 'border-white/5'
              )}
            >
              <button
                className={cn(
                  'w-full flex items-center gap-2.5 px-3 py-2 text-xs transition-colors text-left',
                  light
                    ? 'text-danger-deep hover:bg-danger/[0.06]'
                    : 'text-magenta hover:bg-magenta/5'
                )}
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
  light,
}: {
  to: string;
  icon: React.ReactNode;
  label: string;
  light: boolean;
}) {
  return (
    <Link
      to={to}
      className={cn(
        'flex items-center gap-2.5 px-3 py-2 text-xs transition-colors',
        light
          ? 'text-ink-soft hover:text-ink hover:bg-ink/[0.04]'
          : 'text-white/60 hover:text-white hover:bg-white/[0.04]'
      )}
      role="menuitem"
    >
      {icon}
      {label}
    </Link>
  );
}

// ---------- Alert Indicator ----------
function AlertIndicator({ light }: { light: boolean }) {
  const [count] = React.useState(3);
  return (
    <button
      className={cn(
        'relative h-9 w-9 rounded-lg border flex items-center justify-center transition-colors',
        light
          ? 'border-ink/10 bg-white hover:border-ocean/40 hover:bg-white'
          : 'border-white/10 bg-white/[0.02] hover:border-cyan/40 hover:bg-white/[0.04]'
      )}
      aria-label={`${count} alerts`}
    >
      <Bell className={cn('h-4 w-4', light ? 'text-ink-soft' : 'text-white/60')} />
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
  const isWorkbench = useIsWorkbenchSurface();
  const light = !isWorkbench;

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
            ? light
              ? 'bg-white/85 backdrop-blur-xl border-b border-ink/[0.06]'
              : 'bg-abyss/85 backdrop-blur-xl border-b border-white/[0.06]'
            : 'bg-transparent'
        )}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="flex items-center gap-4 px-4 lg:px-6 h-16 max-w-[1600px] mx-auto">
          <OrcaLogo light={light} />

          <nav
            className="hidden xl:flex items-center gap-1 ml-6"
            aria-label="Main navigation"
          >
            {PRIMARY_NAV.slice(0, 7).map((item) => (
              <NavLink key={item.href} item={item} light={light} />
            ))}
          </nav>

          <div className="flex-1" />

          <SearchTrigger onClick={toggleCommandPalette} light={light} />

          <AlertIndicator light={light} />

          <UserMenu light={light} />

          <Button
            size="sm"
            variant={light ? 'primary-light' : 'primary'}
            rightIcon={<span className="text-base leading-none">→</span>}
            className="hidden lg:inline-flex"
          >
            Launch ORCA
          </Button>

          <button
            className={cn(
              'xl:hidden h-9 w-9 rounded-lg border flex items-center justify-center transition-colors',
              light
                ? 'border-ink/10 bg-white hover:border-ocean/40'
                : 'border-white/10 bg-white/[0.02] hover:border-cyan/40'
            )}
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
          >
            <Menu className={cn('h-4 w-4', light ? 'text-ink' : 'text-white')} />
          </button>
        </div>

        {scrolled && (
          <div
            className={cn(
              'absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent to-transparent',
              light ? 'via-ocean/30' : 'via-cyan/30'
            )}
          />
        )}
      </motion.header>

      <AnimatePresence>
        {mobileOpen && (
          <MobileDrawer onClose={() => setMobileOpen(false)} light={light} />
        )}
      </AnimatePresence>
    </>
  );
}

// ---------- Mobile Drawer ----------
function MobileDrawer({ onClose, light }: { onClose: () => void; light: boolean }) {
  return (
    <>
      <motion.div
        className="fixed inset-0 z-50 bg-abyss/70 backdrop-blur-md xl:hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      />
      <motion.aside
        className={cn(
          'fixed top-0 right-0 bottom-0 z-50 w-full max-w-sm border-l flex flex-col xl:hidden',
          light ? 'bg-white border-ink/10' : 'bg-abyss border-white/10'
        )}
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', stiffness: 300, damping: 35 }}
      >
        <div
          className={cn(
            'flex items-center justify-between p-4 border-b',
            light ? 'border-ink/[0.06]' : 'border-white/5'
          )}
        >
          <OrcaLogo light={light} />
          <button
            onClick={onClose}
            className={cn(
              'h-9 w-9 rounded-lg border flex items-center justify-center transition-colors',
              light
                ? 'border-ink/10 hover:border-ocean/40'
                : 'border-white/10 hover:border-cyan/40'
            )}
            aria-label="Close menu"
          >
            <X className={cn('h-4 w-4', light ? 'text-ink' : 'text-white')} />
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
                  className={cn(
                    'flex items-center justify-between px-4 py-3 rounded-lg transition-colors text-sm font-medium',
                    light
                      ? 'text-ink-soft hover:text-ink hover:bg-ink/[0.04]'
                      : 'text-white/80 hover:text-white hover:bg-white/[0.04]'
                  )}
                >
                  {item.label}
                  <Waves className={cn('h-4 w-4', light ? 'text-ocean/40' : 'text-cyan/40')} />
                </Link>
              </motion.li>
            ))}
          </ul>
        </nav>
        <div
          className={cn(
            'p-4 border-t',
            light ? 'border-ink/[0.06]' : 'border-white/5'
          )}
        >
          <Button fullWidth size="md" variant={light ? 'primary-light' : 'primary'}>
            Launch ORCA
          </Button>
        </div>
      </motion.aside>
    </>
  );
}
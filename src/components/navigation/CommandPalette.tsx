import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  Radar,
  MessageSquare,
  Boxes,
  FlaskConical,
  GraduationCap,
  Gamepad2,
  AlertTriangle,
  Ship,
  Waves,
  Compass,
  Command as CommandIcon,
  ArrowRight,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useUI } from '@/store/useAppStore';
import { useCommandPaletteShortcut, useEscapeKey } from '@/hooks/useKeyboard';

interface Command {
  id: string;
  label: string;
  description?: string;
  icon: React.ComponentType<{ className?: string }>;
  category: 'navigation' | 'action' | 'search' | 'recent';
  href?: string;
  action?: () => void;
  keywords?: string[];
  shortcut?: string[];
}

const COMMANDS: Command[] = [
  // Navigation
  { id: 'open-map', label: 'Open Live Marine Map', icon: Radar, category: 'navigation', href: '/map', keywords: ['gis', 'layers', 'geospatial'] },
  { id: 'open-chat', label: 'Ask ORCA', description: 'Open the AI Marine Assistant', icon: MessageSquare, category: 'navigation', href: '/assistant', keywords: ['ai', 'chat', 'ask'] },
  { id: 'open-explorer', label: 'Open 3D Explorer', icon: Boxes, category: 'navigation', href: '/explorer', keywords: ['three', 'webgl', 'lab'] },
  { id: 'open-sim', label: 'Run Simulation', icon: FlaskConical, category: 'navigation', href: '/simulations', keywords: ['model', 'scenario'] },
  { id: 'open-learning', label: 'Open Learning Lab', icon: GraduationCap, category: 'navigation', href: '/learning', keywords: ['course', 'quiz', 'learn'] },
  { id: 'open-games', label: 'Play Marine Games', icon: Gamepad2, category: 'navigation', href: '/games', keywords: ['game', 'play'] },
  { id: 'open-alerts', label: 'View Alerts', icon: AlertTriangle, category: 'navigation', href: '/alerts', keywords: ['warning', 'risk', 'emergency'] },
  { id: 'open-vessels', label: 'Vessel Intelligence', icon: Ship, category: 'navigation', href: '/vessels', keywords: ['ais', 'track', 'ship'] },
  { id: 'open-ocean', label: 'Ocean Intelligence', icon: Waves, category: 'navigation', href: '/ocean', keywords: ['sst', 'chlorophyll', 'currents'] },
  { id: 'open-regions', label: 'Find a Region', description: 'Search locations', icon: Compass, category: 'navigation', href: '/map', keywords: ['location', 'coordinates'] },

  // Actions
  { id: 'action-search-vessel', label: 'Search Vessel by MMSI', icon: Ship, category: 'action', keywords: ['mmsi', 'imo', 'lookup'] },
  { id: 'action-search-location', label: 'Search Location', icon: Compass, category: 'action', keywords: ['city', 'port', 'bay'] },
];

const CATEGORY_LABELS: Record<Command['category'], string> = {
  recent: 'Recent',
  navigation: 'Navigate',
  action: 'Actions',
  search: 'Search',
};

export function CommandPalette() {
  const { commandPaletteOpen, toggleCommandPalette } = useUI();
  const navigate = useNavigate();
  const [query, setQuery] = React.useState('');
  const [selectedIndex, setSelectedIndex] = React.useState(0);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const listRef = React.useRef<HTMLDivElement>(null);

  // Global shortcut
  useCommandPaletteShortcut(() => {
    toggleCommandPalette();
    setQuery('');
    setSelectedIndex(0);
  });

  useEscapeKey(() => {
    if (commandPaletteOpen) toggleCommandPalette();
  }, commandPaletteOpen);

  // Focus input on open
  React.useEffect(() => {
    if (commandPaletteOpen) {
      const t = setTimeout(() => inputRef.current?.focus(), 50);
      return () => clearTimeout(t);
    }
  }, [commandPaletteOpen]);

  // Filter commands
  const filtered = React.useMemo(() => {
    if (!query.trim()) return COMMANDS;
    const q = query.toLowerCase();
    return COMMANDS.filter((c) => {
      const haystack = [c.label, c.description ?? '', ...(c.keywords ?? [])].join(' ').toLowerCase();
      return haystack.includes(q);
    });
  }, [query]);

  // Group by category
  const grouped = React.useMemo(() => {
    const map: Partial<Record<Command['category'], Command[]>> = {};
    filtered.forEach((c) => {
      if (!map[c.category]) map[c.category] = [];
      map[c.category]!.push(c);
    });
    return map;
  }, [filtered]);

  // Flatten for keyboard navigation
  const flatList = React.useMemo(() => filtered, [filtered]);

  // Reset selection when results change
  React.useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  // Keyboard nav
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((i) => Math.min(i + 1, flatList.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const cmd = flatList[selectedIndex];
      if (cmd) executeCommand(cmd);
    }
  };

  const executeCommand = (cmd: Command) => {
    toggleCommandPalette();
    if (cmd.action) cmd.action();
    else if (cmd.href) navigate(cmd.href);
  };

  return (
    <AnimatePresence>
      {commandPaletteOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 z-[100] bg-abyss/70 backdrop-blur-md"
            onClick={toggleCommandPalette}
          />

          {/* Palette */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: -20 }}
            transition={{ type: 'spring', stiffness: 400, damping: 32 }}
            className="fixed top-[15%] left-1/2 -translate-x-1/2 z-[101] w-full max-w-2xl px-4"
            role="dialog"
            aria-modal="true"
            aria-label="Command palette"
          >
            <div className="relative rounded-2xl border border-cyan/20 bg-abyss/95 backdrop-blur-2xl shadow-[0_0_60px_rgba(6,182,212,0.2)] overflow-hidden">
              {/* HUD corners */}
              <span className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-cyan/60" />
              <span className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-cyan/60" />
              <span className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-cyan/60" />
              <span className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-cyan/60" />

              {/* Search input */}
              <div className="flex items-center gap-3 px-4 h-14 border-b border-white/5">
                <Search className="h-4 w-4 text-cyan shrink-0" />
                <input
                  ref={inputRef}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Search vessels, locations, data, actions..."
                  className="flex-1 bg-transparent outline-none text-sm text-white placeholder:text-muted-foreground"
                  spellCheck={false}
                />
                <kbd className="hidden sm:inline-flex items-center gap-0.5 rounded border border-white/10 bg-white/5 px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground">
                  ESC
                </kbd>
              </div>

              {/* Results */}
              <div
                ref={listRef}
                className="max-h-[60vh] overflow-y-auto p-2"
                role="listbox"
              >
                {flatList.length === 0 ? (
                  <div className="py-12 text-center">
                    <p className="font-mono text-xs text-muted-foreground">
                      NO RESULTS FOR "{query}"
                    </p>
                    <p className="font-mono text-[10px] text-cyan/40 mt-2">
                      TRY SEARCHING FOR VESSELS, LOCATIONS OR ACTIONS
                    </p>
                  </div>
                ) : (
                  Object.entries(grouped).map(([category, commands]) => (
                    <div key={category} className="mb-2 last:mb-0">
                      <div className="px-3 py-2 telemetry-text text-[9px] text-cyan/50">
                        {CATEGORY_LABELS[category as Command['category']]}
                      </div>
                      <ul className="flex flex-col gap-0.5">
                        {commands.map((cmd) => {
                          const globalIndex = flatList.indexOf(cmd);
                          const isSelected = globalIndex === selectedIndex;
                          const Icon = cmd.icon;
                          return (
                            <li key={cmd.id}>
                              <button
                                onClick={() => executeCommand(cmd)}
                                onMouseEnter={() => setSelectedIndex(globalIndex)}
                                className={cn(
                                  'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-colors',
                                  isSelected
                                    ? 'bg-cyan/10 border border-cyan/30'
                                    : 'border border-transparent hover:bg-white/5'
                                )}
                                role="option"
                                aria-selected={isSelected}
                              >
                                <div
                                  className={cn(
                                    'h-8 w-8 shrink-0 rounded-md flex items-center justify-center border',
                                    isSelected
                                      ? 'bg-cyan/20 border-cyan/40 text-cyan'
                                      : 'bg-white/5 border-white/10 text-muted-foreground'
                                  )}
                                >
                                  <Icon className="h-4 w-4" />
                                </div>
                                <div className="min-w-0 flex-1">
                                  <p className="text-sm font-medium text-white truncate">
                                    {cmd.label}
                                  </p>
                                  {cmd.description && (
                                    <p className="text-[11px] text-muted-foreground truncate">
                                      {cmd.description}
                                    </p>
                                  )}
                                </div>
                                {isSelected && (
                                  <ArrowRight className="h-3.5 w-3.5 text-cyan shrink-0" />
                                )}
                              </button>
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  ))
                )}
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between px-4 h-10 border-t border-white/5 bg-white/[0.01]">
                <div className="flex items-center gap-3 text-[10px] font-mono text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Kbd>↑</Kbd>
                    <Kbd>↓</Kbd>
                    navigate
                  </span>
                  <span className="flex items-center gap-1">
                    <Kbd>↵</Kbd>
                    select
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-[10px] font-mono text-cyan/60">
                  <CommandIcon className="h-3 w-3" />
                  ORCA COMMAND
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

function Kbd({ children }: { children: React.ReactNode }) {
  return (
    <kbd className="inline-flex items-center justify-center h-4 min-w-4 px-1 rounded border border-white/10 bg-white/5 font-mono text-[9px] text-muted-foreground">
      {children}
    </kbd>
  );
}
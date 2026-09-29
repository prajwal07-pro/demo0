import { motion, AnimatePresence } from 'framer-motion';
import { Command, Search, Keyboard, X } from 'lucide-react';
import { Shortcut } from '@/components/ui/Kbd';
import { useUI } from '@/store/useAppStore';
import { useEscapeKey, useKeyboardKey } from '@/hooks/useKeyboard';

interface ShortcutGroup {
  title: string;
  shortcuts: { label: string; keys: string[] }[];
}

const SHORTCUT_GROUPS: ShortcutGroup[] = [
  {
    title: 'Global',
    shortcuts: [
      { label: 'Open command palette', keys: ['⌘', 'K'] },
      { label: 'Focus search', keys: ['/'] },
      { label: 'Show this help', keys: ['?'] },
      { label: 'Close overlay', keys: ['Esc'] },
    ],
  },
  {
    title: 'Command palette',
    shortcuts: [
      { label: 'Navigate results', keys: ['↑', '↓'] },
      { label: 'Run command', keys: ['↵'] },
    ],
  },
  {
    title: 'AI assistant',
    shortcuts: [
      { label: 'Send message', keys: ['↵'] },
      { label: 'New line', keys: ['⇧', '↵'] },
      { label: 'Stop streaming', keys: ['Esc'] },
    ],
  },
  {
    title: 'Workspace',
    shortcuts: [
      { label: 'Toggle sidebar', keys: ['['] },
      { label: 'Toggle right panel', keys: [']'] },
    ],
  },
];

/**
 * ShortcutsOverlay — a keyboard help sheet triggered by `?`.
 *
 * Non-blocking: the user can press Escape or click the backdrop to close.
 * Purely informational; contains no interactive shortcuts of its own.
 */
export function ShortcutsOverlay() {
  const [open, setOpen] = useOverlayState();

  useKeyboardKey('?', () => setOpen((v) => !v), { enabled: true });
  useEscapeKey(() => setOpen(false), open);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 z-[120] bg-abyss/70 backdrop-blur-md"
            onClick={() => setOpen(false)}
            aria-hidden="true"
          />

          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Keyboard shortcuts"
            initial={{ opacity: 0, scale: 0.96, y: -12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: -12 }}
            transition={{ type: 'spring', stiffness: 320, damping: 30 }}
            className="fixed top-[12%] left-1/2 -translate-x-1/2 z-[121] w-full max-w-2xl px-4"
          >
            <div className="relative rounded-2xl border border-ink/10 bg-white shadow-soft-lg overflow-hidden">
              {/* Header */}
              <header className="flex items-center gap-3 px-6 py-4 border-b border-ink/[0.06]">
                <div className="h-9 w-9 rounded-lg border border-ocean/20 bg-ice flex items-center justify-center">
                  <Keyboard className="h-4 w-4 text-ocean" />
                </div>
                <div className="flex-1">
                  <div className="font-display text-base font-semibold text-ink">
                    Keyboard shortcuts
                  </div>
                  <div className="font-mono text-[10px] tracking-widest text-ocean">
                    ORCA · WORKSPACE
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  aria-label="Close"
                  className="h-8 w-8 rounded-lg border border-ink/10 flex items-center justify-center text-mist-deep hover:text-ink transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </header>

              {/* Groups */}
              <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8 max-h-[60vh] overflow-y-auto">
                {SHORTCUT_GROUPS.map((group) => (
                  <section key={group.title}>
                    <h3 className="font-mono text-[10px] tracking-widest uppercase text-ocean mb-3">
                      {group.title}
                    </h3>
                    <ul className="flex flex-col gap-2">
                      {group.shortcuts.map((s) => (
                        <li
                          key={s.label}
                          className="flex items-center justify-between gap-4"
                        >
                          <span className="text-sm text-ink-soft">{s.label}</span>
                          <Shortcut keys={s.keys} tone="light" />
                        </li>
                      ))}
                    </ul>
                  </section>
                ))}
              </div>

              <footer className="flex items-center justify-between px-6 py-3 border-t border-ink/[0.06] bg-pearl-soft">
                <div className="flex items-center gap-2 font-mono text-[10px] tracking-widest text-mist-deep">
                  <Command className="h-3 w-3" />
                  PRESS ? ANY TIME
                </div>
                <div className="flex items-center gap-2 font-mono text-[10px] tracking-widest text-mist-deep">
                  <Search className="h-3 w-3" />
                  / TO FOCUS SEARCH
                </div>
              </footer>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// Small local state hook so the overlay owns its own lifecycle and does
// not pollute the global UI store.
function useOverlayState(): [boolean, (updater: boolean | ((v: boolean) => boolean)) => void] {
  const [open, setOpen] = React.useState(false);
  return [open, setOpen];
}

// Local import of React for the state hook above.
import * as React from 'react';
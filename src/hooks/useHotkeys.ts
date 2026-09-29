import { useEffect, useRef } from 'react';

export interface HotkeyDefinition {
  /** Keys to listen for. Multiple keys in the array act as OR. */
  keys: string[];
  /** Optional modifier requirements. */
  meta?: boolean;
  ctrl?: boolean;
  shift?: boolean;
  alt?: boolean;
  /** Handler invoked when the hotkey matches. */
  handler: (event: KeyboardEvent) => void;
  /** Prevent default browser behavior. */
  preventDefault?: boolean;
  /** Only trigger when focus is not in an input or textarea. */
  ignoreInInputs?: boolean;
  /** Description used in help panels. */
  description?: string;
}

/**
 * useHotkeys — a small, focused multi-hotkey manager.
 *
 * Unlike the single-key hooks in `useKeyboard.ts`, this registers a set of
 * hotkeys at once and is the recommended way to wire global shortcuts on
 * a page. Handlers receive the raw keyboard event.
 *
 * Common shortcuts already wired elsewhere:
 *   - Cmd/Ctrl + K → command palette
 *   - Escape       → close overlays
 *   - "/"          → focus search
 */
export function useHotkeys(hotkeys: HotkeyDefinition[], enabled = true) {
  const hotkeysRef = useRef(hotkeys);
  hotkeysRef.current = hotkeys;

  useEffect(() => {
    if (!enabled || typeof window === 'undefined') return;

    const listener = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;

      for (const hk of hotkeysRef.current) {
        const {
          keys,
          meta,
          ctrl,
          shift,
          alt,
          handler,
          preventDefault,
          ignoreInInputs = true,
        } = hk;

        if (
          ignoreInInputs &&
          target &&
          (target.tagName === 'INPUT' ||
            target.tagName === 'TEXTAREA' ||
            target.isContentEditable)
        ) {
          continue;
        }

        if (!keys.some((k) => k.toLowerCase() === event.key.toLowerCase())) {
          continue;
        }

        if (meta !== undefined && event.metaKey !== meta) continue;
        if (ctrl !== undefined && event.ctrlKey !== ctrl) continue;
        if (shift !== undefined && event.shiftKey !== shift) continue;
        if (alt !== undefined && event.altKey !== alt) continue;

        if (preventDefault) event.preventDefault();
        handler(event);
        return;
      }
    };

    window.addEventListener('keydown', listener);
    return () => window.removeEventListener('keydown', listener);
  }, [enabled]);
}
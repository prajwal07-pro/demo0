import { useEffect, useRef, useState as useSafeState } from 'react';

type KeyHandler = (event: KeyboardEvent) => void;

interface UseKeyboardOptions {
  /** Whether the handler is active. Defaults to true. */
  enabled?: boolean;
  /** Prevent default browser behavior. Defaults to false. */
  preventDefault?: boolean;
  /** Stop event propagation. Defaults to false. */
  stopPropagation?: boolean;
  /** Target element to attach listener to. Defaults to document. */
  target?: HTMLElement | Document | Window;
}

/**
 * Attach a keyboard event listener to a specific key.
 * Supports modifiers: meta (Cmd/Ctrl), ctrl, shift, alt.
 */
export function useKeyboardKey(
  key: string,
  handler: KeyHandler,
  options: UseKeyboardOptions & {
    meta?: boolean;
    ctrl?: boolean;
    shift?: boolean;
    alt?: boolean;
  } = {}
) {
  const {
    enabled = true,
    preventDefault = false,
    stopPropagation = false,
    target,
    meta,
    ctrl,
    shift,
    alt,
  } = options;

  const handlerRef = useRef(handler);
  handlerRef.current = handler;

  useEffect(() => {
    if (!enabled || typeof window === 'undefined') return;

    const targetEl: EventTarget = target ?? document;

    const listener = (event: Event) => {
      const e = event as KeyboardEvent;

      if (e.key.toLowerCase() !== key.toLowerCase()) return;

      if (meta !== undefined && e.metaKey !== meta) return;
      if (ctrl !== undefined && e.ctrlKey !== ctrl) return;
      if (shift !== undefined && e.shiftKey !== shift) return;
      if (alt !== undefined && e.altKey !== alt) return;

      if (preventDefault) e.preventDefault();
      if (stopPropagation) e.stopPropagation();

      handlerRef.current(e);
    };

    targetEl.addEventListener('keydown', listener);
    return () => targetEl.removeEventListener('keydown', listener);
  }, [key, enabled, preventDefault, stopPropagation, target, meta, ctrl, shift, alt]);
}

/**
 * Command palette shortcut: Cmd/Ctrl + K
 */
export function useCommandPaletteShortcut(handler: () => void, enabled = true) {
  const handlerRef = useRef(handler);
  handlerRef.current = handler;

  useEffect(() => {
    if (!enabled || typeof window === 'undefined') return;

    const listener = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        event.stopPropagation();
        handlerRef.current();
      }
    };

    window.addEventListener('keydown', listener);
    return () => window.removeEventListener('keydown', listener);
  }, [enabled]);
}

/**
 * Escape key handler for closing modals, panels, etc.
 */
export function useEscapeKey(handler: () => void, enabled = true) {
  const handlerRef = useRef(handler);
  handlerRef.current = handler;

  useEffect(() => {
    if (!enabled || typeof window === 'undefined') return;

    const listener = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        handlerRef.current();
      }
    };

    window.addEventListener('keydown', listener);
    return () => window.removeEventListener('keydown', listener);
  }, [enabled]);
}

/**
 * Search focus shortcut: "/" (like GitHub)
 */
export function useSearchShortcut(handler: () => void, enabled = true) {
  const handlerRef = useRef(handler);
  handlerRef.current = handler;

  useEffect(() => {
    if (!enabled || typeof window === 'undefined') return;

    const listener = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement;
      if (
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable
      ) {
        return;
      }

      if (event.key === '/' && !event.metaKey && !event.ctrlKey) {
        event.preventDefault();
        handlerRef.current();
      }
    };

    window.addEventListener('keydown', listener);
    return () => window.removeEventListener('keydown', listener);
  }, [enabled]);
}

/**
 * General purpose keyboard handler that receives all keydown events.
 */
export function useKeyboard(
  handler: KeyHandler,
  options: UseKeyboardOptions = {}
) {
  const {
    enabled = true,
    preventDefault = false,
    stopPropagation = false,
    target,
  } = options;

  const handlerRef = useRef(handler);
  handlerRef.current = handler;

  useEffect(() => {
    if (!enabled || typeof window === 'undefined') return;

    const targetEl: EventTarget = target ?? document;

    const listener = (event: Event) => {
      const e = event as KeyboardEvent;
      if (preventDefault) e.preventDefault();
      if (stopPropagation) e.stopPropagation();
      handlerRef.current(e);
    };

    targetEl.addEventListener('keydown', listener);
    return () => targetEl.removeEventListener('keydown', listener);
  }, [enabled, preventDefault, stopPropagation, target]);
}

/**
 * Hook to detect if a specific key is currently held down.
 */
export function useKeyPress(targetKey: string): boolean {
  const [isPressed, setIsPressed] = useSafeState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const downHandler = (event: KeyboardEvent) => {
      if (event.key === targetKey) setIsPressed(true);
    };

    const upHandler = (event: KeyboardEvent) => {
      if (event.key === targetKey) setIsPressed(false);
    };

    window.addEventListener('keydown', downHandler);
    window.addEventListener('keyup', upHandler);

    return () => {
      window.removeEventListener('keydown', downHandler);
      window.removeEventListener('keyup', upHandler);
    };
  }, [targetKey]);

  return isPressed;
}
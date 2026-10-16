import { useState, useCallback, useRef, useEffect } from 'react';

/**
 * Custom hook to copy text to the clipboard with transient copied state feedback.
 *
 * @param {number} resetDurationMs - Duration in milliseconds before resetting copied state
 * @returns {{ isCopied: boolean, copyText: (text: string) => Promise<boolean> }}
 */
export const useClipboard = (resetDurationMs = 2200) => {
  const [isCopied, setIsCopied] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        window.clearTimeout(timerRef.current);
      }
    };
  }, []);

  const copyText = useCallback(
    async (text) => {
      if (!text || typeof window === 'undefined' || !navigator.clipboard) {
        return false;
      }

      try {
        await navigator.clipboard.writeText(text);
        setIsCopied(true);

        if (timerRef.current) {
          window.clearTimeout(timerRef.current);
        }

        timerRef.current = window.setTimeout(() => {
          setIsCopied(false);
        }, resetDurationMs);

        return true;
      } catch (err) {
        return false;
      }
    },
    [resetDurationMs]
  );

  return { isCopied, copyText };
};

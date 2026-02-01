import { useEffect, useState } from 'react';

/**
 * Hook to detect keyboard height on mobile devices using the visualViewport API.
 * Updates CSS custom property --keyboard-inset for use in fixed position elements.
 */
export const useKeyboardHeight = () => {
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  useEffect(() => {
    // This works on iOS Safari and Chrome for Android
    if (typeof window === 'undefined' || !window.visualViewport) {
      return;
    }

    const viewport = window.visualViewport;
    let initialHeight = viewport.height;

    const handleResize = () => {
      // Calculate the difference between initial viewport and current viewport
      // When keyboard opens, visualViewport.height shrinks
      const currentHeight = viewport.height;
      const heightDiff = Math.max(0, window.innerHeight - currentHeight);
      
      // Only consider it a keyboard if the difference is significant (> 100px)
      const newKeyboardHeight = heightDiff > 100 ? heightDiff : 0;
      
      setKeyboardHeight(newKeyboardHeight);
      
      // Update CSS custom property for use in stylesheets
      document.documentElement.style.setProperty(
        '--keyboard-inset',
        `${newKeyboardHeight}px`
      );
    };

    // Initial check
    handleResize();

    viewport.addEventListener('resize', handleResize);
    viewport.addEventListener('scroll', handleResize);

    // Also listen for focus events on inputs to help detect keyboard
    const handleFocus = (e: FocusEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable
      ) {
        // Small delay to let keyboard animation start
        setTimeout(handleResize, 100);
        setTimeout(handleResize, 300);
      }
    };

    const handleBlur = () => {
      // Reset when input loses focus
      setTimeout(() => {
        setKeyboardHeight(0);
        document.documentElement.style.setProperty('--keyboard-inset', '0px');
      }, 100);
    };

    document.addEventListener('focusin', handleFocus);
    document.addEventListener('focusout', handleBlur);

    return () => {
      viewport.removeEventListener('resize', handleResize);
      viewport.removeEventListener('scroll', handleResize);
      document.removeEventListener('focusin', handleFocus);
      document.removeEventListener('focusout', handleBlur);
      document.documentElement.style.setProperty('--keyboard-inset', '0px');
    };
  }, []);

  return keyboardHeight;
};

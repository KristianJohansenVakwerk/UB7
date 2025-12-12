"use client";

import { useEffect } from "react";

/**
 * Workaround for React DevTools compatibility issue with React 19
 * This suppresses the "Invalid argument not valid semver" error
 * that occurs when React DevTools tries to read React version
 * 
 * This is a known issue with React 19 and older React DevTools versions.
 * The best solution is to update your React DevTools browser extension.
 */
export function ReactDevToolsFix() {
  useEffect(() => {
    if (typeof window === "undefined") return;

    // Catch unhandled errors from React DevTools
    const handleError = (event: ErrorEvent) => {
      const errorMessage = event.message || "";
      if (
        errorMessage.includes("Invalid argument not valid semver") &&
        (errorMessage.includes("react_devtools_backend") ||
          event.filename?.includes("react_devtools"))
      ) {
        // Prevent the error from showing in console
        event.preventDefault();
        return false;
      }
    };

    // Suppress console errors from React DevTools
    const originalError = console.error;
    console.error = (...args: any[]) => {
      const errorMessage = args[0]?.toString() || "";
      if (
        errorMessage.includes("Invalid argument not valid semver") &&
        (errorMessage.includes("react_devtools_backend") ||
          args.some((arg) =>
            arg?.toString?.()?.includes("react_devtools")
          ))
      ) {
        // Silently ignore this specific error
        return;
      }
      // Call original console.error for all other errors
      originalError.apply(console, args);
    };

    window.addEventListener("error", handleError);

    return () => {
      window.removeEventListener("error", handleError);
      console.error = originalError;
    };
  }, []);

  return null;
}


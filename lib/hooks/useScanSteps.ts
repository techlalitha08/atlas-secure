"use client";

import { useCallback, useEffect, useRef, useState } from "react";

interface UseScanStepsOptions {
  /** Delay between advancing to the next step, in milliseconds. */
  intervalMs: number;
  /**
   * Called once the stepper reaches the final step on its own. Provide this for
   * self-completing (mock) scans; omit it for scans that finish when an async
   * request resolves (call {@link UseScanStepsResult.finish} instead).
   */
  onComplete?: () => void;
  /** Delay before {@link UseScanStepsOptions.onComplete} fires, in milliseconds. */
  completeDelayMs?: number;
}

interface UseScanStepsResult {
  currentStep: number;
  /** Reset to the first step and begin advancing through the steps. */
  start: () => void;
  /** Stop advancing and mark every step as complete. */
  finish: () => void;
  /** Stop advancing and reset back to the first step. */
  reset: () => void;
}

/**
 * Drives the {@link ScanProgress} step indicator used by every scanner page.
 * Replaces the near-identical `setInterval` step-advancing logic that was
 * duplicated across the scan pages.
 */
export function useScanSteps(stepCount: number, options: UseScanStepsOptions): UseScanStepsResult {
  const { intervalMs, onComplete, completeDelayMs = 0 } = options;
  const [currentStep, setCurrentStep] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clear = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  const start = useCallback(() => {
    clear();
    setCurrentStep(0);
    intervalRef.current = setInterval(() => {
      setCurrentStep((prev) => {
        const next = prev + 1;
        if (onComplete) {
          if (next >= stepCount) {
            if (intervalRef.current) {
              clearInterval(intervalRef.current);
              intervalRef.current = null;
            }
            timeoutRef.current = setTimeout(onComplete, completeDelayMs);
            return stepCount;
          }
          return next;
        }
        // Async-driven scans keep the last step spinning until finish() runs.
        return Math.min(next, stepCount - 1);
      });
    }, intervalMs);
  }, [clear, stepCount, intervalMs, onComplete, completeDelayMs]);

  const finish = useCallback(() => {
    clear();
    setCurrentStep(stepCount);
  }, [clear, stepCount]);

  const reset = useCallback(() => {
    clear();
    setCurrentStep(0);
  }, [clear]);

  useEffect(() => clear, [clear]);

  return { currentStep, start, finish, reset };
}

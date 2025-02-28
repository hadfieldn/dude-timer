import { useState, useEffect, useCallback } from "react";
import { SpeakerType } from "../types";

interface TimerData {
  value: number;
  lastStartTime: number | null;
  isActive: boolean;
}

interface TimerState {
  dude: TimerData;
  notDude: TimerData;
}

export const useTimer = () => {
  const [dudeTimer, setDudeTimer] = useState<TimerData>({
    value: 0,
    lastStartTime: null,
    isActive: false,
  });
  const [notDudeTimer, setNotDudeTimer] = useState<TimerData>({
    value: 0,
    lastStartTime: null,
    isActive: false,
  });

  // Load initial state from localStorage
  useEffect(() => {
    const stored = localStorage.getItem("timerState");
    if (stored) {
      const state: TimerState = JSON.parse(stored);

      // Calculate elapsed time for each active timer
      const now = Date.now();

      if (state.dude.isActive && state.dude.lastStartTime) {
        const elapsed =
          Math.floor((now - state.dude.lastStartTime) / 1000) * 1000;
        setDudeTimer({
          value: state.dude.value + elapsed,
          lastStartTime: now,
          isActive: true,
        });
      } else {
        setDudeTimer(state.dude);
      }

      if (state.notDude.isActive && state.notDude.lastStartTime) {
        const elapsed =
          Math.floor((now - state.notDude.lastStartTime) / 1000) * 1000;
        setNotDudeTimer({
          value: state.notDude.value + elapsed,
          lastStartTime: now,
          isActive: true,
        });
      } else {
        setNotDudeTimer(state.notDude);
      }
    }
  }, []);

  // Save state to localStorage whenever it changes, but debounced to once per second
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      const state: TimerState = {
        dude: dudeTimer,
        notDude: notDudeTimer,
      };
      localStorage.setItem("timerState", JSON.stringify(state));
    }, 1000);

    return () => clearTimeout(timeoutId);
  }, [dudeTimer, notDudeTimer]);

  // Update active timers
  useEffect(() => {
    let intervalId: number;

    if (dudeTimer.isActive || notDudeTimer.isActive) {
      intervalId = window.setInterval(() => {
        if (dudeTimer.isActive) {
          setDudeTimer((prev) => ({
            ...prev,
            value: prev.value + 1000,
          }));
        }

        if (notDudeTimer.isActive) {
          setNotDudeTimer((prev) => ({
            ...prev,
            value: prev.value + 1000,
          }));
        }
      }, 1000);
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [dudeTimer.isActive, notDudeTimer.isActive]);

  const toggleSpeaker = useCallback(
    (speaker: SpeakerType) => {
      const now = Date.now();

      let newDudeTimer = { ...dudeTimer };
      let newNotDudeTimer = { ...notDudeTimer };

      if (speaker === "dude") {
        if (dudeTimer.isActive) {
          // If dude timer is active, just stop it
          newDudeTimer = {
            ...dudeTimer,
            isActive: false,
            lastStartTime: null,
          };
        } else {
          // If dude timer is inactive, start it and stop not-dude timer
          newDudeTimer = {
            ...dudeTimer,
            isActive: true,
            lastStartTime: now,
          };
          if (notDudeTimer.isActive) {
            newNotDudeTimer = {
              ...notDudeTimer,
              isActive: false,
              lastStartTime: null,
            };
          }
        }
      } else {
        if (notDudeTimer.isActive) {
          // If not-dude timer is active, just stop it
          newNotDudeTimer = {
            ...notDudeTimer,
            isActive: false,
            lastStartTime: null,
          };
        } else {
          // If not-dude timer is inactive, start it and stop dude timer
          newNotDudeTimer = {
            ...notDudeTimer,
            isActive: true,
            lastStartTime: now,
          };
          if (dudeTimer.isActive) {
            newDudeTimer = {
              ...dudeTimer,
              isActive: false,
              lastStartTime: null,
            };
          }
        }
      }

      // Update state
      setDudeTimer(newDudeTimer);
      setNotDudeTimer(newNotDudeTimer);

      // Save to localStorage immediately
      const state: TimerState = {
        dude: newDudeTimer,
        notDude: newNotDudeTimer,
      };
      localStorage.setItem("timerState", JSON.stringify(state));
    },
    [dudeTimer, notDudeTimer]
  );

  const resetTimers = useCallback((dude = 0, notDude = 0) => {
    setDudeTimer({
      value: dude,
      lastStartTime: null,
      isActive: false,
    });
    setNotDudeTimer({
      value: notDude,
      lastStartTime: null,
      isActive: false,
    });
  }, []);

  return {
    dudeTime: dudeTimer.value,
    notDudeTime: notDudeTimer.value,
    currentSpeaker: dudeTimer.isActive
      ? "dude"
      : notDudeTimer.isActive
      ? "notDude"
      : null,
    toggleSpeaker,
    resetTimers,
  };
};

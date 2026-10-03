import { useEffect, useRef } from "react";
import { closeConfirmDialog, notify } from "../../components/dialogs/global_dialog/DialogService";

export const useAutoLogout = (logoutFunction: () => void, isAuthenticated: boolean) => {
  const warningTimeoutMs = 8 * 60 * 1000;
  const finalLogoutTimeoutMs = 2 * 60 * 1000;

  const warningTimerRef = useRef<number | null>(null);
  const finalTimerRef = useRef<number | null>(null);
  const isDialogOpen = useRef<boolean>(false);

  const logoutRef = useRef(logoutFunction);
  useEffect(() => {
    logoutRef.current = logoutFunction;
  }, [logoutFunction]);

  useEffect(() => {
    if (!isAuthenticated) return;

    const clearTimers = () => {
      if (warningTimerRef.current) window.clearTimeout(warningTimerRef.current);
      if (finalTimerRef.current) window.clearTimeout(finalTimerRef.current);
    };

    const resetTimers = () => {
      if (isDialogOpen.current) return;
      
      clearTimers();
      
      warningTimerRef.current = window.setTimeout(() => {
        triggerWarningDialog();
      }, warningTimeoutMs);
    };

    let debounceTimer: number | null = null;
    const handleActivity = () => {
      if (debounceTimer) window.clearTimeout(debounceTimer);
      debounceTimer = window.setTimeout(resetTimers, 500); 
    };

     const triggerWarningDialog = () => {
      isDialogOpen.current = true; 
      
      finalTimerRef.current = window.setTimeout(() => {
        closeConfirmDialog();
        logoutRef.current();
      }, finalLogoutTimeoutMs);

      notify(
        "Session Expiring Soon", 
        "Due to inactivity, your account will be logged out in 2 minutes. Do you want to stay logged in?", 
        "warning", 
        "Stay Logged In"
      ).then((confirmed) => {
        const isStillLoggedIn = localStorage.getItem("isLoggedIn") === "true";

        if (!isStillLoggedIn) {
          isDialogOpen.current = false;
          return; 
        }

        if (confirmed) {
          isDialogOpen.current = false;
          clearTimers();
          resetTimers();
        } else {
          logoutRef.current();
        }
      });
    };

    const activeEvents = ["mousemove", "keydown", "scroll", "click"];

    activeEvents.forEach((event) => {
      window.addEventListener(event, handleActivity);
    });

    resetTimers();

    return () => {
      clearTimers();
      if (debounceTimer) window.clearTimeout(debounceTimer);
      activeEvents.forEach((event) => {
        window.removeEventListener(event, handleActivity);
      });
    };
  }, [isAuthenticated]);
};
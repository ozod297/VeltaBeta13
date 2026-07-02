import { useEffect, useState, useCallback } from "react";

export function usePWAInstall() {
  const [deferredEvent, setDeferredEvent] = useState(
    () => window.__pwaPrompt || null
  );
  const [isInstalled, setIsInstalled] = useState(
    () =>
      window.matchMedia?.("(display-mode: standalone)").matches ||
      window.navigator.standalone === true
  );

  useEffect(() => {
    const handleBeforeInstall = (e) => {
      e.preventDefault();
      window.__pwaPrompt = e;
      setDeferredEvent(e);
    };
    const handleInstalled = () => {
      setIsInstalled(true);
      setDeferredEvent(null);
      window.__pwaPrompt = null;
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstall);
    window.addEventListener("appinstalled", handleInstalled);
    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstall);
      window.removeEventListener("appinstalled", handleInstalled);
    };
  }, []);

  const promptInstall = useCallback(async () => {
    if (!deferredEvent) return "unsupported";
    deferredEvent.prompt();
    const { outcome } = await deferredEvent.userChoice;
    setDeferredEvent(null);
    window.__pwaPrompt = null;
    return outcome; // "accepted" | "dismissed"
  }, [deferredEvent]);

  return { canInstall: !!deferredEvent, isInstalled, promptInstall };
}

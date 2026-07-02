import { createContext, useContext, useState, useEffect } from "react";

const AppContext = createContext();

export function AppProvider({ children }) {
  const [lang, setLang] = useState(() => localStorage.getItem("velta-lang") || "uz");
  const [dark, setDark] = useState(() => localStorage.getItem("velta-dark") === "true");

  useEffect(() => { localStorage.setItem("velta-lang", lang); }, [lang]);

  useEffect(() => {
    localStorage.setItem("velta-dark", dark);
    document.documentElement.classList.toggle("dark", dark);
  }, [dark]);

  return (
    <AppContext.Provider value={{ lang, setLang, dark, setDark }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() { return useContext(AppContext); }

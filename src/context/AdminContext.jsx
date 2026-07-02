import { createContext, useContext, useState, useEffect } from "react";
import { newsItems as defaultNews } from "../data";

const AdminContext = createContext();

const STORAGE_KEY = "velta-news-data";
const SESSION_KEY = "velta-admin-session";

function readSession() {
  try {
    const raw = sessionStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    const session = JSON.parse(raw);
    if (!session?.token || !session?.exp || session.exp < Date.now()) {
      sessionStorage.removeItem(SESSION_KEY);
      return null;
    }
    return session;
  } catch {
    return null;
  }
}

export function AdminProvider({ children }) {
  const [isLoggedIn, setIsLoggedIn] = useState(() => !!readSession());

  const [news, setNews] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : defaultNews;
    } catch {
      return defaultNews;
    }
  });

  // News o'zgarganda localStorage'ga saqlash
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(news));
  }, [news]);

  // Login/parol tekshiruvi server tomonda (api/admin-login.js) amalga oshiriladi —
  // parol client bundle ichida hech qachon saqlanmaydi.
  const login = async (username, password) => {
    try {
      const res = await fetch("/api/admin-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json().catch(() => null);

      if (!res.ok || !data?.ok || !data.token) {
        return false;
      }

      sessionStorage.setItem(
        SESSION_KEY,
        JSON.stringify({ token: data.token, exp: data.exp }),
      );
      setIsLoggedIn(true);
      return true;
    } catch (err) {
      console.error("Login so'rovida xatolik:", err);
      return false;
    }
  };

  const logout = () => {
    setIsLoggedIn(false);
    sessionStorage.removeItem(SESSION_KEY);
  };

  const createNews = (item) => {
    const newItem = {
      ...item,
      id: Date.now(),
    };
    setNews((prev) => [newItem, ...prev]);
  };

  const updateNews = (id, updated) => {
    setNews((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...updated } : item)),
    );
  };

  const deleteNews = (id) => {
    setNews((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <AdminContext.Provider
      value={{
        isLoggedIn,
        login,
        logout,
        news,
        createNews,
        updateNews,
        deleteNews,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  return useContext(AdminContext);
}

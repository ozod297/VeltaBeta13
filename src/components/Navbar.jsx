import { useState, useEffect, useCallback } from "react";
import { Link, useLocation } from "react-router-dom";
import { useApp } from "../context/AppContext";
import { translations } from "../i18n";
import { usePWAInstall } from "../hooks/usePWAInstall";
import logo from "../assets/logo.webp";

const COLOR_THEMES = [
  { id: "blue",   color: "#3b82f6", accent: "#3b82f6", hover: "#2563eb", light: "#60a5fa" },
  { id: "purple", color: "#8b5cf6", accent: "#8b5cf6", hover: "#7c3aed", light: "#a78bfa" },
  { id: "green",  color: "#10b981", accent: "#10b981", hover: "#059669", light: "#34d399" },
  { id: "rose",   color: "#f43f5e", accent: "#f43f5e", hover: "#e11d48", light: "#fb7185" },
];

export default function Navbar() {
  const { lang, setLang, dark, setDark } = useApp();
  const t = translations[lang].nav;
  const st = translations[lang].settings;

  const [menuOpen, setMenuOpen]       = useState(false);
  const [scrolled, setScrolled]       = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [installStatus, setInstallStatus] = useState("idle"); // idle | installing | accepted | dismissed
  const [colorTheme, setColorTheme]   = useState(
    () => localStorage.getItem("velta-color") || "blue"
  );
  const [isMobile, setIsMobile] = useState(() => window.innerWidth <= 480);
  const [installToast, setInstallToast] = useState(false);

  const { canInstall, isInstalled, promptInstall } = usePWAInstall();

  const location = useLocation();

  /* ── Apply color theme ── */
  useEffect(() => {
    const theme = COLOR_THEMES.find(c => c.id === colorTheme) || COLOR_THEMES[0];
    document.documentElement.style.setProperty("--accent",       theme.accent);
    document.documentElement.style.setProperty("--accent-hover", theme.hover);
    document.documentElement.style.setProperty("--accent-light", theme.light);
    localStorage.setItem("velta-color", colorTheme);
  }, [colorTheme]);


  /* ── Scroll ── */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* ── Mobile breakpoint tracker ── */
  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth <= 480);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  /* ── Close mobile menu on navigate ── */
  useEffect(() => { setMenuOpen(false); }, [location.pathname]);

  /* ── Escape key closes settings ── */
  useEffect(() => {
    if (!settingsOpen) return;
    const onKey = (e) => {
      if (e.key === "Escape") { setSettingsOpen(false); setInstallStatus("idle"); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [settingsOpen]);

  /* ── Body scroll lock ── */
  useEffect(() => {
    document.body.style.overflow = settingsOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [settingsOpen]);


  const closeSettings = () => { setSettingsOpen(false); setInstallStatus("idle"); };

  const handleDownload = useCallback(async () => {
    if (isInstalled) { setInstallStatus("accepted"); return; }
    if (!canInstall) { setInstallStatus("unsupported"); return; }
    setInstallStatus("installing");
    setSettingsOpen(false); // modal yopilsin — Chrome dialogi to'liq sahifada ko'rinsin
    const outcome = await promptInstall();
    setInstallStatus(outcome); // "accepted" | "dismissed"
    if (outcome === "accepted") {
      setInstallToast(true);
      setTimeout(() => setInstallToast(false), 3500);
    }
  }, [canInstall, isInstalled, promptInstall]);

  const links = [
    { to: "/company",  label: t.company  },
    { to: "/drugs",    label: t.drugs    },
    { to: "/partners", label: t.partners },
    { to: "/news",     label: t.news     },
    { to: "/contact",  label: t.contact  },
  ];

  const isActive = (path) => location.pathname === path;

  /* ── shared icon-button style ── */
  const iconBtn = {
    width: 36, height: 36, borderRadius: 9,
    border: "1.5px solid var(--border)", background: "var(--bg2)",
    cursor: "pointer", display: "flex", alignItems: "center",
    justifyContent: "center", color: "var(--text2)",
    transition: "all 0.2s", flexShrink: 0,
  };

  return (
    <>
      {/* ════════════════════════════ NAVBAR ════════════════════════════ */}
      <nav
        className={`navbar ${scrolled ? "navbar-scrolled" : ""}`}
        style={{
          position: "sticky", top: 0, left: 0, width: "100%", maxWidth: "100%",
          zIndex: 1000,
          background: scrolled ? "var(--bg-navbar-scrolled, var(--card))" : "var(--card)",
          boxShadow: scrolled ? "0 4px 20px rgba(0,0,0,0.05)" : "none",
          borderBottom: "1px solid var(--border)",
          transition: "all 0.3s ease", boxSizing: "border-box",
        }}
      >
        <div className="container" style={{ width: "100%", paddingLeft: 16, paddingRight: 16, boxSizing: "border-box" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", height: 66, width: "100%" }}>

            {/* ── LOGO ── */}
            <Link to="/" style={{ display: "flex", alignItems: "center", textDecoration: "none", flexShrink: 0 }}>
              <img src={logo} alt="Velta Pharmaceutical"
                style={{ height: 50, width: "auto", objectFit: "contain", display: "block" }} />
            </Link>

            {/* ── DESKTOP LINKS ── */}
            <div className="desktop-links" style={{ display: "flex", alignItems: "center", gap: 30 }}>
              {links.map(l => (
                <Link key={l.to} to={l.to}
                  className={`nav-link ${isActive(l.to) ? "active" : ""}`}
                  style={{
                    textDecoration: "none", fontSize: "0.92rem",
                    fontWeight: isActive(l.to) ? 600 : 500,
                    color: isActive(l.to) ? "var(--accent, #3b82f6)" : "var(--text1)",
                    transition: "color 0.2s",
                  }}
                >
                  {l.label}
                </Link>
              ))}
            </div>

            {/* ── RIGHT CONTROLS ── */}
            <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>

              {/* Til almashtirish */}
              <div style={{ display: "flex", background: "var(--bg2)", borderRadius: 999, padding: "3px 4px", border: "1px solid var(--border)", flexShrink: 0 }}>
                {["uz", "ru"].map(l => (
                  <button key={l} onClick={() => setLang(l)}
                    style={{
                      padding: "4px 11px", borderRadius: 999, border: "none", cursor: "pointer",
                      fontSize: "0.72rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em",
                      background: lang === l ? "var(--navy, #1e3a8a)" : "transparent",
                      color: lang === l ? "white" : "var(--text3)",
                      transition: "all 0.2s",
                    }}
                  >
                    {l}
                  </button>
                ))}
              </div>

              {/* Dark Mode */}
              <button onClick={() => setDark(!dark)} aria-label="Toggle theme" style={iconBtn}>
                {dark ? (
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="5"/>
                    <line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/>
                    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
                    <line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/>
                    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
                  </svg>
                ) : (
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
                  </svg>
                )}
              </button>

              {/* Admin Panel */}
              <Link to="/admin" title="Admin Panel"
                style={{ ...iconBtn, textDecoration: "none" }}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                </svg>
              </Link>

              {/* ─── Sozlamalar (Settings) tugmasi ─── */}
              <button
                onClick={() => setSettingsOpen(true)}
                aria-label="Sozlamalar"
                title={st.title}
                style={iconBtn}
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="3"/>
                  <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>
                </svg>
              </button>

              {/* A'loqa (Desktop) */}
              <Link to="/contact" className="btn btn-primary desktop-cta"
                style={{ display: "flex", alignItems: "center", gap: 6, textDecoration: "none" }}>
                {t.buy}
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </Link>

              {/* Burger (Mobil) */}
              <button
                className="burger-menu"
                onClick={() => setMenuOpen(!menuOpen)}
                aria-label="Menu"
                aria-expanded={menuOpen}
                style={{
                  width: 38, height: 38, borderRadius: 9,
                  border: "1.5px solid var(--border)", background: "var(--bg2)",
                  cursor: "pointer", display: "none", alignItems: "center",
                  justifyContent: "center", flexDirection: "column", gap: 5, padding: "9px",
                  flexShrink: 0,
                }}
              >
                <span style={{ width: "100%", height: "2px", background: "var(--text1)", borderRadius: "2px", transition: "all 0.3s", transform: menuOpen ? "rotate(45deg) translate(5px, 5px)" : "none" }}/>
                <span style={{ width: "100%", height: "2px", background: "var(--text1)", borderRadius: "2px", transition: "all 0.3s", opacity: menuOpen ? 0 : 1 }}/>
                <span style={{ width: "100%", height: "2px", background: "var(--text1)", borderRadius: "2px", transition: "all 0.3s", transform: menuOpen ? "rotate(-45deg) translate(5px, -5px)" : "none" }}/>
              </button>
            </div>
          </div>

          {/* ── MOBILE MENU ── */}
          {menuOpen && (
            <div className="mobile-menu" style={{ borderTop: "1px solid var(--border)", paddingBottom: 16, animation: "fadeUp 0.25s ease-out", width: "100%", boxSizing: "border-box" }}>
              {links.map(l => (
                <Link key={l.to} to={l.to}
                  style={{
                    display: "flex", alignItems: "center", gap: 10,
                    padding: "13px 4px", textDecoration: "none",
                    color: isActive(l.to) ? "var(--accent, #3b82f6)" : "var(--text1)",
                    fontWeight: isActive(l.to) ? 600 : 500, fontSize: "0.975rem",
                    borderBottom: "1px solid var(--border)", boxSizing: "border-box",
                  }}
                >
                  {isActive(l.to) && (
                    <span style={{ width: 3, height: 18, borderRadius: 2, background: "var(--accent, #3b82f6)", display: "block" }}/>
                  )}
                  {l.label}
                </Link>
              ))}
              <div style={{ paddingTop: 16, width: "100%", boxSizing: "border-box" }}>
                <Link to="/contact" className="btn btn-accent"
                  style={{ textDecoration: "none", display: "flex", justifyContent: "center", alignItems: "center", gap: 6, width: "100%", padding: "12px", boxSizing: "border-box" }}>
                  {t.buy}
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M5 12h14M12 5l7 7-7 7"/>
                  </svg>
                </Link>
              </div>
            </div>
          )}
        </div>

        <style>{`
          @keyframes fadeUp {
            from { opacity: 0; transform: translateY(-10px); }
            to { opacity: 1; transform: translateY(0); }
          }
          @media (max-width: 868px) {
            .desktop-links, .desktop-cta { display: none !important; }
            .burger-menu { display: flex !important; }
          }
          .nav-link:hover { color: var(--accent, #3b82f6) !important; }
          @media (max-width: 400px) {
            .nb-right-controls { gap: 5px !important; }
            .nb-right-controls > * { width: 32px !important; height: 32px !important; }
          }
        `}</style>
      </nav>

      {/* ════════════════════════ SETTINGS MODAL ════════════════════════ */}
      {settingsOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={st.title}
          onClick={closeSettings}
          style={{
            position: "fixed", inset: 0, zIndex: 9999,
            background: "rgba(15,23,42,0.55)",
            backdropFilter: "blur(4px)",
            display: "flex",
            alignItems: isMobile ? "flex-end" : "center",
            justifyContent: "center",
            padding: isMobile ? 0 : "16px",
            animation: "settingsOverlayIn 0.22s ease",
          }}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{
              background: "var(--card)",
              borderRadius: isMobile ? "22px 22px 0 0" : 22,
              boxShadow: "0 28px 72px rgba(0,0,0,0.22), 0 4px 16px rgba(0,0,0,0.1)",
              width: "100%",
              maxWidth: isMobile ? "100%" : 440,
              maxHeight: isMobile ? "88vh" : "90vh",
              overflowY: "auto",
              animation: isMobile
                ? "settingsSlideUp 0.3s cubic-bezier(0.22,1,0.36,1)"
                : "settingsModalIn 0.28s cubic-bezier(0.22,1,0.36,1)",
            }}
          >
            {/* ── Modal Header ── */}
            <div style={{
              display: "flex", alignItems: "center", justifyContent: "space-between",
              padding: "22px 24px 18px",
              borderBottom: "1px solid var(--border)",
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{
                  width: 40, height: 40, borderRadius: 12,
                  background: "var(--navy, #1e3a5f)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  flexShrink: 0,
                }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                    <circle cx="12" cy="12" r="3"/>
                    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>
                  </svg>
                </div>
                <div>
                  <h2 style={{ margin: 0, fontSize: "1.05rem", fontWeight: 700, color: "var(--text1)" }}>
                    {st.title}
                  </h2>
                  <p style={{ margin: 0, fontSize: "0.75rem", color: "var(--text3)", marginTop: 1 }}>Velta</p>
                </div>
              </div>
              <button
                onClick={closeSettings}
                aria-label={st.close}
                style={{
                  width: 34, height: 34, borderRadius: 8,
                  border: "1.5px solid var(--border)", background: "var(--bg2)",
                  cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
                  color: "var(--text3)", transition: "all 0.2s", flexShrink: 0,
                }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            </div>

            {/* ── Modal Body ── */}
            <div style={{ padding: "20px 24px" }}>

              {/* ─── MAVZU BO'LIMI ─── */}
              <div style={{ marginBottom: 24 }}>
                <p style={{ margin: "0 0 12px", fontSize: "0.72rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--text3)" }}>
                  {st.themeSection}
                </p>

                {/* Yorug' / Qorong'u toggle */}
                <div style={{ display: "flex", background: "var(--bg2)", borderRadius: 12, padding: 4, gap: 4 }}>
                  {[
                    {
                      val: false,
                      label: st.themeLight,
                      icon: (
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <circle cx="12" cy="12" r="5"/>
                          <line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/>
                          <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
                          <line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/>
                          <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
                        </svg>
                      ),
                    },
                    {
                      val: true,
                      label: st.themeDark,
                      icon: (
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
                        </svg>
                      ),
                    },
                  ].map(item => (
                    <button
                      key={String(item.val)}
                      onClick={() => setDark(item.val)}
                      style={{
                        flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 7,
                        padding: "9px 12px", borderRadius: 9, border: "none", cursor: "pointer",
                        fontSize: "0.83rem", fontWeight: 600,
                        background: dark === item.val ? "var(--card)" : "transparent",
                        color: dark === item.val ? "var(--text1)" : "var(--text3)",
                        boxShadow: dark === item.val ? "0 1px 6px rgba(0,0,0,0.08)" : "none",
                        transition: "all 0.2s",
                      }}
                    >
                      {item.icon}
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* ─── RANG MAVZUSI ─── */}
              <div style={{ marginBottom: 24 }}>
                <p style={{ margin: "0 0 12px", fontSize: "0.72rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--text3)" }}>
                  {st.colorSection}
                </p>
                <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                  {COLOR_THEMES.map(ct => (
                    <button
                      key={ct.id}
                      onClick={() => setColorTheme(ct.id)}
                      title={st.colors[ct.id]}
                      style={{
                        width: 40, height: 40, borderRadius: "50%",
                        background: ct.color, border: "none",
                        cursor: "pointer", position: "relative",
                        outline: colorTheme === ct.id ? `3px solid ${ct.color}` : "3px solid transparent",
                        outlineOffset: 3,
                        transition: "all 0.2s",
                        transform: colorTheme === ct.id ? "scale(1.15)" : "scale(1)",
                      }}
                    >
                      {colorTheme === ct.id && (
                        <svg
                          style={{ position: "absolute", inset: 0, margin: "auto" }}
                          width="14" height="14" viewBox="0 0 24 24"
                          fill="none" stroke="white" strokeWidth="3"
                        >
                          <polyline points="20 6 9 17 4 12"/>
                        </svg>
                      )}
                    </button>
                  ))}
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <span style={{ fontSize: "0.8rem", color: "var(--text2)", fontWeight: 500 }}>
                      {st.colors[colorTheme]}
                    </span>
                  </div>
                </div>
              </div>

              {/* ─── DIVIDER ─── */}
              <div style={{ height: 1, background: "var(--border)", margin: "4px 0 20px" }}/>

              {/* ─── YUKLAB OLISH BO'LIMI ─── */}
              <div>
                <p style={{ margin: "0 0 6px", fontSize: "0.72rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--text3)" }}>
                  {st.downloadSection}
                </p>
                <p style={{ margin: "0 0 14px", fontSize: "0.82rem", color: "var(--text2)" }}>
                  {st.downloadDesc}
                </p>

                {/* O'rnatilgan holat */}
                {isInstalled ? (
                  <div style={{
                    display: "flex", alignItems: "center", gap: 12,
                    padding: "14px 16px", borderRadius: 12,
                    background: "rgba(16,185,129,0.08)", border: "1.5px solid rgba(16,185,129,0.25)",
                  }}>
                    <div style={{ width: 34, height: 34, borderRadius: "50%", background: "#10b981", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
                        <polyline points="20 6 9 17 4 12"/>
                      </svg>
                    </div>
                    <span style={{ fontSize: "0.85rem", fontWeight: 600, color: "#059669" }}>
                      {lang === "uz" ? "Ilova allaqachon o'rnatilgan" : "Приложение уже установлено"}
                    </span>
                  </div>
                ) : installStatus === "installing" ? (
                  <div style={{
                    display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
                    padding: "18px", borderRadius: 12,
                    background: "var(--bg2)", border: "1.5px solid var(--border)",
                  }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#1E3A5F" strokeWidth="2.5"
                      style={{ animation: "spin 0.9s linear infinite", flexShrink: 0 }}>
                      <circle cx="12" cy="12" r="10" strokeOpacity="0.25"/>
                      <path d="M12 2a10 10 0 0 1 10 10" strokeLinecap="round"/>
                    </svg>
                    <span style={{ fontSize: "0.88rem", fontWeight: 600, color: "var(--text1)" }}>
                      {lang === "uz" ? "Brauzer dialogi ochilmoqda..." : "Открытие диалога..."}
                    </span>
                  </div>
                ) : (
                  <>
                    <button
                      onClick={handleDownload}
                      style={{
                        width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                        padding: "13px 20px", borderRadius: 12, border: "none",
                        cursor: "pointer",
                        background: "#1E3A5F", color: "#fff",
                        fontSize: "0.9rem", fontWeight: 700,
                        boxShadow: "0 4px 16px rgba(30,58,95,0.35)",
                        transition: "all 0.2s",
                      }}
                      onMouseEnter={e => { e.currentTarget.style.background = "#2d5282"; e.currentTarget.style.transform = "translateY(-1px)"; }}
                      onMouseLeave={e => { e.currentTarget.style.background = "#1E3A5F"; e.currentTarget.style.transform = "translateY(0)"; }}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                        <polyline points="7 10 12 15 17 10"/>
                        <line x1="12" y1="15" x2="12" y2="3"/>
                      </svg>
                      {st.downloadBtn}
                    </button>

                    {/* Brauzer avtomatik o'rnatishni taklif qilmagan holat */}
                    {installStatus === "unsupported" && (
                      <div style={{
                        marginTop: 12, padding: "12px 14px", borderRadius: 12,
                        background: "var(--bg2)", border: "1.5px solid var(--border)",
                      }}>
                        <p style={{ margin: "0 0 4px", fontSize: "0.82rem", fontWeight: 600, color: "var(--text1)" }}>
                          {st.downloadUnavailable}
                        </p>
                        <p style={{ margin: 0, fontSize: "0.78rem", color: "var(--text3)", whiteSpace: "pre-line", lineHeight: 1.5 }}>
                          {st.downloadUnavailableSteps}
                        </p>
                      </div>
                    )}

                    {/* Foydalanuvchi brauzer dialogini bekor qilgan holat */}
                    {installStatus === "dismissed" && (
                      <p style={{ marginTop: 10, fontSize: "0.8rem", color: "var(--text3)", textAlign: "center" }}>
                        {st.downloadDismissed}
                      </p>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

{/* ── Install success toast ── */}
      {installToast && (
        <div style={{
          position: "fixed", bottom: 28, left: "50%", transform: "translateX(-50%)",
          zIndex: 99999, background: "#10b981", color: "#fff",
          padding: "13px 24px", borderRadius: 14,
          display: "flex", alignItems: "center", gap: 10,
          boxShadow: "0 8px 32px rgba(16,185,129,0.35)",
          animation: "toastIn 0.35s cubic-bezier(0.22,1,0.36,1)",
          whiteSpace: "nowrap",
        }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
          <span style={{ fontWeight: 700, fontSize: "0.9rem" }}>
            {lang === "uz" ? "Velta ish stolingizga o'rnatildi!" : "Velta установлена на рабочий стол!"}
          </span>
        </div>
      )}

      {/* ── Settings animations ── */}
      <style>{`
        @keyframes settingsOverlayIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes settingsModalIn {
          from { opacity: 0; transform: scale(0.91) translateY(18px); }
          to   { opacity: 1; transform: scale(1) translateY(0); }
        }
        @keyframes settingsSlideUp {
          from { opacity: 0; transform: translateY(100%); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes settingsFadeIn {
          from { opacity: 0; transform: translateY(6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        @keyframes toastIn {
          from { opacity: 0; transform: translateX(-50%) translateY(16px) scale(0.95); }
          to   { opacity: 1; transform: translateX(-50%) translateY(0) scale(1); }
        }
        @keyframes toastIn {
          from { opacity: 0; transform: translateX(-50%) translateY(16px) scale(0.95); }
          to   { opacity: 1; transform: translateX(-50%) translateY(0) scale(1); }
        }
      `}</style>
    </>
  );
}

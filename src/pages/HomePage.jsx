import { lazy, Suspense } from "react";
import { Link } from "react-router-dom";
import { useApp } from "../context/AppContext";
import { translations } from "../i18n";
import { drugs, testimonials, certifications } from "../data";
import DrugCard from "../components/DrugCard";
import SEO from "../components/SEO";
import { useScrollReveal, useStaggerReveal } from "../hooks/useScrollReveal";

// Form leaflet/react-leaflet kutubxonasini olib keladi (og'ir) — asosiy
// bundle'ni shishirmaslik uchun alohida chunk sifatida lazy yuklanadi.
const Form = lazy(() => import("../components/Form"));

function StatCard({ val, label, delay }) {
  return (
    <div
      className={`stat-pop v-delay-${delay}`}
      style={{ textAlign: "center", padding: "10px" }}
    >
      <div className="stat-val" style={{ fontSize: "clamp(1.8rem, 4vw, 2.4rem)", fontWeight: 800, color: "var(--accent)" }}>{val}</div>
      <div style={{ fontSize: "0.74rem", color: "var(--text3)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", marginTop: 6, lineHeight: 1.3 }}>{label}</div>
    </div>
  );
}

function FeatureCard({ icon, title, desc }) {
  return (
    <div
      className="card-lift"
      style={{ background: "var(--card)", borderRadius: 14, padding: "22px 20px", border: "1px solid var(--border)", transition: "all 0.2s" }}
    >
      <div style={{ width: 44, height: 44, borderRadius: 12, background: "rgba(59,130,246,0.08)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 14 }}>
        {icon}
      </div>
      <h3 style={{ fontSize: "0.95rem", fontWeight: 700, color: "var(--text1)", marginBottom: 6 }}>{title}</h3>
      <p style={{ fontSize: "0.82rem", color: "var(--text2)", lineHeight: 1.6, margin: 0 }}>{desc}</p>
    </div>
  );
}

export default function HomePage() {
  const { lang } = useApp();
  const t = translations[lang];

  // Scroll reveal refs
  const statsRef     = useScrollReveal("v-hidden-scale", "v-visible-scale");
  const aboutLeftRef = useScrollReveal("v-hidden-left",  "v-visible-left");
  const aboutRightRef= useScrollReveal("v-hidden-right", "v-visible-right");
  const productsRef  = useScrollReveal();
  const drugsGridRef = useStaggerReveal("[data-stagger]");
  const certsRef     = useScrollReveal();
  const certsGridRef = useStaggerReveal("[data-stagger]");
  const testiRef     = useScrollReveal();
  const testiGridRef = useStaggerReveal("[data-stagger]");

  return (
    <>
      <SEO
        title={lang === "uz" ? "Salomatlik sari ishonchli yo'l" : "Надёжный путь к здоровью"}
        description={lang === "uz" ? "Velta — GMP va ISO sertifikatlangan O'zbekistonning yetakchi farmatsevtika kompaniyasi. 150+ sifatli dori-darmonlar." : "Velta — ведущая фармацевтическая компания Узбекистана с сертификатами GMP и ISO. 150+ качественных препаратов."}
        keywords="velta pharmaceutical, dori uzbekistan, GMP sertifikat, farmatsevtika, paracetamol, ibuprofen, antibiotik"
        url="/"
      />

      {/* ═══ HERO SECTION ═══ */}
      <section className="hero-bg page-enter" style={{ padding: "clamp(50px, 8vw, 90px) 0 clamp(40px, 6vw, 70px)", background: "linear-gradient(135deg, #111827 0%, #1e3a5f 100%)", color: "white" }}>
        <div className="container">
          <div className="hero-two-col" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 48, alignItems: "center" }}>
            <div>
              <span className="pill pill-green hero-badge-anim" style={{ marginBottom: 20, display: "inline-flex", alignItems: "center", gap: 6, background: "rgba(16,185,129,0.15)", color: "#34d399", padding: "4px 12px", borderRadius: 999, fontSize: "0.75rem", fontWeight: 700 }}>
                <svg width="7" height="7" viewBox="0 0 8 8" fill="currentColor"><circle cx="4" cy="4" r="4"/></svg>
                {t.hero.badge}
              </span>
              <h1 className="font-display hero-title-anim" style={{ fontSize: "clamp(1.8rem, 4.5vw, 3.2rem)", fontWeight: 600, color: "white", lineHeight: 1.15, marginBottom: 20, marginTop: 0 }}>
                {t.hero.title}
              </h1>
              <p className="hero-sub-anim" style={{ color: "rgba(255,255,255,0.7)", fontSize: "0.98rem", lineHeight: 1.7, marginBottom: 36, maxWidth: 480 }}>
                {t.hero.subtitle}
              </p>
              <div className="hero-btns-anim" style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                <Link to="/drugs" className="btn btn-white" style={{ textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 8, background: "white", color: "#111827", padding: "12px 24px", borderRadius: 999, fontWeight: 600, fontSize: "0.88rem" }}>
                  {t.hero.catalog}
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                </Link>
                <Link to="/company" style={{ textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 7, padding: "12px 24px", borderRadius: 999, border: "1.5px solid rgba(255,255,255,0.25)", color: "rgba(255,255,255,0.9)", fontSize: "0.88rem", fontWeight: 600, transition: "all 0.2s" }}>
                  {t.hero.about}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ STATS SECTION ═══ */}
      <section ref={statsRef} style={{ background: "var(--bg2)", borderBottom: "1px solid var(--border)", padding: "28px 0" }}>
        <div className="container">
          <div className="stat-grid" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 20 }}>
            <StatCard val={t.hero.stats.drugsVal}    label={t.hero.stats.drugs}    delay={1}/>
            <StatCard val={t.hero.stats.patientsVal} label={t.hero.stats.patients} delay={2}/>
            <StatCard val={t.hero.stats.productsVal} label={t.hero.stats.products} delay={3}/>
            <StatCard val={t.hero.stats.yearsVal}    label={t.hero.stats.years}    delay={4}/>
          </div>
        </div>
      </section>

      {/* ═══ ABOUT SECTION ═══ */}
      <section style={{ background: "var(--bg)", padding: "64px 0" }}>
        <div className="container">
          <div className="about-two-col" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 54, alignItems: "center" }}>
            
            {/* Left Card */}
            <div ref={aboutLeftRef} style={{ background: "linear-gradient(135deg, #1e3a5f 0%, #111827 100%)", borderRadius: 24, padding: "40px 36px", color: "white", position: "relative", overflow: "hidden", border: "1px solid var(--border)" }}>
              <div style={{ position: "absolute", top: -40, right: -40, width: 180, height: 180, borderRadius: "50%", background: "rgba(244,196,48,0.06)" }}/>
              <span className="pill" style={{ background: "rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.9)", marginBottom: 16, display: "inline-flex", fontSize: "0.75rem", padding: "4px 12px", borderRadius: 999 }}>{t.about.badge}</span>
              <div style={{ fontSize: "clamp(4rem, 6vw, 5.5rem)", fontFamily: "'Playfair Display', serif", color: "rgba(255,255,255,0.15)", lineHeight: 1, fontWeight: 700 }}>{t.about.year}</div>
              <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.84rem", marginBottom: 28, marginTop: 4, fontWeight: 500 }}>{t.about.yearLabel}</p>
              
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {[
                  { icon: "🏭", label: lang === "uz" ? "Temur med maxsus ishlab chiqarish" : "Самаркандское производство" },
                  { icon: "🏢", label: lang === "uz" ? "Toshkent bosh ofisi" : "Ташкентский головной офис" },
                  { icon: "🚚", label: lang === "uz" ? "60+ Tezkor tarqatish nuqtasi" : "60+ точек дистрибуции" },
                ].map((item, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, background: "rgba(255,255,255,0.05)", borderRadius: 12, padding: "12px 16px", transition: "background 0.2s" }}
                    onMouseOver={e => e.currentTarget.style.background = "rgba(255,255,255,0.09)"}
                    onMouseOut={e => e.currentTarget.style.background = "rgba(255,255,255,0.05)"}
                  >
                    <span style={{ fontSize: "1.1rem" }}>{item.icon}</span>
                    <span style={{ fontSize: "0.86rem", color: "rgba(255,255,255,0.85)", fontWeight: 500 }}>{item.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Info */}
            <div ref={aboutRightRef}>
              <span className="pill" style={{ marginBottom: 12, display: "inline-flex" }}>{t.about.badge}</span>
              <h2 className="font-display" style={{ fontSize: "clamp(1.6rem, 3vw, 2.2rem)", color: "var(--text1)", marginBottom: 18, marginTop: 0, lineHeight: 1.25 }}>{t.about.title}</h2>
              <p style={{ color: "var(--text2)", lineHeight: 1.75, marginBottom: 32, fontSize: "0.96rem" }}>{t.about.desc}</p>
              
              <div className="features-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                {t.about.features.map((f, i) => (
                  <FeatureCard key={i} title={f.title} desc={f.desc} icon={
                    [
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="1.8"><rect x="2" y="3" width="20" height="18" rx="2"/><path d="M8 10h8M8 14h5"/></svg>,
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="1.8"><circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15 15 0 0 1 0 20M12 2a15 15 0 0 0 0 20"/></svg>,
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="1.8"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>,
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="1.8"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>,
                    ][i]
                  }/>
                ))}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ═══ PRODUCTS SECTION ═══ */}
      <section style={{ background: "var(--bg2)", padding: "64px 0" }}>
        <div className="container">
          <div ref={productsRef} style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: 36, flexWrap: "wrap", gap: 16 }}>
            <div>
              <span className="pill" style={{ marginBottom: 10, display: "inline-flex" }}>{t.products.badge}</span>
              <h2 className="font-display" style={{ fontSize: "clamp(1.6rem, 3vw, 2.2rem)", color: "var(--text1)", margin: 0 }}>{t.products.title}</h2>
            </div>
            <Link to="/drugs" className="btn btn-ghost" style={{ textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 6 }}>
              {t.products.viewAll}
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </Link>
          </div>
          <div ref={drugsGridRef} style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 20 }}>
            {drugs.slice(0, 8).map(d => (
              <div key={d.id} data-stagger>
                <DrugCard drug={d}/>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ CERTIFICATIONS SECTION ═══ */}
      <section style={{ background: "linear-gradient(135deg, #1e3a5f 0%, #111827 100%)", padding: "80px 0" }}>
        <div className="container">
          <div ref={certsRef} style={{ textAlign: "center", marginBottom: 48 }}>
            <span className="pill" style={{ background: "rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.9)", marginBottom: 14, display: "inline-flex", fontSize: "0.75rem", padding: "4px 12px", borderRadius: 999 }}>{t.certs.badge}</span>
            <h2 className="font-display" style={{ fontSize: "clamp(1.5rem, 3vw, 2.2rem)", color: "white", marginBottom: 12, marginTop: 0 }}>{t.certs.title}</h2>
            <p style={{ color: "rgba(255,255,255,0.5)", maxWidth: 480, margin: "0 auto", fontSize: "0.92rem", lineHeight: 1.6 }}>{t.certs.subtitle}</p>
          </div>
          <div ref={certsGridRef} style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 16 }}>
            {certifications.map(c => (
              <div key={c.id} data-stagger className="cert-card cert-card-anim" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", padding: 24, borderRadius: 16 }}>
                <div style={{ fontSize: "1.6rem", fontFamily: "'Playfair Display', serif", color: "#93c5fd", marginBottom: 10, fontWeight: 600 }}>{c.name}</div>
                <div style={{ fontSize: "0.92rem", fontWeight: 600, color: "white", marginBottom: 6 }}>{lang === "uz" ? c.fullUz : c.fullRu}</div>
                <div style={{ fontSize: "0.78rem", color: "rgba(255,255,255,0.4)" }}>{lang === "uz" ? c.yearUz : c.yearRu}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ TESTIMONIALS SECTION ═══ */}
      <section style={{ background: "var(--bg)", padding: "64px 0" }}>
        <div className="container">
          <div ref={testiRef} style={{ textAlign: "center", marginBottom: 44 }}>
            <span className="pill" style={{ marginBottom: 12, display: "inline-flex" }}>{lang === "uz" ? "Mijozlar" : "Клиенты"}</span>
            <h2 className="font-display" style={{ fontSize: "clamp(1.5rem, 3vw, 2.2rem)", color: "var(--text1)", marginTop: 0 }}>{t.testimonials.title}</h2>
          </div>
          <div ref={testiGridRef} style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(290px, 1fr))", gap: 20 }}>
            {testimonials.map(item => (
              <div key={item.id} data-stagger className="card card-lift" style={{ padding: 28, background: "var(--card)", border: "1px solid var(--border)", borderRadius: 16 }}>
                <div style={{ display: "flex", gap: 4, marginBottom: 14 }}>
                  {[1,2,3,4,5].map(s => <svg key={s} width="13" height="13" viewBox="0 0 24 24" fill="#f59e0b"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>)}
                </div>
                <p style={{ color: "var(--text2)", fontSize: "0.9rem", lineHeight: 1.65, marginBottom: 22, fontStyle: "italic", marginTop: 0 }}>"{lang === "uz" ? item.textUz : item.textRu}"</p>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{ width: 42, height: 42, borderRadius: "50%", background: item.bg, display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontSize: "0.75rem", fontWeight: 700, flexShrink: 0 }}>{item.avatar}</div>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: "0.875rem", color: "var(--text1)" }}>{lang === "uz" ? item.nameUz : item.nameRu}</div>
                    <div style={{ fontSize: "0.75rem", color: "var(--text3)", marginTop: 2 }}>{lang === "uz" ? item.roleUz : item.roleRu}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ CONTACT FORM ═══ */}
      <Suspense fallback={<div style={{ minHeight: 400 }} />}>
        <Form />
      </Suspense>

      <style>{`
        @media(max-width: 992px) {
          .hero-two-col, .about-two-col {
            grid-template-columns: 1fr !important;
            gap: 36px !important;
          }
          .desktop-only { display: none !important; }
        }
        @media(max-width: 768px) {
          .stat-grid { grid-template-columns: repeat(2, 1fr) !important; gap: 16px !important; }
        }
        @media(max-width: 520px) {
          .features-grid { grid-template-columns: 1fr !important; gap: 12px !important; }
          .stat-grid { grid-template-columns: 1fr !important; gap: 12px !important; }
        }
      `}</style>
    </>
  );
}

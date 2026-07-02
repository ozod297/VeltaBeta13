import { useEffect, useRef } from "react";
import { useApp } from "../context/AppContext";
import { translations } from "../i18n";
import { certifications } from "../data";
import SEO from "../components/SEO";
import { useScrollReveal, useStaggerReveal } from "../hooks/useScrollReveal";

const timeline = [
  { year: "2021", uz: "May oyida litsenziya olingan. Iyul oyida Tooshkent shahar Farg'ona vodisi faqat shu joylar ish boshlagan. Iyul oyida 1ta dori bilan boshlaganmiz. Karnitsit priporat bilan boshlangan.", ru: "В июле работа началась в городе Ташкенте и Ферганской долине" },
  { year: "2022", uz: "Velata jamosi 52 nafar odamda iborat bo'lgan. Prayslar kengayiyb 4 ta dori bilan ishlagnmiz iborat bo'lgan.", ru: "Команда Velta состояла из 52 человек, а прайс-листы расширились, и мы начали работу с 4 видами препаратов" },
  { year: "2023", uz: "bu yilga kelib 8 ta dorilar bilan ishlab chiqarganmiz. Respublikada 70 dan ortiq ishchimiz bo'lgan.", ru: "К этому году мы произвели 8 видов препаратов, а число наших сотрудников по республике превысило 70 человек" },
  { year: "2025", uz: "Mavgurutdan ajralib, Velta alohida o'tgan.", ru: "Отделившись от Mavgurut, Velta перешла в статус отдельной компании" },
  { year: "2026", uz: "Shu yillar davomida velta konpaniyasi vrachlarni Turkiya, Guruziya, Misr, Tayland va O'zbekistonning tog'lik dam olish maskanlariga yubordi. Yaxshi ishlagan hodimlar ham bundan mustasno emas. Har yili yangiyil arafasi korparativida va yozda tog'da hodimlar mukofotlanadi va dam olinadi.", ru: "За эти годы Velta отправила врачей и лучших сотрудников на отдых в Турцию, Грузию, Египет, Таиланд и в горы. Ежегодно на Новый год и летом в горах сотрудники награждаются и отдыхают." },
];

const team = [
  { a: "UA", bg: "#3b82f6", uz: "Umarova Olesya", ru: "Умарова Олеся", rUz: "Bosh direktor", rRu: "Генеральный директор" },
  { a: "YS", bg: "#10b981", uz: "Yuldasheva Soliya", ru: "Юлдашева Солия", rUz: "Menejer", rRu: "Менеджер" },
  { a: "SM", bg: "#f59e0b", uz: "Safoyeva Mavzuna", ru: "Сафоева Мавзуна", rUz: "Menejer", rRu: "Менеджер" },
  { a: "RS", bg: "#8b5cf6", uz: "Raximova Sevara", ru: "Рахимова Севара", rUz: "Menejer", rRu: "Менеджер" },
  { a: "SZ", bg: "#06b6d4", uz: "Salaydinova Ziyoda", ru: "Ганиева Олия", rUz: "Menejer", rRu: "Менеджер" },
  { a: "ZH", bg: "#ef4444", uz: "Zulfiya Xasanova", ru: "Зульфия Хасанова", rUz: "Menejer", rRu: "Менеджер" },
];

// Timeline elementlarini bitta-bitta animatsiya qilish
function AnimatedTimeline({ items, lang }) {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const rows = container.querySelectorAll(".tl-row");
    rows.forEach(el => {
      el.style.opacity = "0";
      el.style.transform = "translateX(-20px)";
      el.style.transition = "opacity 0.5s cubic-bezier(0.22,1,0.36,1), transform 0.5s cubic-bezier(0.22,1,0.36,1)";
    });

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        rows.forEach((el, i) => {
          setTimeout(() => {
            el.style.opacity = "1";
            el.style.transform = "translateX(0)";
          }, i * 100);
        });
        observer.unobserve(container);
      }
    }, { threshold: 0.08 });

    observer.observe(container);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={containerRef} style={{ position: "relative" }} className="timeline-container">
      <div style={{ position: "absolute", left: 85, top: 0, bottom: 0, width: 2, background: "var(--border)" }} className="timeline-line"/>
      {items.map((item, i) => (
        <div key={i} className="tl-row timeline-item" style={{ display: "flex", gap: 28, paddingBottom: 30, position: "relative" }}>
          <div className="timeline-year" style={{ width: 86, textAlign: "right", paddingTop: 2, flexShrink: 0 }}>
            <span style={{ fontSize: "0.9rem", fontWeight: 700, color: "var(--accent)" }}>{item.year}</span>
          </div>
          <div style={{ position: "relative", zIndex: 1 }} className="timeline-dot-wrapper">
            <div style={{ width: 13, height: 13, borderRadius: "50%", background: "var(--accent)", border: "3px solid var(--bg2)", marginTop: 3, marginLeft: -6.5 }}/>
          </div>
          <div style={{ flex: 1, paddingTop: 1 }}>
            <p style={{ fontSize: "0.9rem", color: "var(--text2)", lineHeight: 1.55, margin: 0 }}>{lang === "uz" ? item.uz : item.ru}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

export default function CompanyPage() {
  const { lang } = useApp();
  const t = translations[lang].companyPage;
  const tc = translations[lang].certs;

  const heroRef    = useScrollReveal();
  const mvRef      = useScrollReveal("v-hidden-scale", "v-visible-scale");
  const teamRef    = useStaggerReveal("[data-stagger]");
  const certsRef   = useScrollReveal();
  const certsGrid  = useStaggerReveal("[data-stagger]");

  return (
    <>
      <SEO
        title={lang === "uz" ? "Kompaniya haqida" : "О компании"}
        description={lang === "uz" ? "Velta Pharmaceutical — 2020-yildan O'zbekistonda sifatli dori ishlab chiqaruvchi kompaniya." : "Velta Pharmaceutical — производитель качественных лекарств в Узбекистане с 2020 года."}
        url="/company"
      />

      {/* Hero */}
      <section className="page-enter" style={{ background: "linear-gradient(135deg, #1e3a5f 0%, #2d5282 100%)", padding: "80px 0 64px", overflow: "hidden", position: "relative" }}>
        <div style={{ position: "absolute", top: -60, right: -60, width: 300, height: 300, borderRadius: "50%", background: "rgba(244,196,48,0.06)" }}/>
        <div className="container">
          <span className="pill hero-badge-anim" style={{ background: "rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.85)", marginBottom: 16, display: "inline-flex" }}>{t.badge}</span>
          <h1 className="font-display hero-title-anim" style={{ fontSize: "clamp(2rem,5vw,3.2rem)", color: "white", fontWeight: 600, maxWidth: 600, margin: 0 }}>{t.title}</h1>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="section-sm" style={{ background: "var(--bg)", padding: "48px 0" }}>
        <div className="container">
          <div ref={mvRef} className="mv-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
            <div style={{ background: "var(--bg2)", borderRadius: 18, padding: "clamp(20px, 4vw, 36px)", border: "1px solid var(--border)" }}>
              <span className="pill" style={{ marginBottom: 16, display: "inline-flex" }}>{t.missionBadge}</span>
              <p style={{ fontSize: "1.08rem", fontWeight: 700, color: "var(--text1)", lineHeight: 1.65, margin: 0 }}>{t.mission}</p>
            </div>
            <div style={{ background: "linear-gradient(135deg,#1e3a5f,#2d5282)", borderRadius: 18, padding: "clamp(20px, 4vw, 36px)" }}>
              <span className="pill" style={{ background: "rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.85)", marginBottom: 16, display: "inline-flex" }}>{t.vision}</span>
              <p style={{ fontSize: "1.05rem", fontWeight: 700, color: "rgba(255,255,255,0.9)", lineHeight: 1.65, margin: 0 }}>{t.visionText}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="section-sm" style={{ background: "var(--bg2)", padding: "48px 0" }}>
        <div className="container" style={{ maxWidth: 860 }}>
          <span className="pill" style={{ marginBottom: 12, display: "inline-flex" }}>{t.history}</span>
          <h2 className="font-display" style={{ fontSize: "clamp(1.4rem,2.5vw,2rem)", color: "var(--text1)", marginBottom: 44, marginTop: 0 }}>{lang === "uz" ? "Kompaniya tarixi" : "История компании"}</h2>
          <AnimatedTimeline items={timeline} lang={lang} />
        </div>
      </section>

      {/* Team */}
      <section className="section-sm" style={{ background: "var(--bg)", padding: "48px 0" }}>
        <div className="container">
          <span className="pill" style={{ marginBottom: 12, display: "inline-flex" }}>{t.team}</span>
          <h2 className="font-display" style={{ fontSize: "clamp(1.4rem,2.5vw,2rem)", color: "var(--text1)", marginBottom: 36, marginTop: 0 }}>{lang === "uz" ? "Bizning jamoamiz" : "Наша команда"}</h2>
          <div ref={teamRef} style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(170px,1fr))", gap: 18 }}>
            {team.map((m, i) => (
              <div key={i} data-stagger className="card card-lift" style={{ padding: 22, textAlign: "center", background: "var(--card)", borderRadius: 14, border: "1px solid var(--border)" }}>
                <div style={{ width: 60, height: 60, borderRadius: "50%", background: m.bg, display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontSize: "1rem", fontWeight: 700, margin: "0 auto 14px", transition: "transform 0.3s cubic-bezier(0.22,1,0.36,1)" }}
                  onMouseOver={e => e.currentTarget.style.transform = "scale(1.12) rotate(-3deg)"}
                  onMouseOut={e => e.currentTarget.style.transform = "scale(1) rotate(0deg)"}
                >{m.a}</div>
                <div style={{ fontWeight: 600, fontSize: "0.875rem", color: "var(--text1)", marginBottom: 4 }}>{lang === "uz" ? m.uz : m.ru}</div>
                <div style={{ fontSize: "0.74rem", color: "var(--text3)" }}>{lang === "uz" ? m.rUz : m.rRu}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Certs */}
      <section style={{ background: "linear-gradient(135deg,#1e3a5f,#2d5282)", padding: "64px 0" }}>
        <div className="container">
          <div ref={certsRef}>
            <span className="pill" style={{ background: "rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.85)", marginBottom: 14, display: "inline-flex" }}>{tc.badge}</span>
            <h2 className="font-display" style={{ fontSize: "clamp(1.4rem,2.5vw,2rem)", color: "white", marginBottom: 32, marginTop: 0 }}>{tc.title}</h2>
          </div>
          <div ref={certsGrid} style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: 14 }}>
            {certifications.map(c => (
              <div key={c.id} data-stagger className="cert-card cert-card-anim" style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", padding: 20, borderRadius: 14 }}>
                <div style={{ fontSize: "1.5rem", fontFamily: "'Playfair Display',serif", color: "#93c5fd", marginBottom: 6, fontWeight: 600 }}>{c.name}</div>
                <div style={{ fontSize: "0.875rem", fontWeight: 600, color: "white", marginBottom: 3 }}>{lang === "uz" ? c.fullUz : c.fullRu}</div>
                <div style={{ fontSize: "0.74rem", color: "rgba(255,255,255,0.5)" }}>{lang === "uz" ? c.yearUz : c.yearRu}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <style>{`
        @media(max-width: 768px) {
          .mv-grid { grid-template-columns: 1fr !important; }
          .timeline-line { left: 20px !important; }
          .timeline-year { width: auto !important; text-align: left !important; position: absolute !important; top: -20px !important; left: 40px !important; }
          .timeline-item { gap: 16px !important; padding-top: 24px !important; }
          .timeline-dot-wrapper { margin-left: 13.5px !important; }
        }
      `}</style>
    </>
  );
}

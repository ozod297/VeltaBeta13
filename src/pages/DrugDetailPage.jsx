import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useApp } from "../context/AppContext";
import { translations } from "../i18n";
import { drugs, getDrugImages } from "../data";
import DrugCard from "../components/DrugCard";
import SEO from "../components/SEO";

function PillVisual({ drug }) {
  const s = drug.shape;
  if (s === "capsule") return (
    <svg viewBox="0 0 160 64" width="140" height="56">
      <rect x="3" y="3" width="154" height="58" rx="29" fill={drug.pillColor} opacity="0.82"/>
      <rect x="3" y="3" width="77" height="58" rx="29" fill={drug.pillColor} opacity="0.5"/>
      <line x1="80" y1="5" x2="80" y2="59" stroke="white" strokeWidth="2" opacity="0.5"/>
    </svg>
  );
  if (s === "oval") return (
    <svg viewBox="0 0 200 90" width="180" height="80">
      <ellipse cx="100" cy="45" rx="97" ry="43" fill={drug.pillColor} opacity="0.82"/>
      <line x1="16" y1="45" x2="184" y2="45" stroke="white" strokeWidth="2.5" opacity="0.45"/>
    </svg>
  );
  return (
    <svg viewBox="0 0 120 120" width="110" height="110">
      <circle cx="60" cy="60" r="57" fill={drug.pillColor} opacity="0.82"/>
      <line x1="12" y1="60" x2="108" y2="60" stroke="white" strokeWidth="3" opacity="0.45"/>
    </svg>
  );
}

export default function DrugDetailPage() {
  const { slug } = useParams();
  const { lang } = useApp();
  const t = translations[lang].drug;
  const drug = drugs.find(d => d.slug === slug);
  const [tab, setTab] = useState("indications");
  const [imgSrc, setImgSrc] = useState(null);

  useEffect(() => {
    const imgs = getDrugImages();
    setImgSrc(imgs[drug?.id] || null);
  }, [drug?.id]);

  if (!drug) return (
    <div style={{ textAlign: "center", padding: "100px 20px", color: "var(--text3)" }}>
      <p style={{ fontSize: "1.2rem", marginBottom: 20 }}>{lang === "uz" ? "Dori topilmadi" : "Препарат не найден"}</p>
      <Link to="/drugs" className="btn btn-primary" style={{ textDecoration: "none" }}>{t.back}</Link>
    </div>
  );

  const similar = drugs.filter(d => d.category === drug.category && d.id !== drug.id).slice(0, 4);

  const tabs = ["indications", "dosage", "composition", "contraindications"];
  const tabContent = {
    indications: lang === "uz" ? drug.indicationsUz : drug.indicationsRu,
    dosage: lang === "uz" ? drug.dosageUz : drug.dosageRu,
    composition: lang === "uz" ? drug.compositionUz : drug.compositionRu,
    contraindications: lang === "uz" ? drug.contraindicationsUz : drug.contraindicationsRu,
  };

  return (
    <>
      <SEO
        title={`${drug.name} ${drug.dose}`}
        description={lang === "uz" ? `${drug.name} ${drug.dose} — ${drug.categoryUz}. Narxi: ${drug.price} so'm.` : `${drug.name} ${drug.dose} — ${drug.categoryRu}. Цена: ${drug.price} сум.`}
        keywords={`${drug.name}, ${drug.tagUz}, ${drug.tagRu}, velta pharmaceutical, dori`}
        url={`/drugs/${drug.slug}`}
      />

      {/* Breadcrumb */}
      <div style={{ background: "var(--bg2)", borderBottom: "1px solid var(--border)", padding: "14px 0" }}>
        <div className="container" style={{ display: "flex", alignItems: "center", gap: 8, fontSize: "0.82rem", color: "var(--text3)", flexWrap: "wrap" }}>
          <Link to="/" style={{ color: "var(--text3)", textDecoration: "none" }}>{lang === "uz" ? "Bosh sahifa" : "Главная"}</Link>
          <span>/</span>
          <Link to="/drugs" style={{ color: "var(--text3)", textDecoration: "none" }}>{lang === "uz" ? "Dorilar" : "Препараты"}</Link>
          <span>/</span>
          <span style={{ color: "var(--text1)", fontWeight: 500 }}>{drug.name}</span>
        </div>
      </div>

      {/* Main Content */}
      <section className="page-enter" style={{ padding: "40px 0 64px" }}>
        <div className="container">
          <div className="drug-detail-grid" style={{ display: "grid", gridTemplateColumns: "380px 1fr", gap: 48, alignItems: "start" }}>
            
            {/* LEFT: Image Container (Responsive va xavfsiz holatga keltirildi) */}
            <div className="drug-sticky" style={{ position: "sticky", top: 100 }}>
              <div style={{ 
                background: drug.bgColor || "var(--bg2)", 
                borderRadius: 20, 
                padding: "48px 32px", 
                display: "flex", 
                flexDirection: "column", 
                alignItems: "center", 
                justifyContent: "center", 
                minHeight: "auto", 
                position: "relative",
                border: "1px solid var(--border)",
                boxSizing: "border-box"
              }}>
                {drug.top && (
                  <span style={{ position: "absolute", top: 14, right: 14, background: "#f4c430", color: "#78350f", fontSize: "0.65rem", fontWeight: 800, padding: "3px 10px", borderRadius: 999, textTransform: "uppercase", letterSpacing: "0.08em" }}>
                    TOP
                  </span>
                )}
                
                {imgSrc || drug.image ? (
                  <img 
                    src={imgSrc || drug.image} 
                    alt={drug.name} 
                    style={{ 
                      width: "100%", 
                      maxWidth: "260px", 
                      height: "auto", 
                      maxHeight: "220px", 
                      objectFit: "contain" 
                    }}
                  />
                ) : (
                  <PillVisual drug={drug}/>
                )}
              </div>
            </div>

            {/* RIGHT: Info Container */}
            <div style={{ width: "100%", minWidth: 0 }}>
              <span className={`tag ${drug.tagColor}`} style={{ marginBottom: 14, display: "inline-block" }}>
                {lang === "uz" ? drug.tagUz : drug.tagRu}
              </span>
              
              <h1 className="font-display" style={{ fontSize: "clamp(1.7rem, 3.5vw, 2.5rem)", fontWeight: 600, color: "var(--text1)", marginBottom: 12, marginTop: 0, lineHeight: 1.15 }}>
                {drug.name} <span style={{ color: "var(--text3)", fontSize: "1.2rem", fontFamily: "'Inter',sans-serif", fontWeight: 400 }}>{drug.dose}</span>
              </h1>
              
              {/* Dinamik Tavsif */}
              <p style={{ color: "var(--text2)", fontSize: "0.95rem", marginBottom: 28, lineHeight: 1.6 }}>
                {lang === "uz" ? drug.descUz : drug.descRu}
              </p>

              {/* Meta Grid */}
              <div className="meta-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, marginBottom: 28 }}>
                {[
                  { l: t.form, v: lang === "uz" ? drug.formUz : drug.formRu },
                  { l: t.quantity, v: lang === "uz" ? drug.quantityUz : drug.quantityRu },
                  { l: t.manufacturer, v: drug.manufacturer },
                ].map((m, i) => (
                  <div key={i} style={{ background: "var(--bg2)", borderRadius: 10, padding: "12px 14px", border: "1px solid var(--border)" }}>
                    <div style={{ fontSize: "0.68rem", color: "var(--text3)", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 4 }}>{m.l}</div>
                    <div style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--text1)" }}>{m.v}</div>
                  </div>
                ))}
              </div>

              {/* Price + CTA */}
              <div style={{ display: "flex", alignItems: "center", gap: 16, padding: "20px", background: "var(--bg2)", borderRadius: 14, border: "1px solid var(--border)", marginBottom: 28, flexWrap: "wrap" }}>
                <div style={{ flex: "1 0 150px" }}>
                  <div style={{ fontSize: "0.7rem", color: "var(--text3)", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 3 }}>{t.price}</div>
                  <div style={{ fontSize: "1.6rem", fontWeight: 800, color: "var(--text1)", fontFamily: "'Playfair Display',serif" }}>
                    {drug.price} <span style={{ fontSize: "0.85rem", color: "var(--text3)", fontWeight: 400, fontFamily: "'Inter',sans-serif" }}>{lang === "uz" ? "so'm" : "сум"}</span>
                  </div>
                </div>
                <div style={{ display: "flex", gap: 12, flexWrap: "wrap", width: "100%", flex: 2 }}>
                  <Link to="/contact" className="btn btn-accent" style={{ textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 8 }}>
                    {t.order}
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                  </Link>
                </div>
              </div>

              {/* Tabs Nav */}
              <div style={{ display: "flex", gap: 2, borderBottom: "2px solid var(--border)", marginBottom: 22, overflowX: "auto", WebkitOverflowScrolling: "touch", scrollbarWidth: "none" }}>
                {tabs.map(tb => (
                  <button key={tb} onClick={() => setTab(tb)} style={{ padding: "10px 16px", border: "none", background: "transparent", cursor: "pointer", fontSize: "0.84rem", fontWeight: 600, color: tab === tb ? "var(--accent)" : "var(--text2)", borderBottom: `2px solid ${tab === tb ? "var(--accent)" : "transparent"}`, marginBottom: -2, transition: "all 0.2s", whiteSpace: "nowrap" }}>
                    {t.tabs[tb]}
                  </button>
                ))}
              </div>

              {/* Tabs Content */}
              <div style={{ marginBottom: 36 }}>
                {tab === "dosage" ? (
                  <div style={{ overflowX: "auto", border: "1px solid var(--border)", borderRadius: 10, background: "var(--card)" }}>
                    <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "0.9rem" }}>
                      <thead>
                        <tr style={{ background: "var(--bg2)", borderBottom: "1px solid var(--border)" }}>
                          <th style={{ padding: "12px 14px", fontWeight: 600, color: "var(--text1)" }}>{lang === "ru" ? "Состояние / Категория" : "Holat / Bemor turi"}</th>
                          <th style={{ padding: "12px 14px", fontWeight: 600, color: "var(--text1)" }}>{lang === "ru" ? "Рекомендуемая доза" : "Tavsiya etilgan doza"}</th>
                          <th style={{ padding: "12px 14px", fontWeight: 600, color: "var(--text1)" }}>{lang === "ru" ? "Период приема" : "Iste'mol muddati"}</th>
                        </tr>
                      </thead>
                      <tbody>
                        {Array.isArray(tabContent[tab]) && tabContent[tab].map((item, i) => (
                          <tr key={i} style={{ borderBottom: i < tabContent[tab].length - 1 ? "1px solid var(--border)" : "none" }}>
                            <td style={{ padding: "12px 14px", fontWeight: 600, color: "var(--text1)" }}>{item.holat}</td>
                            <td style={{ padding: "12px 14px", color: "var(--text2)" }}>{item.doza}</td>
                            <td style={{ padding: "12px 14px", color: "var(--text2)" }}>{item.muddati}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : tab === "composition" ? (
                  <p style={{ color: "var(--text2)", lineHeight: 1.7, fontSize: "0.92rem", background: "var(--bg2)", padding: 20, borderRadius: 12, border: "1px solid var(--border)", margin: 0 }}>{tabContent[tab]}</p>
                ) : (
                  <ul style={{ listStyle: "none", padding: 0, display: "flex", flexDirection: "column", gap: 10, margin: 0 }}>
                    {(Array.isArray(tabContent[tab]) ? tabContent[tab] : [tabContent[tab]]).map((item, i) => (
                      <li key={i} style={{ display: "flex", alignItems: "flex-start", gap: 12, fontSize: "0.92rem", color: "var(--text2)", lineHeight: 1.5 }}>
                        <div style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--accent)", flexShrink: 0, marginTop: 7 }}/>
                        {item}
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {/* Warning */}
              <div style={{ background: "rgba(245,158,11,0.06)", border: "1px solid rgba(245,158,11,0.2)", borderRadius: 14, padding: "16px", display: "flex", gap: 14 }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#d97706" strokeWidth="2" style={{ flexShrink: 0, marginTop: 2 }}><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
                <div>
                  <div style={{ fontSize: "0.8rem", fontWeight: 700, color: "#d97706", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 4 }}>{t.warning}</div>
                  <div style={{ fontSize: "0.88rem", color: "var(--text2)", lineHeight: 1.55 }}>{t.warningText}</div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* Similar Drugs */}
      {similar.length > 0 && (
        <section style={{ background: "var(--bg2)", borderTop: "1px solid var(--border)", padding: "54px 0 64px" }}>
          <div className="container">
            <span className="pill" style={{ marginBottom: 12, display: "inline-flex" }}>{lang === "uz" ? "O'xshash dorilar" : "Похожие препараты"}</span>
            <h2 className="font-display" style={{ fontSize: "clamp(1.3rem,2.5vw,1.8rem)", color: "var(--text1)", marginBottom: 28, marginTop: 0 }}>
              {lang === "uz" ? `Yana ${drug.tagUz} guruhidan` : `Ещё из группы ${drug.tagRu}`}
            </h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(220px,1fr))", gap: 20 }}>
              {similar.map(d => <DrugCard key={d.id} drug={d}/>)}
            </div>
          </div>
        </section>
      )}

      {/* CSS Identifikatorlari Bog'landi (Mobil uchun to'liq optimizatsiya) */}
      <style>{`
        @media(max-width: 992px) {
          .drug-detail-grid {
            grid-template-columns: 1fr !important;
            gap: 24px !important;
          }
          .drug-sticky {
            position: static !important;
            width: 100% !important;
          }
          .drug-sticky > div {
            padding: 24px 16px !important; /* Mobilda padding qisqartirildi */
          }
        }
        @media(max-width: 540px) {
          .meta-grid {
            grid-template-columns: 1fr !important;
            gap: 8px !important;
          }
        }
      `}</style>
    </>
  );
}
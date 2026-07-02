import { useState } from "react";
import { useApp } from "../context/AppContext";
import { useAdmin } from "../context/AdminContext";
import { translations } from "../i18n";
import SEO from "../components/SEO";

export default function NewsPage() {
  const { lang } = useApp();
  const { news } = useAdmin();
  const t = translations[lang].newsPage;
  const [selectedNews, setSelectedNews] = useState(null);

  return (
    <>
      <SEO
        title={lang === "uz" ? "Yangiliklar" : "Новости"}
        description={lang === "uz" ? "Velta Pharmaceutical so'nggi yangiliklari, yangi mahsulotlar, sertifikatlar va tadbirlar." : "Последние новости Velta Pharmaceutical — новые продукты, сертификаты и мероприятия."}
        url="/news"
      />

      {/* Hero Header */}
      <section className="page-enter" style={{ background: "linear-gradient(135deg, #1e3a5f, #2d5282)", padding: "clamp(50px, 7vw, 80px) 0 clamp(40px, 5vw, 60px)" }}>
        <div className="container">
          <span className="pill" style={{ background: "rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.85)", marginBottom: 14, display: "inline-flex", fontSize: "0.78rem", padding: "4px 12px", borderRadius: 999, fontWeight: 600 }}>
            {t.badge}
          </span>
          <h1 className="font-display" style={{ fontSize: "clamp(1.8rem, 4.5vw, 2.6rem)", color: "white", fontWeight: 600, margin: 0 }}>
            {t.title}
          </h1>
        </div>
      </section>

      {/* News Grid Section */}
      <section className="section" style={{ background: "var(--bg)", padding: "50px 0 80px" }}>
        <div className="container">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 24 }}>
            {news.map(item => {
              const currentTag = lang === "uz" ? (item.tagUz || item.tag) : (item.tagRu || item.tag);
              return (
                <article key={item.id} className="card" style={{ overflow: "hidden", display: "flex", flexDirection: "column", background: "var(--card)", border: "1px solid var(--border)", borderRadius: 16, transition: "transform 0.2s, box-shadow 0.2s" }}>
                  <div style={{ height: 5, background: item.tagColor === "tag-blue" ? "var(--accent)" : item.tagColor === "tag-green" ? "#10b981" : item.tagColor === "tag-amber" ? "#f59e0b" : "#8b5cf6" }} />
                  <div style={{ padding: 24, flex: 1, display: "flex", flexDirection: "column" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
                      <span className={`tag ${item.tagColor}`} style={{ padding: "4px 10px", borderRadius: 6, fontSize: "0.74rem", fontWeight: 600 }}>
                        {currentTag}
                      </span>
                      <span style={{ fontSize: "0.76rem", color: "var(--text3)", fontWeight: 500 }}>
                        {new Date(item.date).toLocaleDateString(lang === "uz" ? "uz-UZ" : "ru-RU", { year: "numeric", month: "long", day: "numeric" })}
                      </span>
                    </div>
                    <h2 style={{ fontSize: "1.05rem", fontWeight: 700, color: "var(--text1)", lineHeight: 1.4, marginBottom: 12, marginTop: 0 }}>
                      {lang === "uz" ? item.titleUz : item.titleRu}
                    </h2>
                    <p style={{ fontSize: "0.86rem", color: "var(--text2)", lineHeight: 1.65, flex: 1, marginBottom: 24, marginTop: 0 }}>
                      {lang === "uz" ? item.excerptUz : item.excerptRu}
                    </p>
                    <button
                      onClick={() => setSelectedNews(item)}
                      className="btn btn-ghost"
                      style={{ alignSelf: "flex-start", fontSize: "0.82rem", display: "inline-flex", alignItems: "center", gap: 6, padding: "6px 12px", cursor: "pointer" }}
                    >
                      {t.readMore}
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* Modal */}
      {selectedNews && (
        <div
          style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", background: "rgba(0,0,0,0.4)", backdropFilter: "blur(4px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: 16 }}
          onClick={() => setSelectedNews(null)}
        >
          <div
            style={{ background: "var(--card)", borderRadius: 20, width: "100%", maxWidth: 600, maxHeight: "85vh", overflowY: "auto", border: "1px solid var(--border)", boxShadow: "0 20px 40px rgba(0,0,0,0.2)", position: "relative", animation: "modalFadeIn 0.25s ease" }}
            onClick={e => e.stopPropagation()}
          >
            <div style={{ height: 6, background: selectedNews.tagColor === "tag-blue" ? "var(--accent)" : selectedNews.tagColor === "tag-green" ? "#10b981" : selectedNews.tagColor === "tag-amber" ? "#f59e0b" : "#8b5cf6" }} />
            <button
              onClick={() => setSelectedNews(null)}
              style={{ position: "absolute", top: 16, right: 16, background: "var(--bg2)", border: "1px solid var(--border)", borderRadius: "50%", width: 32, height: 32, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "var(--text2)" }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
            </button>
            <div style={{ padding: "32px 24px 24px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
                <span className={`tag ${selectedNews.tagColor}`} style={{ padding: "4px 10px", borderRadius: 6, fontSize: "0.74rem", fontWeight: 600 }}>
                  {lang === "uz" ? (selectedNews.tagUz || selectedNews.tag) : (selectedNews.tagRu || selectedNews.tag)}
                </span>
                <span style={{ fontSize: "0.78rem", color: "var(--text3)", fontWeight: 500 }}>
                  {new Date(selectedNews.date).toLocaleDateString(lang === "uz" ? "uz-UZ" : "ru-RU", { year: "numeric", month: "long", day: "numeric" })}
                </span>
              </div>
              <h2 style={{ fontSize: "1.3rem", fontWeight: 700, color: "var(--text1)", lineHeight: 1.35, marginBottom: 16, marginTop: 0 }}>
                {lang === "uz" ? selectedNews.titleUz : selectedNews.titleRu}
              </h2>
              <p style={{ fontSize: "0.92rem", color: "var(--text2)", lineHeight: 1.7, margin: 0, whiteSpace: "pre-line" }}>
                {lang === "uz" ? (selectedNews.contentUz || selectedNews.excerptUz) : (selectedNews.contentRu || selectedNews.excerptRu)}
              </p>
            </div>
          </div>
        </div>
      )}
      <style>{`
        @keyframes modalFadeIn {
          from { opacity: 0; transform: scale(0.95) translateY(10px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
      `}</style>
    </>
  );
}

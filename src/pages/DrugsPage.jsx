import { useState, useMemo, useRef, useEffect } from "react";
import { useStaggerReveal } from "../hooks/useScrollReveal";
import { useSearchParams } from "react-router-dom";
import { useApp } from "../context/AppContext";
import { translations } from "../i18n";
import { drugs, saveDrugImage, removeDrugImage, getDrugImages } from "../data";
import DrugCard from "../components/DrugCard";
import SEO from "../components/SEO";

const CATS = ["all", "painkillers", "antibiotics", "vitamins", "cardio", "allergy", "gastro"];

export default function DrugsPage() {
  const { lang } = useApp();
  const t = translations[lang].products;
  const [searchParams, setSearchParams] = useSearchParams();
  
  const [active, setActive] = useState(searchParams.get("cat") || "all");
  const [search, setSearch] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [editDrug, setEditDrug] = useState(null);
  const [imgMap, setImgMap] = useState(getDrugImages());
  const fileRef = useRef();
  // Stagger animatsiya — grid elementlari navbat bilan paydo bo'ladi
  const gridRef = useStaggerReveal("[data-stagger-drug]");


  // URL-dagi 'cat' parametri o'zgarganda ichki holatni sinxronizatsiya qilish
  useEffect(() => {
    const categoryParam = searchParams.get("cat");
    if (categoryParam && CATS.includes(categoryParam)) {
      setActive(categoryParam);
    } else if (!categoryParam) {
      setActive("all");
    }
  }, [searchParams]);

  // Kategoriya o'zgarganda URL va qidiruvni yangilash
  const handleCategoryChange = (cat) => {
    setActive(cat);
    setSearch(""); // Boshqa guruhga o'tganda qidiruv matnini tozalash
    
    const newParams = new URLSearchParams(searchParams);
    if (cat === "all") {
      newParams.delete("cat");
    } else {
      newParams.set("cat", cat);
    }
    setSearchParams(newParams);
  };

  // Qidiruv va filtr mantiqiy qismi
  const filtered = useMemo(() => drugs.filter(d => {
    const mc = active === "all" || d.category === active;
    const q = search.toLowerCase().trim();
    const ms = !q || 
               d.name.toLowerCase().includes(q) || 
               (d.tagUz || "").toLowerCase().includes(q) || 
               (d.tagRu || "").toLowerCase().includes(q);
    return mc && ms;
  }), [active, search]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file || !editDrug) return;
    
    const reader = new FileReader();
    reader.onload = (ev) => {
      saveDrugImage(editDrug.id, ev.target.result);
      setImgMap(getDrugImages());
      setEditDrug(null);
      if (fileRef.current) fileRef.current.value = ""; 
    };
    reader.readAsDataURL(file);
  };

  const handleRemove = (drugId) => {
    const confirmMessage = lang === "uz" 
      ? "Haqiqatan ham ushbu rasmni o'chirmoqchimisiz?" 
      : "Вы действительно хотите удалить это фото?";
      
    if (window.confirm(confirmMessage)) {
      removeDrugImage(drugId);
      setImgMap(getDrugImages());
    }
  };

  return (
    <>
      <SEO
        title={lang === "uz" ? "Dorilar katalogi" : "Каталог препаратов"}
        description={lang === "uz" ? "Velta dorilar katalogi — 150+ sifatli farmatsevtika mahsulotlari. Kategoriya va nom bo'yicha qidiring." : "Каталог препаратов Velta — 150+ качественных фармацевтических продуктов."}
        keywords="dori katalogi, farmatsevtika uzbekistan, paracetamol, ibuprofen, antibiotik, vitamin, velta"
        url="/drugs"
      />

      {/* Global bagdan himoya qilish uchun maxsus o'rab turuvchi wrapper */}
      <div className="page-enter" style={{ width: "100%", maxWidth: "100%", overflowX: "hidden", boxSizing: "border-box" }}>
        
        {/* Header / Yuqori qism (Kenglik 100% ga sozlandi, paddinglar mobillashdi) */}
        <div style={{ width: "100%", background: "var(--bg2)", borderBottom: "1px solid var(--border)", padding: "24px 0 20px", boxSizing: "border-box" }}>
          <div className="container" style={{ width: "100%", paddingLeft: "16px", paddingRight: "16px", boxSizing: "border-box" }}>
            
            {/* Sarlavha va Rasm boshqaruvi tugmasi joylashuvi */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 16, marginBottom: 20, width: "100%" }}>
              <div style={{ flex: "1 1 200px" }}>
                <span className="pill" style={{ marginBottom: 6, display: "inline-flex" }}>{t.badge}</span>
                <h1 className="font-display" style={{ fontSize: "clamp(1.4rem, 4vw, 2.2rem)", color: "var(--text1)", margin: 0, lineHeight: 1.2 }}>
                  {t.title}
                </h1>
              </div>
              
              {/* Rasm boshqaruvi tugmasi */}
              {/* <button
                onClick={() => setEditMode(!editMode)}
                className={`btn ${editMode ? "btn-accent" : "btn-ghost"}`}
                style={{ 
                  display: "inline-flex", 
                  alignItems: "center", 
                  gap: 8, 
                  padding: "10px 16px", 
                  borderRadius: 10, 
                  fontSize: "0.88rem", 
                  fontWeight: 600,
                  cursor: "pointer",
                  border: "1px solid var(--border)",
                  background: editMode ? "var(--accent)" : "transparent",
                  color: editMode ? "white" : "var(--text1)",
                  transition: "all 0.2s",
                  whiteSpace: "nowrap"
                }}
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                {editMode ? (lang === "uz" ? "Yopish" : "Закрыть") : (lang === "uz" ? "Rasm boshqaruvi" : "Управление фото")}
              </button> */}
            </div>

            {/* Admin Ko'rsatma paneli */}
            {editMode && (
              <div style={{ width: "100%", background: "rgba(30,58,95,0.06)", border: "1px solid var(--accent)", borderRadius: 12, padding: "12px 16px", marginBottom: 20, fontSize: "0.84rem", color: "var(--accent)", display: "flex", alignItems: "start", gap: 10, boxSizing: "border-box" }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ flexShrink: 0, marginTop: 2 }}><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                <span>
                  {lang === "uz" ? "Dori rasmini yuklash yoki o'zgartirish uchun kartochka ustidagi kamera tugmasini bosing." : "Нажмите кнопку камеры на карточке, чтобы загрузить или изменить фото препарата."}
                </span>
              </div>
            )}

            {/* Qidiruv Inputi (Maksimal kengligi mobilda 100% bo'lishi ta'minlandi) */}
            <div style={{ width: "100%", maxWidth: 440, marginBottom: 24, position: "relative", boxSizing: "border-box" }}>
              <svg style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "var(--text3)", pointerEvents: "none" }} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
              <input 
                type="text"
                className="input" 
                style={{ width: "100%", paddingLeft: 44, paddingRight: 16, height: 46, borderRadius: 10, border: "1px solid var(--border)", background: "var(--bg)", color: "var(--text1)", outline: "none", boxSizing: "border-box" }} 
                placeholder={lang === "uz" ? "Dori nomini yoki guruhini qidiring..." : "Поиск препарата или группы..."} 
                value={search} 
                onChange={e => setSearch(e.target.value)}
              />
            </div>

            {/* Kategoriyalar Tablari (Ekrandan chiqib ketmaydi, faqat o'zi chiroyli o'ngga suriladi) */}
            <div style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 6, width: "100%", WebkitOverflowScrolling: "touch", scrollbarWidth: "none", boxSizing: "border-box" }}>
              {CATS.map((cat, i) => (
                <button 
                  key={cat} 
                  className={`filter-tab ${active === cat ? "active" : ""}`} 
                  onClick={() => handleCategoryChange(cat)}
                  style={{
                    padding: "8px 16px",
                    borderRadius: 8,
                    border: "1px solid var(--border)",
                    background: active === cat ? "var(--accent)" : "var(--card)",
                    color: active === cat ? "white" : "var(--text2)",
                    fontSize: "0.86rem",
                    fontWeight: 550,
                    cursor: "pointer",
                    whiteSpace: "nowrap",
                    transition: "all 0.2s",
                    flexShrink: 0 /* Tugmalar mobilda kichrayib ezilib ketmasligi uchun */
                  }}
                >
                  {t.categories[i]}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Dorilar Katalogi Grid qismi */}
        <div className="container" style={{ paddingTop: 30, paddingBottom: 60, paddingLeft: "16px", paddingRight: "16px", boxSizing: "border-box", width: "100%" }}>
          {filtered.length === 0 ? (
            <div style={{ textAlign: "center", padding: "60px 20px", color: "var(--text3)", width: "100%", boxSizing: "border-box" }}>
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ marginBottom: 14, opacity: 0.35 }}><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
              <p style={{ fontSize: "1rem", margin: 0 }}>{lang === "uz" ? "Hech qanday dori topilmadi" : "Ничего не найдено"}</p>
            </div>
          ) : (
            /* Grid o'lchamlari mobil ekranlarga (kichik telefonlarga) ham sig'adigan qilindi (minmax 160px) */
            <div ref={gridRef} style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: 16, width: "100%", boxSizing: "border-box" }}>
              {filtered.map(drug => (
                <div key={drug.id} data-stagger-drug style={{ position: "relative", width: "100%", boxSizing: "border-box" }}>
                  <DrugCard drug={{ ...drug, image: imgMap[drug.id] || drug.image }} />
                  
                  {editMode && (
                    <div style={{ position: "absolute", top: 10, left: 10, display: "flex", gap: 6, zIndex: 10 }}>
                      <button
                        onClick={() => { setEditDrug(drug); fileRef.current.click(); }}
                        style={{ width: 32, height: 32, borderRadius: 8, background: "var(--accent, #1e3a5f)", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "white", boxShadow: "0 2px 8px rgba(0,0,0,0.15)" }}
                        title={lang === "uz" ? "Rasm yuklash" : "Загрузить фото"}
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>
                      </button>
                      {imgMap[drug.id] && (
                        <button
                          onClick={() => handleRemove(drug.id)}
                          style={{ width: 32, height: 32, borderRadius: 8, background: "#ef4444", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "white", boxShadow: "0 2px 8px rgba(239,68,68,0.2)" }}
                          title={lang === "uz" ? "Rasmni o'chirish" : "Удалить фото"}
                        >
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6"/></svg>
                        </button>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

      </div> {/* Wrapper tugashi */}

      <input 
        ref={fileRef} 
        type="file" 
        accept="image/*" 
        style={{ display: "none" }} 
        onChange={handleFileChange}
      />
    </>
  );
}
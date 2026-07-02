import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAdmin } from "../context/AdminContext";
import { useApp } from "../context/AppContext";

// ─── Tarjimalar ───────────────────────────────────────────────────────────────
const T = {
  uz: {
    adminPanel: "Admin Panel",
    velta: "Velta Pharmaceutical",
    dashboard: "Boshqaruv paneli",
    toSite: "Saytga",
    logout: "Chiqish",
    totalNews: "Jami yangiliklar",
    blueTag: "Ko'k teglar",
    greenTag: "Yashil teglar",
    lastMonth: "So'nggi oy",
    newsManage: "Yangiliklar boshqaruvi",
    newsManageDesc: "Saytdagi yangiliklar bo'limini shu yerdan tahrirlang",
    addNews: "Yangi yangilik",
    savedMsg: "O'zgarishlar saqlandi va saytda yangilandi!",
    emptyTitle: "Hech qanday yangilik yo'q",
    emptyDesc: "Yuqoridagi tugma orqali yangilik qo'shing",
    edit: "Tahrirlash",
    delete: "O'chirish",
    createModal: "➕ Yangi yangilik qo'shish",
    editModal: "✏️ Yangilikni tahrirlash",
    cancel: "Bekor qilish",
    save: "Saqlash",
    deleteTitle: "Yangilikni o'chirish",
    deleteDesc: "Bu yangilik saytdan o'chiriladi. Bu amalni qaytarib bo'lmaydi.",
    confirmDelete: "O'chirish",
    titleUz: "Sarlavha (UZ) *",
    titleRu: "Sarlavha (RU) *",
    tagUz: "Tag nomi (UZ) *",
    tagRu: "Tag nomi (RU) *",
    excerptUz: "Qisqacha (UZ) *",
    excerptRu: "Qisqacha (RU) *",
    contentUz: "To'liq matn (UZ)",
    contentRu: "To'liq matn (RU)",
    optional: "(ixtiyoriy)",
    dateLabel: "Sana *",
    tagColor: "Tag rangi",
    titleUzPh: "Yangilik sarlavhasi...",
    titleRuPh: "Заголовок новости...",
    tagUzPh: "Yangilik, Sertifikat, Tadbir...",
    tagRuPh: "Новость, Сертификат, Событие...",
    excerptUzPh: "Yangilik haqida qisqacha tavsif...",
    excerptRuPh: "Краткое описание новости...",
    contentUzPh: "Yangilikni batafsil mazmuni...",
    contentRuPh: "Подробное содержание новости...",
    errTitleUz: "Sarlavha (UZ) kiritilishi shart",
    errTitleRu: "Sarlavha (RU) kiritilishi shart",
    errExcerptUz: "Qisqacha (UZ) kiritilishi shart",
    errExcerptRu: "Qisqacha (RU) kiritilishi shart",
    errTagUz: "Tag (UZ) kiritilishi shart",
    errTagRu: "Tag (RU) kiritilishi shart",
  },
  ru: {
    adminPanel: "Панель администратора",
    velta: "Velta Pharmaceutical",
    dashboard: "Панель управления",
    toSite: "На сайт",
    logout: "Выйти",
    totalNews: "Всего новостей",
    blueTag: "Синие теги",
    greenTag: "Зелёные теги",
    lastMonth: "За последний месяц",
    newsManage: "Управление новостями",
    newsManageDesc: "Редактируйте раздел новостей сайта отсюда",
    addNews: "Новая новость",
    savedMsg: "Изменения сохранены и обновлены на сайте!",
    emptyTitle: "Новостей нет",
    emptyDesc: "Добавьте новость с помощью кнопки выше",
    edit: "Редактировать",
    delete: "Удалить",
    createModal: "➕ Добавить новую новость",
    editModal: "✏️ Редактировать новость",
    cancel: "Отмена",
    save: "Сохранить",
    deleteTitle: "Удалить новость",
    deleteDesc: "Эта новость будет удалена с сайта. Это действие нельзя отменить.",
    confirmDelete: "Удалить",
    titleUz: "Заголовок (UZ) *",
    titleRu: "Заголовок (RU) *",
    tagUz: "Название тега (UZ) *",
    tagRu: "Название тега (RU) *",
    excerptUz: "Краткое (UZ) *",
    excerptRu: "Краткое (RU) *",
    contentUz: "Полный текст (UZ)",
    contentRu: "Полный текст (RU)",
    optional: "(необязательно)",
    dateLabel: "Дата *",
    tagColor: "Цвет тега",
    titleUzPh: "Заголовок новости (на узбекском)...",
    titleRuPh: "Заголовок новости...",
    tagUzPh: "Yangilik, Sertifikat...",
    tagRuPh: "Новость, Сертификат, Событие...",
    excerptUzPh: "Краткое описание (на узбекском)...",
    excerptRuPh: "Краткое описание новости...",
    contentUzPh: "Полное содержание (на узбекском)...",
    contentRuPh: "Подробное содержание новости...",
    errTitleUz: "Заголовок (UZ) обязателен",
    errTitleRu: "Заголовок (RU) обязателен",
    errExcerptUz: "Краткое описание (UZ) обязательно",
    errExcerptRu: "Краткое описание (RU) обязательно",
    errTagUz: "Тег (UZ) обязателен",
    errTagRu: "Тег (RU) обязателен",
  },
};

const EMPTY_FORM = {
  titleUz: "", titleRu: "",
  excerptUz: "", excerptRu: "",
  contentUz: "", contentRu: "",
  tagUz: "", tagRu: "",
  tagColor: "tag-blue",
  date: new Date().toISOString().split("T")[0],
};

const tagColors = {
  "tag-blue": "var(--accent)",
  "tag-green": "#10b981",
  "tag-amber": "#f59e0b",
  "tag-purple": "#8b5cf6",
};

// ─── NewsForm ─────────────────────────────────────────────────────────────────
function NewsForm({ initial, onSave, onCancel, t }) {
  const [form, setForm] = useState(initial || EMPTY_FORM);
  const [activeTab, setActiveTab] = useState("uz");
  const [errors, setErrors] = useState({});

  const set = (key, val) => setForm((f) => ({ ...f, [key]: val }));

  const validate = () => {
    const e = {};
    if (!form.titleUz.trim()) e.titleUz = t.errTitleUz;
    if (!form.titleRu.trim()) e.titleRu = t.errTitleRu;
    if (!form.excerptUz.trim()) e.excerptUz = t.errExcerptUz;
    if (!form.excerptRu.trim()) e.excerptRu = t.errExcerptRu;
    if (!form.tagUz.trim()) e.tagUz = t.errTagUz;
    if (!form.tagRu.trim()) e.tagRu = t.errTagRu;
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = () => { if (validate()) onSave(form); };

  const inputStyle = (errKey) => ({
    width: "100%", padding: "10px 12px",
    border: `1.5px solid ${errors[errKey] ? "#ef4444" : "var(--border)"}`,
    borderRadius: 10, background: "var(--bg2)", color: "var(--text1)",
    fontSize: "0.88rem", outline: "none", boxSizing: "border-box",
    transition: "border-color 0.2s", fontFamily: "inherit",
  });

  return (
    <div>
      {/* Til tablari */}
      <div style={{ display: "flex", gap: 4, marginBottom: 20, background: "var(--bg2)", borderRadius: 10, padding: 4 }}>
        {["uz", "ru"].map((tab) => (
          <button key={tab} onClick={() => setActiveTab(tab)} style={{
            flex: 1, padding: "8px", borderRadius: 8, border: "none", cursor: "pointer",
            background: activeTab === tab ? "var(--card)" : "transparent",
            color: activeTab === tab ? "var(--accent)" : "var(--text2)",
            fontWeight: activeTab === tab ? 700 : 500, fontSize: "0.82rem",
            textTransform: "uppercase", letterSpacing: "0.05em", transition: "all 0.2s",
            boxShadow: activeTab === tab ? "0 2px 8px rgba(0,0,0,0.08)" : "none",
          }}>
            {tab === "uz" ? "🇺🇿 O'zbek" : "🇷🇺 Русский"}
          </button>
        ))}
      </div>

      {activeTab === "uz" ? (
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div>
            <label style={{ display: "block", fontSize: "0.78rem", fontWeight: 600, color: "var(--text2)", marginBottom: 5 }}>{t.titleUz}</label>
            <input value={form.titleUz} onChange={(e) => set("titleUz", e.target.value)} style={inputStyle("titleUz")} placeholder={t.titleUzPh} />
            {errors.titleUz && <span style={{ color: "#ef4444", fontSize: "0.75rem" }}>{errors.titleUz}</span>}
          </div>
          <div>
            <label style={{ display: "block", fontSize: "0.78rem", fontWeight: 600, color: "var(--text2)", marginBottom: 5 }}>{t.tagUz}</label>
            <input value={form.tagUz} onChange={(e) => set("tagUz", e.target.value)} style={inputStyle("tagUz")} placeholder={t.tagUzPh} />
            {errors.tagUz && <span style={{ color: "#ef4444", fontSize: "0.75rem" }}>{errors.tagUz}</span>}
          </div>
          <div>
            <label style={{ display: "block", fontSize: "0.78rem", fontWeight: 600, color: "var(--text2)", marginBottom: 5 }}>{t.excerptUz}</label>
            <textarea value={form.excerptUz} onChange={(e) => set("excerptUz", e.target.value)} rows={3}
              style={{ ...inputStyle("excerptUz"), resize: "vertical", lineHeight: 1.6 }} placeholder={t.excerptUzPh} />
            {errors.excerptUz && <span style={{ color: "#ef4444", fontSize: "0.75rem" }}>{errors.excerptUz}</span>}
          </div>
          <div>
            <label style={{ display: "block", fontSize: "0.78rem", fontWeight: 600, color: "var(--text2)", marginBottom: 5 }}>
              {t.contentUz} <span style={{ fontWeight: 400, color: "var(--text3)" }}>{t.optional}</span>
            </label>
            <textarea value={form.contentUz} onChange={(e) => set("contentUz", e.target.value)} rows={5}
              style={{ ...inputStyle(""), resize: "vertical", lineHeight: 1.6 }} placeholder={t.contentUzPh} />
          </div>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div>
            <label style={{ display: "block", fontSize: "0.78rem", fontWeight: 600, color: "var(--text2)", marginBottom: 5 }}>{t.titleRu}</label>
            <input value={form.titleRu} onChange={(e) => set("titleRu", e.target.value)} style={inputStyle("titleRu")} placeholder={t.titleRuPh} />
            {errors.titleRu && <span style={{ color: "#ef4444", fontSize: "0.75rem" }}>{errors.titleRu}</span>}
          </div>
          <div>
            <label style={{ display: "block", fontSize: "0.78rem", fontWeight: 600, color: "var(--text2)", marginBottom: 5 }}>{t.tagRu}</label>
            <input value={form.tagRu} onChange={(e) => set("tagRu", e.target.value)} style={inputStyle("tagRu")} placeholder={t.tagRuPh} />
            {errors.tagRu && <span style={{ color: "#ef4444", fontSize: "0.75rem" }}>{errors.tagRu}</span>}
          </div>
          <div>
            <label style={{ display: "block", fontSize: "0.78rem", fontWeight: 600, color: "var(--text2)", marginBottom: 5 }}>{t.excerptRu}</label>
            <textarea value={form.excerptRu} onChange={(e) => set("excerptRu", e.target.value)} rows={3}
              style={{ ...inputStyle("excerptRu"), resize: "vertical", lineHeight: 1.6 }} placeholder={t.excerptRuPh} />
            {errors.excerptRu && <span style={{ color: "#ef4444", fontSize: "0.75rem" }}>{errors.excerptRu}</span>}
          </div>
          <div>
            <label style={{ display: "block", fontSize: "0.78rem", fontWeight: 600, color: "var(--text2)", marginBottom: 5 }}>
              {t.contentRu} <span style={{ fontWeight: 400, color: "var(--text3)" }}>{t.optional}</span>
            </label>
            <textarea value={form.contentRu} onChange={(e) => set("contentRu", e.target.value)} rows={5}
              style={{ ...inputStyle(""), resize: "vertical", lineHeight: 1.6 }} placeholder={t.contentRuPh} />
          </div>
        </div>
      )}

      {/* Umumiy: sana + rang */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginTop: 14 }}>
        <div>
          <label style={{ display: "block", fontSize: "0.78rem", fontWeight: 600, color: "var(--text2)", marginBottom: 5 }}>{t.dateLabel}</label>
          <input type="date" value={form.date} onChange={(e) => set("date", e.target.value)}
            style={{ ...inputStyle(""), colorScheme: "auto" }} />
        </div>
        <div>
          <label style={{ display: "block", fontSize: "0.78rem", fontWeight: 600, color: "var(--text2)", marginBottom: 5 }}>{t.tagColor}</label>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 4 }}>
            {Object.entries(tagColors).map(([val, color]) => (
              <button key={val} onClick={() => set("tagColor", val)} style={{
                width: 28, height: 28, borderRadius: "50%",
                border: form.tagColor === val ? "3px solid var(--text1)" : "3px solid transparent",
                background: color, cursor: "pointer", transition: "all 0.15s", outline: "none",
              }} />
            ))}
          </div>
        </div>
      </div>

      {/* Tugmalar */}
      <div style={{ display: "flex", gap: 10, marginTop: 24, justifyContent: "flex-end" }}>
        <button onClick={onCancel} style={{
          padding: "10px 20px", borderRadius: 10,
          border: "1.5px solid var(--border)", background: "transparent",
          color: "var(--text2)", fontSize: "0.88rem", fontWeight: 600, cursor: "pointer",
        }}>{t.cancel}</button>
        <button onClick={handleSave} style={{
          padding: "10px 24px", borderRadius: 10, border: "none",
          background: "linear-gradient(135deg, #3b82f6, #2563eb)", color: "white",
          fontSize: "0.88rem", fontWeight: 600, cursor: "pointer",
          display: "flex", alignItems: "center", gap: 6,
          boxShadow: "0 4px 14px rgba(59,130,246,0.3)",
        }}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/>
            <polyline points="17,21 17,13 7,13 7,21"/><polyline points="7,3 7,8 15,8"/>
          </svg>
          {t.save}
        </button>
      </div>
    </div>
  );
}

// ─── Sana formatlash (uz-UZ locale muammosini hal qiladi) ────────────────────
function formatDate(dateStr, lang) {
  const d = new Date(dateStr);
  if (isNaN(d)) return dateStr;
  const months = {
    uz: ["Yanvar","Fevral","Mart","Aprel","May","Iyun","Iyul","Avgust","Sentabr","Oktabr","Noyabr","Dekabr"],
    ru: ["января","февраля","марта","апреля","мая","июня","июля","августа","сентября","октября","ноября","декабря"],
  };
  const m = months[lang] || months.uz;
  return `${d.getDate()} ${m[d.getMonth()]} ${d.getFullYear()}`;
}

// ─── AdminDashboard ───────────────────────────────────────────────────────────
export default function AdminDashboardPage() {
  const { news, createNews, updateNews, deleteNews, logout } = useAdmin();
  const { lang, setLang } = useApp();
  const navigate = useNavigate();
  const t = T[lang];

  const [modal, setModal] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [saved, setSaved] = useState(false);

  const handleSave = (form) => {
    if (modal.type === "create") createNews(form);
    else updateNews(modal.item.id, form);
    setModal(null);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleDelete = (id) => {
    deleteNews(id);
    setDeleteConfirm(null);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleLogout = () => { logout(); navigate("/admin"); };

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)" }}>

      {/* ── Top bar ── */}
      <div style={{ background: "var(--card)", borderBottom: "1px solid var(--border)", padding: "0 16px", position: "sticky", top: 0, zIndex: 100 }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", height: 56, gap: 8 }}>

          {/* Logo */}
          <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
            <div style={{ width: 30, height: 30, borderRadius: 8, background: "linear-gradient(135deg, #3b82f6, #10b981)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
                <rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/>
                <rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>
              </svg>
            </div>
            <div className="admin-logo-text">
              <div style={{ fontSize: "0.88rem", fontWeight: 700, color: "var(--text1)", lineHeight: 1.2 }}>{t.adminPanel}</div>
              <div style={{ fontSize: "0.68rem", color: "var(--text3)" }}>{t.velta}</div>
            </div>
          </div>

          {/* Right controls */}
          <div style={{ display: "flex", alignItems: "center", gap: 6, flexShrink: 0 }}>

            {/* Til almashtirish */}
            <div style={{ display: "flex", background: "var(--bg2)", borderRadius: 999, padding: "3px 4px", border: "1px solid var(--border)" }}>
              {["uz", "ru"].map((l) => (
                <button key={l} onClick={() => setLang(l)} style={{
                  padding: "4px 10px", borderRadius: 999, border: "none", cursor: "pointer",
                  fontSize: "0.7rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.04em",
                  background: lang === l ? "var(--navy, #1e3a8a)" : "transparent",
                  color: lang === l ? "white" : "var(--text3)",
                  transition: "all 0.2s",
                }}>{l}</button>
              ))}
            </div>

            {/* Saytga — faqat desktop */}
            <a href="/" className="admin-topbar-link" style={{
              fontSize: "0.8rem", color: "var(--text2)", textDecoration: "none",
              display: "flex", alignItems: "center", gap: 4,
              padding: "6px 10px", borderRadius: 8,
              border: "1.5px solid var(--border)", background: "var(--bg2)",
            }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
              </svg>
              <span className="admin-topbar-label">{t.toSite}</span>
            </a>

            <button onClick={handleLogout} style={{
              fontSize: "0.8rem", color: "#ef4444", display: "flex", alignItems: "center", gap: 4,
              padding: "6px 10px", borderRadius: 8,
              border: "1.5px solid rgba(239,68,68,0.2)", background: "rgba(239,68,68,0.05)", cursor: "pointer",
            }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                <polyline points="16,17 21,12 16,7"/><line x1="21" y1="12" x2="9" y2="12"/>
              </svg>
              <span className="admin-topbar-label">{t.logout}</span>
            </button>
          </div>
        </div>
      </div>

      {/* ── Content ── */}
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "24px 16px 40px" }}>

        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 12, marginBottom: 24 }}>
          {[
            { label: t.totalNews, value: news.length, icon: "📰", color: "var(--accent)" },
            { label: t.blueTag, value: news.filter((n) => n.tagColor === "tag-blue").length, icon: "🔵", color: "var(--accent)" },
            { label: t.greenTag, value: news.filter((n) => n.tagColor === "tag-green").length, icon: "🟢", color: "#10b981" },
            { label: t.lastMonth, value: news.filter((n) => new Date(n.date) >= new Date(Date.now() - 30 * 86400000)).length, icon: "📅", color: "#f59e0b" },
          ].map((s, i) => (
            <div key={i} style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 14, padding: "16px", display: "flex", flexDirection: "column", gap: 5 }}>
              <div style={{ fontSize: 20 }}>{s.icon}</div>
              <div style={{ fontSize: "1.5rem", fontWeight: 800, color: s.color, lineHeight: 1 }}>{s.value}</div>
              <div style={{ fontSize: "0.75rem", color: "var(--text3)" }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Header + Create */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16, gap: 12 }}>
          <div style={{ minWidth: 0 }}>
            <h2 style={{ margin: 0, fontSize: "1.1rem", fontWeight: 700, color: "var(--text1)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{t.newsManage}</h2>
            <p className="admin-manage-desc" style={{ margin: "3px 0 0", fontSize: "0.78rem", color: "var(--text3)" }}>{t.newsManageDesc}</p>
          </div>
          <button onClick={() => setModal({ type: "create" })} style={{
            padding: "10px 16px", borderRadius: 12, border: "none", flexShrink: 0,
            background: "linear-gradient(135deg, #3b82f6, #2563eb)", color: "white",
            fontSize: "0.84rem", fontWeight: 600, cursor: "pointer",
            display: "flex", alignItems: "center", gap: 6,
            boxShadow: "0 4px 14px rgba(59,130,246,0.3)",
            whiteSpace: "nowrap",
          }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
            {t.addNews}
          </button>
        </div>

        {/* Saved toast */}
        {saved && (
          <div style={{ background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.25)", borderRadius: 10, padding: "10px 14px", marginBottom: 16, display: "flex", alignItems: "center", gap: 8, color: "#10b981", fontSize: "0.82rem", fontWeight: 600 }}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22,4 12,14.01 9,11.01"/>
            </svg>
            {t.savedMsg}
          </div>
        )}

        {/* News list */}
        <div style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 16, overflow: "hidden" }}>
          {news.length === 0 ? (
            <div style={{ padding: "50px 20px", textAlign: "center", color: "var(--text3)" }}>
              <div style={{ fontSize: 36, marginBottom: 10 }}>📭</div>
              <div style={{ fontSize: "0.96rem", fontWeight: 600 }}>{t.emptyTitle}</div>
              <div style={{ fontSize: "0.8rem", marginTop: 4 }}>{t.emptyDesc}</div>
            </div>
          ) : news.map((item, idx) => (
            <div key={item.id} style={{ display: "flex", alignItems: "flex-start", gap: 12, padding: "14px 16px", borderBottom: idx < news.length - 1 ? "1px solid var(--border)" : "none" }}>
              {/* Rang chiziq */}
              <div style={{ width: 4, minHeight: 40, borderRadius: 2, background: tagColors[item.tagColor] || "var(--accent)", flexShrink: 0, marginTop: 2, alignSelf: "stretch" }} />

              {/* Content */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4, flexWrap: "wrap" }}>
                  <span style={{ fontSize: "0.7rem", fontWeight: 700, padding: "2px 7px", borderRadius: 5, background: `${tagColors[item.tagColor]}20`, color: tagColors[item.tagColor], whiteSpace: "nowrap" }}>
                    {lang === "uz" ? (item.tagUz || item.tag) : (item.tagRu || item.tag)}
                  </span>
                  <span style={{ fontSize: "0.72rem", color: "var(--text3)", whiteSpace: "nowrap" }}>
                    {formatDate(item.date, lang)}
                  </span>
                </div>
                <div style={{ fontSize: "0.9rem", fontWeight: 600, color: "var(--text1)", marginBottom: 3, lineHeight: 1.35 }}>
                  {lang === "uz" ? item.titleUz : item.titleRu}
                </div>
                <div style={{ fontSize: "0.78rem", color: "var(--text3)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {lang === "uz" ? item.excerptUz : item.excerptRu}
                </div>
              </div>

              {/* Actions */}
              <div style={{ display: "flex", gap: 5, flexShrink: 0 }}>
                <button onClick={() => setModal({ type: "edit", item })} title={t.edit} style={{ width: 32, height: 32, borderRadius: 8, border: "1.5px solid var(--border)", background: "var(--bg2)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--accent)" }}>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                  </svg>
                </button>
                <button onClick={() => setDeleteConfirm(item.id)} title={t.delete} style={{ width: 32, height: 32, borderRadius: 8, border: "1.5px solid rgba(239,68,68,0.2)", background: "rgba(239,68,68,0.05)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "#ef4444" }}>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <polyline points="3,6 5,6 21,6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
                    <path d="M10 11v6M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Create/Edit Modal ── */}
      {modal && (
        <div onClick={() => setModal(null)} className="admin-modal-wrap" style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)", backdropFilter: "blur(4px)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
          <div onClick={(e) => e.stopPropagation()} className="admin-modal-inner" style={{ background: "var(--card)", borderRadius: 20, width: "100%", maxWidth: 580, maxHeight: "90vh", overflowY: "auto", border: "1px solid var(--border)", boxShadow: "0 24px 60px rgba(0,0,0,0.2)", animation: "modalIn 0.22s ease" }}>
            <div style={{ height: 4, background: "linear-gradient(90deg, #3b82f6, #10b981)", borderRadius: "20px 20px 0 0" }} />
            <div style={{ padding: "28px 28px 24px" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
                <h3 style={{ margin: 0, fontSize: "1.1rem", fontWeight: 700, color: "var(--text1)" }}>
                  {modal.type === "create" ? t.createModal : t.editModal}
                </h3>
                <button onClick={() => setModal(null)} style={{ width: 30, height: 30, borderRadius: "50%", border: "1px solid var(--border)", background: "var(--bg2)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--text2)" }}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                  </svg>
                </button>
              </div>
              <NewsForm initial={modal.item} onSave={handleSave} onCancel={() => setModal(null)} t={t} />
            </div>
          </div>
        </div>
      )}

      {/* ── Delete Confirm Modal ── */}
      {deleteConfirm && (
        <div onClick={() => setDeleteConfirm(null)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)", backdropFilter: "blur(4px)", zIndex: 1001, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
          <div onClick={(e) => e.stopPropagation()} style={{ background: "var(--card)", borderRadius: 16, width: "100%", maxWidth: 380, padding: "28px 24px", border: "1px solid var(--border)", boxShadow: "0 24px 60px rgba(0,0,0,0.2)", textAlign: "center", animation: "modalIn 0.2s ease" }}>
            <div style={{ width: 52, height: 52, borderRadius: "50%", background: "rgba(239,68,68,0.1)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2.5">
                <polyline points="3,6 5,6 21,6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
                <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
              </svg>
            </div>
            <h3 style={{ margin: "0 0 8px", fontSize: "1rem", fontWeight: 700, color: "var(--text1)" }}>{t.deleteTitle}</h3>
            <p style={{ margin: "0 0 24px", fontSize: "0.86rem", color: "var(--text2)", lineHeight: 1.5 }}>{t.deleteDesc}</p>
            <div style={{ display: "flex", gap: 10 }}>
              <button onClick={() => setDeleteConfirm(null)} style={{ flex: 1, padding: "10px", borderRadius: 10, border: "1.5px solid var(--border)", background: "transparent", color: "var(--text2)", fontSize: "0.88rem", fontWeight: 600, cursor: "pointer" }}>{t.cancel}</button>
              <button onClick={() => handleDelete(deleteConfirm)} style={{ flex: 1, padding: "10px", borderRadius: 10, border: "none", background: "#ef4444", color: "white", fontSize: "0.88rem", fontWeight: 600, cursor: "pointer" }}>{t.confirmDelete}</button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes modalIn {
          from { opacity: 0; transform: scale(0.94) translateY(12px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }

        /* Desktop: stats 4 ustun, logo to'liq ko'rinadi */
        @media (min-width: 640px) {
          .admin-logo-text { display: block !important; }
          .admin-topbar-link { display: flex !important; }
          .admin-topbar-label { display: inline !important; }
          .admin-manage-desc { display: block !important; }
        }

        /* Mobile: stats 2 ustun, topbar ixcham */
        @media (max-width: 639px) {
          .admin-logo-text { display: none !important; }
          .admin-topbar-label { display: none !important; }
          .admin-topbar-link { padding: 7px !important; }
          .admin-manage-desc { display: none !important; }
        }

        /* Modal mobile fullscreen */
        @media (max-width: 500px) {
          .admin-modal-inner {
            border-radius: 16px 16px 0 0 !important;
            max-height: 95vh !important;
            margin-top: auto !important;
          }
          .admin-modal-wrap {
            align-items: flex-end !important;
            padding: 0 !important;
          }
        }
      `}</style>
    </div>
  );
}

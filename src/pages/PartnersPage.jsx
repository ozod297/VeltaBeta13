import { Link } from "react-router-dom";
import { useApp } from "../context/AppContext";
import { translations } from "../i18n";
import SEO from "../components/SEO";

const benefits = [
  { icon: "💰", uz: "Maxsus narxlar", ru: "Специальные цены", dUz: "Hamkorlar uchun alohida chegirmalar va qulay narx shartlari.", dRu: "Специальные скидки и выгодные ценовые условия для партнёров." },
  { icon: "📢", uz: "Marketing yordami", ru: "Маркетинговая поддержка", dUz: "Reklama materiallari va brendlash bo'yicha to'liq yordam.", dRu: "Полная поддержка рекламными материалами и брендингом." },
  { icon: "👤", uz: "Shaxsiy metpristavitel", ru: "Персональный менеджер", dUz: "Har bir hamkorga shaxsiy tibbiy vakil tayinlanadi.", dRu: "Каждому партнёру назначается персональный медицинский представитель." },
  { icon: "🚚", uz: "Tezkor yetkazish", ru: "Быстрая доставка", dUz: "O'zbekiston bo'ylab 24-48 soat ichida ishonchli yetkazib berish.", dRu: "Доставка по всему Узбекистану за 24-48 часов." },
];

const partners = [
  { n: "Doridarmon", tUz: "Dorixona tarmog'i", tRu: "Сеть аптек", city: "Toshkent", icon: "💊", bg: "#eff6ff" },
  { n: "Hayot Apteka", tUz: "Dorixona", tRu: "Аптека", city: "Samarqand", icon: "🏥", bg: "#f0fdf4" },
  { n: "MedLife Klinika", tUz: "Tibbiyot markazi", tRu: "Медицинский центр", city: "Toshkent", icon: "🏨", bg: "#fffbeb" },
  { n: "Pharmatech Uz", tUz: "Distribyutor", tRu: "Дистрибьютор", city: "Buxoro", icon: "🚚", bg: "#fff1f2" },
  { n: "Salomatlik Plus", tUz: "Xususiy klinika", tRu: "Частная клиника", city: "Namangan", icon: "⚕️", bg: "#faf5ff" },
  { n: "Global Pharma", tUz: "Distribyutor", tRu: "Дистрибьютор", city: "Toshkent", icon: "🌍", bg: "#ecfeff" },
  { n: "Shifobaxsh", tUz: "Dorixona", tRu: "Аптека", city: "Andijon", icon: "💉", bg: "#fef9c3" },
  { n: "Med Center Pro", tUz: "Klinika", tRu: "Клиника", city: "Farg'ona", icon: "🩺", bg: "#f0fdf4" },
];

export default function PartnersPage() {
  const { lang } = useApp();
  const t = translations[lang].partnersPage;

  return (
    <>
      <SEO 
        title={lang === "uz" ? "Hamkorlar" : "Партнёры"} 
        description={lang === "uz" ? "Velta bilan hamkorlik — maxsus narxlar, marketing yordami, tezkor yetkazib berish." : "Партнёрство с Velta — специальные цены, маркетинговая поддержка, быстрая доставка."} 
        url="/partners"
      />

      {/* Hero Header */}
      <section className="page-enter" style={{ background: "linear-gradient(135deg, #1e3a5f, #2d5282)", padding: "clamp(50px, 7vw, 80px) 0 clamp(40px, 5vw, 60px)", overflow: "hidden", position: "relative" }}>
        <div style={{ position: "absolute", bottom: -40, right: -40, width: 200, height: 200, borderRadius: "50%", background: "rgba(244,196,48,0.07)" }}/>
        <div className="container">
          <span className="pill" style={{ background: "rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.85)", marginBottom: 14, display: "inline-flex", fontSize: "0.78rem", padding: "4px 12px", borderRadius: 999, fontWeight: 600 }}>
            {t.badge}
          </span>
          <h1 className="font-display" style={{ fontSize: "clamp(1.8rem, 4.5vw, 2.8rem)", color: "white", fontWeight: 600, marginBottom: 10, marginTop: 0 }}>
            {t.title}
          </h1>
          <p style={{ color: "rgba(255,255,255,0.65)", maxWidth: 520, fontSize: "0.96rem", lineHeight: 1.6, margin: 0 }}>
            {t.subtitle}
          </p>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="section" style={{ background: "var(--bg)", padding: "60px 0" }}>
        <div className="container">
          <span className="pill" style={{ marginBottom: 12, display: "inline-flex" }}>{lang === "uz" ? "Afzalliklar" : "Преимущества"}</span>
          <h2 className="font-display" style={{ fontSize: "clamp(1.4rem, 2.5vw, 2rem)", color: "var(--text1)", marginBottom: 36, marginTop: 0 }}>
            {lang === "uz" ? "Nima uchun Velta bilan?" : "Почему именно Velta?"}
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 20 }}>
            {benefits.map((b, i) => (
              <div key={i} className="card" style={{ padding: 26, background: "var(--card)", border: "1px solid var(--border)", borderRadius: 16, transition: "transform 0.2s" }}
                onMouseOver={e => e.currentTarget.style.transform = "translateY(-4px)"}
                onMouseOut={e => e.currentTarget.style.transform = "none"}
              >
                <div style={{ fontSize: "2rem", marginBottom: 16 }}>{b.icon}</div>
                <h3 style={{ fontSize: "1rem", fontWeight: 700, color: "var(--text1)", marginBottom: 10, marginTop: 0 }}>
                  {lang === "uz" ? b.uz : b.ru}
                </h3>
                <p style={{ fontSize: "0.85rem", color: "var(--text2)", lineHeight: 1.6, margin: 0 }}>
                  {lang === "uz" ? b.dUz : b.dRu}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Partners Grid Section */}
      <section className="section" style={{ background: "var(--bg2)", padding: "60px 0" }}>
        <div className="container">
          <span className="pill" style={{ marginBottom: 12, display: "inline-flex" }}>{lang === "uz" ? "Hamkorlarimiz" : "Наши партнёры"}</span>
          <h2 className="font-display" style={{ fontSize: "clamp(1.4rem, 2.5vw, 2rem)", color: "var(--text1)", marginBottom: 32, marginTop: 0 }}>
            {lang === "uz" ? "Biz bilan ishlayotganlar" : "Работают с нами"}
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 16 }}>
            {partners.map((p, i) => (
              <div key={i} className="card" style={{ padding: "18px 20px", display: "flex", alignItems: "center", gap: 16, background: "var(--card)", border: "1px solid var(--border)", borderRadius: 14, transition: "box-shadow 0.2s" }}
                onMouseOver={e => e.currentTarget.style.boxShadow = "var(--shadow)"}
                onMouseOut={e => e.currentTarget.style.boxShadow = "none"}
              >
                <div style={{ width: 48, height: 48, borderRadius: 12, background: p.bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.5rem", flexShrink: 0 }}>
                  {p.icon}
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: "0.92rem", color: "var(--text1)" }}>{p.n}</div>
                  <div style={{ fontSize: "0.76rem", color: "var(--text3)", marginTop: 2, fontWeight: 500 }}>
                    {(lang === "uz" ? p.tUz : p.tRu)} • {p.city}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section" style={{ background: "var(--bg)", padding: "80px 0" }}>
        <div style={{ maxWidth: 680, margin: "0 auto", textAlign: "center", padding: "0 20px" }}>
          <h2 className="font-display" style={{ fontSize: "clamp(1.5rem, 3vw, 2.2rem)", color: "var(--text1)", marginBottom: 16, marginTop: 0 }}>
            {lang === "uz" ? "Hamkor bo'lishni xohlaysizmi?" : "Хотите стать партнёром?"}
          </h2>
          <p style={{ color: "var(--text2)", marginBottom: 32, lineHeight: 1.7, fontSize: "0.96rem" }}>
            {lang === "uz" ? "Velta bilan strategik hamkorlik qiling va biznesingizni yangi bosqichga olib chiqing." : "Сотрудничайте с Velta и выведите свой бизнес на новый уровень."}
          </p>
          <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap", alignItems: "center" }}>
            {/* SPA Navigation Link o'rnatildi */}
            <Link to="/contact" className="btn btn-accent" style={{ textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 8, padding: "12px 26px", borderRadius: 999, fontWeight: 600 }}>
              {t.becomePartner} 
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </Link>
            <a href="tel:+998712001212" className="btn btn-ghost" style={{ textDecoration: "none", display: "inline-flex", padding: "12px 26px", borderRadius: 999, fontWeight: 600 }}>
              +998 71 200 12 12
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
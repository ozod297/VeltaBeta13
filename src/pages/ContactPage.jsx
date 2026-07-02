  // import { useApp } from "../context/AppContext";
  // import { translations } from "../i18n";
  // import SEO from "../components/SEO";

  // export default function ContactPage() {
  //   const { lang } = useApp();
  //   const t = translations[lang].contact;
  //   const handleSubmit = (e) => { e.preventDefault(); alert(lang === "uz" ? "Muvaffaqiyatli yuborildi! Tez orada murojaat qilamiz." : "Успешно отправлено! Скоро свяжемся с вами."); };

  //   const contacts = [
  //     { icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>, label: t.phone, val: "+998 71 200 12 12\n+998 90 123 45 67" },
  //     { icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>, label: t.email, val: "info@velta.uz" },
  //     { icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>, label: t.address, val: t.addressVal },
  //     { icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>, label: t.hours, val: t.hoursVal },
  //   ];

  //   return (
  //     <>
  //       <SEO title={lang === "uz" ? "Aloqa" : "Контакты"} description={lang === "uz" ? "Velta Pharmaceutical bilan bog'laning — +998 71 200 12 12, info@velta.uz, Toshkent Amir Temur ko'chasi 108." : "Свяжитесь с Velta Pharmaceutical — +998 71 200 12 12, info@velta.uz, Ташкент пр. А.Темура 108."} url="/contact"/>

  //       <section className="page-enter" style={{ background: "linear-gradient(135deg,#1e3a5f,#2d5282)", padding: "80px 0 60px" }}>
  //         <div className="container">
  //           <span className="pill" style={{ background: "rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.85)", marginBottom: 14, display: "inline-flex" }}>{t.badge}</span>
  //           <h1 className="font-display" style={{ fontSize: "clamp(2rem,5vw,3rem)", color: "white", fontWeight: 600 }}>{t.title}</h1>
  //         </div>
  //       </section>

  //       <section className="section" style={{ background: "var(--bg2)" }}>
  //         <div className="container">
  //           <div style={{ display: "grid", gridTemplateColumns: "1fr 1.2fr", gap: 48 }}>
  //             {/* Info */}
  //             <div>
  //               <div style={{ display: "flex", flexDirection: "column", gap: 14, marginBottom: 28 }}>
  //                 {contacts.map((c, i) => (
  //                   <div key={i} style={{ display: "flex", gap: 16, padding: "18px", background: "var(--card)", borderRadius: 14, border: "1px solid var(--border)" }}>
  //                     <div style={{ width: 44, height: 44, borderRadius: 11, background: "rgba(59,130,246,0.08)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{c.icon}</div>
  //                     <div>
  //                       <div style={{ fontSize: "0.7rem", fontWeight: 700, color: "var(--text3)", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 4 }}>{c.label}</div>
  //                       <div style={{ fontSize: "0.9rem", color: "var(--text1)", whiteSpace: "pre-line", lineHeight: 1.6 }}>{c.val}</div>
  //                     </div>
  //                   </div>
  //                 ))}
  //               </div>
  //               <div style={{ borderRadius: 16, overflow: "hidden", border: "1px solid var(--border)", background: "var(--bg2)", height: 200, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 10, color: "var(--text3)" }}>
  //                 <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" opacity="0.35"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
  //                 <span style={{ fontSize: "0.85rem" }}>{lang === "uz" ? "Toshkent, Amir Temur k. 108" : "Ташкент, пр. А.Темура, 108"}</span>
  //               </div>
  //             </div>

  //             {/* Form */}
  //             <div style={{ background: "var(--card)", borderRadius: 20, padding: "36px", border: "1px solid var(--border)", boxShadow: "var(--shadow)" }}>
  //               <h2 style={{ fontSize: "1.15rem", fontWeight: 700, color: "var(--text1)", marginBottom: 6 }}>{t.form.title}</h2>
  //               <p style={{ color: "var(--text3)", fontSize: "0.84rem", marginBottom: 26 }}>{t.form.subtitle}</p>
  //               <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
  //                 <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
  //                   <div><label style={{ fontSize: "0.72rem", fontWeight: 600, color: "var(--text2)", display: "block", marginBottom: 5 }}>{t.form.name}</label><input className="input" placeholder={lang === "uz" ? "Ismingiz" : "Ваше имя"} required/></div>
  //                   <div><label style={{ fontSize: "0.72rem", fontWeight: 600, color: "var(--text2)", display: "block", marginBottom: 5 }}>{t.form.phone}</label><input className="input" placeholder="+998 __ ___ __ __" type="tel"/></div>
  //                 </div>
  //                 <div><label style={{ fontSize: "0.72rem", fontWeight: 600, color: "var(--text2)", display: "block", marginBottom: 5 }}>{t.form.org}</label><input className="input" placeholder={t.form.orgPlaceholder}/></div>
  //                 <div><label style={{ fontSize: "0.72rem", fontWeight: 600, color: "var(--text2)", display: "block", marginBottom: 5 }}>{t.form.message}</label><textarea className="input" rows={5} placeholder={t.form.messagePlaceholder} style={{ resize: "vertical" }}/></div>
  //                 <button type="submit" className="btn btn-accent" style={{ width: "100%", justifyContent: "center", padding: "13px 24px" }}>
  //                   {t.form.send}
  //                   <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/></svg>
  //                 </button>
  //               </form>
  //             </div>
  //           </div>
  //         </div>
  //       </section>

  //       <style>{`@media(max-width:768px){.contact-grid{grid-template-columns:1fr!important}}`}</style>
  //     </>
  //   );
  // }
// /////////////////////////////////////////



import { lazy, Suspense } from 'react'
import { useApp } from "../context/AppContext"
import SEO from "../components/SEO"

// Form leaflet/react-leaflet kutubxonasini olib keladi — alohida chunk sifatida yuklanadi
const Form = lazy(() => import('../components/Form'))

export default function ContactPage() {
  const { lang } = useApp()

  return (
    <>
      {/* Sahifa uchun SEO sozlamalari */}
      <SEO 
        title={lang === "uz" ? "Aloqa" : "Контакты"} 
        description={lang === "uz" ? "Velta Pharmaceutical bilan bog'laning." : "Свяжитесь с Velta Pharmaceutical."} 
        url="/contact"
      />

      {/* Asosiy kontakt bo'limi */}
      <section className="section" style={{ background: "var(--bg)", padding: "60px 0" }}>
        <div className="container">
          {/* Butun boshli 2 ustunli grid dizayni va uning ichidagi barcha ma'lumotlar 
            endi Form komponentining o'ziga ko'chirilgan.
          */}
          <Suspense fallback={<div style={{ minHeight: 400 }} />}>
            <Form />
          </Suspense>
        </div>
      </section>
    </>
  )
}
import { Link } from "react-router-dom";
import { useApp } from "../context/AppContext";
import { translations } from "../i18n";
import logo from "../assets/logo.webp";

export default function Footer() {
  const { lang } = useApp();
  const t = translations[lang].footer;

  return (
    <footer style={{ background: "var(--navy-dark, #152b47)", color: "white" }}>
      <div className="container" style={{ paddingTop: 56, paddingBottom: 32 }}>
        {/* Responsive bo'lishi uchun bu joyga "footer-grid" klassini qo'shdim */}
        <div
          className="footer-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "1.4fr 1fr 1fr 1.2fr",
            gap: 40,
            marginBottom: 48,
          }}
        >
          {/* Brand */}
          <div>
            <img
              src={logo}
              alt="Velta Pharmaceutical"
              style={{
                height: 44,
                width: "auto",
                marginBottom: 16,
                objectFit: "contain",
              }}
            />
            <p
              style={{
                color: "rgba(255,255,255,0.55)",
                fontSize: "0.85rem",
                lineHeight: 1.65,
                maxWidth: 240,
              }}
            >
              {t.desc}
            </p>
            <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
              {[
                // { href: "https://t.me/velta_uz", icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.447 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.333-.373-.12L7.26 13.617l-2.95-.924c-.64-.203-.658-.64.135-.953l11.57-4.461c.537-.194 1.006.131.879.942z"/></svg> },
                {
                  href: "https://www.instagram.com/velta_pharmaceutical/",
                  icon: (
                    <svg
                      width="15"
                      height="15"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                    </svg>
                  ),
                },
                {
                  href: "mailto:info@velta.uz",
                  icon: (
                    <svg
                      width="15"
                      height="15"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                      <polyline points="22,6 12,13 2,6" />
                    </svg>
                  ),
                },
              ].map((s, i) => (
                <a
                  key={i}
                  href={s.href}
                  target="_blank"
                  rel="noreferrer"
                  className="social-icon-anim"
                  style={{
                    width: 34,
                    height: 34,
                    borderRadius: 9,
                    background: "rgba(255,255,255,0.07)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "rgba(255,255,255,0.6)",
                    textDecoration: "none",
                  }}
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Company */}
          <div>
            <h4
              style={{
                fontSize: "0.72rem",
                fontWeight: 700,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: "rgba(255,255,255,0.35)",
                marginBottom: 18,
              }}
            >
              {t.company}
            </h4>
            {[
              { to: "/company", l: t.links.about },
              { to: "/company", l: t.links.career },
              { to: "/partners", l: t.links.partners },
              { to: "/news", l: t.links.news },
            ].map((i) => (
              <Link
                key={i.l}
                to={i.to}
                className="footer-link-anim"
                style={{
                  display: "block",
                  color: "rgba(255,255,255,0.65)",
                  fontSize: "0.875rem",
                  textDecoration: "none",
                  marginBottom: 10,
                }}
              >
                {i.l}
              </Link>
            ))}
          </div>

          {/* Products */}
          <div>
            <h4
              style={{
                fontSize: "0.72rem",
                fontWeight: 700,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: "rgba(255,255,255,0.35)",
                marginBottom: 18,
              }}
            >
              {t.products}
            </h4>
            {[
              { to: "/drugs?cat=painkillers", l: t.links.painkillers },
              { to: "/drugs?cat=antibiotics", l: t.links.antibiotics },
              { to: "/drugs?cat=vitamins", l: t.links.vitamins },
              { to: "/drugs?cat=cardio", l: t.links.cardio },
            ].map((i) => (
              <Link
                key={i.l}
                to={i.to}
                className="footer-link-anim"
                style={{
                  display: "block",
                  color: "rgba(255,255,255,0.65)",
                  fontSize: "0.875rem",
                  textDecoration: "none",
                  marginBottom: 10,
                }}
              >
                {i.l}
              </Link>
            ))}
          </div>

          {/* Contact */}
          <div>
            <h4
              style={{
                fontSize: "0.72rem",
                fontWeight: 700,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: "rgba(255,255,255,0.35)",
                marginBottom: 18,
              }}
            >
              {t.contact}
            </h4>
            {[
              { icon: "📞", v: "+998 90 039 11 80", href: "tel:+998900391180" },
              {
                icon: "✉️",
                v: "olesya.umarova@inbox.ru",
                href: "mailto:olesya.umarova@inbox.ru",
              },
              {
                icon: "📍",
                v:
                  lang === "uz"
                    ? "Sulton ali mashhadi 210"
                    : "Ташкент, пр. А.Темура, 108",
              },
            ].map((c, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  gap: 8,
                  marginBottom: 10,
                  alignItems: "flex-start",
                }}
              >
                <span style={{ fontSize: "0.85rem" }}>{c.icon}</span>
                {c.href ? (
                  <a
                    href={c.href}
                    style={{
                      color: "rgba(255,255,255,0.65)",
                      fontSize: "0.85rem",
                      textDecoration: "none",
                    }}
                  >
                    {c.v}
                  </a>
                ) : (
                  <span
                    style={{
                      color: "rgba(255,255,255,0.65)",
                      fontSize: "0.85rem",
                    }}
                  >
                    {c.v}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Eng pastki qism */}
        <div
          style={{
            borderTop: "1px solid rgba(255,255,255,0.08)",
            paddingTop: 24,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 12,
          }}
        >
          <p style={{ color: "rgba(255,255,255,0.35)", fontSize: "0.78rem" }}>
            {t.rights}
          </p>
          <p style={{ color: "rgba(255,255,255,0.35)", fontSize: "0.78rem" }}>
            {lang === "uz"
              ? "GMP · ISO 9001 · ISO 13485 · WHO-PQ"
              : "GMP · ISO 9001 · ISO 13485 · ВОЗ-ПК"}
          </p>
        </div>
      </div>

      {/* Ortiqcha narsalarni o'zgartirmasdan, fsgaqat responsive moslashuvni mukammallashtirdim */}
      <style>{`
        @media (max-width: 992px) {
          .footer-grid {
            grid-template-columns: 1fr 1fr !important;
            gap: 32px !important;
          }
        }
        @media (max-width: 560px) {
          .footer-grid {
            grid-template-columns: 1fr !important;
            gap: 28px !important;
          }
          footer .container > div:last-child {
            flex-direction: column !important;
            align-items: flex-start !important;
            gap: 8px !important;
          }
        }
      `}</style>
    </footer>
  );
}

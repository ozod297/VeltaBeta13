import React, { useState, useRef } from "react";
import { useApp } from "../context/AppContext";
import { translations } from "../i18n";

// Xarita komponentlari
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Leaflet marker tuzatishlari (Fix)
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
});

export function Form() {
  const { lang } = useApp();
  const t = translations[lang].contact;

  // Form states
  const [formData, setFormData] = useState({
    ism: "",
    telefon: "",
    tashkilot: "",
    xbar: "", // eski koddagi o'zgaruvchi nomi saqlandi
    xabar: "",
  });

  // Xarita holatlari
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [locLoading, setLocLoading] = useState(false); // Lokatsiya aniqlanayotgandagi loading

  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Xarita obyekti (Map instance) ni boshqarish uchun Ref
  const mapRef = useRef(null);

  // Inputlarni kuzatish
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Xarita ichida qo'lda klik qilinganda koordinatani ushlash
  function MapClickHandler() {
    useMapEvents({
      click(e) {
        setSelectedLocation({
          lat: e.latlng.lat,
          lng: e.latlng.lng,
        });
      },
    });
    return null;
  }

  // 📍 Foydalanuvchining ayni damda turgan joyini aniqlash funksiyasi
  const handleDetectCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert(
        lang === "uz"
          ? "Brauzeringiz lokatsiyani qo'llab-quvvatlamaydi"
          : "Ваш браузер не поддерживает геолокацию",
      );
      return;
    }

    setLocLoading(true);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const newLoc = { lat: latitude, lng: longitude };

        setSelectedLocation(newLoc);
        setLocLoading(false);

        // Xaritani topilgan koordinataga silliq ko'chirish (zoom: 16)
        if (mapRef.current) {
          mapRef.current.flyTo([latitude, longitude], 16, {
            animate: true,
            duration: 1.5,
          });
        }
      },
      (error) => {
        console.error("Joylashuvni aniqlashda xato:", error);
        setLocLoading(false);
        alert(
          lang === "uz"
            ? "Lokatsiyangizni aniqlashga ruxsat berilmadi."
            : "Не удалось определить ваше местоположение.",
        );
      },
      { enableHighAccuracy: true, timeout: 10000 },
    );
  };

  // Telegram botga yuborish — token va chat ID'lar faqat serverda (api/contact.js) saqlanadi
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.ism,
          phone: `+998 ${formData.telefon}`,
          org: formData.tashkilot,
          message: formData.xabar,
          lang,
          location: selectedLocation,
        }),
      });
      const data = await res.json().catch(() => null);

      if (res.ok && data?.ok) {
        setIsSuccess(true);
        setFormData({
          ism: "",
          telefon: "",
          tashkilot: "",
          xabar: "",
          xbar: "",
        });
        setSelectedLocation(null);

        setTimeout(() => setIsSuccess(false), 3000);
      }
    } catch (error) {
      console.error("Formani yuborishda xatolik:", error);
    } finally {
      setLoading(false);
    }
  };

  const contacts = [
    {
      icon: (
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="var(--accent)"
          strokeWidth="2"
        >
          <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
        </svg>
      ),
      label: t.phone,
      val: "+998 90 020 22 44",
    },
    {
      icon: (
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="var(--accent)"
          strokeWidth="2"
        >
          <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
          <polyline points="22,6 12,13 2,6" />
        </svg>
      ),
      label: t.email,
      val: "info@velta.uz",
    },
    {
      icon: (
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="var(--accent)"
          strokeWidth="2"
        >
          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
          <circle cx="12" cy="10" r="3" />
        </svg>
      ),
      label: t.address,
      val: t.addressVal,
    },
    {
      icon: (
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="var(--accent)"
          strokeWidth="2"
        >
          <circle cx="12" cy="12" r="10" />
          <polyline points="12 6 12 12 16 14" />
        </svg>
      ),
      label: t.hours,
      val: t.hoursVal,
    },
  ];

  return (
    <div>
      <section className="section" style={{ background: "var(--bg)" }}>
        <div className="container">
          <div
            className="contact-grid"
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1.2fr",
              gap: 48,
            }}
          >
            <div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 14,
                  marginBottom: 28,
                }}
              >
                {contacts.map((c, i) => (
                  <div
                    key={i}
                    style={{
                      display: "flex",
                      gap: 16,
                      padding: "18px",
                      background: "var(--card)",
                      borderRadius: 14,
                      border: "1px solid var(--border)",
                    }}
                  >
                    <div
                      style={{
                        width: 44,
                        height: 44,
                        borderRadius: 11,
                        background: "rgba(59,130,246,0.08)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                      }}
                    >
                      {c.icon}
                    </div>
                    <div>
                      <div
                        style={{
                          fontSize: "0.7rem",
                          fontWeight: 700,
                          color: "var(--text3)",
                          textTransform: "uppercase",
                          letterSpacing: "0.07em",
                          marginBottom: 4,
                        }}
                      >
                        {c.label}
                      </div>
                      <div
                        style={{
                          fontSize: "0.9rem",
                          color: "var(--text1)",
                          whiteSpace: "pre-line",
                          lineHeight: 1.6,
                        }}
                      >
                        {c.val}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Forma qismi */}
            <div
              style={{
                background: "var(--card)",
                borderRadius: 20,
                padding: "36px",
                border: "1px solid var(--border)",
                boxShadow: "var(--shadow)",
              }}
            >
              <h2
                style={{
                  fontSize: "1.15rem",
                  fontWeight: 700,
                  color: "var(--text1)",
                  marginBottom: 6,
                }}
              >
                {t.form.title}
              </h2>
              <p
                style={{
                  color: "var(--text3)",
                  fontSize: "0.84rem",
                  marginBottom: 26,
                }}
              >
                {t.form.subtitle}
              </p>

              <form
                onSubmit={handleSubmit}
                style={{ display: "flex", flexDirection: "column", gap: 14 }}
              >
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: 12,
                  }}
                  className="form-row-mobile"
                >
                  <div>
                    <label
                      style={{
                        fontSize: "0.72rem",
                        fontWeight: 600,
                        color: "var(--text2)",
                        display: "block",
                        marginBottom: 5,
                      }}
                    >
                      {t.form.name}
                    </label>
                    <input
                      type="text"
                      name="ism"
                      value={formData.ism}
                      onChange={handleChange}
                      className="input"
                      placeholder={lang === "uz" ? "Ismingiz" : "Ваше имя"}
                      required
                    />
                  </div>

                  <div>
                    <label
                      style={{
                        fontSize: "0.72rem",
                        fontWeight: 600,
                        color: "var(--text2)",
                        display: "block",
                        marginBottom: 5,
                      }}
                    >
                      {t.form.phone}
                    </label>
                    <div
                      style={{
                        position: "relative",
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      <span
                        style={{
                          position: "absolute",
                          left: "12px",
                          color: "var(--text2)",
                          fontSize: "0.85rem",
                          fontWeight: 500,
                        }}
                      >
                        +998
                      </span>
                      <input
                        type="text"
                        name="telefon"
                        value={formData.telefon}
                        onChange={handleChange}
                        className="input"
                        style={{ paddingLeft: "52px", width: "100%" }}
                        placeholder="_________"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label
                    style={{
                      fontSize: "0.72rem",
                      fontWeight: 600,
                      color: "var(--text2)",
                      display: "block",
                      marginBottom: 5,
                    }}
                  >
                    {t.form.org}
                  </label>
                  <input
                    type="text"
                    name="tashkilot"
                    value={formData.tashkilot}
                    onChange={handleChange}
                    className="input"
                    placeholder={t.form.orgPlaceholder}
                  />
                </div>

                {/* 🗺️ INTERAKTIV XARITA */}
                <div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: 6,
                    }}
                  >
                    <label
                      style={{
                        fontSize: "0.72rem",
                        fontWeight: 600,
                        color: "var(--text2)",
                      }}
                    >
                      {lang === "uz"
                        ? "Yetkazib berish manzilini xaritada belgilang:"
                        : "Укажите адрес доставки на карте:"}
                    </label>

                    <button
                      type="button"
                      onClick={handleDetectCurrentLocation}
                      disabled={locLoading}
                      style={{
                        background: "none",
                        border: "none",
                        color: "#3b82f6",
                        fontSize: "0.75rem",
                        fontWeight: 600,
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: "4px",
                      }}
                    >
                      📡{" "}
                      {locLoading
                        ? lang === "uz"
                          ? "Aniqlanmoqda..."
                          : "Поиск..."
                        : lang === "uz"
                          ? "Mening joylashuvim"
                          : "Моё местоположение"}
                    </button>
                  </div>

                  <div
                    style={{
                      height: "220px",
                      width: "100%",
                      borderRadius: "12px",
                      overflow: "hidden",
                      border: "1px solid var(--border)",
                      zIndex: 1,
                    }}
                  >
                    <MapContainer
                      center={[41.311081, 69.240562]}
                      zoom={12}
                      style={{ height: "100%", width: "100%" }}
                      ref={mapRef}
                    >
                      <TileLayer
                        attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                      />
                      <MapClickHandler />
                      {selectedLocation && (
                        <Marker
                          position={[
                            selectedLocation.lat,
                            selectedLocation.lng,
                          ]}
                        />
                      )}
                    </MapContainer>
                  </div>
                  {selectedLocation && (
                    <span
                      style={{
                        fontSize: "0.75rem",
                        color: "#22c55e",
                        display: "block",
                        marginTop: "6px",
                      }}
                    >
                      ✓{" "}
                      {lang === "uz"
                        ? "Manzil muvaffaqiyatli tanlandi!"
                        : "Адрес успешно выбран!"}
                    </span>
                  )}
                </div>

                <div>
                  <label
                    style={{
                      fontSize: "0.72rem",
                      fontWeight: 600,
                      color: "var(--text2)",
                      display: "block",
                      marginBottom: 5,
                    }}
                  >
                    {t.form.message}
                  </label>
                  <textarea
                    name="xabar"
                    value={formData.xabar}
                    onChange={handleChange}
                    className="input"
                    rows={3}
                    placeholder={t.form.messagePlaceholder}
                    style={{ resize: "vertical" }}
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="btn"
                  style={{
                    width: "100%",
                    justifyContent: "center",
                    padding: "13px 24px",
                    gap: "8px",
                    cursor: loading ? "not-allowed" : "pointer",
                    transition: "all 0.3s ease",
                    background: isSuccess ? "#22c55e" : "#1E3A5F",
                    color: "white",
                  }}
                >
                  {loading ? (
                    <span>
                      {lang === "uz" ? "Yuborilmoqda..." : "Отправка..."}
                    </span>
                  ) : isSuccess ? (
                    <span
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                      }}
                    >
                      {lang === "uz"
                        ? "Muvaffaqiyatli yuborildi!"
                        : "Успешно отправлено!"}{" "}
                      ✅
                    </span>
                  ) : (
                    <>
                      {t.form.send}
                      <svg
                        width="15"
                        height="15"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        style={{
                          transform: "rotate(45deg)",
                          marginLeft: "4px",
                        }}
                      >
                        <path d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                      </svg>
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      <style>{`
        @media (max-width: 768px) {
          .contact-grid {
            grid-template-columns: 1fr !important;
            gap: 24px !important;
          }
          .form-row-mobile {
            grid-template-columns: 1fr !important;
            gap: 14px !important;
          }
        }
      `}</style>
    </div>
  );
}

export default Form;

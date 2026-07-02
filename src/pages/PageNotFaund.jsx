import { useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";

const PageNotFaund = () => {
  const navigate = useNavigate();
  const { lang } = useApp();

  const t = {
    uz: {
      code: "404",
      title: "Sahifa topilmadi",
      desc: "Kechirasiz, siz qidirayotgan sahifa mavjud emas yoki ko'chirilgan bo'lishi mumkin.",
      home: "Bosh sahifaga",
      back: "Orqaga",
    },
    ru: {
      code: "404",
      title: "Страница не найдена",
      desc: "Извините, страница, которую вы ищете, не существует или была перемещена.",
      home: "На главную",
      back: "Назад",
    },
  };

  const tx = t[lang] || t.uz;

  return (
    <div
      style={{
        minHeight: "80vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "var(--bg)",
        padding: "40px 20px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Background dekor */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          background:
            "radial-gradient(ellipse at 30% 20%, rgba(59,130,246,0.06) 0%, transparent 55%), radial-gradient(ellipse at 75% 80%, rgba(16,185,129,0.05) 0%, transparent 55%)",
        }}
      />

      {/* Floating circles */}
      <div
        style={{
          position: "absolute",
          top: "12%",
          left: "8%",
          width: 80,
          height: 80,
          borderRadius: "50%",
          border: "1.5px solid var(--border)",
          opacity: 0.5,
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: "15%",
          right: "10%",
          width: 120,
          height: 120,
          borderRadius: "50%",
          border: "1.5px solid var(--border)",
          opacity: 0.4,
        }}
      />
      <div
        style={{
          position: "absolute",
          top: "55%",
          left: "5%",
          width: 40,
          height: 40,
          borderRadius: "50%",
          background: "rgba(59,130,246,0.08)",
          border: "1px solid rgba(59,130,246,0.15)",
        }}
      />

      {/* Main card */}
      <div
        style={{
          position: "relative",
          zIndex: 1,
          textAlign: "center",
          maxWidth: 480,
          width: "100%",
          background: "var(--card)",
          border: "1px solid var(--border)",
          borderRadius: 24,
          padding: "52px 40px 44px",
          boxShadow: "0 20px 60px rgba(0,0,0,0.07)",
        }}
      >
        {/* Yuqori aksent */}
        <div
          style={{
            height: 4,
            background: "linear-gradient(90deg, #3b82f6, #10b981)",
            borderRadius: "24px 24px 0 0",
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
          }}
        />

        {/* 404 raqam */}
        <div style={{ position: "relative", marginBottom: 8 }}>
          <div
            style={{
              fontSize: "clamp(5rem, 18vw, 7.5rem)",
              fontWeight: 900,
              lineHeight: 1,
              background: "linear-gradient(135deg, #3b82f6 0%, #10b981 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              letterSpacing: "-4px",
              userSelect: "none",
            }}
          >
            404
          </div>
          {/* Soya */}
          <div
            style={{
              position: "absolute",
              bottom: -4,
              left: "50%",
              transform: "translateX(-50%)",
              width: "60%",
              height: 20,
              background:
                "radial-gradient(ellipse, rgba(59,130,246,0.15) 0%, transparent 70%)",
              filter: "blur(6px)",
            }}
          />
        </div>

        {/* Ikonka */}
        <div
          style={{
            width: 64,
            height: 64,
            borderRadius: 16,
            background:
              "linear-gradient(135deg, rgba(59,130,246,0.1), rgba(16,185,129,0.08))",
            border: "1.5px solid rgba(59,130,246,0.15)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 20px",
          }}
        >
          <svg
            width="28"
            height="28"
            viewBox="0 0 24 24"
            fill="none"
            stroke="url(#grad404)"
            strokeWidth="1.8"
            strokeLinecap="round"
          >
            <defs>
              <linearGradient id="grad404" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#3b82f6" />
                <stop offset="100%" stopColor="#10b981" />
              </linearGradient>
            </defs>
            <circle cx="11" cy="11" r="8" />
            <path d="M21 21l-4.35-4.35" />
            <line x1="11" y1="8" x2="11" y2="11" />
            <line x1="11" y1="14" x2="11.01" y2="14" />
          </svg>
        </div>

        {/* Sarlavha */}
        <h1
          style={{
            margin: "0 0 12px",
            fontSize: "clamp(1.2rem, 4vw, 1.5rem)",
            fontWeight: 700,
            color: "var(--text1)",
            lineHeight: 1.3,
          }}
        >
          {tx.title}
        </h1>

        {/* Tavsif */}
        <p
          style={{
            margin: "0 0 32px",
            fontSize: "0.9rem",
            color: "var(--text2)",
            lineHeight: 1.65,
          }}
        >
          {tx.desc}
        </p>

        {/* Tugmalar */}
        <div
          style={{
            display: "flex",
            gap: 12,
            justifyContent: "center",
            flexWrap: "wrap",
          }}
        >
          <button
            onClick={() => navigate("/")}
            style={{
              padding: "12px 28px",
              borderRadius: 12,
              border: "none",
              cursor: "pointer",
              background: "linear-gradient(135deg, #3b82f6, #2563eb)",
              color: "white",
              fontSize: "0.9rem",
              fontWeight: 600,
              display: "flex",
              alignItems: "center",
              gap: 7,
              boxShadow: "0 4px 16px rgba(59,130,246,0.3)",
              transition: "transform 0.15s, box-shadow 0.15s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-1px)";
              e.currentTarget.style.boxShadow =
                "0 6px 20px rgba(59,130,246,0.4)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow =
                "0 4px 16px rgba(59,130,246,0.3)";
            }}
          >
            <svg
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
            >
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
              <polyline points="9,22 9,12 15,12 15,22" />
            </svg>
            {tx.home}
          </button>

          <button
            onClick={() => navigate(-1)}
            style={{
              padding: "12px 24px",
              borderRadius: 12,
              cursor: "pointer",
              border: "1.5px solid var(--border)",
              background: "var(--bg2)",
              color: "var(--text2)",
              fontSize: "0.9rem",
              fontWeight: 600,
              display: "flex",
              alignItems: "center",
              gap: 7,
              transition: "border-color 0.15s, color 0.15s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "var(--accent)";
              e.currentTarget.style.color = "var(--accent)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "var(--border)";
              e.currentTarget.style.color = "var(--text2)";
            }}
          >
            <svg
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
            >
              <path d="M19 12H5M12 5l-7 7 7 7" />
            </svg>
            {tx.back}
          </button>
        </div>

        {/* Pastki dekor nuqtalar */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: 6,
            marginTop: 28,
          }}
        >
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              style={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                background:
                  i === 1 ? "#3b82f6" : i === 2 ? "#10b981" : "var(--border)",
                opacity: i === 3 ? 0.4 : 1,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default PageNotFaund;

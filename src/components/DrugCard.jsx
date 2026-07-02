import { Link } from "react-router-dom";
import { useApp } from "../context/AppContext";
import { translations } from "../i18n";

function PillSVG({ color, shape }) {
  if (shape === "capsule") {
    return (
      <svg viewBox="0 0 100 44" width="80" height="35">
        <rect
          x="2"
          y="2"
          width="96"
          height="40"
          rx="20"
          fill={color}
          opacity="0.85"
        />
        <rect
          x="2"
          y="2"
          width="48"
          height="40"
          rx="20"
          fill={color}
          opacity="0.5"
        />
        <line
          x1="50"
          y1="4"
          x2="50"
          y2="40"
          stroke="white"
          strokeWidth="1.5"
          opacity="0.6"
        />
      </svg>
    );
  }
  if (shape === "oval") {
    return (
      <svg viewBox="0 0 110 56" width="90" height="46">
        <ellipse cx="55" cy="28" rx="52" ry="26" fill={color} opacity="0.85" />
        <line
          x1="12"
          y1="28"
          x2="98"
          y2="28"
          stroke="white"
          strokeWidth="2"
          opacity="0.5"
        />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 80 80" width="68" height="68">
      <circle cx="40" cy="40" r="38" fill={color} opacity="0.85" />
      <line
        x1="10"
        y1="40"
        x2="70"
        y2="40"
        stroke="white"
        strokeWidth="2.5"
        opacity="0.5"
      />
    </svg>
  );
}

export default function DrugCard({ drug }) {
  const { lang } = useApp();
  const t = translations[lang].products;

  const currentTag = lang === "uz" ? drug.tagUz : drug.tagRu;
  const currentForm = lang === "uz" ? drug.formUz : drug.formRu;
  const currentQuantity = lang === "uz" ? drug.quantityUz : drug.quantityRu;
  const currencyText = lang === "uz" ? "so'm" : "сум";

  return (
    <article
      className="card card-lift"
      style={{ overflow: "hidden", display: "flex", flexDirection: "column" }}
    >
      {/* Rasm yoki SVG — zoom effekti */}
      <Link
        to={`/drugs/${drug.slug}`}
        style={{ textDecoration: "none", display: "block" }}
      >
        <div
          className="drug-img-wrap"
          style={{
            background: drug.bgColor,
            padding: "28px 16px 20px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            minHeight: 120,
            position: "relative",
          }}
        >
          {drug.top && (
            <span
              style={{
                position: "absolute",
                top: 10,
                right: 10,
                background: "#f4c430",
                color: "#92400e",
                fontSize: "0.65rem",
                fontWeight: 800,
                padding: "2px 8px",
                borderRadius: 999,
                textTransform: "uppercase",
                letterSpacing: "0.08em",
              }}
            >
              TOP
            </span>
          )}
          {drug.image ? (
            <img
              src={drug.image}
              alt={drug.name}
              style={{
                width: "100%",
                height: 100,
                objectFit: "contain",
                borderRadius: 8,
              }}
            />
          ) : (
            <PillSVG color={drug.pillColor} shape={drug.shape} />
          )}
        </div>
      </Link>

      {/* Ma'lumotlar */}
      <div
        style={{
          padding: "14px 16px 16px",
          flex: 1,
          display: "flex",
          flexDirection: "column",
        }}
      >
        {currentTag && (
          <span
            className={`tag ${drug.tagColor}`}
            style={{ marginBottom: 8, alignSelf: "flex-start" }}
          >
            {currentTag}
          </span>
        )}
        <Link to={`/drugs/${drug.slug}`} style={{ textDecoration: "none" }}>
          <h3
            style={{
              fontSize: "0.93rem",
              fontWeight: 700,
              color: "var(--text1)",
              marginBottom: 2,
              lineHeight: 1.3,
            }}
          >
            {drug.name}
          </h3>
          <p
            style={{
              fontSize: "0.76rem",
              color: "var(--text3)",
              marginBottom: "auto",
            }}
          >
            {currentForm} · {currentQuantity}
          </p>
        </Link>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginTop: 12,
          }}
        >
          <span
            style={{ fontSize: "1rem", fontWeight: 700, color: "var(--text1)" }}
          >
            {drug.price}{" "}
            <span
              style={{
                fontSize: "0.68rem",
                color: "var(--text3)",
                fontWeight: 400,
              }}
            >
              {currencyText}
            </span>
          </span>

          <Link
            to={`/drugs/${drug.slug}`}
            style={{
              width: 32,
              height: 32,
              borderRadius: 9,
              background: "var(--navy)",
              color: "white",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              textDecoration: "none",
              flexShrink: 0,
              transition: "background 0.2s, transform 0.2s",
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.background = "var(--navy-light)";
              e.currentTarget.style.transform = "scale(1.12)";
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = "var(--navy)";
              e.currentTarget.style.transform = "scale(1)";
            }}
          >
            <svg
              width="13"
              height="13"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
            >
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </article>
  );
}

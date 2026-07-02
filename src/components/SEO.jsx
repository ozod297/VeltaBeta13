import { useEffect } from "react";

export default function SEO({ title, description, keywords, image, url, type = "website" }) {
  const siteName = "Velta Pharmaceutical";
  const defaultDesc = "Velta — O'zbekistonning yetakchi farmatsevtika kompaniyasi. GMP va ISO sertifikatlangan sifatli dori-darmonlar.";
  const defaultKeywords = "velta pharmaceutical, dori, farmatsevtika, uzbekistan, GMP, ISO, paracetamol, ibuprofen, antibiotik, vitamin";
  
  const fullTitle = title ? `${title} | ${siteName}` : siteName;
  const desc = description || defaultDesc;
  const pageUrl = url ? `https://velta.uz${url}` : "https://velta.uz";
  const ogImage = image || "https://velta.uz/og-image.jpg";

  useEffect(() => {
    // 1. Sarlavhani o'rnatish
    const previousTitle = document.title;
    document.title = fullTitle;

    // 2. Metataglarni boshqarish yordamchi funksiyasi
    const setMeta = (name, content, attr = "name") => {
      let el = document.querySelector(`meta[${attr}="${name}"]`);
      let isNew = false;
      
      if (!el) { 
        el = document.createElement("meta"); 
        el.setAttribute(attr, name); 
        document.head.appendChild(el);
        isNew = true;
      }
      
      const previousContent = el.getAttribute("content");
      el.setAttribute("content", content);

      // Sahifa o'zgarganda eski holatni qaytarish uchun ma'lumot saqlaymiz
      return { el, isNew, previousContent };
    };

    // Metataglarni o'rnatish va ularning eski qiymatlarini massivda saqlash
    const trackMetas = [
      setMeta("description", desc),
      setMeta("keywords", keywords || defaultKeywords),
      setMeta("author", siteName),
      setMeta("robots", "index, follow"),
      setMeta("theme-color", "#1e3a5f"),

      // Open Graph
      setMeta("og:title", fullTitle, "property"),
      setMeta("og:description", desc, "property"),
      setMeta("og:image", ogImage, "property"),
      setMeta("og:url", pageUrl, "property"),
      setMeta("og:type", type, "property"),
      setMeta("og:site_name", siteName, "property"),
      setMeta("og:locale", "uz_UZ", "property"),

      // Twitter Card
      setMeta("twitter:card", "summary_large_image"),
      setMeta("twitter:title", fullTitle),
      setMeta("twitter:description", desc),
      setMeta("twitter:image", ogImage)
    ];

    // 3. Canonical havolasini boshqarish
    let canonical = document.querySelector("link[rel='canonical']");
    let isCanonicalNew = false;
    let previousCanonicalHref = "";

    if (!canonical) { 
      canonical = document.createElement("link"); 
      canonical.rel = "canonical"; 
      document.head.appendChild(canonical);
      isCanonicalNew = true;
    } else {
      previousCanonicalHref = canonical.href;
    }
    canonical.href = pageUrl;

    // 4. JSON-LD strukturaviy ma'lumotlarini o'rnatish
    const existingLd = document.getElementById("ld-json");
    if (existingLd) existingLd.remove();

    const ld = document.createElement("script");
    ld.id = "ld-json"; 
    ld.type = "application/ld+json";
    ld.text = JSON.stringify({
      "@context": "https://schema.org",
      "@type": type === "article" ? "Article" : "Organization",
      "name": siteName,
      "url": "https://velta.uz",
      "logo": "https://velta.uz/logo.jpg",
      "description": defaultDesc,
      "address": { 
        "@type": "PostalAddress", 
        "addressLocality": "Toshkent", 
        "addressCountry": "UZ" 
      },
      "contactPoint": { 
        "@type": "ContactPoint", 
        "telephone": "+998-71-200-12-12", 
        "contactType": "customer service" 
      },
      "sameAs": ["https://t.me/velta_uz", "https://instagram.com/velta_uz"]
    });
    document.head.appendChild(ld);

    // ── CLEANUP (TOZALASH) FUNKSIYASI ──
    // Komponent unmount bo'lganda (sahifa o'zgarganda) DOM tozaligini saqlaydi
    return () => {
      document.title = previousTitle;

      // Metataglarni tozalash yoki eski holatiga qaytarish
      trackMetas.forEach(({ el, isNew, previousContent }) => {
        if (isNew) {
          el.remove();
        } else if (previousContent !== null) {
          el.setAttribute("content", previousContent);
        }
      });

      // Canonical linkni tozalash
      if (isCanonicalNew) {
        canonical.remove();
      } else {
        canonical.href = previousCanonicalHref;
      }

      // JSON-LD ni o'chirish
      const scriptToDelete = document.getElementById("ld-json");
      if (scriptToDelete) scriptToDelete.remove();
    };
  }, [fullTitle, desc, keywords, ogImage, pageUrl, type]);

  return null;
}
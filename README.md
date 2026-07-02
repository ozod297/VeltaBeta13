# Velta Pharmaceutical — React + Vite + Tailwind v4

O'zbekiston farmatsevtika kompaniyasi uchun to'liq web loyiha.

## 🚀 Ishga tushirish

```bash
npm install
npm run dev        # development
npm run build      # production build
npm run preview    # preview build
```

## ✨ Asosiy xususiyatlar

| Xususiyat | Tavsif |
|-----------|--------|
| 🌐 UZ / RU | To'liq ikki tilli interfeys |
| 🌙 Dark / Light mode | localStorage'da saqlanadi |
| 📸 Dori rasmlari | Har bir doriga rasm qo'shish / o'chirish (localStorage) |
| 🔍 SEO | Open Graph, Twitter Card, JSON-LD Schema |
| 📱 Responsive | Mobile, tablet, desktop |
| 🔎 Qidiruv | Dorilar nomi bo'yicha real-time qidiruv |
| 🗂 Kategoriyalar | 7 ta kategoriya filtri |
| ⚡ Vite 8 | Tezkor build va HMR |

## 📸 Dori rasmini qo'shish

**Catalog sahifasida:**
1. "Rasm qo'shish" tugmasini bosing (tahrirlash rejimi yoqiladi)
2. Dori kartochkasidagi 📷 tugmani bosing
3. Galereya/fotodan rasm tanlang
4. Rasm avtomatik saqlanadi

**Dori detail sahifasida:**
- "Rasm qo'shish" tugmasini bosing — rasm shu sahifada ham ko'rinadi

> Rasmlar `localStorage`'da saqlanadi. Brauzer tozalanmasa, rasm saqlanib qoladi.

## 📁 Loyiha tuzilmasi

```
src/
├── components/
│   ├── Navbar.jsx       # Sticky navbar (logo, lang, dark, burger)
│   ├── Footer.jsx       # Footer with logo & links
│   ├── DrugCard.jsx     # Dori kartochkasi (rasm yoki pill SVG)
│   └── SEO.jsx          # SEO meta tags + JSON-LD
├── context/
│   └── AppContext.jsx   # Lang + Dark mode state
├── pages/
│   ├── HomePage.jsx     # Hero, stats, about, catalog, certs, testimonials
│   ├── DrugsPage.jsx    # Katalog + rasm yuklash
│   ├── DrugDetailPage.jsx # Dori detail + rasm yuklash
│   ├── CompanyPage.jsx  # Haqida, timeline, jamoa, sertifikatlar
│   ├── NewsPage.jsx     # Yangiliklar
│   ├── PartnersPage.jsx # Hamkorlar + CTA
│   └── ContactPage.jsx  # Aloqa forma
├── data.js              # Dorilar, xabarlar, sertifikatlar + image helpers
├── i18n.js              # UZ / RU tarjimalar
└── index.css            # Tailwind v4 + CSS variables (light/dark)
```

## 🎨 Ranglar (CSS Variables)

```css
--navy: #1e3a5f       /* asosiy qoʻngʻir-ko'k */
--accent: #3b82f6     /* ko'k accent */
--gold: #f4c430       /* sariq (logo rangi) */
--bg: #f8fafc         /* fon (ochiq) */
--card: #ffffff       /* karta foni */
```

## 🔎 SEO

Har bir sahifada:
- `<title>` va `<meta description>` dinamik
- Open Graph (og:title, og:description, og:image)
- Twitter Card
- JSON-LD Organization schema
- Canonical URL
- robots: index, follow

## 🛠 Texnologiyalar

- React 19 + Vite 8
- Tailwind CSS v4 (`@tailwindcss/vite`)
- React Router v7
- Inter + Playfair Display (Google Fonts)

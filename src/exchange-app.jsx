import { useState, useRef, useEffect } from "react";
import { Home, Search, Clock, MessageSquare, User, Bell } from "lucide-react";

// ─── DATA ────────────────────────────────────────────────────────────────────

const CATEGORIES = [
  { id: "home", label: "Home & Garden", icon: "🏡", color: "#E85D3A" },
  { id: "tech", label: "Tech & Digital", icon: "💻", color: "#4B8EF0" },
  { id: "food", label: "Food & Baking", icon: "🍞", color: "#E8854A" },
  { id: "care", label: "Care & Childcare", icon: "🤝", color: "#C47FD5" },
  { id: "creative", label: "Creative & Art", icon: "🎨", color: "#E85C7A" },
  { id: "trades", label: "Trades & Labor", icon: "🔧", color: "#F0B429" },
  { id: "wellness", label: "Health & Wellness", icon: "🌿", color: "#56C0A6" },
  { id: "education", label: "Teaching & Tutoring", icon: "📚", color: "#7B8FE8" },
  { id: "transport", label: "Transport & Errands", icon: "🚗", color: "#E8A84A" },
  { id: "other", label: "Other", icon: "✨", color: "#A0A0B0" },
];

// Inline SVG placeholders — encodeURIComponent the full string to avoid data URI issues
function makePlaceholder(color, label, variant = 0) {
  const bg = ["#f7f4ef","#f0ede6","#e8e4dc","#ede9e0","#f4f1eb"][variant % 5];
  const initials = label.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();
  const svg = [
    '<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400">',
    `<rect width="600" height="400" fill="${bg}"/>`,
    `<circle cx="300" cy="170" r="90" fill="${color}" opacity="0.18"/>`,
    `<text x="300" y="200" text-anchor="middle" dominant-baseline="middle" font-size="72" font-family="Plus Jakarta Sans, sans-serif" fill="${color}" opacity="0.7">${initials}</text>`,
    `<text x="300" y="268" text-anchor="middle" font-size="16" font-family="Plus Jakarta Sans, sans-serif" fill="#777">${label}</text>`,
    `<text x="300" y="292" text-anchor="middle" font-size="11" font-family="Plus Jakarta Sans, sans-serif" fill="#bbb">Photo ${variant + 1}</text>`,
    '</svg>'
  ].join("");
  return "data:image/svg+xml," + encodeURIComponent(svg);
}

const LISTING_PHOTOS = null; // unused — photos inlined below

const LISTINGS = [
  { id: 1, name: "Maria T.", avatar: "MT", category: "food", title: "Homemade Sourdough Bread", desc: "Fresh baked weekly. Organic ingredients, various flavors.", type: "goods", rating: 4.9, trades: 23,
    neighbourhood: "South Market", mapPos: { x: 45, y: 215 },
    photos: [0,1,2].map(i => makePlaceholder("#E8854A","Sourdough Bread",i)) },
  { id: 2, name: "James K.", avatar: "JK", category: "tech", title: "Web & App Development", desc: "10+ years exp. React, mobile apps, bug fixes, full builds.", type: "service", rating: 5.0, trades: 41,
    accountType: "business", businessName: "Kellar Digital", businessType: "Freelancer / Contractor",
    neighbourhood: "Midtown", mapPos: { x: 148, y: 40 },
    socials: { linkedin: "linkedin.com/in/jameskellar", website: "kellardigital.com" }, socialsPublic: true,
    photos: [0,1].map(i => makePlaceholder("#4B8EF0","Web Development",i)) },
  { id: 3, name: "Priya S.", avatar: "PS", category: "care", title: "Experienced Nanny", desc: "Certified, 8 years with children 0–10. References available.", type: "service", rating: 4.8, trades: 17,
    neighbourhood: "East Side", mapPos: { x: 322, y: 110 },
    photos: [0].map(i => makePlaceholder("#C47FD5","Childcare",i)) },
  { id: 4, name: "Tom W.", avatar: "TW", category: "trades", title: "Licensed Electrician", desc: "Residential & commercial. Fully insured.", type: "service", rating: 4.7, trades: 56,
    accountType: "business", businessName: "Watts Up Electric", businessType: "Sole Trader",
    neighbourhood: "Downtown", mapPos: { x: 148, y: 110 },
    socials: { facebook: "facebook.com/wattsupelectric", yelp: "yelp.com/biz/watts-up-electric" }, socialsPublic: true,
    photos: [0,1].map(i => makePlaceholder("#F0B429","Electrician",i)) },
  { id: 5, name: "Ling C.", avatar: "LC", category: "creative", title: "Portrait Painting", desc: "Oil & watercolor, custom commissions. Ships worldwide.", type: "service", rating: 5.0, trades: 12,
    accountType: "business", businessName: "Ling Chen Art", businessType: "Sole Trader",
    neighbourhood: "Arts District", mapPos: { x: 245, y: 215 },
    socials: { instagram: "instagram.com/lingchenart", website: "lingchenart.com" }, socialsPublic: true,
    photos: [0,1,2,3].map(i => makePlaceholder("#E85C7A","Portrait Painting",i)) },
  { id: 6, name: "Aisha M.", avatar: "AM", category: "wellness", title: "Yoga & Meditation Classes", desc: "Beginner to advanced. In-person or online. 200hr certified.", type: "service", rating: 4.9, trades: 38,
    accountType: "business", businessName: "Aisha Mindful Studio", businessType: "Sole Trader",
    neighbourhood: "Northside", mapPos: { x: 45, y: 40 },
    socials: { instagram: "instagram.com/aishamindful", tiktok: "tiktok.com/@aishamindful", website: "aishamindful.com" }, socialsPublic: true,
    photos: [0,1].map(i => makePlaceholder("#56C0A6","Yoga & Wellness",i)) },
  { id: 7, name: "Derek P.", avatar: "DP", category: "home", title: "Lawn Care & Landscaping", desc: "Mowing, trimming, garden cleanup. Weekly or one-time.", type: "service", rating: 4.8, trades: 29,
    neighbourhood: "Oak Heights", mapPos: { x: 322, y: 40 },
    photos: [0,1].map(i => makePlaceholder("#E85D3A","Lawn & Garden",i)) },
  { id: 8, name: "Sofia R.", avatar: "SR", category: "care", title: "Professional Hairstylist", desc: "Cuts, color, styling. 12 years exp. House calls available.", type: "service", rating: 5.0, trades: 44,
    accountType: "business", businessName: "Sofia R. Hair", businessType: "Sole Trader",
    neighbourhood: "Harbourside", mapPos: { x: 322, y: 215 },
    socials: { instagram: "instagram.com/sofiar.hair", facebook: "facebook.com/sofiar.hair", tiktok: "tiktok.com/@sofiar.hair" }, socialsPublic: false,
    photos: [0,1,2].map(i => makePlaceholder("#C47FD5","Hairstyling",i)) },
  { id: 9, name: "Carlos V.", avatar: "CV", category: "home", title: "Interior & Exterior Painting", desc: "Residential painter. Walls, trim, ceilings. 15 years experience.", type: "service", rating: 4.8, trades: 33,
    accountType: "business", businessName: "Carlos V. Painting Co.", businessType: "LLC / Limited Company",
    neighbourhood: "Riverside", mapPos: { x: 245, y: 110 },
    socials: { instagram: "instagram.com/carlosvpainting", facebook: "facebook.com/carlosvpainting", yelp: "yelp.com/biz/carlos-v-painting", website: "carlosvpainting.com" }, socialsPublic: true,
    photos: [0,1].map(i => makePlaceholder("#E85D3A","Painting",i)) },
];

const DISCLAIMER = `DISCLAIMER OF LIABILITY: Bartr acts solely as a platform to connect independent users and is not a party to any exchange, agreement, or transaction between users. Bartr makes no representations or warranties regarding the quality, safety, legality, or accuracy of any listings, goods, or services. Users enter into all exchanges entirely at their own risk. Bartr shall not be held liable for any loss, damage, injury, dispute, or harm of any kind arising from any exchange facilitated through this platform. This agreement is between the two named parties only.\n\nCOMMUNITY STANDARDS: Both parties confirm this exchange involves no illegal goods, illegal substances, controlled substances without valid prescription, or services of a sexual nature. Violations may result in permanent removal from the platform and may be reported to appropriate authorities.`;

const catOf = (id) => CATEGORIES.find(c => c.id === id) || CATEGORIES[CATEGORIES.length - 1];


const BrandIcon = ({ id, size = 16 }) => {
  const s = { display: "inline-flex", flexShrink: 0 };
  if (id === "instagram") return <svg style={s} width={size} height={size} viewBox="0 0 24 24"><defs><radialGradient id="ig-g" cx="30%" cy="107%" r="150%"><stop offset="0%" stopColor="#fdf497"/><stop offset="45%" stopColor="#fd5949"/><stop offset="60%" stopColor="#d6249f"/><stop offset="90%" stopColor="#285AEB"/></radialGradient></defs><rect width="24" height="24" rx="6" fill="url(#ig-g)"/><rect x="3" y="3" width="18" height="18" rx="5" stroke="#fff" strokeWidth="1.5" fill="none"/><circle cx="12" cy="12" r="4" stroke="#fff" strokeWidth="1.5" fill="none"/><circle cx="17.2" cy="6.8" r="1.1" fill="#fff"/></svg>;
  if (id === "facebook") return <svg style={s} width={size} height={size} viewBox="0 0 24 24"><rect width="24" height="24" rx="6" fill="#1877F2"/><path d="M16 8h-2a1 1 0 0 0-1 1v2h3l-.5 3H13v7h-3v-7H8v-3h2V9a4 4 0 0 1 4-4h2v3z" fill="#fff"/></svg>;
  if (id === "tiktok") return <svg style={s} width={size} height={size} viewBox="0 0 24 24"><rect width="24" height="24" rx="6" fill="#000"/><path d="M16.5 5.5a3.5 3.5 0 0 0 3.5 3.5v2.9a6 6 0 0 1-3.5-1.1V16a5 5 0 1 1-5-5v3a2 2 0 1 0 2 2V5.5h3z" fill="#fff"/></svg>;
  if (id === "linkedin") return <svg style={s} width={size} height={size} viewBox="0 0 24 24"><rect width="24" height="24" rx="6" fill="#0A66C2"/><path d="M7 9h2v9H7zm1-1.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm4 1.5h2v1.3c.5-.8 1.4-1.5 2.5-1.5C18.5 8.8 19 10.2 19 12v6h-2v-5.5c0-.9-.4-1.5-1.2-1.5S14 11.7 14 12.5V18h-2V9z" fill="#fff"/></svg>;
  if (id === "pinterest") return <svg style={s} width={size} height={size} viewBox="0 0 24 24"><rect width="24" height="24" rx="6" fill="#E60023"/><path d="M12 3C7 3 3 7 3 12c0 3.7 2.2 6.9 5.4 8.3-.1-.7 0-1.6.2-2.4l1.1-4.6s-.3-.6-.3-1.4c0-1.3.8-2.3 1.8-2.3.9 0 1.3.7 1.3 1.4 0 .9-.5 2.2-.8 3.3-.2 1 .5 1.8 1.5 1.8 1.8 0 3-2.3 3-5.1 0-2.1-1.4-3.7-3.8-3.7-2.7 0-4.4 2-4.4 4.3 0 .8.2 1.3.6 1.7.1.1.1.3 0 .4l-.3 1.1c0 .2-.2.2-.4.1C7.8 14.5 7 13 7 11.2 7 8.3 9.3 5.7 13 5.7c3 0 5 2.1 5 4.9 0 3.3-1.8 5.8-4.5 5.8-1 0-1.8-.5-2.1-1.1l-.6 2.2c-.2.7-.7 1.6-1 2.1.8.2 1.5.3 2.2.3 5 0 9-4 9-9s-4-9-9-9z" fill="#fff"/></svg>;
  if (id === "etsy") return <svg style={s} width={size} height={size} viewBox="0 0 24 24"><rect width="24" height="24" rx="6" fill="#F45800"/><path d="M6 5h12v2.2H9.2V11h5.5v2H9.2v4.6H18V20H6z" fill="#fff"/></svg>;
  if (id === "yelp") return <svg style={s} width={size} height={size} viewBox="0 0 24 24"><rect width="24" height="24" rx="6" fill="#D32323"/><path d="M12.3 11.1 7.1 13.3c-.5.2-.7.8-.4 1.3.7 1.2 1.9 2.2 3.3 2.8.5.2 1.1 0 1.4-.5l2-4.8c.2-.5-.1-1.1-.7-1.2-.2 0-.3 0-.4.2zM11 9.7V4.5c0-.6-.5-1-1-1a8 8 0 0 0-4.2 2.7c-.4.5-.3 1.2.2 1.5l4.2 2.8c.5.3 1-.1.8-.8zM13 9.5l4.2-2.8c.5-.3.6-1 .2-1.5A8 8 0 0 0 13 2.5c-.5 0-1 .4-1 1v5.2c-.1.7.5 1.1 1 .8zM15 11.7l2-4.8c.2-.5 0-1.2-.5-1.4a8.1 8.1 0 0 0-4.8-.4.9.9 0 0 0-.5.8v5.2c0 .6.6 1 1.2.8l2.1-.9c.2 0 .4-.1.5-.3zM14.2 13.3l4.6-1.1c.5-.1.9-.7.7-1.3a8.1 8.1 0 0 0-2.7-3.7c-.4-.3-1-.2-1.3.3L13 12.4c-.3.6 0 1.2.7 1.1.2 0 .4-.1.5-.2z" fill="#fff"/></svg>;
  if (id === "website") return <svg style={s} width={size} height={size} viewBox="0 0 24 24"><rect width="24" height="24" rx="6" fill="#555"/><circle cx="12" cy="12" r="7" stroke="#fff" strokeWidth="1.5" fill="none"/><path d="M12 5c-1.5 2-2.5 4.3-2.5 7s1 5 2.5 7M12 5c1.5 2 2.5 4.3 2.5 7s-1 5-2.5 7M5 12h14" stroke="#fff" strokeWidth="1.3" fill="none"/></svg>;
  return <svg style={s} width={size} height={size} viewBox="0 0 24 24"><rect width="24" height="24" rx="6" fill="#888"/></svg>;
};

const AuthBrandIcon = ({ id, size = 20 }) => {
  const s = { display: "inline-flex", flexShrink: 0, verticalAlign: "middle" };
  if (id === "google") return (
    <svg style={s} width={size} height={size} viewBox="0 0 24 24">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
    </svg>
  );
  if (id === "facebook") return (
    <svg style={s} width={size} height={size} viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="11" fill="#1877F2"/>
      <path d="M13.5 21v-7.5h2.5l.4-3H13.5V8.6c0-.85.4-1.6 1.5-1.6h1.5V4.2S15.3 4 14 4c-2.5 0-4.2 1.5-4.2 4.3v2.2H7v3h2.8V21h3.7z" fill="#fff"/>
    </svg>
  );
  if (id === "apple") return (
    <svg style={s} width={size} height={size} viewBox="0 0 24 24">
      <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.7 9.05 7.4c1.32.07 2.23.72 3 .77.96-.17 1.88-.84 3.26-.9 1.64-.08 2.88.6 3.68 1.68-3.35 2.05-2.79 6.38.55 7.7-.65 1.62-1.5 3.22-2.49 3.63zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" fill="currentColor"/>
    </svg>
  );
  return null;
};

const SOCIAL_PLATFORMS = [
  { id: "instagram", label: "Instagram", placeholder: "instagram.com/yourprofile" },
  { id: "facebook",  label: "Facebook",  placeholder: "facebook.com/yourbusiness" },
  { id: "tiktok",    label: "TikTok",    placeholder: "tiktok.com/@yourbusiness" },
  { id: "linkedin",  label: "LinkedIn",  placeholder: "linkedin.com/in/yourname" },
  { id: "pinterest", label: "Pinterest", placeholder: "pinterest.com/yourprofile" },
  { id: "etsy",      label: "Etsy",      placeholder: "etsy.com/shop/yourshop" },
  { id: "yelp",      label: "Yelp",      placeholder: "yelp.com/biz/yourbusiness" },
  { id: "website",   label: "Website",   placeholder: "yourwebsite.com" },
];

const THEMES = {
  natural: { id: "natural", label: "Natural", emoji: "🌿",
    bg: "#F0EEE9", card: "#ffffff", nav: "#ffffff", sheet: "#ffffff",
    primary: "#1A1A1A", accent: "#E85D3A", border: "#E5E2DC",
    input: "#FDFCFA", inputBorder: "#DDD8CE",
    text: "#1A1A1A", subtext: "#777777", muted: "#999999",
    chipOn: "#1A1A1A", chipOnText: "#F0EEE9",
  },
  dark: { id: "dark", label: "Dark", emoji: "🌙",
    bg: "#141A15", card: "#1E271F", nav: "#1A211B", sheet: "#1E271F",
    primary: "#E2EAE2", accent: "#E85D3A", border: "#1A1A1A",
    input: "#19221A", inputBorder: "#1A1A1A",
    text: "#E2EAE2", subtext: "#8A9E8C", muted: "#5A6E5C",
    chipOn: "#E85D3A", chipOnText: "#ffffff",
  },
  sage: { id: "sage", label: "Sage", emoji: "🪴",
    bg: "#EDF2EE", card: "#F5FAF6", nav: "#F5FAF6", sheet: "#F5FAF6",
    primary: "#1E4A30", accent: "#3DA870", border: "#C4D9CB",
    input: "#EEF5EF", inputBorder: "#B8D0C0",
    text: "#1E3A28", subtext: "#4A7A5C", muted: "#7AA088",
    chipOn: "#1E4A30", chipOnText: "#ffffff",
  },
  warm: { id: "warm", label: "Warm", emoji: "🍂",
    bg: "#FAF4EC", card: "#FFFDF8", nav: "#FFFDF8", sheet: "#FFFDF8",
    primary: "#3D2B1F", accent: "#C8753A", border: "#E8DDD0",
    input: "#FBF8F3", inputBorder: "#DDD0C0",
    text: "#3D2B1F", subtext: "#7A6050", muted: "#A08878",
    chipOn: "#3D2B1F", chipOnText: "#FAF4EC",
  },
};

function buildThemeCSS(t) {
  return (
    ":root{" +
      "--tf-bg:" + t.bg + ";" +
      "--tf-card:" + t.card + ";" +
      "--tf-primary:" + t.primary + ";" +
      "--tf-accent:" + t.accent + ";" +
      "--tf-border:" + t.border + ";" +
      "--tf-input:" + t.input + ";" +
      "--tf-text:" + t.text + ";" +
      "--tf-sub:" + t.subtext + ";" +
      "--tf-muted:" + t.muted + ";" +
    "}" +
    "body,#root{background:" + t.bg + ";color:" + t.text + "}" +
    ".card{background:" + t.card + ";border-color:" + t.border + "}" +
    ".sheet{background:" + t.sheet + ";color:" + t.text + "}" +
    ".p-section{background:" + t.card + ";color:" + t.text + "}" +
    ".p-section-title{color:" + t.muted + "}" +
    ".p-label{color:" + t.muted + "}" +
    ".p-val{color:" + t.text + "}" +
    ".p-row{border-bottom-color:" + t.border + "}" +
    ".inp{background:" + t.input + ";border-color:" + t.inputBorder + ";color:" + t.text + "}" +
    ".inp:focus{border-color:" + t.accent + "}" +
    ".inp::placeholder{color:" + t.muted + "}" +
    "input,textarea,select{color:" + t.text + ";background:" + t.input + "}" +
    "input::placeholder,textarea::placeholder{color:" + t.muted + "}" +
    ".search-wrap{background:" + t.card + ";border-color:" + t.inputBorder + "}" +
    ".search-wrap input{background:transparent;color:" + t.text + "}" +
    ".search-wrap input::placeholder{color:" + t.muted + "}" +
    ".cbox{background:" + t.input + ";border-color:" + t.border + ";color:" + t.text + "}" +
    ".bp{background:" + t.primary + ";color:" + t.bg + "}" +
    ".bg{color:" + t.primary + ";border-color:" + t.primary + "}" +
    ".bg:hover{background:" + t.primary + ";color:" + t.bg + "}" +
    ".tbtn{background:" + t.card + ";border-color:" + t.inputBorder + ";color:" + t.subtext + "}" +
    ".tbtn.on{background:" + t.primary + ";color:" + t.chipOnText + ";border-color:" + t.primary + "}" +
    ".a-ghost{background:" + t.card + ";border-color:" + t.border + ";color:" + t.text + "}" +
    ".a-divider{color:" + t.muted + ";border-color:" + t.border + "}" +
    ".a-divider span{background:" + t.bg + ";color:" + t.muted + "}" +
    ".a-field{background:" + t.input + ";border-color:" + t.inputBorder + ";color:" + t.text + "}" +
    ".a-field::placeholder{color:" + t.muted + "}" +
    ".a-err{background:" + (t.id==="dark" ? "#2A0A0A" : "#FEF2F2") + ";color:#EF4444}" +
    ".chip{background:" + t.card + ";border-color:" + t.border + ";color:" + t.text + "}" +
    ".chip.on{background:" + t.chipOn + ";color:" + t.chipOnText + ";border-color:" + t.chipOn + "}" +
    ".cat-tile{background:" + t.card + ";color:" + t.text + "}" +
    ".skill-tag{background:" + t.input + ";color:" + t.text + ";border:1px solid " + t.border + "}" +
    ".plan-badge{background:" + t.input + ";color:" + t.muted + "}" +
    ".biz-badge{background:" + t.input + ";color:" + t.subtext + "}" +
    ".stitle{color:" + t.primary + "}" +
    ".nav-i{color:" + t.muted + "}" +
    ".nav-i.on{color:" + t.accent + "}" +
    ".notif-panel{background:" + t.card + "}" +
    ".notif-item{border-bottom-color:" + t.border + ";color:" + t.text + "}" +
    ".notif-item.unread{background:" + t.bg + "}" +
    ".notif-item:hover{background:" + t.bg + "}" +
    ".social-chip{background:" + t.card + ";border-color:" + t.border + ";color:" + t.text + "}" +
    ".social-chip:hover{border-color:" + t.accent + ";color:" + t.accent + "}" +
    ".social-row{border-color:" + t.border + "}" +
    ".social-icon{background:" + t.input + "}" +
    ".ctx-menu{background:" + t.card + ";border-color:" + t.border + "}" +
    ".ctx-item{color:" + t.text + "}" +
    ".ctx-item:hover{background:" + t.bg + "}" +
    ".map-popup{background:" + t.card + ";color:" + t.text + "}" +
    ".intake-msg.ai{background:" + t.card + ";color:" + t.text + "}" +
    ".warn{background:" + (t.id==="dark" ? "#2A2000" : "#FFF8F0") + ";border-color:" + (t.id==="dark" ? "#5A4000" : "#F0B429") + "}" +
    ".view-toggle{background:" + t.input + ";border-color:" + t.border + "}" +
    ".view-btn{color:" + t.subtext + "}" +
    ".view-btn.on{background:" + t.card + ";color:" + t.text + "}" +
    ".pbar{background:" + t.border + "}" +
    ".profile-edit-overlay{background:" + t.bg + "}" +
    ".profile-edit-header{background:" + t.card + ";border-color:" + t.border + "}" +
    ".rev-card{border-bottom-color:" + t.border + "}" +
    ".rev-reply{background:" + (t.id==="dark"?"#1A2B1C":"#F0F9F3") + ";border-color:" + (t.id==="dark"?"#1A1A1A":"#C8E6D4") + "}" +
    ".rev-reply-input{background:" + t.input + ";border-color:" + t.inputBorder + ";color:" + t.text + "}" +
    ".rev-reply-input::placeholder{color:" + t.muted + "}" +
    ".rev-avatar{background:" + t.primary + "}" +
    ".star-btn{color:" + t.border + "}" +
    ".star-btn.lit{color:#F59E0B}" +
    ".ai-box{background:linear-gradient(135deg," + t.primary + " 0%," + (t.id==="dark"?"#1A3020":"#3D5C42") + " 100%)}" +
    ".ai-inp{background:rgba(255,255,255,.12);color:#fff}" +
    ".ai-res{background:rgba(255,255,255,.08)}" +
    ".listing-detail-sheet{background:" + t.sheet + "}" +
    ".listing-detail-desc{color:" + t.subtext + "}" +
    ".listing-detail-tag{background:" + t.input + ";color:" + t.text + ";border-color:" + t.border + "}" +
    ".contract-box{background:" + t.input + ";border-color:" + t.border + ";color:" + t.text + "}" +
    ".onboard-slide{background:" + t.card + "}" +
    ".onboard-dot{background:" + t.border + "}" +
    ".onboard-dot.on{background:" + t.accent + "}" +
    ".disp-sheet-label{color:" + t.muted + "}" +
    ".disp-sheet-val{color:" + t.text + "}" +
    ".msg-row-meta{color:" + t.muted + "}" +
    ".conv-date{color:" + t.muted + "}" +
    ".conv-preview{color:" + t.subtext + "}" +
    ".msg-them{background:" + t.card + ";color:" + t.text + "}" +
    ".msg-me{background:" + t.accent + ";color:#fff}" +
    ".msg-input-row{background:" + t.card + ";border-top-color:" + t.border + "}" +
    ".msg-input{background:" + t.input + ";color:" + t.text + "}" +
    ".msg-input::placeholder{color:" + t.muted + "}" +
    ".detail-header-btn{background:" + t.card + ";color:" + t.text + ";border-color:" + t.border + "}" +
    ".avail-dot-open{color:#E85D3A}" +
    ".avail-dot-limited{color:#F59E0B}" +
    ".avail-dot-closed{color:#EF4444}" +
    ".plan-card{background:" + t.card + ";border-color:" + t.border + "}" +
    ".plan-card.popular{border-color:" + t.accent + "}" +
    ".intake-step-header{background:" + t.card + ";border-bottom-color:" + t.border + "}" +
    ".intake-body{background:" + t.bg + "}" +
    ".dispute-section{border-color:" + t.border + "}" +
    ".counter-sheet{background:" + t.sheet + "}" +
    ".pricing-sheet{background:" + t.bg + "}"
  );
}

const BUSINESS_TYPES = ["Sole Trader", "LLC / Limited Company", "Partnership", "Freelancer / Contractor", "Non-profit", "Other"];

const PLANS = {
  free: {
    id: "free", name: "Free", price: 0, yearlyPrice: 0,
    color: "#888", badge: null,
    listingLimit: 3,
    socialLimit: 2,
    features: [
      "Up to 3 listings",
      "2 social / website links",
      "Full barter & messaging",
      "AI matchmaker",
      "Community reviews",
    ],
    missing: [
      "All social links (6 platforms)",
      "Priority in search results",
      "Verified badge (add-on)",
      "Up to 10 listings",
    ],
  },
  pro: {
    id: "pro", name: "Pro", price: 12, yearlyPrice: 99,
    color: "#E85D3A", badge: "⭐ Pro",
    listingLimit: 10,
    socialLimit: 6,
    features: [
      "Up to 10 listings",
      "All 6 social / website links",
      "Full barter & messaging",
      "AI matchmaker",
      "Community reviews",
      "Priority in search results",
      "Verified badge included",
    ],
    missing: [],
  },
};

// ─── BADGE SYSTEM ─────────────────────────────────────────────────────────────

const BADGE_DEFS = [
  {
    id: "veteran",
    icon: "🏆", label: "Veteran",
    desc: "50+ completed trades",
    color: "#F59E0B", bg: "#FFFBEB", border: "#FCD34D",
    test: ({ trades }) => trades >= 50,
    next: ({ trades }) => trades < 50 ? `${50 - trades} more trade${50 - trades === 1 ? "" : "s"} to unlock` : null,
  },
  {
    id: "top-trader",
    icon: "🌟", label: "Top Trader",
    desc: "25+ completed trades",
    color: "#7C3AED", bg: "#F5F3FF", border: "#DDD6FE",
    test: ({ trades }) => trades >= 25,
    next: ({ trades }) => trades < 25 ? `${25 - trades} more trade${25 - trades === 1 ? "" : "s"} to unlock` : null,
  },
  {
    id: "trusted",
    icon: "🏅", label: "Trusted",
    desc: "10+ completed trades",
    color: "#2563EB", bg: "#EFF6FF", border: "#BFDBFE",
    test: ({ trades }) => trades >= 10,
    next: ({ trades }) => trades < 10 ? `${10 - trades} more trade${10 - trades === 1 ? "" : "s"} to unlock` : null,
  },
  {
    id: "active",
    icon: "🔥", label: "Active Trader",
    desc: "5+ completed trades",
    color: "#EA580C", bg: "#FFF7ED", border: "#FED7AA",
    test: ({ trades }) => trades >= 5,
    next: ({ trades }) => trades < 5 ? `${5 - trades} more trade${5 - trades === 1 ? "" : "s"} to unlock` : null,
  },
  {
    id: "first-trade",
    icon: "🤝", label: "First Trade",
    desc: "Completed your first trade",
    color: "#059669", bg: "#ECFDF5", border: "#A7F3D0",
    test: ({ trades }) => trades >= 1,
    next: ({ trades }) => trades === 0 ? "Complete your first trade to unlock" : null,
  },
  {
    id: "perfect",
    icon: "💎", label: "Perfect Score",
    desc: "5.0 rating with 3+ reviews",
    color: "#0891B2", bg: "#ECFEFF", border: "#A5F3FC",
    test: ({ rating, reviewCount }) => rating >= 5.0 && reviewCount >= 3,
    next: ({ rating, reviewCount }) => rating < 5.0 ? "Maintain a perfect 5.0 rating to unlock" : reviewCount < 3 ? `${3 - reviewCount} more review${3 - reviewCount === 1 ? "" : "s"} needed` : null,
  },
  {
    id: "highly-rated",
    icon: "⭐", label: "Highly Rated",
    desc: "4.8+ rating with 5+ reviews",
    color: "#D97706", bg: "#FFFBEB", border: "#FDE68A",
    test: ({ rating, reviewCount }) => rating >= 4.8 && reviewCount >= 5,
    next: ({ rating, reviewCount }) => rating < 4.8 ? "Reach 4.8+ average rating to unlock" : reviewCount < 5 ? `${5 - reviewCount} more review${5 - reviewCount === 1 ? "" : "s"} needed` : null,
  },
  {
    id: "verified",
    icon: "✅", label: "Verified",
    desc: "Identity verified member",
    color: "#16A34A", bg: "#F0FDF4", border: "#BBF7D0",
    test: ({ verified }) => verified,
    next: ({ verified }) => !verified ? "Upgrade to Pro and complete verification" : null,
  },
  {
    id: "pro",
    icon: "👑", label: "Pro Member",
    desc: "Bartr Pro subscriber",
    color: "#9333EA", bg: "#FAF5FF", border: "#E9D5FF",
    test: ({ isPro }) => isPro,
    next: ({ isPro }) => !isPro ? "Upgrade to Pro to unlock" : null,
  },
];

function getBadges({ trades = 0, rating = 0, reviewCount = 0, verified = false, isPro = false }) {
  const ctx = { trades, rating: parseFloat(rating) || 0, reviewCount: reviewCount || 0, verified, isPro };
  return BADGE_DEFS.filter(b => b.test(ctx));
}

// Compact badge icon(s) for listing cards — top 2 earned, most prestigious first
function ListingBadges({ listing }) {
  const badges = getBadges({
    trades: listing.trades || 0,
    rating: listing.rating || 0,
    reviewCount: listing.reviewCount || 0,
    verified: listing.verified || false,
    isPro: listing.plan === "pro" || listing.accountType === "business",
  }).slice(0, 2);
  if (badges.length === 0) return null;
  return (
    <span style={{ display: "inline-flex", gap: 3, alignItems: "center" }}>
      {badges.map(b => (
        <span key={b.id} title={b.label + " — " + b.desc}
          style={{ background: b.bg, border: `1px solid ${b.border}`, borderRadius: 100, padding: "1px 6px", fontSize: 10, fontFamily: "Plus Jakarta Sans", color: b.color, fontWeight: 600, display: "inline-flex", alignItems: "center", gap: 3 }}>
          {b.icon} <span style={{ fontSize: 9 }}>{b.label}</span>
        </span>
      ))}
    </span>
  );
}

function buildContract({ party1, party2, details1, details2, date, version = 1, contractType = "one-time" }) {
  const termClause = contractType === "ongoing"
    ? `TERM & RENEWAL

This agreement is effective from ${date} for an initial term of one (1) year. It will automatically renew for successive one-year terms unless either party provides at least thirty (30) days written notice of termination via the Bartr platform prior to the renewal date.

Either party may terminate this agreement at any time by providing thirty (30) days notice through the Bartr platform. Obligations incurred prior to termination remain in effect.`
    : `TERM

This is a one-time exchange agreement. It is fulfilled when both parties have completed their stated obligations.`;

  return `BARTR EXCHANGE AGREEMENT  (v${version})
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
DATE: ${date}
TYPE: ${contractType === "ongoing" ? "Ongoing (annual, auto-renewing)" : "One-time exchange"}
PARTY 1: ${party1}
PARTY 2: ${party2}

TERMS OF EXCHANGE:

${party1} agrees to provide:
${details1}

In exchange, ${party2} agrees to provide:
${details2}

Both parties agree to fulfill obligations in good faith within the agreed scope and timeframe, and to communicate promptly if issues arise.
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${termClause}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
LEGAL NOTICE

${DISCLAIMER}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SIGNATURES

Party 1 (${party1}): _______________________
Party 2 (${party2}): _______________________
Date of Agreement: ${date}`;
}

// Structured contract data — used to render the highlighted preview UI
function buildContractData({ party1, party2, details1, details2, date, version = 1, scheduledDate = null, contractType = "one-time" }) {
  return { party1, party2, details1, details2, date, version, scheduledDate, contractType,
    plain: buildContract({ party1, party2, details1, details2, date, version, contractType }) };
}

// Simulated responses from "other party"
const COUNTER_REPLIES = [
  "Thanks for reaching out! I'd like to adjust a couple of the terms — can we discuss?",
  "This looks mostly good to me. I do want to clarify the timeline a bit more.",
  "I appreciate the detail! One thing I'd like to modify is the scope of work.",
  "Great proposal! I'm going to counter with slightly different terms.",
];
const ACK_REPLIES = [
  "Got it, thanks for clarifying!",
  "That makes sense. Let me think about it.",
  "Understood — I'll get back to you shortly.",
  "Thanks for the info!",
];

// ─── MOCK AUTH STORE (replaces a real backend in production) ─────────────────
// In production: swap this for JWT / OAuth / Supabase / Firebase Auth etc.
const MOCK_USERS = [
  { id: "u1", email: "demo@bartr.app", password: "demo1234", name: "Demo User", verified: true },
];
let _userStore = [...MOCK_USERS];

function authSignUp(email, password) {
  if (_userStore.find(u => u.email.toLowerCase() === email.toLowerCase()))
    return { error: "An account with this email already exists." };
  const user = { id: "u" + Date.now(), email, password, name: "", verified: false };
  _userStore.push(user);
  return { user };
}
function authSignIn(email, password) {
  const user = _userStore.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === password);
  if (!user) return { error: "Incorrect email or password." };
  return { user };
}
function authResetPassword(email) {
  const exists = _userStore.find(u => u.email.toLowerCase() === email.toLowerCase());
  if (!exists) return { error: "No account found with that email." };
  return { ok: true };
}

// ─── MAIN APP ────────────────────────────────────────────────────────────────

export default function App() {
  const [authUser, setAuthUser] = useState(null);
  const [authScreen, setAuthScreen] = useState("landing");
  const [screen, setScreen] = useState("home");
  const [profile, setProfile] = useState({ name: "", bio: "", headline: "", location: "", email: "", phone: "", accountType: "personal", businessName: "", businessType: "", socials: {}, socialsPublic: true, socialLink: "", photo: null, skills: [], lookingFor: "", availability: "", yearsExp: "", licenseNo: "" });
  const [profileStep, setProfileStep] = useState(1);
  const [profileDone, setProfileDone] = useState(false);
  const [listings, setListings] = useState(LISTINGS);
  const [myListings, setMyListings] = useState([]);
  const [filterCat, setFilterCat] = useState("all");
  const [filterAvail, setFilterAvail] = useState(true); // hide "closed" listings by default
  const [browseView, setBrowseView] = useState("list"); // "list" | "map"
  const [searchQuery, setSearchQuery] = useState("");
  const searchRef = useRef(null);
  const [newListing, setNewListing] = useState({ title: "", desc: "", category: "", type: "service", photos: [], contractDefaults: { offer: "", lookingFor: "", conditions: "", contractType: "one-time" }, blockedDates: [] });
  const [editingListing, setEditingListing] = useState(null);
  const [showDefaults, setShowDefaults] = useState(false);
  const [archivedListings, setArchivedListings] = useState([]);
  const [showArchived, setShowArchived] = useState(false);
  const [selectedReceiptId, setSelectedReceiptId] = useState(null);
  const [listingViews, setListingViews] = useState({});
  const [referrals, setReferrals] = useState([]);
  const [browseLoading, setBrowseLoading] = useState(false);
  const [notifPrefs, setNotifPrefs] = useState({ message: true, offer: true, counter: true, complete: true, review: true, dispute: true, system: true });
  const [following, setFollowing] = useState(new Set());
  const [browseTab, setBrowseTab] = useState("all");
  const [boostedListings, setBoostedListings] = useState({}); // { listingId: expiresAt }
  const [boostTarget, setBoostTarget] = useState(null); // listing to boost
  const [showBd, setShowBd] = useState(false);
  const [bdYear, setBdYear] = useState(new Date().getFullYear());
  const [bdMonth, setBdMonth] = useState(new Date().getMonth());
  const [editingProfile, setEditingProfile] = useState(false);
  const [currentTheme, setCurrentTheme] = useState("natural");
  const [lightbox, setLightbox] = useState(null);
  const [toast, setToast] = useState(null);
  const [selectedListing, setSelectedListing] = useState(null);
  const [conversations, setConversations] = useState([]);
  const [activeConvId, setActiveConvId] = useState(null);
  const [intakeTarget, setIntakeTarget] = useState(null);
  const [aiQuery, setAiQuery] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [aiResult, setAiResult] = useState(null);
  const [aiSuggested, setAiSuggested] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [reviewTarget, setReviewTarget] = useState(null);
  const [completedConvs, setCompletedConvs] = useState(new Set());
  const [emailConfirm, setEmailConfirm] = useState(null);
  const [favorites, setFavorites] = useState(new Set());
  const [blocked, setBlocked] = useState(new Set());
  const [reported, setReported] = useState(new Set());
  const [reportTarget, setReportTarget] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [notifOpen, setNotifOpen] = useState(false);
  const [membership, setMembership] = useState({ plan: "free", verified: false, billingCycle: "monthly" });
  const [showPricing, setShowPricing] = useState(false); // false | "upgrade" | "verify"
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [storageReady, setStorageReady] = useState(false); // true once initial load done
  const [savedSearches, setSavedSearches] = useState([]); // [{ id, query, category, sort, avail, savedAt, newCount }]

  // ── STORAGE HELPERS ────────────────────────────────────────────────────────
  const storageKey = (uid) => `tf:session:${uid}`;

  // Load saved session for a given user
  const loadSession = async (user) => {
    try {
      const result = await window.storage.get(storageKey(user.id || user.email));
      if (result?.value) {
        const s = JSON.parse(result.value);
        if (s.profile)       setProfile(s.profile);
        if (s.profileDone !== undefined) setProfileDone(s.profileDone);
        if (s.profileStep)   setProfileStep(s.profileStep);
        if (s.myListings)  {
          setMyListings(s.myListings);
          setListings([...s.myListings, ...LISTINGS.filter(l => !s.myListings.find(m => m.id === l.id))]);
        }
        if (s.conversations) setConversations(s.conversations);
        if (s.archivedListings) setArchivedListings(s.archivedListings);
        if (s.following) setFollowing(new Set(s.following));
        if (s.boostedListings) setBoostedListings(s.boostedListings);
        if (s.referrals) setReferrals(s.referrals);
        if (s.reviews)       setReviews(s.reviews);
        if (s.favorites)     setFavorites(new Set(s.favorites));
        if (s.blocked)       setBlocked(new Set(s.blocked));
        if (s.reported)      setReported(new Set(s.reported));
        if (s.notifications) setNotifications(s.notifications);
        if (s.completedConvs) setCompletedConvs(new Set(s.completedConvs));
        if (s.membership)    setMembership(s.membership);
        if (s.currentTheme)  setCurrentTheme(s.currentTheme);
        if (s.savedSearches) setSavedSearches(s.savedSearches);
      }
    } catch (_) { /* no saved session yet — start fresh */ }
    setStorageReady(true);
  };

  // Save current session (called whenever key state changes)
  const saveSession = async (uid, state) => {
    try {
      await window.storage.set(storageKey(uid), JSON.stringify(state));
    } catch (_) {}
  };

  // Load session when user signs in
  useEffect(() => {
    if (authUser) {
      setStorageReady(false);
      loadSession(authUser);
    } else {
      setStorageReady(false);
    }
  }, [authUser?.id || authUser?.email]);

  // Save session whenever relevant state changes (but only after initial load)
  useEffect(() => {
    if (!authUser || !storageReady) return;
    const uid = authUser.id || authUser.email;
    saveSession(uid, {
      profile, profileDone, profileStep,
      myListings,
      conversations,
      reviews,
      favorites: [...favorites],
      blocked:   [...blocked],
      reported:  [...reported],
      notifications,
      completedConvs: [...completedConvs],
      membership,
      currentTheme,
      savedSearches,
      archivedListings,
      referrals,
      following: [...following],
      boostedListings,
    });
  }, [
    storageReady, profile, profileDone, profileStep,
    myListings, conversations, reviews,
    favorites, blocked, reported,
    notifications, completedConvs, membership, currentTheme, savedSearches,
    archivedListings, referrals, following, boostedListings,
  ]);

  const pushNotif = (type, title, body, meta = {}) => {
    if (notifPrefs[type] === false) return;
    setNotifications(prev => [{
      id: Date.now() + Math.random(),
      type, title, body, meta,
      ts: new Date(),
      read: false,
    }, ...prev]);
  };

  // ── RESTORE AUTH ON MOUNT ─────────────────────────────────────────────────
  useEffect(() => {
    (async () => {
      try {
        const result = await window.storage.get("tf:auth");
        if (result?.value) {
          const saved = JSON.parse(result.value);
          setAuthUser(saved);
          setAuthScreen("landing");
        }
      } catch (_) {}
    })();
  }, []);

  const unreadNotifs = notifications.filter(n => !n.read).length;

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(null), 2800); };

  const openListing = (l) => {
    setSelectedListing(l);
    if (l?.id) setListingViews(prev => ({ ...prev, [l.id]: (prev[l.id] || 0) + 1 }));
  };

  const toggleFollow = (traderName) => {
    setFollowing(prev => {
      const next = new Set(prev);
      if (next.has(traderName)) {
        next.delete(traderName);
        showToast(`Unfollowed ${traderName}`);
      } else {
        next.add(traderName);
        showToast(`Following ${traderName}! 🌿`);
      }
      return next;
    });
  };

  const boostListing = (listing, days, useCredit) => {
    const expiresAt = Date.now() + days * 24 * 60 * 60 * 1000;
    setBoostedListings(prev => ({ ...prev, [listing.id]: expiresAt }));
    if (useCredit && referrals.length > 0) {
      setReferrals(prev => prev.slice(1)); // spend one credit
    }
    setBoostTarget(null);
    showToast(`Listing boosted for ${days} days! ⚡`);
  };

  // Active boosts (not expired)
  const activeBoosted = Object.entries(boostedListings)
    .filter(([, exp]) => exp > Date.now())
    .map(([id]) => Number(id));

  const isPro = membership.plan === "pro";

  const cardFav = (listing) => {
    setFavorites(prev => {
      const next = new Set(prev);
      next.has(listing.id) ? next.delete(listing.id) : next.add(listing.id);
      showToast(next.has(listing.id) ? "Saved to favourites ♥" : "Removed from favourites");
      return next;
    });
  };
  const cardReport = (listing) => setReportTarget(listing);
  const cardBlock  = (listing) => {
    setBlocked(prev => new Set([...prev, listing.id]));
    setSelectedListing(null);
    showToast(`${listing.businessName || listing.name} has been blocked.`);
  };

  const unreadCount = conversations.filter(c => c.unread).length;
  const savedSearchNewCount = savedSearches.reduce((total, ss) => {
    return total + listings.filter(l =>
      !blocked.has(l.id) && !reported.has(l.id) && !l.mine &&
      (!ss.avail || l.availability !== "closed") &&
      (!ss.category || ss.category === "all" || l.category === ss.category) &&
      (!ss.query || l.title.toLowerCase().includes(ss.query.toLowerCase()) || l.desc?.toLowerCase().includes(ss.query.toLowerCase())) &&
      !ss.seenIds?.includes(l.id)
    ).length;
  }, 0);

  const openConversation = (convId) => {
    setConversations(prev => prev.map(c => c.id === convId ? { ...c, unread: false } : c));
    setActiveConvId(convId);
    setScreen("messages");
  };

  const startIntake = (listing) => {
    setSelectedListing(null);
    setIntakeTarget(listing);
  };

  const onIntakeComplete = (conv) => {
    setConversations(prev => [conv, ...prev]);
    setIntakeTarget(null);
    setActiveConvId(conv.id);
    setScreen("messages");
    showToast("Offer sent! 🎉");
    pushNotif("offer", "Offer sent", `Your offer for "${conv.listing.title}" has been sent to ${conv.listing.name}.`, { convId: conv.id });
  };

  const sendMessage = (convId, text, isMe = true) => {
    setConversations(prev => prev.map(c => {
      if (c.id !== convId) return c;
      const msg = { id: Date.now() + Math.random(), text, from: isMe ? "me" : "them", ts: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) };
      return { ...c, messages: [...c.messages, msg], unread: !isMe };
    }));
    if (!isMe) {
      const conv = conversations.find(c => c.id === convId);
      if (conv) pushNotif("message", `New message from ${conv.listing.name}`, text.slice(0, 80) + (text.length > 80 ? "…" : ""), { convId });
    }
  };

  const proposeCounterOffer = (convId, newDetails1, newDetails2, newContractType) => {
    setConversations(prev => prev.map(c => {
      if (c.id !== convId) return c;
      const newVersion = (c.contractVersion || 1) + 1;
      const contractType = newContractType || c.currentContractData?.contractType || "one-time";
      const contractData = buildContractData({
        party1: profile.name || "You", party2: c.listing.name,
        details1: newDetails1, details2: newDetails2,
        date: new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }),
        version: newVersion, contractType,
      });
      const sysMsg = {
        id: Date.now(), text: `📄 Counter-offer v${newVersion} proposed. Both parties must review and agree.`,
        from: "system", ts: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        contract: contractData.plain, contractData, contractVersion: newVersion,
      };
      return { ...c, messages: [...c.messages, sysMsg], contractVersion: newVersion, currentContract: contractData.plain, currentContractData: contractData, status: "countered", myAgreed: false, theirAgreed: false, details1: newDetails1, details2: newDetails2 };
    }));
    pushNotif("counter", "Counter-offer sent", `You proposed new terms for "${conversations.find(c=>c.id===convId)?.listing.title || "your trade"}". Waiting for the other party.`, { convId });
  };

  const agreeToContract = (convId) => {
    setConversations(prev => prev.map(c => {
      if (c.id !== convId) return c;
      const agreed = { ...c, myAgreed: true };
      // Simulate other party agreeing shortly after
      setTimeout(() => {
        setConversations(p => p.map(cc => {
          if (cc.id !== convId) return cc;
          const sysMsg = {
            id: Date.now(), text: `✅ ${c.listing.name} has also agreed! This exchange is now confirmed.`,
            from: "system", ts: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          };
          const contractType = cc.currentContractData?.contractType || "one-time";
          const agreedAt = Date.now();
          const renewsAt = contractType === "ongoing" ? agreedAt + 365 * 24 * 60 * 60 * 1000 : null;
          return { ...cc, theirAgreed: true, status: "agreed", agreedAt, renewsAt, contractType, messages: [...cc.messages, sysMsg] };
        }));
        showToast("Exchange confirmed! 🤝");
        pushNotif("confirmed", "Exchange confirmed! 🤝", `${c.listing.name} agreed — your trade for "${c.listing.title}" is now confirmed.`, { convId });
      }, 1800);
      const sysMsg = {
        id: Date.now(), text: `✅ You agreed to the contract. Waiting for ${c.listing.name}…`,
        from: "system", ts: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      return { ...agreed, messages: [...agreed.messages, sysMsg] };
    }));
  };

  const markComplete = (convId) => {
    const conv = conversations.find(c => c.id === convId);
    if (!conv) return;
    setCompletedConvs(prev => new Set([...prev, convId]));
    setConversations(prev => prev.map(c => {
      if (c.id !== convId) return c;
      const sysMsg = {
        id: Date.now(), text: "🎉 Trade marked as complete! How did it go?",
        from: "system", ts: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      return { ...c, completed: true, messages: [...c.messages, sysMsg] };
    }));
    // Trigger email confirmation modal
    const myEmail = profile.email || authUser?.email || "you";
    const theirEmail = `${conv.listing.name.toLowerCase().replace(/\s/g, ".")}@bartr.app`;
    setEmailConfirm({
      to1: myEmail,
      to2: theirEmail,
      theirName: conv.listing.name,
      myName: profile.name || authUser?.email || "You",
      contract: conv.currentContract || conv.currentContractData?.plain || "",
      listingTitle: conv.listing.title,
      contractData: conv.currentContractData || null,
    });
    setTimeout(() => setReviewTarget({ convId, listing: conv.listing }), 3200);
    pushNotif("complete", "Trade complete! 🎉", `Your exchange with ${conv.listing.name} for "${conv.listing.title}" is done. Leave a review!`, { convId });
  };

  const terminateContract = (convId) => {
    const conv = conversations.find(c => c.id === convId);
    if (!conv) return;
    setConversations(prev => prev.map(c => {
      if (c.id !== convId) return c;
      const sysMsg = {
        id: Date.now(),
        text: `🔴 Contract terminated. This agreement has been ended. Both parties have 30 days to fulfill any outstanding obligations.`,
        from: "system", ts: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      return { ...c, status: "terminated", terminatedAt: Date.now(), messages: [...c.messages, sysMsg] };
    }));
    pushNotif("terminated", "Contract ended", `Your agreement with ${conv.listing.name} for "${conv.listing.title}" has been terminated.`, { convId });
    showToast("Contract terminated");
  };

  const raiseDispute = (convId, dispute) => {
    const conv = conversations.find(c => c.id === convId);
    if (!conv) return;
    setConversations(prev => prev.map(c => {
      if (c.id !== convId) return c;
      const sysMsg = {
        id: Date.now(),
        text: `⚠️ A dispute has been raised: "${dispute.category}". Both parties can continue messaging to resolve this directly.`,
        from: "system", ts: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      return { ...c, status: "disputed", dispute: { ...dispute, raisedAt: Date.now(), status: "open" }, messages: [...c.messages, sysMsg] };
    }));
    pushNotif("dispute", "Dispute raised ⚠️", `A dispute was opened on your trade with ${conv.listing.name} for "${conv.listing.title}".`, { convId });
    showToast("Dispute submitted");
  };

  const resolveDispute = (convId) => {
    const conv = conversations.find(c => c.id === convId);
    if (!conv) return;
    setConversations(prev => prev.map(c => {
      if (c.id !== convId) return c;
      const sysMsg = {
        id: Date.now(),
        text: `✅ Dispute resolved. This agreement is back in good standing.`,
        from: "system", ts: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      return { ...c, status: "agreed", dispute: { ...c.dispute, status: "resolved", resolvedAt: Date.now() }, messages: [...c.messages, sysMsg] };
    }));
    pushNotif("resolved", "Dispute resolved ✅", `Your dispute with ${conv.listing.name} has been resolved.`, { convId });
    showToast("Dispute resolved");
  };

  const escalateDispute = (convId) => {
    const conv = conversations.find(c => c.id === convId);
    if (!conv) return;
    const caseRef = "TF-" + Math.random().toString(36).slice(2, 8).toUpperCase();
    setConversations(prev => prev.map(c => {
      if (c.id !== convId) return c;
      const sysMsg = {
        id: Date.now(),
        text: `🔴 Escalated to community mediation (Case ${caseRef}). A mediator will review within 3–5 business days. Chat is now read-only.`,
        from: "system", ts: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      return { ...c, dispute: { ...c.dispute, status: "escalated", caseRef, escalatedAt: Date.now() }, messages: [...c.messages, sysMsg] };
    }));
    pushNotif("escalated", "Mediation requested", `Case ${caseRef} submitted. A mediator will review your dispute within 3–5 business days.`, { convId });
    return caseRef;
  };

  const submitReview = (convId, rating, text) => {
    const conv = conversations.find(c => c.id === convId);
    if (!conv) return;
    const review = {
      id: Date.now(), convId, listingId: conv.listing.id,
      reviewerName: profile.name || authUser?.email || "Anonymous",
      reviewerPhoto: profile.photo || null,
      subjectName: conv.listing.name,
      listingTitle: conv.listing.title,
      rating, text,
      date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
    };
    setReviews(prev => [review, ...prev]);
    pushNotif("review", "Review submitted ⭐", `You left a ${rating}-star review for ${conv.listing.name}.`, {});
    // Update listing's live rating
    setListings(prev => prev.map(l => {
      if (l.id !== conv.listing.id) return l;
      const allRatings = [...reviews.filter(r => r.listingId === l.id).map(r => r.rating), rating];
      const avg = (allRatings.reduce((a, b) => a + b, 0) / allRatings.length).toFixed(1);
      return { ...l, rating: parseFloat(avg), reviewCount: (l.reviewCount || 0) + 1 };
    }));
    setReviewTarget(null);
    showToast("Review submitted — thank you! ⭐");
  };

  const replyToReview = (reviewId, responseText) => {
    setReviews(prev => prev.map(r => r.id === reviewId ? { ...r, response: responseText } : r));
    showToast("Response posted ✏️");
  };

  const runAiSearch = async () => {
    if (!aiQuery.trim()) return;
    setAiLoading(true); setAiResult(null); setAiSuggested([]);
    const summary = listings.map(l => `ID:${l.id} | "${l.title}" by ${l.name} | ${catOf(l.category).label} | ${l.desc}`).join("\n");
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514", max_tokens: 800,
          system: `You are a marketplace assistant for Bartr. Match user needs to listings. Never suggest illegal/sexual services. Reply ONLY valid JSON no backticks: {"message":"1-2 sentences","matchedIds":[up to 3 integer IDs],"tip":"one short tip"}`,
          messages: [{ role: "user", content: `Looking for: "${aiQuery}"\nListings:\n${summary}` }]
        })
      });
      const data = await res.json();
      const parsed = JSON.parse(data.content.map(b => b.text || "").join("").replace(/```json|```/g, "").trim());
      setAiResult(parsed);
      setAiSuggested(listings.filter(l => (parsed.matchedIds || []).includes(l.id)));
    } catch { setAiResult({ message: "Couldn't search right now. Try browsing by category.", matchedIds: [], tip: "" }); }
    setAiLoading(false);
  };

  const submitListing = () => {
    if (!newListing.title || !newListing.category) return;
    const plan = PLANS[membership.plan];
    const effectiveLimit = plan.listingLimit + referrals.length;
    if (myListings.length >= effectiveLimit) {
      setShowPricing("upgrade");
      return;
    }
    const l = { id: Date.now(), name: profile.name || "You", avatar: (profile.name || "YO").slice(0, 2).toUpperCase(), ...newListing, rating: null, trades: 0, mine: true, listedAt: Date.now() };
    setListings(p => [l, ...p]); setMyListings(p => [l, ...p]);
    setNewListing({ title: "", desc: "", category: "", type: "service", photos: [], contractDefaults: { offer: "", lookingFor: "", conditions: "", contractType: "one-time" }, blockedDates: [] });
    showToast("Listing published! 🎉"); setScreen("browse");
  };

  const EXPIRY_DAYS = 30;
  const archiveListing = (listing) => {
    setMyListings(prev => prev.filter(l => l.id !== listing.id));
    setListings(prev => prev.filter(l => l.id !== listing.id));
    setArchivedListings(prev => [...prev, { ...listing, archivedAt: Date.now() }]);
    showToast("Listing archived.");
  };

  const renewListing = (listing) => {
    const renewed = { ...listing, listedAt: Date.now() };
    setMyListings(prev => prev.map(l => l.id === listing.id ? renewed : l));
    setListings(prev => prev.map(l => l.id === listing.id ? renewed : l));
    showToast("Listing renewed for 30 days! 🌿");
  };

  const unarchiveListing = (listing) => {
    setArchivedListings(prev => prev.filter(l => l.id !== listing.id));
    const restored = { ...listing, archivedAt: undefined, listedAt: Date.now() };
    setMyListings(prev => [restored, ...prev]);
    setListings(prev => [restored, ...prev]);
    showToast("Listing restored! 🎉");
  };

  // Referral code: deterministic from user id/email
  const referralCode = authUser
    ? "TF-" + (authUser.id || authUser.email || "").replace(/[^a-zA-Z0-9]/g, "").slice(0, 6).toUpperCase().padEnd(6, "X")
    : null;

  const recordReferral = (code) => {
    if (code && code !== referralCode && !referrals.find(r => r.code === code)) {
      setReferrals(prev => [...prev, { code, redeemedAt: Date.now() }]);
    }
  };

  const filtered = (filterCat === "all" ? listings : listings.filter(l => l.category === filterCat))
    .filter(l => !blocked.has(l.id))
    .filter(l => !filterAvail || l.availability !== "closed")
    .filter(l => {
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      const cat = catOf(l.category);
      return (
        l.title?.toLowerCase().includes(q) ||
        l.desc?.toLowerCase().includes(q) ||
        l.name?.toLowerCase().includes(q) ||
        l.businessName?.toLowerCase().includes(q) ||
        cat.label?.toLowerCase().includes(q)
      );
    })
    .sort((a, b) => {
      const aBoost = activeBoosted.includes(a.id) ? 1 : 0;
      const bBoost = activeBoosted.includes(b.id) ? 1 : 0;
      return bBoost - aBoost;
    });
  const visibleListings = listings.filter(l => !blocked.has(l.id));

  // Trending score: saves (favorites) × 2 + conversations + views
  const trendingListings = [...visibleListings]
    .filter(l => !l.mine)
    .map(l => ({
      ...l,
      _trend: (favorites.has(l.id) ? 2 : 0) +
              conversations.filter(c => c.listing?.id === l.id).length +
              (listingViews[l.id] || 0) +
              (l.trades || 0) * 0.1,
    }))
    .sort((a, b) => b._trend - a._trend)
    .slice(0, 8);

  // Skeleton flash on filter/search change in browse
  useEffect(() => {
    if (screen !== "browse") return;
    setBrowseLoading(true);
    const t = setTimeout(() => setBrowseLoading(false), 320);
    return () => clearTimeout(t);
  }, [filterCat, searchQuery, filterAvail]);

  // ── HOME PERSONALISATION ──────────────────────────────────────────────────
  const suggestedListings = (() => {
    const lf = (profile.lookingFor || "").toLowerCase().trim();
    if (!lf || !profileDone) return [];
    const keywords = lf.split(/[\s,]+/).filter(w => w.length > 2);
    if (!keywords.length) return [];
    return visibleListings
      .filter(l => !l.mine && l.availability !== "closed")
      .map(l => {
        const haystack = [l.title, l.desc, l.category, catOf(l.category).label, l.name, l.businessName].join(" ").toLowerCase();
        const score = keywords.reduce((s, kw) => {
          if (l.title?.toLowerCase().includes(kw)) return s + 10;
          if (catOf(l.category).label?.toLowerCase().includes(kw)) return s + 6;
          if (haystack.includes(kw)) return s + 3;
          return s;
        }, 0);
        return { ...l, _score: score };
      })
      .filter(l => l._score > 0)
      .sort((a, b) => b._score - a._score)
      .slice(0, 3);
  })();

  const recentListings = [...visibleListings]
    .filter(l => !l.mine)
    .sort((a, b) => b.id - a.id)
    .slice(0, 3);

  const greeting = (() => {
    const h = new Date().getHours();
    const time = h < 12 ? "Good morning" : h < 17 ? "Good afternoon" : "Good evening";
    const name = profile.name?.split(" ")[0] || "";
    return name ? `${time}, ${name}` : time;
  })();
  const activeConv = conversations.find(c => c.id === activeConvId);

  // ── AUTH GATE ─────────────────────────────────────────────────────────────
  if (!authUser) {
    return (
      <AuthGate
        screen={authScreen}
        setScreen={setAuthScreen}
        onAuth={(user) => {
          setAuthUser(user);
          try { window.storage.set("tf:auth", JSON.stringify(user)); } catch (_) {}
          setProfile(p => ({ ...p, email: user.email, name: user.name || "" }));
          showToast(user.name ? `Welcome back, ${user.name}! 👋` : "Signed in! Set up your profile to get started.");
        }}
        onReferral={recordReferral}
      />
    );
  }

  // ── LOADING SPLASH (while session restores) ───────────────────────────────
  if (!storageReady) {
    return (
      <div style={{ fontFamily: "Plus Jakarta Sans, sans-serif", background: "#F0EEE9", minHeight: "100vh", maxWidth: 720, margin: "0 auto", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 16 }}>
        <svg width="52" height="52" viewBox="0 0 96 96"><circle cx="48" cy="48" r="44" fill="#1A1A1A"/><text x="22" y="68" fontFamily="Georgia,serif" fontSize="54" fontWeight="800" fill="white">B</text><line x1="58" y1="22" x2="73" y2="22" stroke="#E85D3A" strokeWidth="4" strokeLinecap="round"/><polygon points="80,22 70,17 70,27" fill="#E85D3A"/><line x1="80" y1="32" x2="65" y2="32" stroke="white" strokeWidth="4" strokeLinecap="round"/><polygon points="58,32 68,27 68,37" fill="white"/></svg>
        <div style={{ width: 36, height: 36, border: "3px solid #E5E2DC", borderTop: "3px solid #E85D3A", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        <div style={{ fontFamily: "Plus Jakarta Sans", fontSize: 13, color: "#aaa" }}>Restoring your session…</div>
      </div>
    );
  }

  const theme = THEMES[currentTheme] || THEMES.natural;

  return (
    <div className="tf-app" style={{ fontFamily: "Plus Jakarta Sans, sans-serif", background: theme.bg, minHeight: "100vh", color: theme.text }}>
      <style>{buildThemeCSS(theme)}</style>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Plus+Jakarta+Sans:wght@300;400;500;600;700&display=swap');
        *{box-sizing:border-box;margin:0;padding:0}
        .bp{background:#1A1A1A;color:#F0EEE9;border:none;border-radius:100px;padding:13px 24px;font-family:'Plus Jakarta Sans',sans-serif;font-size:14px;font-weight:500;cursor:pointer;transition:all .2s;width:100%}
        .bp:hover{background:#3D5040;transform:translateY(-1px)} .bp:active{transform:scale(.97)!important} .bp:disabled{opacity:.4;cursor:default;transform:none}
        .bg{background:transparent;color:#1A1A1A;border:1.5px solid #1A1A1A;border-radius:100px;padding:11px 22px;font-family:'Plus Jakarta Sans',sans-serif;font-size:14px;cursor:pointer;transition:all .2s;width:100%}
        .bg:hover{background:#1A1A1A;color:#F0EEE9} .bg:active{transform:scale(.97)}
        .bgr{background:#E85D3A;color:#fff;border:none;border-radius:100px;padding:13px;font-family:'Plus Jakarta Sans',sans-serif;font-size:14px;font-weight:500;cursor:pointer;width:100%;transition:all .2s}
        .bgr:hover{background:#3D9E72} .bgr:active{transform:scale(.97)}
        .inp{width:100%;padding:12px 15px;border:1.5px solid #DDD8CE;border-radius:12px;font-family:'Plus Jakarta Sans',sans-serif;font-size:14px;background:#FDFCFA;color:#1A1A1A;outline:none;transition:border .2s}
        .inp:focus{border-color:#E85D3A} textarea.inp{resize:none;min-height:80px}
        .card{background:#fff;border-radius:18px;padding:16px;box-shadow:0 2px 12px rgba(26,26,26,.06);margin-bottom:9px;cursor:pointer;transition:transform .15s,box-shadow .15s,border-color .15s;border:1.5px solid transparent}
        .card:hover{transform:translateY(-2px);box-shadow:0 6px 22px rgba(26,26,26,.1);border-color:#E0DDD6} .card:active{transform:scale(.985)}
        .ava{border-radius:50%;display:flex;align-items:center;justify-content:center;font-family:'Plus Jakarta Sans',sans-serif;font-weight:600;color:#fff;flex-shrink:0}
        .chip{padding:6px 13px;border-radius:100px;border:1.5px solid #DDD8CE;font-family:'Plus Jakarta Sans',sans-serif;font-size:12px;cursor:pointer;white-space:nowrap;background:#fff;transition:all .15s;color:#1A1A1A}
        .chip.on{background:#1A1A1A;color:#F0EEE9;border-color:#1A1A1A} .chip:active{transform:scale(.94)}
        @keyframes shimmer{0%{background-position:-400px 0}100%{background-position:400px 0}}
        .skel{border-radius:8px;background:linear-gradient(90deg,#E8E5E0 25%,#F0EDE8 50%,#E8E5E0 75%);background-size:800px 100%;animation:shimmer 1.4s infinite}
        @keyframes screenIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
        .screen-in{animation:screenIn .22s ease both}
        .overlay{position:fixed;inset:0;background:rgba(0,0,0,.5);z-index:100;display:flex;align-items:flex-end;justify-content:center;animation:fi .2s}
        .sheet{background:#fff;border-radius:26px 26px 0 0;padding:22px 22px 52px;width:100%;max-width:720px;animation:su .25s;max-height:92vh;overflow-y:auto}
        @keyframes fi{from{opacity:0}to{opacity:1}} @keyframes su{from{transform:translateY(60px);opacity:0}to{transform:translateY(0);opacity:1}}
        @media(min-width:601px){.overlay{align-items:center}.sheet{border-radius:26px;width:auto;min-width:440px}}
        .toast{position:fixed;bottom:96px;left:50%;transform:translateX(-50%);background:#1A1A1A;color:#fff;padding:11px 22px;border-radius:100px;font-family:'Plus Jakarta Sans',sans-serif;font-size:13px;z-index:300;white-space:nowrap;box-shadow:0 4px 18px rgba(0,0,0,.2)}
        .cat-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:9px} @media(min-width:600px){.cat-grid{grid-template-columns:repeat(5,1fr)}}
        .cat-tile{border-radius:13px;padding:13px 8px;text-align:center;cursor:pointer;transition:all .2s;border:2px solid transparent;background:#fff}
        .cat-tile.sel{border-color:#1A1A1A}
        .stitle{font-family:'Instrument Serif',serif;color:#1A1A1A;letter-spacing:-0.01em}
        .tbtn{flex:1;padding:10px;border-radius:11px;border:1.5px solid #DDD8CE;background:#fff;font-family:'Plus Jakarta Sans',sans-serif;font-size:13px;cursor:pointer;transition:all .15s;color:#555;text-align:center}
        .tbtn.on{background:#1A1A1A;color:#fff;border-color:#1A1A1A}
        .warn{background:#FFF8F0;border:1.5px solid #F0B429;border-radius:13px;padding:11px 13px;margin-bottom:14px;display:flex;gap:9px;align-items:flex-start}
        .ai-box{background:linear-gradient(135deg,#1A1A1A 0%,#3D5C42 100%);border-radius:18px;padding:18px;margin-bottom:16px}
        .ai-inp{flex:1;padding:11px 15px;border-radius:100px;border:none;font-family:'Plus Jakarta Sans',sans-serif;font-size:13px;background:rgba(255,255,255,.15);color:#fff;outline:none}
        .ai-inp::placeholder{color:rgba(255,255,255,.5)}
        .ai-res{background:rgba(255,255,255,.1);border-radius:13px;padding:13px;margin-top:11px}
        .cbox{background:#FDFCFA;border:1.5px solid #E0DDD6;border-radius:14px;padding:15px;font-family:'Plus Jakarta Sans',sans-serif;font-size:11.5px;color:#444;white-space:pre-wrap;line-height:1.75;max-height:260px;overflow-y:auto}
        .badge{display:inline-flex;align-items:center;gap:4px;padding:3px 10px;border-radius:100px;font-size:10px;font-family:'Plus Jakarta Sans',sans-serif;font-weight:500}
        .pbar{height:4px;background:#E5E2DC;border-radius:100px;overflow:hidden}
        .pfill{height:100%;background:#E85D3A;border-radius:100px;transition:width .3s}
        /* CHAT */
        .chat-wrap{display:flex;flex-direction:column;height:calc(100vh - 130px)}
        .chat-msgs{flex:1;overflow-y:auto;padding:12px 0 8px}
        .bubble{max-width:78%;padding:10px 14px;border-radius:18px;font-family:'Plus Jakarta Sans',sans-serif;font-size:13px;line-height:1.5;margin-bottom:6px;word-break:break-word}
        .bubble.me{background:#1A1A1A;color:#fff;border-bottom-right-radius:4px;margin-left:auto}
        .bubble.them{background:var(--tf-card,#fff);color:var(--tf-text,#1A1A1A);border-bottom-left-radius:4px;box-shadow:0 1px 6px rgba(0,0,0,.07)}
        .bubble.sys{background:var(--tf-input,#F0F7F2);color:#E85D3A;border-radius:12px;font-size:12px;text-align:center;margin:6px auto;max-width:90%;font-weight:500}
        .chat-input-row{display:flex;gap:8px;padding:10px 0 0;border-top:1px solid var(--tf-border,#EDEAE4);align-items:flex-end}
        .chat-inp{flex:1;padding:10px 14px;border:1.5px solid var(--tf-border,#DDD8CE);border-radius:20px;font-family:'Plus Jakarta Sans',sans-serif;font-size:13px;background:var(--tf-input,#FDFCFA);color:var(--tf-text,#1A1A1A);outline:none;resize:none;max-height:80px;line-height:1.4}
        .chat-inp:focus{border-color:#E85D3A}
        .send-btn{width:40px;height:40px;border-radius:50%;background:#1A1A1A;border:none;cursor:pointer;display:flex;align-items:center;justify-content:center;flex-shrink:0;transition:background .2s}
        .send-btn:hover{background:#E85D3A}
        /* intake chat */
        .intake-msg{padding:10px 14px;border-radius:16px;font-family:'Plus Jakarta Sans',sans-serif;font-size:13px;line-height:1.55;margin-bottom:8px;max-width:88%}
        .intake-msg.ai{background:#1A1A1A;color:#fff;border-bottom-left-radius:4px}
        .intake-msg.user{background:var(--tf-input,#E8F5EC);color:var(--tf-text,#1A1A1A);border-bottom-right-radius:4px;margin-left:auto}
        .intake-msg.sys{background:#FFF8F0;color:#7A5C00;border-radius:12px;font-size:12px;max-width:100%;text-align:center;padding:8px 14px}
        .nav-i{display:flex;flex-direction:column;align-items:center;gap:3px;cursor:pointer;padding:8px 6px;flex:1;position:relative}
        .nl{font-size:10px;font-family:'Plus Jakarta Sans',sans-serif;color:inherit}
        .nav-i.on .nl{color:inherit;font-weight:600}
        .badge-dot{position:absolute;top:6px;right:50%;margin-right:-16px;width:8px;height:8px;border-radius:50%;background:#E85C7A;border:2px solid #fff}
        .status-bar{display:flex;align-items:center;gap:8px;padding:10px 14px;border-radius:13px;margin-bottom:14px;font-family:'Plus Jakarta Sans',sans-serif;font-size:12px}
        .status-pending{background:#FFF3E0;color:#E8854A}
        .status-countered{background:#EEF2FF;color:#4B8EF0}
        .status-agreed{background:#E8F5EC;color:#E85D3A}
        .status-terminated{background:#F3F3F3;color:#999}
        .status-disputed{background:#FEF3C7;color:#D97706}
        /* account type picker */
        .acct-type{border-radius:18px;padding:18px 16px;border:2px solid var(--tf-border,#E5E2DC);background:var(--tf-card,#fff);cursor:pointer;transition:all .2s;text-align:left}
        .acct-type.sel{border-color:var(--tf-primary,#1A1A1A);background:var(--tf-input,#F4F8F4)}
        .acct-type:hover{border-color:#aaa}
        /* social link row */
        .social-row{display:flex;gap:8px;align-items:center;margin-bottom:8px}
        .social-icon{width:34px;height:34px;border-radius:10px;background:#F0F7F2;display:flex;align-items:center;justify-content:center;font-size:16px;flex-shrink:0}
        /* toggle */
        .toggle-wrap{display:flex;align-items:center;justify-content:space-between;background:var(--tf-bg,#F0EEE9);border-radius:12px;padding:11px 14px;margin-bottom:14px}
        .toggle-track{width:44px;height:24px;border-radius:100px;transition:background .2s;cursor:pointer;position:relative;flex-shrink:0}
        .toggle-thumb{width:20px;height:20px;border-radius:50%;background:#fff;position:absolute;top:2px;transition:left .2s;box-shadow:0 1px 4px rgba(0,0,0,.2)}
        /* biz badge */
        .biz-badge{display:inline-flex;align-items:center;gap:3px;background:#E8F0FE;color:#4B8EF0;padding:2px 8px;border-radius:100px;font-size:10px;font-family:'Plus Jakarta Sans',sans-serif;font-weight:600}
        /* social chip on profile */
        .social-chip{display:inline-flex;align-items:center;gap:5px;padding:6px 12px;border-radius:100px;background:#fff;border:1.5px solid #E5E2DC;font-family:'Plus Jakarta Sans',sans-serif;font-size:12px;color:#1A1A1A;cursor:pointer;transition:all .15s;text-decoration:none}
        .social-chip:hover{border-color:#E85D3A;color:#E85D3A}
        /* photo upload */
        .photo-ring{width:88px;height:88px;border-radius:50%;border:2.5px dashed var(--tf-border,#DDD8CE);display:flex;flex-direction:column;align-items:center;justify-content:center;cursor:pointer;margin:0 auto 6px;overflow:hidden;transition:border-color .2s;position:relative;background:var(--tf-bg,#F0EEE9)}
        .photo-ring.biz{border-radius:22px}
        .photo-ring:hover{border-color:#E85D3A}
        .photo-ring img{width:100%;height:100%;object-fit:cover;position:absolute;inset:0}
        .photo-change{position:absolute;bottom:0;left:0;right:0;background:rgba(0,0,0,.45);color:#fff;font-family:'Plus Jakarta Sans',sans-serif;font-size:10px;text-align:center;padding:4px 0}
        /* skill tags */
        .skill-wrap{display:flex;flex-wrap:wrap;gap:7px;margin-top:8px}
        .skill-tag{display:inline-flex;align-items:center;gap:5px;padding:5px 11px;border-radius:100px;background:#E8F5EC;color:#2D7A50;font-family:'Plus Jakarta Sans',sans-serif;font-size:12px;font-weight:500}
        .skill-tag .rm{background:none;border:none;cursor:pointer;color:#2D7A50;font-size:14px;padding:0;line-height:1}
        /* profile section card */
        .p-section{background:#fff;border-radius:16px;padding:14px 16px;margin-bottom:12px;box-shadow:0 1px 8px rgba(26,26,26,.05)}
        .p-section-title{font-family:'Plus Jakarta Sans',sans-serif;font-size:10px;font-weight:700;color:#999;letter-spacing:.08em;margin-bottom:10px;text-transform:uppercase}
        .p-row{display:flex;align-items:flex-start;gap:10px;margin-bottom:8px}
        .p-row:last-child{margin-bottom:0}
        .p-label{font-family:'Plus Jakarta Sans',sans-serif;font-size:11px;color:#aaa;width:90px;flex-shrink:0;padding-top:1px}
        .p-val{font-family:'Plus Jakarta Sans',sans-serif;font-size:13px;color:#333;flex:1;line-height:1.5}
        .avail-pill{display:inline-flex;align-items:center;gap:5px;padding:4px 12px;border-radius:100px;font-family:'Plus Jakarta Sans',sans-serif;font-size:12px;font-weight:500}
        .avail-pill.open{background:#E8F5EC;color:#2D7A50}
        .avail-pill.limited{background:#FFF8E1;color:#F59E0B}
        .avail-pill.closed{background:#FEE2E2;color:#EF4444}
        /* star rating */
        .star-row{display:flex;gap:5px;justify-content:center;margin:16px 0}
        .star-btn{background:none;border:none;cursor:pointer;font-size:36px;transition:transform .1s;padding:0 2px;line-height:1}
        .star-btn:hover{transform:scale(1.15)}
        .star-btn.lit{filter:drop-shadow(0 0 4px rgba(245,158,11,.5))}
        /* review card */
        .rev-card{padding:12px 0;border-bottom:1px solid #F0EDE6}
        .rev-card:last-child{border-bottom:none;padding-bottom:0}
        .rev-avatar{width:32px;height:32px;border-radius:50%;background:#1A1A1A;display:flex;align-items:center;justify-content:center;font-family:'Plus Jakarta Sans',sans-serif;font-size:11px;font-weight:600;color:#fff;flex-shrink:0;overflow:hidden}
        /* structured contract */
        .ctrct-wrap{border-radius:14px;overflow:hidden;border:1.5px solid #E5E2DC;margin-bottom:4px;max-height:65vh;overflow-y:auto}
        .ctrct-header{background:#1A1A1A;color:#fff;padding:12px 16px}
        .ctrct-mine{background:#FFF8E1;border-left:4px solid #F0B429;padding:14px 16px}
        .ctrct-mine-label{font-family:'Plus Jakarta Sans',sans-serif;font-size:10px;font-weight:700;color:#B45309;letter-spacing:.08em;margin-bottom:6px;display:flex;align-items:center;gap:5px}
        .ctrct-theirs{background:#F4F8F4;padding:14px 16px;border-top:1px solid #E5E2DC}
        .ctrct-theirs-label{font-family:'Plus Jakarta Sans',sans-serif;font-size:10px;font-weight:700;color:#555;letter-spacing:.08em;margin-bottom:6px}
        .ctrct-body{font-family:'Plus Jakarta Sans',sans-serif;font-size:13px;color:#333;line-height:1.6;white-space:pre-wrap;word-break:break-word}
        .ctrct-disclaimer{background:#F0EEE9;padding:12px 16px;border-top:1px solid #E5E2DC}
        .ctrct-disclaimer p{font-family:'Plus Jakarta Sans',sans-serif;font-size:10.5px;color:#888;line-height:1.55}
        /* email confirm modal */
        .email-modal-row{display:flex;align-items:center;gap:10px;background:#F0EEE9;border-radius:12px;padding:11px 14px;margin-bottom:8px}
        .email-modal-icon{width:34px;height:34px;border-radius:50%;background:#1A1A1A;display:flex;align-items:center;justify-content:center;font-size:15px;flex-shrink:0}
        /* report modal */
        .report-opt{display:flex;align-items:center;gap:12px;padding:12px 14px;border-radius:13px;border:1.5px solid #E5E2DC;background:#FDFCFA;cursor:pointer;transition:all .15s;margin-bottom:8px}
        .report-opt.sel{border-color:#EF4444;background:#FEF2F2}
        .report-opt:hover{border-color:#ccc}
        /* card context menu */
        .ctx-btn{position:absolute;top:9px;right:9px;z-index:3;width:28px;height:28px;border-radius:50%;border:none;cursor:pointer;display:flex;align-items:center;justify-content:center;font-size:15px;line-height:1;background:rgba(0,0,0,0.38);color:#fff;backdrop-filter:blur(4px);transition:background .15s;flex-shrink:0}
        .ctx-btn:hover{background:rgba(0,0,0,0.58)}
        .ctx-menu{position:absolute;top:42px;right:9px;z-index:100;background:#fff;border-radius:14px;box-shadow:0 6px 28px rgba(0,0,0,.16);border:1px solid #EDEAE4;min-width:168px;overflow:hidden;animation:fadeIn .12s ease}
        @keyframes fadeIn{from{opacity:0;transform:scale(.95) translateY(-4px)}to{opacity:1;transform:scale(1) translateY(0)}}
        .ctx-item{display:flex;align-items:center;gap:10px;padding:11px 15px;fontFamily:'Plus Jakarta Sans',sans-serif;font-size:13px;cursor:pointer;transition:background .1s;border:none;background:none;width:100%;text-align:left}
        .ctx-item:hover{background:#F0EEE9}
        .ctx-item.danger{color:#EF4444}
        .ctx-item.danger:hover{background:#FEF2F2}
        /* search bar */
        .search-wrap{display:flex;align-items:center;gap:10px;background:#fff;border:1.5px solid #E5E2DC;border-radius:100px;padding:0 14px;height:42px;transition:border-color .15s;margin-bottom:13px}
        .search-wrap:focus-within{border-color:#E85D3A;box-shadow:0 0 0 3px rgba(76,175,130,.1)}
        .search-wrap input{flex:1;border:none;outline:none;fontFamily:'Plus Jakarta Sans',sans-serif;font-size:14px;color:#1A1A1A;background:transparent}
        .search-wrap input::placeholder{color:#bbb}
        .search-clear{background:none;border:none;cursor:pointer;color:#bbb;font-size:16px;padding:0;line-height:1;display:flex;align-items:center}
        .search-clear:hover{color:#888}
        /* view toggle */
        .view-toggle{display:flex;background:#F0EDE6;border-radius:100px;padding:3px;gap:2px}
        .view-btn{border:none;cursor:pointer;border-radius:100px;padding:5px 13px;fontFamily:'Plus Jakarta Sans',sans-serif;font-size:12px;fontWeight:500;transition:all .15s;background:transparent;color:#888}
        .view-btn.on{background:#fff;color:#1A1A1A;box-shadow:0 1px 4px rgba(0,0,0,.1)}
        /* map pin popup */
        .map-popup{position:absolute;bottom:0;left:0;right:0;background:#fff;border-top:1.5px solid #E5E2DC;border-radius:18px 18px 0 0;padding:16px;box-shadow:0 -4px 24px rgba(0,0,0,.1);animation:slideUp .18s ease}
        @keyframes slideUp{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}
        /* neighbourhood badge */
        .nbhd-badge{display:inline-flex;align-items:center;gap:4px;background:#F0EDE6;border-radius:100px;padding:2px 9px;fontFamily:'Plus Jakarta Sans',sans-serif;font-size:11px;color:#888}
        /* plan badge */
        .plan-badge{display:inline-flex;align-items:center;gap:4px;padding:3px 10px;border-radius:100px;font-family:'Plus Jakarta Sans',sans-serif;font-size:11px;font-weight:700}
        .plan-badge.free{background:#F0EDE6;color:#888}
        .plan-badge.pro{background:linear-gradient(135deg,#1A1A1A,#E85D3A);color:#fff}
        .plan-badge.verified{background:#FFF8E1;color:#F59E0B;border:1px solid #FCD34D}
        /* pricing card */
        .price-card{border-radius:18px;padding:20px;border:2px solid #E5E2DC;background:#fff;transition:border-color .2s}
        .price-card.highlight{border-color:#E85D3A;background:linear-gradient(160deg,#F7FDF9,#fff)}
        .price-feat{display:flex;align-items:center;gap:8px;fontFamily:'Plus Jakarta Sans',sans-serif;font-size:13px;color:#444;padding:4px 0}
        .price-feat.missing{color:#bbb}
        /* billing toggle */
        .bill-toggle{display:flex;background:#F0EDE6;border-radius:100px;padding:3px;gap:2px;width:fit-content;margin:0 auto 20px}
        .bill-btn{border:none;cursor:pointer;border-radius:100px;padding:6px 16px;font-family:'Plus Jakarta Sans',sans-serif;font-size:12px;font-weight:500;transition:all .15s;background:transparent;color:#888}
        .bill-btn.on{background:#fff;color:#1A1A1A;box-shadow:0 1px 4px rgba(0,0,0,.1)}
        /* schedule picker */
        .cal-header{display:flex;align-items:center;justify-content:space-between;margin-bottom:10px}
        .cal-nav{background:none;border:none;cursor:pointer;width:28px;height:28px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:16px;color:#555;transition:background .15s}
        .cal-nav:hover{background:#F0EDE6}
        .cal-grid{display:grid;grid-template-columns:repeat(7,1fr);gap:3px;margin-bottom:12px}
        .cal-dow{font-family:'Plus Jakarta Sans',sans-serif;font-size:10px;font-weight:600;color:#bbb;text-align:center;padding:3px 0;letter-spacing:.04em}
        .cal-day{font-family:'Plus Jakarta Sans',sans-serif;font-size:12px;color:#1A1A1A;text-align:center;padding:6px 2px;border-radius:8px;cursor:pointer;transition:all .15s;border:none;background:transparent}
        .cal-day:hover:not(.past):not(.empty){background:#F0EDE6}
        .cal-day.today{font-weight:700;color:#E85D3A}
        .cal-day.sel{background:#1A1A1A !important;color:#fff !important;font-weight:700;border-radius:8px}
        .cal-day.past{color:#ddd;cursor:default;pointer-events:none}
        .cal-day.empty{pointer-events:none}
        .cal-day.other{color:#ccc}
        .time-slots{display:flex;gap:7px;flex-wrap:wrap;margin-top:4px}
        .time-slot{font-family:'Plus Jakarta Sans',sans-serif;font-size:12px;padding:7px 13px;border-radius:100px;border:1.5px solid #E5E2DC;background:#fff;cursor:pointer;color:#555;transition:all .15s;white-space:nowrap}
        .time-slot:hover{border-color:#E85D3A;color:#1A1A1A}
        .time-slot.sel{background:#1A1A1A;border-color:#1A1A1A;color:#fff;font-weight:600}
        /* mock stripe */
        .stripe-field{width:100%;border:1.5px solid #E5E2DC;border-radius:12px;padding:12px 14px;font-family:'Plus Jakarta Sans',sans-serif;font-size:14px;color:#1A1A1A;background:#fff;outline:none;box-sizing:border-box;transition:border-color .15s}
        .stripe-field:focus{border-color:#E85D3A}
        /* notifications */
        .notif-panel{position:absolute;top:62px;right:0;left:0;z-index:200;background:#fff;border-bottom:1.5px solid #E5E2DC;box-shadow:0 8px 32px rgba(26,26,26,.13);max-height:72vh;display:flex;flex-direction:column;animation:slideDown .2s ease}
        @keyframes slideDown{from{opacity:0;transform:translateY(-8px)}to{opacity:1;transform:translateY(0)}}
        .notif-item{display:flex;gap:12px;align-items:flex-start;padding:12px 18px;border-bottom:1px solid #F5F2EE;cursor:pointer;transition:background .15s}
        .notif-item:hover{background:#F0EEE9}
        .notif-item.unread{background:#FAFFF9}
        .notif-item.unread:hover{background:#F0F9F3}
        .notif-icon{width:36px;height:36px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:17px;flex-shrink:0}
        .notif-dot{width:7px;height:7px;border-radius:50%;background:#E85D3A;flex-shrink:0;margin-top:6px}
        /* DESKTOP LAYOUT */
        .tf-sidebar{display:none}
        @media(min-width:768px){
          .tf-app{display:flex;flex-direction:row;align-items:stretch}
          .tf-sidebar{display:flex;flex-direction:column;width:220px;flex-shrink:0;padding:28px 16px 28px;border-right:1px solid var(--tf-border,#EDEAE4);position:sticky;top:0;height:100vh;overflow-y:auto;background:var(--tf-nav,#fff)}
          .tf-sidebar-logo{margin-bottom:32px;padding:0;display:flex;justify-content:center;align-items:center}
          .tf-sidebar-item{display:flex;align-items:center;gap:12px;padding:11px 12px;border-radius:12px;cursor:pointer;transition:background .15s;font-family:'Plus Jakarta Sans',sans-serif;font-size:14px;color:var(--tf-muted,#888);margin-bottom:4px;position:relative;border:none;background:none;width:100%;text-align:left}
          .tf-sidebar-item:hover{background:var(--tf-bg,#F0EEE9);color:var(--tf-text,#1A1A1A)}
          .tf-sidebar-item.on{background:var(--tf-bg,#F0EEE9);color:var(--tf-primary,#1A1A1A);font-weight:600}
          .tf-sidebar-icon{font-size:18px;width:24px;text-align:center;flex-shrink:0}
          .tf-main{flex:1;min-width:0;display:flex;flex-direction:column}
          .tf-bottom-nav{display:none !important}
          .tf-content{max-height:calc(100vh - 72px) !important;padding-bottom:32px !important}
        }
      `}</style>

      {/* DESKTOP SIDEBAR */}
      <div className="tf-sidebar">
        <div className="tf-sidebar-logo">
          <svg width="64" height="64" viewBox="0 0 96 96"><circle cx="48" cy="48" r="44" fill="#1A1A1A"/><text x="22" y="68" fontFamily="Georgia,serif" fontSize="54" fontWeight="800" fill="white">B</text><line x1="58" y1="22" x2="73" y2="22" stroke="#E85D3A" strokeWidth="4" strokeLinecap="round"/><polygon points="80,22 70,17 70,27" fill="#E85D3A"/><line x1="80" y1="32" x2="65" y2="32" stroke="white" strokeWidth="4" strokeLinecap="round"/><polygon points="58,32 68,27 68,37" fill="white"/></svg>
        </div>
        {[
          { id: "home",     Icon: Home,           label: "Home" },
          { id: "browse",   Icon: Search,         label: "Browse",  badge: savedSearchNewCount > 0 },
          { id: "history",  Icon: Clock,          label: "History" },
          { id: "messages", Icon: MessageSquare,  label: "Messages", badge: unreadCount > 0 },
          { id: "profile",  Icon: User,           label: "Profile" },
        ].map(({ id, Icon, label, badge }) => (
          <button key={id} className={`tf-sidebar-item ${screen === id ? "on" : ""}`}
            onClick={() => { if (id === "messages") setActiveConvId(null); if (id !== "browse") setSearchQuery(""); setScreen(id); }}>
            <span className="tf-sidebar-icon"><Icon size={18} strokeWidth={1.75} /></span>
            {label}
            {badge && <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#E85C7A", marginLeft: "auto", flexShrink: 0, display: "inline-block" }} />}
          </button>
        ))}
      </div>

      {/* MAIN PANEL */}
      <div className="tf-main">

      {/* HEADER */}
      <div style={{ padding: "18px 22px 0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          {/* Desktop header logo — arrows + wordmark */}
          <svg width="28" height="18" viewBox="0 0 96 56"><line x1="10" y1="14" x2="63" y2="14" stroke="#1A1A1A" strokeWidth="10" strokeLinecap="round"/><polygon points="86,14 61,2 61,26" fill="#1A1A1A"/><line x1="86" y1="42" x2="33" y2="42" stroke="#E85D3A" strokeWidth="10" strokeLinecap="round"/><polygon points="10,42 35,30 35,54" fill="#E85D3A"/></svg>
          <span style={{ fontFamily: "Georgia,serif", fontSize: 20, fontWeight: 800, letterSpacing: "-0.5px", color: "#1A1A1A" }}>Bartr</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          {/* Search */}
          <div style={{ width: 36, height: 36, borderRadius: "50%", background: theme.input, color: theme.subtext, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", transition: "background .2s" }}
            onClick={() => { setScreen("browse"); setTimeout(() => searchRef.current?.focus(), 80); }}>
            <Search size={17} strokeWidth={1.75} />
          </div>

          {/* Bell */}
          <div style={{ position: "relative", cursor: "pointer" }} onClick={() => setNotifOpen(o => !o)}>
            <div style={{ width: 36, height: 36, borderRadius: "50%", background: notifOpen ? theme.primary : theme.input, color: notifOpen ? theme.bg : theme.subtext, display: "flex", alignItems: "center", justifyContent: "center", transition: "background .2s" }}>
              <Bell size={17} strokeWidth={1.75} />
            </div>
            {unreadNotifs > 0 && (
              <div style={{ position: "absolute", top: -2, right: -2, minWidth: 17, height: 17, borderRadius: 100, background: "#E85C7A", border: "2px solid " + theme.bg, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "Plus Jakarta Sans", fontSize: 9, fontWeight: 700, color: "#fff", padding: "0 3px" }}>
                {unreadNotifs > 9 ? "9+" : unreadNotifs}
              </div>
            )}
          </div>

          {/* Avatar */}
          <div onClick={() => setScreen("profile")} style={{ width: 36, height: 36, borderRadius: profileDone && profile.accountType === "business" ? "10px" : "50%", background: profileDone ? "#1A1A1A" : "#E5E2DC", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", overflow: "hidden", flexShrink: 0 }}>
            {profileDone && profile.photo
              ? <img src={profile.photo} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              : profileDone
                ? <span style={{ color: "#fff", fontFamily: "Plus Jakarta Sans", fontSize: 11, fontWeight: 600 }}>{(profile.businessName || profile.name || authUser.email).slice(0, 2).toUpperCase()}</span>
                : <span style={{ fontSize: 15 }}>👤</span>}
          </div>

        </div>
      </div>

      {/* NOTIFICATIONS PANEL */}
      {notifOpen && (
        <NotificationsPanel
          notifications={notifications}
          onMarkAllRead={() => setNotifications(prev => prev.map(n => ({ ...n, read: true })))}
          onMarkRead={(id) => setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n))}
          onClear={() => setNotifications([])}
          onNavigate={(meta) => {
            setNotifOpen(false);
            if (meta.convId) { openConversation(meta.convId); }
          }}
          onClose={() => setNotifOpen(false)}
          notifPrefs={notifPrefs}
          onTogglePref={(type) => setNotifPrefs(p => ({ ...p, [type]: !p[type] }))}
        />
      )}

      {/* CONTENT */}
      <div className="tf-content" style={{ padding: "0 22px 108px", marginTop: 16, overflowY: "auto", maxHeight: "calc(100vh - 125px)" }}>

        {/* ── HOME ── */}
        {screen === "home" && (
          <div className="screen-in">
            {/* Greeting */}
            {profileDone ? (
              <div style={{ marginBottom: 16 }}>
                <p className="stitle" style={{ fontSize: 22, lineHeight: 1.2, marginBottom: 3 }}>{greeting} 👋</p>
                <p style={{ fontFamily: "Plus Jakarta Sans", fontSize: 13, color: "var(--tf-sub,#777)", lineHeight: 1.6 }}>
                  {profile.lookingFor
                    ? `Looking for: ${profile.lookingFor.length > 60 ? profile.lookingFor.slice(0, 57) + "…" : profile.lookingFor}`
                    : "What are you looking to trade today?"}
                </p>
              </div>
            ) : (
              <div style={{ marginBottom: 16 }}>
                <p className="stitle" style={{ fontSize: 23, lineHeight: 1.2, marginBottom: 5 }}>Exchange skills,<br />goods & services.</p>
                <p style={{ fontFamily: "Plus Jakarta Sans", fontSize: 13, color: "var(--tf-sub,#777)", marginBottom: 0, lineHeight: 1.6 }}>Connect with your community. Barter, trade, or sell what you do best.</p>
              </div>
            )}

            {/* Community stats */}
            <div style={{ display: "flex", gap: 8, marginBottom: 18, flexWrap: "wrap" }}>
              {[["247", "Members"], ["89", "Listings"], ["1.2k", "Trades"]].map(([n, l]) => (
                <div key={l} style={{ display: "flex", alignItems: "center", gap: 6, background: "var(--tf-card,#fff)", borderRadius: 100, padding: "6px 14px", boxShadow: "0 1px 4px rgba(26,26,26,.07)" }}>
                  <span className="stitle" style={{ fontSize: 14 }}>{n}</span>
                  <span style={{ fontFamily: "Plus Jakarta Sans", fontSize: 11, color: "var(--tf-muted,#999)" }}>{l}</span>
                </div>
              ))}
            </div>

            <AiBox aiQuery={aiQuery} setAiQuery={setAiQuery} loading={aiLoading} result={aiResult} suggested={aiSuggested} run={runAiSearch} onSelect={l => setSelectedListing(l)} />

            {/* Expiry nudge — home screen */}
            {profileDone && (() => {
              const now = Date.now();
              const expiring = myListings.filter(l => {
                if (!l.listedAt) return false;
                const daysLeft = Math.ceil(EXPIRY_DAYS - (now - l.listedAt) / (1000*60*60*24));
                return daysLeft <= 5;
              });
              if (expiring.length === 0) return null;
              const expired = expiring.filter(l => Math.ceil(EXPIRY_DAYS - (now - l.listedAt) / (1000*60*60*24)) <= 0);
              return (
                <div style={{ background: expired.length > 0 ? "#FEF2F2" : "#FFFBEB", border: `1.5px solid ${expired.length > 0 ? "#FECACA" : "#FCD34D"}`, borderRadius: 16, padding: "13px 16px", marginBottom: 16, display: "flex", alignItems: "center", gap: 12 }}>
                  <span style={{ fontSize: 22 }}>{expired.length > 0 ? "⏰" : "⚠️"}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontFamily: "Plus Jakarta Sans", fontSize: 13, fontWeight: 700, color: expired.length > 0 ? "#DC2626" : "#92400E" }}>
                      {expired.length > 0 ? `${expired.length} listing${expired.length > 1 ? "s" : ""} expired` : `${expiring.length} listing${expiring.length > 1 ? "s" : ""} expiring soon`}
                    </div>
                    <div style={{ fontFamily: "Plus Jakarta Sans", fontSize: 11.5, color: expired.length > 0 ? "#EF4444" : "#B45309", marginTop: 2 }}>
                      Renew to stay visible to traders.
                    </div>
                  </div>
                  <button onClick={() => setScreen("profile")} style={{ background: expired.length > 0 ? "#DC2626" : "#D97706", border: "none", borderRadius: 100, padding: "7px 14px", fontFamily: "Plus Jakarta Sans", fontSize: 12, fontWeight: 700, color: "#fff", cursor: "pointer", flexShrink: 0 }}>View →</button>
                </div>
              );
            })()}

            {/* For you — personalised */}
            {profileDone && suggestedListings.length > 0 && (
              <>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 9 }}>
                  <div>
                    <div className="stitle" style={{ fontSize: 15 }}>For you ✨</div>
                    <div style={{ fontFamily: "Plus Jakarta Sans", fontSize: 11, color: "var(--tf-muted,#aaa)", marginTop: 1 }}>Based on what you're looking for</div>
                  </div>
                  <span style={{ fontFamily: "Plus Jakarta Sans", fontSize: 12, color: "#E85D3A", cursor: "pointer" }} onClick={() => setScreen("browse")}>See all →</span>
                </div>
                {suggestedListings.map(l => <ListingCard key={l.id} listing={l} onClick={() => openListing(l)} isFav={favorites.has(l.id)} isReported={reported.has(l.id)} onFav={cardFav} onReport={cardReport} onBlock={cardBlock} isBoosted={activeBoosted.includes(l.id)} />)}
              </>
            )}

            {/* Nudge to fill in lookingFor */}
            {profileDone && !profile.lookingFor && (
              <div style={{ background: "linear-gradient(135deg, #F0F7F2, #E8F5E9)", border: "1.5px solid #C8E6C9", borderRadius: 18, padding: "16px 18px", marginBottom: 18, display: "flex", gap: 13, alignItems: "center" }}>
                <span style={{ fontSize: 28 }}>🎯</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontFamily: "'Instrument Serif',serif", fontSize: 15, color: "var(--tf-text,#1A1A1A)", marginBottom: 3 }}>Tell us what you need</div>
                  <div style={{ fontFamily: "Plus Jakarta Sans", fontSize: 12, color: "var(--tf-sub,#555)", lineHeight: 1.6 }}>Add a "looking for" to your profile and we'll surface matching listings right here.</div>
                </div>
                <button onClick={() => setEditingProfile(true)} style={{ background: "#1A1A1A", border: "none", borderRadius: 100, padding: "8px 14px", fontFamily: "Plus Jakarta Sans", fontSize: 12, fontWeight: 600, color: "#fff", cursor: "pointer", flexShrink: 0 }}>Update</button>
              </div>
            )}

            {/* Browse by category */}
            <div className="tf-home-grid">

              {/* ── LEFT COLUMN ── */}
              <div>
                <div className="stitle" style={{ fontSize: 15, marginBottom: 11 }}>Browse by category</div>
                <div className="cat-grid" style={{ marginBottom: 18 }}>
                  {CATEGORIES.map(cat => (
                    <div key={cat.id} className="cat-tile" style={{ background: cat.color + "18" }} onClick={() => { setFilterCat(cat.id); setScreen("browse"); }}>
                      <div style={{ fontSize: 20, marginBottom: 3 }}>{cat.icon}</div>
                      <div style={{ fontSize: 10.5, fontFamily: "Plus Jakarta Sans", color: "var(--tf-sub,#555)", lineHeight: 1.3 }}>{cat.label}</div>
                    </div>
                  ))}
                </div>

                {/* Recent / New */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 9 }}>
                  <div className="stitle" style={{ fontSize: 15 }}>{suggestedListings.length > 0 ? "New additions" : "Recent"}</div>
                  <span style={{ fontFamily: "Plus Jakarta Sans", fontSize: 12, color: "#E85D3A", cursor: "pointer" }} onClick={() => setScreen("browse")}>See all →</span>
                </div>
                {recentListings.length > 0
                  ? recentListings.map(l => <ListingCard key={l.id} listing={l} onClick={() => openListing(l)} isFav={favorites.has(l.id)} isReported={reported.has(l.id)} onFav={cardFav} onReport={cardReport} onBlock={cardBlock} isBoosted={activeBoosted.includes(l.id)} />)
                  : LISTINGS.slice(0, 3).filter(l => !blocked.has(l.id)).map(l => <ListingCard key={l.id} listing={l} onClick={() => openListing(l)} isFav={favorites.has(l.id)} isReported={reported.has(l.id)} onFav={cardFav} onReport={cardReport} onBlock={cardBlock} isBoosted={activeBoosted.includes(l.id)} />)
                }
              </div>

              {/* ── RIGHT COLUMN (hidden on mobile) ── */}
              <div className="tf-home-aside">

            {/* Trending listings */}
            {trendingListings.length > 0 && (
              <div style={{ marginBottom: 22 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                  <div>
                    <div className="stitle" style={{ fontSize: 15 }}>🔥 Trending</div>
                    <div style={{ fontFamily: "Plus Jakarta Sans", fontSize: 11, color: "var(--tf-muted,#aaa)", marginTop: 1 }}>Most active right now</div>
                  </div>
                  <span style={{ fontFamily: "Plus Jakarta Sans", fontSize: 12, color: "#E85D3A", cursor: "pointer" }} onClick={() => { setBrowseTab("trending"); setScreen("browse"); }}>See all →</span>
                </div>
                <div className="tf-trending-list">
                  {trendingListings.slice(0, 6).map((l, i) => {
                    const cat = CATEGORIES.find(c => c.id === l.category) || CATEGORIES[0];
                    const cover = l.photos?.[0];
                    return (
                      <div key={l.id} onClick={() => openListing(l)} className="tf-trending-item">
                        {cover
                          ? <div style={{ width: 44, height: 44, borderRadius: 10, overflow: "hidden", flexShrink: 0 }}><img src={cover} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} /></div>
                          : <div style={{ width: 44, height: 44, borderRadius: 10, background: cat.color + "20", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, flexShrink: 0 }}>{cat.icon}</div>
                        }
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontFamily: "Plus Jakarta Sans", fontSize: 12, fontWeight: 600, color: "var(--tf-text,#1A1A1A)", lineHeight: 1.3 }}>{l.title.slice(0, 32)}{l.title.length > 32 ? "…" : ""}</div>
                          <div style={{ fontFamily: "Plus Jakarta Sans", fontSize: 10.5, color: "var(--tf-muted,#aaa)", marginTop: 1 }}>{l.name}{l.rating ? ` · ⭐ ${l.rating}` : ""}</div>
                        </div>
                        {i === 0 && <span style={{ background: "#FEE2E2", color: "#EF4444", borderRadius: 100, padding: "2px 7px", fontFamily: "Plus Jakarta Sans", fontSize: 9, fontWeight: 700, flexShrink: 0 }}>🔥</span>}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Community feed */}
            {(() => {
              const feedItems = [];
              // Recent completed trades
              conversations.filter(c => c.completed).slice(0, 3).forEach(c => {
                feedItems.push({ type: "trade", ts: c.completedAt || Date.now() - 3600000, conv: c });
              });
              // New listings from followed traders
              listings.filter(l => following.has(l.name) && !l.mine).slice(0, 3).forEach(l => {
                feedItems.push({ type: "new_listing", ts: l.listedAt || Date.now() - 7200000, listing: l });
              });
              // Badge milestones from LISTINGS traders
              LISTINGS.filter(l => l.trades >= 10).slice(0, 3).forEach(l => {
                const badge = l.trades >= 50 ? { icon: "🏆", label: "Veteran" } : l.trades >= 25 ? { icon: "🌟", label: "Top Trader" } : { icon: "🏅", label: "Trusted" };
                feedItems.push({ type: "badge", ts: Date.now() - (Math.random() * 86400000 * 3), listing: l, badge });
              });
              // New member join (simulated for non-mine listings added recently)
              myListings.slice(0, 1).forEach(() => {
                feedItems.push({ type: "joined", ts: Date.now() - 900000, name: profile.name || "You" });
              });
              feedItems.sort((a, b) => b.ts - a.ts);
              if (feedItems.length === 0) return null;
              return (
                <div style={{ marginBottom: 22 }}>
                  <div className="stitle" style={{ fontSize: 15, marginBottom: 11 }}>Community 🌿</div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    {feedItems.slice(0, 5).map((item, i) => {
                      const ago = (() => { const d = Math.floor((Date.now() - item.ts) / 1000); if (d < 60) return "just now"; if (d < 3600) return `${Math.floor(d/60)}m ago`; if (d < 86400) return `${Math.floor(d/3600)}h ago`; return `${Math.floor(d/86400)}d ago`; })();
                      if (item.type === "trade") return (
                        <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 13px", background: "var(--tf-card,#fff)", borderRadius: 13, border: "1.5px solid var(--tf-border,#E5E2DC)" }}>
                          <span style={{ fontSize: 20 }}>🎉</span>
                          <div style={{ flex: 1 }}>
                            <div style={{ fontFamily: "Plus Jakarta Sans", fontSize: 12.5, color: "var(--tf-text,#1A1A1A)", lineHeight: 1.4 }}>
                              <strong>You</strong> completed a trade for <strong>{item.conv.listing.title}</strong>
                            </div>
                            <div style={{ fontFamily: "Plus Jakarta Sans", fontSize: 10.5, color: "var(--tf-muted,#aaa)", marginTop: 2 }}>with {item.conv.listing.name} · {ago}</div>
                          </div>
                        </div>
                      );
                      if (item.type === "new_listing") return (
                        <div key={i} onClick={() => openListing(item.listing)} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 13px", background: "var(--tf-card,#fff)", borderRadius: 13, border: "1.5px solid var(--tf-border,#E5E2DC)", cursor: "pointer" }}>
                          <div style={{ width: 36, height: 36, borderRadius: 10, background: "#E8F5EC", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0 }}>🌿</div>
                          <div style={{ flex: 1 }}>
                            <div style={{ fontFamily: "Plus Jakarta Sans", fontSize: 12.5, color: "var(--tf-text,#1A1A1A)", lineHeight: 1.4 }}>
                              <strong>{item.listing.name}</strong> posted a new listing
                            </div>
                            <div style={{ fontFamily: "Plus Jakarta Sans", fontSize: 11, color: "#E85D3A", marginTop: 1 }}>{item.listing.title}</div>
                            <div style={{ fontFamily: "Plus Jakarta Sans", fontSize: 10.5, color: "var(--tf-muted,#aaa)", marginTop: 1 }}>{ago}</div>
                          </div>
                        </div>
                      );
                      if (item.type === "badge") return (
                        <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 13px", background: "var(--tf-card,#fff)", borderRadius: 13, border: "1.5px solid var(--tf-border,#E5E2DC)" }}>
                          <span style={{ fontSize: 22 }}>{item.badge.icon}</span>
                          <div style={{ flex: 1 }}>
                            <div style={{ fontFamily: "Plus Jakarta Sans", fontSize: 12.5, color: "var(--tf-text,#1A1A1A)", lineHeight: 1.4 }}>
                              <strong>{item.listing.name}</strong> earned the <strong>{item.badge.label}</strong> badge
                            </div>
                            <div style={{ fontFamily: "Plus Jakarta Sans", fontSize: 10.5, color: "var(--tf-muted,#aaa)", marginTop: 2 }}>{item.listing.trades} trades completed · {ago}</div>
                          </div>
                        </div>
                      );
                      if (item.type === "joined") return (
                        <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 13px", background: "var(--tf-card,#fff)", borderRadius: 13, border: "1.5px solid var(--tf-border,#E5E2DC)" }}>
                          <span style={{ fontSize: 20 }}>👋</span>
                          <div style={{ flex: 1 }}>
                            <div style={{ fontFamily: "Plus Jakarta Sans", fontSize: 12.5, color: "var(--tf-text,#1A1A1A)" }}>
                              <strong>{item.name}</strong> joined Bartr
                            </div>
                            <div style={{ fontFamily: "Plus Jakarta Sans", fontSize: 10.5, color: "var(--tf-muted,#aaa)", marginTop: 2 }}>{ago}</div>
                          </div>
                        </div>
                      );
                      return null;
                    })}
                  </div>
                </div>
              );
            })()}

            {/* Recent / New */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 9 }}>
              <div className="stitle" style={{ fontSize: 15 }}>{suggestedListings.length > 0 ? "New additions" : "Recent"}</div>
              <span style={{ fontFamily: "Plus Jakarta Sans", fontSize: 12, color: "#E85D3A", cursor: "pointer" }} onClick={() => setScreen("browse")}>See all →</span>
            </div>
            {recentListings.length > 0
              ? recentListings.map(l => <ListingCard key={l.id} listing={l} onClick={() => openListing(l)} isFav={favorites.has(l.id)} isReported={reported.has(l.id)} onFav={cardFav} onReport={cardReport} onBlock={cardBlock} isBoosted={activeBoosted.includes(l.id)} />)
              : LISTINGS.slice(0, 3).filter(l => !blocked.has(l.id)).map(l => <ListingCard key={l.id} listing={l} onClick={() => openListing(l)} isFav={favorites.has(l.id)} isReported={reported.has(l.id)} onFav={cardFav} onReport={cardReport} onBlock={cardBlock} isBoosted={activeBoosted.includes(l.id)} />)
            }
              </div>{/* /tf-home-aside */}
            </div>{/* /tf-home-grid */}
          </div>
        )}

        {/* ── BROWSE ── */}
        {screen === "browse" && (
          <div>
            {/* Search bar + view toggle */}
            <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 13 }}>
              <div className="search-wrap" style={{ flex: 1, marginBottom: 0 }}>
                <span style={{ fontSize: 15, color: "var(--tf-muted,#bbb)", flexShrink: 0 }}>🔍</span>
                <input
                  ref={searchRef}
                  placeholder="Search listings, skills, names…"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  autoComplete="off"
                />
                {searchQuery && (
                  <button className="search-clear" onClick={() => { setSearchQuery(""); searchRef.current?.focus(); }}>✕</button>
                )}
              </div>
              <div className="view-toggle">
                <button className={`view-btn ${browseView === "list" ? "on" : ""}`} onClick={() => setBrowseView("list")}>≡ List</button>
                <button className={`view-btn ${browseView === "map" ? "on" : ""}`} onClick={() => { if (!isPro) { setShowPricing("upgrade"); return; } setBrowseView("map"); }}>
                  ◉ Map{!isPro && <span style={{ fontSize: 9, marginLeft: 3, color: "#F59E0B" }}>⭐</span>}
                </button>
              </div>
            </div>

            {/* Browse tabs: All / Following / Trending */}
            <div style={{ display: "flex", gap: 0, background: "var(--tf-input,#F0EDE6)", borderRadius: 12, padding: 3, marginBottom: 12 }}>
              {[["all","All"],["following",`Following${following.size > 0 ? ` (${following.size})` : ""}`],["trending","🔥 Trending"]].map(([id, label]) => (
                <button key={id} onClick={() => setBrowseTab(id)}
                  style={{ flex: 1, padding: "7px 4px", border: "none", borderRadius: 10, fontFamily: "Plus Jakarta Sans", fontSize: 12, fontWeight: 600, cursor: "pointer", transition: "all .15s",
                    background: browseTab === id ? "var(--tf-card,#fff)" : "transparent",
                    color: browseTab === id ? "var(--tf-text,#1A1A1A)" : "var(--tf-muted,#999)",
                    boxShadow: browseTab === id ? "0 1px 4px rgba(0,0,0,.08)" : "none" }}>
                  {label}
                </button>
              ))}
            </div>

            {/* Category chips */}
            {browseTab === "all" && (
            <div style={{ display: "flex", gap: 7, overflowX: "auto", paddingBottom: 9, marginBottom: 8 }}>
              <div className={`chip ${filterCat === "all" ? "on" : ""}`} onClick={() => setFilterCat("all")}>All</div>
              {CATEGORIES.map(cat => <div key={cat.id} className={`chip ${filterCat === cat.id ? "on" : ""}`} onClick={() => setFilterCat(cat.id)}>{cat.icon} {cat.label}</div>)}
            </div>
            )}

            {/* Availability toggle + Save Search */}
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
              <button onClick={() => setFilterAvail(v => !v)}
                style={{ display: "flex", alignItems: "center", gap: 6, background: filterAvail ? "#E8F5E9" : "var(--tf-input,#F0EDE6)", border: `1.5px solid ${filterAvail ? "#E85D3A" : "var(--tf-border,#DDD8CE)"}`, borderRadius: 100, padding: "5px 12px", fontFamily: "Plus Jakarta Sans", fontSize: 11.5, fontWeight: 600, color: filterAvail ? "#2D6A4F" : "var(--tf-muted,#999)", cursor: "pointer" }}>
                <span>🟢</span> Open to trades only
                {filterAvail ? " ✓" : ""}
              </button>
              {(searchQuery.trim() || filterCat !== "all") && (() => {
                const alreadySaved = savedSearches.some(s =>
                  s.query === searchQuery.trim() && s.category === filterCat
                );
                return (
                  <button onClick={() => {
                    if (!isPro) { setShowPricing("upgrade"); return; }
                    if (alreadySaved) return;
                    const ns = {
                      id: Date.now(),
                      query: searchQuery.trim(),
                      category: filterCat,
                      avail: filterAvail,
                      savedAt: Date.now(),
                      seenIds: filtered.map(l => l.id),
                    };
                    setSavedSearches(prev => [ns, ...prev]);
                    showToast("Search saved 🔖");
                  }}
                    style={{ display: "flex", alignItems: "center", gap: 5, background: alreadySaved ? "var(--tf-input,#F0EDE6)" : "var(--tf-card,#fff)", border: "1.5px solid var(--tf-border,#DDD8CE)", borderRadius: 100, padding: "5px 12px", fontFamily: "Plus Jakarta Sans", fontSize: 11.5, fontWeight: 600, color: alreadySaved ? "var(--tf-muted,#aaa)" : "var(--tf-text,#1A1A1A)", cursor: alreadySaved ? "default" : "pointer", flexShrink: 0 }}>
                    🔖 {alreadySaved ? "Saved" : "Save search"}{!isPro && <span style={{ fontSize: 9, marginLeft: 2, color: "#F59E0B" }}>⭐</span>}
                  </button>
                );
              })()}
            </div>

            {/* Saved searches */}
            {savedSearches.length > 0 && !searchQuery.trim() && filterCat === "all" && (
              <div style={{ marginBottom: 16 }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
                  <div style={{ fontFamily: "Plus Jakarta Sans", fontSize: 11, fontWeight: 700, color: "var(--tf-muted,#999)", textTransform: "uppercase", letterSpacing: ".07em" }}>Saved searches</div>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
                  {savedSearches.map(ss => {
                    const cat = CATEGORIES.find(c => c.id === ss.category);
                    const newMatches = listings.filter(l =>
                      !blocked.has(l.id) && !reported.has(l.id) && !l.mine &&
                      (!ss.avail || l.availability !== "closed") &&
                      (!ss.category || ss.category === "all" || l.category === ss.category) &&
                      (!ss.query || l.title.toLowerCase().includes(ss.query.toLowerCase()) || l.desc?.toLowerCase().includes(ss.query.toLowerCase())) &&
                      !ss.seenIds?.includes(l.id)
                    ).length;
                    const label = [ss.query, cat ? cat.label : null].filter(Boolean).join(" · ") || "All listings";
                    return (
                      <div key={ss.id} style={{ display: "flex", alignItems: "center", gap: 10, background: "var(--tf-card,#fff)", borderRadius: 13, padding: "10px 13px", border: "1.5px solid var(--tf-border,#E5E2DC)", cursor: "pointer" }}
                        onClick={() => {
                          setSearchQuery(ss.query || "");
                          setFilterCat(ss.category || "all");
                          setFilterAvail(ss.avail);
                          // Mark all current matches as seen
                          setSavedSearches(prev => prev.map(s => s.id === ss.id ? { ...s, seenIds: listings.map(l => l.id) } : s));
                        }}>
                        <span style={{ fontSize: 16 }}>🔍</span>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontFamily: "Plus Jakarta Sans", fontSize: 13, fontWeight: 500, color: "var(--tf-text,#1A1A1A)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{label}</div>
                          <div style={{ fontFamily: "Plus Jakarta Sans", fontSize: 10, color: "var(--tf-muted,#bbb)", marginTop: 1 }}>
                            {ss.avail ? "Open only · " : ""}Saved {new Date(ss.savedAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                          </div>
                        </div>
                        {newMatches > 0 && (
                          <span style={{ background: "#E85C7A", color: "#fff", borderRadius: 100, padding: "2px 8px", fontFamily: "Plus Jakarta Sans", fontSize: 10, fontWeight: 700, flexShrink: 0 }}>
                            {newMatches} new
                          </span>
                        )}
                        <button onClick={e => { e.stopPropagation(); setSavedSearches(prev => prev.filter(s => s.id !== ss.id)); }}
                          style={{ background: "none", border: "none", fontSize: 14, color: "var(--tf-muted,#ccc)", cursor: "pointer", padding: "0 0 0 4px", flexShrink: 0, lineHeight: 1 }}>✕</button>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {browseView === "map" ? (
              <MapView
                listings={filtered}
                favorites={favorites}
                reported={reported}
                onSelect={l => setSelectedListing(l)}
                onFav={cardFav}
                onReport={cardReport}
                onBlock={cardBlock}
              />
            ) : browseTab === "following" ? (
              <>
                {following.size === 0 ? (
                  <div style={{ textAlign: "center", padding: "60px 24px" }}>
                    <div style={{ fontSize: 40, marginBottom: 12 }}>👤</div>
                    <div className="stitle" style={{ fontSize: 17, marginBottom: 8 }}>No one followed yet</div>
                    <p style={{ fontFamily: "Plus Jakarta Sans", fontSize: 13, color: "var(--tf-muted,#999)", lineHeight: 1.6, marginBottom: 20 }}>Follow traders from their listing page to see their updates here.</p>
                    <button onClick={() => setBrowseTab("all")} style={{ background: "#1A1A1A", border: "none", borderRadius: 100, padding: "11px 24px", fontFamily: "Plus Jakarta Sans", fontSize: 13, fontWeight: 600, color: "#fff", cursor: "pointer" }}>Browse listings →</button>
                  </div>
                ) : (() => {
                  const followedListings = visibleListings.filter(l => following.has(l.name) && !l.mine);
                  return followedListings.length === 0 ? (
                    <div style={{ textAlign: "center", padding: "48px 24px", color: "var(--tf-muted,#999)", fontFamily: "Plus Jakarta Sans", fontSize: 13 }}>
                      <div style={{ fontSize: 32, marginBottom: 10 }}>🌿</div>
                      No active listings from traders you follow right now.
                    </div>
                  ) : (
                    <>
                      <div style={{ fontFamily: "Plus Jakarta Sans", fontSize: 12, color: "var(--tf-muted,#aaa)", marginBottom: 12 }}>
                        {followedListings.length} listing{followedListings.length !== 1 ? "s" : ""} from {following.size} trader{following.size !== 1 ? "s" : ""} you follow
                      </div>
                      <div className="tf-browse-grid">
                        {followedListings.map(l => <ListingCard key={l.id} listing={l} onClick={() => openListing(l)} isFav={favorites.has(l.id)} isReported={reported.has(l.id)} onFav={cardFav} onReport={cardReport} onBlock={cardBlock} isBoosted={activeBoosted.includes(l.id)} />)}
                      </div>
                    </>
                  );
                })()}
              </>
            ) : browseTab === "trending" ? (
              <>
                <div style={{ fontFamily: "Plus Jakarta Sans", fontSize: 12, color: "var(--tf-muted,#aaa)", marginBottom: 12 }}>Ranked by saves, offers & activity</div>
                <div className="tf-browse-grid">
                  {trendingListings.map((l, i) => (
                    <div key={l.id} style={{ position: "relative" }}>
                      <ListingCard listing={l} onClick={() => openListing(l)} isFav={favorites.has(l.id)} isReported={reported.has(l.id)} onFav={cardFav} onReport={cardReport} onBlock={cardBlock} isBoosted={activeBoosted.includes(l.id)} />
                      <div style={{ position: "absolute", top: 14, left: 14, background: i === 0 ? "#EF4444" : i < 3 ? "#D97706" : "#888", color: "#fff", borderRadius: 100, width: 20, height: 20, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "Plus Jakarta Sans", fontSize: 10, fontWeight: 700, zIndex: 3 }}>
                        {i + 1}
                      </div>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                  {searchQuery.trim()
                    ? <div style={{ fontFamily: "Plus Jakarta Sans", fontSize: 13, color: "var(--tf-sub,#555)" }}>
                        Results for <strong style={{ color: "var(--tf-text,#1A1A1A)" }}>"{searchQuery.trim()}"</strong>
                      </div>
                    : <div className="stitle">Listings</div>
                  }
                  <span style={{ fontFamily: "Plus Jakarta Sans", fontSize: 12, color: "var(--tf-muted,#999)" }}>{filtered.length} found</span>
                </div>
                <AiBox aiQuery={aiQuery} setAiQuery={setAiQuery} loading={aiLoading} result={aiResult} suggested={aiSuggested} run={runAiSearch} onSelect={l => setSelectedListing(l)} compact />
                {filtered.length === 0
                  ? (
                    <div style={{ textAlign: "center", padding: "48px 24px", color: "var(--tf-muted,#999)", fontFamily: "Plus Jakarta Sans" }}>
                      <div style={{ fontSize: 36, marginBottom: 12 }}>🔍</div>
                      <div style={{ fontSize: 15, fontWeight: 600, color: "var(--tf-sub,#555)", marginBottom: 6 }}>No results found</div>
                      <div style={{ fontSize: 13 }}>
                        {searchQuery.trim()
                          ? <>No listings match <strong>"{searchQuery.trim()}"</strong>.</>
                          : "No listings in this category yet."
                        }
                      </div>
                      {searchQuery.trim() && (
                        <button onClick={() => setSearchQuery("")} style={{ marginTop: 16, padding: "8px 20px", borderRadius: 100, border: "1.5px solid #E85D3A", background: "transparent", fontFamily: "Plus Jakarta Sans", fontSize: 13, fontWeight: 600, color: "#E85D3A", cursor: "pointer" }}>
                          Clear search
                        </button>
                      )}
                    </div>
                  )
                  : browseLoading
                    ? <div className="tf-browse-grid">
                        {[1,2,3,4].map(i => (
                          <div key={i} className="card" style={{ marginBottom: 9, pointerEvents: "none" }}>
                            <div style={{ display: "flex", gap: 12 }}>
                              <div className="skel" style={{ width: 64, height: 64, borderRadius: 12, flexShrink: 0 }} />
                              <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 8, paddingTop: 4 }}>
                                <div className="skel" style={{ height: 14, width: "70%", borderRadius: 6 }} />
                                <div className="skel" style={{ height: 11, width: "90%", borderRadius: 6 }} />
                                <div className="skel" style={{ height: 11, width: "50%", borderRadius: 6 }} />
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    : <div className="tf-browse-grid">
                        {filtered.map(l => <ListingCard key={l.id} listing={l} onClick={() => openListing(l)} isFav={favorites.has(l.id)} isReported={reported.has(l.id)} onFav={cardFav} onReport={cardReport} onBlock={cardBlock} isBoosted={activeBoosted.includes(l.id)} />)}
                      </div>
                }
              </>
            )}
          </div>
        )}

        {/* ── CREATE / EDIT LISTING ── */}
        {screen === "create" && (() => {
          const isEditing = !!editingListing;
          const cd = newListing.contractDefaults || {};
          const setCD = (patch) => setNewListing(p => ({ ...p, contractDefaults: { ...p.contractDefaults, ...patch } }));
          return (
          <div>
            {/* Header */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 3 }}>
              <div className="stitle">{isEditing ? "Edit Listing" : "New Listing"}</div>
              {isEditing && (
                <button onClick={() => { setEditingListing(null); setNewListing({ title: "", desc: "", category: "", type: "service", photos: [], contractDefaults: { offer: "", lookingFor: "", conditions: "", contractType: "one-time" }, blockedDates: [] }); setScreen("profile"); }}
                  style={{ background: "none", border: "none", fontFamily: "Plus Jakarta Sans", fontSize: 13, color: "var(--tf-muted,#888)", cursor: "pointer", padding: 0 }}>Cancel</button>
              )}
            </div>
            <p style={{ fontFamily: "Plus Jakarta Sans", fontSize: 13, color: "var(--tf-muted,#888)", marginBottom: 16 }}>{isEditing ? "Update your listing details." : "Share what you're offering with your community."}</p>

            {/* Listing limit banner — only in create mode */}
            {!isEditing && (() => {
              const plan = PLANS[membership.plan];
              const remaining = (plan.listingLimit + referrals.length) - myListings.length;
              if (remaining <= 0) return (
                <div style={{ background: "#FEF2F2", border: "1.5px solid #FECACA", borderRadius: 14, padding: "13px 16px", marginBottom: 16, display: "flex", alignItems: "center", gap: 12 }}>
                  <span style={{ fontSize: 22 }}>🚫</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontFamily: "Plus Jakarta Sans", fontSize: 13, fontWeight: 600, color: "#DC2626" }}>Listing limit reached</div>
                    <div style={{ fontFamily: "Plus Jakarta Sans", fontSize: 12, color: "#EF4444", marginTop: 2 }}>Free plan is limited to {plan.listingLimit} listings. Upgrade to Pro for up to 10.</div>
                  </div>
                  <button onClick={() => setShowPricing("upgrade")} style={{ background: "#1A1A1A", border: "none", borderRadius: 100, padding: "7px 14px", fontFamily: "Plus Jakarta Sans", fontSize: 11, fontWeight: 600, color: "#fff", cursor: "pointer", flexShrink: 0 }}>Upgrade</button>
                </div>
              );
              if (remaining === 1 && membership.plan === "free") return (
                <div style={{ background: "#FFFBEB", border: "1.5px solid #FCD34D", borderRadius: 14, padding: "12px 16px", marginBottom: 16, display: "flex", alignItems: "center", gap: 10 }}>
                  <span style={{ fontSize: 18 }}>⚠️</span>
                  <div style={{ fontFamily: "Plus Jakarta Sans", fontSize: 12, color: "#92400E" }}>This is your last free listing slot. <button onClick={() => setShowPricing("upgrade")} style={{ background: "none", border: "none", color: "#D97706", fontFamily: "Plus Jakarta Sans", fontSize: 12, fontWeight: 700, cursor: "pointer", padding: 0 }}>Upgrade to Pro →</button></div>
                </div>
              );
              return null;
            })()}

            <div className="warn"><span style={{ fontSize: 17 }}>⚠️</span><p style={{ fontFamily: "Plus Jakarta Sans", fontSize: 11.5, color: "#7A5C00", lineHeight: 1.6 }}><strong>Community standards:</strong> All listings must be for legal goods and services only. Sexual services and illegal substances are prohibited.</p></div>
            <div style={{ marginBottom: 13 }}>
              <label style={{ fontFamily: "Plus Jakarta Sans", fontSize: 11, fontWeight: 600, color: "var(--tf-sub,#555)", display: "block", marginBottom: 5, letterSpacing: ".05em" }}>TYPE</label>
              <div style={{ display: "flex", gap: 8 }}>{["service", "goods"].map(t => <button key={t} className={`tbtn ${newListing.type === t ? "on" : ""}`} onClick={() => setNewListing(p => ({ ...p, type: t }))}>{t === "service" ? "🛠 Service" : "📦 Goods"}</button>)}</div>
            </div>
            <div style={{ marginBottom: 13 }}>
              <label style={{ fontFamily: "Plus Jakarta Sans", fontSize: 11, fontWeight: 600, color: "var(--tf-sub,#555)", display: "block", marginBottom: 5 }}>TITLE *</label>
              <input className="inp" placeholder="e.g. Home Cleaning, Custom Cakes..." value={newListing.title} onChange={e => setNewListing(p => ({ ...p, title: e.target.value }))} />
            </div>
            <div style={{ marginBottom: 13 }}>
              <label style={{ fontFamily: "Plus Jakarta Sans", fontSize: 11, fontWeight: 600, color: "var(--tf-sub,#555)", display: "block", marginBottom: 5 }}>DESCRIPTION</label>
              <textarea className="inp" placeholder="Experience, availability, what's included..." value={newListing.desc} onChange={e => setNewListing(p => ({ ...p, desc: e.target.value }))} />
            </div>
            <div style={{ marginBottom: 22 }}>
              <label style={{ fontFamily: "Plus Jakarta Sans", fontSize: 11, fontWeight: 600, color: "var(--tf-sub,#555)", display: "block", marginBottom: 9 }}>CATEGORY *</label>
              <div className="cat-grid">
                {CATEGORIES.map(cat => (
                  <div key={cat.id} className={`cat-tile ${newListing.category === cat.id ? "sel" : ""}`} style={{ background: newListing.category === cat.id ? cat.color + "28" : "var(--tf-card,#fff)" }} onClick={() => setNewListing(p => ({ ...p, category: cat.id }))}>
                    <div style={{ fontSize: 19, marginBottom: 3 }}>{cat.icon}</div>
                    <div style={{ fontSize: 10.5, fontFamily: "Plus Jakarta Sans", color: "var(--tf-sub,#555)", lineHeight: 1.3 }}>{cat.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* PHOTOS — drag to reorder */}
            {(() => {
              const dragIdx = { current: null };
              const onDragStart = (i) => { dragIdx.current = i; };
              const onDrop = (i) => {
                if (dragIdx.current === null || dragIdx.current === i) return;
                const arr = [...(newListing.photos || [])];
                const [moved] = arr.splice(dragIdx.current, 1);
                arr.splice(i, 0, moved);
                setNewListing(p => ({ ...p, photos: arr }));
                dragIdx.current = null;
              };
              return (
            <div style={{ marginBottom: 22 }}>
              <label style={{ fontFamily: "Plus Jakarta Sans", fontSize: 11, fontWeight: 600, color: "var(--tf-sub,#555)", display: "block", marginBottom: 5, letterSpacing: ".05em" }}>PHOTOS <span style={{ color: "var(--tf-muted,#aaa)", fontWeight: 400 }}>— up to 4{(newListing.photos||[]).length > 1 ? ", drag to reorder" : ", optional"}</span></label>
              <div style={{ display: "flex", gap: 9, flexWrap: "wrap" }}>
                {(newListing.photos || []).map((src, i) => (
                  <div key={src.slice(-20) + i}
                    draggable
                    onDragStart={() => onDragStart(i)}
                    onDragOver={e => e.preventDefault()}
                    onDrop={() => onDrop(i)}
                    style={{ position: "relative", width: 78, height: 78, borderRadius: 13, overflow: "hidden", flexShrink: 0, cursor: "grab", userSelect: "none" }}>
                    <img src={src} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", pointerEvents: "none" }} />
                    {i === 0 && <div style={{ position: "absolute", bottom: 4, left: 4, background: "rgba(26,26,26,.8)", borderRadius: 6, padding: "2px 6px", fontFamily: "Plus Jakarta Sans", fontSize: 9, color: "#fff", fontWeight: 600 }}>COVER</div>}
                    <button onClick={() => setNewListing(p => ({ ...p, photos: p.photos.filter((_,j) => j !== i) }))}
                      style={{ position: "absolute", top: 3, right: 3, width: 20, height: 20, borderRadius: "50%", background: "rgba(0,0,0,.55)", border: "none", color: "#fff", cursor: "pointer", fontSize: 11, display: "flex", alignItems: "center", justifyContent: "center", lineHeight: 1 }}>✕</button>
                  </div>
                ))}
                {(newListing.photos || []).length < 4 && (
                  <label style={{ width: 78, height: 78, borderRadius: 13, border: "2px dashed #D5D2CB", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", cursor: "pointer", background: "var(--tf-input,#FAFAF8)", flexShrink: 0, gap: 4 }}>
                    <span style={{ fontSize: 20 }}>📷</span>
                    <span style={{ fontFamily: "Plus Jakarta Sans", fontSize: 9, color: "var(--tf-muted,#aaa)" }}>Add photo</span>
                    <input type="file" accept="image/*" style={{ display: "none" }} multiple onChange={e => {
                      const files = Array.from(e.target.files).slice(0, 4 - (newListing.photos || []).length);
                      files.forEach(file => {
                        const reader = new FileReader();
                        reader.onload = ev => setNewListing(p => ({ ...p, photos: [...(p.photos || []), ev.target.result].slice(0, 4) }));
                        reader.readAsDataURL(file);
                      });
                      e.target.value = "";
                    }} />
                  </label>
                )}
              </div>
              {(newListing.photos || []).length > 1 && (
                <p style={{ fontFamily: "Plus Jakarta Sans", fontSize: 11, color: "var(--tf-muted,#aaa)", marginTop: 6 }}>First photo is the cover. Drag tiles to reorder.</p>
              )}
            </div>
              );
            })()}

            {/* ── CONTRACT DEFAULTS ── */}
            <div style={{ marginBottom: 22 }}>
              <button onClick={() => setShowDefaults(v => !v)}
                style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%", background: "var(--tf-card,#fff)", border: "1.5px solid var(--tf-border,#E5E2DC)", borderRadius: showDefaults ? "14px 14px 0 0" : 14, padding: "13px 16px", cursor: "pointer", borderBottom: showDefaults ? "none" : undefined }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <span style={{ fontSize: 18 }}>📋</span>
                  <div style={{ textAlign: "left" }}>
                    <div style={{ fontFamily: "Plus Jakarta Sans", fontSize: 13, fontWeight: 600, color: "var(--tf-text,#1A1A1A)" }}>Default contract terms</div>
                    <div style={{ fontFamily: "Plus Jakarta Sans", fontSize: 11, color: "var(--tf-muted,#aaa)", marginTop: 1 }}>
                      {cd.offer || cd.conditions ? "Terms set — buyers see these before starting" : "Optional — saves time on repeat trades"}
                    </div>
                  </div>
                </div>
                <span style={{ fontSize: 14, color: "var(--tf-muted,#bbb)", transform: showDefaults ? "rotate(180deg)" : "none", transition: "transform .2s" }}>▾</span>
              </button>

              {showDefaults && (
                <div style={{ background: "var(--tf-card,#fff)", border: "1.5px solid var(--tf-border,#E5E2DC)", borderTop: "1px solid var(--tf-border,#E5E2DC)", borderRadius: "0 0 14px 14px", padding: "16px" }}>
                  <p style={{ fontFamily: "Plus Jakarta Sans", fontSize: 12, color: "var(--tf-muted,#888)", lineHeight: 1.6, marginBottom: 16 }}>
                    These defaults pre-fill your side of every contract for this listing. Buyers can still adjust terms per trade — these are a starting point, not a lock-in.
                  </p>

                  <div style={{ marginBottom: 13 }}>
                    <label style={{ fontFamily: "Plus Jakarta Sans", fontSize: 11, fontWeight: 600, color: "var(--tf-sub,#555)", display: "block", marginBottom: 5, letterSpacing: ".05em" }}>WHAT YOU'RE OFFERING</label>
                    <textarea className="inp" rows={3}
                      placeholder="e.g. 2 hours of plumbing work, parts not included, within 10 miles of city centre…"
                      value={cd.offer || ""} onChange={e => setCD({ offer: e.target.value })} />
                  </div>

                  <div style={{ marginBottom: 13 }}>
                    <label style={{ fontFamily: "Plus Jakarta Sans", fontSize: 11, fontWeight: 600, color: "var(--tf-sub,#555)", display: "block", marginBottom: 5, letterSpacing: ".05em" }}>WHAT YOU TYPICALLY WANT IN RETURN</label>
                    <textarea className="inp" rows={2}
                      placeholder="e.g. Graphic design work, home-cooked meals, gardening help…"
                      value={cd.lookingFor || ""} onChange={e => setCD({ lookingFor: e.target.value })} />
                  </div>

                  <div style={{ marginBottom: 13 }}>
                    <label style={{ fontFamily: "Plus Jakarta Sans", fontSize: 11, fontWeight: 600, color: "var(--tf-sub,#555)", display: "block", marginBottom: 5, letterSpacing: ".05em" }}>STANDARD CONDITIONS <span style={{ fontWeight: 400, color: "var(--tf-muted,#aaa)" }}>— optional</span></label>
                    <textarea className="inp" rows={3}
                      placeholder="e.g. All work guaranteed for 30 days. Cancellation requires 48hrs notice. Materials not included unless agreed…"
                      value={cd.conditions || ""} onChange={e => setCD({ conditions: e.target.value })} />
                  </div>

                  <div>
                    <label style={{ fontFamily: "Plus Jakarta Sans", fontSize: 11, fontWeight: 600, color: "var(--tf-sub,#555)", display: "block", marginBottom: 7, letterSpacing: ".05em" }}>DEFAULT CONTRACT TYPE</label>
                    <div style={{ display: "flex", gap: 8 }}>
                      {[["one-time", "One-time", "Single exchange"], ["recurring", "Recurring", "Ongoing arrangement"], ["project", "Project", "Multi-stage work"]].map(([val, label, sub]) => (
                        <button key={val} onClick={() => setCD({ contractType: val })}
                          style={{ flex: 1, padding: "10px 8px", borderRadius: 12, border: "1.5px solid " + ((cd.contractType || "one-time") === val ? theme.accent : "var(--tf-border,#DDD8CE)"), background: (cd.contractType || "one-time") === val ? (theme.id === "dark" ? "#1A2B1C" : "#E8F5EC") : "var(--tf-input,#FDFCFA)", cursor: "pointer", textAlign: "center" }}>
                          <div style={{ fontFamily: "Plus Jakarta Sans", fontSize: 12, fontWeight: 600, color: (cd.contractType || "one-time") === val ? theme.accent : "var(--tf-text,#1A1A1A)", marginBottom: 2 }}>{label}</div>
                          <div style={{ fontFamily: "Plus Jakarta Sans", fontSize: 9.5, color: "var(--tf-muted,#aaa)" }}>{sub}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {(cd.offer || cd.conditions || cd.lookingFor) && (
                    <button onClick={() => setCD({ offer: "", lookingFor: "", conditions: "", contractType: "one-time" })}
                      style={{ marginTop: 14, background: "none", border: "none", fontFamily: "Plus Jakarta Sans", fontSize: 11, color: "var(--tf-muted,#bbb)", cursor: "pointer", padding: 0, display: "block" }}>Clear defaults</button>
                  )}
                </div>
              )}
            </div>

            {/* ── BLOCKED DATES ── */}
            {(() => {
              const blocked = newListing.blockedDates || [];
              const today = new Date(); today.setHours(0,0,0,0);
              const prevBdMonth = () => { if (bdMonth === 0) { setBdYear(y=>y-1); setBdMonth(11); } else setBdMonth(m=>m-1); };
              const nextBdMonth = () => { if (bdMonth === 11) { setBdYear(y=>y+1); setBdMonth(0); } else setBdMonth(m=>m+1); };
              const daysInBdMonth = new Date(bdYear, bdMonth+1, 0).getDate();
              const firstBdDay = new Date(bdYear, bdMonth, 1).getDay();
              const bdCells = [];
              for (let i = 0; i < firstBdDay; i++) bdCells.push(null);
              for (let d = 1; d <= daysInBdMonth; d++) bdCells.push(d);
              const toggleDate = (d) => {
                const key = `${bdYear}-${String(bdMonth+1).padStart(2,"0")}-${String(d).padStart(2,"0")}`;
                const updated = blocked.includes(key) ? blocked.filter(x=>x!==key) : [...blocked, key];
                setNewListing(p => ({ ...p, blockedDates: updated }));
              };
              return (
                <div style={{ marginBottom: 22 }}>
                  <button onClick={() => setShowBd(v=>!v)}
                    style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%", background: "var(--tf-card,#fff)", border: "1.5px solid var(--tf-border,#E5E2DC)", borderRadius: showBd ? "14px 14px 0 0" : 14, padding: "13px 16px", cursor: "pointer", borderBottom: showBd ? "none" : undefined }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <span style={{ fontSize: 18 }}>📅</span>
                      <div style={{ textAlign: "left" }}>
                        <div style={{ fontFamily: "Plus Jakarta Sans", fontSize: 13, fontWeight: 600, color: "var(--tf-text,#1A1A1A)" }}>Blocked dates</div>
                        <div style={{ fontFamily: "Plus Jakarta Sans", fontSize: 11, color: "var(--tf-muted,#aaa)", marginTop: 1 }}>
                          {blocked.length > 0 ? `${blocked.length} date${blocked.length>1?"s":""} blocked` : "Mark dates you're unavailable"}
                        </div>
                      </div>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                      {blocked.length > 0 && <span style={{ background: "#FEE2E2", color: "#DC2626", borderRadius: 100, padding: "2px 8px", fontFamily: "Plus Jakarta Sans", fontSize: 10, fontWeight: 700 }}>{blocked.length}</span>}
                      <span style={{ fontSize: 14, color: "var(--tf-muted,#bbb)", transform: showBd ? "rotate(180deg)" : "none", transition: "transform .2s" }}>▾</span>
                    </div>
                  </button>
                  {showBd && (
                    <div style={{ background: "var(--tf-card,#fff)", border: "1.5px solid var(--tf-border,#E5E2DC)", borderTop: "1px solid var(--tf-border,#E5E2DC)", borderRadius: "0 0 14px 14px", padding: "14px 16px" }}>
                      <p style={{ fontFamily: "Plus Jakarta Sans", fontSize: 12, color: "var(--tf-muted,#888)", lineHeight: 1.6, marginBottom: 14 }}>Tap any date to block it — buyers won't be able to schedule those days.</p>
                      <div className="cal-header" style={{ marginBottom: 10 }}>
                        <button className="cal-nav" onClick={prevBdMonth}>‹</button>
                        <div style={{ fontFamily: "Plus Jakarta Sans", fontSize: 13, fontWeight: 600, color: "var(--tf-text,#1A1A1A)" }}>{MONTH_NAMES[bdMonth]} {bdYear}</div>
                        <button className="cal-nav" onClick={nextBdMonth}>›</button>
                      </div>
                      <div className="cal-grid">
                        {DOW.map(d => <div key={d} className="cal-dow">{d}</div>)}
                        {bdCells.map((day, i) => {
                          if (!day) return <div key={`e${i}`} className="cal-day empty" />;
                          const thisDate = new Date(bdYear, bdMonth, day); thisDate.setHours(0,0,0,0);
                          const isPast = thisDate < today;
                          const key = `${bdYear}-${String(bdMonth+1).padStart(2,"0")}-${String(day).padStart(2,"0")}`;
                          const isBlocked = blocked.includes(key);
                          return (
                            <button key={day}
                              className={`cal-day${isPast?" past":""}${isBlocked?" sel":""}`}
                              style={{ background: isBlocked ? "#FEE2E2" : undefined, borderColor: isBlocked ? "#FECACA" : undefined, color: isBlocked ? "#DC2626" : undefined }}
                              onClick={() => !isPast && toggleDate(day)}>
                              {day}
                            </button>
                          );
                        })}
                      </div>
                      {blocked.length > 0 && (
                        <button onClick={() => setNewListing(p=>({...p, blockedDates:[]}))}
                          style={{ marginTop: 10, background: "none", border: "none", fontFamily: "Plus Jakarta Sans", fontSize: 11, color: "var(--tf-muted,#bbb)", cursor: "pointer", padding: 0 }}>Clear all blocked dates</button>
                      )}
                    </div>
                  )}
                </div>
              );
            })()}

            <button className="bp" onClick={() => {
              if (!newListing.title || !newListing.category) return;
              if (isEditing) {
                // Update existing listing
                const updated = { ...editingListing, ...newListing };
                setListings(prev => prev.map(l => l.id === editingListing.id ? updated : l));
                setMyListings(prev => prev.map(l => l.id === editingListing.id ? updated : l));
                setEditingListing(null);
                setNewListing({ title: "", desc: "", category: "", type: "service", photos: [], contractDefaults: { offer: "", lookingFor: "", conditions: "", contractType: "one-time" }, blockedDates: [] });
                showToast("Listing updated! ✏️");
                setScreen("profile");
              } else {
                submitListing();
              }
            }} disabled={!newListing.title || !newListing.category}>
              {isEditing ? "Save Changes" : "Publish Listing"}
            </button>
          </div>
          );
        })()}

        {/* ── MESSAGES LIST ── */}
        {screen === "messages" && !activeConvId && (
          <div className="screen-in">
            <div className="stitle" style={{ marginBottom: 3 }}>Messages</div>
            <p style={{ fontFamily: "Plus Jakarta Sans", fontSize: 13, color: "var(--tf-muted,#888)", marginBottom: 18 }}>Negotiations, offers & confirmed trades.</p>
            {conversations.length === 0
              ? <div style={{ textAlign: "center", padding: "52px 0", color: "var(--tf-muted,#999)" }}>
                  <div style={{ fontSize: 36, marginBottom: 10 }}>💬</div>
                  <div style={{ fontFamily: "Plus Jakarta Sans", fontSize: 14 }}>No conversations yet.</div>
                  <div style={{ fontFamily: "Plus Jakarta Sans", fontSize: 12, marginTop: 5 }}>Find a listing and make an offer!</div>
                  <button className="bp" style={{ marginTop: 18 }} onClick={() => setScreen("browse")}>Browse Listings</button>
                </div>
              : conversations.map(conv => (
                  <div key={conv.id} className="card" onClick={() => openConversation(conv.id)}>
                    <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                      <div className="ava" style={{ width: 46, height: 46, background: catOf(conv.listing.category).color, fontSize: 15, flexShrink: 0 }}>{conv.listing.avatar}</div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                          <div style={{ fontFamily: "Plus Jakarta Sans", fontSize: 14, fontWeight: 600, color: "var(--tf-text,#1A1A1A)" }}>{conv.listing.name}</div>
                          <StatusPill status={conv.status} contractType={conv.contractType} />
                        </div>
                        <div style={{ fontFamily: "Plus Jakarta Sans", fontSize: 12, color: "var(--tf-muted,#888)", marginTop: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{conv.listing.title}</div>
                        <div style={{ fontFamily: "Plus Jakarta Sans", fontSize: 11, color: "var(--tf-muted,#aaa)", marginTop: 3, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                          {conv.messages[conv.messages.length - 1]?.text || ""}
                        </div>
                      </div>
                      {conv.unread && <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#E85C7A", flexShrink: 0 }} />}
                      {conv.status === "disputed" && <div style={{ fontFamily: "Plus Jakarta Sans", fontSize: 10, fontWeight: 700, color: "#D97706", background: "#FEF3C7", borderRadius: 100, padding: "2px 7px", flexShrink: 0 }}>⚠️</div>}
                    </div>
                  </div>
                ))}
          </div>
        )}

        {/* ── ACTIVE CHAT ── */}
        {screen === "messages" && activeConvId && activeConv && (
          <ChatView
            conv={activeConv}
            myName={profile.name || "You"}
            onBack={() => setActiveConvId(null)}
            onSend={(text) => {
              sendMessage(activeConvId, text, true);
              setTimeout(() => {
                const reply = ACK_REPLIES[Math.floor(Math.random() * ACK_REPLIES.length)];
                sendMessage(activeConvId, reply, false);
              }, 1200 + Math.random() * 1000);
            }}
            onAgree={() => agreeToContract(activeConvId)}
            onCounter={(d1, d2, ct) => proposeCounterOffer(activeConvId, d1, d2, ct)}
            onComplete={() => markComplete(activeConvId)}
            onTerminate={() => terminateContract(activeConvId)}
            onRaiseDispute={(dispute) => raiseDispute(activeConvId, dispute)}
            onResolveDispute={() => resolveDispute(activeConvId)}
            onEscalateDispute={() => escalateDispute(activeConvId)}
            isCompleted={completedConvs.has(activeConvId)}
          />
        )}

        {/* ── PROFILE ── */}
        {screen === "profile" && (
          <div className="screen-in">
            {!profileDone ? (
              <div style={{ maxWidth: 600, margin: "0 auto" }}>
                <div className="stitle" style={{ marginBottom: 3 }}>Create your profile</div>
                <p style={{ fontFamily: "Plus Jakarta Sans", fontSize: 13, color: "var(--tf-muted,#888)", marginTop: 3 }}>Step {profileStep} of 4</p>
                <div className="pbar" style={{ marginTop: 10, marginBottom: 22 }}><div className="pfill" style={{ width: `${(profileStep / 4) * 100}%` }} /></div>

                {/* STEP 1 — account type */}
                {profileStep === 1 && (
                  <div>
                    <p style={{ fontFamily: "Plus Jakarta Sans", fontSize: 14, color: "var(--tf-sub,#555)", marginBottom: 18, lineHeight: 1.6 }}>Are you signing up as an individual or on behalf of a business?</p>
                    <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 24 }}>
                      {[
                        { type: "personal", icon: "👤", title: "Personal Account", sub: "Individual offering skills, time, or goods." },
                        { type: "business", icon: "🏢", title: "Business Account", sub: "Company or sole trader with full business profile and social links." },
                      ].map(opt => (
                        <div key={opt.type} className={`acct-type ${profile.accountType === opt.type ? "sel" : ""}`}
                          onClick={() => setProfile(p => ({ ...p, accountType: opt.type }))}>
                          <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                            <span style={{ fontSize: 26 }}>{opt.icon}</span>
                            <div>
                              <div style={{ fontFamily: "Plus Jakarta Sans", fontSize: 14, fontWeight: 600, color: "var(--tf-text,#1A1A1A)" }}>{opt.title}</div>
                              <div style={{ fontFamily: "Plus Jakarta Sans", fontSize: 12, color: "var(--tf-muted,#888)", marginTop: 3, lineHeight: 1.4 }}>{opt.sub}</div>
                            </div>
                            <div style={{ marginLeft: "auto", width: 20, height: 20, borderRadius: "50%", border: `2px solid ${profile.accountType === opt.type ? "#1A1A1A" : "#DDD8CE"}`, background: profile.accountType === opt.type ? "#1A1A1A" : "transparent", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                              {profile.accountType === opt.type && <div style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--tf-card,#fff)" }} />}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    <button className="bp" onClick={() => setProfileStep(2)}>Continue →</button>
                  </div>
                )}

                {/* STEP 2 — photo + basic info */}
                {profileStep === 2 && (
                  <div>
                    {/* Photo upload */}
                    <div style={{ textAlign: "center", marginBottom: 20 }}>
                      <label htmlFor="photo-upload" style={{ cursor: "pointer" }}>
                        <div className={`photo-ring ${profile.accountType === "business" ? "biz" : ""}`}>
                          {profile.photo
                            ? <img src={profile.photo} alt="profile" />
                            : <><span style={{ fontSize: 26 }}>{profile.accountType === "business" ? "🏢" : "👤"}</span><span style={{ fontFamily: "Plus Jakarta Sans", fontSize: 10, color: "var(--tf-muted,#aaa)", marginTop: 3 }}>Add photo</span></>}
                          {profile.photo && <div className="photo-change">Change</div>}
                        </div>
                      </label>
                      <input id="photo-upload" type="file" accept="image/*" style={{ display: "none" }} onChange={e => {
                        const file = e.target.files[0];
                        if (!file) return;
                        const reader = new FileReader();
                        reader.onload = ev => setProfile(p => ({ ...p, photo: ev.target.result }));
                        reader.readAsDataURL(file);
                      }} />
                      <div style={{ fontFamily: "Plus Jakarta Sans", fontSize: 11, color: "var(--tf-muted,#aaa)", marginTop: 4 }}>
                        {profile.photo ? "Tap to change photo" : "Tap to upload a photo (optional)"}
                      </div>
                    </div>

                    {profile.accountType === "business" && (
                      <>
                        <div style={{ marginBottom: 13 }}><label style={{ fontFamily: "Plus Jakarta Sans", fontSize: 11, fontWeight: 600, color: "var(--tf-sub,#555)", display: "block", marginBottom: 5 }}>BUSINESS NAME *</label><input className="inp" placeholder="e.g. Smith Painting Co." value={profile.businessName} onChange={e => setProfile(p => ({ ...p, businessName: e.target.value }))} /></div>
                        <div style={{ marginBottom: 13 }}>
                          <label style={{ fontFamily: "Plus Jakarta Sans", fontSize: 11, fontWeight: 600, color: "var(--tf-sub,#555)", display: "block", marginBottom: 5 }}>BUSINESS TYPE</label>
                          <select className="inp" value={profile.businessType} onChange={e => setProfile(p => ({ ...p, businessType: e.target.value }))} style={{ appearance: "none" }}>
                            <option value="">Select type…</option>
                            {BUSINESS_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                          </select>
                        </div>
                        <div style={{ height: 1, background: "#E5E2DC", margin: "14px 0" }} />
                      </>
                    )}
                    <div style={{ marginBottom: 13 }}><label style={{ fontFamily: "Plus Jakarta Sans", fontSize: 11, fontWeight: 600, color: "var(--tf-sub,#555)", display: "block", marginBottom: 5 }}>{profile.accountType === "business" ? "CONTACT NAME *" : "YOUR NAME *"}</label><input className="inp" placeholder="Display name" value={profile.name} onChange={e => setProfile(p => ({ ...p, name: e.target.value }))} /></div>
                    <div style={{ marginBottom: 13 }}><label style={{ fontFamily: "Plus Jakarta Sans", fontSize: 11, fontWeight: 600, color: "var(--tf-sub,#555)", display: "block", marginBottom: 5 }}>EMAIL ADDRESS *</label><input className="inp" type="email" placeholder="your@email.com" value={profile.email || ""} onChange={e => setProfile(p => ({ ...p, email: e.target.value }))} /></div>
                    <div style={{ marginBottom: 13 }}><label style={{ fontFamily: "Plus Jakarta Sans", fontSize: 11, fontWeight: 600, color: "var(--tf-sub,#555)", display: "block", marginBottom: 5 }}>PHONE <span style={{ fontWeight: 400, color: "var(--tf-muted,#aaa)" }}>(optional)</span></label><input className="inp" type="tel" placeholder="+1 (555) 000-0000" value={profile.phone || ""} onChange={e => setProfile(p => ({ ...p, phone: e.target.value }))} /></div>
                    <div style={{ marginBottom: 6 }}><label style={{ fontFamily: "Plus Jakarta Sans", fontSize: 11, fontWeight: 600, color: "var(--tf-sub,#555)", display: "block", marginBottom: 5 }}>GENERAL LOCATION <span style={{ fontWeight: 400, color: "var(--tf-muted,#aaa)" }}>(optional)</span></label><input className="inp" placeholder="City or neighborhood — no street address" value={profile.location} onChange={e => setProfile(p => ({ ...p, location: e.target.value }))} /></div>
                    <p style={{ fontFamily: "Plus Jakarta Sans", fontSize: 11, color: "var(--tf-muted,#aaa)", marginBottom: 18, lineHeight: 1.6 }}>🔒 Email and phone are private — used only for contracts & notifications.</p>
                    <button className="bp" style={{ marginBottom: 9 }} onClick={() => setProfileStep(3)} disabled={!profile.name || !profile.email || (profile.accountType === "business" && !profile.businessName)}>Continue →</button>
                    <button className="bg" onClick={() => setProfileStep(1)}>← Back</button>
                  </div>
                )}

                {/* STEP 3 — bio, headline, skills, availability */}
                {profileStep === 3 && (
                  <div>
                    <div style={{ marginBottom: 13 }}>
                      <label style={{ fontFamily: "Plus Jakarta Sans", fontSize: 11, fontWeight: 600, color: "var(--tf-sub,#555)", display: "block", marginBottom: 5 }}>HEADLINE <span style={{ fontWeight: 400, color: "var(--tf-muted,#aaa)" }}>(optional)</span></label>
                      <input className="inp" placeholder={profile.accountType === "business" ? "e.g. Licensed & Insured Residential Painter" : "e.g. Experienced baker & home cook"} value={profile.headline || ""} onChange={e => setProfile(p => ({ ...p, headline: e.target.value }))} />
                      <div style={{ fontFamily: "Plus Jakarta Sans", fontSize: 11, color: "var(--tf-muted,#aaa)", marginTop: 4 }}>A short tagline shown on your listing cards.</div>
                    </div>
                    <div style={{ marginBottom: 13 }}>
                      <label style={{ fontFamily: "Plus Jakarta Sans", fontSize: 11, fontWeight: 600, color: "var(--tf-sub,#555)", display: "block", marginBottom: 5 }}>{profile.accountType === "business" ? "ABOUT YOUR BUSINESS *" : "ABOUT YOU *"}</label>
                      <textarea className="inp" style={{ minHeight: 100 }} placeholder={profile.accountType === "business" ? "Describe your services, credentials, years in business, and what makes you stand out…" : "Describe who you are, what skills or goods you offer, your experience, and what kinds of trades you're open to…"} value={profile.bio} onChange={e => setProfile(p => ({ ...p, bio: e.target.value }))} />
                    </div>
                    <div style={{ marginBottom: 13 }}>
                      <label style={{ fontFamily: "Plus Jakarta Sans", fontSize: 11, fontWeight: 600, color: "var(--tf-sub,#555)", display: "block", marginBottom: 5 }}>WHAT I'M LOOKING FOR <span style={{ fontWeight: 400, color: "var(--tf-muted,#aaa)" }}>(optional)</span></label>
                      <textarea className="inp" style={{ minHeight: 70 }} placeholder="e.g. I'm open to exchanging baked goods for lawn care, childcare, or tech help…" value={profile.lookingFor || ""} onChange={e => setProfile(p => ({ ...p, lookingFor: e.target.value }))} />
                    </div>
                    <SkillTagInput
                      skills={profile.skills}
                      onChange={skills => setProfile(p => ({ ...p, skills }))}
                      placeholder={profile.accountType === "business" ? "e.g. Painting, Drywall, Colour Consultation" : "e.g. Baking, Dog Walking, Excel"}
                    />
                    <div style={{ marginBottom: 13 }}>
                      <label style={{ fontFamily: "Plus Jakarta Sans", fontSize: 11, fontWeight: 600, color: "var(--tf-sub,#555)", display: "block", marginBottom: 4 }}>AVAILABILITY</label>
                      <p style={{ fontFamily: "Plus Jakarta Sans", fontSize: 12, color: "var(--tf-muted,#999)", marginBottom: 8, lineHeight: 1.5 }}>Let traders know if you're currently open to new trade offers. You can change this at any time from your profile.</p>
                      <div style={{ display: "flex", gap: 8 }}>
                        {[["open", "🟢 Open"], ["limited", "🟡 Limited"], ["closed", "🔴 Closed"]].map(([v, l]) => (
                          <button key={v} className={`tbtn ${profile.availability === v ? "on" : ""}`} onClick={() => setProfile(p => ({ ...p, availability: v }))} style={{ fontSize: 12 }}>{l}</button>
                        ))}
                      </div>
                    </div>
                    <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>
                      <div style={{ flex: 1 }}><label style={{ fontFamily: "Plus Jakarta Sans", fontSize: 11, fontWeight: 600, color: "var(--tf-sub,#555)", display: "block", marginBottom: 5 }}>YEARS EXPERIENCE <span style={{ fontWeight: 400, color: "var(--tf-muted,#aaa)" }}>(opt.)</span></label><input className="inp" type="number" min="0" max="60" placeholder="e.g. 8" value={profile.yearsExp || ""} onChange={e => setProfile(p => ({ ...p, yearsExp: e.target.value }))} /></div>
                      <div style={{ flex: 1 }}><label style={{ fontFamily: "Plus Jakarta Sans", fontSize: 11, fontWeight: 600, color: "var(--tf-sub,#555)", display: "block", marginBottom: 5 }}>LICENSE / CERT # <span style={{ fontWeight: 400, color: "var(--tf-muted,#aaa)" }}>(opt.)</span></label><input className="inp" placeholder="e.g. LIC-00123" value={profile.licenseNo || ""} onChange={e => setProfile(p => ({ ...p, licenseNo: e.target.value }))} /></div>
                    </div>
                    <button className="bp" style={{ marginBottom: 9 }} disabled={!profile.bio} onClick={() => setProfileStep(4)}>Continue →</button>
                    <button className="bg" onClick={() => setProfileStep(2)}>← Back</button>
                  </div>
                )}

                {/* STEP 4 — socials */}
                {profileStep === 4 && (
                  <div>
                    <p style={{ fontFamily: "Plus Jakarta Sans", fontSize: 14, color: "var(--tf-sub,#555)", marginBottom: 14, lineHeight: 1.6 }}>
                      {profile.accountType === "business" ? "Add your business's social media and web links to build trust and show your work." : "Optionally add a social or portfolio link so people can see your work."}
                    </p>
                    <div style={{ background: "var(--tf-bg,#F0EEE9)", borderRadius: 12, padding: "9px 13px", marginBottom: 16, fontFamily: "Plus Jakarta Sans", fontSize: 12, color: "var(--tf-muted,#888)" }}>
                      💡 Free plan shows your first 2 links publicly. <button onClick={() => setShowPricing("upgrade")} style={{ background: "none", border: "none", color: "#E85D3A", fontFamily: "Plus Jakarta Sans", fontSize: 12, fontWeight: 600, cursor: "pointer", padding: 0 }}>Upgrade to Pro</button> to show all 6.
                    </div>
                    {profile.accountType === "business" ? (
                      <div>
                        {SOCIAL_PLATFORMS.map(pl => (
                          <div key={pl.id} className="social-row">
                            <div className="social-icon"><BrandIcon id={pl.id} size={18} /></div>
                            <input className="inp" style={{ fontSize: 12 }} placeholder={pl.placeholder} value={profile.socials[pl.id] || ""} onChange={e => setProfile(pr => ({ ...pr, socials: { ...pr.socials, [pl.id]: e.target.value } }))} />
                          </div>
                        ))}
                        <div className="toggle-wrap" style={{ marginTop: 14 }}>
                          <div>
                            <div style={{ fontFamily: "Plus Jakarta Sans", fontSize: 13, fontWeight: 600, color: "var(--tf-text,#1A1A1A)" }}>Show links publicly</div>
                            <div style={{ fontFamily: "Plus Jakarta Sans", fontSize: 11, color: "var(--tf-muted,#888)", marginTop: 2 }}>Off = only visible to users you've connected with</div>
                          </div>
                          <div className="toggle-track" style={{ background: profile.socialsPublic ? "#E85D3A" : "#DDD8CE" }} onClick={() => setProfile(p => ({ ...p, socialsPublic: !p.socialsPublic }))}>
                            <div className="toggle-thumb" style={{ left: profile.socialsPublic ? 22 : 2 }} />
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div style={{ marginBottom: 20 }}>
                        <label style={{ fontFamily: "Plus Jakarta Sans", fontSize: 11, fontWeight: 600, color: "var(--tf-sub,#555)", display: "block", marginBottom: 5 }}>SOCIAL OR PORTFOLIO LINK <span style={{ fontWeight: 400, color: "var(--tf-muted,#aaa)" }}>(optional)</span></label>
                        {SOCIAL_PLATFORMS.map(pl => (
                          <div key={pl.id} className="social-row">
                            <div className="social-icon"><BrandIcon id={pl.id} size={18} /></div>
                            <input className="inp" style={{ fontSize: 12 }} placeholder={pl.placeholder} value={profile.socials[pl.id] || ""} onChange={e => setProfile(pr => ({ ...pr, socials: { ...pr.socials, [pl.id]: e.target.value } }))} />
                          </div>
                        ))}
                      </div>
                    )}
                    <button className="bp" style={{ marginTop: 6, marginBottom: 9 }} onClick={() => { setProfileDone(true); setShowOnboarding(true); }}>Finish & Join 🌿</button>
                    <button className="bg" onClick={() => setProfileStep(3)}>← Back</button>
                  </div>
                )}
              </div>

            ) : (
              /* ── PROFILE VIEW ── */
              <div>
                {/* Hero */}
                <div style={{ textAlign: "center", padding: "10px 0 18px" }}>
                  <div style={{ position: "relative", width: 88, height: 88, margin: "0 auto 12px" }}>
                    <div style={{ width: 88, height: 88, borderRadius: profile.accountType === "business" ? "22px" : "50%", background: "#1A1A1A", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      {profile.photo
                        ? <img src={profile.photo} alt="profile" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                        : <span style={{ color: "#fff", fontFamily: "Plus Jakarta Sans", fontWeight: 600, fontSize: 24 }}>{(profile.businessName || profile.name).slice(0, 2).toUpperCase()}</span>}
                    </div>
                    {profile.availability && (
                      <div style={{ position: "absolute", bottom: -2, right: -2, width: 22, height: 22, borderRadius: "50%", background: "var(--tf-card,#fff)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, boxShadow: "0 1px 4px rgba(0,0,0,.15)" }}>
                        {{"open":"🟢","limited":"🟡","closed":"🔴"}[profile.availability]}
                      </div>
                    )}
                  </div>

                  <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 7, flexWrap: "wrap" }}>
                    <div className="stitle" style={{ fontSize: 20 }}>{profile.accountType === "business" ? profile.businessName : profile.name}</div>
                    {profile.accountType === "business" && <span className="biz-badge">🏢 Business</span>}
                    {membership.verified && <span className="plan-badge verified">✓ Verified</span>}
                  </div>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 7, marginTop: 6 }}>
                    <span className={`plan-badge ${membership.plan}`}>{membership.plan === "pro" ? "⭐ Pro" : "Free plan"}</span>
                    {membership.plan === "free" && (
                      <button onClick={() => setShowPricing("upgrade")} style={{ background: "none", border: "1.5px solid #E85D3A", borderRadius: 100, padding: "3px 12px", fontFamily: "Plus Jakarta Sans", fontSize: 11, fontWeight: 600, color: "#E85D3A", cursor: "pointer" }}>Upgrade →</button>
                    )}
                  </div>
                  {profile.headline && <div style={{ fontFamily: "Plus Jakarta Sans", fontSize: 13, color: "#E85D3A", fontWeight: 500, marginTop: 3 }}>{profile.headline}</div>}
                  {profile.accountType === "business" && profile.businessType && <div style={{ fontFamily: "Plus Jakarta Sans", fontSize: 12, color: "#4B8EF0", marginTop: 2 }}>{profile.businessType}</div>}
                  {profile.accountType === "business" && <div style={{ fontFamily: "Plus Jakarta Sans", fontSize: 12, color: "var(--tf-muted,#888)", marginTop: 1 }}>Contact: {profile.name}</div>}
                  {profile.location && <div style={{ fontFamily: "Plus Jakarta Sans", fontSize: 12, color: "var(--tf-muted,#999)", marginTop: 4 }}>📍 {profile.location}</div>}
                  <button onClick={() => setEditingProfile(true)} style={{ marginTop: 12, background: "none", border: "1.5px solid var(--tf-border,#DDD8CE)", borderRadius: 100, padding: "7px 20px", fontFamily: "Plus Jakarta Sans", fontSize: 12, fontWeight: 600, color: "var(--tf-sub,#555)", cursor: "pointer" }}>✏️ Edit profile</button>
                </div>

                {/* Stats */}
                <div style={{ display: "flex", gap: 9, marginBottom: 16 }}>
                  {[[conversations.filter(c => c.status === "agreed").length.toString(), "Trades"], [myListings.length.toString(), "Listings"], [conversations.length.toString(), "Offers"]].map(([n, l]) => (
                    <div key={l} style={{ flex: 1, background: "var(--tf-card,#fff)", borderRadius: 14, padding: "13px 8px", textAlign: "center", boxShadow: "0 2px 9px rgba(26,26,26,.06)" }}>
                      <div className="stitle" style={{ fontSize: 17 }}>{n}</div>
                      <div style={{ fontFamily: "Plus Jakarta Sans", fontSize: 10, color: "var(--tf-muted,#999)", marginTop: 2 }}>{l}</div>
                    </div>
                  ))}
                </div>

                {/* About */}
                {profile.bio && (
                  <div className="p-section">
                    <div className="p-section-title">About</div>
                    <p style={{ fontFamily: "Plus Jakarta Sans", fontSize: 13, color: theme.text, lineHeight: 1.65 }}>{profile.bio}</p>
                  </div>
                )}

                {/* Reputation Badges */}
                {(() => {
                  const myTradeCount = completedConvs.size;
                  const myReviews = reviews.filter(r => myListings.some(l => l.id === r.listingId));
                  const myAvgRating = myReviews.length > 0 ? myReviews.reduce((a,b) => a + b.rating, 0) / myReviews.length : 0;
                  const ctx = { trades: myTradeCount, rating: myAvgRating, reviewCount: myReviews.length, verified: membership.verified, isPro: membership.plan === "pro" };
                  const earned = BADGE_DEFS.filter(b => b.test(ctx));
                  const locked = BADGE_DEFS.filter(b => !b.test(ctx) && b.next(ctx));
                  return (
                    <div className="p-section">
                      <div className="p-section-title">Reputation Badges</div>
                      {earned.length === 0 && (
                        <p style={{ fontFamily: "Plus Jakarta Sans", fontSize: 12.5, color: "var(--tf-muted,#888)", lineHeight: 1.6, marginBottom: 12 }}>
                          Complete your first trade to start earning badges.
                        </p>
                      )}
                      {earned.length > 0 && (
                        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 14 }}>
                          {earned.map(b => (
                            <div key={b.id} style={{ background: theme.id === "dark" ? b.color + "18" : b.bg, border: `1.5px solid ${theme.id === "dark" ? b.color + "55" : b.border}`, borderRadius: 12, padding: "9px 12px", display: "flex", alignItems: "center", gap: 8, minWidth: 130 }}>
                              <span style={{ fontSize: 20 }}>{b.icon}</span>
                              <div>
                                <div style={{ fontFamily: "Plus Jakarta Sans", fontSize: 12, fontWeight: 700, color: b.color }}>{b.label}</div>
                                <div style={{ fontFamily: "Plus Jakarta Sans", fontSize: 10, color: "var(--tf-muted,#aaa)", marginTop: 1 }}>{b.desc}</div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                      {locked.length > 0 && (
                        <>
                          <div style={{ fontFamily: "Plus Jakarta Sans", fontSize: 10, fontWeight: 700, color: "var(--tf-muted,#bbb)", letterSpacing: ".06em", marginBottom: 8 }}>NEXT TO UNLOCK</div>
                          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                            {locked.slice(0, 3).map(b => (
                              <div key={b.id} style={{ background: "var(--tf-input,#F8F6F1)", border: "1.5px dashed var(--tf-border,#DDD8CE)", borderRadius: 12, padding: "9px 12px", display: "flex", alignItems: "center", gap: 8, minWidth: 130, opacity: 0.75 }}>
                                <span style={{ fontSize: 20, filter: "grayscale(1)" }}>{b.icon}</span>
                                <div>
                                  <div style={{ fontFamily: "Plus Jakarta Sans", fontSize: 12, fontWeight: 700, color: "var(--tf-sub,#666)" }}>{b.label}</div>
                                  <div style={{ fontFamily: "Plus Jakarta Sans", fontSize: 10, color: "var(--tf-muted,#aaa)", marginTop: 1, lineHeight: 1.4 }}>{b.next(ctx)}</div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </>
                      )}
                    </div>
                  );
                })()}

                {/* Invite a Friend */}
                {profileDone && referralCode && (
                  <div className="p-section">
                    <div className="p-section-title">Invite Friends</div>
                    <p style={{ fontFamily: "Plus Jakarta Sans", fontSize: 12.5, color: "var(--tf-muted,#888)", lineHeight: 1.6, marginBottom: 14 }}>
                      Share your code and earn an extra listing slot for every friend who joins.
                    </p>
                    {/* Referral code card */}
                    <div style={{ background: theme.input, border: "1.5px solid " + theme.border, borderRadius: 14, padding: "14px 16px", marginBottom: 12 }}>
                      <div style={{ fontFamily: "Plus Jakarta Sans", fontSize: 10, fontWeight: 700, color: "#E85D3A", letterSpacing: ".08em", marginBottom: 6 }}>YOUR INVITE CODE</div>
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <div style={{ fontFamily: "monospace", fontSize: 22, fontWeight: 700, color: "var(--tf-text,#1A1A1A)", letterSpacing: ".12em", flex: 1 }}>{referralCode}</div>
                        <button onClick={() => {
                          const msg = `Join me on Bartr — the community marketplace for bartering skills and goods! Use my code ${referralCode} when you sign up: https://Bartr.app`;
                          if (navigator.share) { navigator.share({ title: "Join Bartr", text: msg }).catch(() => {}); }
                          else { navigator.clipboard?.writeText(msg).then(() => showToast("Invite link copied! 🎉")); }
                        }} style={{ background: theme.primary, border: "none", borderRadius: 100, padding: "8px 16px", fontFamily: "Plus Jakarta Sans", fontSize: 12, fontWeight: 700, color: theme.bg, cursor: "pointer", flexShrink: 0 }}>
                          Share 🔗
                        </button>
                      </div>
                    </div>
                    {/* Stats */}
                    <div style={{ display: "flex", gap: 9 }}>
                      <div style={{ flex: 1, background: "var(--tf-card,#fff)", border: "1.5px solid var(--tf-border,#E5E2DC)", borderRadius: 12, padding: "11px 10px", textAlign: "center" }}>
                        <div style={{ fontFamily: "'Instrument Serif',serif", fontSize: 20, color: "var(--tf-text,#1A1A1A)" }}>{referrals.length}</div>
                        <div style={{ fontFamily: "Plus Jakarta Sans", fontSize: 10, color: "var(--tf-muted,#aaa)", marginTop: 2 }}>Friends joined</div>
                      </div>
                      <div style={{ flex: 1, background: "var(--tf-card,#fff)", border: "1.5px solid var(--tf-border,#E5E2DC)", borderRadius: 12, padding: "11px 10px", textAlign: "center" }}>
                        <div style={{ fontFamily: "'Instrument Serif',serif", fontSize: 20, color: "#E85D3A" }}>+{referrals.length}</div>
                        <div style={{ fontFamily: "Plus Jakarta Sans", fontSize: 10, color: "var(--tf-muted,#aaa)", marginTop: 2 }}>Bonus listing slots</div>
                      </div>
                    </div>
                    {referrals.length > 0 && (
                      <div style={{ marginTop: 12 }}>
                        <div style={{ fontFamily: "Plus Jakarta Sans", fontSize: 10, fontWeight: 700, color: "var(--tf-muted,#bbb)", letterSpacing: ".06em", marginBottom: 8 }}>JOINED VIA YOUR CODE</div>
                        {referrals.map((r, i) => (
                          <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "7px 0", borderBottom: "1px solid var(--tf-border,#F0EDE6)" }}>
                            <div style={{ width: 28, height: 28, borderRadius: "50%", background: theme.input, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13 }}>🌿</div>
                            <div>
                              <div style={{ fontFamily: "Plus Jakarta Sans", fontSize: 12, fontWeight: 600, color: "var(--tf-text,#1A1A1A)" }}>Friend #{i + 1}</div>
                              <div style={{ fontFamily: "Plus Jakarta Sans", fontSize: 10, color: "var(--tf-muted,#aaa)" }}>Joined {new Date(r.redeemedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</div>
                            </div>
                            <span style={{ marginLeft: "auto", background: theme.input, color: theme.accent, borderRadius: 100, padding: "2px 9px", fontFamily: "Plus Jakarta Sans", fontSize: 10, fontWeight: 700 }}>+1 slot</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
                {profile.skills?.length > 0 && (
                  <div className="p-section">
                    <div className="p-section-title">Skills & Offerings</div>
                    <div className="skill-wrap">
                      {profile.skills.map((s, i) => <span key={i} className="skill-tag">{s}</span>)}
                    </div>
                  </div>
                )}

                {/* Looking for */}
                {profile.lookingFor && (
                  <div className="p-section">
                    <div className="p-section-title">Looking For</div>
                    <p style={{ fontFamily: "Plus Jakarta Sans", fontSize: 13, color: "#444", lineHeight: 1.65 }}>{profile.lookingFor}</p>
                  </div>
                )}

                {/* Details */}
                {(profile.availability || profile.yearsExp || profile.licenseNo || profile.phone) && (
                  <div className="p-section">
                    <div className="p-section-title">Details</div>
                    {profile.availability && (
                      <div className="p-row">
                        <div className="p-label">Availability</div>
                        <div className="p-val">
                          <span className={`avail-pill ${profile.availability}`}>{{"open":"🟢 Open to trades","limited":"🟡 Limited availability","closed":"🔴 Not taking trades"}[profile.availability]}</span>
                        </div>
                      </div>
                    )}
                    {profile.yearsExp && <div className="p-row"><div className="p-label">Experience</div><div className="p-val">{profile.yearsExp} {profile.yearsExp === "1" ? "year" : "years"}</div></div>}
                    {profile.licenseNo && <div className="p-row"><div className="p-label">License / Cert</div><div className="p-val" style={{ fontFamily: "monospace", fontSize: 12 }}>{profile.licenseNo}</div></div>}
                    {profile.phone && <div className="p-row"><div className="p-label">Phone</div><div className="p-val">{profile.phone}</div></div>}
                  </div>
                )}

                {/* Social links */}
                {Object.entries(profile.socials || {}).filter(([,v])=>v).length > 0 && (
                  <div className="p-section">
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                      <div className="p-section-title" style={{ marginBottom: 0 }}>Links & Social</div>
                      {profile.accountType === "business" && (
                        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                          <span style={{ fontFamily: "Plus Jakarta Sans", fontSize: 11, color: "var(--tf-muted,#888)" }}>{profile.socialsPublic ? "Public" : "Connections only"}</span>
                          <div className="toggle-track" style={{ background: profile.socialsPublic ? "#E85D3A" : "#DDD8CE", width: 36, height: 20 }} onClick={() => setProfile(p => ({ ...p, socialsPublic: !p.socialsPublic }))}>
                            <div className="toggle-thumb" style={{ left: profile.socialsPublic ? 16 : 2, width: 16, height: 16 }} />
                          </div>
                        </div>
                      )}
                    </div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                      {Object.entries(profile.socials).filter(([,v])=>v).map(([id, url]) => {
                        const plat = SOCIAL_PLATFORMS.find(p => p.id === id);
                        if (!plat) return null;
                        return <a key={id} className="social-chip" href={`https://${url}`} target="_blank" rel="noopener noreferrer"><BrandIcon id={plat.id} size={18} /> {plat.label}</a>;
                      })}
                    </div>
                  </div>
                )}
                {profile.accountType === "personal" && profile.socialLink && (
                  <div style={{ marginBottom: 14 }}>
                    <a className="social-chip" href={`https://${profile.socialLink}`} target="_blank" rel="noopener noreferrer">🔗 {profile.socialLink}</a>
                  </div>
                )}

                {/* Reviews received */}
                {(() => {
                  const myReviews = reviews.filter(r => myListings.some(l => l.id === r.listingId));
                  if (myReviews.length === 0) return null;
                  const avg = (myReviews.reduce((a,b) => a + b.rating, 0) / myReviews.length).toFixed(1);
                  return (
                    <div className="p-section">
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                        <div className="p-section-title" style={{ marginBottom: 0 }}>Reviews</div>
                        <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                          <StarDisplay rating={parseFloat(avg)} size={13} />
                          <span style={{ fontFamily: "Plus Jakarta Sans", fontSize: 12, fontWeight: 600, color: "var(--tf-text,#1A1A1A)" }}>{avg}</span>
                          <span style={{ fontFamily: "Plus Jakarta Sans", fontSize: 11, color: "var(--tf-muted,#aaa)" }}>({myReviews.length})</span>
                        </div>
                      </div>
                      {myReviews.map(r => <ReviewCard key={r.id} review={r} canReply={true} onReply={replyToReview} />)}
                    </div>
                  );
                })()}

                {/* Membership */}
                <div className="p-section">
                  <div className="p-section-title">Membership</div>
                  <div style={{ background: membership.plan === "pro" ? "linear-gradient(135deg,#1A1A1A,#3a5a3c)" : theme.input, borderRadius: 16, padding: "16px", marginBottom: 10 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                      <div>
                        <div style={{ fontFamily: "Plus Jakarta Sans", fontSize: 15, fontWeight: 700, color: membership.plan === "pro" ? "#fff" : theme.text }}>
                          {membership.plan === "pro" ? "⭐ Pro Plan" : "Free Plan"}
                        </div>
                        <div style={{ fontFamily: "Plus Jakarta Sans", fontSize: 11, color: membership.plan === "pro" ? "rgba(255,255,255,.65)" : "#aaa", marginTop: 2 }}>
                          {membership.plan === "pro"
                            ? `Billed ${membership.billingCycle === "yearly" ? "yearly — $99/yr" : "monthly — $12/mo"}`
                            : `${myListings.length} / ${PLANS.free.listingLimit} listings used`
                          }
                        </div>
                      </div>
                      {membership.plan === "free"
                        ? <button onClick={() => setShowPricing("upgrade")} style={{ background: theme.primary, border: "none", borderRadius: 100, padding: "8px 16px", fontFamily: "Plus Jakarta Sans", fontSize: 12, fontWeight: 600, color: theme.bg, cursor: "pointer" }}>Upgrade ⭐</button>
                        : <button onClick={() => { setMembership({ plan: "free", verified: false, billingCycle: "monthly" }); showToast("Downgraded to Free plan."); }} style={{ background: "none", border: "1.5px solid rgba(255,255,255,.3)", borderRadius: 100, padding: "6px 13px", fontFamily: "Plus Jakarta Sans", fontSize: 11, color: "rgba(255,255,255,.7)", cursor: "pointer" }}>Cancel</button>
                      }
                    </div>
                    {membership.plan === "free" && (
                      <div style={{ background: "var(--tf-card,#fff)", borderRadius: 10, height: 5, overflow: "hidden" }}>
                        <div style={{ height: "100%", width: `${(myListings.length / PLANS.free.listingLimit) * 100}%`, background: myListings.length >= PLANS.free.listingLimit ? "#EF4444" : "#E85D3A", borderRadius: 10, transition: "width .3s" }} />
                      </div>
                    )}
                  </div>
                  {/* Verified badge */}
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 14px", background: "var(--tf-card,#fff)", borderRadius: 14, border: "1.5px solid var(--tf-border,#E5E2DC)" }}>
                    <div>
                      <div style={{ fontFamily: "Plus Jakarta Sans", fontSize: 13, fontWeight: 600, color: "var(--tf-text,#1A1A1A)", display: "flex", alignItems: "center", gap: 6 }}>
                        {membership.verified ? "✓ Identity Verified" : "Identity Verification"}
                        {membership.verified && <span className="plan-badge verified">✓ Verified</span>}
                      </div>
                      <div style={{ fontFamily: "Plus Jakarta Sans", fontSize: 11, color: "var(--tf-muted,#aaa)", marginTop: 2 }}>
                        {membership.verified ? "Verified badge shown on your profile" : "One-time $4.99 — builds trust with your community"}
                      </div>
                    </div>
                    {!membership.verified && (
                      <button onClick={() => setShowPricing("verify")} style={{ background: "#FFF8E1", border: "1.5px solid #FCD34D", borderRadius: 100, padding: "7px 13px", fontFamily: "Plus Jakarta Sans", fontSize: 11, fontWeight: 600, color: "#D97706", cursor: "pointer", flexShrink: 0 }}>Get verified</button>
                    )}
                  </div>
                </div>

                {/* Saved listings */}
                {favorites.size > 0 && (
                  <div className="p-section">
                    <div className="p-section-title">Saved Listings ♥</div>
                    {listings.filter(l => favorites.has(l.id)).map(l => (
                      <ListingCard key={l.id} listing={l} onClick={() => openListing(l)} />
                    ))}
                  </div>
                )}

                {/* Blocked accounts */}
                {blocked.size > 0 && (
                  <div className="p-section">
                    <div className="p-section-title">Blocked Accounts</div>
                    {listings.filter(l => blocked.has(l.id)).map(l => (
                      <div key={l.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "9px 0", borderBottom: "1px solid var(--tf-border,#F0EDE6)" }}>
                        <div style={{ fontFamily: "Plus Jakarta Sans", fontSize: 13, color: "var(--tf-muted,#aaa)" }}>🚫 {l.businessName || l.name} — {l.title}</div>
                        <button onClick={() => { setBlocked(prev => { const n = new Set(prev); n.delete(l.id); return n; }); showToast(`${l.name} unblocked.`); }}
                          style={{ background: "none", border: "1.5px solid var(--tf-border,#DDD8CE)", borderRadius: 100, padding: "4px 12px", fontFamily: "Plus Jakarta Sans", fontSize: 11, color: "var(--tf-muted,#888)", cursor: "pointer" }}>Unblock</button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Theme picker */}
                <div style={{ marginBottom: 16 }}>
                  <div style={{ fontFamily: "Plus Jakarta Sans", fontSize: 11, fontWeight: 700, color: theme.muted, letterSpacing: ".07em", textTransform: "uppercase", marginBottom: 9 }}>Appearance</div>
                  <div style={{ display: "flex", gap: 8 }}>
                    {Object.values(THEMES).map(t => (
                      <button key={t.id} onClick={() => setCurrentTheme(t.id)}
                        style={{ flex: 1, padding: "10px 4px", borderRadius: 14, border: "2px solid " + (currentTheme === t.id ? theme.accent : theme.border), background: t.bg, cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: 4, transition: "all .15s" }}>
                        <span style={{ fontSize: 16 }}>{t.emoji}</span>
                        <span style={{ fontFamily: "Plus Jakarta Sans", fontSize: 9, fontWeight: 600, color: t.text, letterSpacing: ".03em" }}>{t.label}</span>
                        <div style={{ display: "flex", gap: 2, marginTop: 1 }}>
                          <div style={{ width: 8, height: 8, borderRadius: "50%", background: t.primary }} />
                          <div style={{ width: 8, height: 8, borderRadius: "50%", background: t.accent }} />
                          <div style={{ width: 8, height: 8, borderRadius: "50%", background: t.card, border: "1px solid " + t.border }} />
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* My listings */}
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 9, marginTop: 4 }}>
                  <div className="stitle" style={{ fontSize: 15 }}>My Listings</div>
                  <button onClick={() => { setEditingListing(null); setScreen("create"); }} style={{ background: theme.primary, border: "none", borderRadius: 100, padding: "5px 13px", fontFamily: "Plus Jakarta Sans", fontSize: 12, fontWeight: 600, color: theme.bg, cursor: "pointer" }}>+ New</button>
                </div>
                {myListings.length === 0
                  ? <div style={{ textAlign: "center", padding: "24px 0", color: "var(--tf-muted,#999)", fontFamily: "Plus Jakarta Sans", fontSize: 13 }}>
                      <div style={{ fontSize: 28, marginBottom: 7 }}>📋</div>No listings yet.
                      <div style={{ marginTop: 13 }}><button className="bp" onClick={() => setScreen("create")}>+ Add a listing</button></div>
                    </div>
                  : myListings.map(l => {
                      const now = Date.now();
                      const age = l.listedAt ? (now - l.listedAt) / (1000 * 60 * 60 * 24) : 0;
                      const daysLeft = Math.max(0, Math.ceil(EXPIRY_DAYS - age));
                      const isExpiring = daysLeft <= 5 && daysLeft > 0;
                      const isExpired = daysLeft === 0 && l.listedAt;
                      return (
                        <div key={l.id}>
                          {/* Expiry nudge */}
                          {(isExpiring || isExpired) && (
                            <div style={{ background: isExpired ? "#FEF2F2" : "#FFFBEB", border: `1.5px solid ${isExpired ? "#FECACA" : "#FCD34D"}`, borderRadius: 14, padding: "11px 14px", marginBottom: 6, display: "flex", alignItems: "center", gap: 10 }}>
                              <span style={{ fontSize: 18 }}>{isExpired ? "⏰" : "⚠️"}</span>
                              <div style={{ flex: 1 }}>
                                <div style={{ fontFamily: "Plus Jakarta Sans", fontSize: 12, fontWeight: 700, color: isExpired ? "#DC2626" : "#92400E" }}>
                                  {isExpired ? "Listing expired" : `Expires in ${daysLeft} day${daysLeft === 1 ? "" : "s"}`}
                                </div>
                                <div style={{ fontFamily: "Plus Jakarta Sans", fontSize: 11, color: isExpired ? "#EF4444" : "#B45309", marginTop: 1 }}>
                                  {isExpired ? "Renew to keep it visible to traders." : "Renew now to stay discoverable."}
                                </div>
                              </div>
                              <div style={{ display: "flex", gap: 6 }}>
                                <button onClick={() => renewListing(l)} style={{ background: isExpired ? "#DC2626" : "#D97706", border: "none", borderRadius: 100, padding: "5px 12px", fontFamily: "Plus Jakarta Sans", fontSize: 11, fontWeight: 700, color: "#fff", cursor: "pointer" }}>Renew</button>
                                <button onClick={() => archiveListing(l)} style={{ background: "none", border: `1px solid ${isExpired ? "#FECACA" : "#FCD34D"}`, borderRadius: 100, padding: "5px 10px", fontFamily: "Plus Jakarta Sans", fontSize: 11, color: isExpired ? "#EF4444" : "#B45309", cursor: "pointer" }}>Archive</button>
                              </div>
                            </div>
                          )}
                          <div style={{ position: "relative" }}>
                            <ListingCard listing={l} onClick={() => openListing(l)} />
                            {/* Days remaining pill */}
                            {l.listedAt && !isExpired && !isExpiring && daysLeft <= 30 && (
                              <div style={{ position: "absolute", top: 10, left: 10, background: "rgba(26,26,26,.75)", borderRadius: 100, padding: "2px 8px", fontFamily: "Plus Jakarta Sans", fontSize: 9, color: "#fff", zIndex: 4 }}>
                                {daysLeft}d left
                              </div>
                            )}
                            <button onClick={e => {
                              e.stopPropagation();
                              setEditingListing(l);
                              setNewListing({ title: l.title, desc: l.desc || "", category: l.category, type: l.type || "service", photos: l.photos || [], availability: l.availability || "open", contractDefaults: l.contractDefaults || { offer: "", lookingFor: "", conditions: "", contractType: "one-time" }, blockedDates: l.blockedDates || [] });
                              setScreen("create");
                            }} style={{ position: "absolute", top: 10, right: 10, background: theme.primary, border: "none", borderRadius: 100, padding: "4px 11px", fontFamily: "Plus Jakarta Sans", fontSize: 11, fontWeight: 600, color: theme.bg, cursor: "pointer", zIndex: 5 }}>Edit</button>
                          </div>
                          {/* Analytics row */}
                          {!isPro ? (
                            <div onClick={() => setShowPricing("upgrade")} style={{ position: "relative", cursor: "pointer", padding: "8px 4px 10px", borderTop: "1px solid var(--tf-border,#F0EDE6)", marginTop: -2 }}>
                              <div style={{ display: "flex", gap: 16, filter: "blur(4px)", userSelect: "none", pointerEvents: "none" }}>
                                {[["👁","12","views"],["♥","5","saves"],["💬","3","offers"]].map(([icon,val,label]) => (
                                  <div key={label} style={{ display: "flex", alignItems: "center", gap: 4 }}>
                                    <span style={{ fontSize: 11 }}>{icon}</span>
                                    <span style={{ fontFamily: "Plus Jakarta Sans", fontSize: 11, fontWeight: 600, color: "var(--tf-text,#1A1A1A)" }}>{val}</span>
                                    <span style={{ fontFamily: "Plus Jakarta Sans", fontSize: 11, color: "var(--tf-muted,#aaa)" }}>{label}</span>
                                  </div>
                                ))}
                              </div>
                              <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                                <span style={{ background: "#FFF7ED", border: "1px solid #FCD34D", borderRadius: 100, padding: "3px 10px", fontFamily: "Plus Jakarta Sans", fontSize: 10, fontWeight: 700, color: "#D97706" }}>⭐ Pro — unlock analytics</span>
                              </div>
                            </div>
                          ) : (() => {
                            const views = listingViews[l.id] || 0;
                            const saves = favorites.has(l.id) ? 1 : 0; // would be real count in prod
                            const offers = conversations.filter(c => c.listing?.id === l.id).length;
                            return (
                              <div style={{ display: "flex", gap: 16, padding: "6px 4px 10px", borderTop: "1px solid var(--tf-border,#F0EDE6)", marginTop: -2 }}>
                                {[
                                  { icon: "👁", val: views, label: "views" },
                                  { icon: "♥", val: favorites.size > 0 ? Math.floor(Math.random() * 8) + views : 0, label: "saves" },
                                  { icon: "💬", val: offers, label: offers === 1 ? "offer" : "offers" },
                                ].map(({ icon, val, label }) => (
                                  <div key={label} style={{ display: "flex", alignItems: "center", gap: 4 }}>
                                    <span style={{ fontSize: 11 }}>{icon}</span>
                                    <span style={{ fontFamily: "Plus Jakarta Sans", fontSize: 11, fontWeight: 600, color: "var(--tf-text,#1A1A1A)" }}>{val}</span>
                                    <span style={{ fontFamily: "Plus Jakarta Sans", fontSize: 11, color: "var(--tf-muted,#aaa)" }}>{label}</span>
                                  </div>
                                ))}
                                <div style={{ marginLeft: "auto" }}>
                                  {activeBoosted.includes(l.id) ? (
                                    <span style={{ background: "#FFF7ED", border: "1px solid #FCD34D", borderRadius: 100, padding: "3px 9px", fontFamily: "Plus Jakarta Sans", fontSize: 10, fontWeight: 700, color: "#D97706" }}>⚡ Active</span>
                                  ) : (
                                    <button onClick={() => { if (!isPro && referrals.length === 0) { setShowPricing("upgrade"); return; } setBoostTarget(l); }} style={{ background: "#FFF7ED", border: "1px solid #FCD34D", borderRadius: 100, padding: "3px 9px", fontFamily: "Plus Jakarta Sans", fontSize: 10, fontWeight: 700, color: "#D97706", cursor: "pointer" }}>⚡ Boost</button>
                                  )}
                                </div>
                              </div>
                            );
                          })()}
                        </div>
                      );
                    })
                }

                {/* Archived listings */}
                {archivedListings.length > 0 && (
                  <div style={{ marginTop: 8 }}>
                    <button onClick={() => setShowArchived(v => !v)}
                      style={{ display: "flex", alignItems: "center", gap: 8, background: "none", border: "none", cursor: "pointer", padding: "8px 0", width: "100%" }}>
                      <span style={{ fontFamily: "Plus Jakarta Sans", fontSize: 12, fontWeight: 600, color: "var(--tf-muted,#aaa)" }}>
                        {showArchived ? "▾" : "▸"} Archived ({archivedListings.length})
                      </span>
                    </button>
                    {showArchived && (
                      <div style={{ opacity: 0.7 }}>
                        {archivedListings.map(l => (
                          <div key={l.id} style={{ position: "relative", marginBottom: 6 }}>
                            <ListingCard listing={l} onClick={() => {}} />
                            <div style={{ position: "absolute", inset: 0, borderRadius: 14, background: "rgba(255,255,255,.4)", pointerEvents: "none" }} />
                            <button onClick={() => unarchiveListing(l)}
                              style={{ position: "absolute", top: 10, right: 10, background: "#E85D3A", border: "none", borderRadius: 100, padding: "4px 11px", fontFamily: "Plus Jakarta Sans", fontSize: 11, fontWeight: 600, color: "#fff", cursor: "pointer", zIndex: 5 }}>Restore</button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Sign out */}
                <div style={{ marginTop: 24, marginBottom: 12, paddingTop: 20, borderTop: "1px solid var(--tf-border,#F0EDE6)" }}>
                  <div style={{ fontFamily: "Plus Jakarta Sans", fontSize: 11, color: theme.muted, textAlign: "center", marginBottom: 10 }}>{authUser.email}</div>
                  <button onClick={() => {
                    try { window.storage.delete("tf:auth"); } catch (_) {}
                    setAuthUser(null); setAuthScreen("landing");
                    setProfile({ name: "", bio: "", headline: "", location: "", email: "", phone: "", accountType: "personal", businessName: "", businessType: "", socials: {}, socialsPublic: true, socialLink: "", photo: null, skills: [], lookingFor: "", availability: "", yearsExp: "", licenseNo: "" });
                    setProfileDone(false); setProfileStep(1);
                    setMyListings([]); setListings(LISTINGS);
                    setConversations([]); setReviews([]);
                    setFavorites(new Set()); setBlocked(new Set()); setReported(new Set());
                    setNotifications([]); setCompletedConvs(new Set());
                    setMembership({ plan: "free", verified: false, billingCycle: "monthly" });
                    setShowPricing(false); setStorageReady(false);
                  }} style={{ width: "100%", background: "none", border: "1.5px solid " + theme.border, borderRadius: 100, padding: "11px", fontFamily: "Plus Jakarta Sans", fontSize: 13, color: theme.muted, cursor: "pointer" }}>Sign out</button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* PROFILE EDIT OVERLAY */}
      {editingProfile && (
        <div className="profile-edit-overlay" style={{ position: "fixed", inset: 0, zIndex: 200, background: theme.bg, maxWidth: 720, margin: "0 auto", overflowY: "auto", display: "flex", flexDirection: "column" }}>
          {/* Header */}
          <div className="profile-edit-header" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "18px 20px 14px", background: theme.card, borderBottom: "1px solid " + theme.border, position: "sticky", top: 0, zIndex: 10 }}>
            <button onClick={() => setEditingProfile(false)} style={{ background: "none", border: "none", fontFamily: "Plus Jakarta Sans", fontSize: 14, color: theme.muted, cursor: "pointer", padding: 0 }}>Cancel</button>
            <div style={{ fontFamily: "'Instrument Serif',serif", fontSize: 17, letterSpacing: "-0.01em", color: theme.primary }}>Edit Profile</div>
            <button onClick={() => { setEditingProfile(false); showToast("Profile updated! ✏️"); }} style={{ background: theme.primary, border: "none", borderRadius: 100, padding: "7px 16px", fontFamily: "Plus Jakarta Sans", fontSize: 13, fontWeight: 600, color: theme.bg, cursor: "pointer" }}>Save</button>
          </div>

          <div style={{ padding: "20px 20px 48px", display: "flex", flexDirection: "column", gap: 0 }}>
            {/* Photo */}
            <div style={{ textAlign: "center", marginBottom: 20 }}>
              <label htmlFor="edit-photo" style={{ cursor: "pointer" }}>
                <div style={{ width: 88, height: 88, borderRadius: profile.accountType === "business" ? "22px" : "50%", background: "#1A1A1A", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 8px", position: "relative" }}>
                  {profile.photo ? <img src={profile.photo} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : <span style={{ color: "#fff", fontFamily: "Plus Jakarta Sans", fontWeight: 600, fontSize: 24 }}>{(profile.businessName || profile.name || "?").slice(0, 2).toUpperCase()}</span>}
                  <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,.35)", display: "flex", alignItems: "center", justifyContent: "center" }}><span style={{ fontSize: 20 }}>📷</span></div>
                </div>
                <div style={{ fontFamily: "Plus Jakarta Sans", fontSize: 12, color: "#E85D3A", fontWeight: 600 }}>Change photo</div>
              </label>
              <input id="edit-photo" type="file" accept="image/*" style={{ display: "none" }} onChange={e => {
                const file = e.target.files[0]; if (!file) return;
                const reader = new FileReader();
                reader.onload = ev => setProfile(p => ({ ...p, photo: ev.target.result }));
                reader.readAsDataURL(file);
                e.target.value = "";
              }} />
            </div>

            {/* Name */}
            <div style={{ marginBottom: 14 }}>
              <label style={{ fontFamily: "Plus Jakarta Sans", fontSize: 11, fontWeight: 600, color: "var(--tf-sub,#555)", display: "block", marginBottom: 5, letterSpacing: ".05em" }}>{profile.accountType === "business" ? "CONTACT NAME" : "NAME"}</label>
              <input className="inp" value={profile.name} onChange={e => setProfile(p => ({ ...p, name: e.target.value }))} placeholder="Your name" />
            </div>

            {profile.accountType === "business" && (
              <div style={{ marginBottom: 14 }}>
                <label style={{ fontFamily: "Plus Jakarta Sans", fontSize: 11, fontWeight: 600, color: "var(--tf-sub,#555)", display: "block", marginBottom: 5, letterSpacing: ".05em" }}>BUSINESS NAME</label>
                <input className="inp" value={profile.businessName} onChange={e => setProfile(p => ({ ...p, businessName: e.target.value }))} placeholder="Business name" />
              </div>
            )}

            <div style={{ marginBottom: 14 }}>
              <label style={{ fontFamily: "Plus Jakarta Sans", fontSize: 11, fontWeight: 600, color: "var(--tf-sub,#555)", display: "block", marginBottom: 5, letterSpacing: ".05em" }}>HEADLINE</label>
              <input className="inp" value={profile.headline} onChange={e => setProfile(p => ({ ...p, headline: e.target.value }))} placeholder="e.g. Freelance Designer & Maker" />
            </div>

            <div style={{ marginBottom: 14 }}>
              <label style={{ fontFamily: "Plus Jakarta Sans", fontSize: 11, fontWeight: 600, color: "var(--tf-sub,#555)", display: "block", marginBottom: 5, letterSpacing: ".05em" }}>BIO</label>
              <textarea className="inp" value={profile.bio} onChange={e => setProfile(p => ({ ...p, bio: e.target.value }))} placeholder="Tell people about yourself..." style={{ minHeight: 90 }} />
            </div>

            <div style={{ marginBottom: 14 }}>
              <label style={{ fontFamily: "Plus Jakarta Sans", fontSize: 11, fontWeight: 600, color: "var(--tf-sub,#555)", display: "block", marginBottom: 5, letterSpacing: ".05em" }}>LOCATION</label>
              <input className="inp" value={profile.location} onChange={e => setProfile(p => ({ ...p, location: e.target.value }))} placeholder="Neighbourhood or city" />
            </div>

            <div style={{ marginBottom: 14 }}>
              <label style={{ fontFamily: "Plus Jakarta Sans", fontSize: 11, fontWeight: 600, color: "var(--tf-sub,#555)", display: "block", marginBottom: 5, letterSpacing: ".05em" }}>LOOKING FOR</label>
              <textarea className="inp" value={profile.lookingFor} onChange={e => setProfile(p => ({ ...p, lookingFor: e.target.value }))} placeholder="What would you like to trade for?" style={{ minHeight: 70 }} />
            </div>

            {/* Skills */}
            <div style={{ marginBottom: 14 }}>
              <label style={{ fontFamily: "Plus Jakarta Sans", fontSize: 11, fontWeight: 600, color: "var(--tf-sub,#555)", display: "block", marginBottom: 8, letterSpacing: ".05em" }}>SKILLS & OFFERINGS</label>
              <div className="skill-wrap" style={{ marginBottom: 8 }}>
                {(profile.skills || []).map((s, i) => (
                  <span key={i} className="skill-tag">{s}<button className="rm" onClick={() => setProfile(p => ({ ...p, skills: p.skills.filter((_,j)=>j!==i) }))}>×</button></span>
                ))}
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <input className="inp" style={{ marginBottom: 0 }} placeholder="Add a skill & press Enter" onKeyDown={e => {
                  if (e.key === "Enter" && e.target.value.trim()) {
                    setProfile(p => ({ ...p, skills: [...(p.skills||[]), e.target.value.trim()] }));
                    e.target.value = "";
                    e.preventDefault();
                  }
                }} />
              </div>
            </div>

            {/* Availability */}
            <div style={{ marginBottom: 14 }}>
              <label style={{ fontFamily: "Plus Jakarta Sans", fontSize: 11, fontWeight: 600, color: "var(--tf-sub,#555)", display: "block", marginBottom: 8, letterSpacing: ".05em" }}>AVAILABILITY</label>
              <div style={{ display: "flex", gap: 8 }}>
                {[["open","🟢 Open"],["limited","🟡 Limited"],["closed","🔴 Closed"]].map(([val, label]) => (
                  <button key={val} onClick={() => setProfile(p => ({ ...p, availability: val }))}
                    style={{ flex: 1, padding: "9px 4px", borderRadius: 12, border: `2px solid ${profile.availability === val ? "#1A1A1A" : "#E5E2DC"}`, background: profile.availability === val ? "#1A1A1A" : "#fff", fontFamily: "Plus Jakarta Sans", fontSize: 11, fontWeight: 600, color: profile.availability === val ? "#fff" : "#888", cursor: "pointer" }}>{label}</button>
                ))}
              </div>
            </div>

            {/* Details */}
            <div style={{ marginBottom: 14 }}>
              <label style={{ fontFamily: "Plus Jakarta Sans", fontSize: 11, fontWeight: 600, color: "var(--tf-sub,#555)", display: "block", marginBottom: 5, letterSpacing: ".05em" }}>YEARS EXPERIENCE</label>
              <input className="inp" type="number" min="0" value={profile.yearsExp} onChange={e => setProfile(p => ({ ...p, yearsExp: e.target.value }))} placeholder="e.g. 5" />
            </div>

            <div style={{ marginBottom: 14 }}>
              <label style={{ fontFamily: "Plus Jakarta Sans", fontSize: 11, fontWeight: 600, color: "var(--tf-sub,#555)", display: "block", marginBottom: 5, letterSpacing: ".05em" }}>LICENSE / CERTIFICATION</label>
              <input className="inp" value={profile.licenseNo} onChange={e => setProfile(p => ({ ...p, licenseNo: e.target.value }))} placeholder="Optional" />
            </div>

            <div style={{ marginBottom: 14 }}>
              <label style={{ fontFamily: "Plus Jakarta Sans", fontSize: 11, fontWeight: 600, color: "var(--tf-sub,#555)", display: "block", marginBottom: 5, letterSpacing: ".05em" }}>PHONE</label>
              <input className="inp" type="tel" value={profile.phone} onChange={e => setProfile(p => ({ ...p, phone: e.target.value }))} placeholder="Optional" />
            </div>

            {/* Social links */}
            <div style={{ marginBottom: 20 }}>
              <label style={{ fontFamily: "Plus Jakarta Sans", fontSize: 11, fontWeight: 600, color: "var(--tf-sub,#555)", display: "block", marginBottom: 8, letterSpacing: ".05em" }}>SOCIAL & WEB LINKS</label>
              {SOCIAL_PLATFORMS.map(plat => (
                <div key={plat.id} style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 8 }}>
                  <div className="social-icon"><BrandIcon id={plat.id} size={18} /></div>
                  <input className="inp" style={{ marginBottom: 0, flex: 1 }} value={profile.socials?.[plat.id] || ""} onChange={e => setProfile(p => ({ ...p, socials: { ...p.socials, [plat.id]: e.target.value } }))} placeholder={plat.placeholder} />
                </div>
              ))}
            </div>

            <button onClick={() => { setEditingProfile(false); showToast("Profile updated! ✏️"); }} className="bp">Save Changes</button>
          </div>
        </div>
      )}

      {/* ONBOARDING */}
      {showOnboarding && <OnboardingOverlay onDone={() => { setShowOnboarding(false); setScreen("home"); showToast("Welcome to Bartr! 🌿"); }} />}

      {/* ── HISTORY ── */}
      {screen === "history" && (() => {
        const completedList = conversations.filter(c => c.completed || c.status === "terminated");
        const reviewMap = {};
        reviews.forEach(r => { reviewMap[r.convId] = r; });

        return (
          <div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18 }}>
              <div className="stitle" style={{ fontSize: 20 }}>Trade History</div>
              <span style={{ fontFamily: "Plus Jakarta Sans", fontSize: 12, color: "var(--tf-muted,#999)" }}>{completedList.length} trade{completedList.length !== 1 ? "s" : ""}</span>
            </div>

            {completedList.length === 0 ? (
              <div style={{ textAlign: "center", padding: "60px 20px" }}>
                <div style={{ fontSize: 48, marginBottom: 14 }}>🤝</div>
                <div style={{ fontFamily: "'Instrument Serif',serif", fontSize: 18, color: "var(--tf-text,#1A1A1A)", marginBottom: 8 }}>No trades yet</div>
                <p style={{ fontFamily: "Plus Jakarta Sans", fontSize: 13, color: "var(--tf-muted,#999)", lineHeight: 1.6, maxWidth: 260, margin: "0 auto 24px" }}>
                  Completed and ended trades will appear here as a record of your exchange history.
                </p>
                <button className="bp" onClick={() => setScreen("browse")}>Browse listings</button>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
                {completedList.map((conv, idx) => {
                  const isComplete = conv.completed && conv.status !== "terminated";
                  const isTerminated = conv.status === "terminated";
                  const rev = reviewMap[conv.id];
                  const contractType = conv.currentContractData?.contractType || "one-time";
                  const completedDate = conv.completedAt
                    ? new Date(conv.completedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
                    : conv.messages?.filter(m => m.from === "system").slice(-1)[0]?.ts || "";

                  return (
                    <div key={conv.id}>
                      {/* Timeline connector */}
                      {idx > 0 && (
                        <div style={{ display: "flex", gap: 0, paddingLeft: 19 }}>
                          <div style={{ width: 2, height: 16, background: "var(--tf-border,#E5E2DC)", margin: "0 auto" }} />
                        </div>
                      )}

                      <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                        {/* Timeline dot */}
                        <div style={{ flexShrink: 0, display: "flex", flexDirection: "column", alignItems: "center", marginTop: 14 }}>
                          <div style={{
                            width: 36, height: 36, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16,
                            background: isTerminated ? "var(--tf-input,#FEF2F2)" : "var(--tf-input,#E8F5EC)",
                            border: "2px solid " + (isTerminated ? "#FECACA" : "#A7F3D0"),
                          }}>
                            {isTerminated ? "🔚" : "🎉"}
                          </div>
                        </div>

                        {/* Card */}
                        <div style={{ flex: 1, background: "var(--tf-card,#fff)", borderRadius: 16, padding: "14px 16px", border: "1.5px solid var(--tf-border,#E5E2DC)", marginBottom: 0 }}>
                          {/* Status + date row */}
                          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
                            <span style={{
                              fontFamily: "Plus Jakarta Sans", fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: ".07em",
                              color: isTerminated ? "#EF4444" : "#E85D3A",
                              background: isTerminated ? (conv.status === "dark" ? "#2A0A0A" : "#FEF2F2") : "#E8F5EC",
                              borderRadius: 100, padding: "2px 9px",
                            }}>
                              {isTerminated ? "Ended" : "Completed"}
                            </span>
                            <span style={{ fontFamily: "Plus Jakarta Sans", fontSize: 11, color: "var(--tf-muted,#bbb)" }}>{completedDate}</span>
                          </div>

                          {/* Listing title */}
                          <div style={{ fontFamily: "'Instrument Serif',serif", fontSize: 15, color: "var(--tf-text,#1A1A1A)", marginBottom: 3, lineHeight: 1.3 }}>
                            {conv.listing.title}
                          </div>

                          {/* Trade partner */}
                          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 10 }}>
                            <div style={{ width: 20, height: 20, borderRadius: "50%", background: "var(--tf-primary,#1A1A1A)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9, fontWeight: 700, color: "#fff", fontFamily: "Plus Jakarta Sans" }}>
                              {conv.listing.name.slice(0, 2).toUpperCase()}
                            </div>
                            <span style={{ fontFamily: "Plus Jakarta Sans", fontSize: 12, color: "var(--tf-sub,#666)" }}>with <strong style={{ color: "var(--tf-text,#1A1A1A)" }}>{conv.listing.name}</strong></span>
                            {contractType !== "one-time" && (
                              <span style={{ fontFamily: "Plus Jakarta Sans", fontSize: 10, color: "var(--tf-muted,#999)", background: "var(--tf-input,#F5F2EE)", borderRadius: 100, padding: "1px 7px", marginLeft: 2 }}>{contractType}</span>
                            )}
                          </div>

                          {/* What was swapped */}
                          {conv.currentContractData && (
                            <div style={{ display: "flex", alignItems: "stretch", gap: 0, borderRadius: 10, overflow: "hidden", border: "1px solid var(--tf-border,#E5E2DC)", marginBottom: 12 }}>
                              <div style={{ flex: 1, padding: "8px 10px", background: "var(--tf-input,#FAFFF9)" }}>
                                <div style={{ fontFamily: "Plus Jakarta Sans", fontSize: 9, fontWeight: 700, color: "#E85D3A", textTransform: "uppercase", letterSpacing: ".06em", marginBottom: 3 }}>You offered</div>
                                <div style={{ fontFamily: "Plus Jakarta Sans", fontSize: 12, color: "var(--tf-text,#1A1A1A)", lineHeight: 1.4 }}>
                                  {conv.currentContractData.party1Offer || conv.listing.title}
                                </div>
                              </div>
                              <div style={{ width: 1, background: "var(--tf-border,#E5E2DC)" }} />
                              <div style={{ flex: 1, padding: "8px 10px", background: "var(--tf-input,#FAFFF9)" }}>
                                <div style={{ fontFamily: "Plus Jakarta Sans", fontSize: 9, fontWeight: 700, color: "#E85D3A", textTransform: "uppercase", letterSpacing: ".06em", marginBottom: 3 }}>You received</div>
                                <div style={{ fontFamily: "Plus Jakarta Sans", fontSize: 12, color: "var(--tf-text,#1A1A1A)", lineHeight: 1.4 }}>
                                  {conv.currentContractData.party2Offer || conv.currentContractData.details2 || "—"}
                                </div>
                              </div>
                            </div>
                          )}

                          {/* Review left */}
                          {rev ? (
                            <div style={{ display: "flex", alignItems: "flex-start", gap: 8, padding: "9px 11px", background: "var(--tf-input,#FFFBEB)", borderRadius: 10, border: "1px solid var(--tf-border,#FDE68A)" }}>
                              <span style={{ fontSize: 14 }}>⭐</span>
                              <div>
                                <div style={{ display: "flex", gap: 6, alignItems: "center", marginBottom: 2 }}>
                                  <StarDisplay rating={rev.rating} size={11} />
                                  <span style={{ fontFamily: "Plus Jakarta Sans", fontSize: 10, color: "var(--tf-muted,#999)" }}>your review</span>
                                </div>
                                {rev.text && <p style={{ fontFamily: "Plus Jakarta Sans", fontSize: 11, color: "var(--tf-sub,#666)", margin: 0, lineHeight: 1.6 }}>"{rev.text}"</p>}
                              </div>
                            </div>
                          ) : isComplete ? (
                            <button onClick={() => setReviewTarget({ convId: conv.id, listing: conv.listing })}
                              style={{ width: "100%", padding: "8px", borderRadius: 10, border: "1.5px dashed var(--tf-border,#DDD8CE)", background: "none", fontFamily: "Plus Jakarta Sans", fontSize: 12, color: "var(--tf-muted,#aaa)", cursor: "pointer" }}>
                              ⭐ Leave a review
                            </button>
                          ) : null}

                          {/* Action buttons */}
                          <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
                            <button onClick={() => setSelectedReceiptId(conv.id)}
                              style={{ flex: 1, padding: "7px", borderRadius: 10, border: "1px solid var(--tf-border,#E5E2DC)", background: "none", fontFamily: "Plus Jakarta Sans", fontSize: 12, color: "var(--tf-sub,#666)", cursor: "pointer" }}>
                              📄 View Receipt
                            </button>
                            <button onClick={() => openConversation(conv.id)}
                              style={{ flex: 1, padding: "7px", borderRadius: 10, border: "1px solid var(--tf-border,#E5E2DC)", background: "none", fontFamily: "Plus Jakarta Sans", fontSize: 12, color: "var(--tf-sub,#666)", cursor: "pointer" }}>
                              💬 Chat
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        );
      })()}

      {/* TRADE RECEIPT SHEET */}
      {selectedReceiptId && (() => {
        const conv = conversations.find(c => c.id === selectedReceiptId);
        if (!conv) return null;
        const rev = reviews.find(r => r.convId === conv.id);
        const isComplete = conv.completed && conv.status !== "terminated";
        const completedDate = conv.completedAt
          ? new Date(conv.completedAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })
          : "Unknown date";
        const contractType = conv.currentContractData?.contractType || "one-time";
        const shareReceipt = () => {
          const text = `Bartr receipt\n\n"${conv.listing.title}" with ${conv.listing.name}\nStatus: ${isComplete ? "Completed ✅" : "Ended 🔚"}\nDate: ${completedDate}`;
          if (navigator.share) navigator.share({ title: "Trade Receipt", text }).catch(() => {});
          else navigator.clipboard?.writeText(text).then(() => showToast("Receipt copied! 📄"));
        };
        return (
          <div className="overlay" onClick={() => setSelectedReceiptId(null)}>
            <div className="sheet" onClick={e => e.stopPropagation()} style={{ maxHeight: "90vh", overflowY: "auto" }}>
              <div style={{ width: 38, height: 4, background: "#E0DDD6", borderRadius: 100, margin: "0 auto 18px" }} />

              {/* Receipt header */}
              <div style={{ textAlign: "center", marginBottom: 20 }}>
                <div style={{ fontSize: 44, marginBottom: 8 }}>{isComplete ? "🎉" : "🔚"}</div>
                <div style={{ fontFamily: "'Instrument Serif',serif", fontSize: 20, letterSpacing: "-0.01em", color: "var(--tf-text,#1A1A1A)", marginBottom: 4 }}>
                  Trade {isComplete ? "Complete" : "Ended"}
                </div>
                <div style={{ fontFamily: "Plus Jakarta Sans", fontSize: 12, color: "var(--tf-muted,#aaa)" }}>{completedDate}</div>
              </div>

              {/* Parties */}
              <div style={{ display: "flex", gap: 0, borderRadius: 12, overflow: "hidden", border: "1.5px solid var(--tf-border,#E5E2DC)", marginBottom: 14 }}>
                <div style={{ flex: 1, padding: "12px 14px", background: "var(--tf-input,#FAFFF9)" }}>
                  <div style={{ fontFamily: "Plus Jakarta Sans", fontSize: 9, fontWeight: 700, color: "#E85D3A", letterSpacing: ".07em", marginBottom: 5 }}>YOU</div>
                  <div style={{ fontFamily: "Plus Jakarta Sans", fontSize: 13, fontWeight: 600, color: "var(--tf-text,#1A1A1A)" }}>{profile.name || "You"}</div>
                  <div style={{ fontFamily: "Plus Jakarta Sans", fontSize: 11, color: "var(--tf-muted,#aaa)", marginTop: 2 }}>{conv.currentContractData?.party1Offer || conv.listing.title}</div>
                </div>
                <div style={{ width: 1, background: "var(--tf-border,#E5E2DC)" }} />
                <div style={{ flex: 1, padding: "12px 14px", background: "var(--tf-input,#FAFFF9)" }}>
                  <div style={{ fontFamily: "Plus Jakarta Sans", fontSize: 9, fontWeight: 700, color: "#E85D3A", letterSpacing: ".07em", marginBottom: 5 }}>COUNTERPARTY</div>
                  <div style={{ fontFamily: "Plus Jakarta Sans", fontSize: 13, fontWeight: 600, color: "var(--tf-text,#1A1A1A)" }}>{conv.listing.name}</div>
                  <div style={{ fontFamily: "Plus Jakarta Sans", fontSize: 11, color: "var(--tf-muted,#aaa)", marginTop: 2 }}>{conv.currentContractData?.party2Offer || conv.currentContractData?.details2?.slice(0, 50) || conv.listing.title}</div>
                </div>
              </div>

              {/* Contract details */}
              <div style={{ background: "var(--tf-input,#F0EEE9)", borderRadius: 12, padding: "12px 14px", marginBottom: 14 }}>
                <div style={{ fontFamily: "Plus Jakarta Sans", fontSize: 10, fontWeight: 700, color: "var(--tf-muted,#aaa)", letterSpacing: ".07em", marginBottom: 10 }}>AGREEMENT DETAILS</div>
                {[
                  { label: "Listing", val: conv.listing.title },
                  { label: "Type", val: contractType.charAt(0).toUpperCase() + contractType.slice(1) },
                  { label: "Trade ID", val: "#TF-" + String(conv.id).slice(-6).toUpperCase() },
                  { label: "Messages", val: conv.messages?.filter(m => m.from !== "system").length || 0 },
                ].map(({ label, val }) => (
                  <div key={label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "5px 0", borderBottom: "1px solid var(--tf-border,#EAE7E0)" }}>
                    <span style={{ fontFamily: "Plus Jakarta Sans", fontSize: 12, color: "var(--tf-muted,#aaa)" }}>{label}</span>
                    <span style={{ fontFamily: "Plus Jakarta Sans", fontSize: 12, fontWeight: 600, color: "var(--tf-text,#1A1A1A)" }}>{val}</span>
                  </div>
                ))}
              </div>

              {/* Review */}
              {rev ? (
                <div style={{ padding: "11px 13px", background: "#FFFBEB", borderRadius: 12, border: "1px solid #FDE68A", marginBottom: 14 }}>
                  <div style={{ fontFamily: "Plus Jakarta Sans", fontSize: 10, fontWeight: 700, color: "#D97706", letterSpacing: ".07em", marginBottom: 7 }}>YOUR REVIEW</div>
                  <div style={{ display: "flex", gap: 4, marginBottom: 5 }}>
                    {[1,2,3,4,5].map(i => <span key={i} style={{ fontSize: 14, opacity: i <= rev.rating ? 1 : 0.2 }}>⭐</span>)}
                  </div>
                  {rev.text && <p style={{ fontFamily: "Plus Jakarta Sans", fontSize: 12, color: "#666", margin: 0, lineHeight: 1.6 }}>"{rev.text}"</p>}
                </div>
              ) : isComplete ? (
                <button onClick={() => { setSelectedReceiptId(null); setReviewTarget({ convId: conv.id, listing: conv.listing }); }}
                  style={{ width: "100%", padding: "10px", borderRadius: 12, border: "1.5px dashed #DDD8CE", background: "none", fontFamily: "Plus Jakarta Sans", fontSize: 12, color: "#aaa", cursor: "pointer", marginBottom: 14 }}>
                  ⭐ Leave a review
                </button>
              ) : null}

              {/* Actions */}
              <div style={{ display: "flex", gap: 8 }}>
                <button onClick={shareReceipt}
                  style={{ flex: 1, padding: "12px", background: "var(--tf-primary,#1A1A1A)", border: "none", borderRadius: 100, fontFamily: "Plus Jakarta Sans", fontSize: 13, fontWeight: 600, color: "#fff", cursor: "pointer" }}>
                  Share receipt 🔗
                </button>
                <button onClick={() => { setSelectedReceiptId(null); openConversation(conv.id); }}
                  style={{ flex: 1, padding: "12px", background: "none", border: "1.5px solid var(--tf-border,#E5E2DC)", borderRadius: 100, fontFamily: "Plus Jakarta Sans", fontSize: 13, color: "var(--tf-sub,#666)", cursor: "pointer" }}>
                  View chat
                </button>
              </div>
            </div>
          </div>
        );
      })()}

      </div>{/* /tf-main */}

      {/* BOTTOM NAV */}
      <div className="tf-bottom-nav" style={{ position: "fixed", bottom: 0, left: "50%", transform: "translateX(-50%)", width: "100%", maxWidth: 720, background: theme.nav, borderTop: "1px solid " + theme.border, padding: "9px 4px 20px", display: "flex", zIndex: 50 }}>
        {[
          { id: "home",     Icon: Home,           label: "Home" },
          { id: "browse",   Icon: Search,         label: "Browse",   badge: savedSearchNewCount > 0 },
          { id: "history",  Icon: Clock,          label: "History" },
          { id: "messages", Icon: MessageSquare,  label: "Messages", badge: unreadCount > 0 },
          { id: "profile",  Icon: User,           label: "Profile" },
        ].map(({ id, Icon, label, badge }) => (
          <div key={id} className={`nav-i ${screen === id ? "on" : ""}`}
            onClick={() => { if (id === "messages") setActiveConvId(null); if (id !== "browse") setSearchQuery(""); setScreen(id); }}>
            <Icon size={22} strokeWidth={1.75} />
            {badge && <div className="badge-dot" />}
            <span className="nl">{label}</span>
          </div>
        ))}
      </div>

      {/* LISTING DETAIL SHEET */}
      {selectedListing && !intakeTarget && (
        <div className="overlay" onClick={() => setSelectedListing(null)}>
          <div className="sheet" style={{ padding: 0, overflow: "hidden" }} onClick={e => e.stopPropagation()}>

            {/* Photo gallery or plain header */}
            {selectedListing.photos?.length > 0 ? (
              <div style={{ position: "relative" }}>
                {/* Main photo */}
                <div style={{ height: 220, background: "#E5E2DC", position: "relative", cursor: "pointer" }}
                  onClick={() => setLightbox({ photos: selectedListing.photos, index: 0 })}>
                  <img src={selectedListing.photos[0]} alt={selectedListing.title} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                  <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(0,0,0,0) 50%, rgba(20,30,22,.7) 100%)" }} />
                  <div style={{ position: "absolute", top: 14, left: 14 }}>
                    <div style={{ width: 32, height: 4, background: "rgba(255,255,255,.4)", borderRadius: 100 }} />
                  </div>
                  {/* Share button */}
                  <button onClick={e => {
                    e.stopPropagation();
                    const text = `Check out "${selectedListing.title}" on Bartr — ${selectedListing.desc || ""}`.trim();
                    if (navigator.share) { navigator.share({ title: selectedListing.title, text, url: window.location.href }).catch(() => {}); }
                    else { navigator.clipboard?.writeText(text + "\n" + window.location.href).then(() => showToast("Link copied! 🔗")); }
                  }} style={{ position: "absolute", top: 12, right: 14, width: 34, height: 34, borderRadius: "50%", background: "rgba(0,0,0,.45)", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }} title="Share">
                    🔗
                  </button>
                  <div style={{ position: "absolute", bottom: 14, left: 16, right: 60 }}>
                    <div style={{ fontFamily: "'Instrument Serif',serif", fontSize: 19, color: "#fff", lineHeight: 1.2 }}>{selectedListing.title}</div>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 3 }}>
                      <div style={{ fontFamily: "Plus Jakarta Sans", fontSize: 13, color: "rgba(255,255,255,.8)" }}>{selectedListing.businessName || selectedListing.name}</div>
                      {!selectedListing.mine && (
                        <button onClick={e => { e.stopPropagation(); toggleFollow(selectedListing.name); }}
                          style={{ background: following.has(selectedListing.name) ? "rgba(76,175,130,.85)" : "rgba(255,255,255,.2)", border: `1px solid ${following.has(selectedListing.name) ? "#E85D3A" : "rgba(255,255,255,.4)"}`, borderRadius: 100, padding: "2px 9px", fontFamily: "Plus Jakarta Sans", fontSize: 10, fontWeight: 700, color: "#fff", cursor: "pointer" }}>
                          {following.has(selectedListing.name) ? "✓ Following" : "+ Follow"}
                        </button>
                      )}
                    </div>
                  </div>
                  {selectedListing.photos.length > 1 && (
                    <div style={{ position: "absolute", bottom: 18, right: 14, background: "rgba(0,0,0,.5)", borderRadius: 100, padding: "3px 10px", fontFamily: "Plus Jakarta Sans", fontSize: 11, color: "#fff" }}>
                      📷 1/{selectedListing.photos.length}
                    </div>
                  )}
                </div>
                {/* Thumbnail strip */}
                {selectedListing.photos.length > 1 && (
                  <div style={{ display: "flex", gap: 6, padding: "10px 16px", overflowX: "auto", background: "var(--tf-input,#FDFCFA)", borderBottom: "1px solid var(--tf-border,#F0EDE6)" }}>
                    {selectedListing.photos.map((src, i) => (
                      <div key={i} onClick={() => setLightbox({ photos: selectedListing.photos, index: i })}
                        style={{ width: 56, height: 56, borderRadius: 10, overflow: "hidden", flexShrink: 0, cursor: "pointer", border: "2px solid transparent", transition: "border-color .15s" }}
                        onMouseEnter={e => e.currentTarget.style.borderColor = "#E85D3A"}
                        onMouseLeave={e => e.currentTarget.style.borderColor = "transparent"}>
                        <img src={src} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                      </div>
                    ))}
                  </div>
                )}
                {/* Scrollable content */}
                <div style={{ padding: "14px 18px 28px", overflowY: "auto", maxHeight: "calc(85vh - 310px)" }}>
                  <div style={{ display: "flex", gap: 7, marginBottom: 13, flexWrap: "wrap" }}>
                    <span className="badge" style={{ background: catOf(selectedListing.category).color + "20", color: catOf(selectedListing.category).color }}>{catOf(selectedListing.category).icon} {catOf(selectedListing.category).label}</span>
                    <span className="badge" style={{ background: "#F0F0EC", color: "var(--tf-sub,#777)" }}>{selectedListing.type === "service" ? "🛠 Service" : "📦 Goods"}</span>
                    {selectedListing.neighbourhood && <span className="nbhd-badge">📍 {selectedListing.neighbourhood}</span>}
                  </div>
                  {selectedListing.desc && <p style={{ fontFamily: "Plus Jakarta Sans", fontSize: 14, color: "var(--tf-sub,#555)", lineHeight: 1.65, marginBottom: 16 }}>{selectedListing.desc}</p>}
                  <ListingDetailBody selectedListing={selectedListing} reviews={reviews} setSelectedListing={setSelectedListing} showToast={showToast} startIntake={startIntake} allListings={visibleListings} />
                </div>
              </div>
            ) : (
              <div style={{ padding: "18px 18px 28px", overflowY: "auto", maxHeight: "85vh" }}>
                <div style={{ width: 38, height: 4, background: "#E0DDD6", borderRadius: 100, margin: "0 auto 18px" }} />
                <div style={{ display: "flex", gap: 13, alignItems: "flex-start", marginBottom: 13 }}>
                  <div className="ava" style={{ width: 50, height: 50, background: catOf(selectedListing.category).color, fontSize: 16 }}>{selectedListing.avatar}</div>
                  <div style={{ flex: 1 }}>
                    <div className="stitle" style={{ fontSize: 17 }}>{selectedListing.title}</div>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 2 }}>
                      <div style={{ fontFamily: "Plus Jakarta Sans", fontSize: 13, color: "var(--tf-muted,#888)" }}>{selectedListing.name}</div>
                      {!selectedListing.mine && (
                        <button onClick={() => toggleFollow(selectedListing.name)}
                          style={{ background: following.has(selectedListing.name) ? "#E8F5EC" : "var(--tf-input,#F0EDE6)", border: `1.5px solid ${following.has(selectedListing.name) ? "#A7F3D0" : "var(--tf-border,#DDD8CE)"}`, borderRadius: 100, padding: "2px 10px", fontFamily: "Plus Jakarta Sans", fontSize: 10, fontWeight: 700, color: following.has(selectedListing.name) ? "#059669" : "var(--tf-muted,#888)", cursor: "pointer" }}>
                          {following.has(selectedListing.name) ? "✓ Following" : "+ Follow"}
                        </button>
                      )}
                    </div>
                  </div>
                  <button onClick={() => {
                    const text = `Check out "${selectedListing.title}" on Bartr — ${selectedListing.desc || ""}`.trim();
                    if (navigator.share) { navigator.share({ title: selectedListing.title, text, url: window.location.href }).catch(() => {}); }
                    else { navigator.clipboard?.writeText(text + "\n" + window.location.href).then(() => showToast("Link copied! 🔗")); }
                  }} style={{ width: 36, height: 36, borderRadius: "50%", background: "var(--tf-input,#F0EDE6)", border: "none", cursor: "pointer", fontSize: 17, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }} title="Share">🔗</button>
                </div>
                <div style={{ display: "flex", gap: 7, marginBottom: 13, flexWrap: "wrap" }}>
                  <span className="badge" style={{ background: catOf(selectedListing.category).color + "20", color: catOf(selectedListing.category).color }}>{catOf(selectedListing.category).icon} {catOf(selectedListing.category).label}</span>
                  <span className="badge" style={{ background: "#F0F0EC", color: "var(--tf-sub,#777)" }}>{selectedListing.type === "service" ? "🛠 Service" : "📦 Goods"}</span>
                  {selectedListing.neighbourhood && <span className="nbhd-badge">📍 {selectedListing.neighbourhood}</span>}
                </div>
                {selectedListing.desc && <p style={{ fontFamily: "Plus Jakarta Sans", fontSize: 14, color: "var(--tf-sub,#555)", lineHeight: 1.65, marginBottom: 16 }}>{selectedListing.desc}</p>}
                <ListingDetailBody selectedListing={selectedListing} reviews={reviews} setSelectedListing={setSelectedListing} showToast={showToast} startIntake={startIntake} allListings={visibleListings} />
              </div>
            )}
          </div>
        </div>
      )}

      {/* AI INTAKE FLOW */}
      {intakeTarget && (
        <div className="overlay">
          <div className="sheet" style={{ paddingBottom: 24 }}>
            <IntakeFlow
              listing={intakeTarget}
              myName={profile.name || "You"}
              contractDefaults={intakeTarget.contractDefaults || null}
              onComplete={onIntakeComplete}
              onCancel={() => setIntakeTarget(null)}
            />
          </div>
        </div>
      )}

      {/* LIGHTBOX */}
      {lightbox && <Lightbox photos={lightbox.photos} index={lightbox.index} onClose={() => setLightbox(null)} />}

      {/* BOOST MODAL */}
      {boostTarget && (
        <div style={{ position: "fixed", inset: 0, zIndex: 500, display: "flex", flexDirection: "column", justifyContent: "flex-end" }}>
          <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,.45)" }} onClick={() => setBoostTarget(null)} />
          <div style={{ position: "relative", background: "var(--tf-bg,#F0EEE9)", borderRadius: "24px 24px 0 0", padding: "24px 22px 36px", zIndex: 1 }}>
            <div style={{ width: 36, height: 4, background: "#E0DDD6", borderRadius: 100, margin: "0 auto 20px" }} />
            <div style={{ fontFamily: "'Instrument Serif',serif", fontSize: 22, color: "var(--tf-text,#1A1A1A)", marginBottom: 4 }}>⚡ Boost listing</div>
            <div style={{ fontFamily: "Plus Jakarta Sans", fontSize: 13, color: "var(--tf-muted,#999)", marginBottom: 20, lineHeight: 1.5 }}>
              Boosted listings appear at the top of Browse results for everyone in your area.
            </div>
            <div style={{ background: "var(--tf-card,#fff)", border: "1.5px solid var(--tf-border,#E5E2DC)", borderRadius: 14, padding: "12px 15px", marginBottom: 14 }}>
              <div style={{ fontFamily: "Plus Jakarta Sans", fontSize: 12, fontWeight: 700, color: "var(--tf-muted,#aaa)", marginBottom: 8, letterSpacing: ".05em" }}>LISTING</div>
              <div style={{ fontFamily: "Plus Jakarta Sans", fontSize: 14, fontWeight: 600, color: "var(--tf-text,#1A1A1A)" }}>{boostTarget.title}</div>
            </div>
            {/* Credit or Pro banner */}
            {isPro ? (
              <div style={{ background: "#E8F5EC", border: "1.5px solid #A7F3D0", borderRadius: 12, padding: "10px 14px", marginBottom: 18, display: "flex", gap: 10, alignItems: "center" }}>
                <span style={{ fontSize: 18 }}>⭐</span>
                <div style={{ fontFamily: "Plus Jakarta Sans", fontSize: 12, color: "#065F46" }}>Pro members boost for free — unlimited boosts included.</div>
              </div>
            ) : (
              <div style={{ background: "#FFFBEB", border: "1.5px solid #FCD34D", borderRadius: 12, padding: "10px 14px", marginBottom: 18, display: "flex", gap: 10, alignItems: "center" }}>
                <span style={{ fontSize: 18 }}>🎟️</span>
                <div>
                  <div style={{ fontFamily: "Plus Jakarta Sans", fontSize: 12, fontWeight: 700, color: "#92400E" }}>1 referral credit will be used</div>
                  <div style={{ fontFamily: "Plus Jakarta Sans", fontSize: 11, color: "#B45309", marginTop: 1 }}>{referrals.length} credit{referrals.length !== 1 ? "s" : ""} available</div>
                </div>
              </div>
            )}
            <div style={{ fontFamily: "Plus Jakarta Sans", fontSize: 12, fontWeight: 700, color: "var(--tf-muted,#aaa)", marginBottom: 10, letterSpacing: ".05em" }}>SELECT DURATION</div>
            <div style={{ display: "flex", gap: 10, marginBottom: 22 }}>
              {[[7, "7 days"], [14, "14 days"]].map(([days, label]) => (
                <button key={days} onClick={() => boostListing(boostTarget, days, !isPro)}
                  style={{ flex: 1, padding: "14px 8px", background: "var(--tf-card,#fff)", border: "2px solid #F59E0B", borderRadius: 14, cursor: "pointer", textAlign: "center" }}>
                  <div style={{ fontFamily: "'Instrument Serif',serif", fontSize: 20, color: "#D97706" }}>⚡</div>
                  <div style={{ fontFamily: "Plus Jakarta Sans", fontSize: 14, fontWeight: 700, color: "var(--tf-text,#1A1A1A)", marginTop: 4 }}>{label}</div>
                  <div style={{ fontFamily: "Plus Jakarta Sans", fontSize: 11, color: "var(--tf-muted,#999)", marginTop: 2 }}>{isPro ? "Free" : "1 credit"}</div>
                </button>
              ))}
            </div>
            <button onClick={() => setBoostTarget(null)} style={{ width: "100%", padding: "13px", background: "none", border: "1.5px solid var(--tf-border,#DDD8CE)", borderRadius: 100, fontFamily: "Plus Jakarta Sans", fontSize: 14, color: "var(--tf-muted,#999)", cursor: "pointer" }}>Cancel</button>
          </div>
        </div>
      )}

      {/* PRICING MODAL */}
      {showPricing && (
        <PricingSheet
          mode={showPricing}
          membership={membership}
          onUpgrade={(plan, cycle) => {
            setMembership(m => ({ ...m, plan, billingCycle: cycle }));
            setShowPricing(false);
            showToast(plan === "pro" ? "Welcome to Pro! ⭐" : "Upgraded!");
          }}
          onVerify={() => {
            setMembership(m => ({ ...m, verified: true }));
            setShowPricing(false);
            showToast("Identity verified! ✓");
          }}
          onClose={() => setShowPricing(false)}
        />
      )}

      {/* REPORT MODAL */}
      {reportTarget && (
        <ReportModal
          listing={reportTarget}
          alreadyReported={reported.has(reportTarget.id)}
          onReport={(reason) => {
            setReported(prev => new Set([...prev, reportTarget.id]));
            setReportTarget(null);
            showToast("Report submitted. Thank you. 🙏");
          }}
          onClose={() => setReportTarget(null)}
        />
      )}

      {/* EMAIL CONFIRMATION MODAL */}
      {emailConfirm && (
        <EmailConfirmModal
          data={emailConfirm}
          onClose={() => { setEmailConfirm(null); showToast("Trade complete! Leave a review 🌟"); }}
        />
      )}

      {/* REVIEW MODAL */}
      {reviewTarget && (
        <ReviewModal
          listing={reviewTarget.listing}
          onSubmit={(rating, text) => submitReview(reviewTarget.convId, rating, text)}
          onSkip={() => setReviewTarget(null)}
        />
      )}

      {toast && <div className="toast">{toast}</div>}
    </div>
  );
}

// ─── AI INTAKE FLOW ───────────────────────────────────────────────────────────

// ─── SCHEDULE PICKER ─────────────────────────────────────────────────────────

const TIME_SLOTS = [
  { id: "morning",   label: "Morning",   sub: "9 – 12am", hour: 9  },
  { id: "afternoon", label: "Afternoon", sub: "12 – 5pm", hour: 13 },
  { id: "evening",   label: "Evening",   sub: "5 – 8pm",  hour: 17 },
  { id: "flexible",  label: "Flexible",  sub: "to be agreed", hour: 9, flexible: true },
];
const MONTH_NAMES = ["January","February","March","April","May","June","July","August","September","October","November","December"];
const DOW = ["Su","Mo","Tu","We","Th","Fr","Sa"];

function SchedulePicker({ value, onChange, hint, blockedDates = [] }) {
  const today = new Date(); today.setHours(0,0,0,0);
  const initDate = value?.date || (hint ? (() => { const d = parseTradeDate(hint); return d && d >= today ? d : null; })() : null);
  const [viewYear,  setViewYear]  = useState((initDate || today).getFullYear());
  const [viewMonth, setViewMonth] = useState((initDate || today).getMonth());
  const [selDate,   setSelDate]   = useState(initDate || null);
  const [selSlot,   setSelSlot]   = useState(value?.slotId || null);

  const prevMonth = () => { if (viewMonth === 0) { setViewYear(y => y-1); setViewMonth(11); } else setViewMonth(m => m-1); };
  const nextMonth = () => { if (viewMonth === 11) { setViewYear(y => y+1); setViewMonth(0); } else setViewMonth(m => m+1); };

  const firstDay = new Date(viewYear, viewMonth, 1).getDay();
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();

  const cells = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  const selectDate = (d) => {
    const picked = new Date(viewYear, viewMonth, d);
    setSelDate(picked);
    if (selSlot) emit(picked, selSlot);
  };

  const selectSlot = (slot) => {
    if (slot.flexible) {
      setSelDate(null);
      setSelSlot(slot.id);
      onChange({ date: null, slotId: "flexible", display: "Flexible — to be agreed between both parties" });
      return;
    }
    setSelSlot(slot.id);
    if (selDate) emit(selDate, slot.id);
  };

  const emit = (date, slotId) => {
    const slot = TIME_SLOTS.find(s => s.id === slotId);
    const d = new Date(date);
    d.setHours(slot.hour, 0, 0, 0);
    const display = d.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" }) + `, ${slot.label} (${slot.sub})`;
    onChange({ date: d, slotId, display });
  };

  const isFlexible = selSlot === "flexible";

  return (
    <div style={{ background: "var(--tf-input,#FDFCFA)", border: "1.5px solid var(--tf-border,#E5E2DC)", borderRadius: 16, padding: "14px 16px" }}>
      {/* Month navigation — hidden when flexible */}
      {!isFlexible && (
        <>
          <div className="cal-header">
            <button className="cal-nav" onClick={prevMonth}>‹</button>
            <div style={{ fontFamily: "Plus Jakarta Sans", fontSize: 13, fontWeight: 600, color: "var(--tf-text,#1A1A1A)" }}>
              {MONTH_NAMES[viewMonth]} {viewYear}
            </div>
            <button className="cal-nav" onClick={nextMonth}>›</button>
          </div>

          {/* Day-of-week headers */}
          <div className="cal-grid">
            {DOW.map(d => <div key={d} className="cal-dow">{d}</div>)}
            {cells.map((day, i) => {
              if (!day) return <div key={`e${i}`} className="cal-day empty" />;
              const thisDate = new Date(viewYear, viewMonth, day);
              const isPast = thisDate < today;
              const isToday = thisDate.getTime() === today.getTime();
              const isSel = selDate && thisDate.getTime() === selDate.getTime();
              const dateKey = `${viewYear}-${String(viewMonth+1).padStart(2,"0")}-${String(day).padStart(2,"0")}`;
              const isOwnerBlocked = blockedDates.includes(dateKey);
              return (
                <button key={day}
                  className={`cal-day${(isPast || isOwnerBlocked) ? " past" : ""}${isToday ? " today" : ""}${isSel ? " sel" : ""}`}
                  style={isOwnerBlocked ? { background: "#FEE2E2", color: "#FCA5A5", position: "relative" } : {}}
                  title={isOwnerBlocked ? "Unavailable" : undefined}
                  onClick={() => !isPast && !isOwnerBlocked && selectDate(day)}>
                  {day}
                  {isOwnerBlocked && <span style={{ position: "absolute", bottom: 1, left: "50%", transform: "translateX(-50%)", fontSize: 6, color: "#EF4444", lineHeight: 1 }}>✕</span>}
                </button>
              );
            })}
          </div>
        </>
      )}

      {/* Time slots */}
      <div style={{ fontFamily: "Plus Jakarta Sans", fontSize: 11, fontWeight: 600, color: "var(--tf-muted,#999)", letterSpacing: ".05em", marginBottom: 8 }}>
        {isFlexible ? "SCHEDULING" : "TIME OF DAY"}
      </div>
      <div className="time-slots">
        {TIME_SLOTS.map(slot => (
          <button key={slot.id}
            className={`time-slot${selSlot === slot.id ? " sel" : ""}${slot.flexible ? " flexible" : ""}`}
            style={slot.flexible ? { borderStyle: "dashed" } : {}}
            onClick={() => selectSlot(slot)}>
            {slot.label} <span style={{ opacity: .65, fontSize: 11 }}>{slot.sub}</span>
          </button>
        ))}
      </div>

      {/* Confirmation label */}
      {isFlexible && (
        <div style={{ marginTop: 12, padding: "9px 13px", background: "#FFF8E1", borderRadius: 10, fontFamily: "Plus Jakarta Sans", fontSize: 12, color: "#92400E", display: "flex", alignItems: "center", gap: 7 }}>
          <span style={{ fontSize: 15 }}>🤝</span>
          <span>Both parties will agree on a time after the offer is accepted.</span>
          <span style={{ color: "#D97706", fontWeight: 600, marginLeft: "auto" }}>✓ Set</span>
        </div>
      )}
      {!isFlexible && selDate && selSlot && (
        <div style={{ marginTop: 12, padding: "9px 13px", background: "#F0F7F2", borderRadius: 10, fontFamily: "Plus Jakarta Sans", fontSize: 12, color: "var(--tf-text,#1A1A1A)", display: "flex", alignItems: "center", gap: 7 }}>
          <span style={{ fontSize: 15 }}>📅</span>
          <span><strong>{selDate.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}</strong> · {TIME_SLOTS.find(s => s.id === selSlot)?.label}</span>
          <span style={{ color: "#E85D3A", fontWeight: 600, marginLeft: "auto" }}>✓ Set</span>
        </div>
      )}
    </div>
  );
}

function IntakeFlow({ listing, myName, contractDefaults, onComplete, onCancel }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [summary, setSummary] = useState(null);
  const [offerText, setOfferText] = useState(contractDefaults?.offer || "");
  const [showContract, setShowContract] = useState(false);
  const [scheduledDate, setScheduledDate] = useState(null);
  const [contractType, setContractType] = useState(contractDefaults?.contractType || "one-time"); // { date, slotId, display }
  const scrollRef = useRef(null);
  const history = useRef([]);

  useEffect(() => {
    startIntake();
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  const addMsg = (text, role) => {
    const m = { id: Date.now() + Math.random(), text, role };
    setMessages(p => [...p, m]);
    return m;
  };

  const startIntake = async () => {
    setLoading(true);
    history.current = [];
    const defaultsContext = contractDefaults && (contractDefaults.offer || contractDefaults.conditions || contractDefaults.lookingFor)
      ? `\n\nIMPORTANT — This listing has pre-set default terms from the owner:\n${contractDefaults.offer ? `- What they offer: ${contractDefaults.offer}` : ""}\n${contractDefaults.lookingFor ? `- What they typically want in return: ${contractDefaults.lookingFor}` : ""}\n${contractDefaults.conditions ? `- Standard conditions: ${contractDefaults.conditions}` : ""}\nPresent these to the buyer naturally ("${listing.name} typically offers…") and ask if this works for them or if they need adjustments. Only ask follow-up questions for details NOT already covered by these defaults.`
      : "";

    const systemPrompt = `You are a helpful intake assistant for Bartr, a barter/exchange marketplace. Your job is to gather all the specific details needed to create a legally-adequate exchange contract for: "${listing.title}" offered by ${listing.name} (${listing.desc}).

Ask focused follow-up questions ONE AT A TIME to clarify the scope of work. Gather specifics like: exact scope, timeline/dates, general area or neighborhood (NEVER ask for a full street address or home address — city/neighborhood/borough is sufficient), materials/supplies (who provides), quantity/size, and any special requirements.

After 3-5 exchanges, if you have enough detail, output EXACTLY this JSON on its own line and nothing else after it:
SUMMARY_JSON:{"scope":"detailed description of what's needed","timeline":"timeline","location":"neighborhood or general area only — no street addresses","supplies":"who provides what","quantity":"quantity or scale","extra":"any special requirements","ready":true}

Until then, just ask the next most important clarifying question naturally and concisely. Be friendly and conversational. Never suggest illegal or sexual services.${defaultsContext}`;

    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514", max_tokens: 400,
          system: systemPrompt,
          messages: [{ role: "user", content: `I'm interested in "${listing.title}". Help me describe exactly what I need.` }]
        })
      });
      const data = await res.json();
      const text = data.content.map(b => b.text || "").join("").trim();
      history.current = [
        { role: "user", content: `I'm interested in "${listing.title}". Help me describe exactly what I need.` },
        { role: "assistant", content: text }
      ];
      addMsg(text, "ai");
    } catch {
      addMsg("Tell me a bit about what you need — how many rooms, what kind of work, timeline, etc.?", "ai");
    }
    setLoading(false);
  };

  const sendReply = async () => {
    if (!input.trim() || loading) return;
    const userText = input.trim();
    setInput("");
    addMsg(userText, "user");
    history.current.push({ role: "user", content: userText });
    setLoading(true);

    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514", max_tokens: 500,
          system: `You are a helpful intake assistant for Bartr. You're gathering details for an exchange contract for: "${listing.title}" (${listing.desc}).

Ask ONE focused follow-up question at a time. You need: scope, timeline, general area/neighborhood (NEVER ask for a full home address or street address — city or neighborhood is enough), supplies (who provides), scale/quantity, special requirements.

When you have enough detail (after 3-5 exchanges), output this on its own line:
SUMMARY_JSON:{"scope":"...","timeline":"...","location":"neighborhood or general area — no street addresses","supplies":"...","quantity":"...","extra":"...","ready":true}

Be friendly and concise. Never suggest illegal or sexual services.`,
          messages: history.current
        })
      });
      const data = await res.json();
      const text = data.content.map(b => b.text || "").join("").trim();
      history.current.push({ role: "assistant", content: text });

      // Check for summary JSON
      const summaryMatch = text.match(/SUMMARY_JSON:(\{.*\})/);
      if (summaryMatch) {
        try {
          const parsed = JSON.parse(summaryMatch[1]);
          setSummary(parsed);
          const displayText = text.replace(/SUMMARY_JSON:\{.*\}/, "").trim() ||
            "I have enough to draft your contract! Review the scope below and add what you'll offer in exchange.";
          addMsg(displayText, "ai");
          addMsg("✅ Great! I have all the details needed. Review your request summary below.", "sys");
          setDone(true);
        } catch { addMsg(text, "ai"); }
      } else {
        addMsg(text, "ai");
      }
    } catch {
      addMsg("Could you tell me a bit more about the timeline and any special requirements?", "ai");
    }
    setLoading(false);
  };

  const timelineDisplay = scheduledDate?.display || summary?.timeline || "TBD";

  const contractData = summary ? buildContractData({
    party1: myName, party2: listing.name,
    details1: offerText || "(your offer — fill in above)",
    details2: `${listing.title}\n  • Scope: ${summary.scope}\n  • When: ${timelineDisplay}\n  • Location: ${summary.location}\n  • Supplies: ${summary.supplies}\n  • Scale: ${summary.quantity}${summary.extra ? `\n  • Notes: ${summary.extra}` : ""}`,
    date: new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }),
    version: 1,
    scheduledDate: scheduledDate?.date || null,
    contractType,
  }) : null;
  const contractText = contractData?.plain || "";

  const finalize = () => {
    const conv = {
      id: Date.now(),
      listing,
      status: "pending",
      contractType,
      contractVersion: 1,
      currentContract: contractText,
      currentContractData: contractData,
      details1: offerText,
      details2: listing.title + (summary ? ` — ${summary.scope}` : ""),
      myAgreed: false,
      theirAgreed: false,
      unread: false,
      messages: [
        {
          id: 1, from: "system",
          text: `📄 Exchange offer sent with contract v1. Both parties must agree to confirm.`,
          ts: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          contract: contractText, contractData, contractVersion: 1,
        },
        {
          id: 2, from: "them",
          text: COUNTER_REPLIES[Math.floor(Math.random() * COUNTER_REPLIES.length)],
          ts: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        }
      ],
    };
    onComplete(conv);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "85vh" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
        <button onClick={onCancel} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 20, color: "var(--tf-muted,#888)" }}>←</button>
        <div>
          <div style={{ fontFamily: "'Instrument Serif',serif", fontSize: 16, color: "var(--tf-text,#1A1A1A)" }}>Describe Your Request</div>
          <div style={{ fontFamily: "Plus Jakarta Sans", fontSize: 12, color: "var(--tf-muted,#888)" }}>for {listing.title} · {listing.name}</div>
        </div>
      </div>

      {/* Defaults active notice */}
      {contractDefaults && (contractDefaults.offer || contractDefaults.conditions) && (
        <div style={{ background: "var(--tf-input,#E8F5EC)", border: "1px solid #A7F3D0", borderRadius: 10, padding: "8px 12px", marginBottom: 10, display: "flex", gap: 8, alignItems: "center" }}>
          <span style={{ fontSize: 14 }}>📋</span>
          <div style={{ fontFamily: "Plus Jakarta Sans", fontSize: 11.5, color: "#065F46", lineHeight: 1.5 }}>
            <strong>{listing.name}</strong> has pre-set terms for this listing — the assistant will present them and ask if they work for you.
          </div>
        </div>
      )}

      {/* Availability warning */}
      {listing.availability === "closed" && (
        <div style={{ background: "#FEF2F2", border: "1.5px solid #FECACA", borderRadius: 12, padding: "10px 14px", marginBottom: 12, display: "flex", gap: 10, alignItems: "flex-start" }}>
          <span style={{ fontSize: 18 }}>🔴</span>
          <div>
            <div style={{ fontFamily: "Plus Jakarta Sans", fontSize: 13, fontWeight: 600, color: "#DC2626" }}>Not currently trading</div>
            <div style={{ fontFamily: "Plus Jakarta Sans", fontSize: 12, color: "#EF4444", marginTop: 2 }}>{listing.name} has marked themselves as closed. You can still send a request, but they may not respond.</div>
          </div>
        </div>
      )}
      {listing.availability === "limited" && (
        <div style={{ background: "#FFFBEB", border: "1.5px solid #FCD34D", borderRadius: 12, padding: "10px 14px", marginBottom: 12, display: "flex", gap: 10, alignItems: "flex-start" }}>
          <span style={{ fontSize: 18 }}>🟡</span>
          <div>
            <div style={{ fontFamily: "Plus Jakarta Sans", fontSize: 13, fontWeight: 600, color: "#92400E" }}>Limited availability</div>
            <div style={{ fontFamily: "Plus Jakarta Sans", fontSize: 12, color: "#B45309", marginTop: 2 }}>{listing.name} has limited availability right now. Response times may be longer than usual.</div>
          </div>
        </div>
      )}

      {/* Chat messages */}
      <div ref={scrollRef} style={{ flex: 1, overflowY: "auto", paddingBottom: 10 }}>
        {messages.map(m => (
          <div key={m.id} className={`intake-msg ${m.role}`} style={{ display: "block", marginLeft: m.role === "user" ? "auto" : 0 }}>
            {m.text}
          </div>
        ))}
        {loading && (
          <div className="intake-msg ai" style={{ opacity: 0.6 }}>
            <span style={{ letterSpacing: 3 }}>●●●</span>
          </div>
        )}

        {/* Summary + schedule + offer input when done */}
        {done && summary && (
          <div style={{ marginTop: 14 }}>
            {/* Scope summary (without timeline — that's handled by picker) */}
            <div style={{ background: "#F0F7F2", borderRadius: 14, padding: 14, marginBottom: 14 }}>
              <div style={{ fontFamily: "Plus Jakarta Sans", fontSize: 11, fontWeight: 600, color: "#E85D3A", marginBottom: 8, letterSpacing: ".05em" }}>REQUEST SUMMARY</div>
              {[["Scope", summary.scope], ["Location", summary.location], ["Supplies", summary.supplies], ["Scale", summary.quantity], summary.extra && ["Notes", summary.extra]].filter(Boolean).map(([k, v]) => (
                <div key={k} style={{ fontFamily: "Plus Jakarta Sans", fontSize: 12, color: "#444", marginBottom: 4 }}><strong style={{ color: "var(--tf-text,#1A1A1A)" }}>{k}:</strong> {v}</div>
              ))}
            </div>

            {/* Contract type */}
            <div style={{ marginBottom: 16 }}>
              <div style={{ fontFamily: "Plus Jakarta Sans", fontSize: 11, fontWeight: 600, color: "var(--tf-sub,#555)", marginBottom: 8, letterSpacing: ".05em" }}>📋 AGREEMENT TYPE</div>
              <div style={{ display: "flex", gap: 8 }}>
                {[{ id: "one-time", label: "One-time", desc: "Single exchange, done when fulfilled" }, { id: "ongoing", label: "Ongoing", desc: "Repeating, renews annually, 30-day notice to end" }].map(opt => (
                  <button key={opt.id} onClick={() => setContractType(opt.id)}
                    style={{ flex: 1, padding: "10px 8px", borderRadius: 12, border: `2px solid ${contractType === opt.id ? "#1A1A1A" : "#E5E2DC"}`, background: contractType === opt.id ? "#1A1A1A" : "#fff", cursor: "pointer", textAlign: "left", transition: "all .15s" }}>
                    <div style={{ fontFamily: "Plus Jakarta Sans", fontSize: 12, fontWeight: 700, color: contractType === opt.id ? "#fff" : "#1A1A1A", marginBottom: 3 }}>{opt.label}</div>
                    <div style={{ fontFamily: "Plus Jakarta Sans", fontSize: 10, color: contractType === opt.id ? "rgba(255,255,255,.65)" : "#aaa", lineHeight: 1.4 }}>{opt.desc}</div>
                  </button>
                ))}
              </div>
              {contractType === "ongoing" && (
                <div style={{ background: "#FFF8E1", borderRadius: 10, padding: "9px 13px", marginTop: 9, fontFamily: "Plus Jakarta Sans", fontSize: 11, color: "#92400E", lineHeight: 1.6 }}>
                  ⚠️ Ongoing agreements auto-renew every year. Either party can end with 30 days' notice.
                </div>
              )}
            </div>

            {/* Schedule picker */}
            <div style={{ fontFamily: "Plus Jakarta Sans", fontSize: 11, fontWeight: 600, color: "var(--tf-sub,#555)", marginBottom: 8, letterSpacing: ".05em" }}>
              📅 WHEN SHOULD THIS HAPPEN? <span style={{ color: "#EF4444", fontWeight: 700 }}>*</span>
            </div>
            {summary.timeline && (
              <div style={{ fontFamily: "Plus Jakarta Sans", fontSize: 12, color: "var(--tf-muted,#888)", marginBottom: 10, fontStyle: "italic" }}>
                The other party suggested: "{summary.timeline}"
              </div>
            )}
            <div style={{ marginBottom: 16 }}>
              <SchedulePicker
                value={scheduledDate}
                onChange={setScheduledDate}
                hint={summary.timeline}
                blockedDates={listing.blockedDates || []}
              />
            </div>

            {/* Offer input */}
            <div style={{ fontFamily: "Plus Jakarta Sans", fontSize: 11, fontWeight: 600, color: "var(--tf-sub,#555)", marginBottom: 6, letterSpacing: ".05em" }}>WHAT WILL YOU OFFER IN EXCHANGE? <span style={{ color: "#EF4444", fontWeight: 700 }}>*</span></div>
            <div className="warn" style={{ marginBottom: 10 }}>
              <span style={{ fontSize: 15 }}>⚠️</span>
              <p style={{ fontFamily: "Plus Jakarta Sans", fontSize: 11, color: "#7A5C00", lineHeight: 1.6 }}>Legal goods and services only. No sexual services or illegal substances.</p>
            </div>
            <textarea className="inp" style={{ minHeight: 80 }} placeholder="e.g. 3 professional haircuts at my salon (value ~$180), or 10hrs web development..." value={offerText} onChange={e => setOfferText(e.target.value)} />

            <button className="bgr" style={{ marginTop: 11 }} disabled={!offerText.trim() || !scheduledDate} onClick={() => setShowContract(true)}>
              Preview Contract →
            </button>
            {!scheduledDate && offerText.trim() && (
              <div style={{ fontFamily: "Plus Jakarta Sans", fontSize: 12, color: "#EF4444", textAlign: "center", marginTop: 8 }}>Please select a date and time above</div>
            )}
          </div>
        )}
      </div>

      {/* Input row */}
      {!done && (
        <div className="chat-input-row">
          <textarea className="chat-inp" rows={1} placeholder="Type your answer..." value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendReply(); } }} />
          <button className="send-btn" onClick={sendReply} disabled={loading || !input.trim()}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
          </button>
        </div>
      )}

      {/* Contract preview sheet */}
      {showContract && contractData && (
        <div className="overlay" onClick={() => setShowContract(false)}>
          <div className="sheet" onClick={e => e.stopPropagation()}>
            <div style={{ width: 38, height: 4, background: "#E0DDD6", borderRadius: 100, margin: "0 auto 16px" }} />
            <div className="stitle" style={{ fontSize: 17, marginBottom: 4 }}>Review Agreement</div>
            <p style={{ fontFamily: "Plus Jakarta Sans", fontSize: 13, color: "var(--tf-muted,#888)", marginBottom: 16 }}>Read carefully before signing. Your obligations are highlighted.</p>
            <ContractPreviewSheet data={contractData} myName={myName} />
            <p style={{ fontFamily: "Plus Jakarta Sans", fontSize: 11, color: "var(--tf-muted,#999)", marginTop: 10, marginBottom: 14, lineHeight: 1.6 }}>
              By tapping "Agree & Send" you accept all terms above, including the disclaimer and community standards.
            </p>
            <button className="bgr" onClick={finalize}>✅ Agree & Send Offer</button>
            <button className="bg" style={{ marginTop: 9 }} onClick={() => setShowContract(false)}>← Edit</button>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── CHAT VIEW ────────────────────────────────────────────────────────────────

function ChatView({ conv, myName, onBack, onSend, onAgree, onCounter, onComplete, onTerminate, onRaiseDispute, onResolveDispute, onEscalateDispute, isCompleted }) {
  const [text, setText] = useState("");
  const [showContract, setShowContract] = useState(null);
  const [showCounter, setShowCounter] = useState(false);
  const [showDisputeSheet, setShowDisputeSheet] = useState(false);
  const [showMediationConfirm, setShowMediationConfirm] = useState(null); // caseRef string
  const scrollRef = useRef(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [conv.messages]);

  const handleSend = () => {
    if (!text.trim()) return;
    onSend(text.trim());
    setText("");
  };

  const [showTerminateConfirm, setShowTerminateConfirm] = useState(false);

  const isOngoing = conv.contractType === "ongoing";
  const isTerminated = conv.status === "terminated";

  // Days until renewal (for ongoing contracts)
  const daysUntilRenewal = isOngoing && conv.renewsAt
    ? Math.ceil((conv.renewsAt - Date.now()) / (1000 * 60 * 60 * 24))
    : null;
  const renewalSoon = daysUntilRenewal !== null && daysUntilRenewal <= 60;

  const statusInfo = {
    pending:    { label: "Offer Pending",          sub: "Awaiting agreement from both parties",          cls: "status-pending" },
    countered:  { label: "Counter-Offer Made",     sub: "Review and agree to the updated terms",         cls: "status-countered" },
    agreed:     { label: isOngoing ? "Ongoing Agreement ✅" : "Exchange Confirmed ✅", sub: isOngoing ? "Auto-renews annually · 30 days notice to end" : "Both parties have agreed", cls: "status-agreed" },
    terminated: { label: "Agreement Ended",        sub: "This contract has been terminated",             cls: "status-terminated" },
    disputed:   { label: "Dispute Open ⚠️",        sub: "Work together in chat or escalate to mediation", cls: "status-pending" },
  }[conv.status] || {};

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "calc(100vh - 130px)" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10, paddingBottom: 10, borderBottom: "1px solid var(--tf-border,#EDEAE4)" }}>
        <button onClick={onBack} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 20, color: "var(--tf-muted,#888)", padding: "0 4px" }}>←</button>
        <div className="ava" style={{ width: 38, height: 38, background: catOf(conv.listing.category).color, fontSize: 13, flexShrink: 0 }}>{conv.listing.avatar}</div>
        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: "Plus Jakarta Sans", fontSize: 14, fontWeight: 600, color: "var(--tf-text,#1A1A1A)" }}>{conv.listing.name}</div>
          <div style={{ fontFamily: "Plus Jakarta Sans", fontSize: 11, color: "var(--tf-muted,#888)" }}>{conv.listing.title}</div>
        </div>
        <button onClick={() => setShowContract(conv.currentContractData ? { data: conv.currentContractData, plain: conv.currentContract } : { plain: conv.currentContract })} style={{ background: "#F0F7F2", border: "none", borderRadius: 100, padding: "6px 12px", fontFamily: "Plus Jakarta Sans", fontSize: 11, color: "#E85D3A", cursor: "pointer", fontWeight: 600 }}>📄 Contract</button>
      </div>

      {/* Status bar */}
      <div className={`status-bar ${statusInfo.cls}`}>
        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: "Plus Jakarta Sans", fontSize: 12, fontWeight: 600 }}>{statusInfo.label}</div>
          <div style={{ fontFamily: "Plus Jakarta Sans", fontSize: 11, opacity: 0.8 }}>{statusInfo.sub}</div>
        </div>
        {conv.status !== "agreed" && !conv.myAgreed && (
          <button onClick={onAgree} style={{ background: "#E85D3A", color: "#fff", border: "none", borderRadius: 100, padding: "6px 12px", fontFamily: "Plus Jakarta Sans", fontSize: 11, fontWeight: 600, cursor: "pointer", whiteSpace: "nowrap" }}>✓ Agree</button>
        )}
      </div>

      {/* Messages */}
      <div ref={scrollRef} style={{ flex: 1, overflowY: "auto", padding: "4px 0 8px" }}>
        {conv.messages.map(msg => (
          <div key={msg.id}>
            {msg.from === "system" ? (
              <div style={{ textAlign: "center", margin: "8px 0" }}>
                <div style={{ display: "inline-block", background: "#F0F7F2", color: "#E85D3A", padding: "7px 14px", borderRadius: 12, fontFamily: "Plus Jakarta Sans", fontSize: 11.5, fontWeight: 500, maxWidth: "90%" }}>
                  {msg.text}
                  {msg.contract && (
                    <span onClick={() => setShowContract(msg.contractData ? { data: msg.contractData, plain: msg.contract } : { plain: msg.contract })} style={{ marginLeft: 8, textDecoration: "underline", cursor: "pointer" }}>View</span>
                  )}
                </div>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", alignItems: msg.from === "me" ? "flex-end" : "flex-start", marginBottom: 5 }}>
                <div className={`bubble ${msg.from}`}>{msg.text}</div>
                <div style={{ fontFamily: "Plus Jakarta Sans", fontSize: 10, color: "var(--tf-muted,#bbb)", marginTop: 2, marginLeft: msg.from === "them" ? 4 : 0, marginRight: msg.from === "me" ? 4 : 0 }}>{msg.ts}</div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Action footer */}
      {conv.status !== "agreed" && (
        <div>
          <button onClick={() => setShowCounter(true)} style={{ background: "transparent", border: "1.5px solid var(--tf-border,#DDD8CE)", borderRadius: 100, padding: "8px 16px", fontFamily: "Plus Jakarta Sans", fontSize: 12, cursor: "pointer", color: "var(--tf-sub,#555)", marginBottom: 8, width: "100%" }}>
            🔄 Propose Counter-Offer / Modify Terms
          </button>
          <div className="chat-input-row">
            <textarea className="chat-inp" rows={1} placeholder={`Message ${conv.listing.name}…`} value={text} onChange={e => setText(e.target.value)} onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); } }} />
            <button className="send-btn" onClick={handleSend} disabled={!text.trim()}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
            </button>
          </div>
        </div>
      )}

      {/* Disputed banner with full timeline */}
      {conv.status === "disputed" && conv.dispute && (() => {
        const isEscalated = conv.dispute.status === "escalated";
        const hasResponse = !!conv.dispute.response;
        const steps = [
          { icon: "⚠️", label: "Dispute raised", done: true, detail: conv.dispute.category },
          { icon: "💬", label: "Counterparty response", done: hasResponse, detail: hasResponse ? conv.dispute.response : "Awaiting response from other party" },
          { icon: isEscalated ? "⚖️" : "✅", label: isEscalated ? "Escalated to mediation" : "Resolution", done: isEscalated, detail: isEscalated ? `Case ${conv.dispute.caseRef} — mediator assigned within 3–5 days` : "Agree on a resolution in chat, then mark resolved." },
        ];
        return (
          <div style={{ background: "#FEF9EE", border: "2px solid #FCD34D", borderRadius: 14, padding: "13px 14px", marginBottom: 10 }}>
            {/* Header */}
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
              <span style={{ fontSize: 18 }}>⚠️</span>
              <div style={{ fontFamily: "Plus Jakarta Sans", fontSize: 13, fontWeight: 700, color: "#92400E", flex: 1 }}>Dispute open</div>
              {isEscalated && <span style={{ background: "#FEF3C7", borderRadius: 100, padding: "2px 9px", fontFamily: "Plus Jakarta Sans", fontSize: 10, fontWeight: 700, color: "#D97706" }}>Case {conv.dispute.caseRef}</span>}
            </div>

            {/* Timeline */}
            <div style={{ display: "flex", flexDirection: "column", gap: 0, marginBottom: 12 }}>
              {steps.map((s, i) => (
                <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flexShrink: 0 }}>
                    <div style={{ width: 24, height: 24, borderRadius: "50%", background: s.done ? "#D97706" : "#E5E2DC", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11 }}>
                      {s.done ? "✓" : "○"}
                    </div>
                    {i < steps.length - 1 && <div style={{ width: 2, height: 18, background: s.done ? "#FCD34D" : "#E5E2DC" }} />}
                  </div>
                  <div style={{ paddingTop: 3, paddingBottom: i < steps.length - 1 ? 8 : 0 }}>
                    <div style={{ fontFamily: "Plus Jakarta Sans", fontSize: 11, fontWeight: 700, color: s.done ? "#92400E" : "#aaa" }}>{s.label}</div>
                    <div style={{ fontFamily: "Plus Jakarta Sans", fontSize: 11, color: s.done ? "#B45309" : "#bbb", marginTop: 1, lineHeight: 1.5 }}>{s.detail}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Outcome & desired resolution */}
            <div style={{ background: "rgba(255,255,255,.5)", borderRadius: 9, padding: "8px 10px", marginBottom: 10, fontFamily: "Plus Jakarta Sans", fontSize: 11.5, color: "#92400E", lineHeight: 1.5 }}>
              <strong>Desired outcome:</strong> {conv.dispute.outcome}
            </div>

            {!isEscalated && (
              <div style={{ display: "flex", gap: 8 }}>
                <button onClick={onResolveDispute}
                  style={{ flex: 1, padding: "9px 8px", background: "#E85D3A", border: "none", borderRadius: 100, fontFamily: "Plus Jakarta Sans", fontSize: 12, fontWeight: 600, color: "#fff", cursor: "pointer" }}>
                  ✅ Resolved
                </button>
                <button onClick={() => { const ref = onEscalateDispute(); setShowMediationConfirm(ref); }}
                  style={{ flex: 1, padding: "9px 8px", background: "none", border: "1.5px solid #D97706", borderRadius: 100, fontFamily: "Plus Jakarta Sans", fontSize: 12, fontWeight: 600, color: "#D97706", cursor: "pointer" }}>
                  ⚖️ Escalate
                </button>
              </div>
            )}
          </div>
        );
      })()}
      {isTerminated && (
        <div style={{ background: "#F3F3F3", borderRadius: 14, padding: "12px 16px", marginBottom: 8, textAlign: "center" }}>
          <div style={{ fontFamily: "Plus Jakarta Sans", fontSize: 13, fontWeight: 600, color: "var(--tf-muted,#888)" }}>🔴 This agreement has ended</div>
          <div style={{ fontFamily: "Plus Jakarta Sans", fontSize: 11, color: "var(--tf-muted,#bbb)", marginTop: 3 }}>Both parties have 30 days to fulfill any outstanding obligations.</div>
        </div>
      )}

      {conv.status === "agreed" && (
        <div>
          {/* Renewal warning banner */}
          {renewalSoon && (
            <div style={{ background: "#FFF8E1", border: "1.5px solid #FCD34D", borderRadius: 14, padding: "11px 14px", marginBottom: 10, display: "flex", alignItems: "flex-start", gap: 10 }}>
              <span style={{ fontSize: 18 }}>⏰</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: "Plus Jakarta Sans", fontSize: 12, fontWeight: 700, color: "#92400E" }}>
                  Renewal in {daysUntilRenewal} day{daysUntilRenewal !== 1 ? "s" : ""}
                </div>
                <div style={{ fontFamily: "Plus Jakarta Sans", fontSize: 11, color: "#B45309", marginTop: 2, lineHeight: 1.4 }}>
                  This agreement auto-renews on {new Date(conv.renewsAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}. Review or update terms before then.
                </div>
              </div>
              <button onClick={() => setShowCounter(true)}
                style={{ background: "#1A1A1A", border: "none", borderRadius: 100, padding: "6px 12px", fontFamily: "Plus Jakarta Sans", fontSize: 11, fontWeight: 600, color: "#fff", cursor: "pointer", whiteSpace: "nowrap" }}>
                Update Terms
              </button>
            </div>
          )}

          {!isCompleted ? (
            <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
              {!isOngoing && (
                <button onClick={onComplete} style={{ flex: 1, background: "linear-gradient(135deg,#1A1A1A,#E85D3A)", color: "#fff", border: "none", borderRadius: 100, padding: "13px", fontFamily: "Plus Jakarta Sans", fontSize: 14, fontWeight: 600, cursor: "pointer", boxShadow: "0 4px 16px rgba(76,175,130,.35)" }}>
                  ✅ Mark Complete
                </button>
              )}
              <button onClick={() => setShowTerminateConfirm(true)}
                style={{ flex: isOngoing ? 1 : 0, padding: isOngoing ? "13px" : "13px 16px", background: "none", border: "1.5px solid #EF4444", borderRadius: 100, fontFamily: "Plus Jakarta Sans", fontSize: isOngoing ? 14 : 12, fontWeight: 600, color: "#EF4444", cursor: "pointer" }}>
                {isOngoing ? "End Agreement" : "End"}
              </button>
            </div>
          ) : (
            <div style={{ background: "#E8F5EC", borderRadius: 14, padding: "11px 16px", marginBottom: 8, textAlign: "center" }}>
              <div style={{ fontFamily: "Plus Jakarta Sans", fontSize: 13, fontWeight: 600, color: "#2D7A50" }}>🎉 Trade complete!</div>
              <div style={{ fontFamily: "Plus Jakarta Sans", fontSize: 11, color: "#E85D3A", marginTop: 2 }}>Thank you for trading with the community.</div>
            </div>
          )}
          <div className="chat-input-row">
            <textarea className="chat-inp" rows={1} placeholder={`Message ${conv.listing.name}…`} value={text} onChange={e => setText(e.target.value)} onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); } }} />
            <button className="send-btn" onClick={handleSend} disabled={!text.trim()}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
            </button>
          </div>
          {!isCompleted && (
            <button onClick={() => setShowDisputeSheet(true)}
              style={{ background: "none", border: "none", fontFamily: "Plus Jakarta Sans", fontSize: 11, color: "#D97706", cursor: "pointer", width: "100%", textAlign: "center", padding: "6px 0", marginTop: 2 }}>
              ⚠️ Something went wrong? Raise a dispute
            </button>
          )}
        </div>
      )}

      {/* Disputed — chat open unless escalated */}
      {conv.status === "disputed" && conv.dispute?.status !== "escalated" && (
        <div className="chat-input-row">
          <textarea className="chat-inp" rows={1} placeholder={`Message ${conv.listing.name} to resolve…`} value={text} onChange={e => setText(e.target.value)} onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); } }} />
          <button className="send-btn" onClick={handleSend} disabled={!text.trim()}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
          </button>
        </div>
      )}

      {/* Dispute sheet */}
      {showDisputeSheet && (
        <DisputeSheet
          conv={conv}
          onSubmit={(dispute) => { onRaiseDispute(dispute); setShowDisputeSheet(false); }}
          onClose={() => setShowDisputeSheet(false)}
        />
      )}

      {/* Mediation confirm */}
      {showMediationConfirm && (
        <MediationConfirmSheet
          caseRef={showMediationConfirm}
          conv={conv}
          onClose={() => setShowMediationConfirm(null)}
        />
      )}

      {/* Terminate confirmation modal */}
      {showTerminateConfirm && (
        <div className="overlay" onClick={() => setShowTerminateConfirm(false)}>
          <div className="sheet" onClick={e => e.stopPropagation()}>
            <div style={{ width: 38, height: 4, background: "#E0DDD6", borderRadius: 100, margin: "0 auto 18px" }} />
            <div style={{ textAlign: "center", marginBottom: 16 }}>
              <div style={{ fontSize: 36, marginBottom: 8 }}>🔴</div>
              <div style={{ fontFamily: "'Instrument Serif',serif", fontSize: 18, color: "var(--tf-text,#1A1A1A)", marginBottom: 8 }}>End this agreement?</div>
              <p style={{ fontFamily: "Plus Jakarta Sans", fontSize: 13, color: "var(--tf-sub,#666)", lineHeight: 1.6 }}>
                {isOngoing
                  ? "Both parties will have 30 days to fulfil any outstanding obligations. This cannot be undone."
                  : "This will mark the agreement as ended. Both parties keep any obligations already agreed."}
              </p>
            </div>
            <button onClick={() => { onTerminate(); setShowTerminateConfirm(false); }}
              style={{ width: "100%", padding: "13px", background: "#EF4444", border: "none", borderRadius: 100, fontFamily: "Plus Jakarta Sans", fontSize: 14, fontWeight: 700, color: "#fff", cursor: "pointer", marginBottom: 10 }}>
              Yes, end this agreement
            </button>
            <button onClick={() => setShowTerminateConfirm(false)}
              style={{ width: "100%", padding: "13px", background: "none", border: "1.5px solid var(--tf-border,#E5E2DC)", borderRadius: 100, fontFamily: "Plus Jakarta Sans", fontSize: 14, color: "var(--tf-muted,#888)", cursor: "pointer" }}>
              Keep it going
            </button>
          </div>
        </div>
      )}

      {/* Contract modal */}
      {showContract && (
        <div className="overlay" onClick={() => setShowContract(null)}>
          <div className="sheet" onClick={e => e.stopPropagation()}>
            <div style={{ width: 38, height: 4, background: "#E0DDD6", borderRadius: 100, margin: "0 auto 16px" }} />
            <div className="stitle" style={{ fontSize: 17, marginBottom: 4 }}>📄 Exchange Agreement</div>
            {showContract.data ? (
              <>
                <p style={{ fontFamily: "Plus Jakarta Sans", fontSize: 13, color: "var(--tf-muted,#888)", marginBottom: 16 }}>Your obligations are highlighted below.</p>
                <ContractPreviewSheet data={showContract.data} myName={myName} />
              </>
            ) : (
              <div className="cbox">{showContract.plain || showContract}</div>
            )}
            <button className="bg" style={{ marginTop: 14 }} onClick={() => setShowContract(null)}>Close</button>
          </div>
        </div>
      )}

      {/* Counter-offer editor */}
      {showCounter && (
        <CounterOfferSheet
          conv={conv}
          myName={myName}
          onSubmit={(d1, d2, ct) => { onCounter(d1, d2, ct); setShowCounter(false); }}
          onClose={() => setShowCounter(false)}
        />
      )}
    </div>
  );
}

// ─── COUNTER OFFER SHEET ──────────────────────────────────────────────────────

// Parse a bullet-formatted details string into structured fields
function parseDetails(str) {
  const scope    = str.match(/•\s*Scope:\s*(.+)/)?.[1]?.trim()    || "";
  const timeline = str.match(/•\s*When:\s*(.+)/)?.[1]?.trim()     || "";
  const location = str.match(/•\s*Location:\s*(.+)/)?.[1]?.trim() || "";
  const supplies = str.match(/•\s*Supplies:\s*(.+)/)?.[1]?.trim() || "";
  const scale    = str.match(/•\s*Scale:\s*(.+)/)?.[1]?.trim()    || "";
  const notes    = str.match(/•\s*Notes:\s*(.+)/)?.[1]?.trim()    || "";
  // Freeform part before any bullets
  const freeform = str.split(/\n\s*•/)[0].trim();
  return { freeform, scope, timeline, location, supplies, scale, notes };
}

function buildDetails2String({ title, scope, timeline, location, supplies, scale, notes }) {
  let s = title || "";
  if (scope)    s += `\n  • Scope: ${scope}`;
  if (timeline) s += `\n  • When: ${timeline}`;
  if (location) s += `\n  • Location: ${location}`;
  if (supplies) s += `\n  • Supplies: ${supplies}`;
  if (scale)    s += `\n  • Scale: ${scale}`;
  if (notes)    s += `\n  • Notes: ${notes}`;
  return s;
}

function CounterOfferSheet({ conv, myName, onSubmit, onClose }) {
  const prev = conv.currentContractData;
  const prevD2 = parseDetails(conv.details2 || "");
  const prevD1 = conv.details1 || "";

  const [myOffer, setMyOffer] = useState(prevD1);

  // Structured fields for their side
  const [scope,    setScope]    = useState(prevD2.scope    || prevD2.freeform || "");
  const [timeline, setTimeline] = useState(prevD2.timeline || "");
  const [location, setLocation] = useState(prevD2.location || "");
  const [supplies, setSupplies] = useState(prevD2.supplies || "");
  const [scale,    setScale]    = useState(prevD2.scale    || "");
  const [notes,    setNotes]    = useState(prevD2.notes    || "");
  const [contractType, setContractType] = useState(prev?.contractType || "one-time");

  const [scheduledDate, setScheduledDate] = useState(
    prev?.scheduledDate
      ? { date: new Date(prev.scheduledDate), slotId: null, display: new Date(prev.scheduledDate).toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" }) }
      : null
  );
  const [showSchedule, setShowSchedule] = useState(false);

  const theirTitle = conv.listing.title;

  const handleSubmit = () => {
    const effectiveTimeline = scheduledDate ? scheduledDate.display : timeline;
    const d2 = buildDetails2String({ title: theirTitle, scope, timeline: effectiveTimeline, location, supplies, scale, notes });
    onSubmit(myOffer, d2, contractType);
  };

  const FieldRow = ({ label, prev: prevVal, value, onChange, placeholder, mono }) => {
    const changed = prevVal && prevVal !== value && value.trim();
    return (
      <div style={{ marginBottom: 11 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 4 }}>
          <label style={{ fontFamily: "Plus Jakarta Sans", fontSize: 10, fontWeight: 700, color: "var(--tf-muted,#999)", letterSpacing: ".05em", textTransform: "uppercase" }}>{label}</label>
          {changed && <span style={{ fontFamily: "Plus Jakarta Sans", fontSize: 9, background: "#FEF9C3", color: "#92400E", borderRadius: 100, padding: "1px 7px", fontWeight: 600 }}>edited</span>}
        </div>
        {prevVal && prevVal !== value && value.trim() && (
          <div style={{ fontFamily: "Plus Jakarta Sans", fontSize: 11, color: "var(--tf-muted,#bbb)", textDecoration: "line-through", marginBottom: 3, paddingLeft: 2 }}>{prevVal}</div>
        )}
        <input
          className="inp"
          style={{ fontSize: 13, fontFamily: mono ? "monospace" : "Plus Jakarta Sans" }}
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
        />
      </div>
    );
  };

  const canSubmit = myOffer.trim() && scope.trim();

  return (
    <div className="overlay" onClick={onClose}>
      <div className="sheet" onClick={e => e.stopPropagation()} style={{ overflowY: "auto", maxHeight: "92vh" }}>
        <div style={{ width: 38, height: 4, background: "#E0DDD6", borderRadius: 100, margin: "0 auto 16px" }} />
        <div className="stitle" style={{ fontSize: 17, marginBottom: 3 }}>Modify Terms</div>
        <p style={{ fontFamily: "Plus Jakarta Sans", fontSize: 12.5, color: "var(--tf-muted,#888)", marginBottom: 16 }}>Both parties must re-agree to the new version. Changed fields are flagged.</p>

        {/* Contract type */}
        <div style={{ marginBottom: 16 }}>
          <label style={{ fontFamily: "Plus Jakarta Sans", fontSize: 10, fontWeight: 700, color: "var(--tf-muted,#999)", letterSpacing: ".05em", display: "block", marginBottom: 7 }}>CONTRACT TYPE</label>
          <div style={{ display: "flex", gap: 7 }}>
            {[["one-time","One-time"],["recurring","Recurring"],["project","Project"]].map(([v,l]) => (
              <button key={v} onClick={() => setContractType(v)}
                style={{ flex: 1, padding: "8px 4px", borderRadius: 10, border: `1.5px solid ${contractType === v ? "#E85D3A" : "var(--tf-border,#DDD8CE)"}`, background: contractType === v ? "#E8F5EC" : "var(--tf-input,#FDFCFA)", fontFamily: "Plus Jakarta Sans", fontSize: 11, fontWeight: 600, color: contractType === v ? "#2D6A4F" : "var(--tf-sub,#777)", cursor: "pointer" }}>{l}</button>
            ))}
          </div>
        </div>

        {/* Your side */}
        <div style={{ background: "var(--tf-input,#F8F6F1)", borderRadius: 14, padding: "13px 14px", marginBottom: 13 }}>
          <div style={{ fontFamily: "Plus Jakarta Sans", fontSize: 10, fontWeight: 700, color: "#E85D3A", letterSpacing: ".06em", marginBottom: 10 }}>YOUR OFFER — {myName}</div>
          <div style={{ marginBottom: 0 }}>
            {prevD1 && prevD1 !== myOffer && myOffer.trim() && (
              <div style={{ fontFamily: "Plus Jakarta Sans", fontSize: 11, color: "var(--tf-muted,#bbb)", textDecoration: "line-through", marginBottom: 3 }}>{prevD1}</div>
            )}
            <textarea className="inp" rows={3} value={myOffer} onChange={e => setMyOffer(e.target.value)} placeholder="What you will provide..." />
          </div>
        </div>

        {/* Their side — structured */}
        <div style={{ background: "var(--tf-input,#F8F6F1)", borderRadius: 14, padding: "13px 14px", marginBottom: 13 }}>
          <div style={{ fontFamily: "Plus Jakarta Sans", fontSize: 10, fontWeight: 700, color: "var(--tf-sub,#777)", letterSpacing: ".06em", marginBottom: 10 }}>THEIR OFFER — {conv.listing.name}</div>
          <FieldRow label="Scope *"    prevVal={prevD2.scope}    value={scope}    onChange={setScope}    placeholder="What exactly will they do/provide?" />
          <FieldRow label="Location"   prevVal={prevD2.location} value={location} onChange={setLocation} placeholder="Neighbourhood or general area" />
          <FieldRow label="Supplies"   prevVal={prevD2.supplies} value={supplies} onChange={setSupplies} placeholder="Who brings what?" />
          <FieldRow label="Scale/Size" prevVal={prevD2.scale}    value={scale}    onChange={setScale}    placeholder="Quantity, hours, sessions..." />
          <FieldRow label="Notes"      prevVal={prevD2.notes}    value={notes}    onChange={setNotes}    placeholder="Special requirements" />
        </div>

        {/* Schedule */}
        <div style={{ marginBottom: 14 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
            <label style={{ fontFamily: "Plus Jakarta Sans", fontSize: 10, fontWeight: 700, color: "var(--tf-muted,#999)", letterSpacing: ".05em" }}>📅 WHEN</label>
            <button onClick={() => setShowSchedule(s => !s)}
              style={{ background: "none", border: "1.5px solid var(--tf-border,#E5E2DC)", borderRadius: 100, padding: "4px 12px", fontFamily: "Plus Jakarta Sans", fontSize: 11, color: "#E85D3A", fontWeight: 600, cursor: "pointer" }}>
              {showSchedule ? "Hide" : scheduledDate ? "Change" : "Set date"}
            </button>
          </div>
          {!showSchedule && (
            <div>
              {scheduledDate
                ? <div style={{ padding: "9px 13px", background: "#F0F7F2", borderRadius: 10, fontFamily: "Plus Jakarta Sans", fontSize: 12, color: "#1A1A1A", display: "flex", gap: 7 }}><span>📅</span><span>{scheduledDate.display}</span></div>
                : <input className="inp" style={{ fontSize: 13 }} value={timeline} onChange={e => setTimeline(e.target.value)} placeholder="Timeline (or use the date picker above)" />
              }
            </div>
          )}
          {showSchedule && (
            <SchedulePicker value={scheduledDate} onChange={v => { setScheduledDate(v); setShowSchedule(false); }} />
          )}
        </div>

        <div className="warn">
          <span style={{ fontSize: 15 }}>⚠️</span>
          <p style={{ fontFamily: "Plus Jakarta Sans", fontSize: 11, color: "#7A5C00", lineHeight: 1.6 }}>Legal goods and services only. Both parties must re-agree after any modification.</p>
        </div>

        <button className="bgr" style={{ marginTop: 10 }} disabled={!canSubmit} onClick={handleSubmit}>Send Counter-Offer</button>
        <button className="bg" style={{ marginTop: 9 }} onClick={onClose}>Cancel</button>
      </div>
    </div>
  );
}

// ─── DISPUTE SHEET ────────────────────────────────────────────────────────────

const DISPUTE_CATEGORIES = [
  { id: "no-show",   icon: "🚫", label: "Didn't show up",         desc: "The other party didn't appear as agreed" },
  { id: "incomplete",icon: "⚠️", label: "Work not completed",     desc: "Obligations were only partially fulfilled" },
  { id: "quality",   icon: "😞", label: "Quality issues",         desc: "Work or goods didn't meet the agreed standard" },
  { id: "scope",     icon: "📋", label: "Scope disagreement",     desc: "What was delivered differed from what was agreed" },
  { id: "conduct",   icon: "🙁", label: "Unprofessional conduct", desc: "Rude, unsafe, or inappropriate behaviour" },
  { id: "other",     icon: "❓", label: "Other",                  desc: "Something else went wrong" },
];

const DISPUTE_OUTCOMES = [
  { id: "renegotiate", icon: "🤝", label: "Renegotiate terms",     desc: "Work together to update the agreement" },
  { id: "partial",     icon: "💸", label: "Partial compensation",  desc: "One party compensates for what wasn't delivered" },
  { id: "cancel",      icon: "❌", label: "Cancel the trade",      desc: "Agree to walk away with no further obligations" },
  { id: "mediation",   icon: "⚖️", label: "Community mediation",   desc: "Escalate to a neutral third-party mediator" },
];

function DisputeSheet({ conv, onSubmit, onClose }) {
  const [step, setStep] = useState(1);
  const [category, setCategory] = useState(null);
  const [description, setDescription] = useState("");
  const [outcome, setOutcome] = useState(null);

  const canNext1 = !!category;
  const canNext2 = description.trim().length >= 20;
  const canSubmit = !!outcome;

  const handleSubmit = () => {
    onSubmit({ category: DISPUTE_CATEGORIES.find(c => c.id === category)?.label || category, categoryId: category, description, outcome: DISPUTE_OUTCOMES.find(o => o.id === outcome)?.label || outcome, outcomeId: outcome });
  };

  return (
    <div className="overlay" onClick={onClose}>
      <div className="sheet" onClick={e => e.stopPropagation()} style={{ maxHeight: "90vh", overflowY: "auto" }}>
        <div style={{ width: 38, height: 4, background: "#E0DDD6", borderRadius: 100, margin: "0 auto 16px" }} />

        {/* Progress */}
        <div style={{ display: "flex", gap: 6, marginBottom: 20 }}>
          {[1,2,3].map(s => (
            <div key={s} style={{ flex: 1, height: 3, borderRadius: 100, background: step >= s ? "#D97706" : "#E5E2DC", transition: "background .2s" }} />
          ))}
        </div>

        {step === 1 && (
          <>
            <div style={{ fontFamily: "'Instrument Serif',serif", fontSize: 17, letterSpacing: "-0.01em", color: "#1A1A1A", marginBottom: 4 }}>What went wrong?</div>
            <p style={{ fontFamily: "Plus Jakarta Sans", fontSize: 13, color: "#888", marginBottom: 16, lineHeight: 1.6 }}>Select the category that best describes the issue with <strong style={{ color: "#1A1A1A" }}>{conv.listing.name}</strong>.</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {DISPUTE_CATEGORIES.map(cat => (
                <button key={cat.id} onClick={() => setCategory(cat.id)}
                  style={{ display: "flex", alignItems: "center", gap: 12, padding: "11px 14px", borderRadius: 13, border: `2px solid ${category === cat.id ? "#D97706" : "#E5E2DC"}`, background: category === cat.id ? "#FEF9EE" : "#fff", cursor: "pointer", textAlign: "left", transition: "all .15s" }}>
                  <span style={{ fontSize: 20, flexShrink: 0 }}>{cat.icon}</span>
                  <div>
                    <div style={{ fontFamily: "Plus Jakarta Sans", fontSize: 13, fontWeight: 600, color: "#1A1A1A" }}>{cat.label}</div>
                    <div style={{ fontFamily: "Plus Jakarta Sans", fontSize: 11, color: "#aaa", marginTop: 1 }}>{cat.desc}</div>
                  </div>
                  {category === cat.id && <span style={{ marginLeft: "auto", color: "#D97706", fontWeight: 700 }}>✓</span>}
                </button>
              ))}
            </div>
            <button className="bgr" style={{ marginTop: 16, background: "#D97706", opacity: canNext1 ? 1 : 0.4 }} disabled={!canNext1} onClick={() => setStep(2)}>Next →</button>
          </>
        )}

        {step === 2 && (
          <>
            <div style={{ fontFamily: "'Instrument Serif',serif", fontSize: 17, letterSpacing: "-0.01em", color: "#1A1A1A", marginBottom: 4 }}>Describe what happened</div>
            <p style={{ fontFamily: "Plus Jakarta Sans", fontSize: 13, color: "#888", marginBottom: 16, lineHeight: 1.6 }}>Be specific. This helps both parties and any mediator understand the situation clearly.</p>
            <textarea className="inp" style={{ minHeight: 120 }}
              placeholder="e.g. We agreed on 3 hours of garden work on Saturday. They arrived 2 hours late and only completed half the agreed tasks before leaving..."
              value={description} onChange={e => setDescription(e.target.value)} />
            <div style={{ fontFamily: "Plus Jakarta Sans", fontSize: 11, color: description.length < 20 ? "#EF4444" : "#E85D3A", marginTop: 4, textAlign: "right" }}>
              {description.length < 20 ? `${20 - description.length} more characters needed` : "✓ Good to go"}
            </div>
            <div style={{ display: "flex", gap: 8, marginTop: 14 }}>
              <button onClick={() => setStep(1)} style={{ flex: 1, padding: "12px", background: "none", border: "1.5px solid #E5E2DC", borderRadius: 100, fontFamily: "Plus Jakarta Sans", fontSize: 13, color: "#888", cursor: "pointer" }}>← Back</button>
              <button className="bgr" style={{ flex: 2, background: "#D97706", opacity: canNext2 ? 1 : 0.4 }} disabled={!canNext2} onClick={() => setStep(3)}>Next →</button>
            </div>
          </>
        )}

        {step === 3 && (
          <>
            <div style={{ fontFamily: "'Instrument Serif',serif", fontSize: 17, letterSpacing: "-0.01em", color: "#1A1A1A", marginBottom: 4 }}>What outcome do you want?</div>
            <p style={{ fontFamily: "Plus Jakarta Sans", fontSize: 13, color: "#888", marginBottom: 16, lineHeight: 1.6 }}>This helps guide the resolution. You can always change course through the chat.</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {DISPUTE_OUTCOMES.map(opt => (
                <button key={opt.id} onClick={() => setOutcome(opt.id)}
                  style={{ display: "flex", alignItems: "center", gap: 12, padding: "11px 14px", borderRadius: 13, border: `2px solid ${outcome === opt.id ? "#D97706" : "#E5E2DC"}`, background: outcome === opt.id ? "#FEF9EE" : "#fff", cursor: "pointer", textAlign: "left", transition: "all .15s" }}>
                  <span style={{ fontSize: 20, flexShrink: 0 }}>{opt.icon}</span>
                  <div>
                    <div style={{ fontFamily: "Plus Jakarta Sans", fontSize: 13, fontWeight: 600, color: "#1A1A1A" }}>{opt.label}</div>
                    <div style={{ fontFamily: "Plus Jakarta Sans", fontSize: 11, color: "#aaa", marginTop: 1 }}>{opt.desc}</div>
                  </div>
                  {outcome === opt.id && <span style={{ marginLeft: "auto", color: "#D97706", fontWeight: 700 }}>✓</span>}
                </button>
              ))}
            </div>
            <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
              <button onClick={() => setStep(2)} style={{ flex: 1, padding: "12px", background: "none", border: "1.5px solid #E5E2DC", borderRadius: 100, fontFamily: "Plus Jakarta Sans", fontSize: 13, color: "#888", cursor: "pointer" }}>← Back</button>
              <button className="bgr" style={{ flex: 2, background: "#D97706", opacity: canSubmit ? 1 : 0.4 }} disabled={!canSubmit} onClick={handleSubmit}>Submit Dispute</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function MediationConfirmSheet({ caseRef, conv, onClose }) {
  return (
    <div className="overlay" onClick={onClose}>
      <div className="sheet" onClick={e => e.stopPropagation()}>
        <div style={{ width: 38, height: 4, background: "#E0DDD6", borderRadius: 100, margin: "0 auto 18px" }} />
        <div style={{ textAlign: "center", marginBottom: 20 }}>
          <div style={{ fontSize: 44, marginBottom: 10 }}>⚖️</div>
          <div style={{ fontFamily: "'Instrument Serif',serif", fontSize: 19, color: "#1A1A1A", marginBottom: 8 }}>Mediation requested</div>
          <div style={{ display: "inline-block", background: "#FEF3C7", borderRadius: 100, padding: "5px 16px", fontFamily: "Plus Jakarta Sans", fontSize: 12, fontWeight: 700, color: "#D97706", marginBottom: 12 }}>Case {caseRef}</div>
          <p style={{ fontFamily: "Plus Jakarta Sans", fontSize: 13, color: "#666", lineHeight: 1.6 }}>
            A community mediator will review your case within <strong style={{ color: "#1A1A1A" }}>3–5 business days</strong>. Both parties will be contacted with next steps.
          </p>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 20 }}>
          {[
            ["📋", "Case submitted", "Your dispute has been logged with full contract history"],
            ["🔍", "Neutral review",  "A mediator will review evidence from both parties"],
            ["📬", "Decision sent",   "Both parties notified of the recommended outcome"],
          ].map(([icon, title, desc]) => (
            <div key={title} style={{ display: "flex", gap: 12, alignItems: "flex-start", padding: "10px 14px", background: "#F0EEE9", borderRadius: 13 }}>
              <span style={{ fontSize: 18 }}>{icon}</span>
              <div>
                <div style={{ fontFamily: "Plus Jakarta Sans", fontSize: 13, fontWeight: 600, color: "#1A1A1A" }}>{title}</div>
                <div style={{ fontFamily: "Plus Jakarta Sans", fontSize: 11, color: "#aaa", marginTop: 2 }}>{desc}</div>
              </div>
            </div>
          ))}
        </div>
        <p style={{ fontFamily: "Plus Jakarta Sans", fontSize: 11, color: "#bbb", textAlign: "center", marginBottom: 14, lineHeight: 1.6 }}>
          In the meantime, you can still message {conv.listing.name} directly to try to resolve things.
        </p>
        <button className="bg" onClick={onClose}>Got it</button>
      </div>
    </div>
  );
}

// ─── SHARED COMPONENTS ────────────────────────────────────────────────────────

function StatusPill({ status, contractType }) {
  const map = {
    pending:    ["#FFF3E0", "#E8854A", "Pending"],
    countered:  ["#EEF2FF", "#4B8EF0", "Countered"],
    agreed:     ["#E8F5EC", "#E85D3A", contractType === "ongoing" ? "Ongoing ✅" : "Agreed ✅"],
    terminated: ["#F3F3F3", "#999",    "Ended"],
    disputed:   ["#FEF3C7", "#D97706", "⚠️ Disputed"],
  };
  const [bg, fg, label] = map[status] || ["#F0F0EC", "#888", status];
  return <span style={{ background: bg, color: fg, padding: "3px 9px", borderRadius: 100, fontSize: 10, fontFamily: "Plus Jakarta Sans", fontWeight: 600 }}>{label}</span>;
}

function AiBox({ aiQuery, setAiQuery, loading, result, suggested, run, onSelect, compact }) {
  return (
    <div className="ai-box">
      <div style={{ fontFamily: "'Instrument Serif',serif", fontSize: compact ? 13 : 15, color: "#fff" }}>🤖 AI Matchmaker</div>
      {!compact && <p style={{ fontFamily: "Plus Jakarta Sans", fontSize: 12, color: "rgba(255,255,255,.6)", marginTop: 3 }}>Describe what you're looking for and I'll find matches.</p>}
      <div style={{ display: "flex", gap: 8, marginTop: 11 }}>
        <input className="ai-inp" placeholder="e.g. someone to paint my living room..." value={aiQuery} onChange={e => setAiQuery(e.target.value)} onKeyDown={e => e.key === "Enter" && run()} />
        <button onClick={run} style={{ padding: "10px 16px", borderRadius: 100, border: "none", background: "#E85D3A", color: "#fff", fontFamily: "Plus Jakarta Sans", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>{loading ? "…" : "Search"}</button>
      </div>
      {(loading || result) && (
        <div className="ai-res">
          {loading
            ? <p style={{ fontFamily: "Plus Jakarta Sans", fontSize: 13, color: "rgba(255,255,255,.7)" }}>Searching…</p>
            : <>
                <p style={{ fontFamily: "Plus Jakarta Sans", fontSize: 13, color: "#fff", lineHeight: 1.5, marginBottom: suggested.length ? 10 : 0 }}>{result.message}</p>
                {suggested.map(l => (
                  <div key={l.id} onClick={() => onSelect(l)} style={{ background: "rgba(255,255,255,.12)", borderRadius: 11, padding: "9px 11px", marginBottom: 5, cursor: "pointer", display: "flex", gap: 9, alignItems: "center" }}>
                    <span style={{ fontSize: 17 }}>{catOf(l.category).icon}</span>
                    <div><div style={{ fontFamily: "Plus Jakarta Sans", fontSize: 13, fontWeight: 600, color: "#fff" }}>{l.title}</div><div style={{ fontFamily: "Plus Jakarta Sans", fontSize: 11, color: "rgba(255,255,255,.6)" }}>{l.name}</div></div>
                  </div>
                ))}
                {result.tip && <p style={{ fontFamily: "Plus Jakarta Sans", fontSize: 11, color: "rgba(255,255,255,.45)", marginTop: 7, fontStyle: "italic" }}>💡 {result.tip}</p>}
              </>}
        </div>
      )}
    </div>
  );
}

// ─── CONTRACT PREVIEW (STRUCTURED) ───────────────────────────────────────────

function ContractPreviewSheet({ data, myName }) {
  const { party1, party2, details1, details2, date, version } = data;
  const isParty1 = party1 === myName || party1 === "You";
  const myObligation   = isParty1 ? details1 : details2;
  const theirObligation = isParty1 ? details2 : details1;
  const theirName      = isParty1 ? party2 : party1;

  return (
    <div className="ctrct-wrap">
      {/* Header */}
      <div className="ctrct-header">
        <div style={{ fontFamily: "'Instrument Serif',serif", fontSize: 14, color: "#E85D3A" }}>Bartr Exchange Agreement</div>
        <div style={{ fontFamily: "Plus Jakarta Sans", fontSize: 11, color: "rgba(255,255,255,.55)", marginTop: 3 }}>v{version} · {date}</div>
        <div style={{ fontFamily: "Plus Jakarta Sans", fontSize: 11, color: "rgba(255,255,255,.7)", marginTop: 5 }}>
          {party1} ⇄ {party2}
        </div>
      </div>

      {/* YOUR commitment — highlighted */}
      <div className="ctrct-mine">
        <div className="ctrct-mine-label">
          <span style={{ fontSize: 14 }}>⚠️</span> YOUR COMMITMENT ({myName})
        </div>
        <div className="ctrct-body">{myObligation}</div>
        <div style={{ fontFamily: "Plus Jakarta Sans", fontSize: 11, color: "#92400E", marginTop: 10, padding: "8px 10px", background: "rgba(245,158,11,.12)", borderRadius: 8 }}>
          By agreeing, you are legally committing to deliver the above. Please read carefully before signing.
        </div>
      </div>

      {/* THEIR commitment */}
      <div className="ctrct-theirs">
        <div className="ctrct-theirs-label">IN EXCHANGE — {theirName} WILL PROVIDE</div>
        <div className="ctrct-body">{theirObligation}</div>
      </div>

      {/* Disclaimer */}
      <div className="ctrct-disclaimer">
        <div style={{ fontFamily: "Plus Jakarta Sans", fontSize: 10, fontWeight: 700, color: "#aaa", letterSpacing: ".07em", marginBottom: 6 }}>LEGAL NOTICE & COMMUNITY STANDARDS</div>
        <p>{DISCLAIMER}</p>
      </div>
    </div>
  );
}

// ─── LISTING DETAIL BODY ─────────────────────────────────────────────────────

function ListingDetailBody({ selectedListing, reviews, setSelectedListing, showToast, startIntake, allListings }) {
  const cd = selectedListing.contractDefaults;
  const hasDefaults = cd && (cd.offer || cd.lookingFor || cd.conditions);

  // Score similar listings
  const similar = (allListings || [])
    .filter(l => l.id !== selectedListing.id && !l.mine)
    .map(l => {
      let score = 0;
      if (l.category === selectedListing.category) score += 4;
      if (l.type === selectedListing.type) score += 1;
      const words = (selectedListing.title + " " + (selectedListing.desc || "")).toLowerCase().split(/\W+/).filter(w => w.length > 3);
      const lText = (l.title + " " + (l.desc || "")).toLowerCase();
      words.forEach(w => { if (lText.includes(w)) score += 1; });
      return { l, score };
    })
    .filter(x => x.score >= 3)
    .sort((a, b) => b.score - a.score)
    .slice(0, 6)
    .map(x => x.l);

  return (
    <>
      {/* Contract defaults preview — visible to potential traders */}
      {hasDefaults && (
        <div style={{ background: "var(--tf-input,#F0F9F3)", border: "1.5px solid #C8E6D4", borderRadius: 14, padding: 14, marginBottom: 14 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 10 }}>
            <span style={{ fontSize: 15 }}>📋</span>
            <div style={{ fontFamily: "Plus Jakarta Sans", fontSize: 11, fontWeight: 700, color: "#2D6A4F", letterSpacing: ".05em" }}>STANDARD TERMS</div>
            {cd.contractType && cd.contractType !== "one-time" && (
              <span style={{ background: "#D1FAE5", color: "#065F46", borderRadius: 100, padding: "1px 8px", fontSize: 10, fontFamily: "Plus Jakarta Sans", fontWeight: 600 }}>{cd.contractType}</span>
            )}
          </div>
          {cd.offer && (
            <div style={{ marginBottom: 8 }}>
              <div style={{ fontFamily: "Plus Jakarta Sans", fontSize: 10, fontWeight: 700, color: "#E85D3A", textTransform: "uppercase", letterSpacing: ".06em", marginBottom: 3 }}>What's included</div>
              <div style={{ fontFamily: "Plus Jakarta Sans", fontSize: 12, color: "var(--tf-text,#1A1A1A)", lineHeight: 1.6 }}>{cd.offer}</div>
            </div>
          )}
          {cd.lookingFor && (
            <div style={{ marginBottom: 8 }}>
              <div style={{ fontFamily: "Plus Jakarta Sans", fontSize: 10, fontWeight: 700, color: "#E85D3A", textTransform: "uppercase", letterSpacing: ".06em", marginBottom: 3 }}>Looking for in return</div>
              <div style={{ fontFamily: "Plus Jakarta Sans", fontSize: 12, color: "var(--tf-text,#1A1A1A)", lineHeight: 1.6 }}>{cd.lookingFor}</div>
            </div>
          )}
          {cd.conditions && (
            <div>
              <div style={{ fontFamily: "Plus Jakarta Sans", fontSize: 10, fontWeight: 700, color: "#E85D3A", textTransform: "uppercase", letterSpacing: ".06em", marginBottom: 3 }}>Standard conditions</div>
              <div style={{ fontFamily: "Plus Jakarta Sans", fontSize: 12, color: "var(--tf-sub,#555)", lineHeight: 1.6 }}>{cd.conditions}</div>
            </div>
          )}
        </div>
      )}
      {/* Live reviews */}
      {(() => {
        const listingReviews = reviews.filter(r => r.listingId === selectedListing.id);
        if (listingReviews.length === 0) return null;
        const avg = (listingReviews.reduce((a,b) => a + b.rating, 0) / listingReviews.length).toFixed(1);
        return (
          <div style={{ background: "#F0EEE9", borderRadius: 14, padding: 14, marginBottom: 14 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
              <div style={{ fontFamily: "Plus Jakarta Sans", fontSize: 11, fontWeight: 700, color: "#999", letterSpacing: ".06em" }}>COMMUNITY REVIEWS</div>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <StarDisplay rating={parseFloat(avg)} size={13} />
                <span style={{ fontFamily: "Plus Jakarta Sans", fontSize: 12, fontWeight: 600, color: "#1A1A1A" }}>{avg}</span>
                <span style={{ fontFamily: "Plus Jakarta Sans", fontSize: 11, color: "#aaa" }}>({listingReviews.length})</span>
              </div>
            </div>
            {listingReviews.slice(0, 3).map(r => <ReviewCard key={r.id} review={r} canReply={false} onReply={() => {}} />)}
            {listingReviews.length > 3 && <div style={{ fontFamily: "Plus Jakarta Sans", fontSize: 12, color: "#aaa", textAlign: "center", marginTop: 8 }}>+{listingReviews.length - 3} more</div>}
          </div>
        );
      })()}

      {/* Business info */}
      {selectedListing.accountType === "business" && (
        <div style={{ background: "#F4F8FE", borderRadius: 14, padding: 14, marginBottom: 14 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 6 }}>
            <span className="biz-badge">🏢 Business</span>
            {selectedListing.businessType && <span style={{ fontFamily: "Plus Jakarta Sans", fontSize: 11, color: "#777" }}>{selectedListing.businessType}</span>}
          </div>
          <div style={{ fontFamily: "Plus Jakarta Sans", fontSize: 13, fontWeight: 600, color: "#1A1A1A" }}>{selectedListing.businessName}</div>
          {selectedListing.socials && Object.entries(selectedListing.socials).filter(([,v])=>v).length > 0 && (() => {
            const all = Object.entries(selectedListing.socials).filter(([,v])=>v);
            const visible = selectedListing.socialsPublic ? all : all.slice(0, 2);
            const hidden = selectedListing.socialsPublic ? 0 : Math.max(0, all.length - 2);
            return (
              <div style={{ marginTop: 10 }}>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                  {visible.map(([id, url]) => {
                    const plat = SOCIAL_PLATFORMS.find(p => p.id === id);
                    if (!plat) return null;
                    return <a key={id} className="social-chip" style={{ fontSize: 11 }} href={`https://${url}`} target="_blank" rel="noopener noreferrer"><BrandIcon id={plat.id} size={18} /> {plat.label}</a>;
                  })}
                </div>
                {hidden > 0 && <p style={{ fontFamily: "Plus Jakarta Sans", fontSize: 11, color: "#aaa", marginTop: 7 }}>🔒 +{hidden} more link{hidden > 1 ? "s" : ""} visible after connecting</p>}
              </div>
            );
          })()}
        </div>
      )}

      {/* Stats */}
      {selectedListing.rating && (
        <div style={{ display: "flex", gap: 22, padding: "12px 0", borderTop: "1px solid #F0EDE8", borderBottom: "1px solid #F0EDE8", marginBottom: 16 }}>
          <div><div className="stitle" style={{ fontSize: 17 }}>⭐ {selectedListing.rating}</div><div style={{ fontFamily: "Plus Jakarta Sans", fontSize: 10, color: "#999" }}>Rating</div></div>
          <div><div className="stitle" style={{ fontSize: 17 }}>{selectedListing.trades}</div><div style={{ fontFamily: "Plus Jakarta Sans", fontSize: 10, color: "#999" }}>Trades done</div></div>
        </div>
      )}

      {/* Seller badges */}
      {(() => {
        const badges = getBadges({
          trades: selectedListing.trades || 0,
          rating: selectedListing.rating || 0,
          reviewCount: selectedListing.reviewCount || 0,
          verified: selectedListing.verified || false,
          isPro: selectedListing.plan === "pro" || selectedListing.accountType === "business",
        });
        if (badges.length === 0) return null;
        return (
          <div style={{ marginBottom: 16 }}>
            <div style={{ fontFamily: "Plus Jakarta Sans", fontSize: 11, fontWeight: 700, color: "var(--tf-muted,#aaa)", letterSpacing: ".06em", marginBottom: 8 }}>SELLER BADGES</div>
            <div style={{ display: "flex", gap: 7, flexWrap: "wrap" }}>
              {badges.map(b => (
                <span key={b.id} style={{ background: b.bg, border: `1.5px solid ${b.border}`, borderRadius: 100, padding: "4px 10px", fontSize: 11, fontFamily: "Plus Jakarta Sans", color: b.color, fontWeight: 600, display: "inline-flex", alignItems: "center", gap: 5 }}>
                  {b.icon} {b.label}
                </span>
              ))}
            </div>
          </div>
        );
      })()}

      {/* Similar listings */}
      {similar.length > 0 && (
        <div style={{ marginBottom: 16 }}>
          <div style={{ fontFamily: "Plus Jakarta Sans", fontSize: 11, fontWeight: 700, color: "var(--tf-muted,#aaa)", letterSpacing: ".06em", marginBottom: 10 }}>YOU MIGHT ALSO LIKE</div>
          <div style={{ display: "flex", gap: 10, overflowX: "auto", paddingBottom: 6, marginRight: -18, paddingRight: 18 }}>
            {similar.map(l => {
              const cat = catOf(l.category);
              const cover = l.photos?.[0];
              return (
                <div key={l.id} onClick={() => setSelectedListing(l)}
                  style={{ flexShrink: 0, width: 140, borderRadius: 14, overflow: "hidden", background: "var(--tf-card,#fff)", border: "1.5px solid var(--tf-border,#E5E2DC)", cursor: "pointer" }}>
                  {cover
                    ? <div style={{ height: 80, background: "#E5E2DC", overflow: "hidden" }}><img src={cover} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} /></div>
                    : <div style={{ height: 80, background: cat.color + "20", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28 }}>{cat.icon}</div>
                  }
                  <div style={{ padding: "8px 10px 10px" }}>
                    <div style={{ fontFamily: "Plus Jakarta Sans", fontSize: 12, fontWeight: 600, color: "var(--tf-text,#1A1A1A)", lineHeight: 1.3, marginBottom: 3, overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" }}>{l.title}</div>
                    <div style={{ fontFamily: "Plus Jakarta Sans", fontSize: 10.5, color: "var(--tf-muted,#aaa)" }}>{l.name}</div>
                    {l.rating && <div style={{ fontFamily: "Plus Jakarta Sans", fontSize: 10, color: "#888", marginTop: 3 }}>⭐ {l.rating}</div>}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {!selectedListing.mine && <button className="bgr" onClick={() => startIntake(selectedListing)}>🤝 Make an Offer</button>}
      <button className="bg" style={{ marginTop: 10 }} onClick={() => setSelectedListing(null)}>Close</button>
    </>
  );
}

// ─── LIGHTBOX ────────────────────────────────────────────────────────────────

function Lightbox({ photos, index: initialIndex, onClose }) {
  const [idx, setIdx] = useState(initialIndex);
  const prev = () => setIdx(i => (i - 1 + photos.length) % photos.length);
  const next = () => setIdx(i => (i + 1) % photos.length);
  useEffect(() => {
    const handler = e => { if (e.key === "ArrowLeft") prev(); else if (e.key === "ArrowRight") next(); else if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);
  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, zIndex: 500, background: "rgba(0,0,0,.93)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
      {/* Close */}
      <button onClick={onClose} style={{ position: "absolute", top: 18, right: 18, background: "rgba(255,255,255,.15)", border: "none", borderRadius: "50%", width: 38, height: 38, color: "#fff", fontSize: 18, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>✕</button>
      {/* Counter */}
      <div style={{ position: "absolute", top: 24, left: "50%", transform: "translateX(-50%)", fontFamily: "Plus Jakarta Sans", fontSize: 12, color: "rgba(255,255,255,.6)" }}>{idx + 1} / {photos.length}</div>
      {/* Image */}
      <img src={photos[idx]} alt="" onClick={e => e.stopPropagation()} style={{ maxWidth: "92vw", maxHeight: "78vh", borderRadius: 16, objectFit: "contain", boxShadow: "0 8px 48px rgba(0,0,0,.6)" }} />
      {/* Nav arrows */}
      {photos.length > 1 && (
        <>
          <button onClick={e => { e.stopPropagation(); prev(); }} style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", background: "rgba(255,255,255,.15)", border: "none", borderRadius: "50%", width: 42, height: 42, color: "#fff", fontSize: 20, cursor: "pointer" }}>‹</button>
          <button onClick={e => { e.stopPropagation(); next(); }} style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)", background: "rgba(255,255,255,.15)", border: "none", borderRadius: "50%", width: 42, height: 42, color: "#fff", fontSize: 20, cursor: "pointer" }}>›</button>
        </>
      )}
      {/* Dot indicators */}
      {photos.length > 1 && (
        <div style={{ display: "flex", gap: 6, marginTop: 18 }}>
          {photos.map((_, i) => (
            <div key={i} onClick={e => { e.stopPropagation(); setIdx(i); }}
              style={{ width: i === idx ? 20 : 7, height: 7, borderRadius: 100, background: i === idx ? "#E85D3A" : "rgba(255,255,255,.3)", cursor: "pointer", transition: "all .2s" }} />
          ))}
        </div>
      )}
    </div>
  );
}

// ─── NOTIFICATIONS PANEL ─────────────────────────────────────────────────────

const NOTIF_META = {
  message:    { icon: "💬", bg: "#E8F5EC", label: "Message" },
  offer:      { icon: "🤝", bg: "#FFF8E1", label: "Offer" },
  confirmed:  { icon: "✅", bg: "#E8F5EC", label: "Confirmed" },
  counter:    { icon: "🔄", bg: "#EEF2FF", label: "Counter-offer" },
  complete:   { icon: "🎉", bg: "#FFF0F3", label: "Complete" },
  review:     { icon: "⭐", bg: "#FFFBEB", label: "Review" },
  terminated: { icon: "🔚", bg: "#FEF2F2", label: "Ended" },
  dispute:    { icon: "⚠️", bg: "#FEF9C3", label: "Dispute" },
  resolved:   { icon: "✅", bg: "#E8F5EC", label: "Resolved" },
  escalated:  { icon: "⚖️", bg: "#F3E8FF", label: "Mediation" },
  system:     { icon: "📢", bg: "#F0EEE9", label: "System" },
};

function timeAgo(ts) {
  const diff = Math.floor((Date.now() - new Date(ts)) / 1000);
  if (diff < 60) return "just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

function NotificationsPanel({ notifications, onMarkAllRead, onMarkRead, onClear, onNavigate, onClose, notifPrefs = {}, onTogglePref }) {
  const unread = notifications.filter(n => !n.read).length;
  const [showPrefs, setShowPrefs] = useState(false);

  const PREF_LABELS = [
    { key: "message",  icon: "💬", label: "Messages" },
    { key: "offer",    icon: "🤝", label: "New offers" },
    { key: "counter",  icon: "🔄", label: "Counter-offers" },
    { key: "complete", icon: "🎉", label: "Trade complete" },
    { key: "review",   icon: "⭐", label: "Reviews" },
    { key: "dispute",  icon: "⚠️", label: "Disputes" },
    { key: "system",   icon: "📢", label: "System" },
  ];

  return (
    <>
      {/* Backdrop */}
      <div style={{ position: "fixed", inset: 0, zIndex: 199 }} onClick={onClose} />
      <div className="notif-panel" style={{ position: "absolute" }}>
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "13px 18px 11px", borderBottom: "1.5px solid #F0EDE6", flexShrink: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ fontFamily: "'Instrument Serif',serif", fontSize: 15, color: "#1A1A1A" }}>Notifications</div>
            {unread > 0 && (
              <span style={{ background: "#E85C7A", color: "#fff", borderRadius: 100, padding: "1px 7px", fontFamily: "Plus Jakarta Sans", fontSize: 10, fontWeight: 700 }}>{unread} new</span>
            )}
          </div>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            {unread > 0 && (
              <button onClick={onMarkAllRead} style={{ background: "none", border: "none", fontFamily: "Plus Jakarta Sans", fontSize: 11, color: "#E85D3A", cursor: "pointer", fontWeight: 600 }}>Mark all read</button>
            )}
            {notifications.length > 0 && (
              <button onClick={onClear} style={{ background: "none", border: "none", fontFamily: "Plus Jakarta Sans", fontSize: 11, color: "#bbb", cursor: "pointer" }}>Clear all</button>
            )}
            <button onClick={() => setShowPrefs(p => !p)} title="Notification preferences" style={{ background: showPrefs ? "#F0EDE6" : "none", border: "none", borderRadius: 8, width: 28, height: 28, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", fontSize: 14, transition: "background .15s" }}>⚙️</button>
          </div>
        </div>

        {/* Prefs panel */}
        {showPrefs && (
          <div style={{ padding: "14px 18px", borderBottom: "1.5px solid #F0EDE6", background: "#FAFAF8" }}>
            <div style={{ fontFamily: "Plus Jakarta Sans", fontSize: 10, fontWeight: 700, color: "#bbb", letterSpacing: ".06em", marginBottom: 10 }}>NOTIFICATION PREFERENCES</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {PREF_LABELS.map(({ key, icon, label }) => (
                <div key={key} style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ fontSize: 14 }}>{icon}</span>
                    <span style={{ fontFamily: "Plus Jakarta Sans", fontSize: 12.5, color: "#444" }}>{label}</span>
                  </div>
                  <button onClick={() => onTogglePref?.(key)}
                    style={{ width: 38, height: 22, borderRadius: 100, border: "none", cursor: "pointer", transition: "background .2s", background: notifPrefs[key] !== false ? "#E85D3A" : "#DDD8CE", position: "relative", flexShrink: 0 }}>
                    <div style={{ position: "absolute", top: 3, left: notifPrefs[key] !== false ? 18 : 3, width: 16, height: 16, borderRadius: "50%", background: "#fff", transition: "left .2s", boxShadow: "0 1px 3px rgba(0,0,0,.2)" }} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* List */}
        <div style={{ overflowY: "auto", flex: 1 }}>
          {notifications.length === 0 ? (
            <div style={{ textAlign: "center", padding: "40px 20px" }}>
              <div style={{ fontSize: 36, marginBottom: 10 }}>🔔</div>
              <div style={{ fontFamily: "Plus Jakarta Sans", fontSize: 14, color: "#bbb" }}>No notifications yet</div>
              <div style={{ fontFamily: "Plus Jakarta Sans", fontSize: 12, color: "#ccc", marginTop: 4 }}>Activity from your trades will appear here.</div>
            </div>
          ) : notifications.map(n => {
            const meta = NOTIF_META[n.type] || NOTIF_META.system;
            const tappable = !!n.meta?.convId;
            return (
              <div key={n.id} className={`notif-item ${n.read ? "" : "unread"}`}
                onClick={() => { onMarkRead(n.id); if (tappable) onNavigate(n.meta); }}
                style={{ cursor: tappable ? "pointer" : "default" }}>
                <div className="notif-icon" style={{ background: meta.bg }}>{meta.icon}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 6 }}>
                    <div style={{ fontFamily: "Plus Jakarta Sans", fontSize: 13, fontWeight: n.read ? 400 : 600, color: "#1A1A1A", lineHeight: 1.3 }}>{n.title}</div>
                    <div style={{ fontFamily: "Plus Jakarta Sans", fontSize: 10, color: "#bbb", whiteSpace: "nowrap", flexShrink: 0, marginTop: 1 }}>{timeAgo(n.ts)}</div>
                  </div>
                  <div style={{ fontFamily: "Plus Jakarta Sans", fontSize: 12, color: "#777", marginTop: 2, lineHeight: 1.45, overflow: "hidden", textOverflow: "ellipsis", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" }}>{n.body}</div>
                  {tappable && <div style={{ fontFamily: "Plus Jakarta Sans", fontSize: 11, color: "#E85D3A", marginTop: 4, fontWeight: 600 }}>Open conversation →</div>}
                </div>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6, flexShrink: 0 }}>
                  {!n.read && <div className="notif-dot" />}
                  {tappable && <span style={{ color: "#CCC", fontSize: 14, lineHeight: 1 }}>›</span>}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}

// ─── REPORT MODAL ─────────────────────────────────────────────────────────────

const REPORT_REASONS = [
  { id: "spam",       icon: "📢", label: "Spam or fake listing",         sub: "This listing appears to be spam or not genuine." },
  { id: "offensive",  icon: "🚫", label: "Offensive or harmful content", sub: "Contains inappropriate, discriminatory, or threatening material." },
  { id: "illegal",    icon: "⚖️", label: "Illegal goods or services",    sub: "Offers something that violates our community standards or the law." },
  { id: "sexual",     icon: "🔞", label: "Sexual services",              sub: "Offering services of a sexual nature, which are prohibited." },
  { id: "misleading", icon: "❓", label: "Misleading or inaccurate",     sub: "The listing is deceptive or misrepresents what's offered." },
  { id: "other",      icon: "✏️", label: "Something else",               sub: "Describe the issue in your own words." },
];

function ReportModal({ listing, alreadyReported, onReport, onClose }) {
  const [selected, setSelected] = useState("");
  const [detail, setDetail] = useState("");
  const [submitted, setSubmitted] = useState(alreadyReported);

  const handleSubmit = () => {
    if (!selected) return;
    setSubmitted(true);
    setTimeout(() => onReport(selected, detail), 600);
  };

  return (
    <div className="overlay" onClick={onClose}>
      <div className="sheet" onClick={e => e.stopPropagation()}>
        <div style={{ width: 38, height: 4, background: "#E0DDD6", borderRadius: 100, margin: "0 auto 16px" }} />

        {!submitted ? (
          <>
            <div style={{ fontFamily: "'Instrument Serif',serif", fontSize: 18, color: "#1A1A1A", marginBottom: 3 }}>Report listing</div>
            <p style={{ fontFamily: "Plus Jakarta Sans", fontSize: 13, color: "#888", marginBottom: 18, lineHeight: 1.6 }}>
              What's wrong with <strong style={{ color: "#1A1A1A" }}>{listing.title}</strong> by {listing.businessName || listing.name}?
            </p>

            {REPORT_REASONS.map(r => (
              <div key={r.id} className={`report-opt ${selected === r.id ? "sel" : ""}`} onClick={() => setSelected(r.id)}>
                <span style={{ fontSize: 20, flexShrink: 0 }}>{r.icon}</span>
                <div>
                  <div style={{ fontFamily: "Plus Jakarta Sans", fontSize: 13, fontWeight: 600, color: selected === r.id ? "#DC2626" : "#1A1A1A" }}>{r.label}</div>
                  <div style={{ fontFamily: "Plus Jakarta Sans", fontSize: 11, color: "#888", marginTop: 1 }}>{r.sub}</div>
                </div>
                <div style={{ marginLeft: "auto", width: 18, height: 18, borderRadius: "50%", border: `2px solid ${selected === r.id ? "#EF4444" : "#DDD8CE"}`, background: selected === r.id ? "#EF4444" : "transparent", flexShrink: 0 }} />
              </div>
            ))}

            {selected === "other" && (
              <textarea className="inp" style={{ marginTop: 4, minHeight: 80 }} placeholder="Tell us more…" value={detail} onChange={e => setDetail(e.target.value)} />
            )}

            <div style={{ background: "#FEF2F2", borderRadius: 12, padding: "10px 14px", margin: "14px 0 16px" }}>
              <p style={{ fontFamily: "Plus Jakarta Sans", fontSize: 11.5, color: "#B91C1C", lineHeight: 1.65 }}>
                🛡️ Reports are reviewed by the Bartr trust & safety team. Repeated violations may result in removal from the platform.
              </p>
            </div>

            <button className="bp" style={{ background: "#EF4444", marginBottom: 9 }} disabled={!selected || (selected === "other" && !detail.trim())} onClick={handleSubmit}>
              Submit Report
            </button>
            <button className="bg" onClick={onClose}>Cancel</button>
          </>
        ) : (
          <div style={{ textAlign: "center", padding: "20px 0" }}>
            <div style={{ fontSize: 48, marginBottom: 14 }}>🛡️</div>
            <div style={{ fontFamily: "'Instrument Serif',serif", fontSize: 21, letterSpacing: "-0.01em", color: "#1A1A1A", marginBottom: 8 }}>Report received</div>
            <p style={{ fontFamily: "Plus Jakarta Sans", fontSize: 13, color: "#777", lineHeight: 1.65, marginBottom: 22 }}>
              Thank you for helping keep Bartr safe. Our team will review this listing and take action if needed.
            </p>
            <button className="bp" onClick={onClose}>Done</button>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── EMAIL CONFIRM MODAL ──────────────────────────────────────────────────────

// Parse a rough date from timeline strings like "Next Saturday", "March 15", "in 2 weeks", etc.
function parseTradeDate(timeline) {
  if (!timeline) return null;
  const now = new Date();
  const t = timeline.toLowerCase();
  // ISO / explicit dates: "2025-03-15" or "March 15" or "15th March"
  const explicit = timeline.match(/(\b(?:jan(?:uary)?|feb(?:ruary)?|mar(?:ch)?|apr(?:il)?|may|jun(?:e)?|jul(?:y)?|aug(?:ust)?|sep(?:tember)?|oct(?:ober)?|nov(?:ember)?|dec(?:ember)?)\s+\d{1,2}(?:st|nd|rd|th)?(?:\s*,?\s*\d{4})?|\d{1,2}(?:st|nd|rd|th)?\s+(?:jan(?:uary)?|feb(?:ruary)?|mar(?:ch)?|apr(?:il)?|may|jun(?:e)?|jul(?:y)?|aug(?:ust)?|sep(?:tember)?|oct(?:ober)?|nov(?:ember)?|dec(?:ember)?)(?:\s+\d{4})?)/i);
  if (explicit) {
    const d = new Date(explicit[0]);
    if (!isNaN(d)) return d;
  }
  // Relative: "next week", "in 2 weeks", "next Saturday", etc.
  if (t.includes("next week")) { const d = new Date(now); d.setDate(d.getDate() + 7); return d; }
  if (t.includes("in 2 weeks") || t.includes("two weeks")) { const d = new Date(now); d.setDate(d.getDate() + 14); return d; }
  if (t.includes("in 3 weeks") || t.includes("three weeks")) { const d = new Date(now); d.setDate(d.getDate() + 21); return d; }
  if (t.includes("next month")) { const d = new Date(now); d.setMonth(d.getMonth() + 1); return d; }
  const days = ["sunday","monday","tuesday","wednesday","thursday","friday","saturday"];
  for (let i = 0; i < days.length; i++) {
    if (t.includes(days[i])) {
      const d = new Date(now);
      const diff = (i - d.getDay() + 7) % 7 || 7;
      d.setDate(d.getDate() + diff);
      return d;
    }
  }
  return null;
}

function toICS(title, date, description, location) {
  const pad = n => String(n).padStart(2, "0");
  const fmt = d => `${d.getFullYear()}${pad(d.getMonth()+1)}${pad(d.getDate())}T${pad(d.getHours())}${pad(d.getMinutes())}${pad(d.getSeconds())}`;
  const end = new Date(date); end.setHours(end.getHours() + 2);
  return [
    "BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//Bartr//EN",
    "BEGIN:VEVENT",
    `UID:${Date.now()}@bartr`,
    `DTSTAMP:${fmt(new Date())}`,
    `DTSTART:${fmt(date)}`,
    `DTEND:${fmt(end)}`,
    `SUMMARY:${title}`,
    `DESCRIPTION:${description.replace(/\n/g, "\\n")}`,
    location ? `LOCATION:${location}` : "",
    "END:VEVENT", "END:VCALENDAR"
  ].filter(Boolean).join("\r\n");
}

function EmailConfirmModal({ data, onClose }) {
  const { to1, to2, myName, theirName, contract, listingTitle, contractData } = data;
  const [showContract, setShowContract] = useState(false);
  const [calAdded, setCalAdded] = useState(false);

  // Use structured scheduledDate if present, fall back to text parsing
  const timeline = contractData?.details2 || "";
  const tradeDate = contractData?.scheduledDate
    ? new Date(contractData.scheduledDate)
    : parseTradeDate(timeline);
  const location = contractData ? (contractData.details2.match(/location[:\s]+([^\n•]+)/i)?.[1]?.trim() || "") : "";

  const handleAddToCalendar = (type) => {
    const title = `Bartr: ${listingTitle}`;
    const desc = `Exchange with ${theirName}.\n\n${contract}`;
    if (type === "ics") {
      const ics = toICS(title, tradeDate, desc, location);
      const blob = new Blob([ics], { type: "text/calendar" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a"); a.href = url; a.download = "Bartr-exchange.ics"; a.click();
      URL.revokeObjectURL(url);
    } else if (type === "google") {
      const fmt = d => d.toISOString().replace(/[-:]/g,"").split(".")[0]+"Z";
      const end = new Date(tradeDate); end.setHours(end.getHours() + 2);
      const url = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(title)}&dates=${fmt(tradeDate)}/${fmt(end)}&details=${encodeURIComponent(desc)}&location=${encodeURIComponent(location)}`;
      window.open(url, "_blank");
    } else if (type === "outlook") {
      const fmt = d => d.toISOString();
      const end = new Date(tradeDate); end.setHours(end.getHours() + 2);
      const url = `https://outlook.live.com/calendar/0/deeplink/compose?subject=${encodeURIComponent(title)}&startdt=${fmt(tradeDate)}&enddt=${fmt(end)}&body=${encodeURIComponent(desc)}&location=${encodeURIComponent(location)}`;
      window.open(url, "_blank");
    }
    setCalAdded(true);
  };

  return (
    <div className="overlay" onClick={onClose}>
      <div className="sheet" onClick={e => e.stopPropagation()}>
        <div style={{ width: 38, height: 4, background: "#E0DDD6", borderRadius: 100, margin: "0 auto 18px" }} />
        <div style={{ textAlign: "center", marginBottom: 18 }}>
          <div style={{ fontSize: 44, marginBottom: 10 }}>📧</div>
          <div style={{ fontFamily: "'Instrument Serif',serif", fontSize: 20, color: "#1A1A1A", marginBottom: 6 }}>Confirmation emails sent!</div>
          <p style={{ fontFamily: "Plus Jakarta Sans", fontSize: 13, color: "#777", lineHeight: 1.6 }}>
            Both parties received a thank you email with the signed contract for <strong style={{ color: "#1A1A1A" }}>{listingTitle}</strong>.
          </p>
        </div>

        {/* Recipients */}
        <div style={{ marginBottom: 16 }}>
          {[{ email: to1, name: myName }, { email: to2, name: theirName }].map(r => (
            <div key={r.email} className="email-modal-row">
              <div className="email-modal-icon">✉️</div>
              <div>
                <div style={{ fontFamily: "Plus Jakarta Sans", fontSize: 13, fontWeight: 600, color: "#1A1A1A" }}>{r.name}</div>
                <div style={{ fontFamily: "Plus Jakarta Sans", fontSize: 11, color: "#888", marginTop: 1 }}>{r.email}</div>
              </div>
              <span style={{ marginLeft: "auto", fontFamily: "Plus Jakarta Sans", fontSize: 11, color: "#E85D3A", fontWeight: 600 }}>✓ Sent</span>
            </div>
          ))}
        </div>

        {/* Calendar add — shown when a date is detectable */}
        {tradeDate ? (
          <div style={{ background: "#F0F7FF", border: "1.5px solid #BFDBFE", borderRadius: 14, padding: 14, marginBottom: 14 }}>
            <div style={{ fontFamily: "Plus Jakarta Sans", fontSize: 12, fontWeight: 700, color: "#2563EB", marginBottom: 4, letterSpacing: ".04em" }}>📅 ADD TO CALENDAR</div>
            <p style={{ fontFamily: "Plus Jakarta Sans", fontSize: 12, color: "#555", marginBottom: 12, lineHeight: 1.6 }}>
              A trade date was detected: <strong style={{ color: "#1A1A1A" }}>{tradeDate.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}</strong>
              {location && <><br /><span style={{ color: "#888" }}>📍 {location}</span></>}
            </p>
            {!calAdded ? (
              <div style={{ display: "flex", gap: 7, flexWrap: "wrap" }}>
                {[
                  { type: "google", label: "Google", brand: "google" },
                  { type: "outlook", label: "Outlook", icon: "🔷" },
                  { type: "ics", label: "Apple / iCal", brand: "apple" },
                ].map(opt => (
                  <button key={opt.type} onClick={() => handleAddToCalendar(opt.type)}
                    style={{ flex: 1, padding: "8px 4px", borderRadius: 100, border: "1.5px solid #BFDBFE", background: "#fff", fontFamily: "Plus Jakarta Sans", fontSize: 11, fontWeight: 600, color: "#2563EB", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 4 }}>
                    {opt.brand ? <AuthBrandIcon id={opt.brand} size={14} /> : <span>{opt.icon}</span>} {opt.label}
                  </button>
                ))}
              </div>
            ) : (
              <div style={{ textAlign: "center", fontFamily: "Plus Jakarta Sans", fontSize: 13, color: "#E85D3A", fontWeight: 600 }}>✓ Added to your calendar!</div>
            )}
          </div>
        ) : (
          <div style={{ background: "#FFF8E1", border: "1.5px solid #FCD34D", borderRadius: 14, padding: 14, marginBottom: 14, display: "flex", gap: 10, alignItems: "flex-start" }}>
            <span style={{ fontSize: 20 }}>🤝</span>
            <div>
              <div style={{ fontFamily: "Plus Jakarta Sans", fontSize: 13, fontWeight: 600, color: "#92400E", marginBottom: 3 }}>Flexible schedule</div>
              <div style={{ fontFamily: "Plus Jakarta Sans", fontSize: 12, color: "#B45309", lineHeight: 1.6 }}>You've agreed to sort out the exact time between yourselves. Reach out via the chat to confirm a date that works for both of you.</div>
            </div>
          </div>
        )}

        {/* Contract preview */}
        <button onClick={() => setShowContract(s => !s)} style={{ background: "none", border: "1.5px solid #E5E2DC", borderRadius: 12, padding: "10px 16px", fontFamily: "Plus Jakarta Sans", fontSize: 12, color: "#555", cursor: "pointer", width: "100%", marginBottom: showContract ? 10 : 14 }}>
          {showContract ? "▲ Hide contract" : "▼ Preview attached contract"}
        </button>
        {showContract && (
          <div className="cbox" style={{ maxHeight: 200, overflowY: "auto", marginBottom: 14, fontSize: 11 }}>{contract}</div>
        )}

        <div style={{ background: "#F0F7F2", borderRadius: 12, padding: "10px 14px", marginBottom: 16 }}>
          <p style={{ fontFamily: "Plus Jakarta Sans", fontSize: 11.5, color: "#2D7A50", lineHeight: 1.65 }}>
            📎 The contract PDF is attached to each email. Both parties should keep a copy for their records.
          </p>
        </div>

        <button className="bp" onClick={onClose}>Done — Leave a Review</button>
      </div>
    </div>
  );
}

// ─── REVIEW COMPONENTS ────────────────────────────────────────────────────────

function StarDisplay({ rating, size = 14 }) {
  return (
    <span style={{ display: "inline-flex", gap: 1 }}>
      {[1,2,3,4,5].map(i => {
        const filled = rating >= i;
        const half = !filled && rating >= i - 0.5;
        return (
          <span key={i} style={{ fontSize: size, lineHeight: 1 }}>
            {filled ? "⭐" : half ? "✨" : <span style={{ opacity: 0.25 }}>⭐</span>}
          </span>
        );
      })}
    </span>
  );
}

function ReviewCard({ review, canReply, onReply }) {
  const [replying, setReplying] = useState(false);
  const [replyText, setReplyText] = useState(review.response || "");
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    if (!replyText.trim()) return;
    onReply(review.id, replyText.trim());
    setSaved(true);
    setReplying(false);
  };

  return (
    <div className="rev-card">
      <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
        <div className="rev-avatar">
          {review.reviewerPhoto
            ? <img src={review.reviewerPhoto} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            : <span>{review.reviewerName.slice(0, 2).toUpperCase()}</span>}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 3 }}>
            <span style={{ fontFamily: "Plus Jakarta Sans", fontSize: 13, fontWeight: 600, color: "var(--tf-text,#1A1A1A)" }}>{review.reviewerName}</span>
            <span style={{ fontFamily: "Plus Jakarta Sans", fontSize: 10, color: "var(--tf-muted,#bbb)" }}>{review.date}</span>
          </div>
          <div style={{ display: "flex", gap: 6, alignItems: "center", marginBottom: 5 }}>
            <StarDisplay rating={review.rating} size={12} />
            <span style={{ fontFamily: "Plus Jakarta Sans", fontSize: 11, color: "var(--tf-sub,#888)", fontStyle: "italic" }}>for {review.listingTitle}</span>
          </div>
          {review.text && <p style={{ fontFamily: "Plus Jakarta Sans", fontSize: 13, color: "var(--tf-sub,#555)", lineHeight: 1.55, margin: 0 }}>{review.text}</p>}

          {/* Owner response */}
          {(review.response || saved) && !replying && (
            <div className="rev-reply" style={{ marginTop: 10, borderRadius: 10, padding: "9px 12px", borderLeft: "3px solid #E85D3A" }}>
              <div style={{ fontFamily: "Plus Jakarta Sans", fontSize: 10, fontWeight: 700, color: "#E85D3A", marginBottom: 4, textTransform: "uppercase", letterSpacing: ".06em" }}>Response from {review.subjectName}</div>
              <p style={{ fontFamily: "Plus Jakarta Sans", fontSize: 12, color: "var(--tf-sub,#555)", lineHeight: 1.55, margin: 0 }}>{replyText || review.response}</p>
              {canReply && (
                <button onClick={() => setReplying(true)} style={{ background: "none", border: "none", fontFamily: "Plus Jakarta Sans", fontSize: 11, color: "#E85D3A", cursor: "pointer", padding: "4px 0 0", fontWeight: 600 }}>Edit reply</button>
              )}
            </div>
          )}

          {/* Reply input */}
          {canReply && replying && (
            <div style={{ marginTop: 10 }}>
              <textarea
                className="rev-reply-input"
                value={replyText}
                onChange={e => setReplyText(e.target.value)}
                placeholder="Write a public response to this review…"
                rows={3}
                style={{ width: "100%", borderRadius: 10, border: "1.5px solid var(--tf-input-border,#DDD8CE)", padding: "9px 12px", fontFamily: "Plus Jakarta Sans", fontSize: 12, lineHeight: 1.55, resize: "none", outline: "none", background: "var(--tf-input,#FDFCFA)", color: "var(--tf-text,#1A1A1A)" }}
              />
              <div style={{ display: "flex", gap: 8, marginTop: 6 }}>
                <button onClick={() => { setReplying(false); setReplyText(review.response || ""); }}
                  style={{ flex: 1, padding: "7px", borderRadius: 100, border: "1.5px solid var(--tf-border,#DDD8CE)", background: "none", fontFamily: "Plus Jakarta Sans", fontSize: 12, color: "var(--tf-muted,#888)", cursor: "pointer" }}>Cancel</button>
                <button onClick={handleSave} disabled={!replyText.trim()}
                  style={{ flex: 2, padding: "7px", borderRadius: 100, border: "none", background: "#E85D3A", fontFamily: "Plus Jakarta Sans", fontSize: 12, fontWeight: 600, color: "#fff", cursor: "pointer", opacity: replyText.trim() ? 1 : 0.4 }}>Post response</button>
              </div>
            </div>
          )}

          {/* Reply CTA when no response yet */}
          {canReply && !replying && !review.response && !saved && (
            <button onClick={() => setReplying(true)}
              style={{ marginTop: 8, background: "none", border: "none", fontFamily: "Plus Jakarta Sans", fontSize: 11, color: "#E85D3A", cursor: "pointer", padding: 0, fontWeight: 600 }}>+ Reply to this review</button>
          )}
        </div>
      </div>
    </div>
  );
}

function ReviewModal({ listing, onSubmit, onSkip }) {
  const [rating, setRating] = useState(0);
  const [hovered, setHovered] = useState(0);
  const [text, setText] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const labels = ["", "Poor", "Fair", "Good", "Great", "Excellent!"];
  const active = hovered || rating;

  const handleSubmit = () => {
    if (!rating) return;
    setSubmitted(true);
    setTimeout(() => onSubmit(rating, text), 500);
  };

  return (
    <div className="overlay" onClick={onSkip}>
      <div className="sheet" onClick={e => e.stopPropagation()} style={{ textAlign: "center" }}>
        <div style={{ width: 38, height: 4, background: "#E0DDD6", borderRadius: 100, margin: "0 auto 18px" }} />

        {!submitted ? (
          <>
            <div style={{ fontSize: 36, marginBottom: 6 }}>🤝</div>
            <div style={{ fontFamily: "'Instrument Serif',serif", fontSize: 20, color: "#1A1A1A", marginBottom: 5 }}>How did it go?</div>
            <p style={{ fontFamily: "Plus Jakarta Sans", fontSize: 13, color: "#888", marginBottom: 4, lineHeight: 1.6 }}>
              Rate your exchange with <strong style={{ color: "#1A1A1A" }}>{listing.name}</strong>
            </p>
            <p style={{ fontFamily: "Plus Jakarta Sans", fontSize: 12, color: "#aaa", marginBottom: 18 }}>{listing.title}</p>

            {/* Stars */}
            <div className="star-row">
              {[1,2,3,4,5].map(i => (
                <button key={i} className={`star-btn ${i <= active ? "lit" : ""}`}
                  onMouseEnter={() => setHovered(i)}
                  onMouseLeave={() => setHovered(0)}
                  onClick={() => setRating(i)}>
                  {i <= active ? "⭐" : "☆"}
                </button>
              ))}
            </div>

            {/* Label */}
            <div style={{ fontFamily: "Plus Jakarta Sans", fontSize: 14, fontWeight: 600, color: "#E85D3A", height: 22, marginBottom: 18, transition: "all .15s" }}>
              {active ? labels[active] : ""}
            </div>

            {/* Written review */}
            <textarea className="inp" style={{ textAlign: "left", minHeight: 90 }}
              placeholder="Share a few words about the experience — was the person reliable, was the quality good? (optional)"
              value={text} onChange={e => setText(e.target.value)} />

            <button className="bp" style={{ marginTop: 14, marginBottom: 9 }} disabled={!rating} onClick={handleSubmit}>
              Submit Review ⭐
            </button>
            <button className="bg" onClick={onSkip}>Maybe later</button>
          </>
        ) : (
          <div style={{ padding: "20px 0" }}>
            <div style={{ fontSize: 52, marginBottom: 14 }}>🌟</div>
            <div style={{ fontFamily: "'Instrument Serif',serif", fontSize: 22, color: "#1A1A1A" }}>Review submitted!</div>
            <p style={{ fontFamily: "Plus Jakarta Sans", fontSize: 13, color: "#888", marginTop: 8 }}>Thank you for helping build trust in the community.</p>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── AUTH GATE ────────────────────────────────────────────────────────────────

function OnboardingOverlay({ onDone }) {
  const [step, setStep] = useState(0);
  const slides = [
    {
      emoji: "🌿",
      title: "Welcome to Bartr",
      body: "A marketplace built on exchange. Trade your skills, time, and goods with people in your community — no cash required.",
      bg: "#1A1A1A",
      color: "#fff",
      sub: "#f0b8a0",
    },
    {
      emoji: "📋",
      title: "List what you offer",
      body: "Create a listing for any skill or item you can offer — cooking, design, repairs, produce, lessons, and more.",
      bg: "#F0EEE9",
      color: "#1A1A1A",
      sub: "#888",
    },
    {
      emoji: "🤝",
      title: "Propose a trade",
      body: "Find something you want, send an offer, and negotiate terms. A smart contract is generated automatically for both parties.",
      bg: "#F0EEE9",
      color: "#1A1A1A",
      sub: "#888",
    },
    {
      emoji: "✅",
      title: "Complete & review",
      body: "Once both sides are happy, mark the trade complete and leave a review. Build your reputation with every exchange.",
      bg: "#E85D3A",
      color: "#fff",
      sub: "rgba(255,255,255,.7)",
    },
  ];
  const s = slides[step];
  const isLast = step === slides.length - 1;

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 500, display: "flex", alignItems: "center", justifyContent: "center" }}>
      {/* Backdrop */}
      <div onClick={onDone} style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,.55)", backdropFilter: "blur(2px)" }} />
      {/* Modal card */}
      <div style={{ position: "relative", width: "min(100%, 480px)", maxHeight: "90vh", borderRadius: 24, overflow: "hidden", background: s.bg, transition: "background .4s", display: "flex", flexDirection: "column", boxShadow: "0 24px 80px rgba(0,0,0,.35)" }}>
      {/* Skip */}
      <div style={{ display: "flex", justifyContent: "flex-end", padding: "18px 22px 0" }}>
        <button onClick={onDone} style={{ background: "none", border: "none", fontFamily: "Plus Jakarta Sans", fontSize: 13, color: s.sub, cursor: "pointer", padding: 0 }}>Skip</button>
      </div>

      {/* Content */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "0 36px", textAlign: "center" }}>
        <div style={{ fontSize: 72, marginBottom: 28, lineHeight: 1 }}>{s.emoji}</div>
        <div style={{ fontFamily: "'Instrument Serif',serif", fontSize: 26, letterSpacing: "-0.01em", color: s.color, marginBottom: 16, lineHeight: 1.2 }}>{s.title}</div>
        <div style={{ fontFamily: "Plus Jakarta Sans", fontSize: 15, color: s.sub, lineHeight: 1.7, maxWidth: 300 }}>{s.body}</div>
      </div>

      {/* Dots + button */}
      <div style={{ padding: "0 28px 52px", display: "flex", flexDirection: "column", alignItems: "center", gap: 24 }}>
        <div style={{ display: "flex", gap: 7 }}>
          {slides.map((_, i) => (
            <div key={i} onClick={() => setStep(i)} style={{ width: i === step ? 20 : 7, height: 7, borderRadius: 100, background: i === step ? s.color : s.sub, transition: "all .3s", cursor: "pointer" }} />
          ))}
        </div>
        <button onClick={() => isLast ? onDone() : setStep(step + 1)} style={{ width: "100%", background: s.color, color: s.bg, border: "none", borderRadius: 100, padding: "15px", fontFamily: "Plus Jakarta Sans", fontSize: 15, fontWeight: 600, cursor: "pointer" }}>
          {isLast ? "Get started →" : "Next →"}
        </button>
      </div>
      </div>{/* /modal card */}
    </div>
  );
}

function AuthGate({ screen, setScreen, onAuth, onReferral }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [inviteCode, setInviteCode] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [resetSent, setResetSent] = useState(false);
  const [signupDone, setSignupDone] = useState(false);

  const reset = (s) => { setError(""); setEmail(""); setPassword(""); setConfirm(""); setInviteCode(""); setResetSent(false); setSignupDone(false); setScreen(s); };

  const handleSignIn = () => {
    setError("");
    if (!email || !password) { setError("Please fill in all fields."); return; }
    setLoading(true);
    setTimeout(() => {
      const res = authSignIn(email, password);
      setLoading(false);
      if (res.error) { setError(res.error); return; }
      onAuth(res.user);
    }, 700);
  };

  const handleSignUp = () => {
    setError("");
    if (!email || !password || !confirm) { setError("Please fill in all fields."); return; }
    if (password.length < 8) { setError("Password must be at least 8 characters."); return; }
    if (password !== confirm) { setError("Passwords don't match."); return; }
    if (!/\S+@\S+\.\S+/.test(email)) { setError("Please enter a valid email address."); return; }
    setLoading(true);
    setTimeout(() => {
      const res = authSignUp(email, password);
      setLoading(false);
      if (res.error) { setError(res.error); return; }
      if (inviteCode.trim()) { onReferral?.(inviteCode.trim().toUpperCase()); }
      setSignupDone(true);
    }, 700);
  };

  const handleReset = () => {
    setError("");
    if (!email) { setError("Enter your email address."); return; }
    setLoading(true);
    setTimeout(() => {
      const res = authResetPassword(email);
      setLoading(false);
      if (res.error) { setError(res.error); return; }
      setResetSent(true);
    }, 700);
  };

  const Eye = ({ show, toggle }) => (
    <button type="button" onClick={toggle} style={{ position: "absolute", right: 13, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#aaa", fontSize: 16, padding: 0 }}>
      {show ? "🙈" : "👁"}
    </button>
  );

  return (
    <div style={{ fontFamily: "Plus Jakarta Sans, sans-serif", background: "#F0EEE9", minHeight: "100vh", maxWidth: 720, margin: "0 auto", display: "flex", flexDirection: "column" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Plus+Jakarta+Sans:wght@300;400;500;600;700&display=swap');
        *{box-sizing:border-box;margin:0;padding:0}
        .a-inp{width:100%;padding:13px 44px 13px 15px;border:1.5px solid #DDD8CE;border-radius:13px;font-family:'Plus Jakarta Sans',sans-serif;font-size:14px;background:#FDFCFA;color:#1A1A1A;outline:none;transition:border .2s}
        .a-inp:focus{border-color:#E85D3A}
        .a-inp-plain{width:100%;padding:13px 15px;border:1.5px solid #DDD8CE;border-radius:13px;font-family:'Plus Jakarta Sans',sans-serif;font-size:14px;background:#FDFCFA;color:#1A1A1A;outline:none;transition:border .2s}
        .a-inp-plain:focus{border-color:#E85D3A}
        .a-btn{background:#1A1A1A;color:#F0EEE9;border:none;border-radius:100px;padding:15px;font-family:'Plus Jakarta Sans',sans-serif;font-size:15px;font-weight:600;cursor:pointer;width:100%;transition:all .2s;margin-top:4px}
        .a-btn:hover{background:#3D5040;transform:translateY(-1px)} .a-btn:disabled{opacity:.45;cursor:default;transform:none}
        .a-ghost{background:transparent;color:#1A1A1A;border:1.5px solid #DDD8CE;border-radius:100px;padding:13px;font-family:'Plus Jakarta Sans',sans-serif;font-size:14px;cursor:pointer;width:100%;transition:all .2s;display:flex;align-items:center;justify-content:center;gap:9px}
        .a-ghost:hover{border-color:#1A1A1A;background:#F0F0EC}
        .a-link{background:none;border:none;color:#E85D3A;font-family:'Plus Jakarta Sans',sans-serif;font-size:13px;cursor:pointer;text-decoration:underline;padding:0}
        .a-err{background:#FEE2E2;color:#DC2626;border-radius:12px;padding:10px 14px;font-family:'Plus Jakarta Sans',sans-serif;font-size:13px;margin-bottom:14px;line-height:1.4}
        .a-divider{display:flex;align-items:center;gap:12px;margin:18px 0}
        .a-divider::before,.a-divider::after{content:'';flex:1;height:1px;background:#E5E2DC}
        .a-divider span{font-family:'Plus Jakarta Sans',sans-serif;font-size:12px;color:#bbb}
        .inp-wrap{position:relative;margin-bottom:13px}
        @keyframes fadeUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
        .fade-up{animation:fadeUp .35s ease both}
      `}</style>

      {/* LANDING */}
      {screen === "landing" && (
        <div style={{ flex: 1, display: "flex", flexDirection: "column", padding: "0 28px 48px" }}>
          {/* Hero */}
          <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", paddingTop: 60 }}>
            <svg width="88" height="88" viewBox="0 0 96 96" style={{ marginBottom: 20 }}><circle cx="48" cy="48" r="44" fill="#1A1A1A"/><text x="22" y="68" fontFamily="Georgia,serif" fontSize="54" fontWeight="800" fill="white">B</text><line x1="58" y1="22" x2="73" y2="22" stroke="#E85D3A" strokeWidth="4" strokeLinecap="round"/><polygon points="80,22 70,17 70,27" fill="#E85D3A"/><line x1="80" y1="32" x2="65" y2="32" stroke="white" strokeWidth="4" strokeLinecap="round"/><polygon points="58,32 68,27 68,37" fill="white"/></svg>
            <h1 style={{ fontFamily: "'Instrument Serif',serif", fontSize: 30, letterSpacing: "-0.01em", color: "#1A1A1A", lineHeight: 1.15, marginBottom: 14 }}>
              Trade skills.<br />Exchange goods.<br /><span style={{ color: "#E85D3A" }}>Build community.</span>
            </h1>
            <p style={{ fontFamily: "Plus Jakarta Sans", fontSize: 14, color: "#777", lineHeight: 1.7, maxWidth: 300 }}>
              Barter your skills and goods with people in your community. No money needed — just trust and a fair exchange.
            </p>

            {/* Trust indicators */}
            <div style={{ display: "flex", gap: 20, marginTop: 28, marginBottom: 40 }}>
              {[["247", "Members"], ["1.2k", "Trades"], ["⭐ 4.9", "Avg rating"]].map(([n, l]) => (
                <div key={l} style={{ textAlign: "center" }}>
                  <div style={{ fontFamily: "'Instrument Serif',serif", fontSize: 18, color: "#1A1A1A" }}>{n}</div>
                  <div style={{ fontFamily: "Plus Jakarta Sans", fontSize: 10, color: "#aaa", marginTop: 2 }}>{l}</div>
                </div>
              ))}
            </div>
          </div>

          {/* CTA buttons */}
          <div style={{ display: "flex", flexDirection: "column", gap: 11 }}>
            <button className="a-btn" onClick={() => setScreen("signup")}>Create a free account</button>
            <button className="a-ghost" onClick={() => setScreen("signin")}>Sign in</button>
            <div style={{ textAlign: "center", marginTop: 6 }}>
              <span style={{ fontFamily: "Plus Jakarta Sans", fontSize: 11, color: "#bbb" }}>
                By continuing you agree to our{" "}
                <span style={{ color: "#E85D3A", cursor: "pointer" }}>Terms</span> &{" "}
                <span style={{ color: "#E85D3A", cursor: "pointer" }}>Privacy Policy</span>
              </span>
            </div>
          </div>
        </div>
      )}

      {/* SIGN IN */}
      {screen === "signin" && (
        <div style={{ flex: 1, padding: "48px 28px 40px" }} className="fade-up">
          <button onClick={() => reset("landing")} style={{ background: "none", border: "none", fontFamily: "Plus Jakarta Sans", fontSize: 14, color: "#888", cursor: "pointer", marginBottom: 28, padding: 0 }}>← Back</button>
          <h2 style={{ fontFamily: "'Instrument Serif',serif", fontSize: 26, letterSpacing: "-0.01em", color: "#1A1A1A", marginBottom: 6 }}>Welcome back</h2>
          <p style={{ fontFamily: "Plus Jakarta Sans", fontSize: 13, color: "#888", marginBottom: 28 }}>Sign in to your Bartr account.</p>

          {/* Social sign-in (mock) */}
          <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 4 }}>
            {[
              ["google",   "Continue with Google"],
              ["facebook", "Continue with Facebook"],
              ["apple",    "Continue with Apple"],
            ].map(([brand, label]) => (
              <button key={label} className="a-ghost" onClick={() => onAuth({ id: "social_" + Date.now(), email: "user@social.com", name: "Social User", verified: true })}
                style={{ fontFamily: "Plus Jakarta Sans", fontSize: 14, fontWeight: 500, gap: 10 }}>
                <AuthBrandIcon id={brand} size={20} />
                {label}
              </button>
            ))}
          </div>

          <div className="a-divider"><span>or sign in with email</span></div>

          {error && <div className="a-err">⚠️ {error}</div>}

          <div className="inp-wrap">
            <input className="a-inp-plain" type="email" placeholder="Email address" value={email} onChange={e => setEmail(e.target.value)} onKeyDown={e => e.key === "Enter" && handleSignIn()} />
          </div>
          <div className="inp-wrap">
            <input className={`a-inp`} type={showPass ? "text" : "password"} placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} onKeyDown={e => e.key === "Enter" && handleSignIn()} />
            <Eye show={showPass} toggle={() => setShowPass(p => !p)} />
          </div>

          <div style={{ textAlign: "right", marginBottom: 18, marginTop: -6 }}>
            <button className="a-link" onClick={() => reset("forgot")}>Forgot password?</button>
          </div>

          <button className="a-btn" onClick={handleSignIn} disabled={loading}>{loading ? "Signing in…" : "Sign in"}</button>

          <p style={{ fontFamily: "Plus Jakarta Sans", fontSize: 13, color: "#888", textAlign: "center", marginTop: 22 }}>
            Don't have an account?{" "}
            <button className="a-link" onClick={() => reset("signup")}>Sign up free</button>
          </p>

          <div style={{ background: "#F0F7F2", borderRadius: 12, padding: "10px 14px", marginTop: 22 }}>
            <p style={{ fontFamily: "Plus Jakarta Sans", fontSize: 11.5, color: "#E85D3A", fontWeight: 600, marginBottom: 2 }}>Demo account</p>
            <p style={{ fontFamily: "Plus Jakarta Sans", fontSize: 11, color: "#555" }}>Email: <strong>demo@bartr.app</strong> · Password: <strong>demo1234</strong></p>
          </div>
        </div>
      )}

      {/* SIGN UP */}
      {screen === "signup" && !signupDone && (
        <div style={{ flex: 1, padding: "48px 28px 40px" }} className="fade-up">
          <button onClick={() => reset("landing")} style={{ background: "none", border: "none", fontFamily: "Plus Jakarta Sans", fontSize: 14, color: "#888", cursor: "pointer", marginBottom: 28, padding: 0 }}>← Back</button>
          <h2 style={{ fontFamily: "'Instrument Serif',serif", fontSize: 26, letterSpacing: "-0.01em", color: "#1A1A1A", marginBottom: 6 }}>Create account</h2>
          <p style={{ fontFamily: "Plus Jakarta Sans", fontSize: 13, color: "#888", marginBottom: 24 }}>Join Bartr — it's free.</p>

          {/* Social sign-up */}
          <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 4 }}>
            {[
              ["google",   "Continue with Google"],
              ["facebook", "Continue with Facebook"],
              ["apple",    "Continue with Apple"],
            ].map(([brand, label]) => (
              <button key={label} className="a-ghost" onClick={() => onAuth({ id: "social_" + Date.now(), email: "user@social.com", name: "Social User", verified: true })}
                style={{ fontFamily: "Plus Jakarta Sans", fontSize: 14, fontWeight: 500, gap: 10 }}>
                <AuthBrandIcon id={brand} size={20} />
                {label}
              </button>
            ))}
          </div>

          <div className="a-divider"><span>or sign up with email</span></div>

          {error && <div className="a-err">⚠️ {error}</div>}

          <div className="inp-wrap">
            <input className="a-inp-plain" type="email" placeholder="Email address" value={email} onChange={e => setEmail(e.target.value)} />
          </div>
          <div className="inp-wrap">
            <input className="a-inp" type={showPass ? "text" : "password"} placeholder="Password (min. 8 characters)" value={password} onChange={e => setPassword(e.target.value)} />
            <Eye show={showPass} toggle={() => setShowPass(p => !p)} />
          </div>
          <div className="inp-wrap" style={{ marginBottom: 6 }}>
            <input className="a-inp" type={showConfirm ? "text" : "password"} placeholder="Confirm password" value={confirm} onChange={e => setConfirm(e.target.value)} onKeyDown={e => e.key === "Enter" && handleSignUp()} />
            <Eye show={showConfirm} toggle={() => setShowConfirm(p => !p)} />
          </div>

          {/* Invite code */}
          <div className="inp-wrap" style={{ marginBottom: 6 }}>
            <input className="a-inp-plain" type="text" placeholder="Invite code (optional)" value={inviteCode} onChange={e => setInviteCode(e.target.value.toUpperCase())} style={{ letterSpacing: inviteCode ? ".08em" : 0, fontWeight: inviteCode ? 600 : 400 }} />
            {inviteCode && <span style={{ position: "absolute", right: 13, top: "50%", transform: "translateY(-50%)", fontSize: 14 }}>🎟️</span>}
          </div>

          {/* Password strength indicator */}
          {password.length > 0 && (
            <div style={{ marginBottom: 18 }}>
              <div style={{ display: "flex", gap: 4, marginBottom: 4 }}>
                {[1,2,3,4].map(i => (
                  <div key={i} style={{ flex: 1, height: 3, borderRadius: 100, background: password.length >= i * 3 ? (password.length >= 12 ? "#E85D3A" : password.length >= 8 ? "#F0B429" : "#EF4444") : "#E5E2DC" }} />
                ))}
              </div>
              <div style={{ fontFamily: "Plus Jakarta Sans", fontSize: 11, color: "#aaa" }}>
                {password.length < 8 ? "Too short" : password.length < 12 ? "Fair — consider a longer password" : "Strong password ✓"}
              </div>
            </div>
          )}

          <button className="a-btn" onClick={handleSignUp} disabled={loading}>{loading ? "Creating account…" : "Create account"}</button>

          <p style={{ fontFamily: "Plus Jakarta Sans", fontSize: 11, color: "#bbb", textAlign: "center", marginTop: 14, lineHeight: 1.6 }}>
            By signing up you agree to our <span style={{ color: "#E85D3A", cursor: "pointer" }}>Terms of Service</span> and <span style={{ color: "#E85D3A", cursor: "pointer" }}>Privacy Policy</span>.
          </p>

          <p style={{ fontFamily: "Plus Jakarta Sans", fontSize: 13, color: "#888", textAlign: "center", marginTop: 20 }}>
            Already have an account?{" "}
            <button className="a-link" onClick={() => reset("signin")}>Sign in</button>
          </p>
        </div>
      )}

      {/* EMAIL VERIFY (post sign-up) */}
      {screen === "signup" && signupDone && (
        <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "40px 28px", textAlign: "center" }} className="fade-up">
          <div style={{ fontSize: 56, marginBottom: 18 }}>📬</div>
          <h2 style={{ fontFamily: "'Instrument Serif',serif", fontSize: 26, letterSpacing: "-0.01em", color: "#1A1A1A", marginBottom: 10 }}>Check your email</h2>
          <p style={{ fontFamily: "Plus Jakarta Sans", fontSize: 14, color: "#777", lineHeight: 1.7, marginBottom: 28 }}>
            We've sent a verification link to <strong style={{ color: "#1A1A1A" }}>{email}</strong>. Click the link to activate your account.
          </p>
          <div style={{ background: "#F0F7F2", borderRadius: 14, padding: "14px 18px", marginBottom: 28, width: "100%" }}>
            <p style={{ fontFamily: "Plus Jakarta Sans", fontSize: 12, color: "#E85D3A", lineHeight: 1.6 }}>
              In this demo, email verification is simulated. Click below to continue as if you've verified.
            </p>
          </div>
          <button className="a-btn" onClick={() => {
            const user = _userStore.find(u => u.email.toLowerCase() === email.toLowerCase());
            if (user) { user.verified = true; onAuth(user); }
          }}>Continue to Bartr →</button>
          <button style={{ background: "none", border: "none", fontFamily: "Plus Jakarta Sans", fontSize: 13, color: "#aaa", cursor: "pointer", marginTop: 16 }} onClick={() => reset("signin")}>Back to sign in</button>
        </div>
      )}

      {/* FORGOT PASSWORD */}
      {screen === "forgot" && (
        <div style={{ flex: 1, padding: "48px 28px 40px" }} className="fade-up">
          <button onClick={() => reset("signin")} style={{ background: "none", border: "none", fontFamily: "Plus Jakarta Sans", fontSize: 14, color: "#888", cursor: "pointer", marginBottom: 28, padding: 0 }}>← Back to sign in</button>

          {!resetSent ? (
            <>
              <h2 style={{ fontFamily: "'Instrument Serif',serif", fontSize: 26, letterSpacing: "-0.01em", color: "#1A1A1A", marginBottom: 6 }}>Reset password</h2>
              <p style={{ fontFamily: "Plus Jakarta Sans", fontSize: 13, color: "#888", marginBottom: 28, lineHeight: 1.6 }}>Enter the email address linked to your account and we'll send you a reset link.</p>
              {error && <div className="a-err">⚠️ {error}</div>}
              <div className="inp-wrap">
                <input className="a-inp-plain" type="email" placeholder="Email address" value={email} onChange={e => setEmail(e.target.value)} onKeyDown={e => e.key === "Enter" && handleReset()} />
              </div>
              <button className="a-btn" onClick={handleReset} disabled={loading}>{loading ? "Sending…" : "Send reset link"}</button>
            </>
          ) : (
            <div style={{ textAlign: "center", paddingTop: 40 }} className="fade-up">
              <div style={{ fontSize: 52, marginBottom: 16 }}>✉️</div>
              <h2 style={{ fontFamily: "'Instrument Serif',serif", fontSize: 24, color: "#1A1A1A", marginBottom: 10 }}>Reset link sent</h2>
              <p style={{ fontFamily: "Plus Jakarta Sans", fontSize: 14, color: "#777", lineHeight: 1.7, marginBottom: 28 }}>
                Check <strong style={{ color: "#1A1A1A" }}>{email}</strong> for a password reset link. It expires in 15 minutes.
              </p>
              <button className="a-btn" onClick={() => reset("signin")}>Back to sign in</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─── SKILL TAG INPUT ─────────────────────────────────────────────────────────

function SkillTagInput({ skills, onChange, placeholder }) {
  const [input, setInput] = useState("");
  const addSkill = () => {
    const val = input.trim();
    if (!val || skills.includes(val)) { setInput(""); return; }
    onChange([...skills, val]);
    setInput("");
  };
  return (
    <div style={{ marginBottom: 14 }}>
      <label style={{ fontFamily: "Plus Jakarta Sans", fontSize: 11, fontWeight: 600, color: "#555", display: "block", marginBottom: 5, letterSpacing: ".05em" }}>
        SKILLS & OFFERINGS <span style={{ fontWeight: 400, color: "#aaa" }}>(optional)</span>
      </label>
      <div style={{ display: "flex", gap: 7 }}>
        <input className="inp" placeholder={placeholder || "Type a skill and press Add"} value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => { if (e.key === "Enter") { e.preventDefault(); addSkill(); } }} />
        <button onClick={addSkill} style={{ padding: "0 16px", borderRadius: 12, border: "none", background: "#1A1A1A", color: "#fff", fontFamily: "Plus Jakarta Sans", fontSize: 13, cursor: "pointer", whiteSpace: "nowrap", flexShrink: 0 }}>Add</button>
      </div>
      {skills.length > 0 && (
        <div className="skill-wrap" style={{ marginTop: 10 }}>
          {skills.map((s, i) => (
            <span key={i} className="skill-tag">
              {s}
              <button className="rm" onClick={() => onChange(skills.filter((_, j) => j !== i))}>×</button>
            </span>
          ))}
        </div>
      )}
      <div style={{ fontFamily: "Plus Jakarta Sans", fontSize: 11, color: "#aaa", marginTop: 5 }}>Press Enter or tap Add after each skill.</div>
    </div>
  );
}

// ─── PRICING SHEET ───────────────────────────────────────────────────────────

function PricingSheet({ mode, membership, onUpgrade, onVerify, onClose }) {
  const [cycle, setCycle] = useState("yearly");
  const [checkoutPlan, setCheckoutPlan] = useState(null); // null | "pro" | "verify"

  if (checkoutPlan) {
    return (
      <MockCheckout
        item={checkoutPlan === "verify"
          ? { name: "Identity Verification", price: "4.99", desc: "One-time payment — Verified badge on your profile" }
          : { name: "Bartr Pro", price: cycle === "yearly" ? "99.00" : "12.00", desc: cycle === "yearly" ? "Billed annually — save 31%" : "Billed monthly" }
        }
        onSuccess={() => {
          if (checkoutPlan === "verify") onVerify();
          else onUpgrade("pro", cycle);
        }}
        onCancel={() => setCheckoutPlan(null)}
      />
    );
  }

  return (
    <div className="overlay" onClick={onClose}>
      <div className="sheet" onClick={e => e.stopPropagation()} style={{ padding: "22px 20px 32px", overflowY: "auto", maxHeight: "90vh" }}>
        <div style={{ width: 38, height: 4, background: "#E0DDD6", borderRadius: 100, margin: "0 auto 18px" }} />

        {mode === "verify" ? (
          /* ── VERIFY MODE ── */
          <>
            <div style={{ textAlign: "center", marginBottom: 22 }}>
              <div style={{ fontSize: 42, marginBottom: 10 }}>🪪</div>
              <div style={{ fontFamily: "'Instrument Serif',serif", fontSize: 22, color: "#1A1A1A" }}>Get Verified</div>
              <div style={{ fontFamily: "Plus Jakarta Sans", fontSize: 14, color: "#777", marginTop: 6, lineHeight: 1.6 }}>A one-time identity check adds a verified badge to your profile — building trust with every listing.</div>
            </div>
            <div style={{ background: "#F7FDF9", border: "1.5px solid #BBF7D0", borderRadius: 16, padding: 16, marginBottom: 20 }}>
              {["✓ Verified badge on your public profile", "✓ Higher match priority in AI search", "✓ More trust for childcare & home access trades", "✓ Powered by secure identity verification"].map(f => (
                <div key={f} className="price-feat">{f}</div>
              ))}
            </div>
            <div style={{ textAlign: "center", marginBottom: 18 }}>
              <span style={{ fontFamily: "'Instrument Serif',serif", fontSize: 32, color: "#1A1A1A" }}>$4.99</span>
              <span style={{ fontFamily: "Plus Jakarta Sans", fontSize: 14, color: "#aaa", marginLeft: 6 }}>one-time</span>
            </div>
            <button className="bgr" onClick={() => setCheckoutPlan("verify")} style={{ background: "#D97706" }}>Continue to payment →</button>
            <button className="bg" style={{ marginTop: 10 }} onClick={onClose}>Not now</button>
          </>
        ) : (
          /* ── UPGRADE MODE ── */
          <>
            <div style={{ textAlign: "center", marginBottom: 18 }}>
              <div style={{ fontFamily: "'Instrument Serif',serif", fontSize: 22, color: "#1A1A1A" }}>Upgrade to Pro</div>
              <div style={{ fontFamily: "Plus Jakarta Sans", fontSize: 13, color: "#888", marginTop: 5 }}>Everything you need to trade professionally.</div>
            </div>

            {/* Billing toggle */}
            <div style={{ display: "flex", justifyContent: "center", marginBottom: 20 }}>
              <div className="bill-toggle">
                <button className={`bill-btn ${cycle === "monthly" ? "on" : ""}`} onClick={() => setCycle("monthly")}>Monthly</button>
                <button className={`bill-btn ${cycle === "yearly" ? "on" : ""}`} onClick={() => setCycle("yearly")}>
                  Yearly <span style={{ background: "#E85D3A", color: "#fff", borderRadius: 100, padding: "1px 7px", fontSize: 10, marginLeft: 4, fontWeight: 700 }}>Save 31%</span>
                </button>
              </div>
            </div>

            {/* Plan cards */}
            <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 22 }}>
              {/* Free card */}
              <div className={`price-card ${membership.plan === "free" ? "highlight" : ""}`} style={{ borderColor: membership.plan === "free" ? "#E85D3A" : "#E5E2DC" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                  <div>
                    <div style={{ fontFamily: "Plus Jakarta Sans", fontSize: 15, fontWeight: 700, color: "#1A1A1A" }}>Free</div>
                    <div style={{ fontFamily: "Plus Jakarta Sans", fontSize: 11, color: "#aaa" }}>Forever free</div>
                  </div>
                  <div style={{ fontFamily: "'Instrument Serif',serif", fontSize: 26, color: "#1A1A1A" }}>$0</div>
                </div>
                {PLANS.free.features.map(f => <div key={f} className="price-feat">✓ {f}</div>)}
                {PLANS.free.missing.map(f => <div key={f} className="price-feat missing">✗ {f}</div>)}
                {membership.plan === "free" && <div style={{ fontFamily: "Plus Jakarta Sans", fontSize: 12, color: "#E85D3A", fontWeight: 600, marginTop: 10, textAlign: "center" }}>✓ Current plan</div>}
              </div>

              {/* Pro card */}
              <div className="price-card highlight">
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                      <div style={{ fontFamily: "Plus Jakarta Sans", fontSize: 15, fontWeight: 700, color: "#1A1A1A" }}>Pro</div>
                      <span style={{ background: "#E85D3A", color: "#fff", borderRadius: 100, padding: "2px 9px", fontSize: 10, fontFamily: "Plus Jakarta Sans", fontWeight: 700 }}>RECOMMENDED</span>
                    </div>
                    <div style={{ fontFamily: "Plus Jakarta Sans", fontSize: 11, color: "#aaa", marginTop: 2 }}>
                      {cycle === "yearly" ? "Billed annually — $8.25/mo" : "Billed monthly"}
                    </div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontFamily: "'Instrument Serif',serif", fontSize: 26, color: "#1A1A1A" }}>
                      ${cycle === "yearly" ? "99" : "12"}
                    </div>
                    <div style={{ fontFamily: "Plus Jakarta Sans", fontSize: 10, color: "#aaa" }}>{cycle === "yearly" ? "/ year" : "/ month"}</div>
                  </div>
                </div>
                {PLANS.pro.features.map(f => <div key={f} className="price-feat" style={{ color: "#1A1A1A" }}>✓ {f}</div>)}
                {membership.plan === "pro"
                  ? <div style={{ fontFamily: "Plus Jakarta Sans", fontSize: 12, color: "#E85D3A", fontWeight: 600, marginTop: 12, textAlign: "center" }}>✓ Current plan</div>
                  : <button className="bgr" style={{ marginTop: 14 }} onClick={() => setCheckoutPlan("pro")}>Get Pro — ${cycle === "yearly" ? "99/yr" : "$12/mo"} →</button>
                }
              </div>
            </div>

            <button className="bg" onClick={onClose}>Maybe later</button>
          </>
        )}
      </div>
    </div>
  );
}

function MockCheckout({ item, onSuccess, onCancel }) {
  const [cardNum, setCardNum] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvc, setCvc] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const formatCard = v => v.replace(/\D/g, "").slice(0, 16).replace(/(.{4})/g, "$1 ").trim();
  const formatExpiry = v => { const d = v.replace(/\D/g, "").slice(0, 4); return d.length > 2 ? d.slice(0,2) + "/" + d.slice(2) : d; };
  const valid = cardNum.replace(/\s/g,"").length === 16 && expiry.length === 5 && cvc.length >= 3 && name.trim().length > 1;

  const pay = () => {
    if (!valid) return;
    setLoading(true);
    setTimeout(() => { setLoading(false); setDone(true); setTimeout(onSuccess, 1400); }, 1800);
  };

  if (done) return (
    <div className="overlay">
      <div className="sheet" style={{ padding: "40px 28px", textAlign: "center" }}>
        <div style={{ fontSize: 52, marginBottom: 14 }}>✅</div>
        <div style={{ fontFamily: "'Instrument Serif',serif", fontSize: 22, color: "#1A1A1A", marginBottom: 8 }}>Payment successful</div>
        <div style={{ fontFamily: "Plus Jakarta Sans", fontSize: 14, color: "#888" }}>Setting up your account…</div>
      </div>
    </div>
  );

  return (
    <div className="overlay" onClick={onCancel}>
      <div className="sheet" onClick={e => e.stopPropagation()} style={{ padding: "22px 22px 32px" }}>
        <div style={{ width: 38, height: 4, background: "#E0DDD6", borderRadius: 100, margin: "0 auto 18px" }} />
        {/* Stripe-style header */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20, padding: "12px 14px", background: "#F0EEE9", borderRadius: 13 }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: "Plus Jakarta Sans", fontSize: 13, fontWeight: 600, color: "#1A1A1A" }}>{item.name}</div>
            <div style={{ fontFamily: "Plus Jakarta Sans", fontSize: 11, color: "#888", marginTop: 2 }}>{item.desc}</div>
          </div>
          <div style={{ fontFamily: "'Instrument Serif',serif", fontSize: 20, color: "#1A1A1A" }}>${item.price}</div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 16 }}>
          <div style={{ flex: 1, height: 1, background: "#E5E2DC" }} />
          <span style={{ fontFamily: "Plus Jakarta Sans", fontSize: 11, color: "#aaa" }}>🔒 Secure payment via Stripe</span>
          <div style={{ flex: 1, height: 1, background: "#E5E2DC" }} />
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 11 }}>
          <div>
            <label style={{ fontFamily: "Plus Jakarta Sans", fontSize: 11, fontWeight: 600, color: "#555", display: "block", marginBottom: 5 }}>CARDHOLDER NAME</label>
            <input className="stripe-field" placeholder="Jane Smith" value={name} onChange={e => setName(e.target.value)} />
          </div>
          <div>
            <label style={{ fontFamily: "Plus Jakarta Sans", fontSize: 11, fontWeight: 600, color: "#555", display: "block", marginBottom: 5 }}>CARD NUMBER</label>
            <input className="stripe-field" placeholder="1234 5678 9012 3456" value={cardNum} onChange={e => setCardNum(formatCard(e.target.value))} inputMode="numeric" />
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <div style={{ flex: 1 }}>
              <label style={{ fontFamily: "Plus Jakarta Sans", fontSize: 11, fontWeight: 600, color: "#555", display: "block", marginBottom: 5 }}>EXPIRY</label>
              <input className="stripe-field" placeholder="MM/YY" value={expiry} onChange={e => setExpiry(formatExpiry(e.target.value))} inputMode="numeric" />
            </div>
            <div style={{ width: 90 }}>
              <label style={{ fontFamily: "Plus Jakarta Sans", fontSize: 11, fontWeight: 600, color: "#555", display: "block", marginBottom: 5 }}>CVC</label>
              <input className="stripe-field" placeholder="123" value={cvc} onChange={e => setCvc(e.target.value.replace(/\D/g,"").slice(0,4))} inputMode="numeric" />
            </div>
          </div>
        </div>

        <button className="bgr" style={{ marginTop: 20, opacity: valid ? 1 : 0.5, background: valid ? undefined : "#aaa" }} onClick={pay} disabled={!valid || loading}>
          {loading
            ? <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                <span style={{ width: 16, height: 16, border: "2px solid rgba(255,255,255,.4)", borderTop: "2px solid #fff", borderRadius: "50%", display: "inline-block", animation: "spin .7s linear infinite" }} />
                Processing…
              </span>
            : `Pay $${item.price}`
          }
        </button>
        <button className="bg" style={{ marginTop: 10 }} onClick={onCancel}>Cancel</button>
        <div style={{ fontFamily: "Plus Jakarta Sans", fontSize: 10, color: "#ccc", textAlign: "center", marginTop: 12 }}>This is a demo. No real payment is processed.</div>
      </div>
    </div>
  );
}

// ─── MAP VIEW ────────────────────────────────────────────────────────────────

const MAP_NEIGHBOURHOODS = [
  { name: "Northside",    x: 22,  y: 14  },
  { name: "Midtown",      x: 118, y: 14  },
  { name: "Riverside",    x: 218, y: 14  },
  { name: "Oak Heights",  x: 298, y: 14  },
  { name: "West End",     x: 22,  y: 97  },
  { name: "Downtown",     x: 118, y: 97  },
  { name: "East Side",    x: 298, y: 97  },
  { name: "South Market", x: 22,  y: 182 },
  { name: "Arts District",x: 188, y: 182 },
  { name: "Harbourside",  x: 298, y: 182 },
];

function MapView({ listings, favorites, reported, onSelect, onFav, onReport, onBlock }) {
  const [pinSelected, setPinSelected] = useState(null);
  const [mapCat, setMapCat] = useState("all");
  const W = 390, H = 260;
  const hRoads = [75, 160];
  const vRoads = [95, 195, 285];
  const roadW = 13;
  const roadColor = "#F5F1E8";
  const blockColor = "#E9E5DC";

  // Filter by category
  const visiblePins = mapCat === "all" ? listings : listings.filter(l => l.category === mapCat);

  // Cluster: group pins within 32px of each other
  const CLUSTER_DIST = 32;
  const clustered = [];
  const assigned = new Set();
  visiblePins.forEach((l, i) => {
    if (assigned.has(i)) return;
    const pos = l.mapPos || { x: 50, y: 50 };
    const group = [l];
    assigned.add(i);
    visiblePins.forEach((m, j) => {
      if (i === j || assigned.has(j)) return;
      const mp = m.mapPos || { x: 50, y: 50 };
      if (Math.hypot(pos.x - mp.x, pos.y - mp.y) < CLUSTER_DIST) {
        group.push(m);
        assigned.add(j);
      }
    });
    clustered.push({ pos, group });
  });

  const selected = listings.find(l => l.id === pinSelected) || null;
  const selCluster = pinSelected ? clustered.find(c => c.group.some(l => l.id === pinSelected)) : null;

  // Category counts for chips
  const catCounts = {};
  listings.forEach(l => { catCounts[l.category] = (catCounts[l.category] || 0) + 1; });
  const usedCats = CATEGORIES.filter(c => catCounts[c.id]);

  return (
    <div style={{ marginBottom: 16 }}>
      {/* Category filter chips */}
      {usedCats.length > 1 && (
        <div style={{ display: "flex", gap: 7, overflowX: "auto", paddingBottom: 8, marginBottom: 8 }}>
          <button onClick={() => setMapCat("all")}
            style={{ flexShrink: 0, padding: "5px 13px", borderRadius: 100, border: `1.5px solid ${mapCat === "all" ? "#1A1A1A" : "var(--tf-border,#DDD8CE)"}`, background: mapCat === "all" ? "#1A1A1A" : "var(--tf-input,#FDFCFA)", fontFamily: "Plus Jakarta Sans", fontSize: 11, fontWeight: 600, color: mapCat === "all" ? "#fff" : "var(--tf-sub,#777)", cursor: "pointer" }}>
            All ({listings.length})
          </button>
          {usedCats.map(cat => (
            <button key={cat.id} onClick={() => setMapCat(mapCat === cat.id ? "all" : cat.id)}
              style={{ flexShrink: 0, padding: "5px 11px", borderRadius: 100, border: `1.5px solid ${mapCat === cat.id ? cat.color : "var(--tf-border,#DDD8CE)"}`, background: mapCat === cat.id ? cat.color + "18" : "var(--tf-input,#FDFCFA)", fontFamily: "Plus Jakarta Sans", fontSize: 11, fontWeight: 600, color: mapCat === cat.id ? cat.color : "var(--tf-sub,#777)", cursor: "pointer" }}>
              {cat.icon} {cat.label} ({catCounts[cat.id]})
            </button>
          ))}
        </div>
      )}

      <div style={{ borderRadius: 18, overflow: "hidden", border: "1.5px solid #DDD9D0", position: "relative" }}>
        <svg
          width="100%" viewBox={`0 0 ${W} ${H}`}
          style={{ display: "block", cursor: "default", userSelect: "none" }}
          onClick={() => setPinSelected(null)}
        >
          <rect width={W} height={H} fill={blockColor} />
          {hRoads.map(y => <rect key={`h${y}`} x={0} y={y - roadW/2} width={W} height={roadW} fill={roadColor} />)}
          {vRoads.map(x => <rect key={`v${x}`} x={x - roadW/2} y={0} width={roadW} height={H} fill={roadColor} />)}
          {hRoads.map(y => <line key={`hc${y}`} x1={0} y1={y} x2={W} y2={y} stroke="#DDD9D0" strokeWidth={1} strokeDasharray="10 8" />)}
          {vRoads.map(x => <line key={`vc${x}`} x1={x} y1={0} x2={x} y2={H} stroke="#DDD9D0" strokeWidth={1} strokeDasharray="10 8" />)}
          {MAP_NEIGHBOURHOODS.map(n => (
            <text key={n.name} x={n.x} y={n.y + 22} fontSize={8.5} fontFamily="Plus Jakarta Sans,sans-serif" fill="#B8B3A8" letterSpacing="0.04em">
              {n.name.toUpperCase()}
            </text>
          ))}

          {/* Clusters */}
          {clustered.map(({ pos, group }, ci) => {
            const isCluster = group.length > 1;
            const mainL = group[0];
            const cat = catOf(mainL.category);
            const isSel = group.some(l => l.id === pinSelected);
            const isFav = group.some(l => favorites.has(l.id));
            const R = isSel ? 18 : isCluster ? 16 : 14;
            const fill = isSel ? cat.color : isCluster ? "#1A1A1A" : "#fff";
            const textColor = isSel || isCluster ? "#fff" : cat.color;
            return (
              <g key={ci} style={{ cursor: "pointer" }}
                onClick={e => { e.stopPropagation(); setPinSelected(isSel ? null : mainL.id); }}>
                {isSel && <circle cx={pos.x} cy={pos.y} r={26} fill="none" stroke={cat.color} strokeWidth={2} opacity={0.35} />}
                <circle cx={pos.x + 1} cy={pos.y + 2} r={R} fill="rgba(0,0,0,0.18)" />
                <circle cx={pos.x} cy={pos.y} r={R} fill={fill} stroke={isCluster && !isSel ? "#1A1A1A" : cat.color} strokeWidth={isSel ? 0 : 2.5} />
                <text x={pos.x} y={pos.y + 1} textAnchor="middle" dominantBaseline="middle"
                  fontSize={isSel ? 9 : isCluster ? 10 : 8} fontFamily="Plus Jakarta Sans,sans-serif" fontWeight="700"
                  fill={textColor}>
                  {isCluster ? group.length : mainL.avatar}
                </text>
                {isFav && !isCluster && <circle cx={pos.x + R - 3} cy={pos.y - R + 3} r={4} fill="#E85C7A" stroke="#fff" strokeWidth={1.5} />}
              </g>
            );
          })}
        </svg>

        {/* Pin popup */}
        {selected && (
          <div className="map-popup" onClick={e => e.stopPropagation()}>
            {/* If cluster has multiple, show a mini-list */}
            {selCluster && selCluster.group.length > 1 && (
              <div style={{ marginBottom: 10 }}>
                <div style={{ fontFamily: "Plus Jakarta Sans", fontSize: 10, fontWeight: 700, color: "var(--tf-muted,#aaa)", letterSpacing: ".06em", marginBottom: 6 }}>
                  {selCluster.group.length} LISTINGS HERE
                </div>
                <div style={{ display: "flex", gap: 7, flexWrap: "wrap" }}>
                  {selCluster.group.map(l => (
                    <button key={l.id} onClick={() => setPinSelected(l.id)}
                      style={{ padding: "4px 10px", borderRadius: 100, border: `1.5px solid ${l.id === pinSelected ? "#E85D3A" : "var(--tf-border,#DDD8CE)"}`, background: l.id === pinSelected ? "#E8F5EC" : "var(--tf-input,#FDFCFA)", fontFamily: "Plus Jakarta Sans", fontSize: 11, fontWeight: 600, color: l.id === pinSelected ? "#2D6A4F" : "var(--tf-sub,#777)", cursor: "pointer" }}>
                      {l.title.length > 16 ? l.title.slice(0,16)+"…" : l.title}
                    </button>
                  ))}
                </div>
                <div style={{ height: 1, background: "var(--tf-border,#F0EDE6)", margin: "10px 0 6px" }} />
              </div>
            )}
            <div style={{ display: "flex", gap: 11, alignItems: "flex-start" }}>
              {selected.photos?.[0]
                ? <img src={selected.photos[0]} alt="" style={{ width: 52, height: 52, borderRadius: 12, objectFit: "cover", flexShrink: 0 }} />
                : <div className="ava" style={{ width: 52, height: 52, borderRadius: catOf(selected.category).id === "business" ? 12 : "50%", background: catOf(selected.category).color, fontSize: 15, flexShrink: 0 }}>{selected.avatar}</div>
              }
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontFamily: "'Instrument Serif',serif", fontSize: 14, color: "#1A1A1A", lineHeight: 1.25 }}>{selected.title}</div>
                <div style={{ fontFamily: "Plus Jakarta Sans", fontSize: 12, color: "#888", marginTop: 2 }}>{selected.businessName || selected.name}</div>
                <div style={{ display: "flex", gap: 5, marginTop: 5, flexWrap: "wrap" }}>
                  <span className="nbhd-badge">📍 {selected.neighbourhood}</span>
                  {selected.rating && <span style={{ background: "#F0EEE9", color: "#888", padding: "2px 8px", borderRadius: 100, fontSize: 10, fontFamily: "Plus Jakarta Sans" }}>⭐ {selected.rating}</span>}
                </div>
              </div>
              <button onClick={() => setPinSelected(null)} style={{ background: "none", border: "none", cursor: "pointer", color: "#bbb", fontSize: 18, padding: 0, lineHeight: 1, flexShrink: 0 }}>✕</button>
            </div>
            <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
              <button onClick={() => { setPinSelected(null); onSelect(selected); }}
                style={{ flex: 1, padding: "9px 0", borderRadius: 100, border: "none", background: "#1A1A1A", fontFamily: "Plus Jakarta Sans", fontSize: 12, fontWeight: 600, color: "#fff", cursor: "pointer" }}>
                View listing
              </button>
              <button onClick={() => onFav(selected)}
                style={{ width: 38, borderRadius: 100, border: `1.5px solid ${favorites.has(selected.id) ? "#E85C7A" : "#DDD8CE"}`, background: favorites.has(selected.id) ? "#FFF0F3" : "transparent", color: favorites.has(selected.id) ? "#E85C7A" : "#aaa", cursor: "pointer", fontSize: 16, display: "flex", alignItems: "center", justifyContent: "center" }}>
                {favorites.has(selected.id) ? "♥" : "♡"}
              </button>
            </div>
          </div>
        )}

        {visiblePins.length === 0 && (
          <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: "rgba(233,229,220,0.85)", borderRadius: 18, gap: 8 }}>
            <div style={{ fontSize: 28 }}>🗺️</div>
            <div style={{ fontFamily: "Plus Jakarta Sans", fontSize: 13, color: "#888" }}>No {mapCat !== "all" ? catOf(mapCat).label + " " : ""}listings in this area</div>
          </div>
        )}
      </div>

      {/* Legend */}
      <div style={{ display: "flex", gap: 14, marginTop: 8, paddingLeft: 2 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 5, fontFamily: "Plus Jakarta Sans", fontSize: 10.5, color: "var(--tf-muted,#aaa)" }}>
          <div style={{ width: 16, height: 16, borderRadius: "50%", background: "#1A1A1A", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 8, fontWeight: 700 }}>3</div>
          Cluster
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 5, fontFamily: "Plus Jakarta Sans", fontSize: 10.5, color: "var(--tf-muted,#aaa)" }}>
          <div style={{ width: 16, height: 16, borderRadius: "50%", background: "#FFF0F3", border: "1.5px solid #E85C7A", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 8 }}>♥</div>
          Saved
        </div>
      </div>
    </div>
  );
}

function ListingCard({ listing, onClick, isFav, onFav, onReport, onBlock, isReported, isBoosted }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const cat = catOf(listing.category);
  const isBiz = listing.accountType === "business";
  const cover = listing.photos?.[0];
  const showMenu = !listing.mine && (onFav || onReport || onBlock);
  const availDot = { open: "🟢", limited: "🟡", closed: "🔴" }[listing.availability];

  const handleMenu = (e) => { e.stopPropagation(); setMenuOpen(o => !o); };
  const closeMenu = (e) => { e.stopPropagation(); setMenuOpen(false); };

  return (
    <div className="card" onClick={onClick} style={{ position: "relative", padding: cover ? 0 : undefined, overflow: "hidden" }}>

      {/* ··· context menu trigger */}
      {showMenu && (
        <div style={{ position: "absolute", top: 0, right: 0, zIndex: 10 }} onClick={e => e.stopPropagation()}>
          <button className="ctx-btn" onClick={handleMenu} title="More options">···</button>
          {menuOpen && (
            <>
              {/* backdrop to close */}
              <div style={{ position: "fixed", inset: 0, zIndex: 99 }} onClick={closeMenu} />
              <div className="ctx-menu">
                <button className="ctx-item" onClick={(e) => { closeMenu(e); onFav && onFav(listing); }}>
                  <span style={{ fontSize: 16 }}>{isFav ? "💔" : "♡"}</span>
                  <span style={{ fontFamily: "Plus Jakarta Sans", fontWeight: 500, color: isFav ? "#E85C7A" : "#1A1A1A" }}>{isFav ? "Remove from saved" : "Save listing"}</span>
                </button>
                <button className="ctx-item" onClick={(e) => { closeMenu(e); onReport && onReport(listing); }} style={{ opacity: isReported ? 0.5 : 1 }} disabled={isReported}>
                  <span style={{ fontSize: 16 }}>🚩</span>
                  <span style={{ fontFamily: "Plus Jakarta Sans", fontWeight: 500, color: "#1A1A1A" }}>{isReported ? "Already reported" : "Report listing"}</span>
                </button>
                <div style={{ height: 1, background: "#F0EDE6", margin: "2px 0" }} />
                <button className="ctx-item danger" onClick={(e) => { closeMenu(e); onBlock && onBlock(listing); }}>
                  <span style={{ fontSize: 16 }}>🚫</span>
                  <span style={{ fontFamily: "Plus Jakarta Sans", fontWeight: 500 }}>Block account</span>
                </button>
              </div>
            </>
          )}
        </div>
      )}

      {cover && (
        <div style={{ position: "relative", height: 148, background: "#E5E2DC" }}>
          <img src={cover} alt={listing.title} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(0,0,0,0) 40%, rgba(20,30,22,.72) 100%)" }} />
          {isFav && <span style={{ position: "absolute", top: 9, right: 44, fontSize: 13, color: "#FF8FAB" }}>♥</span>}
          {listing.photos?.length > 1 && (
            <span style={{ position: "absolute", top: 9, left: 11, background: "rgba(0,0,0,.45)", borderRadius: 100, padding: "2px 8px", fontFamily: "Plus Jakarta Sans", fontSize: 10, color: "#fff" }}>📷 {listing.photos.length}</span>
          )}
          <div style={{ position: "absolute", bottom: 10, left: 12, right: 12 }}>
            <div style={{ fontFamily: "'Instrument Serif',serif", fontSize: 14, color: "#fff", lineHeight: 1.25 }}>{listing.title}</div>
            <div style={{ fontFamily: "Plus Jakarta Sans", fontSize: 11, color: "rgba(255,255,255,.75)", marginTop: 2 }}>{isBiz ? listing.businessName : listing.name}</div>
          </div>
        </div>
      )}

      <div style={{ padding: cover ? "10px 14px 12px" : undefined, display: "flex", gap: cover ? 0 : 11, alignItems: "flex-start", flexDirection: cover ? "column" : "row" }}>
        {!cover && <div className="ava" style={{ width: 42, height: 42, borderRadius: isBiz ? "12px" : "50%", background: cat.color, fontSize: 13 }}>{listing.avatar}</div>}
        <div style={{ flex: 1, minWidth: 0 }}>
          {!cover && (
            <>
              <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap", paddingRight: showMenu ? 28 : 0 }}>
                <div style={{ fontFamily: "'Instrument Serif',serif", fontSize: 14, color: "#1A1A1A" }}>{listing.title}</div>
                {isBiz && <span className="biz-badge">🏢 Biz</span>}
              </div>
              <div style={{ fontFamily: "Plus Jakarta Sans", fontSize: 12, color: "#999", marginTop: 1 }}>{isBiz ? listing.businessName : listing.name}</div>
              {listing.desc && <div style={{ fontFamily: "Plus Jakarta Sans", fontSize: 12, color: "#777", marginTop: 4, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{listing.desc}</div>}
            </>
          )}
          <div style={{ display: "flex", gap: 5, marginTop: cover ? 0 : 7, flexWrap: "wrap" }}>
            <span style={{ background: cat.color + "20", color: cat.color, padding: "2px 8px", borderRadius: 100, fontSize: 10, fontFamily: "Plus Jakarta Sans" }}>{cat.icon} {cat.label}</span>
            {listing.rating && <span style={{ background: "#F0EEE9", color: "#888", padding: "2px 8px", borderRadius: 100, fontSize: 10, fontFamily: "Plus Jakarta Sans" }}>⭐ {listing.rating}{listing.reviewCount ? ` (${listing.reviewCount})` : ""}</span>}
            {isBiz && <span className="biz-badge">🏢 Biz</span>}
            {availDot && listing.availability !== "open" && <span style={{ background: "#F0EEE9", padding: "2px 8px", borderRadius: 100, fontSize: 10, fontFamily: "Plus Jakarta Sans", color: "#888" }}>{availDot} {listing.availability === "limited" ? "Limited" : "Closed"}</span>}
            {listing.mine && <span style={{ background: "#E8F5E9", color: "#E85D3A", padding: "2px 8px", borderRadius: 100, fontSize: 10, fontFamily: "Plus Jakarta Sans" }}>✓ Yours</span>}
            {isBoosted && <span style={{ background: "#FFF7ED", color: "#D97706", padding: "2px 8px", borderRadius: 100, fontSize: 10, fontFamily: "Plus Jakarta Sans", fontWeight: 700 }}>⚡ Boosted</span>}
            {!listing.mine && <ListingBadges listing={listing} />}
          </div>
        </div>
      </div>
    </div>
  );
}

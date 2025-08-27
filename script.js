// === CONFIGURA AQUÍ TUS DATOS ===
const PROFILE = {
  name: "Valentín Klint",
  title: "Emprendedor & Event Planner",
  location: "Palma de Mallorca, ES",

  // Enlaces (rellena con tus datos reales)
  instagramUser: "valentinklint",              // sin @
  phoneIntl: "+34 600 000 000",                // con + y espacios si quieres
  phoneE164: "34600000000",                    // solo números, sin + ni espacios (para WhatsApp y tel:)
  email: "hello@valentinklint.com",
  website: "https://valentinklint.com",

  // Mensaje por defecto para WhatsApp
  waMessage: "Hola%20Valent%C3%ADn%2C%20te%20contacto%20desde%20tu%20tarjeta%20digital.%20%F0%9F%91%8B",
};

// === No toques de aquí hacia abajo (a menos que quieras personalizar) ===
const $ = (sel) => document.querySelector(sel);

function setText(id, value){ const el = $(id); if(el) el.textContent = value; }

function buildLinks() {
  const ig = `https://instagram.com/${PROFILE.instagramUser}`;
  const wa = `https://wa.me/${PROFILE.phoneE164}?text=${PROFILE.waMessage}`;
  const mail = `mailto:${PROFILE.email}?subject=${encodeURIComponent("Contacto desde tu tarjeta")}&body=${encodeURIComponent("Hola Valentín, me gustaría...")}`;
  const tel = `tel:+${PROFILE.phoneE164}`;
  const web = PROFILE.website;

  const map = {
    "#btn-instagram": ig,
    "#btn-whatsapp": wa,
    "#btn-email": mail,
    "#btn-call": tel,
    "#btn-website": web,
  };

  for (const [sel, href] of Object.entries(map)) {
    const el = $(sel);
    if (!el) continue;
    if (el.tagName.toLowerCase() === "a") el.href = href;
    else if (el.tagName.toLowerCase() === "button") el.addEventListener("click", () => window.location.href = href);
  }
}

function fillProfile(){
  setText("#name", PROFILE.name);
  setText("#title", PROFILE.title);
  setText("#location", PROFILE.location);
  setText("#year", String(new Date().getFullYear()));
}

function downloadVCard(){
  // vCard 3.0 básico
  const lines = [
    "BEGIN:VCARD",
    "VERSION:3.0",
    `N:${PROFILE.name.split(" ").slice(-1)[0]};${PROFILE.name.split(" ").slice(0,-1).join(" ")};;;`,
    `FN:${PROFILE.name}`,
    `TITLE:${PROFILE.title}`,
    `TEL;TYPE=CELL,VOICE:${PROFILE.phoneIntl}`,
    `TEL;TYPE=CELL:${'+' + PROFILE.phoneE164}`,
    `EMAIL;TYPE=INTERNET:${PROFILE.email}`,
    `URL:${PROFILE.website}`,
    `ADR;TYPE=WORK:;;${PROFILE.location};;;;`,
    `X-SOCIALPROFILE;type=instagram:https://instagram.com/${PROFILE.instagramUser}`,
    "END:VCARD",
  ].join("\r\n");

  const blob = new Blob([lines], { type: "text/vcard;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${PROFILE.name.replace(/\s+/g, "_")}.vcf`;
  document.body.appendChild(a);
  a.click();
  URL.revokeObjectURL(url);
  a.remove();
}

function injectJSONLD(){
  const data = {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": PROFILE.name,
    "jobTitle": PROFILE.title,
    "address": { "@type": "PostalAddress", "addressLocality": PROFILE.location },
    "url": PROFILE.website,
    "email": `mailto:${PROFILE.email}`,
    "telephone": `+${PROFILE.phoneE164}`,
    "sameAs": [`https://instagram.com/${PROFILE.instagramUser}`]
  };
  const script = document.getElementById("person-jsonld");
  if (script) script.textContent = JSON.stringify(data);
}

function init(){
  fillProfile();
  buildLinks();
  injectJSONLD();
  const vcardBtn = document.getElementById("btn-vcard");
  if (vcardBtn) vcardBtn.addEventListener("click", downloadVCard);
}

document.addEventListener("DOMContentLoaded", init);

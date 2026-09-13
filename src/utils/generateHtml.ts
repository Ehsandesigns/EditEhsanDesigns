import type { ButtonItem, MessageOption, Project, SiteData } from "../types";
import { ICON_MARKUP } from "../data/icons";
import { buildVCardHref } from "./vcard";

function esc(value: string): string {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function attr(value: string): string {
  return esc(value).replace(/\n/g, "&#10;");
}

function slug(value: string): string {
  return (
    value
      .trim()
      .replace(/\s+/g, "-")
      .replace(/[^a-zA-Z0-9-]/g, "") || "file"
  );
}

function renderButton(button: ButtonItem, data: SiteData): string {
  const iconSpan = `<span class="icon"><svg><use href="#i-${button.icon}"></use></svg></span>`;
  const textSpan = `<span class="button-text">${esc(button.text)}</span>`;
  const cls = `button${button.primary ? " primary" : ""}`;

  switch (button.action) {
    case "call":
      return `<button class="${cls}" type="button" onclick="openModal('call-modal')">${iconSpan}${textSpan}</button>`;
    case "message":
      return `<button class="${cls}" type="button" onclick="openModal('message-modal')">${iconSpan}${textSpan}</button>`;
    case "portfolio":
      return `<button class="${cls}" type="button" onclick="openPortfolio()">${iconSpan}${textSpan}</button>`;
    case "mailto": {
      const subject = encodeURIComponent(data.email.subject || "");
      return `<a class="${cls}" href="mailto:${attr(data.email.address)}?subject=${subject}">${iconSpan}${textSpan}</a>`;
    }
    case "vcard": {
      const href = buildVCardHref(data.vcard, data.contacts);
      const filename = `${slug(data.vcard.firstName)}-${slug(data.vcard.lastName)}.vcf`;
      return `<a class="${cls}" href="${href}" download="${attr(filename)}">${iconSpan}${textSpan}</a>`;
    }
    case "link":
    default:
      return `<a class="${cls}" href="${attr(button.url || "#")}" target="_blank" rel="noopener noreferrer">${iconSpan}${textSpan}</a>`;
  }
}

function renderContactOption(label: string, number: string): string {
  return `<a class="contact-option" href="tel:${attr(number.replace(/\s+/g, ""))}">
        <span class="contact-label">${esc(label)}</span>
        <span class="contact-number">${esc(number)}</span>
      </a>`;
}

function renderMessageOption(option: MessageOption): string {
  return `<a class="message-option" href="${attr(option.href)}" target="_blank" rel="noopener noreferrer">
        <span>
          <span class="icon"><svg><use href="#i-${option.icon}"></use></svg></span>
          ${esc(option.label)}
        </span>
        <svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8"><use href="#i-arrow"></use></svg>
      </a>`;
}

function renderProject(project: Project): string {
  return `<article class="project" data-category="${attr(project.categoryKey)}" data-title="${attr(project.title)}" data-project-category="${attr(project.categoryLabel)}" data-description="${attr(project.description)}">
          <div class="project-image" tabindex="0" role="button" aria-label="مشاهده پروژه ${attr(project.title)}">
            <img src="${project.image}" alt="${attr(project.title)}" loading="lazy" />
          </div>
          <div class="project-info">
            <p class="project-category">${esc(project.categoryLabel)}</p>
            <h3 class="project-title">${esc(project.title)}</h3>
            <p class="project-description">${esc(project.shortDescription)}</p>
          </div>
        </article>`;
}

function renderFilters(projects: Project[]): string {
  const seen = new Map<string, string>();
  projects.forEach((p) => {
    if (!seen.has(p.categoryKey)) seen.set(p.categoryKey, p.categoryLabel);
  });
  const buttons = [`<button class="filter-button active" type="button" data-filter="all">همه پروژه‌ها</button>`];
  seen.forEach((label, key) => {
    buttons.push(
      `<button class="filter-button" type="button" data-filter="${attr(key)}">${esc(label)}</button>`,
    );
  });
  return buttons.join("\n        ");
}

export function generateHtml(data: SiteData): string {
  const buttonsHtml = data.buttons.map((b) => renderButton(b, data)).join("\n\n          ");
  const contactsHtml = data.contacts
    .map((c) => renderContactOption(c.label, c.number))
    .join("\n\n        ");
  const messagesHtml = data.messageOptions.map(renderMessageOption).join("\n\n        ");
  const projectsHtml = data.portfolio.projects.map(renderProject).join("\n\n        ");
  const filtersHtml = renderFilters(data.portfolio.projects);

  return `<!DOCTYPE html>
<html lang="fa" dir="rtl">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="theme-color" content="${attr(data.meta.themeColor)}" />
  <meta name="description" content="${attr(data.meta.description)}" />

  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Vazirmatn:wght@400;500;600;700;800&display=swap" rel="stylesheet" />

  <title>${esc(data.meta.pageTitle)}</title>

  <style>
    :root {
      --bg: #080808;
      --surface: #101010;
      --surface-2: #171717;
      --orange: #ff6500;
      --orange-light: #ffad72;
      --orange-dark: #bc3b00;
      --white: #fbf8f5;
      --muted: #aaa39c;
      --border: rgba(255, 255, 255, 0.09);
      --orange-border: rgba(255, 101, 0, 0.42);
    }

    * { box-sizing: border-box; -webkit-tap-highlight-color: transparent; }
    html { scroll-behavior: smooth; }

    body {
      min-height: 100vh;
      margin: 0;
      overflow-x: hidden;
      color: var(--white);
      background:
        radial-gradient(circle at 80% 5%, rgba(255, 101, 0, 0.15), transparent 27%),
        radial-gradient(circle at 10% 90%, rgba(255, 101, 0, 0.10), transparent 31%),
        linear-gradient(145deg, #050505 0%, #101010 50%, #060606 100%);
      font-family: "Vazirmatn", Tahoma, Arial, sans-serif;
    }

    body::before {
      content: "";
      position: fixed;
      inset: 0;
      z-index: -2;
      pointer-events: none;
      opacity: 0.08;
      background-image:
        linear-gradient(rgba(255, 255, 255, 0.055) 1px, transparent 1px),
        linear-gradient(90deg, rgba(255, 255, 255, 0.055) 1px, transparent 1px);
      background-size: 44px 44px;
      mask-image: radial-gradient(circle at center, black, transparent 79%);
    }

    body.modal-open { overflow: hidden; }

    .page { width: 100%; min-height: 100vh; display: grid; place-items: center; padding: 24px 16px; }

    .card {
      position: relative;
      width: 100%;
      max-width: 440px;
      overflow: hidden;
      padding: 28px 22px 22px;
      border: 1px solid var(--border);
      border-radius: 32px;
      background:
        linear-gradient(155deg, rgba(255,255,255,.055), rgba(255,255,255,.012)),
        rgba(13, 13, 13, .88);
      box-shadow: 0 34px 82px rgba(0,0,0,.70), inset 0 1px 0 rgba(255,255,255,.07);
    }

    .card::before {
      content: "";
      position: absolute;
      width: 220px; height: 220px;
      top: -135px; left: -125px;
      border-radius: 50%;
      background: rgba(255, 101, 0, .13);
      filter: blur(46px);
      pointer-events: none;
    }

    .inner-border { position: absolute; inset: 10px; border: 1px solid rgba(255, 101, 0, .18); border-radius: 24px; pointer-events: none; }
    .content { position: relative; z-index: 1; }

    .label {
      width: fit-content;
      margin: 0 auto 24px;
      padding: 8px 13px;
      border: 1px solid var(--orange-border);
      border-radius: 99px;
      color: var(--orange-light);
      background: rgba(255, 101, 0, .07);
      font-family: Arial, sans-serif;
      font-size: 10px;
      letter-spacing: .15em;
      direction: ltr;
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .label-dot { width: 7px; height: 7px; border-radius: 50%; background: var(--orange); box-shadow: 0 0 12px var(--orange); }

    .logo-box {
      width: 126px; height: 126px;
      padding: 1px;
      margin: 0 auto 22px;
      border-radius: 34px;
      background: linear-gradient(145deg, var(--orange-light), var(--orange-dark), #2e1407);
      box-shadow: 0 18px 42px rgba(0,0,0,.48);
    }

    .logo-placeholder {
      width: 100%; height: 100%;
      overflow: hidden;
      border-radius: 33px;
      background: radial-gradient(circle at top, rgba(255,255,255,.07), transparent 44%), #0b0b0b;
      display: grid;
      place-items: center;
    }

    .logo-placeholder img { width: 100%; height: 100%; padding: 15px; display: block; object-fit: contain; }

    .intro { text-align: center; }

    .english-title {
      margin: 0 0 7px;
      color: var(--orange-light);
      font-family: Arial, sans-serif;
      font-size: 10px;
      font-weight: 700;
      letter-spacing: .23em;
      direction: ltr;
      text-transform: uppercase;
    }

    h1 { margin: 0; font-size: clamp(31px, 8vw, 42px); font-weight: 800; line-height: 1.4; letter-spacing: -.8px; }
    .job-title { margin: 5px 0 0; color: var(--orange); font-size: 16px; font-weight: 500; }

    .description {
      max-width: 340px;
      margin: 17px auto 0;
      color: var(--muted);
      font-size: 13px;
      font-weight: 400;
      line-height: 2.15;
    }

    .divider { width: 100%; height: 1px; margin: 25px 0 21px; background: linear-gradient(90deg, transparent, rgba(255,101,0,.56), transparent); }

    .buttons { display: grid; gap: 10px; }

    .button {
      width: 100%;
      min-height: 57px;
      padding: 0 16px;
      color: var(--white);
      text-decoration: none;
      cursor: pointer;
      border: 1px solid var(--border);
      border-radius: 17px;
      background: rgba(255,255,255,.035);
      font-family: inherit;
      display: flex;
      align-items: center;
      gap: 12px;
      transition: border-color .2s ease, background .2s ease, transform .2s ease;
    }

    .button:hover { border-color: var(--orange-border); background: rgba(255,101,0,.075); transform: translateY(-1px); }

    .button.primary {
      color: #170900;
      font-weight: 700;
      border-color: rgba(255, 181, 111, .58);
      background: linear-gradient(135deg, #ffb879 0%, #ff6500 51%, #c44100 100%);
      box-shadow: 0 12px 25px rgba(255,101,0,.16);
    }

    .icon {
      width: 35px; height: 35px; flex: 0 0 35px;
      border: 1px solid rgba(255,255,255,.09);
      border-radius: 11px;
      color: var(--orange-light);
      background: rgba(255,255,255,.045);
      display: grid;
      place-items: center;
    }

    .icon svg { width: 18px; height: 18px; fill: none; stroke: currentColor; stroke-width: 1.85; stroke-linecap: round; stroke-linejoin: round; }
    .icon .fill-icon { fill: currentColor; stroke: none; }
    .primary .icon { color: #250d00; border-color: rgba(0,0,0,.09); background: rgba(0,0,0,.10); }
    .button-text { font-size: 13.5px; font-weight: 600; }

    .footer { margin: 22px 0 0; color: #756d66; text-align: center; font-family: Arial, sans-serif; font-size: 9px; letter-spacing: .16em; direction: ltr; }

    .modal {
      position: fixed;
      inset: 0;
      z-index: 50;
      padding: 18px;
      background: rgba(0,0,0,.74);
      display: none;
      align-items: center;
      justify-content: center;
      backdrop-filter: blur(4px);
    }

    .modal.show { display: flex; }

    .modal-box {
      width: 100%;
      max-width: 400px;
      padding: 21px;
      border: 1px solid rgba(255,101,0,.34);
      border-radius: 25px;
      background: #121212;
      box-shadow: 0 28px 80px rgba(0,0,0,.78);
    }

    .modal-header { margin-bottom: 17px; display: flex; align-items: center; justify-content: space-between; gap: 12px; }
    .modal-title { margin: 0; color: var(--white); font-size: 18px; font-weight: 700; }
    .modal-subtitle { margin: 5px 0 0; color: var(--muted); font-size: 12px; }

    .close-modal {
      width: 36px; height: 36px; flex: 0 0 36px;
      cursor: pointer;
      color: var(--orange-light);
      border: 1px solid var(--border);
      border-radius: 11px;
      background: rgba(255,255,255,.04);
      font-size: 24px;
      line-height: 1;
      font-family: Arial, sans-serif;
    }

    .modal-actions { display: grid; gap: 10px; }

    .contact-option, .message-option {
      min-height: 57px;
      padding: 0 15px;
      color: var(--white);
      text-decoration: none;
      border: 1px solid var(--border);
      border-radius: 15px;
      background: rgba(255,255,255,.035);
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
      transition: border-color .2s ease, background .2s ease;
    }

    .contact-option:hover, .message-option:hover { border-color: var(--orange-border); background: rgba(255,101,0,.07); }

    .contact-number { direction: ltr; color: var(--orange-light); font-family: Arial, sans-serif; font-size: 16px; font-weight: bold; }
    .contact-label { color: var(--muted); font-size: 12px; }
    .message-option span { display: flex; align-items: center; gap: 10px; font-size: 14px; font-weight: 600; }

    .portfolio-modal { z-index: 60; padding: 16px; }

    .portfolio-modal-box {
      width: min(1160px, 100%);
      max-height: 94vh;
      overflow: auto;
      padding: 24px;
      border: 1px solid rgba(255,101,0,.34);
      border-radius: 28px;
      background: radial-gradient(circle at 100% 0%, rgba(255,101,0,.10), transparent 26%), #111;
      box-shadow: 0 30px 100px rgba(0,0,0,.84);
    }

    .portfolio-top { margin-bottom: 23px; display: flex; align-items: flex-start; justify-content: space-between; gap: 14px; }

    .portfolio-eyebrow {
      margin: 0 0 6px;
      color: var(--orange-light);
      font-family: Arial, sans-serif;
      font-size: 10px;
      font-weight: 700;
      letter-spacing: .21em;
      direction: ltr;
      text-transform: uppercase;
    }

    .portfolio-heading { margin: 0; color: var(--white); font-size: clamp(22px, 5vw, 31px); font-weight: 800; }
    .portfolio-intro { max-width: 650px; margin: 8px 0 0; color: var(--muted); font-size: 13px; line-height: 2; }

    .filters { margin: 0 0 21px; display: flex; flex-wrap: wrap; gap: 8px; }

    .filter-button {
      min-height: 38px;
      padding: 0 14px;
      cursor: pointer;
      color: var(--muted);
      border: 1px solid var(--border);
      border-radius: 999px;
      background: rgba(255,255,255,.035);
      font-family: inherit;
      font-size: 12px;
      transition: .2s ease;
    }

    .filter-button:hover, .filter-button.active { color: #1c0900; border-color: var(--orange); background: var(--orange); }

    .gallery { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 16px; }

    .project {
      overflow: hidden;
      border: 1px solid var(--border);
      border-radius: 20px;
      background: linear-gradient(145deg, rgba(255,255,255,.07), rgba(255,255,255,.015)), var(--surface);
      box-shadow: 0 16px 40px rgba(0,0,0,.25);
      transition: transform .25s ease, border-color .25s ease, box-shadow .25s ease;
    }

    .project:hover { transform: translateY(-5px); border-color: var(--orange-border); box-shadow: 0 22px 52px rgba(0,0,0,.43); }

    .project-image { position: relative; aspect-ratio: 4 / 3; overflow: hidden; cursor: pointer; background: #090909; outline: none; }
    .project-image:focus-visible { outline: 2px solid var(--orange-light); outline-offset: -4px; }

    .project-image::after {
      content: "مشاهده پروژه";
      position: absolute;
      left: 11px; bottom: 11px;
      padding: 7px 10px;
      opacity: 0;
      color: #260d00;
      border-radius: 9px;
      background: var(--orange-light);
      font-size: 10px;
      font-weight: 700;
      transform: translateY(8px);
      transition: .25s ease;
    }

    .project:hover .project-image::after { opacity: 1; transform: translateY(0); }

    .project-image img { width: 100%; height: 100%; display: block; object-fit: cover; transition: transform .42s ease; }
    .project:hover .project-image img { transform: scale(1.055); }

    .project-info { padding: 14px 14px 15px; }
    .project-category { margin: 0 0 6px; color: var(--orange-light); font-size: 11px; }
    .project-title { margin: 0; color: var(--white); font-size: 16px; font-weight: 700; }
    .project-description { margin: 8px 0 0; color: var(--muted); font-size: 12px; line-height: 1.85; }

    .empty-message { display: none; grid-column: 1 / -1; padding: 30px; color: var(--muted); text-align: center; border: 1px dashed var(--border); border-radius: 18px; }

    .viewer-modal { z-index: 70; padding: 14px; background: rgba(0,0,0,.90); }

    .viewer-box {
      width: min(900px, 100%);
      max-height: 94vh;
      overflow: auto;
      border: 1px solid rgba(255,101,0,.42);
      border-radius: 23px;
      background: #111;
      box-shadow: 0 30px 100px rgba(0,0,0,.86);
    }

    .viewer-image-wrap { position: relative; min-height: 220px; background: #070707; }
    .viewer-image { width: 100%; max-height: 63vh; display: block; object-fit: contain; }

    .viewer-close {
      position: absolute;
      top: 13px; left: 13px;
      width: 39px; height: 39px;
      cursor: pointer;
      color: var(--orange-light);
      border: 1px solid var(--border);
      border-radius: 11px;
      background: rgba(8,8,8,.74);
      font-size: 24px;
      line-height: 1;
      font-family: Arial, sans-serif;
    }

    .viewer-content { padding: 19px 21px 21px; }
    .viewer-category { margin: 0 0 6px; color: var(--orange-light); font-size: 12px; }
    .viewer-title { margin: 0; color: var(--white); font-size: clamp(20px, 5vw, 27px); font-weight: 800; }
    .viewer-description { margin: 12px 0 0; color: var(--muted); font-size: 13px; line-height: 2.1; }

    .viewer-controls { margin-top: 19px; display: flex; align-items: center; justify-content: center; gap: 10px; }

    .control-button {
      min-height: 43px;
      min-width: 112px;
      padding: 0 14px;
      cursor: pointer;
      color: var(--white);
      border: 1px solid var(--border);
      border-radius: 12px;
      background: rgba(255,255,255,.05);
      font-family: inherit;
      font-size: 12px;
      transition: .2s ease;
    }

    .control-button:hover { border-color: var(--orange-border); background: rgba(255,101,0,.10); }

    .counter { margin-top: 13px; color: #7e756d; text-align: center; font-family: Arial, sans-serif; font-size: 11px; direction: ltr; }

    @media (max-width: 820px) {
      .gallery { grid-template-columns: repeat(2, minmax(0, 1fr)); }
    }

    @media (max-width: 520px) {
      .page { padding: 13px 10px; }
      .card { padding: 24px 17px 18px; border-radius: 27px; }
      .inner-border { inset: 8px; border-radius: 21px; }
      .logo-box { width: 112px; height: 112px; border-radius: 30px; }
      .logo-placeholder { border-radius: 29px; }
      .description { font-size: 12px; }
      .portfolio-modal { padding: 8px; }
      .portfolio-modal-box { max-height: 96vh; padding: 18px 14px; border-radius: 22px; }
      .portfolio-top { margin-bottom: 19px; }
      .portfolio-intro { font-size: 12px; }
      .gallery { grid-template-columns: 1fr; gap: 14px; }
      .project-image { aspect-ratio: 16 / 10; }
      .viewer-modal { padding: 9px; }
      .viewer-content { padding: 16px; }
      .viewer-controls { gap: 8px; }
      .control-button { min-width: 0; flex: 1; }
    }
  </style>
</head>

<body>
  <svg width="0" height="0" style="position:absolute; overflow:hidden;" aria-hidden="true">
    ${Object.entries(ICON_MARKUP)
      .map(([key, markup]) => `<symbol id="i-${key}" viewBox="0 0 24 24">${markup}</symbol>`)
      .join("\n    ")}
  </svg>

  <main class="page">
    <section class="card">
      <div class="inner-border"></div>

      <div class="content">
        <div class="label">
          <span class="label-dot"></span>
          ${esc(data.brand.labelText)}
        </div>

        <div class="logo-box">
          <div class="logo-placeholder">
            <img src="${data.brand.logo}" alt="لوگوی ${attr(data.brand.name)}" />
          </div>
        </div>

        <div class="intro">
          <p class="english-title">${esc(data.brand.englishTitle)}</p>
          <h1>${esc(data.brand.name)}</h1>
          <p class="job-title">${esc(data.brand.jobTitle)}</p>

          <p class="description">${esc(data.brand.description)}</p>
        </div>

        <div class="divider"></div>

        <nav class="buttons">
          ${buttonsHtml}
        </nav>

        <p class="footer">${esc(data.brand.footer)}</p>
      </div>
    </section>
  </main>

  <div class="modal" id="call-modal" role="dialog" aria-modal="true" aria-labelledby="call-title">
    <div class="modal-box">
      <div class="modal-header">
        <div>
          <h2 class="modal-title" id="call-title">تماس مستقیم</h2>
          <p class="modal-subtitle">شماره موردنظرتان را انتخاب کنید.</p>
        </div>
        <button class="close-modal" type="button" aria-label="بستن" onclick="closeModal('call-modal')">×</button>
      </div>

      <div class="modal-actions">
        ${contactsHtml}
      </div>
    </div>
  </div>

  <div class="modal" id="message-modal" role="dialog" aria-modal="true" aria-labelledby="message-title">
    <div class="modal-box">
      <div class="modal-header">
        <div>
          <h2 class="modal-title" id="message-title">ارسال پیام سریع</h2>
          <p class="modal-subtitle">روش ارتباطی دلخواهتان را انتخاب کنید.</p>
        </div>
        <button class="close-modal" type="button" aria-label="بستن" onclick="closeModal('message-modal')">×</button>
      </div>

      <div class="modal-actions">
        ${messagesHtml}
      </div>
    </div>
  </div>

  <div class="modal portfolio-modal" id="portfolio-modal" role="dialog" aria-modal="true" aria-labelledby="portfolio-title">
    <div class="portfolio-modal-box">
      <div class="portfolio-top">
        <div>
          <p class="portfolio-eyebrow">${esc(data.portfolio.eyebrow)}</p>
          <h2 class="portfolio-heading" id="portfolio-title">${esc(data.portfolio.heading)}</h2>
          <p class="portfolio-intro">${esc(data.portfolio.intro)}</p>
        </div>
        <button class="close-modal" type="button" aria-label="بستن نمونه‌کارها" onclick="closeModal('portfolio-modal')">×</button>
      </div>

      <div class="filters" aria-label="فیلتر نمونه‌کارها">
        ${filtersHtml}
      </div>

      <section class="gallery" id="gallery">
        ${projectsHtml}

        <p class="empty-message" id="empty-message">${esc(data.portfolio.emptyMessage)}</p>
      </section>
    </div>
  </div>

  <div class="modal viewer-modal" id="viewer-modal" role="dialog" aria-modal="true" aria-labelledby="viewer-title">
    <div class="viewer-box">
      <div class="viewer-image-wrap">
        <button class="viewer-close" type="button" aria-label="بستن تصویر">×</button>
        <img class="viewer-image" id="viewer-image" alt="" />
      </div>

      <div class="viewer-content">
        <p class="viewer-category" id="viewer-category"></p>
        <h2 class="viewer-title" id="viewer-title"></h2>
        <p class="viewer-description" id="viewer-description"></p>

        <div class="viewer-controls">
          <button class="control-button" id="previous-button" type="button">پروژه قبلی</button>
          <button class="control-button" id="next-button" type="button">پروژه بعدی</button>
        </div>

        <div class="counter" id="counter"></div>
      </div>
    </div>
  </div>

  <script>
    function openModal(id) {
      document.getElementById(id).classList.add("show");
      document.body.classList.add("modal-open");
    }

    function closeModal(id) {
      document.getElementById(id).classList.remove("show");
      const hasOpenModal = document.querySelector(".modal.show");
      if (!hasOpenModal) {
        document.body.classList.remove("modal-open");
      }
    }

    function openPortfolio() {
      openModal("portfolio-modal");
    }

    document.querySelectorAll(".modal").forEach(function (modal) {
      modal.addEventListener("click", function (event) {
        if (event.target === modal) {
          closeModal(modal.id);
        }
      });
    });

    const projects = Array.from(document.querySelectorAll(".project"));
    const viewerModal = document.getElementById("viewer-modal");
    const viewerImage = document.getElementById("viewer-image");
    const viewerTitle = document.getElementById("viewer-title");
    const viewerCategory = document.getElementById("viewer-category");
    const viewerDescription = document.getElementById("viewer-description");
    const counter = document.getElementById("counter");
    const emptyMessage = document.getElementById("empty-message");

    let currentProject = 0;

    function visibleProjects() {
      return projects.filter(function (project) {
        return project.style.display !== "none";
      });
    }

    function openProject(index) {
      const activeProjects = visibleProjects();
      const project = activeProjects[index];
      if (!project) return;

      currentProject = index;

      const image = project.querySelector("img");
      viewerImage.src = image.currentSrc || image.src;
      viewerImage.alt = image.alt;
      viewerTitle.textContent = project.dataset.title;
      viewerCategory.textContent = project.dataset.projectCategory;
      viewerDescription.textContent = project.dataset.description;
      counter.textContent = (currentProject + 1) + " / " + activeProjects.length;

      viewerModal.classList.add("show");
      document.body.classList.add("modal-open");
    }

    function closeViewer() {
      viewerModal.classList.remove("show");
      if (!document.querySelector(".modal.show")) {
        document.body.classList.remove("modal-open");
      }
    }

    function showPrevious() {
      const activeProjects = visibleProjects();
      if (!activeProjects.length) return;
      currentProject = (currentProject - 1 + activeProjects.length) % activeProjects.length;
      openProject(currentProject);
    }

    function showNext() {
      const activeProjects = visibleProjects();
      if (!activeProjects.length) return;
      currentProject = (currentProject + 1) % activeProjects.length;
      openProject(currentProject);
    }

    projects.forEach(function (project) {
      const imageArea = project.querySelector(".project-image");

      imageArea.addEventListener("click", function () {
        openProject(visibleProjects().indexOf(project));
      });

      imageArea.addEventListener("keydown", function (event) {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          openProject(visibleProjects().indexOf(project));
        }
      });
    });

    document.querySelector(".viewer-close").addEventListener("click", closeViewer);
    document.getElementById("previous-button").addEventListener("click", showPrevious);
    document.getElementById("next-button").addEventListener("click", showNext);

    document.querySelectorAll(".filter-button").forEach(function (button) {
      button.addEventListener("click", function () {
        const filter = button.dataset.filter;

        document.querySelectorAll(".filter-button").forEach(function (item) {
          item.classList.remove("active");
        });

        button.classList.add("active");

        projects.forEach(function (project) {
          const shouldShow = filter === "all" || project.dataset.category === filter;
          project.style.display = shouldShow ? "" : "none";
        });

        emptyMessage.style.display = visibleProjects().length ? "none" : "block";
      });
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape") {
        if (viewerModal.classList.contains("show")) {
          closeViewer();
          return;
        }
        document.querySelectorAll(".modal.show").forEach(function (modal) {
          closeModal(modal.id);
        });
      }

      if (viewerModal.classList.contains("show")) {
        if (event.key === "ArrowRight") showPrevious();
        if (event.key === "ArrowLeft") showNext();
      }
    });

    viewerModal.addEventListener("click", function (event) {
      if (event.target === viewerModal) {
        closeViewer();
      }
    });
  </script>
</body>
</html>
`;
}

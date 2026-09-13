export function placeholderImage(label: string, sub = "تصویر نمونه"): string {
  const safe = label.length > 22 ? `${label.slice(0, 22)}…` : label;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="640" height="480" viewBox="0 0 640 480">
    <defs>
      <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#1a1a1a"/>
        <stop offset="100%" stop-color="#0a0a0a"/>
      </linearGradient>
    </defs>
    <rect width="640" height="480" fill="url(#g)"/>
    <circle cx="540" cy="60" r="120" fill="#ff6500" opacity="0.16"/>
    <circle cx="70" cy="430" r="150" fill="#ff6500" opacity="0.10"/>
    <rect x="24" y="24" width="592" height="432" rx="26" fill="none" stroke="#ff6500" stroke-opacity="0.35" stroke-width="2"/>
    <text x="320" y="230" font-family="Tahoma, Arial, sans-serif" font-size="30" font-weight="700" fill="#ffad72" text-anchor="middle">${escapeXml(safe)}</text>
    <text x="320" y="268" font-family="Tahoma, Arial, sans-serif" font-size="16" fill="#aaa39c" text-anchor="middle">${escapeXml(sub)}</text>
  </svg>`;
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

export function placeholderLogo(initials = "EN"): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="300" height="300" viewBox="0 0 300 300">
    <defs>
      <linearGradient id="lg" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#ffb879"/>
        <stop offset="55%" stop-color="#ff6500"/>
        <stop offset="100%" stop-color="#c44100"/>
      </linearGradient>
    </defs>
    <rect width="300" height="300" rx="46" fill="#0b0b0b"/>
    <circle cx="150" cy="150" r="96" fill="url(#lg)" opacity="0.9"/>
    <text x="150" y="172" font-family="Tahoma, Arial, sans-serif" font-size="88" font-weight="800" fill="#0b0b0b" text-anchor="middle">${escapeXml(initials)}</text>
  </svg>`;
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

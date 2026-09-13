import type { ContactNumber, VCardInfo } from "../types";

export function buildVCardText(v: VCardInfo, contacts: ContactNumber[]): string {
  const lines = [
    "BEGIN:VCARD",
    "VERSION:3.0",
    `N:${v.lastName};${v.firstName};;;`,
    `FN:${v.firstName} ${v.lastName}`.trim(),
    v.org ? `ORG:${v.org}` : "",
    v.jobTitle ? `TITLE:${v.jobTitle}` : "",
    ...contacts.map((c) => `TEL;TYPE=CELL:${c.number.replace(/\s+/g, "")}`),
    v.email ? `EMAIL:${v.email}` : "",
    "END:VCARD",
  ].filter(Boolean);
  return lines.join("\n");
}

export function buildVCardHref(v: VCardInfo, contacts: ContactNumber[]): string {
  const text = buildVCardText(v, contacts);
  return `data:text/vcard;charset=utf-8,${encodeURIComponent(text)}`;
}

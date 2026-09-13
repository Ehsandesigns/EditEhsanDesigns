export type IconKey =
  | "phone"
  | "contact"
  | "mail"
  | "instagram"
  | "telegram"
  | "whatsapp"
  | "message"
  | "portfolio"
  | "link"
  | "arrow";

export type ButtonAction =
  | "call"
  | "vcard"
  | "mailto"
  | "message"
  | "portfolio"
  | "link";

export interface ButtonItem {
  id: string;
  icon: IconKey;
  text: string;
  action: ButtonAction;
  url?: string;
  primary?: boolean;
}

export interface ContactNumber {
  id: string;
  label: string;
  number: string;
}

export interface MessageOption {
  id: string;
  icon: IconKey;
  label: string;
  href: string;
}

export interface Project {
  id: string;
  image: string;
  title: string;
  categoryKey: string;
  categoryLabel: string;
  shortDescription: string;
  description: string;
}

export interface VCardInfo {
  firstName: string;
  lastName: string;
  org: string;
  jobTitle: string;
  email: string;
}

export interface SiteData {
  meta: {
    pageTitle: string;
    description: string;
    themeColor: string;
  };
  brand: {
    labelText: string;
    logo: string;
    englishTitle: string;
    name: string;
    jobTitle: string;
    description: string;
    footer: string;
  };
  email: {
    address: string;
    subject: string;
  };
  contacts: ContactNumber[];
  messageOptions: MessageOption[];
  buttons: ButtonItem[];
  vcard: VCardInfo;
  portfolio: {
    eyebrow: string;
    heading: string;
    intro: string;
    emptyMessage: string;
    projects: Project[];
  };
}

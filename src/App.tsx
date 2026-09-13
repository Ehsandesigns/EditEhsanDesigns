import { useEffect, useMemo, useState } from "react";
import type { SiteData } from "./types";
import { createDefaultData } from "./data/defaultData";
import { usePersistentState } from "./hooks/usePersistentState";
import { generateHtml } from "./utils/generateHtml";
import { ProfileTab } from "./components/tabs/ProfileTab";
import { ButtonsTab } from "./components/tabs/ButtonsTab";
import { ContactTab } from "./components/tabs/ContactTab";
import { PortfolioTab } from "./components/tabs/PortfolioTab";
import { ExportTab } from "./components/tabs/ExportTab";
import { Preview } from "./components/Preview";
import { cn } from "./utils/cn";

type TabKey = "profile" | "buttons" | "contact" | "portfolio" | "export";

const TABS: { key: TabKey; label: string; icon: string }[] = [
  { key: "profile", label: "پروفایل", icon: "👤" },
  { key: "buttons", label: "دکمه‌ها", icon: "🔘" },
  { key: "contact", label: "تماس و پیام", icon: "☎️" },
  { key: "portfolio", label: "نمونه‌کارها", icon: "🖼️" },
  { key: "export", label: "دریافت خروجی", icon: "📦" },
];

export default function App() {
  const [data, setData, { error }] = usePersistentState<SiteData>("ehsan-card-data-v1", createDefaultData);
  const [tab, setTab] = useState<TabKey>("profile");
  const [showPreview, setShowPreview] = useState(false);

  const html = useMemo(() => generateHtml(data), [data]);

  useEffect(() => {
    document.title = `پنل مدیریت کارت ویزیت — ${data.brand.name || "بدون نام"}`;
  }, [data.brand.name]);

  function update(updater: (draft: SiteData) => void) {
    setData((prev) => {
      const draft = structuredClone(prev);
      updater(draft);
      return draft;
    });
  }

  function resetData() {
    setData(createDefaultData());
  }

  return (
    <div className="min-h-screen bg-[#08080a] font-[Vazirmatn,Tahoma,Arial,sans-serif] text-neutral-100" dir="rtl">
      <div className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(circle_at_85%_5%,rgba(255,101,0,0.14),transparent_28%),radial-gradient(circle_at_10%_90%,rgba(255,101,0,0.1),transparent_32%)]" />

      <header className="sticky top-0 z-30 border-b border-white/10 bg-[#0a0a0c]/90 backdrop-blur">
        <div className="mx-auto flex max-w-[1500px] items-center justify-between gap-3 px-4 py-3 sm:px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-orange-300 via-orange-500 to-orange-800 text-lg font-black text-black shadow-lg shadow-orange-900/30">
              کد
            </div>
            <div>
              <h1 className="text-sm font-extrabold text-white sm:text-base">پنل مدیریت کارت ویزیت دیجیتال</h1>
              <p className="text-[11px] text-neutral-500">آفلاین و بدون نیاز به سرور — همه‌چیز در همین مرورگر ذخیره می‌شود</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setShowPreview((s) => !s)}
            className="rounded-lg border border-orange-500/30 bg-orange-500/10 px-3 py-2 text-xs font-bold text-orange-300 lg:hidden"
          >
            {showPreview ? "بستن پیش‌نمایش" : "پیش‌نمایش"}
          </button>
        </div>
      </header>

      {error ? (
        <div className="mx-auto mt-3 max-w-[1500px] px-4 sm:px-6">
          <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-xs text-red-300">{error}</div>
        </div>
      ) : null}

      <main className="mx-auto grid max-w-[1500px] grid-cols-1 gap-6 px-4 py-6 sm:px-6 lg:grid-cols-[220px_1fr_420px]">
        <nav className="flex gap-2 overflow-x-auto lg:flex-col lg:overflow-visible">
          {TABS.map((t) => (
            <button
              key={t.key}
              type="button"
              onClick={() => setTab(t.key)}
              className={cn(
                "flex shrink-0 items-center gap-2 rounded-xl border px-3 py-2.5 text-xs font-bold transition-colors lg:w-full",
                tab === t.key
                  ? "border-orange-400/50 bg-gradient-to-br from-orange-500/20 to-orange-700/10 text-orange-300"
                  : "border-white/10 bg-white/[0.03] text-neutral-400 hover:border-orange-500/25 hover:text-orange-300",
              )}
            >
              <span>{t.icon}</span>
              {t.label}
            </button>
          ))}
        </nav>

        <section className="min-w-0">
          {tab === "profile" && <ProfileTab data={data} update={update} />}
          {tab === "buttons" && <ButtonsTab data={data} update={update} />}
          {tab === "contact" && <ContactTab data={data} update={update} />}
          {tab === "portfolio" && <PortfolioTab data={data} update={update} />}
          {tab === "export" && (
            <ExportTab html={html} data={data} onImport={(imported) => setData(imported)} onReset={resetData} />
          )}
        </section>

        <aside className="hidden lg:block">
          <div className="sticky top-20">
            <Preview html={html} />
          </div>
        </aside>
      </main>

      {showPreview ? (
        <div className="fixed inset-0 z-40 flex flex-col bg-black/90 p-4 lg:hidden">
          <button
            type="button"
            onClick={() => setShowPreview(false)}
            className="mb-3 self-end rounded-lg border border-white/10 bg-white/10 px-3 py-1.5 text-xs font-bold text-white"
          >
            بستن ✕
          </button>
          <div className="flex-1 overflow-auto">
            <Preview html={html} />
          </div>
        </div>
      ) : null}
    </div>
  );
}

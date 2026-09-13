import { useEffect, useRef, useState } from "react";

export function usePersistentState<T>(
  key: string,
  initial: () => T,
): [T, React.Dispatch<React.SetStateAction<T>>, { error: string | null }] {
  const [state, setState] = useState<T>(() => {
    try {
      const raw = localStorage.getItem(key);
      if (raw) return JSON.parse(raw) as T;
    } catch {
      // ignore corrupted storage
    }
    return initial();
  });

  const [error, setError] = useState<string | null>(null);
  const isFirst = useRef(true);

  useEffect(() => {
    if (isFirst.current) {
      isFirst.current = false;
    }
    try {
      localStorage.setItem(key, JSON.stringify(state));
      setError(null);
    } catch {
      setError(
        "فضای ذخیره‌سازی محلی مرورگر پر شده است. لطفاً حجم تصاویر را کاهش دهید یا پروژه‌های قدیمی را حذف کنید.",
      );
    }
  }, [key, state]);

  return [state, setState, { error }];
}

// 브라우저 sessionStorage 에 저장하는 얇은 저장소. (서버 저장 아님 — 탭을 닫으면 시안의 초기 예시로 돌아간다)
const mem = new Map<string, string>();

export function load<T>(key: string, fallback: T): T {
  try {
    const raw = typeof window !== 'undefined' ? window.sessionStorage.getItem(key) : mem.get(key) ?? null;
    return raw ? ({ ...(Array.isArray(fallback) ? {} : (fallback as object)), ...JSON.parse(raw) } as T) : structuredClone(fallback);
  } catch {
    return structuredClone(fallback);
  }
}
export function loadRaw<T>(key: string, fallback: T): T {
  try {
    const raw = typeof window !== 'undefined' ? window.sessionStorage.getItem(key) : mem.get(key) ?? null;
    return raw ? (JSON.parse(raw) as T) : structuredClone(fallback);
  } catch {
    return structuredClone(fallback);
  }
}
export function save(key: string, value: unknown) {
  const raw = JSON.stringify(value);
  mem.set(key, raw);
  try { window.sessionStorage.setItem(key, raw); } catch { /* 저장 불가 환경은 메모리만 사용 */ }
}

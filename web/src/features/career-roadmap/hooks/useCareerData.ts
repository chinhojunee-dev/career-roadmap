'use client';
import { useEffect, useState } from 'react';

/** API 호출 결과를 한 번 불러온다. 불러오는 동안 null. */
export function useCareerData<T>(load: () => Promise<T>): [T | null, (v: T) => void] {
  const [data, setData] = useState<T | null>(null);
  useEffect(() => {
    let alive = true;
    load().then((v) => { if (alive) setData(v); });
    return () => { alive = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return [data, setData];
}

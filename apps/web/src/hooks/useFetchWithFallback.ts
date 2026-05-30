import { useState, useEffect, useRef } from 'react';

interface FetchWithFallbackResult<T> {
  data: T;
  loading: boolean;
  error: string | null;
  isFallback: boolean;
}

export function useFetchWithFallback<T>(url: string, fallbackData: T): FetchWithFallbackResult<T> {
  // Capture fallbackData in a ref so inline object literals passed by callers
  // don't create a new reference on every render and cause an infinite re-fetch loop.
  const fallbackRef = useRef<T>(fallbackData);

  const [data, setData] = useState<T>(fallbackRef.current);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isFallback, setIsFallback] = useState<boolean>(false);

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const result = await response.json();

        if (isMounted) {
          setData(result);
          setIsFallback(false);
        }
      } catch (err: any) {
        if (isMounted) {
          console.warn(`[useFetchWithFallback] Failed to fetch ${url}, falling back to mock data:`, err.message);
          setData(fallbackRef.current);
          setError(err.message);
          setIsFallback(true);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [url]); // Only re-run when the URL changes — fallbackData is stable via ref

  return { data, loading, error, isFallback };
}

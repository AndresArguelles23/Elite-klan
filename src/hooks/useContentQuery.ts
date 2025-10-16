import { useCallback, useEffect, useRef, useState } from 'react';

type DependencyList = ReadonlyArray<unknown>;

export function useContentQuery<T>(fetcher: () => Promise<T>, deps: DependencyList = []) {
  const stableFetcher = useCallback(fetcher, deps);
  const isMounted = useRef(true);
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const execute = useCallback(async () => {
    if (!isMounted.current) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await stableFetcher();
      if (isMounted.current) {
        setData(result);
      }
    } catch (err) {
      if (isMounted.current) {
        setError(err instanceof Error ? err : new Error(String(err)));
      }
    } finally {
      if (isMounted.current) {
        setLoading(false);
      }
    }
  }, [stableFetcher]);

  useEffect(() => {
    isMounted.current = true;
    execute();

    return () => {
      isMounted.current = false;
    };
  }, [execute]);

  return { data, loading, error, refetch: execute };
}

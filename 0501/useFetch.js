import { useEffect, useState } from "react";

export function useFetch(initialValue, fnFetch) {
  const [fetchedData, setFetchedData] = useState(initialValue);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState();

  useEffect(() => {
    setIsLoading(true);
    setError(undefined);

    const fetchCall = async () => {
      try {
        const json = await fnFetch();
        setFetchedData(json);
      } catch (e) {
        setError(e.message || "데이터 처리 실패");
      } finally {
        setIsLoading(false);
      }
    };
    fetchCall();
  }, [fnFetch]);

  return { fetchedData, setFetchedData, isLoading, error };
}

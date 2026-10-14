import { useCallback, useEffect, useState } from "react";

export function useFetch(url) {
  const [data, setData] = useState(null);
  const [retryCount, setRetryCount] = useState(0);
  const [request, setRequest] = useState(null);
  const retry = useCallback(() => setRetryCount((count) => count + 1), []);

  useEffect(() => {
    const controller = new AbortController();

    let requestError = null;

    fetch(url, { signal: controller.signal })
      .then((response) => {
        if (!response.ok) {
          const httpError = new Error(
            `Request failed with status ${response.status}`,
          );
          httpError.status = response.status;
          httpError.requestUrl = url;
          throw httpError;
        }

        return response.json();
      })
      .then((json) => {
        if (!controller.signal.aborted) setData(json);
      })
      .catch((error) => {
        if (!controller.signal.aborted && error.name !== "AbortError") {
          error.requestUrl = url;
          requestError = error;
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) {
          setRequest({ url, retryCount, error: requestError });
        }
      });

    return () => {
      controller.abort();
    };
  }, [url, retryCount]);

  // Treat a changed URL/retry as pending even before its effect runs.
  const currentRequest =
    request?.url === url && request?.retryCount === retryCount;
  if (request && !currentRequest) setRequest(null);
  return {
    data,
    loading: !currentRequest,
    error: currentRequest ? request.error : null,
    retry,
  };
}

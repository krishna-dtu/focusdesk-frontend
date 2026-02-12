import { useEffect, useState } from "react";
import API from "@/api/api";

/**
 * Hook to fetch the count of pending requests for admin sidebar notification.
 */
export function usePendingRequestCount() {
  const [count, setCount] = useState<number>(0);
  useEffect(() => {
    let isMounted = true;
    const fetchCount = async () => {
      try {
        const res = await API.get("/api/admin/pending-count");
        if (isMounted) setCount(res.data.count || 0);
      } catch {
        if (isMounted) setCount(0);
      }
    };
    fetchCount();
    const interval = setInterval(fetchCount, 10000); // Poll every 10s
    return () => { isMounted = false; clearInterval(interval); };
  }, []);
  return count;
}

import { useState, useEffect } from "react";
import API from "@/api/api";

export interface ActivityDay {
  date: string;
  count: number;
}

export interface UseUserActivityResult {
  data: ActivityDay[];
  isLoading: boolean;
  error: string | null;
}

/**
 * Fetches a user's activity for a given year.
 * @param userId - The user ID to fetch activity for
 * @param year - The year (e.g. 2026)
 */
export function useUserActivity(userId: string, year: number): UseUserActivityResult {
  const [data, setData] = useState<ActivityDay[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId || !year) return;
    setIsLoading(true);
    setError(null);
    API.get(`/api/users/${userId}/activity?year=${year}`)
      .then(res => setData(res.data.activity || []))
      .catch(err => setError(err.response?.data?.message || "Failed to load activity"))
      .finally(() => setIsLoading(false));
  }, [userId, year]);

  return { data, isLoading, error };
}

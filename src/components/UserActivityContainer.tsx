import React from "react";
import { useUserActivity } from "@/hooks/useUserActivity";
import GithubActivityCalendar from "@/components/GithubActivityCalendar";

// Example: get userId from auth context/localStorage
function getCurrentUserId(): string | null {
  const user = localStorage.getItem("focusdesk_user");
  try {
    return user ? JSON.parse(user).id : null;
  } catch {
    return null;
  }
}

const UserActivityContainer: React.FC = () => {
  const userId = getCurrentUserId();
  const year = new Date().getFullYear();
  const { data, isLoading, error } = useUserActivity(userId || "", year);

  if (!userId) return <div>Please log in.</div>;
  if (isLoading) return <div>Loading activity...</div>;
  if (error) return <div>Error: {error}</div>;

  return <GithubActivityCalendar data={data} year={year} />;
};

export default UserActivityContainer;

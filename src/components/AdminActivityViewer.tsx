import React, { useState } from "react";
import { useUserActivity } from "@/hooks/useUserActivity";
import GithubActivityCalendar from "@/components/GithubActivityCalendar";

interface UserOption {
  id: string;
  name: string;
}

// Dummy user list for demo; replace with real user fetch
const USERS: UserOption[] = [
  { id: "user1", name: "User 1" },
  { id: "user2", name: "User 2" },
];

const AdminActivityViewer: React.FC = () => {
  const [selectedUser, setSelectedUser] = useState<string>("");
  const [year, setYear] = useState<number>(new Date().getFullYear());
  const { data, isLoading, error } = useUserActivity(selectedUser, year);

  return (
    <div>
      <div style={{ display: "flex", gap: 16, marginBottom: 16 }}>
        <select value={selectedUser} onChange={e => setSelectedUser(e.target.value)}>
          <option value="">Select user</option>
          {USERS.map(u => (
            <option key={u.id} value={u.id}>{u.name}</option>
          ))}
        </select>
        <input
          type="number"
          min="2000"
          max={new Date().getFullYear()}
          value={year}
          onChange={e => setYear(Number(e.target.value))}
        />
      </div>
      {selectedUser ? (
        isLoading ? (
          <div>Loading activity...</div>
        ) : error ? (
          <div>Error: {error}</div>
        ) : (
          <GithubActivityCalendar data={data} year={year} />
        )
      ) : (
        <div>Select a user to view activity.</div>
      )}
    </div>
  );
};

export default AdminActivityViewer;

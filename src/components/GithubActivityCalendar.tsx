import React, { useMemo } from "react";

// Utility: Get all days in a year, as {date, weekday, month, year}
function getYearDays(year: number) {
  const days = [];
  const start = new Date(year, 0, 1);
  const end = new Date(year + 1, 0, 1);
  for (let d = new Date(start); d < end; d.setDate(d.getDate() + 1)) {
    days.push({
      date: d.toISOString().slice(0, 10),
      weekday: d.getDay(), // 0=Sun, 6=Sat
      month: d.getMonth(), // 0=Jan
      year: d.getFullYear(),
      day: d.getDate(),
    });
  }
  return days;
}

// Utility: Map count to color level
function getLevel(count: number) {
  if (count >= 10) return 4;
  if (count >= 6) return 3;
  if (count >= 3) return 2;
  if (count >= 1) return 1;
  return 0;
}

// Color scale
const COLORS = [
  "#ebedf0", // 0
  "#9be9a8", // 1
  "#40c463", // 2
  "#30a14e", // 3
  "#216e39", // 4
];

// Month labels
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

// Props: data = [{date: 'YYYY-MM-DD', count: number}], year = 2026 (default: current year)
interface DayData { date: string; count: number; }
interface GithubActivityCalendarProps {
  data: DayData[];
  year?: number;
}

const GithubActivityCalendar: React.FC<GithubActivityCalendarProps> = ({ data, year }) => {
  const targetYear = year || new Date().getFullYear();
  // Map data by date for fast lookup
  const dataMap = useMemo(() => {
    const map: Record<string, number> = {};
    data.forEach(d => { map[d.date] = d.count; });
    return map;
  }, [data]);

  // Get all days in the year
  const days = useMemo(() => getYearDays(targetYear), [targetYear]);

  // Group days by week (each week is a column)
  const weeks: typeof days[][] = [];
  let week: typeof days = [];
  // Start on Sunday for GitHub style
  days.forEach((day, idx) => {
    if (week.length === 0 && day.weekday !== 0) {
      // Fill leading empty days for first week
      for (let i = 0; i < day.weekday; i++) week.push(undefined as any);
    }
    week.push(day);
    if (week.length === 7) {
      weeks.push(week);
      week = [];
    }
  });
  if (week.length > 0) weeks.push(week);

  // Month label positions: first week where month changes
  const monthLabels: { label: string; col: number }[] = [];
  let lastMonth = -1;
  weeks.forEach((w, i) => {
    const firstDay = w.find((d) => d && typeof d === 'object' && 'month' in d);
    if (firstDay && typeof firstDay === 'object' && 'month' in firstDay && (firstDay as { month: number }).month !== lastMonth) {
      const monthIdx = (firstDay as { month: number }).month;
      monthLabels.push({ label: MONTHS[monthIdx], col: i });
      lastMonth = monthIdx;
    }
  });

  return (
    <div style={{ background: "#fff", padding: 16, borderRadius: 8 }}>
      {/* Month labels */}
      <div style={{ display: "flex", marginLeft: 32, marginBottom: 4 }}>
        {monthLabels.map((m, i) => (
          <div key={m.label} style={{ flex: i === monthLabels.length - 1 ? 1 : undefined, minWidth: 48, textAlign: "left", fontSize: 12, color: "#555", marginLeft: m.col === 0 ? 0 : 8 }}>
            {m.label}
          </div>
        ))}
      </div>
      <div style={{ display: "flex" }}>
        {/* Weekday labels */}
        <div style={{ display: "flex", flexDirection: "column", marginRight: 4, fontSize: 10, color: "#888", height: 7 * 16 }}>
          {["M", "W", "F"].map((d, i) => (
            <div key={d} style={{ height: 16 * (i === 2 ? 3 : 2), lineHeight: "16px" }}>{d}</div>
          ))}
        </div>
        {/* Calendar grid */}
        <div style={{ display: "flex", gap: 2 }}>
          {weeks.map((week, colIdx) => (
            <div key={colIdx} style={{ display: "flex", flexDirection: "column", gap: 2 }}>
              {week.map((day, rowIdx) => {
                if (!day || typeof day !== 'object' || !('date' in day)) return <div key={rowIdx} style={{ width: 12, height: 12, borderRadius: 3, background: COLORS[0] }} />;
                const dateStr = (day as { date: string }).date;
                const count = dataMap[dateStr] || 0;
                const level = getLevel(count);
                return (
                  <div
                    key={rowIdx}
                    title={`${dateStr}: ${count} activities`}
                    style={{
                      width: 12,
                      height: 12,
                      borderRadius: 3,
                      background: COLORS[level],
                      transition: "background 0.2s",
                      cursor: count > 0 ? "pointer" : "default",
                    }}
                  />
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GithubActivityCalendar;

// Usage Example (in any page):
// <GithubActivityCalendar data={exampleData} year={2026} />
//
// Where exampleData = [
//   { date: "2026-03-01", count: 2 },
//   { date: "2026-03-02", count: 0 },
//   ...
// ]
//
// - Date alignment: Weeks start on Sunday, each column is a week, each row is a weekday (Sun-Sat)
// - Month boundaries: First week where a new month starts gets a label above that column

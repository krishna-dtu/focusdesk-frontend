import { useMemo } from "react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface Activity {
  date: string;
  totalDuration: number;
  scanCount: number;
  isFlagged: boolean;
  checkInTime?: string;
  checkOutTime?: string;
}

interface ContributionCalendarProps {
  activities: Activity[];
  startDate?: string;
  endDate?: string;
}

const ContributionCalendar = ({ activities, startDate, endDate }: ContributionCalendarProps) => {
  const calendarData = useMemo(() => {
    const end = endDate ? new Date(endDate) : new Date();
    const start = startDate ? new Date(startDate) : new Date(end.getTime() - 90 * 24 * 60 * 60 * 1000);

    const days = [];
    const activityMap = new Map(activities.map((a) => [a.date, a]));

    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      const dateStr = d.toISOString().split("T")[0];
      const activity = activityMap.get(dateStr);

      days.push({
        date: dateStr,
        level: activity ? Math.min(4, Math.floor(activity.totalDuration / 60)) : 0,
        activity: activity || null,
      });
    }

    return days;
  }, [activities, startDate, endDate]);

  const getColor = (level: number, isFlagged: boolean) => {
    if (isFlagged) return "bg-red-500";
    if (level === 0) return "bg-muted";
    if (level === 1) return "bg-green-200";
    if (level === 2) return "bg-green-400";
    if (level === 3) return "bg-green-600";
    return "bg-green-800";
  };

  const formatTime = (dateStr: string) => {
    if (!dateStr) return "N/A";
    return new Date(dateStr).toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  // Group days by week for row display
  const weeks: typeof calendarData[][] = [];
  let week: typeof calendarData = [];
  calendarData.forEach((day, idx) => {
    week.push(day);
    if (week.length === 7) {
      weeks.push(week);
      week = [];
    }
  });
  if (week.length > 0) weeks.push(week);

  return (
    <div className="w-full">
      <div className="flex flex-col gap-1">
        <TooltipProvider>
          {weeks.map((week, wIdx) => (
            <div key={wIdx} className="flex gap-1">
              {week.map((day) => (
                <Tooltip key={day.date}>
                  <TooltipTrigger asChild>
                    <div
                      className={`w-3 h-3 rounded-sm ${getColor(
                        day.level,
                        day.activity?.isFlagged || false
                      )} cursor-pointer hover:ring-2 hover:ring-primary transition-all`}
                    />
                  </TooltipTrigger>
                  <TooltipContent>
                    <div className="text-xs">
                      <p className="font-semibold">{day.date}</p>
                      {day.activity ? (
                        <>
                          <p>Check-in: {formatTime(day.activity.checkInTime || "")}</p>
                          <p>Check-out: {formatTime(day.activity.checkOutTime || "")}</p>
                          <p>Duration: {formatDuration(day.activity.totalDuration)}</p>
                          <p>Scans: {day.activity.scanCount}</p>
                          {day.activity.isFlagged && (
                            <p className="text-red-500 font-semibold mt-1">⚠️ Flagged</p>
                          )}
                        </>
                      ) : (
                        <p className="text-muted-foreground">No activity</p>
                      )}
                    </div>
                  </TooltipContent>
                </Tooltip>
              ))}
            </div>
          ))}
        </TooltipProvider>
      </div>

      {/* Date Labels (show for first week only) */}
      {weeks.length > 0 && (
        <div className="flex gap-1 mt-2 text-[10px] text-muted-foreground">
          {weeks[0].map((day) => (
            <span key={day.date} className="w-8 text-center">
              {new Date(day.date).toLocaleDateString("en-IN", { day: "2-digit", month: "short" })}
            </span>
          ))}
        </div>
      )}

      {/* Legend */}
      <div className="flex items-center gap-2 mt-4 text-xs text-muted-foreground">
        <span>Less</span>
        <div className="w-3 h-3 bg-muted rounded-sm" />
        <div className="w-3 h-3 bg-green-200 rounded-sm" />
        <div className="w-3 h-3 bg-green-400 rounded-sm" />
        <div className="w-3 h-3 bg-green-600 rounded-sm" />
        <div className="w-3 h-3 bg-green-800 rounded-sm" />
        <span>More</span>
        <div className="w-3 h-3 bg-red-500 rounded-sm ml-2" />
        <span>Flagged</span>
      </div>
    </div>
  );
};

export default ContributionCalendar;

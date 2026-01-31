import { useEffect, useState } from "react";
import API from "@/api/api";
import { toast } from "sonner";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Loader2 } from "lucide-react";

interface Attendance {
  requestId: number;
  fullName: string;
  idNumber: string;
  organisation: string;
  firstIn: string | null;
  lastOut: string | null;
  breaks: number;
}

const AttendanceTable = () => {
  const [data, setData] = useState<Attendance[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAttendance();
  }, []);

  const fetchAttendance = async () => {
    try {
      setLoading(true);

      const res = await API.get("/api/admin/attendance");

      setData(res.data || []);
      setLoading(false);
    } catch (err) {
      setLoading(false);
      toast.error("Failed to load attendance logs");
    }
  };

  if (loading) {
    return (
      <div className="p-10 text-center">
        <Loader2 className="w-6 h-6 animate-spin mx-auto mb-3" />
        Loading attendance...
      </div>
    );
  }

  return (
    <div className="glass-card overflow-hidden">
      <div className="p-6 border-b">
        <h2 className="text-xl font-semibold">Attendance Tracker</h2>
        <p className="text-sm text-muted-foreground">
          First entry & last exit with break count
        </p>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>College ID</TableHead>
            <TableHead>First IN</TableHead>
            <TableHead>Last OUT</TableHead>
            <TableHead>Breaks</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {data.map((a) => (
            <TableRow key={a.requestId}>
              <TableCell className="font-medium">
                {a.fullName}
              </TableCell>

              <TableCell className="font-mono text-sm">
                {a.idNumber}
              </TableCell>

              <TableCell>
                {a.firstIn
                  ? new Date(a.firstIn).toLocaleString("en-IN")
                  : "-"}
              </TableCell>

              <TableCell>
                {a.lastOut
                  ? new Date(a.lastOut).toLocaleString("en-IN")
                  : "-"}
              </TableCell>

              <TableCell>{a.breaks}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default AttendanceTable;

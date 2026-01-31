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

interface User {
  id: number;
  fullName: string;
  idNumber: string;
  organisation: string;
  validUntil: string;
}

const ApprovedUsersTable = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchApproved();
  }, []);

  const fetchApproved = async () => {
    try {
      setLoading(true);

      const res = await API.get("/api/admin/approved");

      setUsers(res.data.users || []);
      setLoading(false);
    } catch (err) {
      setLoading(false);
      toast.error("Failed to load approved users");
    }
  };

  if (loading) {
    return (
      <div className="p-10 text-center">
        <Loader2 className="w-6 h-6 animate-spin mx-auto mb-3" />
        Loading approved users...
      </div>
    );
  }

  return (
    <div className="glass-card overflow-hidden">
      <div className="p-6 border-b">
        <h2 className="text-xl font-semibold">Approved Users</h2>
        <p className="text-sm text-muted-foreground">
          Users currently having active QR access
        </p>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>College ID</TableHead>
            <TableHead>Organisation</TableHead>
            <TableHead>Valid Until</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {users.map((u) => (
            <TableRow key={u.id}>
              <TableCell>{u.fullName}</TableCell>
              <TableCell className="font-mono">{u.idNumber}</TableCell>
              <TableCell>{u.organisation}</TableCell>
              <TableCell>
                {new Date(u.validUntil).toLocaleString("en-IN")}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default ApprovedUsersTable;

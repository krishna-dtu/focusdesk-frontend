import { useEffect, useState } from "react";
import Navbar from "@/components/layout/Navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import API from "@/api/api";
import { Loader2 } from "lucide-react";

interface QRPass {
  _id: string;
  status: "ACTIVE" | "EXPIRED" | "UPCOMING";
  validFrom: string;
  validUntil: string;
  createdAt: string;
}

const AllQRs = () => {
  const [qrs, setQrs] = useState<QRPass[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAllQRs = async () => {
      try {
        const idNumber = localStorage.getItem("userIdNumber");
        if (!idNumber) return;
        const res = await API.get(`/api/user/allqrs/${idNumber}`);
        setQrs(res.data.qrs || []);
      } catch (err) {
        // handle error
      } finally {
        setLoading(false);
      }
    };
    fetchAllQRs();
  }, []);

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "N/A";
    return new Date(dateStr).toLocaleString("en-IN", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  };

  return (
    <div className="min-h-screen bg-hero-gradient">
      <Navbar />
      <div className="container mx-auto px-4 pt-28 pb-16">
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>All My QRs</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center p-8">
                <Loader2 className="w-8 h-8 animate-spin mx-auto text-primary" />
                <p className="mt-2 text-muted-foreground">Loading...</p>
              </div>
            ) : qrs.length === 0 ? (
              <p className="text-center text-muted-foreground">No QRs found.</p>
            ) : (
              <div className="space-y-4">
                {qrs.map((qr) => (
                  <div key={qr._id} className="flex items-center justify-between p-4 border rounded-lg bg-white/80">
                    <div>
                      <div className="font-semibold">{qr.status}</div>
                      <div className="text-xs text-muted-foreground">Valid: {formatDate(qr.validFrom)} - {formatDate(qr.validUntil)}</div>
                      <div className="text-xs text-muted-foreground">Created: {formatDate(qr.createdAt)}</div>
                    </div>
                    <Badge variant={qr.status === "ACTIVE" ? "default" : qr.status === "EXPIRED" ? "destructive" : "secondary"}>{qr.status}</Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AllQRs;

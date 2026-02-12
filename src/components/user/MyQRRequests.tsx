import React, { useEffect, useState } from "react";
import API from "@/api/api";

interface QRRequest {
  _id: string;
  valid_from: string;
  valid_until: string;
  created_at: string;
  status: "UPCOMING" | "ACTIVE" | "EXPIRED";
}

const MyQRRequests: React.FC = () => {
  const [qrs, setQrs] = useState<QRRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchQrs = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await API.get("/api/qr/my");
      setQrs(res.data.qrs || []);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to load requests");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchQrs(); }, []);

  const handleDelete = async (id: string) => {
    try {
      await API.delete(`/api/qr/${id}`);
      fetchQrs();
    } catch (err: any) {
      alert(err.response?.data?.message || "Delete failed");
    }
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">My QR Requests</h2>
      {loading ? <div>Loading...</div> : error ? <div className="text-red-500">{error}</div> : (
        <ul className="space-y-3">
          {qrs.map(qr => (
            <li key={qr._id} className="p-4 border rounded-lg flex items-center justify-between">
              <div>
                <div className="font-medium">{new Date(qr.valid_from).toLocaleString()} → {new Date(qr.valid_until).toLocaleString()}</div>
                <div className="text-xs text-muted-foreground">Status: <span className={
                  qr.status === "ACTIVE" ? "text-green-600" : qr.status === "UPCOMING" ? "text-blue-600" : "text-gray-400"
                }>{qr.status}</span></div>
              </div>
              {qr.status === "UPCOMING" && (
                <button className="btn btn-danger" onClick={() => handleDelete(qr._id)}>Delete</button>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default MyQRRequests;

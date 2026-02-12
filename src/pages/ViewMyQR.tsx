import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Navbar from "@/components/layout/Navbar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { toast } from "sonner";
import { motion } from "framer-motion";

import { QrCode, ArrowRight, PlusCircle } from "lucide-react";

import API from "@/api/api";

const ViewMyQR = () => {
  const [idNumber, setIdNumber] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  // ✅ Ensure user is logged in
  useEffect(() => {
    const user = localStorage.getItem("focusdesk_user");

    if (!user) {
      toast.error("Please login first");
      navigate("/login");
    }

    // ✅ Auto-fill if college ID already stored
    const savedId = localStorage.getItem("userIdNumber");
    if (savedId) {
      navigate(`/user/dashboard?id=${savedId}`);
    }
  }, []);

  // ✅ Fetch QR from backend
  const fetchQR = async () => {
    if (!idNumber.trim()) {
      toast.error("Enter your College ID Number");
      return;
    }

    setLoading(true);

    try {
      const res = await API.get(
        `/api/user/qrpass-by-id/${encodeURIComponent(idNumber)}`
      );

      // ✅ Save ID for future auto-access
      localStorage.setItem("userIdNumber", idNumber);

      toast.success("QR Pass Found ✅ Redirecting...");
      navigate(`/user/dashboard?id=${idNumber}`);
    } catch (err: any) {
      toast.error(
        err.response?.data?.message || "QR not issued yet. Wait for approval."
      );
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-hero-gradient">
      <Navbar />

      <div className="container mx-auto px-4 pt-28 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md mx-auto glass-card p-10 text-center"
        >
          {/* Icon */}
          <div className="w-16 h-16 mx-auto rounded-2xl bg-primary/10 flex items-center justify-center mb-6">
            <QrCode className="w-8 h-8 text-primary" />
          </div>

          {/* Heading */}
          <h1 className="text-2xl font-bold text-foreground mb-2">
            Access Your QR Pass
          </h1>

          <p className="text-muted-foreground mb-8 text-sm">
            Enter your College ID to view your Entry & Exit QR codes issued by
            FocusDesk.
          </p>

          {/* Input */}
          <Input
            placeholder="College ID (e.g. 24CSE250)"
            value={idNumber}
            onChange={(e) => setIdNumber(e.target.value)}
            className="h-12 mb-4 text-center"
          />

          {/* View QR Button */}
          <Button
            onClick={fetchQR}
            disabled={loading}
            className="w-full btn-gradient h-12"
          >
            {loading ? (
              "Checking..."
            ) : (
              <>
                View My QR <ArrowRight className="w-4 h-4 ml-2" />
              </>
            )}
          </Button>


          {/* View All QRs Button */}
          <Button
            variant="secondary"
            className="w-full mt-4 h-12"
            onClick={() => navigate("/user/allqrs")}
          >
            View All QRs
          </Button>

          {/* New Request Button */}
          <Button
            variant="outline"
            className="w-full mt-4 h-12"
            onClick={() => navigate("/user/request")}
          >
            <PlusCircle className="w-4 h-4 mr-2" />
            Make New QR Request
          </Button>

          {/* Footer Note */}
          <p className="text-xs text-muted-foreground mt-6">
            If your request is pending, QR will appear after admin approval.
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default ViewMyQR;

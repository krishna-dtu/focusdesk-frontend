import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { motion } from "framer-motion";
import { ArrowRight, ArrowLeft, Copy, Clock, Loader2, XCircle } from "lucide-react";
import { toast } from "sonner";

import Navbar from "@/components/layout/Navbar";
import API from "@/api/api";

import QRCode from "react-qr-code";

const UserDashboard = () => {
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("in");
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState<any>(null);
  const [error, setError] = useState(false);

  // ✅ Read ID Number
  const [params] = useSearchParams();
  const idNumber =
    params.get("id") || localStorage.getItem("userIdNumber") || "";

  /**
   * ✅ Fetch QR Pass Data with Auto-Refresh Polling
   * Polls every 5 seconds until approved or rejected
   */
  useEffect(() => {
    if (!idNumber) {
      setError(true);
      setLoading(false);
      return;
    }

    let interval: any;

    const fetchUserData = async () => {
      try {
        const response = await API.get(
          `/api/user/qrpass-by-id/${idNumber}`
        );

        setUserData(response.data);
        setLoading(false);

        // ✅ Stop polling if approved/rejected
        if (response.data.status !== "PENDING") {
          clearInterval(interval);
        }
      } catch (err) {
        setError(true);
        setLoading(false);
      }
    };

    // ✅ First call immediately
    fetchUserData();

    // ✅ Poll every 5 seconds until approved/rejected
    interval = setInterval(fetchUserData, 5000);

    return () => clearInterval(interval);
  }, [idNumber]);

  /**
   * ✅ Copy Token (Optional)
   */
  const copyToken = () => {
    const token =
      activeTab === "in"
        ? userData?.entryQR?.qrToken
        : userData?.exitQR?.qrToken;

    if (!token) {
      toast.error("QR not available yet");
      return;
    }

    navigator.clipboard.writeText(token);
    toast.success("QR token copied!");
  };

  /**
   * ✅ Format Date Safe
   */
  const formatDate = (dateStr: string) => {
    if (!dateStr) return "N/A";

    return new Date(dateStr).toLocaleString("en-IN", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  };

  const activeQR =
    activeTab === "in" ? userData?.entryQR : userData?.exitQR;

  /**
   * ✅ Loading Screen
   */
  if (loading) {
    return (
      <div className="min-h-screen bg-hero-gradient">
        <Navbar />
        <div className="container mx-auto px-4 pt-24">
          <div className="max-w-lg mx-auto glass-card p-10 text-center">
            <Loader2 className="w-10 h-10 text-primary animate-spin mx-auto mb-4" />
            <p className="text-muted-foreground">
              Loading your access pass...
            </p>
          </div>
        </div>
      </div>
    );
  }

  /**
   * ✅ PENDING - Approval Pending Screen
   */
  if (userData?.status === "PENDING") {
    return (
      <div className="min-h-screen bg-hero-gradient">
        <Navbar />
        <div className="container mx-auto px-4 pt-24">
          <div className="max-w-lg mx-auto glass-card p-10 text-center">
            <Clock className="w-10 h-10 text-warning mx-auto mb-4" />
            <h2 className="text-xl font-bold mb-2">Approval Pending</h2>
            <p className="text-muted-foreground">
              Your request is under admin review. Please check back later.
            </p>
          </div>
        </div>
      </div>
    );
  }

  /**
   * ✅ REJECTED - Show Rejection Reason
   */
  if (userData?.status === "REJECTED") {
    return (
      <div className="min-h-screen bg-hero-gradient">
        <Navbar />
        <div className="container mx-auto px-4 pt-24">
          <div className="max-w-lg mx-auto glass-card p-10 text-center">
            <XCircle className="w-10 h-10 text-destructive mx-auto mb-4" />
            <h2 className="text-xl font-bold mb-4">Request Rejected</h2>
            {userData.rejectionReason && (
              <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4 mb-4">
                <p className="text-sm font-medium mb-1">Reason:</p>
                <p className="text-sm text-foreground">
                  {userData.rejectionReason}
                </p>
              </div>
            )}
            <p className="text-muted-foreground text-sm">
              Please contact admin for more information.
            </p>
          </div>
        </div>
      </div>
    );
  }

  /**
   * ✅ Error - No data
   */
  if (error || !userData) {
    return (
      <div className="min-h-screen bg-hero-gradient">
        <Navbar />
        <div className="container mx-auto px-4 pt-24">
          <div className="max-w-lg mx-auto glass-card p-10 text-center">
            <Clock className="w-10 h-10 text-warning mx-auto mb-4" />
            <h2 className="text-xl font-bold mb-2">Data Not Available</h2>
            <p className="text-muted-foreground">
              Unable to load your access information. Please try again later.
            </p>
          </div>
        </div>
      </div>
    );
  }

  /**
   * ✅ APPROVED - Show QR Dashboard
   */
  return (
    <div className="min-h-screen bg-hero-gradient">
      <Navbar />

      <div className="container mx-auto px-4 pt-24 pb-16">
        <div className="max-w-lg mx-auto">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            {/* Header */}
            <div className="text-center mb-6">
              <h1 className="text-2xl font-bold">
                Your Gate Access Pass
              </h1>
              <p className="text-muted-foreground">
                Scan QR at the gate
              </p>
            </div>

            {/* Card */}
            <div className="qr-card">
              {/* Validity */}
              <div className="bg-muted/40 p-4 rounded-xl mb-6">
                <div className="flex justify-between text-sm">
                  <div>
                    <p className="text-muted-foreground">Valid From</p>
                    <p className="font-medium">
                      {formatDate(userData.validFrom)}
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="text-muted-foreground">Valid Until</p>
                    <p className="font-medium">
                      {formatDate(userData.validUntil)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Tabs */}
              <Tabs
                value={activeTab}
                onValueChange={setActiveTab}
                className="w-full"
              >
                <TabsList className="grid grid-cols-2 h-12 mb-6">
                  <TabsTrigger value="in">
                    <ArrowRight className="w-4 h-4 mr-1" />
                    IN QR
                  </TabsTrigger>

                  <TabsTrigger value="out">
                    <ArrowLeft className="w-4 h-4 mr-1" />
                    OUT QR
                  </TabsTrigger>
                </TabsList>

                {/* ✅ IN QR */}
                <TabsContent value="in">
                  <div className="bg-white rounded-2xl p-8 flex justify-center">
                    <QRCode value={activeQR?.qrToken || ""} size={220} />
                  </div>
                </TabsContent>

                {/* ✅ OUT QR */}
                <TabsContent value="out">
                  {userData?.exitQR?.qrToken ? (
                    <div className="bg-white rounded-2xl p-8 flex justify-center">
                      <QRCode value={activeQR?.qrToken || ""} size={220} />
                    </div>
                  ) : (
                    <div className="bg-muted/20 rounded-2xl p-8 text-center border border-dashed">
                      <Loader2 className="w-6 h-6 animate-spin mx-auto mb-3" />
                      <p className="text-muted-foreground text-sm">
                        OUT QR will be available shortly...
                      </p>
                    </div>
                  )}
                </TabsContent>
              </Tabs>

              {/* Copy Button */}
              <Button
                variant="outline"
                onClick={copyToken}
                className="w-full mt-6"
              >
                <Copy className="w-4 h-4 mr-2" />
                Copy Token
              </Button>
            </div>

            {/* Footer */}
            <p className="text-center text-sm text-muted-foreground mt-6">
              {userData.organisation}
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;

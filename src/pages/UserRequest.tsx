import React from "react";

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { motion } from "framer-motion";
import { ArrowLeft, Loader2, CheckCircle2, Clock } from "lucide-react";
import { toast } from "sonner";
import Navbar from "@/components/layout/Navbar";
import API from "@/api/api";

const UserRequest = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    collegeId: "",
    organisation: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.fullName || !formData.collegeId || !formData.organisation) {
      toast.error("Please fill in all fields");
      return;
    }

    // Block slashes in roll number as per new standard (e.g. 24CSE250)
    if (formData.collegeId.includes("/")) {
      toast.error("Use format like 24CSE250 (no / allowed)");
      return;
    }

    setIsLoading(true);
    try {
      await API.post("/api/user/request-access", {
        fullName: formData.fullName,
        idNumber: formData.collegeId,
        organisation: formData.organisation,
      });
      setIsLoading(false);
      setSubmitted(true);
      toast.success("Request submitted. Wait for admin approval.");
    } catch (err: any) {
      setIsLoading(false);
      toast.error(err.response?.data?.message || "Request failed");
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // ✅ Navigate to dashboard with ID in both URL and localStorage
  const handleViewStatus = () => {
    localStorage.setItem("userIdNumber", formData.collegeId);
    navigate(`/user/dashboard?id=${formData.collegeId}`);
  };

  return (
    <div className="min-h-screen bg-hero-gradient">
      <Navbar />
      
      <div className="container mx-auto px-4 pt-24 pb-16">
        <div className="max-w-lg mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            {!submitted ? (
              <div className="glass-card p-8">
                <div className="text-center mb-8">
                  <div className="w-16 h-16 mx-auto rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
                    <svg
                      className="w-8 h-8 text-primary"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
                      />
                    </svg>
                  </div>
                  <h1 className="text-2xl font-bold text-foreground mb-2">
                    Generate Your Access QR
                  </h1>
                  <p className="text-muted-foreground">
                    Fill in your details to request gate access
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Full Name</Label>
                    <Input
                      id="fullName"
                      name="fullName"
                      type="text"
                      placeholder="Enter your full name"
                      value={formData.fullName}
                      onChange={handleChange}
                      className="h-12"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="collegeId">College ID / Roll Number</Label>
                    <Input
                      id="collegeId"
                      name="collegeId"
                      type="text"
                      placeholder="Enter Roll No (e.g. 24CSE250)"
                      value={formData.collegeId}
                      onChange={handleChange}
                      className="h-12"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="organisation">Organisation</Label>
                    <Input
                      id="organisation"
                      name="organisation"
                      type="text"
                      placeholder="e.g., Delhi Technological University"
                      value={formData.organisation}
                      onChange={handleChange}
                      className="h-12"
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full h-12 btn-gradient"
                  >
                    {isLoading ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <>
                        <CheckCircle2 className="w-5 h-5 mr-2" />
                        Submit Request
                      </>
                    )}
                  </Button>
                </form>
              </div>
            ) : (
              <div className="glass-card p-8 text-center">
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.4 }}
                >
                  <div className="w-20 h-20 mx-auto rounded-full bg-warning/10 flex items-center justify-center mb-6">
                    <Clock className="w-10 h-10 text-warning" />
                  </div>
                  <h2 className="text-2xl font-bold text-foreground mb-3">
                    Request Submitted!
                  </h2>
                  <p className="text-muted-foreground mb-6">
                    Thanks for your patience. Your QR will be issued after admin approval.
                  </p>
                  
                  <div className="bg-muted/50 rounded-xl p-4 mb-6">
                    <p className="text-sm text-muted-foreground mb-1">Request Details</p>
                    <p className="font-medium text-foreground">{formData.fullName}</p>
                    <p className="text-sm text-muted-foreground">{formData.collegeId}</p>
                  </div>

                  <div className="space-y-3">
                    <Button
                      onClick={handleViewStatus}
                      className="w-full btn-gradient"
                    >
                      View Status
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => navigate("/")}
                      className="w-full"
                    >
                      Back to Home
                    </Button>
                  </div>
                </motion.div>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default UserRequest;

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { motion } from "framer-motion";
import { ArrowLeft, Mail, Phone, Loader2 } from "lucide-react";
import { toast } from "sonner";

import {
  GoogleAuthProvider,
  signInWithPopup,
  RecaptchaVerifier,
  signInWithPhoneNumber,
} from "firebase/auth";

import { auth } from "../auth/firebase";

const Login = () => {
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);

  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");

  const [otpSent, setOtpSent] = useState(false);
  const [confirmationResult, setConfirmationResult] = useState<any>(null);

  /**
   * ✅ Google Login
   */
  const handleGoogleLogin = async () => {
    try {
      setIsLoading(true);

      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);

      const token = await result.user.getIdToken();

      localStorage.setItem(
        "focusdesk_user",
        JSON.stringify({
          uid: result.user.uid,
          email: result.user.email,
          token,
          method: "google",
        })
      );

      toast.success("✅ Google Login Successful!");
      navigate("/user/viewqr");
    } catch (err) {
      console.log(err);
      toast.error("Google Login Failed");
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * ✅ Send OTP
   */
  const handleSendOtp = async () => {
    if (!phone || phone.length < 10) {
      toast.error("Enter valid phone number");
      return;
    }

    try {
      setIsLoading(true);

      // ✅ Setup reCAPTCHA (Invisible)
      (window as any).recaptchaVerifier = new RecaptchaVerifier(
        auth,
        "recaptcha-container",
        {
          size: "invisible",
        }
      );

      const confirmation = await signInWithPhoneNumber(
        auth,
        "+91" + phone,
        (window as any).recaptchaVerifier
      );

      setConfirmationResult(confirmation);
      setOtpSent(true);

      toast.success("✅ OTP Sent Successfully!");
    } catch (err) {
      console.log(err);
      toast.error("OTP Send Failed");
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * ✅ Verify OTP
   */
  const handleVerifyOtp = async () => {
    if (!otp || otp.length !== 6) {
      toast.error("Enter valid 6-digit OTP");
      return;
    }

    try {
      setIsLoading(true);

      const result = await confirmationResult.confirm(otp);
      const token = await result.user.getIdToken();

      localStorage.setItem(
        "focusdesk_user",
        JSON.stringify({
          uid: result.user.uid,
          phone: result.user.phoneNumber,
          token,
          method: "phone",
        })
      );

      toast.success("✅ Phone Login Successful!");
      navigate("/user/viewqr");
    } catch (err) {
      console.log(err);
      toast.error("Invalid OTP");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-hero-gradient flex items-center justify-center p-4">
      {/* ✅ Required Container */}
      <div id="recaptcha-container"></div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md"
      >
        {/* Back */}
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>

        <div className="glass-card p-8">
          <h1 className="text-2xl font-bold text-center mb-6">
            Login to FocusDesk
          </h1>

          <Tabs defaultValue="google">
            <TabsList className="grid grid-cols-2">
              <TabsTrigger value="google">
                <Mail className="w-4 h-4 mr-2" />
                Google
              </TabsTrigger>
              <TabsTrigger value="phone">
                <Phone className="w-4 h-4 mr-2" />
                Phone
              </TabsTrigger>
            </TabsList>

            {/* ✅ GOOGLE LOGIN */}
            <TabsContent value="google" className="mt-6">
              <Button
                onClick={handleGoogleLogin}
                disabled={isLoading}
                className="w-full h-12"
              >
                {isLoading ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  "Continue with Google"
                )}
              </Button>
            </TabsContent>

            {/* ✅ PHONE LOGIN */}
            <TabsContent value="phone" className="mt-6 space-y-4">
              {!otpSent ? (
                <>
                  <Label>Phone Number</Label>
                  <Input
                    placeholder="9876543210"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />

                  <Button
                    onClick={handleSendOtp}
                    disabled={isLoading}
                    className="w-full"
                  >
                    Send OTP
                  </Button>
                </>
              ) : (
                <>
                  <Label>Enter OTP</Label>
                  <Input
                    placeholder="6-digit OTP"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    maxLength={6}
                  />

                  <Button
                    onClick={handleVerifyOtp}
                    disabled={isLoading}
                    className="w-full"
                  >
                    Verify OTP
                  </Button>
                </>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;

"use client";

import { auth } from "../../firebase";
import { ConfirmationResult, RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import React, { FormEvent, useEffect, useState, useTransition } from "react";
import {
  InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot,
} from "@/components/ui/input-otp";
import { useRouter } from "next/navigation";
import axios from "axios";
import { Smartphone, ArrowRight, CheckCircle2, AlertCircle, RotateCcw } from "lucide-react";
import Link from "next/link";

function OtpLogin() {
  const router = useRouter();

  const [phoneNumber, setPhoneNumber]           = useState("");
  const [otp, setOtp]                           = useState("");
  const [error, setError]                       = useState<string | null>(null);
  const [success, setSuccess]                   = useState("");
  const [resendCountdown, setResendCountdown]   = useState(0);
  const [recaptchaVerifier, setRecaptchaVerifier] = useState<RecaptchaVerifier | null>(null);
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);
  const [isPending, startTransition]            = useTransition();

  useEffect(() => {
    let t: NodeJS.Timeout;
    if (resendCountdown > 0) t = setTimeout(() => setResendCountdown(v => v - 1), 1000);
    return () => clearTimeout(t);
  }, [resendCountdown]);

  useEffect(() => {
    const rv = new RecaptchaVerifier(auth, "recaptcha-container", { size: "invisible" });
    setRecaptchaVerifier(rv);
    return () => rv.clear();
  }, []);

  useEffect(() => {
    if (otp.length === 6) verifyOtp();
  }, [otp]);

  const verifyOtp = async () => {
    startTransition(async () => {
      setError("");
      if (!confirmationResult) { setError("Please request OTP first."); return; }
      try {
        await confirmationResult.confirm(otp);
        const res = await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/user/login`, {
          phoneNumber: `+91${phoneNumber}`,
        });
        localStorage.setItem("arttagtoken", res.data.token);
        localStorage.setItem("arttagUserId", res.data.userId);
        router.replace("/");
      } catch {
        setError("Failed to verify OTP. Please check and try again.");
      }
    });
  };

  const requestOtp = async (e?: FormEvent<HTMLFormElement>) => {
    e?.preventDefault();
    setResendCountdown(60);
    startTransition(async () => {
      setError("");
      if (!recaptchaVerifier) { setError("reCAPTCHA not ready. Please refresh."); return; }
      try {
        const result = await signInWithPhoneNumber(auth, `+91${phoneNumber}`, recaptchaVerifier);
        setConfirmationResult(result);
        setSuccess("OTP sent successfully.");
      } catch (err: any) {
        setResendCountdown(0);
        if (err.code === "auth/invalid-phone-number") setError("Invalid phone number.");
        else if (err.code === "auth/too-many-requests") setError("Too many requests. Try again later.");
        else setError("Failed to send OTP. Please try again.");
      }
    });
  };

  const resetFlow = () => {
    setConfirmationResult(null);
    setOtp(""); setError(""); setSuccess("");
  };

  return (
    <div
      className="min-h-screen bg-[#faf9f7] flex items-center justify-center p-4"
      style={{ fontFamily: "'DM Sans', sans-serif" }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&display=swap');
        .ol-serif { font-family: 'Cormorant Garamond', serif; }
        .ol-divider {
          height: 1px;
          background: linear-gradient(to right, transparent, #e8e4de 30%, #e8e4de 70%, transparent);
        }

        /* Phone input */
        .ol-input {
          width: 100%; padding: 11px 14px 11px 74px;
          font-size: 14px; font-family: 'DM Sans', sans-serif;
          border: 1px solid #e8e4de; border-radius: 2px;
          background: #fff; color: #1a1a1a;
          outline: none; transition: border-color 0.2s;
          letter-spacing: 0.05em;
        }
        .ol-input:focus { border-color: #1a1a1a; }
        .ol-input::placeholder { color: #ccc; letter-spacing: 0; }
        .ol-input:disabled { opacity: 0.5; cursor: not-allowed; }

        /* Primary button */
        .ol-btn-primary {
          width: 100%; display: flex; align-items: center; justify-content: center; gap: 8px;
          background: #1a1a1a; color: #fff; border: none;
          padding: 13px; font-size: 10px; font-weight: 600;
          letter-spacing: 0.18em; text-transform: uppercase;
          border-radius: 2px; cursor: pointer; transition: background 0.2s;
          font-family: 'DM Sans', sans-serif;
        }
        .ol-btn-primary:hover:not(:disabled) { background: #333; }
        .ol-btn-primary:disabled { opacity: 0.5; cursor: not-allowed; }

        /* Ghost / outline button */
        .ol-btn-ghost {
          width: 100%; display: flex; align-items: center; justify-content: center; gap: 7px;
          background: transparent; color: #888; border: 1px solid #e8e4de;
          padding: 11px; font-size: 10px; font-weight: 600;
          letter-spacing: 0.14em; text-transform: uppercase;
          border-radius: 2px; cursor: pointer; transition: all 0.15s;
          font-family: 'DM Sans', sans-serif;
        }
        .ol-btn-ghost:hover:not(:disabled) { border-color: #1a1a1a; color: #1a1a1a; }
        .ol-btn-ghost:disabled { opacity: 0.4; cursor: not-allowed; }

        /* OTP slots */
        .otp-slot {
          width: 46px; height: 56px;
          border: 1px solid #e8e4de; border-radius: 2px;
          background: #fff; font-size: 20px; font-weight: 600;
          color: #1a1a1a; text-align: center;
          transition: border-color 0.15s;
          display: flex; align-items: center; justify-content: center;
        }
        .otp-slot[data-active="true"] { border-color: #1a1a1a; }
        .otp-slot[data-state="visible"] { border-color: #1a1a1a; }
      `}</style>

      <div className="w-full max-w-[400px]">

        {/* ── Card ── */}
        <div className="bg-white border border-[#e8e4de] rounded-sm px-8 py-8 sm:py-10">

          {/* Logo */}
          <div className="flex justify-center mb-7">
            <Link href="/">
              <div className="w-auto h-12">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 270 54" className="h-full w-auto">
                  <defs>
                    <style>{`.ol-st0 { font-family: MuktaMahee-Regular, 'Mukta Mahee'; font-size: 49.69px; }`}</style>
                  </defs>
                  <g>
                    <path d="M62.85,33.21c.11,0,.17.04.19.21.2,1.7-.04,4.05-.01,5.84,0,.44.01.95-.3,1.15-.34.21-1.72-.06-2.18-.12-14.77-1.86-19.13-21.03-6.37-28.96,3.44-2.14,5.73-2.15,9.65-2.25.57-.01,1.26,0,1.76.06-2.15,2.88-1.5,7.52,2.16,8.77,1.53.52,2.98.08,4.52.4v21.62c0,.2-.1.41-.29.49h-6.67c-.08,0-.16-.03-.22-.09-.06-.06-.09-.14-.09-.22v-20.52c0-.35-.19-.72-.24-.86-1.18-3.54-5.67-2.47-7.9-.6-4.54,3.81-3.78,11.34,1.53,14.02.34.17,1.24.75,2.41.87l2.06.2Z" />
                    <path d="M68.98,16.48c-.15,0-.29-.02-.44-.05-1.63-.42-2.77-2.4-2.6-4.02.15-1.44,1.7-3.34,3.22-3.34h20.4c.15,0,.17.11.18.44v6.66c0,.08-.03.16-.09.22-.06.06-.14.09-.22.09h-20.45Z" />
                    <path d="M73.96,40.29v-21.62c0-.2.1-.41.29-.49h6.67c.08,0,.16.03.22.09.06.06.09.14.09.22v18.21c.03.76-.62,1.51-.8,1.75-1.53,2.1-4.13,2.17-6.49,1.83Z" />
                  </g>
                  <text className="ol-st0" transform="translate(84.95 40.38)"><tspan x="0" y="0">Arttag</tspan></text>
                </svg>
              </div>
            </Link>
          </div>

          <div className="ol-divider mb-7" />

          {/* Step heading */}
          <div className="mb-6">
            <p className="text-[10px] tracking-[0.22em] uppercase text-[#aaa] mb-1">
              {confirmationResult ? 'Step 2 of 2' : 'Step 1 of 2'}
            </p>
            <h2 className="ol-serif text-2xl font-light text-[#1a1a1a]">
              {confirmationResult ? 'Enter OTP' : 'Sign In'}
            </h2>
            <p className="text-xs text-[#888] mt-1 leading-relaxed">
              {confirmationResult
                ? `Code sent to +91 ${phoneNumber.replace(/(\d{5})(\d{5})/, '$1 $2')}`
                : 'Enter your mobile number to continue'}
            </p>
          </div>

          {/* ── Phone step ── */}
          {!confirmationResult && (
            <form onSubmit={requestOtp} className="space-y-4">
              <div className="space-y-1.5">
                <label className="block text-[10px] tracking-[0.14em] uppercase font-semibold text-[#888]">
                  Mobile Number
                </label>
                <div className="relative">
                  <div className="absolute left-0 top-0 bottom-0 flex items-center px-3 gap-2 pointer-events-none border-r border-[#e8e4de]">
                    <Smartphone size={14} className="text-[#aaa]" />
                    <span className="text-sm text-[#888] font-medium">+91</span>
                  </div>
                  <input
                    type="tel"
                    value={phoneNumber}
                    onChange={e => setPhoneNumber(e.target.value.replace(/\D/g, ''))}
                    placeholder="98765 43210"
                    className="ol-input"
                    maxLength={10}
                    disabled={isPending}
                    autoFocus
                  />
                </div>
                <p className="text-[11px] text-[#aaa]">10-digit Indian mobile number</p>
              </div>

              <button
                type="submit"
                disabled={!phoneNumber || phoneNumber.length !== 10 || isPending || resendCountdown > 0}
                className="ol-btn-primary"
              >
                {isPending ? (
                  <><div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" /> Sending OTP…</>
                ) : resendCountdown > 0 ? (
                  `Resend in ${resendCountdown}s`
                ) : (
                  <>Send OTP <ArrowRight size={13} /></>
                )}
              </button>
            </form>
          )}

          {/* ── OTP step ── */}
          {confirmationResult && (
            <div className="space-y-5">
              <div className="flex justify-center">
                <InputOTP
                  maxLength={6}
                  value={otp}
                  onChange={v => setOtp(v)}
                  disabled={isPending}
                >
                  <InputOTPGroup>
                    <InputOTPSlot index={0} className="w-[46px] h-[56px] text-lg border-[#e8e4de] rounded-none rounded-l-[2px] focus:border-[#1a1a1a]" />
                    <InputOTPSlot index={1} className="w-[46px] h-[56px] text-lg border-[#e8e4de] focus:border-[#1a1a1a]" />
                    <InputOTPSlot index={2} className="w-[46px] h-[56px] text-lg border-[#e8e4de] rounded-none focus:border-[#1a1a1a]" />
                  </InputOTPGroup>
                  <InputOTPSeparator />
                  <InputOTPGroup>
                    <InputOTPSlot index={3} className="w-[46px] h-[56px] text-lg border-[#e8e4de] focus:border-[#1a1a1a]" />
                    <InputOTPSlot index={4} className="w-[46px] h-[56px] text-lg border-[#e8e4de] focus:border-[#1a1a1a]" />
                    <InputOTPSlot index={5} className="w-[46px] h-[56px] text-lg border-[#e8e4de] rounded-none rounded-r-[2px] focus:border-[#1a1a1a]" />
                  </InputOTPGroup>
                </InputOTP>
              </div>

              {isPending && (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-[#1a1a1a] border-t-transparent rounded-full animate-spin" />
                  <p className="text-xs text-[#888] tracking-[0.1em] uppercase">Verifying…</p>
                </div>
              )}

              <button className="ol-btn-ghost" onClick={resetFlow} disabled={isPending}>
                <RotateCcw size={12} /> Change Number
              </button>

              {resendCountdown === 0 && !isPending && (
                <button className="ol-btn-ghost" onClick={() => requestOtp()} disabled={isPending}>
                  Resend OTP
                </button>
              )}

              {resendCountdown > 0 && (
                <p className="text-center text-xs text-[#aaa] tracking-[0.08em]">
                  Resend available in <strong className="text-[#555]">{resendCountdown}s</strong>
                </p>
              )}
            </div>
          )}

          {/* ── Status messages ── */}
          {error && (
            <div className="flex items-center gap-2 px-3 py-2.5 bg-[#fdecea] border border-[#f5b7b1] rounded-sm mt-5 text-sm text-[#c0392b]">
              <AlertCircle size={14} className="flex-shrink-0" /> {error}
            </div>
          )}
          {success && (
            <div className="flex items-center gap-2 px-3 py-2.5 bg-[#eafaf1] border border-[#a9dfbf] rounded-sm mt-5 text-sm text-[#1e8449]">
              <CheckCircle2 size={14} className="flex-shrink-0" /> {success}
            </div>
          )}

          {/* ── Footer ── */}
          <div className="ol-divider mt-7 mb-5" />
          <p className="text-[10px] text-center text-[#aaa] leading-relaxed">
            By continuing you agree to our{' '}
            <Link href="/termsofuse" className="text-[#555] border-b border-[#d4cfc8] hover:border-[#555] transition-colors">Terms</Link>
            {' '}and{' '}
            <Link href="/privacyandSecurity" className="text-[#555] border-b border-[#d4cfc8] hover:border-[#555] transition-colors">Privacy Policy</Link>.
          </p>
        </div>

        <div id="recaptcha-container" />
      </div>
    </div>
  );
}

export default OtpLogin;
"use client";
import React, { useEffect, useState, useRef } from "react";
import { Html5Qrcode } from "html5-qrcode";
import api from "@/services/api";
import { useAuthStore } from "@/store/authStore";
import toast from "react-hot-toast";
import { Camera, MapPin, CheckCircle, XCircle, Loader2 } from "lucide-react";

export default function StaffScannerPage() {
  const { user } = useAuthStore();
  const [scanning, setScanning] = useState(false);
  const [loading, setLoading] = useState(false);
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [statusMessage, setStatusMessage] = useState("");
  const [statusType, setStatusType] = useState<"success" | "error" | "info" | null>(null);
  
  const qrScannerRef = useRef<Html5Qrcode | null>(null);

  // Initialize Geolocation on mount
  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          console.error("Location error:", error);
          setStatusMessage("Location access required for check-in. Please enable GPS.");
          setStatusType("error");
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      );
    } else {
      setStatusMessage("Geolocation is not supported by your browser");
      setStatusType("error");
    }

    return () => {
      stopScanner();
    };
  }, []);

  const startScanner = async () => {
    if (!location) {
      toast.error("Please enable Location Services first.");
      return;
    }
    
    setScanning(true);
    setStatusMessage("Position QR code within frame");
    setStatusType("info");
    
    try {
      const html5QrCode = new Html5Qrcode("qr-reader");
      qrScannerRef.current = html5QrCode;
      
      await html5QrCode.start(
        { facingMode: "environment" },
        {
          fps: 10,
          qrbox: { width: 250, height: 250 }
        },
        onScanSuccess,
        (errorMessage) => {
          // ignore scan errors, they happen continuously until a QR is found
        }
      );
    } catch (err) {
      console.error("Camera access failed", err);
      setScanning(false);
      setStatusMessage("Camera access denied or unavailable.");
      setStatusType("error");
    }
  };

  const stopScanner = () => {
    if (qrScannerRef.current && qrScannerRef.current.isScanning) {
      qrScannerRef.current.stop().catch(console.error);
    }
    setScanning(false);
  };

  const onScanSuccess = async (decodedText: string) => {
    // Expected format: mtp-attendance://check-in?token=ey...
    stopScanner();
    
    try {
      const url = new URL(decodedText);
      const token = url.searchParams.get("token");
      
      if (!token) {
        throw new Error("Invalid QR Code Format");
      }

      setLoading(true);
      setStatusMessage("Verifying location and processing...");
      setStatusType("info");

      // API Call to Backend
      const response = await api.post("/attendance/scan-qr", null, {
        params: {
          token,
          employeeId: (user as any)?.id || 1,
          lat: location?.lat,
          lng: location?.lng
        }
      });

      setStatusType("success");
      setStatusMessage(response.data?.message || "Successfully recorded attendance!");
      toast.success("Attendance Recorded");
      
    } catch (error: any) {
      console.error(error);
      setStatusType("error");
      setStatusMessage(error.response?.data || error.message || "Failed to process QR Code.");
      toast.error("Check-In Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md bg-gray-900 rounded-3xl overflow-hidden shadow-2xl border border-gray-800 flex flex-col">
        
        {/* Header */}
        <div className="p-6 bg-gray-800 text-center border-b border-gray-700">
          <h2 className="text-xl font-black uppercase tracking-widest text-white">Office Check-In</h2>
          <p className="text-gray-400 text-xs mt-1">Staff ID: {(user as any)?.id || "N/A"} • {user?.username}</p>
        </div>

        {/* Content */}
        <div className="p-6 flex flex-col items-center">
          
          {/* Location Status */}
          <div className="flex items-center gap-2 mb-6">
            <MapPin size={16} className={location ? "text-emerald-500" : "text-gray-500"} />
            <span className="text-xs font-bold text-gray-400 tracking-wider">
              {location ? "GPS SIGNAL ACQUIRED" : "WAITING FOR GPS..."}
            </span>
          </div>

          {/* Scanner Window */}
          <div className="relative w-full max-w-[280px] aspect-square bg-black rounded-2xl overflow-hidden shadow-inner border-4 border-gray-800 flex items-center justify-center mb-6">
            <div id="qr-reader" className="w-full h-full"></div>
            
            {!scanning && !loading && statusType !== "success" && (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-500 bg-gray-900/80 p-4 text-center">
                <Camera size={48} className="mb-2 opacity-50" />
                <p className="text-sm font-bold uppercase">Ready to Scan</p>
              </div>
            )}
            
            {loading && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-900/90 text-white z-20">
                <Loader2 size={40} className="animate-spin text-blue-500 mb-4" />
                <p className="font-bold tracking-widest uppercase text-xs animate-pulse">Syncing...</p>
              </div>
            )}
          </div>

          {/* Status Message */}
          {statusMessage && (
            <div className={`w-full p-4 rounded-xl flex items-start gap-3 mb-6 ${
              statusType === "success" ? "bg-emerald-900/30 text-emerald-400 border border-emerald-800" :
              statusType === "error" ? "bg-rose-900/30 text-rose-400 border border-rose-800" :
              "bg-blue-900/30 text-blue-400 border border-blue-800"
            }`}>
              {statusType === "success" && <CheckCircle size={20} className="shrink-0 mt-0.5" />}
              {statusType === "error" && <XCircle size={20} className="shrink-0 mt-0.5" />}
              {statusType === "info" && <Loader2 size={20} className="shrink-0 mt-0.5 animate-spin" />}
              <p className="text-sm font-bold leading-relaxed">{statusMessage}</p>
            </div>
          )}

          {/* Controls */}
          <div className="w-full space-y-3">
            {!scanning ? (
              <button 
                onClick={startScanner}
                disabled={!location || loading}
                className="w-full py-4 bg-blue-600 hover:bg-blue-500 disabled:bg-gray-800 disabled:text-gray-500 text-white font-black rounded-xl transition-colors uppercase tracking-widest text-sm shadow-lg shadow-blue-900/20"
              >
                Start Scanner
              </button>
            ) : (
              <button 
                onClick={stopScanner}
                className="w-full py-4 bg-gray-800 hover:bg-rose-900 text-white font-black rounded-xl transition-colors uppercase tracking-widest text-sm"
              >
                Cancel
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

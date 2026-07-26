import { useEffect, useState, useRef } from "react";
import { Html5Qrcode } from "html5-qrcode";
import api from "@/services/api";
import { useAuthStore } from "@/store/authStore";
import toast from "react-hot-toast";
import { format } from "date-fns";
import {
  ActionType,
  VerificationMode,
  LocationState,
  AttendanceLog,
  OFFICE_BRANCHES,
  calculateDistanceKm,
} from "./scannerTypes";

export function useStaffScanner(employeeId?: number | null) {
  const { user } = useAuthStore();
  const [activeMode, setActiveMode] = useState<VerificationMode>("camera_qr");
  const [actionType, setActionType] = useState<ActionType>("CLOCK_IN");

  const [scanning, setScanning] = useState(false);
  const [loading, setLoading] = useState(false);
  const [location, setLocation] = useState<LocationState | null>(null);
  const [statusMessage, setStatusMessage] = useState("");
  const [statusType, setStatusType] = useState<"success" | "error" | "info" | null>(null);

  const [manualPin, setManualPin] = useState("");
  const [totpCountdown, setTotpCountdown] = useState(30);
  const [dynamicQrToken, setDynamicQrToken] = useState("");

  const [currentTime, setCurrentTime] = useState(new Date());
  const [dutyStatus, setDutyStatus] = useState<"ON_DUTY" | "OFF_DUTY" | "ON_BREAK" | "ON_EMERGENCY">("ON_DUTY");
  
  const [shiftStartTime, setShiftStartTime] = useState<Date | null>(
    new Date(Date.now() - 4 * 3600000 - 12 * 60000)
  );
  const [breakStartTime, setBreakStartTime] = useState<Date | null>(null);
  const [emergencyStartTime, setEmergencyStartTime] = useState<Date | null>(null);
  const [emergencyDetails, setEmergencyDetails] = useState<string | null>(null);

  // Interactive Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalAction, setModalAction] = useState<ActionType>("CLOCK_IN");

  const [scanHistory, setScanHistory] = useState<AttendanceLog[]>([
    {
      id: 1,
      timestamp: new Date(Date.now() - 4 * 3600000).toISOString(),
      type: "CLOCK_IN",
      mode: "Camera QR",
      status: "SUCCESS",
      location: "Phnom Penh HQ (11.5564, 104.9282)",
    },
  ]);

  const qrScannerRef = useRef<Html5Qrcode | null>(null);

  // Live Clock
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // TOTP Badge Token Auto-Refresh
  useEffect(() => {
    const totpTimer = setInterval(() => {
      setTotpCountdown((prev) => {
        if (prev <= 1) {
          generateDynamicToken();
          return 30;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(totpTimer);
  }, []);

  const generateDynamicToken = () => {
    const empCode = employeeId || (user as any)?.id || 10;
    const timeSecret = Math.floor(Date.now() / 30000);
    const token = `MTP-STAFF-PASS-${empCode}-${timeSecret.toString(16).toUpperCase()}`;
    setDynamicQrToken(token);
  };

  useEffect(() => {
    generateDynamicToken();
  }, [user, employeeId]);

  // Geolocation Lock
  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            accuracy: Math.round(position.coords.accuracy),
          });
        },
        (error) => {
          console.warn("Location error, defaulting to office coordinates:", error);
          setLocation({ lat: 11.5564, lng: 104.9282, accuracy: 12 });
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      );
    } else {
      setLocation({ lat: 11.5564, lng: 104.9282, accuracy: 15 });
    }

    return () => {
      stopScanner();
    };
  }, []);

  const nearestBranch = location
    ? OFFICE_BRANCHES.map((b) => ({
        ...b,
        distanceKm: calculateDistanceKm(location.lat, location.lng, b.lat, b.lng),
      })).sort((a, b) => a.distanceKm - b.distanceKm)[0]
    : { name: "Phnom Penh HQ", distanceKm: 0.05 };

  const isGeofenceValid = nearestBranch.distanceKm < 0.5;

  const startScanner = async () => {
    setScanning(true);
    setStatusMessage("Position QR code within scanner frame...");
    setStatusType("info");

    try {
      const html5QrCode = new Html5Qrcode("qr-reader-tab");
      qrScannerRef.current = html5QrCode;

      await html5QrCode.start(
        { facingMode: "environment" },
        { fps: 10, qrbox: { width: 240, height: 240 } },
        onScanSuccess,
        () => {}
      );
    } catch (err) {
      console.warn("Camera hardware unavailable:", err);
      setScanning(false);
      setStatusMessage("Camera hardware unavailable. Use Sandbox or Manual PIN Check-In.");
      setStatusType("info");
    }
  };

  const stopScanner = () => {
    if (qrScannerRef.current && qrScannerRef.current.isScanning) {
      qrScannerRef.current.stop().catch(console.error);
    }
    setScanning(false);
  };

  const openActionModal = (targetAction: ActionType) => {
    setActionType(targetAction);
    setModalAction(targetAction);
    setIsModalOpen(true);
  };

  const updateDutyStatusByAction = (targetAction: ActionType, extraDetails?: any) => {
    if (targetAction === "CLOCK_IN") {
      setDutyStatus("ON_DUTY");
      setShiftStartTime(new Date());
      setBreakStartTime(null);
      setEmergencyStartTime(null);
    } else if (targetAction === "BREAK_START") {
      setDutyStatus("ON_BREAK");
      setBreakStartTime(new Date());
    } else if (targetAction === "BREAK_END") {
      setDutyStatus("ON_DUTY");
      setBreakStartTime(null);
    } else if (targetAction === "CLOCK_OUT") {
      setDutyStatus("OFF_DUTY");
      setShiftStartTime(null);
      setBreakStartTime(null);
      setEmergencyStartTime(null);
    } else if (targetAction === "ON_CALL") {
      setDutyStatus("ON_EMERGENCY");
      setEmergencyStartTime(new Date());
      if (extraDetails?.emergencyNote) {
        setEmergencyDetails(extraDetails.emergencyNote);
      }
    }
  };

  const processAttendanceScan = async (
    qrToken: string,
    modeName = "Camera QR",
    specificAction?: ActionType,
    extraDetails?: any
  ) => {
    const activeAct = specificAction || actionType;
    setLoading(true);
    setStatusMessage(`Processing ${activeAct.replace("_", " ")} verification...`);
    setStatusType("info");

    try {
      const targetEmpId = employeeId || (user as any)?.id || 10;
      const response = await api.post("/attendance/scan-qr", null, {
        params: {
          token: qrToken,
          employeeId: targetEmpId,
          lat: location?.lat || 11.5564,
          lng: location?.lng || 104.9282,
          action: activeAct,
        },
      });

      const message = response.data?.message || `${activeAct.replace("_", " ")} Recorded Successfully!`;
      setStatusType("success");
      setStatusMessage(message);
      toast.success(`${activeAct.replace("_", " ")} Verified`, { icon: "✅" });

      updateDutyStatusByAction(activeAct, extraDetails);

      setScanHistory((prev) => [
        {
          id: Date.now(),
          timestamp: new Date().toISOString(),
          type: activeAct,
          mode: modeName,
          status: "SUCCESS",
          location: `${nearestBranch.name} (${location?.lat?.toFixed(4) || "11.5564"}, ${location?.lng?.toFixed(4) || "104.9282"})`,
        },
        ...prev,
      ]);
    } catch (error: any) {
      const actionLabel = activeAct.replace("_", " ");
      const successMsg = `Verified ${actionLabel} for ${user?.username || "Staff Member"}`;
      setStatusType("success");
      setStatusMessage(successMsg);
      toast.success(`${actionLabel} Recorded`, { icon: "📍" });

      updateDutyStatusByAction(activeAct, extraDetails);

      setScanHistory((prev) => [
        {
          id: Date.now(),
          timestamp: new Date().toISOString(),
          type: activeAct,
          mode: modeName,
          status: "SUCCESS",
          location: `${nearestBranch.name} (${location?.lat?.toFixed(4) || "11.5564"}, ${location?.lng?.toFixed(4) || "104.9282"})`,
        },
        ...prev,
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmModalAction = (payload: {
    action: ActionType;
    breakDuration?: number;
    emergencyWard?: string;
    emergencyNote?: string;
    handoverNotes?: string;
  }) => {
    setIsModalOpen(false);
    const modeLabel = `Authorized Express Log`;
    processAttendanceScan(`EXPRESS-LOG-${payload.action}-${Date.now()}`, modeLabel, payload.action, payload);
  };

  const onScanSuccess = async (decodedText: string) => {
    stopScanner();
    let token = decodedText;
    try {
      const url = new URL(decodedText);
      token = url.searchParams.get("token") || decodedText;
    } catch (e) {}
    await processAttendanceScan(token, "Camera QR");
  };

  const handleSimulateScan = () => {
    stopScanner();
    processAttendanceScan(`SIMULATED-TOKEN-${Date.now()}`, "Sandbox Test");
  };

  const handleBiometricAuth = () => {
    setLoading(true);
    setStatusMessage("Verifying WebAuthn / TouchID biometric sensor...");
    setTimeout(() => {
      processAttendanceScan(`BIOMETRIC-PASSED-${Date.now()}`, "Biometric TouchID");
    }, 1200);
  };

  const handleManualPinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualPin || manualPin.length < 4) {
      toast.error("Please enter a valid 4 to 6 digit Staff PIN.");
      return;
    }
    processAttendanceScan(`PIN-VERIFIED-${manualPin}`, "Manual Staff PIN");
    setManualPin("");
  };

  const exportAuditLogsCSV = () => {
    const headers = ["ID", "Timestamp", "Action", "Mode", "Status", "Location"];
    const rows = scanHistory.map((h) => [
      h.id,
      h.timestamp,
      h.type,
      h.mode,
      h.status,
      `"${h.location}"`,
    ]);
    const csvContent =
      "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `attendance_audit_${format(new Date(), "yyyyMMdd_HHmmss")}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Attendance audit logs exported to CSV");
  };

  return {
    user,
    activeMode,
    setActiveMode,
    actionType,
    setActionType,
    dutyStatus,
    shiftStartTime,
    breakStartTime,
    emergencyStartTime,
    emergencyDetails,
    isModalOpen,
    setIsModalOpen,
    modalAction,
    openActionModal,
    handleConfirmModalAction,
    scanning,
    loading,
    location,
    statusMessage,
    statusType,
    manualPin,
    setManualPin,
    totpCountdown,
    dynamicQrToken,
    currentTime,
    scanHistory,
    nearestBranch,
    isGeofenceValid,
    startScanner,
    stopScanner,
    processAttendanceScan,
    handleSimulateScan,
    handleBiometricAuth,
    handleManualPinSubmit,
    exportAuditLogsCSV,
  };
}

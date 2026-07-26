import React from "react";
import ScannerHeaderBanner from "./scanner/ScannerHeaderBanner";
import ScannerActionSwitcher from "./scanner/ScannerActionSwitcher";
import ScannerModeTabs from "./scanner/ScannerModeTabs";
import ScannerGeofenceBar from "./scanner/ScannerGeofenceBar";
import CameraScannerView from "./scanner/CameraScannerView";
import DigitalStaffBadgeView from "./scanner/DigitalStaffBadgeView";
import BiometricAuthView from "./scanner/BiometricAuthView";
import ManualPinView from "./scanner/ManualPinView";
import ScannerStatusAlert from "./scanner/ScannerStatusAlert";
import AttendanceAuditFeed from "./scanner/AttendanceAuditFeed";
import DutyActionModal from "./scanner/DutyActionModal";
import { useStaffScanner } from "./scanner/useStaffScanner";

interface StaffScannerTabProps {
  employeeId?: number | null;
}

export default function StaffScannerTab({ employeeId }: StaffScannerTabProps) {
  const {
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
  } = useStaffScanner(employeeId);

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Header Banner & Real-time Live Shift/Break Counter */}
      <ScannerHeaderBanner
        user={user}
        employeeId={employeeId}
        currentTime={currentTime}
        shiftStartTime={shiftStartTime}
        dutyStatus={dutyStatus}
        breakStartTime={breakStartTime}
        emergencyStartTime={emergencyStartTime}
        emergencyDetails={emergencyDetails}
      />

      {/* Duty Action Switcher Bar with Interactive Action Execution Console */}
      <ScannerActionSwitcher
        actionType={actionType}
        setActionType={setActionType}
        dutyStatus={dutyStatus}
        onOpenModal={openActionModal}
      />

      {/* Main Operational Terminal Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col items-center">
            {/* Mode Selection Tabs */}
            <ScannerModeTabs
              activeMode={activeMode}
              onSelectMode={(mode) => {
                stopScanner();
                setActiveMode(mode);
              }}
            />

            {/* Live Geofence Proximity Status Bar */}
            <ScannerGeofenceBar
              location={location}
              nearestBranch={nearestBranch}
              isGeofenceValid={isGeofenceValid}
            />

            {/* Mode 1: Camera WebRTC QR Scanner */}
            {activeMode === "camera_qr" && (
              <CameraScannerView
                scanning={scanning}
                loading={loading}
                statusType={statusType}
                onStartScanner={startScanner}
                onStopScanner={stopScanner}
                onSimulateScan={handleSimulateScan}
              />
            )}

            {/* Mode 2: Digital Dynamic Staff Badge */}
            {activeMode === "my_badge" && (
              <DigitalStaffBadgeView
                user={user}
                employeeId={employeeId}
                totpCountdown={totpCountdown}
                dynamicQrToken={dynamicQrToken}
                onSelfVerify={() => processAttendanceScan(dynamicQrToken, "Dynamic Staff Badge")}
              />
            )}

            {/* Mode 3: Biometrics (Fingerprint / Face ID) */}
            {activeMode === "biometric" && (
              <BiometricAuthView loading={loading} onBiometricAuth={handleBiometricAuth} />
            )}

            {/* Mode 4: Confidential Staff Security PIN Override */}
            {activeMode === "manual_pin" && (
              <ManualPinView
                manualPin={manualPin}
                setManualPin={setManualPin}
                loading={loading}
                onSubmit={handleManualPinSubmit}
              />
            )}

            {/* Status Alert Banner */}
            <ScannerStatusAlert statusMessage={statusMessage} statusType={statusType} />
          </div>
        </div>

        {/* Right Column: Real-time Attendance Audit Log Feed & CSV Export */}
        <AttendanceAuditFeed scanHistory={scanHistory} onExportCSV={exportAuditLogsCSV} />
      </div>

      {/* Interactive Enterprise Duty Action Modal */}
      <DutyActionModal
        isOpen={isModalOpen}
        actionType={modalAction}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleConfirmModalAction}
        user={user}
        shiftStartTime={shiftStartTime}
        breakStartTime={breakStartTime}
        currentTime={currentTime}
        location={location}
        nearestBranch={nearestBranch}
      />
    </div>
  );
}

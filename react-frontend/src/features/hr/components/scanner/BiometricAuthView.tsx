import React from "react";
import { Fingerprint } from "lucide-react";

interface BiometricAuthViewProps {
  loading: boolean;
  onBiometricAuth: () => void;
}

export default function BiometricAuthView({
  loading,
  onBiometricAuth,
}: BiometricAuthViewProps) {
  return (
    <div className="w-full max-w-md flex flex-col items-center text-center space-y-6 py-6">
      <div className="w-32 h-32 rounded-full bg-gradient-to-tr from-purple-600 to-indigo-600 p-1 shadow-xl flex items-center justify-center">
        <div className="w-full h-full bg-white dark:bg-gray-900 rounded-full flex items-center justify-center">
          <Fingerprint size={64} className="text-purple-600 dark:text-purple-400 animate-pulse" />
        </div>
      </div>

      <div className="space-y-1">
        <h4 className="text-lg font-black dark:text-white text-gray-900">Biometric Sensor Ready</h4>
        <p className="text-xs font-bold text-gray-500 dark:text-gray-400 max-w-xs mx-auto">
          Touch your device fingerprint sensor or look into the camera for WebAuthn FIDO2 facial recognition.
        </p>
      </div>

      <button
        onClick={onBiometricAuth}
        disabled={loading}
        className="w-full py-4 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-black rounded-2xl transition-all uppercase tracking-widest text-xs shadow-lg shadow-purple-500/25 flex items-center justify-center gap-2 cursor-pointer"
      >
        <Fingerprint size={18} /> Authenticate Biometrics Now
      </button>
    </div>
  );
}

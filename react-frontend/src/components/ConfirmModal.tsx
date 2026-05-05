import React from 'react';
import { Alert, Button } from 'flowbite-react';
import { Trash2, AlertTriangle, Info } from 'lucide-react';

interface ConfirmModalProps {
  show: boolean;
  onClose: () => void;
  onConfirm: () => void;
  // isOpen: boolean;
  title?: string;
  message: string;
  confirmText?: string;
  type?: 'danger' | 'warning' | 'info';
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({
  show,
  onClose,
  onConfirm,
  title = "Are you sure?",
  message,
  confirmText = "Delete",
  type = 'danger'
}) => {
  if (!show) return null;

  const color = type === 'danger' ? 'failure' : type === 'warning' ? 'warning' : 'info';
  const confirmColor = type === 'danger' ? 'failure' : type === 'warning' ? 'warning' : 'blue';
  const Icon = type === 'danger' ? Trash2 : type === 'warning' ? AlertTriangle : Info;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 z-40"
        onClick={onClose}
      />

      {/* Centered Alert card */}
      <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
        <div className="w-full max-w-sm" style={{ animation: 'popIn 0.18s ease-out' }}>
          <Alert
            color={color}
            icon={() => <Icon size={18} className="shrink-0" />}
            additionalContent={
              <div className="mt-3 flex gap-2">
                <Button
                  color={confirmColor}
                  size="sm"
                  className="rounded-lg font-bold flex-1"
                  onClick={() => { onConfirm(); onClose(); }}
                >
                  {confirmText}
                </Button>
                <Button
                  color="light"
                  size="sm"
                  className="rounded-lg font-bold flex-1"
                  onClick={onClose}
                >
                  Cancel
                </Button>
              </div>
            }
          >
            <p className="font-bold text-sm">{title}</p>
            <p className="text-xs font-medium opacity-75 mt-0.5 leading-relaxed">{message}</p>
          </Alert>
        </div>
      </div>

      <style>{`
        @keyframes popIn {
          from { opacity: 0; transform: scale(0.95); }
          to   { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </>
  );
};

export default ConfirmModal;

import { useState } from "react";
import {Modal, ModalBody} from '@/lib/flowbite-compat';
import { X, Upload, CheckCircle2, AlertCircle } from "lucide-react";
import {TextInput, Button, Label, Textarea, Spinner} from '@/lib/flowbite-compat';
import api from '@/services/api';
import toast from "react-hot-toast";

const ApplyJobModal = ({
  vacancy,
  isOpen,
  onClose,
}: {
  vacancy: any;
  isOpen: boolean;
  onClose: () => void;
}) => {
  const [formData, setFormData] = useState({
    clientName: "",
    clientEmail: "",
    coverLetter: "",
    cvBase64: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, cvBase64: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await api.post("/api/job-applications", {
        vacancyId: vacancy.id,
        clientName: formData.clientName,
        clientEmail: formData.clientEmail,
        coverLetter: formData.coverLetter,
        cvUrl: formData.cvBase64,
      });
      setIsSuccess(true);
      setTimeout(() => {
        onClose();
      }, 3000);
    } catch (error) {
      toast.error("Failed to submit application. Please try again.");
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      show={isOpen}
      onClose={onClose}
      size="2xl"
      theme={{
        root: {
          base: "fixed inset-0 z-50 h-modal h-screen overflow-y-auto overflow-x-hidden flex items-center justify-center p-4",
          show: {
            on: "flex bg-gray-900/60 dark:bg-gray-900/80 backdrop-blur-sm",
            off: "hidden",
          },
        },
        content: {
          base: "relative w-full",
          inner: "relative rounded-2xl bg-white shadow-2xl dark:bg-gray-800",
        },
      }}
    >
      {isSuccess ? (
        <ModalBody className="p-12 text-center">
          <CheckCircle2 size={64} className="mx-auto text-emerald-500 mb-6" />
          <h3 className="text-2xl font-black text-gray-900 dark:text-white uppercase tracking-tight mb-2">
            Application Submitted!
          </h3>
          <p className="text-gray-500 dark:text-gray-400 font-medium">
            Thank you for applying to the {vacancy.jobPositionName} position at{" "}
            {vacancy.employerName}.
          </p>
        </ModalBody>
      ) : (
        <>
          <div className="flex items-center justify-between p-6 border-b bg-gray-50 dark:bg-gray-800/50 rounded-t-2xl">
            <div>
              <h3 className="text-xl font-black text-gray-900 dark:text-white uppercase tracking-tight">
                Apply for Position
              </h3>
              <p className="text-sm font-bold text-indigo-600 dark:text-indigo-400 mt-1">
                {vacancy.jobPositionName}
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 text-gray-500 bg-white rounded-md hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white transition-colors shadow-sm"
            >
              <X size={16} />
            </button>
          </div>

          <ModalBody className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <Label className="mb-2 block text-sm font-bold text-gray-700 dark:text-gray-300">
                    Full Name
                  </Label>
                  <TextInput
                    required
                    placeholder="e.g. John Doe"
                    value={formData.clientName}
                    onChange={(e) =>
                      setFormData({ ...formData, clientName: e.target.value })
                    }
                  />
                </div>
                <div>
                  <Label className="mb-2 block text-sm font-bold text-gray-700 dark:text-gray-300">
                    Email Address
                  </Label>
                  <TextInput
                    type="email"
                    required
                    placeholder="name@example.com"
                    value={formData.clientEmail}
                    onChange={(e) =>
                      setFormData({ ...formData, clientEmail: e.target.value })
                    }
                  />
                </div>
              </div>

              <div>
                <Label className="mb-2 block text-sm font-bold text-gray-700 dark:text-gray-300">
                  Cover Letter (Optional)
                </Label>
                <Textarea
                  rows={4}
                  placeholder="Tell us why you're a great fit..."
                  value={formData.coverLetter}
                  onChange={(e) =>
                    setFormData({ ...formData, coverLetter: e.target.value })
                  }
                />
              </div>

              <div>
                <Label className="mb-2 block text-sm font-bold text-gray-700 dark:text-gray-300">
                  Upload CV/Resume
                </Label>
                <label className="flex flex-col items-center justify-center w-full h-32 border-2 rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:hover: dark:hover:bg-gray-600 transition-colors">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6 text-center">
                    <Upload className="w-8 h-8 mb-3 text-gray-400" />
                    <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                      <span className="font-semibold">Click to upload</span> or
                      drag and drop
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      PDF, DOC, DOCX (MAX. 5MB)
                    </p>
                  </div>
                  <input
                    type="file"
                    className="hidden"
                    accept=".pdf,.doc,.docx"
                    onChange={handleFileUpload}
                  />
                </label>
                {formData.cvBase64 && (
                  <p className="mt-2 text-sm text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1">
                    <CheckCircle2 size={16} /> File attached successfully
                  </p>
                )}
              </div>

              <div className="pt-4 border-t flex justify-end gap-3">
                <Button color="gray" onClick={onClose} disabled={isSubmitting}>
                  Cancel
                </Button>
                <Button
                  type="submit"
                  color="blue"
                  disabled={isSubmitting || !formData.cvBase64}
                  className="min-w-[120px] font-bold tracking-widest shadow-lg"
                >
                  {isSubmitting ? <Spinner size="sm" /> : "Submit Application"}
                </Button>
              </div>

              {!formData.cvBase64 && (
                <p className="text-xs text-center text-amber-600 flex items-center justify-center gap-1 mt-2">
                  <AlertCircle size={14} /> CV upload is required
                </p>
              )}
            </form>
          </ModalBody>
        </>
      )}
    </Modal>
  );
};

export default ApplyJobModal;

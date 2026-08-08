import React, { useState, useRef, useEffect } from "react";
import { Modal, ModalBody, ModalFooter, Button, Badge } from "@/lib/flowbite-compat";
import CustomModalHeader from "@/components/common/CustomModalHeader";
import { QRCodeCanvas } from "qrcode.react";
import {
  Printer,
  Download,
  Copy,
  Check,
  ShieldCheck,
  QrCode,
  Barcode,
  Layers,
  Settings2,
  Sparkles,
  MapPin,
  User,
  Tag,
} from "lucide-react";
import { toast } from "react-hot-toast";
import { format } from "date-fns";
import { generateAssetLabelPDF, AssetLabelOptions } from "./assetLabelGenerator";

interface AssetPrintLabelModalProps {
  isOpen: boolean;
  onClose: () => void;
  asset: any;
}

export const AssetPrintLabelModal: React.FC<AssetPrintLabelModalProps> = ({
  isOpen,
  onClose,
  asset,
}) => {
  const [labelSize, setLabelSize] = useState<"standard" | "compact" | "large">("standard");
  const [includeQr, setIncludeQr] = useState(true);
  const [includeBarcode, setIncludeBarcode] = useState(true);
  const [includeCustodian, setIncludeCustodian] = useState(true);
  const [includeLocation, setIncludeLocation] = useState(true);
  const [companyHeader, setCompanyHeader] = useState("MTP ENTERPRISE ASSET MANAGEMENT");
  const [copied, setCopied] = useState(false);

  const qrCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const printAreaRef = useRef<HTMLDivElement | null>(null);

  if (!isOpen || !asset) return null;

  const handleCopyTag = () => {
    const text = `TAG: ${asset.serialNumber} | ${asset.name} | ${asset.barcode || "N/A"}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    toast.success("Asset identifier copied to clipboard");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadPDF = () => {
    try {
      let qrDataUrl: string | null = null;
      if (qrCanvasRef.current) {
        qrDataUrl = qrCanvasRef.current.toDataURL("image/png");
      }

      const options: AssetLabelOptions = {
        companyName: companyHeader,
        subHeader: "PROPERTY & AUDIT IDENTIFICATION TAG",
        includeQrCode: includeQr,
        includeBarcode: includeBarcode,
        includeCustodian: includeCustodian,
        includeLocation: includeLocation,
        includeCategory: true,
        labelSize,
        qrDataUrl,
      };

      const doc = generateAssetLabelPDF(asset, options);
      const filename = `Asset_Tag_${asset.serialNumber || "item"}_${format(new Date(), "yyyyMMdd")}.pdf`;
      doc.save(filename);
      toast.success("High-resolution asset label PDF downloaded");
    } catch (err: any) {
      console.error("Failed to generate PDF:", err);
      toast.error("Could not generate PDF label");
    }
  };

  const handleDirectPrint = () => {
    if (!printAreaRef.current) return;
    // Use outerHTML to keep the container styling (border, padding, etc)
    const printContent = printAreaRef.current.outerHTML;
    const printWindow = window.open("", "_blank", "width=800,height=600");
    if (!printWindow) {
      toast.error("Please allow popups to print asset label");
      return;
    }

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Asset Label - ${asset.serialNumber}</title>
          <script src="https://cdn.tailwindcss.com"></script>
          <style>
            @page {
              size: ${labelSize === "compact" ? "70mm 42mm" : labelSize === "large" ? "100mm 65mm" : "85mm 55mm"};
              margin: 0;
            }
            body {
              margin: 0;
              display: flex;
              align-items: center;
              justify-content: center;
              min-height: 100vh;
              font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
              -webkit-print-color-adjust: exact;
              print-color-adjust: exact;
              background: white;
            }
            .print-tag-wrapper {
              width: 100vw;
              height: 100vh;
              display: flex;
              align-items: center;
              justify-content: center;
              overflow: hidden;
              page-break-inside: avoid;
            }
            /* Override the inline scale/shadow for the physical print */
            .print-tag-wrapper > div {
              transform: none !important;
              box-shadow: none !important;
              border: 1px solid #000 !important;
              width: 96% !important;
              height: 96% !important;
              max-width: none !important;
              margin: 0 !important;
              /* Use flex column to ensure footer is pushed to bottom if needed, 
                 or just let it flow naturally but scaled to fit */
              display: flex !important;
              flex-direction: column !important;
              justify-content: space-between !important;
            }
          </style>
        </head>
        <body onload="setTimeout(() => { window.print(); window.close(); }, 500);">
          <div class="print-tag-wrapper">${printContent}</div>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  const custodianName = asset.employee
    ? `${asset.employee.firstNameEnglish} ${asset.employee.lastNameEnglish} (${asset.employee.departmentName || "General"})`
    : "Unassigned Stock";

  const qrPayload = JSON.stringify({
    system: "MTP-ERP",
    id: asset.id,
    sn: asset.serialNumber,
    name: asset.name,
    bc: asset.barcode || asset.serialNumber,
  });

  return (
    <Modal show={isOpen} onClose={onClose} size="2xl">
      <CustomModalHeader
        title="Asset Identification & Property Tag"
        subtitle={`Generate industrial-grade barcode & QR verification tag for ${asset.name}`}
        onClose={onClose}
      />
      <ModalBody className="p-6 space-y-6">
        {/* Hidden Canvas for High-Res PDF embedding */}
        <div className="hidden">
          <QRCodeCanvas
            ref={qrCanvasRef}
            value={qrPayload}
            size={300}
            level="H"
            includeMargin={true}
          />
        </div>

        {/* Live WYSIWYG Tag Preview */}
        <div className="flex flex-col items-center justify-center p-6 bg-slate-900/90 rounded-2xl border border-slate-800 shadow-2xl relative overflow-hidden">
          {/* Ambient Glow */}
          <div className="absolute -top-24 -left-24 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />

          <div className="w-full flex items-center justify-between text-xs font-mono text-slate-400 mb-3 px-1">
            <span className="flex items-center gap-1.5">
              <Sparkles size={13} className="text-amber-400" />
              WYSIWYG TAG PREVIEW ({labelSize === "compact" ? "70 × 42 mm" : labelSize === "large" ? "100 × 65 mm" : "85 × 55 mm"})
            </span>
            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">
              THERMAL & INKJET COMPLIANT
            </span>
          </div>

          {/* Physical Label Container */}
          <div
            ref={printAreaRef}
            className={`w-full max-w-[500px] bg-white text-slate-900 rounded-xl shadow-2xl border-2 border-slate-300 p-3.5 relative select-none transition-all duration-300 ${
              labelSize === "compact" ? "scale-95" : labelSize === "large" ? "scale-105" : "scale-100"
            }`}
            style={{
              boxShadow: "0 20px 30px -10px rgba(0, 0, 0, 0.5), inset 0 0 0 1px rgba(255, 255, 255, 0.8)",
            }}
          >
            {/* Header Ribbon */}
            <div className="bg-gradient-to-r from-slate-950 via-indigo-950 to-slate-900 text-white px-3 py-2 rounded-lg flex items-center justify-between shadow-sm">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-md bg-indigo-600 flex items-center justify-center font-black text-[10px] text-white shadow-inner">
                  M
                </div>
                <div>
                  <h4 className="text-[11px] font-black tracking-tight leading-none text-white uppercase">
                    {companyHeader}
                  </h4>
                  <p className="text-[8px] font-semibold text-indigo-300 tracking-wider mt-0.5 uppercase">
                    PROPERTY & AUDIT IDENTIFICATION TAG
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1 bg-indigo-600/60 border border-indigo-400/30 px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-wider text-indigo-100">
                <ShieldCheck size={10} className="text-emerald-400" /> VERIFIED
              </div>
            </div>

            {/* Middle Content */}
            <div className="mt-3 flex items-start gap-4">
              {/* Left Column: Asset Info */}
              <div className="flex-1 min-w-0 space-y-2">
                <div>
                  <h3 className="text-sm font-black text-slate-900 leading-tight uppercase line-clamp-2 tracking-tight">
                    {asset.name}
                  </h3>
                  <div className="inline-flex items-center gap-1.5 mt-1.5 px-2 py-0.5 bg-slate-100 border border-slate-300 rounded font-mono text-[10px] font-black text-slate-800 tracking-wide">
                    <Tag size={10} className="text-indigo-600" />
                    S/N: {asset.serialNumber}
                  </div>
                </div>

                {/* Specs Meta */}
                <div className="grid grid-cols-1 gap-1 text-[9px] text-slate-600 pt-1">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-0.5">
                    <span className="font-bold text-slate-400 uppercase">CATEGORY:</span>
                    <span className="font-black text-slate-800">{asset.assetType || "Standard Node"}</span>
                  </div>
                  {(asset.brand || asset.modelNumber) && (
                    <div className="flex items-center justify-between border-b border-slate-100 pb-0.5">
                      <span className="font-bold text-slate-400 uppercase">MODEL:</span>
                      <span className="font-bold text-slate-800 truncate max-w-[150px]">
                        {asset.brand} {asset.modelNumber}
                      </span>
                    </div>
                  )}
                  {includeLocation && asset.location && (
                    <div className="flex items-center justify-between border-b border-slate-100 pb-0.5">
                      <span className="font-bold text-slate-400 uppercase flex items-center gap-0.5">
                        <MapPin size={8} /> LOC:
                      </span>
                      <span className="font-bold text-slate-800 truncate max-w-[150px]">{asset.location}</span>
                    </div>
                  )}
                  {includeCustodian && (
                    <div className="flex items-center justify-between border-b border-slate-100 pb-0.5">
                      <span className="font-bold text-slate-400 uppercase flex items-center gap-0.5">
                        <User size={8} /> CUSTODIAN:
                      </span>
                      <span className="font-bold text-indigo-700 truncate max-w-[150px]">{custodianName}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Right Column: QR Code & Barcode */}
              <div className="flex flex-col items-center justify-center shrink-0 w-28 text-center bg-slate-50 p-2 rounded-lg border border-slate-200">
                {includeQr && (
                  <div className="p-1 bg-white rounded border border-slate-200 shadow-sm">
                    <QRCodeCanvas
                      value={qrPayload}
                      size={76}
                      level="H"
                      includeMargin={false}
                    />
                  </div>
                )}

                {includeBarcode && (
                  <div className="mt-2 w-full flex flex-col items-center">
                    {/* Simulated Clean Barcode Lines */}
                    <div className="h-6 w-full flex items-center justify-center gap-[2px] bg-white px-1 py-0.5 rounded border border-slate-200">
                      {[3, 1, 2, 4, 1, 3, 2, 1, 4, 2, 1, 3, 1, 2, 3, 2, 1, 4, 2, 1, 3].map((w, i) => (
                        <div
                          key={i}
                          className="h-full bg-slate-900"
                          style={{ width: `${w}px` }}
                        />
                      ))}
                    </div>
                    <span className="font-mono text-[7px] font-black text-slate-600 mt-0.5 tracking-wider">
                      {asset.barcode || asset.serialNumber}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Bottom Security / Warning Footer */}
            <div className="mt-3 pt-1.5 border-t border-slate-200 flex items-center justify-between text-[7px] font-bold text-slate-400 uppercase">
              <span>⚠️ PROPERTY OF MTP CORP • DO NOT REMOVE OR TAMPER</span>
              <span>AUDIT: {format(new Date(), "yyyy-MM-dd")}</span>
            </div>
          </div>
        </div>

        {/* Customization Options Bar */}
        <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-black dark:text-white uppercase tracking-wider flex items-center gap-1.5">
              <Settings2 size={14} className="text-indigo-600" /> Label Customization & Format
            </h4>
            <div className="flex items-center gap-1 bg-white dark:bg-gray-900 p-1 rounded-lg border border-gray-200 dark:border-gray-700">
              <button
                onClick={() => setLabelSize("compact")}
                className={`px-2.5 py-1 rounded text-[10px] font-black uppercase transition-all ${
                  labelSize === "compact"
                    ? "bg-indigo-600 text-white shadow-sm"
                    : "text-gray-500 hover:text-gray-900 dark:text-gray-400"
                }`}
              >
                Compact (70×42)
              </button>
              <button
                onClick={() => setLabelSize("standard")}
                className={`px-2.5 py-1 rounded text-[10px] font-black uppercase transition-all ${
                  labelSize === "standard"
                    ? "bg-indigo-600 text-white shadow-sm"
                    : "text-gray-500 hover:text-gray-900 dark:text-gray-400"
                }`}
              >
                Standard (85×55)
              </button>
              <button
                onClick={() => setLabelSize("large")}
                className={`px-2.5 py-1 rounded text-[10px] font-black uppercase transition-all ${
                  labelSize === "large"
                    ? "bg-indigo-600 text-white shadow-sm"
                    : "text-gray-500 hover:text-gray-900 dark:text-gray-400"
                }`}
              >
                Large Node (100×65)
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <label className="flex items-center gap-2 p-2 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 cursor-pointer">
              <input
                type="checkbox"
                checked={includeQr}
                onChange={(e) => setIncludeQr(e.target.checked)}
                className="rounded text-indigo-600 focus:ring-indigo-500"
              />
              <span className="font-bold text-gray-700 dark:text-gray-300 text-[11px]">QR Code</span>
            </label>
            <label className="flex items-center gap-2 p-2 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 cursor-pointer">
              <input
                type="checkbox"
                checked={includeBarcode}
                onChange={(e) => setIncludeBarcode(e.target.checked)}
                className="rounded text-indigo-600 focus:ring-indigo-500"
              />
              <span className="font-bold text-gray-700 dark:text-gray-300 text-[11px]">Barcode</span>
            </label>
            <label className="flex items-center gap-2 p-2 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 cursor-pointer">
              <input
                type="checkbox"
                checked={includeCustodian}
                onChange={(e) => setIncludeCustodian(e.target.checked)}
                className="rounded text-indigo-600 focus:ring-indigo-500"
              />
              <span className="font-bold text-gray-700 dark:text-gray-300 text-[11px]">Custodian</span>
            </label>
            <label className="flex items-center gap-2 p-2 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 cursor-pointer">
              <input
                type="checkbox"
                checked={includeLocation}
                onChange={(e) => setIncludeLocation(e.target.checked)}
                className="rounded text-indigo-600 focus:ring-indigo-500"
              />
              <span className="font-bold text-gray-700 dark:text-gray-300 text-[11px]">Location</span>
            </label>
          </div>
        </div>
      </ModalBody>
      <ModalFooter className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            color="light"
            onClick={handleCopyTag}
            className="font-black uppercase text-[10px] tracking-wider rounded-xl"
          >
            {copied ? <Check size={13} className="mr-1 text-emerald-600" /> : <Copy size={13} className="mr-1" />}
            {copied ? "Copied" : "Copy Tag Text"}
          </Button>
        </div>
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            color="gray"
            onClick={onClose}
            className="font-black uppercase text-[10px] tracking-wider rounded-xl"
          >
            Close
          </Button>
          <Button
            size="sm"
            color="light"
            onClick={handleDirectPrint}
            className="font-black uppercase text-[10px] tracking-wider rounded-xl border-indigo-200 text-indigo-700 hover:bg-indigo-50"
          >
            <Printer size={13} className="mr-1.5 text-indigo-600" /> Direct Print
          </Button>
          <Button
            size="sm"
            color="blue"
            onClick={handleDownloadPDF}
            className="font-black uppercase text-[10px] tracking-wider rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-600/20"
          >
            <Download size={13} className="mr-1.5" /> Download Vector PDF
          </Button>
        </div>
      </ModalFooter>
    </Modal>
  );
};

export default AssetPrintLabelModal;

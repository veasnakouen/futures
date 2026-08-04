import { jsPDF } from "jspdf";
import { format } from "date-fns";

export interface AssetLabelOptions {
  companyName?: string;
  subHeader?: string;
  includeQrCode?: boolean;
  includeBarcode?: boolean;
  includeCustodian?: boolean;
  includeLocation?: boolean;
  includeCategory?: boolean;
  qrDataUrl?: string | null;
  labelSize?: "standard" | "compact" | "large";
}

/**
 * Draws simulated vector barcode lines into the jsPDF document
 */
function drawVectorBarcode(
  doc: jsPDF,
  codeText: string,
  startX: number,
  startY: number,
  width: number,
  height: number
) {
  const cleanCode = (codeText || "00000000").replace(/[^a-zA-Z0-9-]/g, "").toUpperCase();
  // Hash characters to deterministic bar patterns
  let pattern: number[] = [2, 1, 1, 2, 1, 2, 2, 1]; // Start guard
  for (let i = 0; i < cleanCode.length; i++) {
    const charCode = cleanCode.charCodeAt(i);
    pattern.push((charCode % 3) + 1);
    pattern.push(((charCode >> 1) % 2) + 1);
    pattern.push(((charCode >> 2) % 3) + 1);
    pattern.push(1);
  }
  pattern.push(2, 1, 2, 1, 2, 2); // Stop guard

  const totalUnits = pattern.reduce((a, b) => a + b, 0);
  const unitWidth = width / totalUnits;

  doc.setFillColor(15, 23, 42); // slate-900
  let currentX = startX;
  for (let i = 0; i < pattern.length; i++) {
    const barWidth = pattern[i] * unitWidth;
    if (i % 2 === 0) {
      doc.rect(currentX, startY, barWidth, height, "F");
    }
    currentX += barWidth;
  }

  // Draw barcode text underneath
  doc.setFont("courier", "bold");
  doc.setFontSize(6.5);
  doc.setTextColor(51, 65, 85);
  doc.text(cleanCode, startX + width / 2, startY + height + 2.8, { align: "center" });
}

/**
 * Generates an ultra-premium, industrial-grade Asset Property Tag PDF
 */
export function generateAssetLabelPDF(asset: any, options: AssetLabelOptions = {}) {
  const companyName = options.companyName || "MTP ENTERPRISE ASSET MANAGEMENT";
  const subHeader = options.subHeader || "PROPERTY & AUDIT IDENTIFICATION TAG";
  const labelSize = options.labelSize || "standard";

  // Dimensions in mm
  let pageW = 85;
  let pageH = 55;
  if (labelSize === "compact") {
    pageW = 70;
    pageH = 42;
  } else if (labelSize === "large") {
    pageW = 100;
    pageH = 65;
  }

  const doc = new jsPDF({
    orientation: "landscape",
    unit: "mm",
    format: [pageW, pageH],
  });

  const margin = 2.5;
  const innerW = pageW - margin * 2;
  const innerH = pageH - margin * 2;

  // 1. Outer Border Card with subtle shadow / frame
  doc.setDrawColor(203, 213, 225); // slate-300
  doc.setLineWidth(0.6);
  doc.setFillColor(255, 255, 255);
  doc.roundedRect(margin, margin, innerW, innerH, 2.5, 2.5, "FD");

  // Inner security margin line
  doc.setDrawColor(226, 232, 240); // slate-200
  doc.setLineWidth(0.2);
  doc.roundedRect(margin + 0.8, margin + 0.8, innerW - 1.6, innerH - 1.6, 2, 2, "D");

  // 2. Header Band (Deep Indigo / Slate Gradient feel)
  const headerH = labelSize === "compact" ? 9 : 11;
  doc.setFillColor(30, 27, 75); // #1E1B4B deep indigo
  doc.rect(margin + 0.8, margin + 0.8, innerW - 1.6, headerH, "F");

  // Header Brand Accent Pill
  doc.setFillColor(79, 70, 229); // #4F46E5 indigo-600
  doc.roundedRect(margin + 2.5, margin + 2.2, 5, 5, 1, 1, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(7);
  doc.text("M", margin + 5, margin + 5.7, { align: "center" });

  // Header Title
  doc.setFont("helvetica", "bold");
  doc.setFontSize(labelSize === "compact" ? 6.5 : 7.5);
  doc.setTextColor(255, 255, 255);
  doc.text(companyName, margin + 9, margin + 5);

  // Header Subtitle
  doc.setFont("helvetica", "normal");
  doc.setFontSize(5);
  doc.setTextColor(199, 210, 254); // indigo-200
  doc.text(subHeader, margin + 9, margin + 8.5);

  // Security Tag Badge (Right header)
  doc.setFillColor(99, 102, 241); // indigo-500
  doc.roundedRect(pageW - margin - 22, margin + 2.5, 20, 5, 1, 1, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(5);
  doc.setTextColor(255, 255, 255);
  doc.text("VERIFIED NODE", pageW - margin - 12, margin + 5.8, { align: "center" });

  // Content Area Positioning
  const contentStartY = margin + headerH + 3;
  const qrSize = labelSize === "compact" ? 17 : 21;
  const qrX = pageW - margin - qrSize - 3;
  const textMaxW = qrX - margin - 4;

  // 3. Asset Name (Bold, auto-wrapping)
  doc.setFont("helvetica", "bold");
  doc.setFontSize(labelSize === "compact" ? 8 : 9.5);
  doc.setTextColor(15, 23, 42); // slate-900
  const assetName = asset.name || "UNNAMED ASSET";
  const nameLines = doc.splitTextToSize(assetName.toUpperCase(), textMaxW);
  doc.text(nameLines.slice(0, 2), margin + 3, contentStartY + 1);

  let currentY = contentStartY + (nameLines.length > 1 ? 7.5 : 4.5);

  // 4. Serial Number Badge (Monospace)
  const snText = `S/N: ${asset.serialNumber || "N/A"}`;
  const snWidth = Math.min(textMaxW, doc.getTextWidth(snText) + 6);
  doc.setFillColor(241, 245, 249); // slate-100
  doc.setDrawColor(203, 213, 225); // slate-300
  doc.setLineWidth(0.2);
  doc.roundedRect(margin + 3, currentY, snWidth, 4.8, 1, 1, "FD");

  doc.setFont("courier", "bold");
  doc.setFontSize(7);
  doc.setTextColor(30, 41, 59); // slate-800
  doc.text(snText, margin + 5, currentY + 3.4);

  currentY += 7.2;

  // 5. Metadata Grid (Category, Model, Custodian, Location)
  const drawMetaRow = (label: string, value: string) => {
    if (!value || currentY > pageH - margin - 12) return;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(5.5);
    doc.setTextColor(100, 116, 139); // slate-500
    doc.text(label.toUpperCase(), margin + 3, currentY);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(6);
    doc.setTextColor(15, 23, 42); // slate-900
    const valText = doc.splitTextToSize(value, textMaxW - 18);
    doc.text(valText[0] || "", margin + 20, currentY);
    currentY += 3.4;
  };

  if (options.includeCategory !== false) {
    drawMetaRow("Type:", asset.assetType || "Standard Node");
  }
  if (asset.brand || asset.modelNumber) {
    drawMetaRow("Model:", `${asset.brand || ""} ${asset.modelNumber || ""}`.trim());
  }
  if (options.includeLocation !== false && asset.location) {
    drawMetaRow("Loc:", asset.location);
  }
  if (options.includeCustodian !== false) {
    const cust = asset.employee
      ? `${asset.employee.firstNameEnglish} ${asset.employee.lastNameEnglish}`
      : "Unassigned Stock";
    drawMetaRow("User:", cust);
  }

  // 6. QR Code (Rendered from canvas or fallback placeholder)
  if (options.includeQrCode !== false) {
    if (options.qrDataUrl) {
      try {
        doc.addImage(options.qrDataUrl, "PNG", qrX, contentStartY, qrSize, qrSize);
      } catch (err) {
        // Fallback drawing if addImage fails
        drawQrPlaceholder(doc, qrX, contentStartY, qrSize);
      }
    } else {
      drawQrPlaceholder(doc, qrX, contentStartY, qrSize);
    }
  }

  // 7. Barcode Representation (Bottom right or middle)
  if (options.includeBarcode !== false) {
    const barcodeVal = asset.barcode || asset.serialNumber || "MTP-0000";
    const barcodeW = qrSize + 2;
    const barcodeH = 5.5;
    const barcodeY = contentStartY + qrSize + 1.5;
    if (barcodeY + barcodeH < pageH - margin - 3) {
      drawVectorBarcode(doc, barcodeVal, qrX - 1, barcodeY, barcodeW, barcodeH);
    }
  }

  // 8. Bottom Security / Tamper Evident Banner
  const footerY = pageH - margin - 2;
  doc.setDrawColor(226, 232, 240);
  doc.setLineWidth(0.3);
  doc.line(margin + 2, footerY - 2.5, pageW - margin - 2, footerY - 2.5);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(4.2);
  doc.setTextColor(148, 163, 184); // slate-400
  const footerNotice = "DO NOT REMOVE OR COVER • PROPERTY OF MTP CORP • IT AUDIT SYSTEM";
  doc.text(footerNotice, margin + 3, footerY - 0.5);

  const printTimestamp = format(new Date(), "yyyy-MM-dd");
  doc.setFont("helvetica", "normal");
  doc.text(`TAGGED: ${printTimestamp}`, pageW - margin - 3, footerY - 0.5, { align: "right" });

  return doc;
}

function drawQrPlaceholder(doc: jsPDF, x: number, y: number, size: number) {
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(203, 213, 225);
  doc.setLineWidth(0.3);
  doc.roundedRect(x, y, size, size, 1.5, 1.5, "FD");

  // Grid dots
  doc.setFillColor(30, 41, 59);
  const dotCount = 5;
  const step = size / (dotCount + 1);
  for (let r = 1; r <= dotCount; r++) {
    for (let c = 1; c <= dotCount; c++) {
      if ((r + c) % 2 === 0 || (r === 1 && c === 1) || (r === 1 && c === dotCount) || (r === dotCount && c === 1)) {
        doc.rect(x + c * step - 0.6, y + r * step - 0.6, 1.2, 1.2, "F");
      }
    }
  }
}

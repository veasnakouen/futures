import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";

export const exportToExcel = (
  data: any[],
  headers: string[],
  reportTitle: string,
  reportSubtitle: string,
  customFooterText?: string,
  customSignatures?: string,
  customDateLocation?: string,
) => {
  const wsData: any[] = [];

  // 1. Enterprise Report Title Banner
  wsData.push(["MTP MICROSERVICES ECOSYSTEM - ENTERPRISE REPORT"]);
  wsData.push([reportTitle.toUpperCase()]);
  wsData.push([`Subtitle: ${reportSubtitle}`]);
  wsData.push([`Generated On: ${new Date().toLocaleString()}`]);
  wsData.push([]); // Blank spacing row

  // 2. Clean Upper-Case Header Row
  const headerRow = headers.map((h) =>
    h.replace(/([A-Z])/g, " $1").trim().toUpperCase()
  );
  wsData.push(headerRow);

  // 3. Process & Format Data Rows
  let totalNumericCount = 0;
  let numericTotals: Record<number, number> = {};

  data.forEach((row) => {
    const rowData = headers.map((h, colIndex) => {
      let val = row[h];
      if (val !== null && val !== undefined) {
        if (typeof val === "boolean") return val ? "Yes" : "No";
        if (typeof val === "number") {
          numericTotals[colIndex] = (numericTotals[colIndex] || 0) + val;
          return val;
        }
        return String(val);
      }
      return "N/A";
    });
    wsData.push(rowData);
  });

  // 4. Summary / Total Row
  wsData.push([]);
  const totalRow = new Array(headers.length).fill("");
  totalRow[0] = `SUMMARY (Total Records: ${data.length})`;
  Object.keys(numericTotals).forEach((colIdx) => {
    const idx = Number(colIdx);
    if (idx > 0) {
      totalRow[idx] = `Sum: ${numericTotals[idx].toLocaleString()}`;
    }
  });
  wsData.push(totalRow);

  // 5. Add Signatures & Footer
  if (customDateLocation || customSignatures) {
    wsData.push([]);
    wsData.push([]);
  }

  if (customDateLocation) {
    const dateRow = new Array(headers.length).fill("");
    dateRow[headers.length - 1] = customDateLocation;
    wsData.push(dateRow);
    wsData.push([]);
  }

  if (customSignatures) {
    wsData.push([]);
    wsData.push([]);
    const signatures = customSignatures.split(",").map((s) => s.trim());
    const sigRow = new Array(headers.length).fill("");
    const lineRow = new Array(headers.length).fill("");
    if (signatures.length > 0) {
      sigRow[0] = signatures[0];
      lineRow[0] = "_________________________";
    }
    if (signatures.length > 1) {
      sigRow[headers.length - 1] = signatures[1];
      lineRow[headers.length - 1] = "_________________________";
    }
    wsData.push(lineRow);
    wsData.push(sigRow);
    wsData.push([]);
  }

  wsData.push([]);
  if (customFooterText) {
    customFooterText.split("\n").forEach((line) => wsData.push([line]));
  } else {
    wsData.push(["© MTP Enterprise Ecosystem - Modernization Report Engine"]);
    wsData.push(["System Generated Official Document. Verified Data Integrity."]);
  }

  // 6. Build Worksheet & Calculate Column Width Auto-Fitting
  const ws = XLSX.utils.aoa_to_sheet(wsData);

  // Calculate auto column widths
  const colWidths = headers.map((h, colIdx) => {
    let maxLen = headerRow[colIdx] ? headerRow[colIdx].length : 12;
    data.forEach((row) => {
      const cellVal = String(row[h] ?? "");
      if (cellVal.length > maxLen) maxLen = cellVal.length;
    });
    return Math.min(Math.max(maxLen + 4, 14), 50); // Min 14, Max 50 char width
  });

  ws["!cols"] = colWidths.map((w) => ({ wch: w }));

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Enterprise_Report");

  const fileName = `${reportSubtitle.replace(/\s+/g, "_")}_${new Date().toISOString().split("T")[0]}.xlsx`;
  XLSX.writeFile(wb, fileName);
};

export const exportToPDF = async (
  data: any[],
  headers: string[],
  reportTitle: string,
  reportSubtitle: string,
  orientation: "portrait" | "landscape",
  customLogoUrl?: string | null,
  customLogoLocation: "top-left" | "top-center" | "top-right" = "top-left",
  customLogoShape?: "rectangle" | "rounded" | "circle",
  customFooterText?: string,
  customSignatures?: string,
  customDateLocation?: string,
) => {
  const doc = new jsPDF({ orientation });

  let startY = 22;

  // Add Logo if available
  if (customLogoUrl) {
    try {
      const format = customLogoUrl
        .substring(customLogoUrl.indexOf("/") + 1, customLogoUrl.indexOf(";"))
        .toUpperCase();
      const safeFormat =
        format === "JPEG" ? "JPEG" : format === "PNG" ? "PNG" : "WEBP";

      // Calculate dynamic aspect ratio to preserve shape
      const imgProps = doc.getImageProperties(customLogoUrl);
      const imgHeight = 20;
      const imgWidth = (imgProps.width / imgProps.height) * imgHeight;
      let xPos = 14; // Default top-left

      if (customLogoLocation === "top-center") {
        xPos = (doc.internal.pageSize.getWidth() - imgWidth) / 2;
        startY = 42; // Push text down below the centered logo
      } else if (customLogoLocation === "top-right") {
        xPos = doc.internal.pageSize.getWidth() - imgWidth - 14;
      }
      
      let finalLogoData = customLogoUrl;
      let finalLogoFormat = safeFormat;

      // Apply shape processing if needed
      if (customLogoShape && customLogoShape !== "rectangle") {
        try {
          const img = new Image();
          await new Promise((resolve, reject) => {
            img.onload = resolve;
            img.onerror = reject;
            img.src = customLogoUrl;
          });

          const canvas = document.createElement("canvas");
          canvas.width = imgProps.width;
          canvas.height = imgProps.height;
          const ctx = canvas.getContext("2d");
          if (ctx) {
            ctx.beginPath();
            if (customLogoShape === "circle") {
              const radius = Math.min(imgProps.width, imgProps.height) / 2;
              ctx.arc(imgProps.width / 2, imgProps.height / 2, radius, 0, Math.PI * 2);
            } else if (customLogoShape === "rounded") {
              const radius = Math.min(imgProps.width, imgProps.height) * 0.2; // 20%
              // Polyfill for roundRect
              if (ctx.roundRect) {
                ctx.roundRect(0, 0, imgProps.width, imgProps.height, radius);
              } else {
                ctx.moveTo(radius, 0);
                ctx.lineTo(imgProps.width - radius, 0);
                ctx.quadraticCurveTo(imgProps.width, 0, imgProps.width, radius);
                ctx.lineTo(imgProps.width, imgProps.height - radius);
                ctx.quadraticCurveTo(imgProps.width, imgProps.height, imgProps.width - radius, imgProps.height);
                ctx.lineTo(radius, imgProps.height);
                ctx.quadraticCurveTo(0, imgProps.height, 0, imgProps.height - radius);
                ctx.lineTo(0, radius);
                ctx.quadraticCurveTo(0, 0, radius, 0);
              }
            }
            ctx.clip();
            ctx.drawImage(img, 0, 0, imgProps.width, imgProps.height);
            finalLogoData = canvas.toDataURL("image/png");
            finalLogoFormat = "PNG";
          }
        } catch (err) {
          console.error("Failed to apply shape to logo", err);
        }
      }

      doc.addImage(finalLogoData, finalLogoFormat, xPos, 15, imgWidth, imgHeight);
    } catch (e) {
      console.error("Error adding logo to PDF", e);
    }
  }

  const pageWidth = doc.internal.pageSize.getWidth();

  // Add Title
  doc.setFontSize(18);
  doc.text(reportTitle.toUpperCase(), pageWidth / 2, startY, { align: "center" });

  // Add Subtitle
  doc.setFontSize(14);
  doc.text(reportSubtitle, pageWidth / 2, startY + 8, { align: "center" });

  // Add Date
  doc.setFontSize(10);
  doc.setTextColor(100);
  doc.text(`Printed on: ${new Date().toLocaleString()}`, pageWidth / 2, startY + 16, { align: "center" });

  const tableHeaders = headers.map((h) => h.replace(/([A-Z])/g, " $1").trim());

  const tableData = data.map((row) => {
    return headers.map((h) => {
      let val = row[h];
      if (val !== null && val !== undefined) {
        return String(val) === "true"
          ? "Yes"
          : String(val) === "false"
            ? "No"
            : String(val);
      }
      return "N/A";
    });
  });

  autoTable(doc, {
    startY: startY + 24,
    head: [tableHeaders],
    body: tableData,
    theme: "grid",
    styles: { fontSize: 8, cellPadding: 2 },
    headStyles: { fillColor: [41, 128, 185], textColor: 255 },
    alternateRowStyles: { fillColor: [245, 245, 245] },
    didDrawPage: (data) => {
      // Add Footer on every page
      const pageHeight =
        doc.internal.pageSize.height || doc.internal.pageSize.getHeight();
      doc.setFontSize(8);
      doc.setTextColor(150);

      const footerLines = customFooterText
        ? customFooterText.split("\n")
        : [
            "© MT Program - System Modernization",
            "This is a system generated report. No signature required.",
          ];

      let footerY = pageHeight - 15;
      footerLines.forEach((line) => {
        // Center text
        const textWidth = doc.getTextWidth(line);
        const textOffset = (doc.internal.pageSize.getWidth() - textWidth) / 2;
        doc.text(line, textOffset, footerY);
        footerY += 4;
      });
    },
  });

  // Add Date Location and Signatures at the end of the document
  if (customDateLocation || customSignatures) {
    let finalY = (doc as any).lastAutoTable.finalY + 20;
    const pageHeight = doc.internal.pageSize.getHeight();
    const pageWidth = doc.internal.pageSize.getWidth();

    // If we need a new page
    if (finalY + 40 > pageHeight - 20) {
      doc.addPage();
      finalY = 20;
    }

    doc.setFontSize(10);
    doc.setTextColor(0);

    let sigY = finalY;

    if (customDateLocation) {
      const textWidth = doc.getTextWidth(customDateLocation);
      doc.text(customDateLocation, pageWidth - textWidth - 14, sigY);
      sigY += 25; // Space between date and signatures
    } else {
      sigY += 10;
    }

    if (customSignatures) {
      const signatures = customSignatures.split(",").map((s) => s.trim());

      signatures.forEach((sig, index) => {
        // Calculate X position based on number of signatures
        const sectionWidth = pageWidth / signatures.length;
        const xCenter = sectionWidth * index + sectionWidth / 2;

        // Draw Line
        doc.setLineWidth(0.5);
        doc.line(xCenter - 25, sigY, xCenter + 25, sigY);

        // Draw Text
        const textWidth = doc.getTextWidth(sig);
        doc.text(sig, xCenter - textWidth / 2, sigY + 5);
      });
    }
  }

  const fileName = `${reportSubtitle.replace(/\s+/g, "_")}_${new Date().toISOString().split("T")[0]}.pdf`;
  doc.save(fileName);
};

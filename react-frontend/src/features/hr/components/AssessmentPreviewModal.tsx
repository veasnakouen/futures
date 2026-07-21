import React, { useRef } from "react";
import {Modal, ModalBody, Button} from '@/lib/flowbite-compat';
import {
  Printer,
  FileDown,
  Table as TableIcon,
  FileText,
  X,
} from "lucide-react";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import * as XLSX from "xlsx";
import { format } from "date-fns";

interface AssessmentPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  assessment: any;
  ticket: any;
}

const AssessmentPreviewModal: React.FC<AssessmentPreviewModalProps> = ({
  isOpen,
  onClose,
  assessment,
  ticket,
}) => {
  const printRef = useRef<HTMLDivElement>(null);

  if (!assessment) return null;

  const handlePrint = () => {
    const printContent = printRef.current;
    if (!printContent) return;

    // Create a hidden iframe
    const iframe = document.createElement("iframe");
    iframe.style.position = "absolute";
    iframe.style.width = "0px";
    iframe.style.height = "0px";
    iframe.style.border = "none";
    document.body.appendChild(iframe);

    const doc = iframe.contentWindow?.document || iframe.contentDocument;
    if (doc) {
      doc.open();
      doc.write("<html><head><title>Print Assessment</title>");

      // Copy all parent document stylesheets and style elements to the iframe
      Array.from(
        document.querySelectorAll('link[rel="stylesheet"], style'),
      ).forEach((styleEl) => {
        doc.write(styleEl.outerHTML);
      });

      doc.write(
        '</head><body style="background: white; color: black; padding: 20mm;">',
      );
      doc.write(printContent.innerHTML);
      doc.write("</body></html>");
      doc.close();

      setTimeout(() => {
        iframe.contentWindow?.focus();
        iframe.contentWindow?.print();
        document.body.removeChild(iframe);
      }, 500);
    }
  };

  const handlePdfExport = async () => {
    if (!printRef.current) return;
    const canvas = await html2canvas(printRef.current, { scale: 2 });
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save(`Assessment_Form_${assessment.id || "Draft"}.pdf`);
  };

  const handleWordExport = () => {
    if (!printRef.current) return;
    const header =
      "<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'><head><meta charset='utf-8'><title>Export HTML To Doc</title></head><body>";
    const footer = "</body></html>";
    const sourceHTML = header + printRef.current.innerHTML + footer;

    const source =
      "data:application/vnd.ms-word;charset=utf-8," +
      encodeURIComponent(sourceHTML);
    const fileDownload = document.createElement("a");
    document.body.appendChild(fileDownload);
    fileDownload.href = source;
    fileDownload.download = `Assessment_Form_${assessment.id || "Draft"}.doc`;
    fileDownload.click();
    document.body.removeChild(fileDownload);
  };

  const handleExcelExport = () => {
    const items = assessment.items || [];
    const dataToExport = items.map((item: any) => ({
      Description: item.itemName,
      Quantity: item.quantity,
      Price: `$${(item.price || 0).toFixed(2)}`,
      Total: `$${((item.quantity || 0) * (item.price || 0)).toFixed(2)}`,
    }));

    const totalAmount = items.reduce(
      (sum: number, item: any) =>
        sum + (item.quantity || 0) * (item.price || 0),
      0,
    );
    dataToExport.push({
      Description: "TOTAL",
      Quantity: "",
      Price: "",
      Total: `$${totalAmount.toFixed(2)}`,
    });

    const ws = XLSX.utils.json_to_sheet(dataToExport);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Assessment");
    XLSX.writeFile(wb, `Assessment_Form_${assessment.id || "Draft"}.xlsx`);
  };

  const total = (assessment.items || []).reduce(
    (sum: number, item: any) => sum + (item.quantity || 0) * (item.price || 0),
    0,
  );

  return (
    <Modal show={isOpen} onClose={onClose} size="6xl">
      <div className="bg-gray-100 dark:bg-gray-800 p-2 border-b flex justify-between items-center rounded-t-lg">
        <div className="flex gap-2">
          <Button
            size="xs"
            color="light"
            onClick={handlePrint}
            className="font-bold"
          >
            <Printer size={14} className="mr-2" /> Print
          </Button>
          <Button
            size="xs"
            color="light"
            onClick={handleWordExport}
            className="font-bold text-blue-600"
          >
            <FileText size={14} className="mr-2" /> Word
          </Button>
          <Button
            size="xs"
            color="light"
            onClick={handleExcelExport}
            className="font-bold text-green-600"
          >
            <TableIcon size={14} className="mr-2" /> Excel
          </Button>
          <Button
            size="xs"
            color="light"
            onClick={handlePdfExport}
            className="font-bold text-red-600"
          >
            <FileDown size={14} className="mr-2" /> PDF
          </Button>
        </div>
        <button
          onClick={onClose}
          className="flex h-8 w-8 min-w-[2rem] min-h-[2rem] shrink-0 aspect-square items-center justify-center rounded-full p-0 bg-gray-100 text-gray-500 hover:bg-gray-200 hover:text-gray-900 hover:rotate-90 hover:scale-110 active:scale-95 transition-all duration-300 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm"
        >
            <X size={20} />
        </button>
      </div>

      <ModalBody className="bg-gray-200 dark:bg-gray-900 p-8 overflow-y-auto max-h-[80vh]">
        {/* Printable Area */}
        <div
          ref={printRef}
          className="bg-white mx-auto shadow-sm"
          style={{
            width: "210mm",
            minHeight: "297mm",
            padding: "20mm",
            color: "black", // Force black text for print
            fontFamily: "Arial, sans-serif",
          }}
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="w-1/4">
              {/* Placeholder Logo */}
              <div className="w-24 h-12 bg-red-800 rounded-b-full rounded-tr-full flex items-center justify-center text-white text-xs font-bold italic opacity-80">
                MTP Logo
              </div>
            </div>
            <div className="w-1/2 text-center">
              <h1
                className="text-xl font-bold mb-1"
                style={{ fontFamily: "Khmer OS Battambang, Arial" }}
              >
                ទម្រង់វាយតម្លៃផ្នែកព័ត៌មានវិទ្យា
              </h1>
              <h2 className="text-sm">IT Assessment Form</h2>
            </div>
            <div className="w-1/4"></div>
          </div>

          {/* Metadata */}
          <div className="flex justify-between text-[11px] mb-6">
            <div className="space-y-1">
              <div className="grid grid-cols-2 w-64">
                <span className="font-semibold">Assessment No:</span>
                <span>{String(assessment.id).padStart(6, "0")}</span>
              </div>
              <div className="grid grid-cols-2 w-64">
                <span className="font-semibold">Assessment Date:</span>
                <span>{assessment.assessmentDate || "-"}</span>
              </div>
              <div className="grid grid-cols-2 w-64">
                <span className="font-semibold">Ref to Ticket No:</span>
                <span>
                  #{ticket?.id ? String(ticket.id).padStart(5, "0") : "-"}
                </span>
              </div>
            </div>
            <div className="space-y-1">
              <div className="grid grid-cols-[80px_1fr] w-64">
                <span className="font-semibold">User:</span>
                <span>
                  {ticket?.requesterName || assessment.requesterName || "-"}
                </span>
              </div>
              <div className="grid grid-cols-[80px_1fr] w-64">
                <span className="font-semibold">Department:</span>
                <span>
                  {ticket?.department || assessment.department || "-"}
                </span>
              </div>
              <div className="grid grid-cols-[80px_1fr] w-64">
                <span className="font-semibold">Brand:</span>
                <span>{assessment.brand || "-"}</span>
              </div>
              <div className="grid grid-cols-[80px_1fr] w-64">
                <span className="font-semibold">Model:</span>
                <span>{assessment.model || "-"}</span>
              </div>
            </div>
          </div>

          {/* Ticket details */}
          <div className="text-[11px] space-y-1 mb-6">
            <div className="grid grid-cols-[100px_1fr]">
              <span className="font-semibold text-right pr-2">Item Code:</span>
              <span>{assessment.itemCode || "-"}</span>
            </div>
            <div className="grid grid-cols-[100px_1fr]">
              <span className="font-semibold text-right pr-2">Subject:</span>
              <span>{assessment.subject || ticket?.title || "-"}</span>
            </div>
            <div className="grid grid-cols-[100px_1fr]">
              <span className="font-semibold text-right pr-2">
                Issue description:
              </span>
              <span>
                {assessment.issueDescription || ticket?.description || "-"}
              </span>
            </div>
          </div>

          {/* Table */}
          <table className="w-full text-[11px] border-collapse mb-24">
            <thead>
              <tr className="border-t border-b">
                <th className="py-2 px-2 text-left font-semibold">
                  <div className="font-khmer">បរិយាយ</div>
                  <div>Description</div>
                </th>
                <th className="py-2 px-2 text-center font-semibold w-24">
                  <div className="font-khmer">បរិមាណ</div>
                  <div>Quantity</div>
                </th>
                <th className="py-2 px-2 text-right font-semibold w-24">
                  <div className="font-khmer">តម្លៃរាយ</div>
                  <div>Price</div>
                </th>
                <th className="py-2 px-2 text-right font-semibold w-24">
                  <div className="font-khmer">សរុប</div>
                  <div>Total</div>
                </th>
              </tr>
            </thead>
            <tbody>
              {(assessment.items || []).map((item: any, idx: number) => (
                <tr key={idx} className="border-b">
                  <td className="py-2 px-2">{item.itemName}</td>
                  <td className="py-2 px-2 text-center">
                    {item.quantity}{" "}
                    {item.unitType !== "Unit" ? item.unitType : "unit"}
                  </td>
                  <td className="py-2 px-2 text-right">
                    ${(item.price || 0).toFixed(2)}
                  </td>
                  <td className="py-2 px-2 text-right">
                    ${((item.quantity || 0) * (item.price || 0)).toFixed(2)}
                  </td>
                </tr>
              ))}
              <tr className="border-b">
                <td colSpan={3}></td>
                <td className="py-2 px-2 text-right font-bold">
                  ${total.toFixed(2)}
                </td>
              </tr>
            </tbody>
          </table>

          {/* Footer */}
          <div className="flex justify-end text-[11px] mb-8">
            <div className="space-y-1 w-64 text-right">
              <div>
                <span className="font-semibold">Checked By:</span> Veasna Koeun
              </div>
              <div>
                <span className="font-semibold">Checked Date:</span>{" "}
                {format(new Date(), "dd-MMM-yyyy")}
              </div>
            </div>
          </div>

          <div className="text-[10px] text-center text-gray-500">
            This is a computer generated form, no authorized signature(s) is
            required.
          </div>
        </div>
      </ModalBody>
    </Modal>
  );
};

export default AssessmentPreviewModal;

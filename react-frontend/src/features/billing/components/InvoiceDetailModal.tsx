"use client";
import React from "react";
import { QRCodeSVG } from "qrcode.react";
import {Modal, ModalBody, ModalHeader} from "@/lib/flowbite-compat";
import { InvoiceDto } from "../../../services/billingService";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  invoice: InvoiceDto | null;
}

export default function InvoiceDetailModal({ isOpen, onClose, invoice }: Props) {
  if (!invoice) return null;

  // Generate a mock payment link if none exists (in a real app, this comes from backend or payment gateway)
  const paymentUrl = invoice.paymentLink || `https://pay.example.com/invoice/${invoice.id}?amount=${invoice.grandTotal}`;

  const exportToExcel = () => {
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "Invoice No,Issue Date,Due Date,Status,Module,Reference ID\n";
    csvContent += `"${invoice.invoiceNumber || invoice.id}","${invoice.issueDate}","${invoice.dueDate}","${invoice.status}","${invoice.sourceModule}","${invoice.referenceId || ''}"\n\n`;
    
    csvContent += "Item,Description,Qty,Price,Total\n";
    invoice.lineItems?.forEach(item => {
      csvContent += `"${item.itemCode || ''}","${item.description || ''}",${item.quantity || 0},${item.unitPrice || 0},${item.total || 0}\n`;
    });
    
    csvContent += `\n,,,Subtotal,${invoice.subTotal || 0}`;
    csvContent += `\n,,,Tax,${invoice.taxTotal || 0}`;
    csvContent += `\n,,,Discount,${invoice.discountTotal || 0}`;
    csvContent += `\n,,,Grand Total,${invoice.grandTotal || 0}`;
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Invoice_${invoice.invoiceNumber || invoice.id.substring(0, 8)}.csv`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  return (
    <Modal show={isOpen} onClose={onClose} size="3xl">
      <ModalHeader onClose={onClose}>
        <span className="text-xl font-bold">Invoice #{invoice.invoiceNumber || invoice.id.substring(0, 8)}</span>
      </ModalHeader>
      <ModalBody className="p-8 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
        
        {/* Header */}
        <div className="flex justify-between items-start mb-8 border-b pb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white uppercase tracking-wider">Invoice</h2>
            {invoice.headerText && (
              <div className="mt-4 text-sm text-gray-600 dark:text-gray-400 whitespace-pre-wrap">
                {invoice.headerText}
              </div>
            )}
          </div>
          <div className="text-right">
            <div className="text-sm font-medium text-gray-500">Invoice No.</div>
            <div className="font-semibold">{invoice.invoiceNumber || invoice.id.substring(0, 8)}</div>
            <div className="text-sm font-medium text-gray-500 mt-2">Issue Date</div>
            <div className="font-semibold">{invoice.issueDate}</div>
            <div className="text-sm font-medium text-gray-500 mt-2">Due Date</div>
            <div className="font-semibold">{invoice.dueDate}</div>
            <div className="text-sm font-medium text-gray-500 mt-2">Status</div>
            <div className={`inline-flex px-2 py-0.5 rounded text-xs font-medium mt-1 ${ invoice.status ==='PAID'?'bg-green-100 text-green-800': invoice.status ==='ISSUED'?'bg-blue-100 text-blue-800':'bg-gray-100 text-gray-800'}`}>
              {invoice.status}
            </div>
          </div>
        </div>

        {/* Module Info */}
        <div className="mb-8">
          <div className="text-sm font-medium text-gray-500">Bill To / Reference</div>
          <div className="font-semibold mt-1">Module: {invoice.sourceModule}</div>
          {invoice.referenceId && <div className="text-gray-600 dark:text-gray-400">Ref ID: {invoice.referenceId}</div>}
        </div>

        {/* Line Items Table */}
        <div className="mb-8 overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b-2">
                <th className="py-3 font-semibold text-gray-700 dark:text-gray-300">Item</th>
                <th className="py-3 font-semibold text-gray-700 dark:text-gray-300">Description</th>
                <th className="py-3 font-semibold text-gray-700 dark:text-gray-300 text-right">Qty</th>
                <th className="py-3 font-semibold text-gray-700 dark:text-gray-300 text-right">Price</th>
                <th className="py-3 font-semibold text-gray-700 dark:text-gray-300 text-right">Total</th>
              </tr>
            </thead>
            <tbody>
              {invoice.lineItems?.map((item, idx) => (
                <tr key={idx} className="border-b">
                  <td className="py-3">{item.itemCode}</td>
                  <td className="py-3 text-gray-600 dark:text-gray-400">{item.description}</td>
                  <td className="py-3 text-right">{item.quantity}</td>
                  <td className="py-3 text-right">${item.unitPrice?.toFixed(2)}</td>
                  <td className="py-3 text-right font-medium">${item.total?.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Totals & QR */}
        <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-8">
          {/* QR Code */}
          {invoice.status !== 'PAID' && invoice.status !== 'CANCELLED' ? (
            <div className="flex flex-col items-center bg-gray-50 dark:bg-gray-800 p-4 rounded-xl shadow-sm">
              <div className="text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">Scan to Pay</div>
              <div className="bg-white p-2 rounded-lg shadow-sm">
                <QRCodeSVG value={paymentUrl} size={120} />
              </div>
            </div>
          ) : (
            <div className="w-[150px]"></div>
          )}

          {/* Totals */}
          <div className="w-full md:w-64 space-y-2 text-right">
            <div className="flex justify-between text-gray-600 dark:text-gray-400">
              <span>Subtotal:</span>
              <span>${invoice.subTotal?.toFixed(2)}</span>
            </div>
            {(invoice.taxTotal > 0 || invoice.discountTotal > 0) && (
              <>
                <div className="flex justify-between text-gray-600 dark:text-gray-400">
                  <span>Tax:</span>
                  <span>${invoice.taxTotal?.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600 dark:text-gray-400">
                  <span>Discount:</span>
                  <span>-${invoice.discountTotal?.toFixed(2)}</span>
                </div>
              </>
            )}
            <div className="flex justify-between text-xl font-bold text-gray-900 dark:text-white pt-2 border-t">
              <span>Grand Total:</span>
              <span>${invoice.grandTotal?.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        {invoice.footerText && (
          <div className="mt-12 pt-6 border-t text-center text-sm text-gray-500 dark:text-gray-400 whitespace-pre-wrap">
            {invoice.footerText}
          </div>
        )}

        {/* Actions */}
        <div className="mt-8 flex justify-end gap-3 no-print">
          <button onClick={exportToExcel} className="px-4 py-2 bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/50 font-medium transition-colors">
            Export Excel
          </button>
          <button onClick={() => window.print()} className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 font-medium transition-colors">
            Print / Save PDF
          </button>
          <button onClick={onClose} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors">
            Close
          </button>
        </div>

      </ModalBody>
    </Modal>
  );
}

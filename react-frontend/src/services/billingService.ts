import api from "./api";

export interface InvoiceLineItemDto {
  id?: string;
  itemCode: string;
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface InvoiceDto {
  id: string;
  invoiceNumber: string;
  issueDate: string;
  dueDate: string;
  status: string;
  referenceId?: string;
  sourceModule?: string;
  headerText?: string;
  footerText?: string;
  paymentMethod?: string;
  paymentLink?: string;
  subTotal: number;
  taxTotal: number;
  discountTotal: number;
  grandTotal: number;
  lineItems: InvoiceLineItemDto[];
}

export interface CreateInvoiceCommand {
  invoiceNumber?: string;
  issueDate: string;
  dueDate: string;
  status: string;
  referenceId?: string;
  sourceModule?: string;
  headerText?: string;
  footerText?: string;
  paymentMethod?: string;
  paymentLink?: string;
  subTotal: number;
  taxTotal: number;
  discountTotal: number;
  grandTotal: number;
  lineItems: InvoiceLineItemDto[];
}

export interface UpdateInvoiceCommand extends CreateInvoiceCommand {
  id?: string;
}

export interface PaymentDto {
  id: string;
  amount: number;
  submitDate: string;
  status: string;
  adjudicatedAmount: number;
  referenceId?: string;
  sourceModule?: string;
}

export interface CreatePaymentCommand {
  amount: number;
  submitDate: string;
  status: string;
  adjudicatedAmount: number;
  referenceId?: string;
  sourceModule?: string;
}

export interface UpdatePaymentCommand extends CreatePaymentCommand {}

// Service Methods
export const billingService = {
  // --- Invoices ---
  getInvoices: (page = 0, size = 10) =>
    api.get(`/billing/invoices?page=${page}&size=${size}`),
  getInvoiceById: (id: string) => api.get(`/billing/invoices/${id}`),
  getModules: () => api.get(`/billing/invoices/modules`),
  createInvoice: (data: CreateInvoiceCommand) =>
    api.post(`/billing/invoices`, data),
  updateInvoice: (id: string, data: UpdateInvoiceCommand) =>
    api.put(`/billing/invoices/${id}`, data),
  deleteInvoice: (id: string) => api.delete(`/billing/invoices/${id}`),

  // --- Payments ---
  getPayments: (page = 0, size = 10) =>
    api.get(`/billing/payments?page=${page}&size=${size}`),
  getPaymentById: (id: string) => api.get(`/billing/payments/${id}`),
  createPayment: (data: CreatePaymentCommand) =>
    api.post(`/billing/payments`, data),
  updatePayment: (id: string, data: UpdatePaymentCommand) =>
    api.put(`/billing/payments/${id}`, data),
  deletePayment: (id: string) => api.delete(`/billing/payments/${id}`),
};

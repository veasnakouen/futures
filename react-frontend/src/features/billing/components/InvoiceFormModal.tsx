"use client";
import React, { useEffect } from "react";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { clinicService } from "../../../services/clinicService";
import { schoolService } from "../../../services/schoolService";
import { hotelService } from "../../../services/hotelService";
import { stockService } from "../../../services/stockService";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { billingService, InvoiceDto, CreateInvoiceCommand, UpdateInvoiceCommand } from "../../../services/billingService";
import { toast } from "react-hot-toast";
import CustomModalHeader from "../../../components/common/CustomModalHeader";
import CustomModalFooter from "../../../components/common/CustomModalFooter";
import {Modal, ModalBody} from "@/lib/flowbite-compat";
import DatePicker from "../../../components/common/DatePicker";
import { format } from "date-fns";

const lineItemSchema = z.object({
  itemCode: z.string().min(1, "Required"),
  description: z.string().min(1, "Required"),
  quantity: z.coerce.number().min(1, "Required"),
  unitPrice: z.coerce.number().min(0, "Required"),
  total: z.coerce.number().optional(),
});

const schema = z.object({
  invoiceNumber: z.string().optional(),
  issueDate: z.string().min(1, "Required"),
  dueDate: z.string().min(1, "Required"),
  status: z.string().min(1, "Required"),
  referenceId: z.string().optional().or(z.literal("")),
  sourceModule: z.string().optional().or(z.literal("")),
  headerText: z.string().optional(),
  footerText: z.string().optional(),
  lineItems: z.array(lineItemSchema).min(1, "At least one item is required")
});

type FormValues = z.infer<typeof schema>;

interface Props {
  isOpen: boolean;
  onClose: () => void;
  itemToEdit?: InvoiceDto | null;
}

export default function InvoiceFormModal({ isOpen, onClose, itemToEdit }: Props) {
  const queryClient = useQueryClient();
  const isEdit = !!itemToEdit;

  const { register, control, handleSubmit, reset, watch, setValue, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema) as any,
    defaultValues: {
      lineItems: [{ itemCode: "", description: "", quantity: 1, unitPrice: 0 }]
    }
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "lineItems",
  });

  const sourceModule = watch("sourceModule");
  const lineItems = watch("lineItems");
  const issueDate = watch("issueDate");
  const dueDate = watch("dueDate");

  const getRefLabel = () => {
    switch (sourceModule) {
      case 'CLINIC': return 'Appointment / Patient ID';
      case 'HOTEL': return 'Booking ID';
      case 'SCHOOL': return 'Student ID';
      default: return 'Reference ID';
    }
  };

  const getItemCodeLabel = () => {
    switch (sourceModule) {
      case 'CLINIC': return 'Treatment Code';
      case 'HOTEL': return 'Room / Service';
      case 'SCHOOL': return 'Course / Fee Code';
      default: return 'Item Code';
    }
  };

  // Queries for dynamic dropdowns
  const { data: modulesData } = useQuery({ queryKey: ["modules"], queryFn: () => billingService.getModules().then(res => res.data), enabled: isOpen });
  const { data: studentsData } = useQuery({ queryKey: ["students"], queryFn: () => schoolService.getStudents(0, 100), enabled: sourceModule === "SCHOOL" && isOpen });
  const { data: coursesData } = useQuery({ queryKey: ["courses"], queryFn: () => schoolService.getCourses(0, 100), enabled: sourceModule === "SCHOOL" && isOpen });
  const { data: patientsData } = useQuery({ queryKey: ["patients"], queryFn: () => clinicService.getPatients(0, 100), enabled: sourceModule === "CLINIC" && isOpen });
  const { data: diagnosisTemplatesData } = useQuery({ queryKey: ["diagnosisTemplates"], queryFn: () => clinicService.getDiagnosisTemplates(0, 100), enabled: sourceModule === "CLINIC" && isOpen });
  const { data: inventoryItemsData } = useQuery({ queryKey: ["inventoryItems"], queryFn: () => stockService.getInventoryItems(0, 100), enabled: sourceModule === "CLINIC" && isOpen });
  const { data: bookingsData } = useQuery({ queryKey: ["bookings"], queryFn: () => hotelService.getBookings(0, 100), enabled: sourceModule === "HOTEL" && isOpen });
  const { data: roomsData } = useQuery({ queryKey: ["rooms"], queryFn: () => hotelService.getRooms(0, 100), enabled: sourceModule === "HOTEL" && isOpen });

  useEffect(() => {
    if (isOpen) {
      if (itemToEdit) {
        reset({ ...itemToEdit });
      } else {
        reset({
          issueDate: format(new Date(), "yyyy-MM-dd"),
          dueDate: format(new Date(), "yyyy-MM-dd"),
          status: "DRAFT",
          referenceId: "",
          sourceModule: "GENERAL",
          headerText: "",
          footerText: "Thank you for your business.",
          lineItems: [{ itemCode: "", description: "", quantity: 1, unitPrice: 0 }]
        });
      }
    }
  }, [isOpen, itemToEdit, reset]);

  const calculateTotals = (items: typeof lineItems) => {
    const subTotal = items.reduce((acc, curr) => acc + ((curr.quantity || 0) * (curr.unitPrice || 0)), 0);
    return {
      subTotal,
      taxTotal: 0,
      discountTotal: 0,
      grandTotal: subTotal
    };
  };

  const mutation = useMutation({
    mutationFn: (data: FormValues) => {
      // Calculate line item totals and grand totals before sending
      const processedItems = data.lineItems.map(item => ({
        ...item,
        total: item.quantity * item.unitPrice
      }));
      const totals = calculateTotals(data.lineItems);

      const command = {
        ...data,
        ...totals,
        lineItems: processedItems
      };

      return isEdit && itemToEdit
        ? billingService.updateInvoice(itemToEdit.id, command as UpdateInvoiceCommand)
        : billingService.createInvoice(command as CreateInvoiceCommand);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["invoices"] });
      toast.success(`Invoice ${isEdit ? "updated" : "created"} successfully`);
      onClose();
    },
    onError: () => toast.error(`Failed to ${isEdit ? "update" : "create"}`)
  });

  const onSubmit = (data: FormValues) => mutation.mutate(data);
  const currentTotals = calculateTotals(lineItems || []);

  return (
    <Modal show={isOpen} onClose={onClose} size="4xl">
      <CustomModalHeader title={isEdit ? "Edit Invoice" : "Create Invoice"} onClose={onClose} icon={null} />
      <form onSubmit={handleSubmit(onSubmit)}>
        <ModalBody className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
          {/* Header & Source */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 dark:bg-gray-800 p-4 rounded-xl">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Source Module</label>
              <select {...register("sourceModule")} className="w-full px-3 py-2 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                {modulesData?.map((m: string) => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{getRefLabel()}</label>
              {sourceModule === "SCHOOL" ? (
                <select {...register("referenceId")} className="w-full px-3 py-2 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                  <option value="">Select a student...</option>
                  {studentsData?.data?.content?.map((s: any) => (
                    <option key={s.id} value={s.id.toString()}>{s.firstName} {s.lastName} (ID: {s.id})</option>
                  ))}
                </select>
              ) : sourceModule === "CLINIC" ? (
                <select {...register("referenceId")} className="w-full px-3 py-2 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                  <option value="">Select a patient...</option>
                  {patientsData?.data?.content?.map((p: any) => (
                    <option key={p.id} value={p.id}>{p.firstName} {p.lastName} (ID: {p.id})</option>
                  ))}
                </select>
              ) : sourceModule === "HOTEL" ? (
                <select {...register("referenceId")} className="w-full px-3 py-2 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                  <option value="">Select a booking...</option>
                  {bookingsData?.data?.content?.map((b: any) => (
                    <option key={b.id} value={b.id}>Booking #{b.id.toString().substring(0, 8)}</option>
                  ))}
                </select>
              ) : (
                <input {...register("referenceId")} className="w-full px-3 py-2 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
              )}
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Custom Header (Company Info)</label>
              <textarea {...register("headerText")} rows={2} className="w-full px-3 py-2 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white" placeholder="Company Name&#10;123 Business Road"></textarea>
            </div>
          </div>

          {/* Dates & Status */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Issue Date</label>
              <DatePicker
                value={issueDate ? new Date(issueDate) : null}
                onChange={(date) => setValue("issueDate", format(date, "yyyy-MM-dd"))}
                placeholder="Issue Date"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Due Date</label>
              <DatePicker
                value={dueDate ? new Date(dueDate) : null}
                onChange={(date) => setValue("dueDate", format(date, "yyyy-MM-dd"))}
                placeholder="Due Date"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Status</label>
              <select {...register("status")} className="w-full px-3 py-2 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                <option value="DRAFT">DRAFT</option>
                <option value="ISSUED">ISSUED</option>
                <option value="PARTIALLY_PAID">PARTIALLY PAID</option>
                <option value="PAID">PAID</option>
                <option value="CANCELLED">CANCELLED</option>
              </select>
            </div>
          </div>

          {/* Line Items */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Line Items</h3>
              <button type="button" onClick={() => append({ itemCode: "", description: "", quantity: 1, unitPrice: 0 })} className="px-3 py-1 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700">
                + Add Item
              </button>
            </div>
            <div className="space-y-3">
              {fields.map((field, index) => (
                <div key={field.id} className="grid grid-cols-12 gap-3 items-start p-3 rounded-lg">
                  <div className="col-span-3">
                    <label className="block text-xs font-medium text-gray-500 mb-1">{getItemCodeLabel()}</label>
                    {sourceModule === "SCHOOL" ? (
                      <select
                        {...register(`lineItems.${index}.itemCode`, {
                          onChange: (e) => {
                            const selectedCourse = coursesData?.data?.content?.find((c: any) => c.courseCode === e.target.value);
                            if (selectedCourse) {
                              setValue(`lineItems.${index}.description`, selectedCourse.courseName);
                            }
                          }
                        })}
                        className="w-full px-2 py-1.5 text-sm rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      >
                        <option value="">Select course...</option>
                        {coursesData?.data?.content?.map((c: any) => (
                          <option key={c.id} value={c.courseCode}>{c.courseName}</option>
                        ))}
                      </select>
                    ) : sourceModule === "HOTEL" ? (
                      <select
                        {...register(`lineItems.${index}.itemCode`, {
                          onChange: (e) => {
                            const selectedRoom = roomsData?.data?.content?.find((r: any) => r.roomNumber === e.target.value);
                            if (selectedRoom) {
                              setValue(`lineItems.${index}.description`, `Room ${selectedRoom.roomNumber}`);
                            }
                          }
                        })}
                        className="w-full px-2 py-1.5 text-sm rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      >
                        <option value="">Select room...</option>
                        {roomsData?.data?.content?.map((r: any) => (
                          <option key={r.id} value={r.roomNumber}>Room {r.roomNumber}</option>
                        ))}
                      </select>
                    ) : sourceModule === "CLINIC" ? (
                      <select
                        {...register(`lineItems.${index}.itemCode`, {
                          onChange: (e) => {
                            // Auto-fill description and price if it's an inventory item
                            const selectedItem = inventoryItemsData?.data?.content?.find((i: any) => i.sku === e.target.value);
                            if (selectedItem) {
                              setValue(`lineItems.${index}.description`, selectedItem.itemName);
                              setValue(`lineItems.${index}.unitPrice`, selectedItem.unitPrice || 0);
                            }
                            // Auto-fill description for diagnosis
                            const selectedDiag = diagnosisTemplatesData?.data?.content?.find((d: any) => d.icd10Code === e.target.value);
                            if (selectedDiag) {
                              setValue(`lineItems.${index}.description`, selectedDiag.name);
                            }
                          }
                        })}
                        className="w-full px-2 py-1.5 text-sm rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      >
                        <option value="">Select service or item...</option>
                        <optgroup label="Consultations & Services">
                          {diagnosisTemplatesData?.data?.content?.length ? (
                            diagnosisTemplatesData.data.content.map((t: any) => (
                              <option key={t.id} value={t.icd10Code}>{t.name} ({t.icd10Code})</option>
                            ))
                          ) : (
                            <option disabled>No clinic services found</option>
                          )}
                        </optgroup>
                        <optgroup label="Medicines & Inventory">
                          {inventoryItemsData?.data?.content?.length ? (
                            inventoryItemsData.data.content.map((i: any) => (
                              <option key={i.id} value={i.sku}>{i.itemName} ({i.sku})</option>
                            ))
                          ) : (
                            <option disabled>No stock items found</option>
                          )}
                        </optgroup>
                      </select>
                    ) : (
                      <input {...register(`lineItems.${index}.itemCode`)} placeholder="Code" className="w-full px-2 py-1.5 text-sm rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
                    )}
                    {errors.lineItems?.[index]?.itemCode && <span className="text-red-500 text-xs">{errors.lineItems[index]?.itemCode?.message}</span>}
                  </div>
                  <div className="col-span-4">
                    <label className="block text-xs font-medium text-gray-500 mb-1">Description</label>
                    <input {...register(`lineItems.${index}.description`)} placeholder="Description" className="w-full px-2 py-1.5 text-sm rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
                    {errors.lineItems?.[index]?.description && <span className="text-red-500 text-xs">{errors.lineItems[index]?.description?.message}</span>}
                  </div>
                  <div className="col-span-2">
                    <label className="block text-xs font-medium text-gray-500 mb-1">Qty</label>
                    <input type="number" step="0.01" {...register(`lineItems.${index}.quantity`)} className="w-full px-2 py-1.5 text-sm rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-xs font-medium text-gray-500 mb-1">Price</label>
                    <input type="number" step="0.01" {...register(`lineItems.${index}.unitPrice`)} className="w-full px-2 py-1.5 text-sm rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
                  </div>
                  <div className="col-span-1 pt-6 text-right">
                    <button type="button" onClick={() => remove(index)} className="text-red-500 hover:text-red-700">
                      <svg className="w-5 h-5 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Totals & Footer */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Custom Footer (Terms, Notes)</label>
              <textarea {...register("footerText")} rows={4} className="w-full px-3 py-2 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white" placeholder="Terms and conditions..."></textarea>
            </div>
            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-xl flex flex-col justify-end space-y-2 text-right">
              <div className="text-sm text-gray-600 dark:text-gray-400">Subtotal: ${currentTotals.subTotal.toFixed(2)}</div>
              <div className="text-xl font-bold text-gray-900 dark:text-white border-t pt-2 mt-2">
                Total: ${currentTotals.grandTotal.toFixed(2)}
              </div>
            </div>
          </div>

        </ModalBody>
        <CustomModalFooter onClose={onClose} submitText={isEdit ? "Save Invoice" : "Generate Invoice"} submitDisabled={mutation.isPending} />
      </form>
    </Modal>
  );
}

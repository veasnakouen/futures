"use client";

import { useState } from "react";
import {Modal, Button, Datepicker, ModalBody, ModalHeader, Popover} from '@/lib/flowbite-compat';
import { format } from "date-fns";
import { Calendar } from "lucide-react";

export function PlacementModal() {
  const [openModal, setOpenModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [formData, setFormData] = useState({
    companyName: "",
    placementType: "Employment",
    monthlySalary: "",
    status: "Active",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form Data:", { ...formData, startDate: selectedDate });
    // Your submission logic here
    setOpenModal(false);
  };

  return (
    <>
      {/* Button to open modal */}
      <Button onClick={() => setOpenModal(true)}>Record New Placement</Button>

      {/* Modal Component */}
      <Modal
        show={openModal}
        onClose={() => setOpenModal(false)}
        popup
        size="md"
        theme={{
          content: {
            inner:
              "relative flex max-h-[90dvh] flex-col rounded-lg bg-white shadow dark:bg-gray-700 !overflow-visible",
          },
        }}
      >
        <ModalHeader />
        <ModalBody>
          <div className="px-6 pb-6 pt-4">
            <h3 className="mb-4 text-xl font-medium text-gray-900 dark:text-white">
              Record New Placement
            </h3>

            <form className="space-y-4" onSubmit={handleSubmit}>
              {/* Company Name */}
              <div>
                <label
                  htmlFor="companyName"
                  className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
                >
                  Company Name
                </label>
                <input
                  type="text"
                  id="companyName"
                  className="block w-full rounded-lg bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                  placeholder="Enter company name"
                  value={formData.companyName}
                  onChange={(e) =>
                    setFormData({ ...formData, companyName: e.target.value })
                  }
                  required
                />
              </div>

              {/* Placement Type & Monthly Salary */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="placementType"
                    className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Placement Type
                  </label>
                  <select
                    id="placementType"
                    className="block w-full rounded-lg bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:text-white dark:focus:border-blue-500 dark:focus:ring-blue-500"
                    value={formData.placementType}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        placementType: e.target.value,
                      })
                    }
                  >
                    <option value="Employment">Employment</option>
                    <option value="Internship">Internship</option>
                    <option value="Contract">Contract</option>
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="monthlySalary"
                    className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Monthly Salary
                  </label>
                  <input
                    type="text"
                    id="monthlySalary"
                    className="block w-full rounded-lg bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                    placeholder="e.g. $250"
                    value={formData.monthlySalary}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        monthlySalary: e.target.value,
                      })
                    }
                  />
                </div>
              </div>

              {/* Start Date - Datepicker */}
              <div>
                <label
                  htmlFor="startDate"
                  className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
                >
                  Start Date
                </label>
                <Popover
                  content={
                    <div className="p-0 bg-white dark:bg-gray-800 rounded-md shadow-2xl overflow-hidden">
                      <Datepicker
                        inline={true}
                        value={selectedDate}
                        onChange={setSelectedDate}
                        autoHide={true}
                        showTodayButton={true}
                        showClearButton={false}
                      />
                    </div>
                  }
                  placement="bottom"
                  trigger="click"
                >
                  <div className="group relative cursor-pointer">
                    <div className="flex items-center justify-between w-full rounded-lg bg-gray-50 p-2.5 text-sm text-gray-900 focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 group-hover:border-blue-400 transition-all h-[42px]">
                      <span
                        className={`text-sm ${selectedDate ?"text-gray-900 dark:text-white":"text-gray-400"}`}
                      >
                        {selectedDate
                          ? format(new Date(selectedDate), "MMM dd, yyyy")
                          : "Select Date..."}
                      </span>
                      <Calendar
                        size={16}
                        className="text-gray-400 group-hover:text-blue-500 transition-colors"
                      />
                    </div>
                  </div>
                </Popover>
              </div>

              {/* Status */}
              <div>
                <label
                  htmlFor="status"
                  className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
                >
                  Status
                </label>
                <select
                  id="status"
                  className="block w-full rounded-lg bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:text-white dark:focus:border-blue-500 dark:focus:ring-blue-500"
                  value={formData.status}
                  onChange={(e) =>
                    setFormData({ ...formData, status: e.target.value })
                  }
                >
                  <option value="Active">Active</option>
                  <option value="Pending">Pending</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 pt-4">
                <Button type="submit" color="blue" className="flex-1">
                  Save Placement
                </Button>
                <Button
                  type="button"
                  color="light"
                  className="flex-1"
                  onClick={() => setOpenModal(false)}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        </ModalBody>
      </Modal>
    </>
  );
}

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { clinicService, CreatePrescriptionCommand, UpdatePrescriptionCommand, CreateLabOrderCommand, UpdateLabOrderCommand } from "../services/clinicService";

// --- Prescriptions Hooks ---
export const usePrescriptions = (page = 0, size = 10) => {
  return useQuery({
    queryKey: ["prescriptions", page, size],
    queryFn: () => clinicService.getPrescriptions(page, size).then((res) => res.data),
  });
};

export const useCreatePrescriptionMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreatePrescriptionCommand) => clinicService.createPrescription(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["prescriptions"] });
    },
  });
};

export const useUpdatePrescriptionMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdatePrescriptionCommand }) =>
      clinicService.updatePrescription(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["prescriptions"] });
    },
  });
};

export const useDeletePrescriptionMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => clinicService.deletePrescription(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["prescriptions"] });
    },
  });
};

// --- Lab Orders Hooks ---
export const useLabOrders = (page = 0, size = 10) => {
  return useQuery({
    queryKey: ["labOrders", page, size],
    queryFn: () => clinicService.getLabOrders(page, size).then((res) => res.data),
  });
};

export const useCreateLabOrderMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateLabOrderCommand) => clinicService.createLabOrder(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["labOrders"] });
    },
  });
};

export const useUpdateLabOrderMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateLabOrderCommand }) =>
      clinicService.updateLabOrder(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["labOrders"] });
    },
  });
};

export const useDeleteLabOrderMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => clinicService.deleteLabOrder(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["labOrders"] });
    },
  });
};

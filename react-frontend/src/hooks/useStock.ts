import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { stockService, InventoryItemDto, StockBatchDto } from "../services/stockService";

export const useInventoryItems = (page = 0, size = 10) => {
  return useQuery({
    queryKey: ["stock-items", page, size],
    queryFn: () => stockService.getInventoryItems(page, size).then((res) => res.data),
  });
};

export const useCreateInventoryItemMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Omit<InventoryItemDto, "id">) => stockService.createInventoryItem(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["stock-items"] }),
  });
};

export const useStockBatches = (page = 0, size = 10) => {
  return useQuery({
    queryKey: ["stock-batches", page, size],
    queryFn: () => stockService.getStockBatches(page, size).then((res) => res.data),
  });
};

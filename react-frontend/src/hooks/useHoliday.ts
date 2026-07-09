import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../services/api';
import toast from 'react-hot-toast';

export interface SystemHoliday {
  id: number;
  name: string;
  eventDate: string;
  category: string;
  description: string;
}

export const useHoliday = () => {
  const queryClient = useQueryClient();

  const useHolidays = () => {
    return useQuery({
      queryKey: ['holidays'],
      queryFn: async () => {
        const { data } = await api.get('/v1/holidays');
        return data as SystemHoliday[];
      },
    });
  };

  const useCreateHoliday = () => {
    return useMutation({
      mutationFn: async (holiday: Omit<SystemHoliday, 'id'>) => {
        const { data } = await api.post('/v1/holidays', holiday);
        return data;
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['holidays'] });
        toast.success('Holiday saved successfully!');
      },
      onError: () => {
        toast.error('Failed to save holiday');
      }
    });
  };

  const useUpdateHoliday = () => {
    return useMutation({
      mutationFn: async ({ id, ...holiday }: SystemHoliday) => {
        const { data } = await api.put(`/v1/holidays/${id}`, holiday);
        return data;
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['holidays'] });
        toast.success('Holiday updated successfully!');
      },
      onError: () => {
        toast.error('Failed to update holiday');
      }
    });
  };

  const useDeleteHoliday = () => {
    return useMutation({
      mutationFn: async (id: number) => {
        await api.delete(`/v1/holidays/${id}`);
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['holidays'] });
        toast.success('Holiday deleted successfully!');
      },
      onError: () => {
        toast.error('Failed to delete holiday');
      }
    });
  };

  return {
    useHolidays,
    useCreateHoliday,
    useUpdateHoliday,
    useDeleteHoliday,
  };
};

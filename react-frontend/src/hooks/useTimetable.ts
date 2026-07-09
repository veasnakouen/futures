import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../services/api';
import toast from 'react-hot-toast';

export interface Timetable {
  id: number;
  name: string;
  onDutyTime: string;
  offDutyTime: string;
  lateTime: number;
  leaveEarlyTime: number;
}

export const useTimetable = () => {
  const queryClient = useQueryClient();

  const useTimetables = () => {
    return useQuery({
      queryKey: ['timetables'],
      queryFn: async () => {
        const { data } = await api.get('/v1/timetables');
        return data as Timetable[];
      },
    });
  };

  const useCreateTimetable = () => {
    return useMutation({
      mutationFn: async (timetable: Omit<Timetable, 'id'>) => {
        const { data } = await api.post('/v1/timetables', timetable);
        return data;
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['timetables'] });
        toast.success('Timetable saved successfully!');
      },
      onError: () => {
        toast.error('Failed to save timetable');
      }
    });
  };

  const useUpdateTimetable = () => {
    return useMutation({
      mutationFn: async ({ id, ...timetable }: Timetable) => {
        const { data } = await api.put(`/v1/timetables/${id}`, timetable);
        return data;
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['timetables'] });
        toast.success('Timetable updated successfully!');
      },
      onError: () => {
        toast.error('Failed to update timetable');
      }
    });
  };

  const useDeleteTimetable = () => {
    return useMutation({
      mutationFn: async (id: number) => {
        await api.delete(`/v1/timetables/${id}`);
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['timetables'] });
        toast.success('Timetable deleted successfully!');
      },
      onError: () => {
        toast.error('Failed to delete timetable');
      }
    });
  };

  return {
    useTimetables,
    useCreateTimetable,
    useUpdateTimetable,
    useDeleteTimetable,
  };
};

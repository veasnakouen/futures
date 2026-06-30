import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { hotelService, BookingDto, GuestDto, RoomDto } from "../services/hotelService";

export const useBookings = (page = 0, size = 10) => {
  return useQuery({
    queryKey: ["hotel-bookings", page, size],
    queryFn: () => hotelService.getBookings(page, size).then((res) => res.data),
  });
};

export const useCreateBookingMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Omit<BookingDto, "id">) => hotelService.createBooking(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["hotel-bookings"] }),
  });
};

export const useGuests = (page = 0, size = 10) => {
  return useQuery({
    queryKey: ["hotel-guests", page, size],
    queryFn: () => hotelService.getGuests(page, size).then((res) => res.data),
  });
};

export const useRooms = (page = 0, size = 10) => {
  return useQuery({
    queryKey: ["hotel-rooms", page, size],
    queryFn: () => hotelService.getRooms(page, size).then((res) => res.data),
  });
};

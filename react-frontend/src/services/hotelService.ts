import api from "./api";

// DTO Interfaces
export interface BookingDto {
  id: string;
  guestId: string;
  roomId: string;
  checkInDate: string;
  checkOutDate: string;
  status: string;
  totalAmount: number;
}

export interface GuestDto {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  idProofNumber?: string;
  address?: string;
  nationality?: string;
  dateOfBirth?: string;
  emergencyContact?: string;
}

export interface RoomDto {
  id: string;
  roomNumber: string;
  roomType: string;
  pricePerNight: number;
  status: string;
  capacity?: number;
  bedType?: string;
  amenities?: string;
  floorNumber?: number;
  address?: string;
  bedrooms?: number;
  bathrooms?: number;
}

export interface HousekeepingTaskDto {
  id: string;
  roomId: string;
  staffId: string;
  taskDate: string;
  status: string;
  notes: string;
}

// Service Methods
export const hotelService = {
  // --- Bookings ---
  getBookings: (page = 0, size = 10) =>
    api.get(`/hotel/bookings?page=${page}&size=${size}`),
  getBookingById: (id: string) => api.get(`/hotel/bookings/${id}`),
  createBooking: (data: Omit<BookingDto, "id">) =>
    api.post(`/hotel/bookings`, data),
  updateBooking: (id: string, data: Omit<BookingDto, "id">) =>
    api.put(`/hotel/bookings/${id}`, data),
  deleteBooking: (id: string) => api.delete(`/hotel/bookings/${id}`),

  // --- Guests ---
  getGuests: (page = 0, size = 10) =>
    api.get(`/hotel/guests?page=${page}&size=${size}`),
  getGuestById: (id: string) => api.get(`/hotel/guests/${id}`),
  createGuest: (data: Omit<GuestDto, "id">) =>
    api.post(`/hotel/guests`, data),
  updateGuest: (id: string, data: Omit<GuestDto, "id">) =>
    api.put(`/hotel/guests/${id}`, data),
  deleteGuest: (id: string) => api.delete(`/hotel/guests/${id}`),

  // --- Rooms ---
  getRooms: (page = 0, size = 10) =>
    api.get(`/hotel/rooms?page=${page}&size=${size}`),
  getRoomById: (id: string) => api.get(`/hotel/rooms/${id}`),
  createRoom: (data: Omit<RoomDto, "id">) =>
    api.post(`/hotel/rooms`, data),
  updateRoom: (id: string, data: Omit<RoomDto, "id">) =>
    api.put(`/hotel/rooms/${id}`, data),
  deleteRoom: (id: string) => api.delete(`/hotel/rooms/${id}`),

  // --- Housekeeping ---
  getHousekeepingTasks: (page = 0, size = 10) =>
    api.get(`/hotel/housekeeping-tasks?page=${page}&size=${size}`),
  getHousekeepingTaskById: (id: string) => api.get(`/hotel/housekeeping-tasks/${id}`),
  createHousekeepingTask: (data: Omit<HousekeepingTaskDto, "id">) =>
    api.post(`/hotel/housekeeping-tasks`, data),
  updateHousekeepingTask: (id: string, data: Omit<HousekeepingTaskDto, "id">) =>
    api.put(`/hotel/housekeeping-tasks/${id}`, data),
  deleteHousekeepingTask: (id: string) => api.delete(`/hotel/housekeeping-tasks/${id}`),
};

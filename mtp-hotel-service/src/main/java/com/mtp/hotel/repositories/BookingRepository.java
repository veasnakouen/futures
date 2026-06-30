package com.mtp.hotel.repositories;

import com.mtp.hotel.models.Booking;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BookingRepository extends JpaRepository<Booking, Integer> {
}

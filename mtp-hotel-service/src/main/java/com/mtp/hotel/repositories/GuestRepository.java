package com.mtp.hotel.repositories;

import com.mtp.hotel.models.Guest;
import org.springframework.data.jpa.repository.JpaRepository;

public interface GuestRepository extends JpaRepository<Guest, Integer> {
}

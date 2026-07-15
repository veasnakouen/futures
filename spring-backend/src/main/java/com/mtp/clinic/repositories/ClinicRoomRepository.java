package com.mtp.clinic.repositories;

import com.mtp.clinic.models.Room;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ClinicRoomRepository extends JpaRepository<Room, String> {
}

package com.mtp.hotel.config;

import com.mtp.hotel.models.Booking;
import com.mtp.hotel.models.Guest;
import com.mtp.hotel.models.HousekeepingTask;
import com.mtp.hotel.models.Room;
import com.mtp.hotel.repositories.BookingRepository;
import com.mtp.hotel.repositories.GuestRepository;
import com.mtp.hotel.repositories.HousekeepingTaskRepository;
import com.mtp.hotel.repositories.RoomRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Arrays;
import java.util.List;

@Component
@RequiredArgsConstructor
public class HotelDataSeeder implements CommandLineRunner {

    private final RoomRepository roomRepository;
    private final GuestRepository guestRepository;
    private final BookingRepository bookingRepository;
    private final HousekeepingTaskRepository housekeepingTaskRepository;

    @Override
    @Transactional
    public void run(String... args) throws Exception {
        if (roomRepository.count() == 0) {
            System.out.println(">>> SEEDER: Auto-populating initial Hotel Rooms...");
            Room r1 = new Room();
            r1.setRoomNumber("101");
            r1.setRoomType("STANDARD");
            r1.setPricePerNight(new BigDecimal("50.00"));
            r1.setStatus("AVAILABLE");
            r1.setCapacity(2);
            r1.setFloorNumber(1);
            r1.setBedrooms(1);
            r1.setBathrooms(1);
            r1.setBedType("1 Queen Bed");
            r1.setAmenities("Wi-Fi, TV, AC, Mini-Fridge");

            Room r2 = new Room();
            r2.setRoomNumber("201");
            r2.setRoomType("DELUXE");
            r2.setPricePerNight(new BigDecimal("120.00"));
            r2.setStatus("OCCUPIED");
            r2.setCapacity(3);
            r2.setFloorNumber(2);
            r2.setBedrooms(1);
            r2.setBathrooms(1);
            r2.setBedType("1 King Bed");
            r2.setAmenities("Wi-Fi, Smart TV, AC, Balcony, Ocean View");

            Room r3 = new Room();
            r3.setRoomNumber("301");
            r3.setRoomType("SUITE");
            r3.setPricePerNight(new BigDecimal("250.00"));
            r3.setStatus("AVAILABLE");
            r3.setCapacity(4);
            r3.setFloorNumber(3);
            r3.setBedrooms(2);
            r3.setBathrooms(2);
            r3.setBedType("2 King Beds");
            r3.setAmenities("Wi-Fi, Smart TV, AC, Jacuzzi, Kitchenette, Sea View");

            Room r4 = new Room();
            r4.setRoomNumber("401");
            r4.setRoomType("VILLA");
            r4.setPricePerNight(new BigDecimal("350.00"));
            r4.setStatus("DIRTY");
            r4.setCapacity(6);
            r4.setFloorNumber(1);
            r4.setBedrooms(3);
            r4.setBathrooms(3);
            r4.setBedType("3 King Beds");
            r4.setAmenities("Private Pool, Wi-Fi, Full Kitchen, BBQ Grill");

            roomRepository.saveAll(Arrays.asList(r1, r2, r3, r4));
        }

        if (guestRepository.count() == 0) {
            System.out.println(">>> SEEDER: Auto-populating initial Hotel Guests...");
            Guest g1 = new Guest();
            g1.setFirstName("John");
            g1.setLastName("Smith");
            g1.setEmail("john.smith@gmail.com");
            g1.setPhoneNumber("+1 555-0199");
            g1.setNationality("American");
            g1.setIdProofNumber("US-8839201");

            Guest g2 = new Guest();
            g2.setFirstName("Alice");
            g2.setLastName("Dupont");
            g2.setEmail("alice.dupont@yahoo.fr");
            g2.setPhoneNumber("+33 612-345678");
            g2.setNationality("French");
            g2.setIdProofNumber("FR-9940129");

            guestRepository.saveAll(Arrays.asList(g1, g2));
        }

        List<Room> rooms = roomRepository.findAll();
        List<Guest> guests = guestRepository.findAll();

        if (bookingRepository.count() == 0 && !rooms.isEmpty() && !guests.isEmpty()) {
            System.out.println(">>> SEEDER: Auto-populating initial Hotel Bookings...");
            Booking b1 = new Booking();
            b1.setGuest(guests.get(0));
            b1.setRoom(rooms.get(1)); // Room 201
            b1.setCheckInDate(LocalDate.now().minusDays(1));
            b1.setCheckOutDate(LocalDate.now().plusDays(3));
            b1.setTotalPrice(new BigDecimal("480.00"));
            b1.setStatus("CHECKED_IN");

            Booking b2 = new Booking();
            b2.setGuest(guests.size() > 1 ? guests.get(1) : guests.get(0));
            b2.setRoom(rooms.get(2)); // Room 301
            b2.setCheckInDate(LocalDate.now().plusDays(2));
            b2.setCheckOutDate(LocalDate.now().plusDays(6));
            b2.setTotalPrice(new BigDecimal("1000.00"));
            b2.setStatus("CONFIRMED");

            bookingRepository.saveAll(Arrays.asList(b1, b2));
        }

        if (housekeepingTaskRepository.count() == 0 && !rooms.isEmpty()) {
            System.out.println(">>> SEEDER: Auto-populating initial Housekeeping Tasks...");
            HousekeepingTask task1 = new HousekeepingTask();
            task1.setRoom(rooms.get(3)); // Room 401 Dirty
            task1.setTaskDate(LocalDate.now());
            task1.setStatus("PENDING");
            task1.setDescription("Deep clean villa pool & change all bedsheets");

            housekeepingTaskRepository.save(task1);
        }
    }
}

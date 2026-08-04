package com.mtp.stock.config;

import com.mtp.stock.models.Location;
import com.mtp.stock.repositories.LocationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.Arrays;

@Component
@RequiredArgsConstructor
public class StockDataSeeder implements CommandLineRunner {

    private final LocationRepository locationRepository;

    @Override
    @Transactional
    public void run(String... args) throws Exception {
        if (locationRepository.count() == 0) {
            System.out.println(">>> SEEDER: Auto-populating initial Inventory Storage Location Nodes...");

            Location loc1 = new Location();
            loc1.setName("Central Warehouse Node A");
            loc1.setType("WAREHOUSE");
            loc1.setServiceId("mtp-stock-service");
            loc1.setAddress("HQ Building Floor 1, Zone A");
            loc1.setManagerName("Operations Manager");
            loc1.setIsActive(true);

            Location loc2 = new Location();
            loc2.setName("Retail & POS Storefront Node B");
            loc2.setType("STOREFRONT");
            loc2.setServiceId("mtp-pos-service");
            loc2.setAddress("Retail Plaza #102");
            loc2.setManagerName("POS Manager");
            loc2.setIsActive(true);

            Location loc3 = new Location();
            loc3.setName("Hospitality & Hotel Supply Depot C");
            loc3.setType("HOTEL_STORAGE");
            loc3.setServiceId("mtp-hotel-service");
            loc3.setAddress("Hotel Tower B Basement");
            loc3.setManagerName("Housekeeping Supervisor");
            loc3.setIsActive(true);

            Location loc4 = new Location();
            loc4.setName("Clinic & Pharmacy Vault D");
            loc4.setType("CLINIC_PHARMACY");
            loc4.setServiceId("mtp-clinic-service");
            loc4.setAddress("Medical Center Wing A, Room 105");
            loc4.setManagerName("Head Pharmacist");
            loc4.setIsActive(true);

            locationRepository.saveAll(Arrays.asList(loc1, loc2, loc3, loc4));
        }
    }
}

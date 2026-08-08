package com.mtp.stock.services.impl;

import com.mtp.stock.models.Location;
import com.mtp.stock.repositories.LocationRepository;
import com.mtp.stock.services.LocationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cloud.client.discovery.DiscoveryClient;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class LocationServiceImpl implements LocationService {

    @Autowired
    private LocationRepository locationRepository;

    @Autowired
    private DiscoveryClient discoveryClient;

    @Override
    public List<Location> getAllLocations() {
        // Auto-discover services from Eureka
        List<String> services = discoveryClient.getServices();

        for (String service : services) {
            // Ignore infrastructure and self
            if (service.equalsIgnoreCase("mtp-discovery-server") ||
                    service.equalsIgnoreCase("mtp-api-gateway") ||
                    service.equalsIgnoreCase("mtp-stock-service")) {
                continue;
            }

            // Check if this service is already registered as a location
            Location loc = locationRepository.findByServiceId(service).orElseGet(() -> {
                Location newLoc = new Location();
                newLoc.setName(service.toUpperCase().replace("-SERVICE", "").replace("MTP-", "") + " Node");
                newLoc.setServiceId(service);
                newLoc.setType("SERVICE_NODE");
                newLoc.setIsActive(true);
                return locationRepository.save(newLoc);
            });

            // Check real-time status
            boolean hasInstances = !discoveryClient.getInstances(service).isEmpty();
            loc.setStatus(hasInstances ? "ONLINE" : "OFFLINE");
        }

        // Return all locations with updated transient status where applicable
        List<Location> allLocs = locationRepository.findAll();
        for (Location loc : allLocs) {
            if (loc.getServiceId() != null) {
                boolean hasInstances = !discoveryClient.getInstances(loc.getServiceId()).isEmpty();
                loc.setStatus(hasInstances ? "ONLINE" : "OFFLINE");
            } else {
                loc.setStatus("STATIC");
            }
        }
        return allLocs;
    }

    @Override
    public Location createLocation(Location location) {
        return locationRepository.save(location);
    }
}

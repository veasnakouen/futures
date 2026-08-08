package com.mtp.stock.services;

import com.mtp.stock.models.Location;
import java.util.List;

public interface LocationService {
    List<Location> getAllLocations();
    Location createLocation(Location location);
}

package com.mtp.api.strategy.impl;

import com.mtp.api.models.Placement;
import com.mtp.api.strategy.PlacementStrategy;
import org.springframework.stereotype.Component;

@Component("fullTimeStrategy")
public class FullTimePlacementStrategy implements PlacementStrategy {
    @Override
    public boolean isValid(Placement placement) {
        // Business Rule: Full time must have a salary > 200
        try {
            double salary = Double.parseDouble(placement.getSalary());
            return salary > 200;
        } catch (Exception e) {
            return false;
        }
    }

    @Override
    public String getPlacementCategory() {
        return "FULL_TIME";
    }
}

package com.mtp.api.strategy;

import com.mtp.api.models.Placement;

public interface PlacementStrategy {
    boolean isValid(Placement placement);
    String getPlacementCategory();
}

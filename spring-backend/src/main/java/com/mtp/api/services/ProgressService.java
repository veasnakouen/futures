package com.mtp.api.services;

import com.mtp.api.dto.MonitoringDto;
import java.util.List;

public interface ProgressService {
    // Monitoring
    List<MonitoringDto> getAllMonitorings();
    List<MonitoringDto> getMonitoringsByClient(Integer clientId);
    MonitoringDto saveMonitoring(MonitoringDto dto);
    
    // Detailed progress methods can be added here as needed
}

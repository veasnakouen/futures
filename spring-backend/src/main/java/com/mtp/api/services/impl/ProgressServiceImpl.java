package com.mtp.api.services.impl;

import com.mtp.api.dto.MonitoringDto;
import com.mtp.api.models.Monitoring;
import com.mtp.api.repositories.MonitoringRepository;
import com.mtp.api.repositories.ClientRepository;
import com.mtp.api.services.ProgressService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ProgressServiceImpl implements ProgressService {

    @Autowired private MonitoringRepository monitoringRepository;
    @Autowired private ClientRepository clientRepository;

    @Override
    public List<MonitoringDto> getAllMonitorings() {
        return monitoringRepository.findAll().stream().map(this::mapToDto).collect(Collectors.toList());
    }

    @Override
    public List<MonitoringDto> getMonitoringsByClient(Integer clientId) {
        return monitoringRepository.findByClientId(clientId).stream().map(this::mapToDto).collect(Collectors.toList());
    }

    @Override
    public MonitoringDto saveMonitoring(MonitoringDto dto) {
        Monitoring entity = mapToEntity(dto);
        return mapToDto(monitoringRepository.save(entity));
    }

    private MonitoringDto mapToDto(Monitoring e) {
        MonitoringDto d = new MonitoringDto();
        d.setId(e.getId());
        d.setMonitoringTime(e.getMonitoringTime());
        d.setEnroll(e.getEnroll());
        d.setType(e.getType());
        d.setMonitoringDate(e.getMonitoringDate());
        d.setNextMonitoringDate(e.getNextMonitoringDate());
        d.setMonitoringtype(e.getMonitoringtype());
        if (e.getClient() != null) {
            d.setClientId(e.getClient().getId());
            d.setClientName(e.getClient().getFirstName() + " " + e.getClient().getLastName());
        }
        return d;
    }

    private Monitoring mapToEntity(MonitoringDto d) {
        Monitoring e = d.getId() != null ? monitoringRepository.findById(d.getId()).orElse(new Monitoring()) : new Monitoring();
        e.setMonitoringTime(d.getMonitoringTime());
        e.setEnroll(d.getEnroll());
        e.setType(d.getType());
        e.setMonitoringDate(d.getMonitoringDate());
        e.setNextMonitoringDate(d.getNextMonitoringDate());
        e.setMonitoringtype(d.getMonitoringtype());
        if (d.getClientId() != null) e.setClient(clientRepository.findById(d.getClientId()).orElse(null));
        return e;
    }
}

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

    @Autowired
    private MonitoringRepository monitoringRepository;
    @Autowired
    private ClientRepository clientRepository;

    @Autowired
    private com.mtp.api.repositories.PlacementProgressRepository placementProgressRepository;

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

    @Override
    public void deleteMonitoring(Integer id) {
        monitoringRepository.deleteById(id);
    }
    
    @Override
    public List<com.mtp.api.dto.PlacementMonitoringDto> getPlacementMonitoringsByClient(Integer clientId) {
        return monitoringRepository.findByClientId(clientId).stream()
                .filter(m -> "Placement".equals(m.getType()))
                .map(m -> {
                    List<com.mtp.api.models.PlacementProgress> progresses = placementProgressRepository.findByMonitoringId(m.getId());
                    return mapToPlacementMonitoringDto(m, progresses.isEmpty() ? null : progresses.get(0));
                }).collect(Collectors.toList());
    }

    @Override
    public com.mtp.api.dto.PlacementMonitoringDto savePlacementMonitoring(com.mtp.api.dto.PlacementMonitoringDto dto) {
        Monitoring m = new Monitoring();
        if (dto.getMonitoringId() != null) {
            m = monitoringRepository.findById(dto.getMonitoringId()).orElse(new Monitoring());
        }
        m.setMonitoringTime(dto.getMonitoringTime());
        m.setEnroll(dto.getEnroll());
        m.setType("Placement");
        m.setMonitoringDate(dto.getMonitoringDate());
        m.setNextMonitoringDate(dto.getNextMonitoringDate());
        m.setMonitoringtype(dto.getMonitoringtype());
        if (dto.getClientId() != null) {
            m.setClient(clientRepository.findById(dto.getClientId()).orElse(null));
        }
        m.setPlacementId(dto.getPlacementId());
        
        m = monitoringRepository.save(m);
        
        com.mtp.api.models.PlacementProgress p = new com.mtp.api.models.PlacementProgress();
        if (dto.getId() != null) {
            p = placementProgressRepository.findById(dto.getId()).orElse(new com.mtp.api.models.PlacementProgress());
        }
        p.setMonitoring(m);
        p.setCompleted(dto.getCompleted());
        p.setPlacementStatus(dto.getPlacementStatus());
        p.setSalary(dto.getSalary());
        p.setNote(dto.getNote());
        
        p = placementProgressRepository.save(p);
        return mapToPlacementMonitoringDto(m, p);
    }

    @Override
    public void deletePlacementMonitoring(Integer placementProgressId) {
        com.mtp.api.models.PlacementProgress p = placementProgressRepository.findById(placementProgressId).orElse(null);
        if (p != null) {
            placementProgressRepository.deleteById(placementProgressId);
            if (p.getMonitoring() != null) {
                monitoringRepository.deleteById(p.getMonitoring().getId());
            }
        }
    }

    private com.mtp.api.dto.PlacementMonitoringDto mapToPlacementMonitoringDto(Monitoring m, com.mtp.api.models.PlacementProgress p) {
        com.mtp.api.dto.PlacementMonitoringDto d = new com.mtp.api.dto.PlacementMonitoringDto();
        d.setMonitoringId(m.getId());
        d.setMonitoringTime(m.getMonitoringTime());
        d.setEnroll(m.getEnroll());
        d.setType(m.getType());
        d.setMonitoringDate(m.getMonitoringDate());
        d.setNextMonitoringDate(m.getNextMonitoringDate());
        d.setMonitoringtype(m.getMonitoringtype());
        d.setPlacementId(m.getPlacementId());
        if (m.getClient() != null) {
            d.setClientId(m.getClient().getId());
            d.setClientName(m.getClient().getFirstName() + " " + m.getClient().getLastName());
        }
        if (p != null) {
            d.setId(p.getId());
            d.setCompleted(p.getCompleted());
            d.setPlacementStatus(p.getPlacementStatus());
            d.setSalary(p.getSalary());
            d.setNote(p.getNote());
        }
        return d;
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
        Monitoring e = d.getId() != null ? monitoringRepository.findById(d.getId()).orElse(new Monitoring())
                : new Monitoring();
        e.setMonitoringTime(d.getMonitoringTime());
        e.setEnroll(d.getEnroll());
        e.setType(d.getType());
        e.setMonitoringDate(d.getMonitoringDate());
        e.setNextMonitoringDate(d.getNextMonitoringDate());
        e.setMonitoringtype(d.getMonitoringtype());
        if (d.getClientId() != null)
            e.setClient(clientRepository.findById(d.getClientId()).orElse(null));
        return e;
    }
}

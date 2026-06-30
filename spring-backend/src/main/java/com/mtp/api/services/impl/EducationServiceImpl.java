package com.mtp.api.services.impl;

import com.mtp.api.dto.*;
import com.mtp.api.models.*;
import com.mtp.api.repositories.*;
import com.mtp.api.services.EducationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class EducationServiceImpl implements EducationService {

    @Autowired private SubjectRepository subjectRepository;
    @Autowired private LessionRepository lessionRepository;
    @Autowired private EducationRepository educationRepository;
    @Autowired private FuturesTrainingRepository futuresTrainingRepository;
    @Autowired private ClientRepository clientRepository;

    @Override
    public List<SubjectDto> getAllSubjects() {
        return subjectRepository.findAll().stream().map(this::mapToDto).collect(Collectors.toList());
    }

    @Override
    public SubjectDto saveSubject(SubjectDto dto) {
        Subject entity = mapToEntity(dto);
        return mapToDto(subjectRepository.save(entity));
    }

    @Override
    public void deleteSubject(Integer id) {
        subjectRepository.deleteById(id);
    }

    @Override
    public List<LessionDto> getLessionsBySubject(Integer subjectId) {
        return lessionRepository.findBySubjectId(subjectId).stream().map(this::mapToDto).collect(Collectors.toList());
    }

    @Override
    public LessionDto saveLession(LessionDto dto) {
        Lession entity = mapToEntity(dto);
        return mapToDto(lessionRepository.save(entity));
    }

    @Override
    public void deleteLession(Integer id) {
        lessionRepository.deleteById(id);
    }

    @Override
    public List<EducationDto> getEducationsByClient(Integer clientId) {
        return educationRepository.findByClientId(clientId).stream().map(this::mapToDto).collect(Collectors.toList());
    }

    @Override
    public EducationDto saveEducation(EducationDto dto) {
        Education entity = mapToEntity(dto);
        return mapToDto(educationRepository.save(entity));
    }

    @Override
    public void deleteEducation(Integer id) {
        educationRepository.deleteById(id);
    }

    @Override
    public List<FuturesTrainingDto> getTrainingsByClient(Integer clientId) {
        return futuresTrainingRepository.findByClientId(clientId).stream().map(this::mapToDto).collect(Collectors.toList());
    }

    @Override
    public FuturesTrainingDto saveTraining(FuturesTrainingDto dto) {
        FuturesTraining entity = mapToEntity(dto);
        return mapToDto(futuresTrainingRepository.save(entity));
    }

    @Override
    public void deleteTraining(Integer id) {
        futuresTrainingRepository.deleteById(id);
    }

    // Mappers
    private SubjectDto mapToDto(Subject e) {
        SubjectDto d = new SubjectDto();
        d.setId(e.getId());
        d.setName(e.getName());
        return d;
    }

    private Subject mapToEntity(SubjectDto d) {
        Subject e = d.getId() != null ? subjectRepository.findById(d.getId()).orElse(new Subject()) : new Subject();
        e.setName(d.getName());
        return e;
    }

    private LessionDto mapToDto(Lession e) {
        LessionDto d = new LessionDto();
        d.setId(e.getId());
        d.setName(e.getLessionSub());
        if (e.getSubject() != null) {
            d.setSubjectId(e.getSubject().getId());
            d.setSubjectName(e.getSubject().getName());
        }
        return d;
    }

    private Lession mapToEntity(LessionDto d) {
        Lession e = d.getId() != null ? lessionRepository.findById(d.getId()).orElse(new Lession()) : new Lession();
        e.setLessionSub(d.getName());
        if (d.getSubjectId() != null) e.setSubject(subjectRepository.findById(d.getSubjectId()).orElse(null));
        return e;
    }

    private EducationDto mapToDto(Education e) {
        EducationDto d = new EducationDto();
        d.setId(e.getId());
        d.setCurrentLevel(e.getLevel());
        d.setSchoolName(e.getSchoolName());
        d.setGrade(e.getGrade());
        d.setSubject(e.getSubject());
        d.setYear(e.getYear());
        d.setDescription(e.getDescription());
        // Entity doesn't have status, startDate, endDate - leave as null or handle if needed
        if (e.getClient() != null) {
            d.setClientId(e.getClient().getId());
            d.setClientName(e.getClient().getFirstName() + " " + e.getClient().getLastName());
        }
        return d;
    }

    private Education mapToEntity(EducationDto d) {
        Education e = d.getId() != null ? educationRepository.findById(d.getId()).orElse(new Education()) : new Education();
        e.setLevel(d.getCurrentLevel());
        e.setSchoolName(d.getSchoolName());
        e.setGrade(d.getGrade());
        e.setSubject(d.getSubject());
        e.setYear(d.getYear());
        e.setDescription(d.getDescription());
        if (d.getClientId() != null) {
            e.setClientId(d.getClientId());
            e.setClient(clientRepository.findById(d.getClientId()).orElse(null));
        }
        return e;
    }

    private FuturesTrainingDto mapToDto(FuturesTraining e) {
        FuturesTrainingDto d = new FuturesTrainingDto();
        d.setId(e.getId());
        d.setStartDate(e.getOpenDate());
        d.setEndDate(e.getCloseDate());
        d.setStatus(e.getStatus());
        if (e.getClient() != null) {
            d.setClientId(e.getClient().getId());
            d.setClientName(e.getClient().getFirstName() + " " + e.getClient().getLastName());
        }
        if (e.getSubject() != null) {
            d.setSubjectId(e.getSubject().getId());
            d.setSubjectName(e.getSubject().getName());
        }
        return d;
    }

    private FuturesTraining mapToEntity(FuturesTrainingDto d) {
        FuturesTraining e = d.getId() != null ? futuresTrainingRepository.findById(d.getId()).orElse(new FuturesTraining()) : new FuturesTraining();
        e.setOpenDate(d.getStartDate());
        e.setCloseDate(d.getEndDate());
        e.setStatus(d.getStatus());
        if (d.getClientId() != null) e.setClient(clientRepository.findById(d.getClientId()).orElse(null));
        if (d.getSubjectId() != null) e.setSubject(subjectRepository.findById(d.getSubjectId()).orElse(null));
        return e;
    }
}

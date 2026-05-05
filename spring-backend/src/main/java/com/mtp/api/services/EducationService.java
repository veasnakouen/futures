package com.mtp.api.services;

import com.mtp.api.dto.*;
import java.util.List;

public interface EducationService {
    // Subjects & Lessons
    List<SubjectDto> getAllSubjects();
    SubjectDto saveSubject(SubjectDto dto);
    List<LessionDto> getLessionsBySubject(Integer subjectId);
    LessionDto saveLession(LessionDto dto);
    
    // Client Education & Training
    List<EducationDto> getEducationsByClient(Integer clientId);
    EducationDto saveEducation(EducationDto dto);
    void deleteEducation(Integer id);
    
    List<FuturesTrainingDto> getTrainingsByClient(Integer clientId);
    FuturesTrainingDto saveTraining(FuturesTrainingDto dto);
    void deleteTraining(Integer id);

    void deleteSubject(Integer id);
    void deleteLession(Integer id);
}

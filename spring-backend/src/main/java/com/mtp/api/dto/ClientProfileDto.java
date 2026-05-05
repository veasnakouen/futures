package com.mtp.api.dto;

import com.mtp.api.models.Client;
import com.mtp.api.models.Case;
import com.mtp.api.models.Placement;
import com.mtp.api.models.SocialSupport;
import com.mtp.api.models.Education;
import com.mtp.api.models.Language;
import com.mtp.api.models.ComputerSkill;
import com.mtp.api.models.JobExperience;
import lombok.Data;
import java.util.List;

@Data
public class ClientProfileDto {
    private Client client;
    private List<Case> cases;
    private List<Placement> placements;
    private List<SocialSupport> socialSupports;
    private List<Education> educations;
    private List<Language> languages;
    private List<ComputerSkill> computerSkills;
    private List<JobExperience> jobExperiences;
}

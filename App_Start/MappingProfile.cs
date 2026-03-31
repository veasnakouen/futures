using AutoMapper;
using MtpApp.Dtos;
using MtpApp.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace MtpApp.App_Start
{
    public class MappingProfile: Profile
    {
        public MappingProfile()
        {
            //Domain to Dto
            Mapper.CreateMap<TicketType, TicketTypeDto>();
            Mapper.CreateMap<Agent, AgentDto>();
            Mapper.CreateMap<Position, PositionDto>();
            Mapper.CreateMap<Department, DepartmentDto>();
            Mapper.CreateMap<Category, CategoryDto>();
            Mapper.CreateMap<Employee, EmployeeDto>();
            Mapper.CreateMap<Employer, EmployerDto>();
            Mapper.CreateMap<JobCategory, JobCategoryDto>();
            Mapper.CreateMap<JobPosition, JobPositionDto>();
            Mapper.CreateMap<Vacancy, VacancyDto>();
            Mapper.CreateMap<Client, ClientDto>();
            Mapper.CreateMap<Beneficiary, BeneficiaryDto>();
            Mapper.CreateMap<FurtherEducation, FurtherEducationDto>();
            Mapper.CreateMap<EducationReferralSource, EducationReferralSourceDto>();
            Mapper.CreateMap<FurtherEducationReferral, FurtherEducationReferralDto>();
            Mapper.CreateMap<JobExpectation, JobExpectationDto>();
            Mapper.CreateMap<JobExperience, JobExperienceDto>();
            Mapper.CreateMap<Education, EducationDto>();
            Mapper.CreateMap<Language, LanguageDto>();
            Mapper.CreateMap<ComputerSkill, ComputerSkillDto>();
            Mapper.CreateMap<Personality, PersonalityDto>();
            Mapper.CreateMap<CaseWorker, CaseWorkerDto>();
            Mapper.CreateMap<Case, CaseDto>();
            Mapper.CreateMap<Placement, PlacementDto>();
            Mapper.CreateMap<Subject, SubjectDto>();
            Mapper.CreateMap<FuturesTraining, FuturesTrainingDto>();
            Mapper.CreateMap<SocialSupport, SocialSupportDto>();
            Mapper.CreateMap<SocialCare, SocialCareDto>();
            Mapper.CreateMap<BusinessSetUpCategory, BusinessSetUpCateogryDto>();
            Mapper.CreateMap<BusinessSetUp, BusinessSetUpDto>();
            Mapper.CreateMap<Monitoring, MonitoringDto>();
            Mapper.CreateMap<PlacementProgress, PLacementProcessDto>();
            Mapper.CreateMap<BusinessInProgress, BusinessInProgressDto>();
            Mapper.CreateMap<Lession, LessionDto>();
            Mapper.CreateMap<FurthereducationInProgress, FurthereducationInProgressDto>();
            Mapper.CreateMap<FutureTrainingProgress, FutureTrainingProgressDto>();
            Mapper.CreateMap<LogBook, LogBookDto>();
            Mapper.CreateMap<SocialsupportCase, SocialsupportCaseDto>();
            Mapper.CreateMap<SocialSupportProblem, SocialSupportProblemDto>();
            Mapper.CreateMap<furtherEducationReferralSubject, furtherEducationReferralSubjectDto>();
            Mapper.CreateMap<CvReference, CvReferenceDto>();

            //Dto to Domain
            CreateMap<TicketTypeDto, TicketType>().ForMember(c => c.Id, opt => opt.Ignore());
            CreateMap<AgentDto, Agent>().ForMember(c => c.Id, opt => opt.Ignore());
            Mapper.CreateMap<PositionDto, Position>().ForMember(c => c.Id, opt => opt.Ignore());
            Mapper.CreateMap<DepartmentDto, Department>().ForMember(c => c.Id, opt => opt.Ignore());
            Mapper.CreateMap<CategoryDto, Category>().ForMember(c => c.Id, opt => opt.Ignore());
            Mapper.CreateMap<EmployeeDto, Employee>().ForMember(c => c.Id, opt => opt.Ignore());
            Mapper.CreateMap<EmployerDto, Employer>().ForMember(c => c.Id, opt => opt.Ignore());
            Mapper.CreateMap<JobCategoryDto, JobCategory>().ForMember(c => c.Id, opt => opt.Ignore());
            Mapper.CreateMap<JobPositionDto, JobPosition>().ForMember(c => c.Id, opt => opt.Ignore());
            Mapper.CreateMap<VacancyDto, Vacancy>().ForMember(c => c.Id, opt => opt.Ignore());
            Mapper.CreateMap<ClientDto, Client>().ForMember(c => c.Id, opt => opt.Ignore());
            Mapper.CreateMap<BeneficiaryDto, Beneficiary>().ForMember(c => c.Id, opt => opt.Ignore());
            Mapper.CreateMap<FurtherEducationDto, FurtherEducation>().ForMember(c => c.Id, opt => opt.Ignore());
            Mapper.CreateMap<EducationReferralSourceDto, EducationReferralSource>().ForMember(c => c.Id, opt => opt.Ignore());
            Mapper.CreateMap<FurtherEducationReferralDto, FurtherEducationReferral>().ForMember(c => c.Id, opt => opt.Ignore());
            Mapper.CreateMap<JobExpectationDto, JobExpectation>().ForMember(c => c.Id, opt => opt.Ignore());
            Mapper.CreateMap<JobExperienceDto, JobExperience>().ForMember(c => c.Id, opt => opt.Ignore());
            Mapper.CreateMap<EducationDto, Education>().ForMember(c => c.Id, opt => opt.Ignore());
            Mapper.CreateMap<LanguageDto, Language>().ForMember(c => c.Id, opt => opt.Ignore());
            Mapper.CreateMap<ComputerSkillDto, ComputerSkill>().ForMember(c => c.Id, opt => opt.Ignore());
            Mapper.CreateMap<PersonalityDto, Personality>().ForMember(c => c.Id, opt => opt.Ignore());
            Mapper.CreateMap<CaseWorkerDto, CaseWorker>().ForMember(c => c.Id, opt => opt.Ignore());
            Mapper.CreateMap<CaseDto, Case>().ForMember(c => c.Id, opt => opt.Ignore());
            Mapper.CreateMap<PlacementDto, Placement>().ForMember(c => c.Id, opt => opt.Ignore());
            Mapper.CreateMap<SubjectDto, Subject>().ForMember(c => c.Id, opt => opt.Ignore());
            Mapper.CreateMap<FuturesTrainingDto, FuturesTraining>().ForMember(c => c.id, opt => opt.Ignore());
            Mapper.CreateMap<SocialSupportDto, SocialSupport>().ForMember(c =>c.Id, opt => opt.Ignore());
            Mapper.CreateMap<SocialCareDto, SocialCare>().ForMember(c => c.Id, opt => opt.Ignore());
            Mapper.CreateMap<BusinessSetUpCateogryDto, BusinessSetUpCategory>().ForMember(c => c.Id, opt => opt.Ignore());
            Mapper.CreateMap<BusinessSetUpDto, BusinessSetUp>().ForMember(c => c.Id, opt => opt.Ignore());
            Mapper.CreateMap<MonitoringDto, Monitoring>().ForMember(c => c.Id, opt => opt.Ignore());
            Mapper.CreateMap<PLacementProcessDto, PlacementProgress>().ForMember(c => c.Id, opt => opt.Ignore());
            Mapper.CreateMap<BusinessInProgressDto, BusinessInProgress>().ForMember(c => c.Id, opt => opt.Ignore());
            Mapper.CreateMap<LessionDto, Lession>().ForMember(c => c.Id, opt => opt.Ignore());
            Mapper.CreateMap<FurthereducationInProgressDto, FurthereducationInProgress>().ForMember(c => c.Id, opt => opt.Ignore());
            Mapper.CreateMap<FutureTrainingProgressDto, FutureTrainingProgress>().ForMember(c => c.Id, opt => opt.Ignore());
            Mapper.CreateMap<LogBookDto, LogBook>().ForMember(c => c.Id, opt => opt.Ignore());
            Mapper.CreateMap<SocialsupportCaseDto, SocialsupportCase>().ForMember(c => c.Id, opt => opt.Ignore());
            Mapper.CreateMap<SocialSupportProblemDto, SocialSupportProblem>().ForMember(c => c.Id, opt => opt.Ignore());
            Mapper.CreateMap<furtherEducationReferralSubjectDto, furtherEducationReferralSubject>().ForMember(c => c.Id, opt => opt.Ignore());
            Mapper.CreateMap<CvReferenceDto, CvReference>().ForMember(c => c.Id, opt => opt.Ignore());
        }
    }
}
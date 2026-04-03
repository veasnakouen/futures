using AutoMapper;
using MtpApp.Dtos;
using MtpApp.Models;

namespace MtpApp.App_Start
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            //Domain to Dto
            CreateMap<TicketType, TicketTypeDto>();
            CreateMap<Agent, AgentDto>();
            CreateMap<Position, PositionDto>();
            CreateMap<Department, DepartmentDto>();
            CreateMap<Category, CategoryDto>();
            CreateMap<Employee, EmployeeDto>();
            CreateMap<Employer, EmployerDto>();
            CreateMap<JobCategory, JobCategoryDto>();
            CreateMap<JobPosition, JobPositionDto>();
            CreateMap<Vacancy, VacancyDto>();
            CreateMap<Client, ClientDto>();
            CreateMap<Beneficiary, BeneficiaryDto>();
            CreateMap<FurtherEducation, FurtherEducationDto>();
            CreateMap<EducationReferralSource, EducationReferralSourceDto>();
            CreateMap<FurtherEducationReferral, FurtherEducationReferralDto>();
            CreateMap<JobExpectation, JobExpectationDto>();
            CreateMap<JobExperience, JobExperienceDto>();
            CreateMap<Education, EducationDto>();
            CreateMap<Language, LanguageDto>();
            CreateMap<ComputerSkill, ComputerSkillDto>();
            CreateMap<Personality, PersonalityDto>();
            CreateMap<CaseWorker, CaseWorkerDto>();
            CreateMap<Case, CaseDto>();
            CreateMap<Placement, PlacementDto>();
            CreateMap<Subject, SubjectDto>();
            CreateMap<FuturesTraining, FuturesTrainingDto>();
            CreateMap<SocialSupport, SocialSupportDto>();
            CreateMap<SocialCare, SocialCareDto>();
            CreateMap<BusinessSetUpCategory, BusinessSetUpCateogryDto>();
            CreateMap<BusinessSetUp, BusinessSetUpDto>();
            CreateMap<Monitoring, MonitoringDto>();
            CreateMap<PlacementProgress, PLacementProcessDto>();
            CreateMap<BusinessInProgress, BusinessInProgressDto>();
            CreateMap<Lession, LessionDto>();
            CreateMap<FurthereducationInProgress, FurthereducationInProgressDto>();
            CreateMap<FutureTrainingProgress, FutureTrainingProgressDto>();
            CreateMap<LogBook, LogBookDto>();
            CreateMap<SocialsupportCase, SocialsupportCaseDto>();
            CreateMap<SocialSupportProblem, SocialSupportProblemDto>();
            CreateMap<furtherEducationReferralSubject, furtherEducationReferralSubjectDto>();
            CreateMap<CvReference, CvReferenceDto>();

            //Dto to Domain
            CreateMap<TicketTypeDto, TicketType>().ForMember(c => c.Id, opt => opt.Ignore());
            CreateMap<AgentDto, Agent>().ForMember(c => c.Id, opt => opt.Ignore());
            CreateMap<PositionDto, Position>().ForMember(c => c.Id, opt => opt.Ignore());
            CreateMap<DepartmentDto, Department>().ForMember(c => c.Id, opt => opt.Ignore());
            CreateMap<CategoryDto, Category>().ForMember(c => c.Id, opt => opt.Ignore());
            CreateMap<EmployeeDto, Employee>().ForMember(c => c.Id, opt => opt.Ignore());
            CreateMap<EmployerDto, Employer>().ForMember(c => c.Id, opt => opt.Ignore());
            CreateMap<JobCategoryDto, JobCategory>().ForMember(c => c.Id, opt => opt.Ignore());
            CreateMap<JobPositionDto, JobPosition>().ForMember(c => c.Id, opt => opt.Ignore());
            CreateMap<VacancyDto, Vacancy>().ForMember(c => c.Id, opt => opt.Ignore());
            CreateMap<ClientDto, Client>().ForMember(c => c.Id, opt => opt.Ignore());
            CreateMap<BeneficiaryDto, Beneficiary>().ForMember(c => c.Id, opt => opt.Ignore());
            CreateMap<FurtherEducationDto, FurtherEducation>().ForMember(c => c.Id, opt => opt.Ignore());
            CreateMap<EducationReferralSourceDto, EducationReferralSource>().ForMember(c => c.Id, opt => opt.Ignore());
            CreateMap<FurtherEducationReferralDto, FurtherEducationReferral>().ForMember(c => c.Id, opt => opt.Ignore());
            CreateMap<JobExpectationDto, JobExpectation>().ForMember(c => c.Id, opt => opt.Ignore());
            CreateMap<JobExperienceDto, JobExperience>().ForMember(c => c.Id, opt => opt.Ignore());
            CreateMap<EducationDto, Education>().ForMember(c => c.Id, opt => opt.Ignore());
            CreateMap<LanguageDto, Language>().ForMember(c => c.Id, opt => opt.Ignore());
            CreateMap<ComputerSkillDto, ComputerSkill>().ForMember(c => c.Id, opt => opt.Ignore());
            CreateMap<PersonalityDto, Personality>().ForMember(c => c.Id, opt => opt.Ignore());
            CreateMap<CaseWorkerDto, CaseWorker>().ForMember(c => c.Id, opt => opt.Ignore());
            CreateMap<CaseDto, Case>().ForMember(c => c.Id, opt => opt.Ignore());
            CreateMap<PlacementDto, Placement>().ForMember(c => c.Id, opt => opt.Ignore());
            CreateMap<SubjectDto, Subject>().ForMember(c => c.Id, opt => opt.Ignore());
            CreateMap<FuturesTrainingDto, FuturesTraining>().ForMember(c => c.id, opt => opt.Ignore());
            CreateMap<SocialSupportDto, SocialSupport>().ForMember(c => c.Id, opt => opt.Ignore());
            CreateMap<SocialCareDto, SocialCare>().ForMember(c => c.Id, opt => opt.Ignore());
            CreateMap<BusinessSetUpCateogryDto, BusinessSetUpCategory>().ForMember(c => c.Id, opt => opt.Ignore());
            CreateMap<BusinessSetUpDto, BusinessSetUp>().ForMember(c => c.Id, opt => opt.Ignore());
            CreateMap<MonitoringDto, Monitoring>().ForMember(c => c.Id, opt => opt.Ignore());
            CreateMap<PLacementProcessDto, PlacementProgress>().ForMember(c => c.Id, opt => opt.Ignore());
            CreateMap<BusinessInProgressDto, BusinessInProgress>().ForMember(c => c.Id, opt => opt.Ignore());
            CreateMap<LessionDto, Lession>().ForMember(c => c.Id, opt => opt.Ignore());
            CreateMap<FurthereducationInProgressDto, FurthereducationInProgress>().ForMember(c => c.Id, opt => opt.Ignore());
            CreateMap<FutureTrainingProgressDto, FutureTrainingProgress>().ForMember(c => c.Id, opt => opt.Ignore());
            CreateMap<LogBookDto, LogBook>().ForMember(c => c.Id, opt => opt.Ignore());
            CreateMap<SocialsupportCaseDto, SocialsupportCase>().ForMember(c => c.Id, opt => opt.Ignore());
            CreateMap<SocialSupportProblemDto, SocialSupportProblem>().ForMember(c => c.Id, opt => opt.Ignore());
            CreateMap<furtherEducationReferralSubjectDto, furtherEducationReferralSubject>().ForMember(c => c.Id, opt => opt.Ignore());
            CreateMap<CvReferenceDto, CvReference>().ForMember(c => c.Id, opt => opt.Ignore());
        }
    }
}
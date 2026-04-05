using System.Security.Claims;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;

namespace MtpApp.Models
{
    // You can add profile data for the user by adding more properties to your ApplicationUser class, please visit http://go.microsoft.com/fwlink/?LinkID=317594 to learn more.
    public class ApplicationUser : IdentityUser
    {
        [Required]
        [StringLength(255)]
        [Display(Name = "First Name")]
        public string FirstName { get; set; }

        [Required]
        [StringLength(255)]
        [Display(Name = "Last Name")]
        public string LastName { get; set; }

        [Required]
        [StringLength(255)]
        [Display(Name = "Branch")]
        public string Branch { get; set; }

        public bool IsDeleted { get; set; }

        public ICollection<ApplicationUserRole> Roles { get; set; } = new List<ApplicationUserRole>();

        public async Task<ClaimsIdentity> GenerateUserIdentityAsync(UserManager<ApplicationUser> manager)
        {
            // In ASP.NET Core Identity the ClaimsPrincipal is created by SignInManager.
            // Provide a minimal ClaimsIdentity for compatibility during migration.
            await Task.CompletedTask;
            return new ClaimsIdentity();
        }
    }

    public class ApplicationUserRole : IdentityUserRole<string>
    {
    }

    public class ApplicationDbContext : IdentityDbContext<ApplicationUser, IdentityRole, string, IdentityUserClaim<string>, ApplicationUserRole, IdentityUserLogin<string>, IdentityRoleClaim<string>, IdentityUserToken<string>>
    {
        public DbSet<TicketType> TicketTypes { get; set; }
        public DbSet<Agent> Agents { get; set; }
        public DbSet<Position> Positions { get; set; }
        public DbSet<Department> Departments { get; set; }
        public DbSet<Category> Categories { get; set; }
        public DbSet<Employee> Employees { get; set; }
        public DbSet<Employer> Employers { get; set; }
        public DbSet<JobCategory> JobCategory { get; set; }
        public DbSet<JobPosition> JobPosition { get; set; }
        public DbSet<Vacancy> Vacancies { get; set; }
        public DbSet<Client> Clients { get; set; }
        public DbSet<Beneficiary> Beneficiaries { get; set; }
        public DbSet<FurtherEducation> FurtherEducations { get; set; }
        public DbSet<EducationReferralSource> EducationReferralSources { get; set; }
        public DbSet<FurtherEducationReferral> FurtherEducationReferrals { get; set; }
        public DbSet<JobExpectation> JobExpectations { get; set; }
        public DbSet<JobExperience> JobExperiences { get; set; }
        public DbSet<Education> Educations { get; set; }
        public DbSet<Language> Languages { get; set; }
        public DbSet<ComputerSkill> ComputerSkills { get; set; }
        public DbSet<Personality> Personalities { get; set; }
        public DbSet<CaseWorker> CaseWorkers { get; set; }
        public DbSet<Case> Cases { get; set; }
        public DbSet<Placement> Placements { get; set; }
        public DbSet<Subject> Subjects { get; set; }
        public DbSet<FuturesTraining> FuturesTrainings { get; set; }
        public DbSet<SocialSupport> SocialSupports { get; set; }
        public DbSet<SocialCare> SocialCare { get; set; }
        public DbSet<BusinessSetUpCategory> BusinessSetUpCategories { get; set; }
        public DbSet<BusinessSetUp>BusinessSetUps { get; set; }
        public DbSet<Monitoring> Monitorings { get; set; }
        public DbSet<PlacementProgress> PlacementProgresses { get; set; }
        public DbSet<BusinessInProgress> BusinessInProgresses { get; set; }
        public DbSet<Lession> Lessions { get; set; }
        public DbSet<FutureTrainingProgress> FutureTrainingProgresses { get; set; }
        public DbSet<FurthereducationInProgress> FurthereducationInProgresses { get; set; }
        public DbSet<LogBook> LogBooks { get; set; }
        public DbSet<SocialsupportCase> SocialsupportCases { get; set; }
        public DbSet<SocialSupportProblem> SocialSupportProblems { get; set; }

        public DbSet<furtherEducationReferralSubject> furtherEducationReferralSubjects { get; set; }
        public DbSet<CvReference> CvReferenceS { get; set; }
        public DbSet<LoginHistory> LoginHistorys { get; set; }
        
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<ApplicationUserRole>()
                .HasKey(x => new { x.UserId, x.RoleId });

            // Map all entities to legacy EF6 table names to avoid convention mismatches.
            modelBuilder.Entity<TicketType>().ToTable("TicketTypes");
            modelBuilder.Entity<Agent>().ToTable("Agents");
            modelBuilder.Entity<Position>().ToTable("Positions");
            modelBuilder.Entity<Department>().ToTable("Departments");
            modelBuilder.Entity<Category>().ToTable("Categories");
            modelBuilder.Entity<Employee>().ToTable("Employees");
            modelBuilder.Entity<Employer>().ToTable("Employers");
            modelBuilder.Entity<JobCategory>().ToTable("JobCategories");
            modelBuilder.Entity<JobPosition>().ToTable("JobPositions");
            modelBuilder.Entity<Vacancy>().ToTable("Vacancies");
            modelBuilder.Entity<Client>().ToTable("Clients");
            modelBuilder.Entity<Beneficiary>().ToTable("Beneficiaries");
            modelBuilder.Entity<FurtherEducation>().ToTable("FurtherEducations");
            modelBuilder.Entity<EducationReferralSource>().ToTable("EducationReferralSources");
            modelBuilder.Entity<FurtherEducationReferral>().ToTable("FurtherEducationReferrals");
            modelBuilder.Entity<JobExpectation>().ToTable("JobExpectations");
            modelBuilder.Entity<JobExperience>().ToTable("JobExperiences");
            modelBuilder.Entity<Education>().ToTable("Educations");
            modelBuilder.Entity<Language>().ToTable("Languages");
            modelBuilder.Entity<ComputerSkill>().ToTable("ComputerSkills");
            modelBuilder.Entity<Personality>().ToTable("Personalities");
            modelBuilder.Entity<CaseWorker>().ToTable("CaseWorkers");
            modelBuilder.Entity<Case>().ToTable("Cases");
            modelBuilder.Entity<Placement>().ToTable("Placements");
            modelBuilder.Entity<Subject>().ToTable("Subjects");
            modelBuilder.Entity<FuturesTraining>().ToTable("FuturesTrainings");
            modelBuilder.Entity<SocialSupport>().ToTable("SocialSupports");
            modelBuilder.Entity<LoginHistory>().ToTable("LoginHistories");
            modelBuilder.Entity<CvReference>().ToTable("CvReferences");
            modelBuilder.Entity<SocialCare>().ToTable("SocialCares");
            modelBuilder.Entity<BusinessSetUpCategory>().ToTable("BusinessSetUpCategories");
            modelBuilder.Entity<BusinessSetUp>().ToTable("BusinessSetUps");
            modelBuilder.Entity<Monitoring>().ToTable("Monitorings");
            modelBuilder.Entity<PlacementProgress>().ToTable("PlacementProgresses");
            modelBuilder.Entity<BusinessInProgress>().ToTable("BusinessInProgresses");
            modelBuilder.Entity<Lession>().ToTable("Lessions");
            modelBuilder.Entity<FutureTrainingProgress>().ToTable("FutureTrainingProgresses");
            modelBuilder.Entity<FurthereducationInProgress>().ToTable("FurthereducationInProgresses");
            modelBuilder.Entity<LogBook>().ToTable("LogBooks");
            modelBuilder.Entity<SocialsupportCase>().ToTable("SocialsupportCases");
            modelBuilder.Entity<SocialSupportProblem>().ToTable("SocialSupportProblems");
            modelBuilder.Entity<furtherEducationReferralSubject>().ToTable("furtherEducationReferralSubjects");

            // Global query filters for soft-deleted entities
            modelBuilder.Entity<Client>().HasQueryFilter(e => e.Status == "Active");
            modelBuilder.Entity<ApplicationUser>().HasQueryFilter(e => !e.IsDeleted);
            modelBuilder.Entity<JobPosition>().HasQueryFilter(e => !e.IsDeleted);
            modelBuilder.Entity<Placement>().HasQueryFilter(e => e.Status == "Active");
            modelBuilder.Entity<Vacancy>().HasQueryFilter(e => e.Status == "Active");
            modelBuilder.Entity<CaseWorker>().HasQueryFilter(e => e.Status == "Active");
            modelBuilder.Entity<Case>().HasQueryFilter(e => e.Status == "Active");
            modelBuilder.Entity<FuturesTraining>().HasQueryFilter(e => e.Status == "Active");
            modelBuilder.Entity<SocialSupportProblem>().HasQueryFilter(e => e.Status == "Active");
            modelBuilder.Entity<Employee>().HasQueryFilter(e => e.Status == "Active");
            modelBuilder.Entity<EducationReferralSource>().HasQueryFilter(e => e.Status == "Active");
            modelBuilder.Entity<SocialsupportCase>().HasQueryFilter(e => e.Status == "Active");
            modelBuilder.Entity<Employer>().HasQueryFilter(e => e.Status == "Active");

            // Match dependent entities to their filtered principals to avoid EF Core 10622 warnings.
            modelBuilder.Entity<BusinessSetUp>().HasQueryFilter(e => e.Client.Status == "Active");
            modelBuilder.Entity<CvReference>().HasQueryFilter(e => e.Client.Status == "Active");
            modelBuilder.Entity<FurtherEducationReferral>().HasQueryFilter(e => e.Clients.Status == "Active");
            modelBuilder.Entity<JobExperience>().HasQueryFilter(e => e.JobPositions != null && !e.JobPositions.IsDeleted);
            modelBuilder.Entity<Monitoring>().HasQueryFilter(e => e.Client.Status == "Active");
            modelBuilder.Entity<SocialSupport>().HasQueryFilter(e => e.Client.Status == "Active" && e.Cases.Status == "Active");
            modelBuilder.Entity<BusinessInProgress>().HasQueryFilter(e => e.Monitoring.Client.Status == "Active");
            modelBuilder.Entity<FurthereducationInProgress>().HasQueryFilter(e => e.Monitoring.Client.Status == "Active");
            modelBuilder.Entity<FutureTrainingProgress>().HasQueryFilter(e => e.Monitoring.Client.Status == "Active");
            modelBuilder.Entity<PlacementProgress>().HasQueryFilter(e => e.Monitoring.Client.Status == "Active");

            base.OnModelCreating(modelBuilder);
        }

        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }
    }
}
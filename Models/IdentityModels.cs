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

        public class ApplicationUserRole
        {
            public string RoleId { get; set; }
        }
    }

    public class ApplicationDbContext : IdentityDbContext<ApplicationUser>
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
        public DbSet <BusinessSetUp>BusinessSetUps { get; set; }
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
            // configure EF Core conventions or mappings here if needed.
            base.OnModelCreating(modelBuilder);
        }

        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }

        // Parameterless constructor for compatibility with legacy code that calls new ApplicationDbContext()
        public ApplicationDbContext()
            : base(new DbContextOptionsBuilder<ApplicationDbContext>()
                .UseSqlServer("Data Source=(localdb)\\MSSQLLocalDB;Initial Catalog=MtpApp;Integrated Security=True")
                .Options)
        {
        }
    }
}
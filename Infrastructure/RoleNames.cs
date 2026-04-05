namespace MtpApp.Infrastructure
{
    /// <summary>
    /// Role names used in the application.
    /// </summary>
    public static class RoleNames
    {
        public const string Admin = "Admin";
        public const string Manager = "Manager";
        public const string CaseWorker = "CaseWorker";
        public const string User = "User";
    }

    /// <summary>
    /// Policy names for authorization.
    /// </summary>
    public static class PolicyNames
    {
        public const string RequireAdmin = "RequireAdmin";
        public const string RequireManager = "RequireManager";
        public const string RequireCaseWorker = "RequireCaseWorker";
        public const string RequireAuthenticated = "RequireAuthenticated";
    }
}

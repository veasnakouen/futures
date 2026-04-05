using System;

namespace MtpApp.Infrastructure
{
    /// <summary>
    /// Custom exception for validation/business rule errors.
    /// </summary>
    public class AppException : Exception
    {
        public AppException(string message) : base(message) { }
        public AppException(string message, Exception inner) : base(message, inner) { }
    }
}

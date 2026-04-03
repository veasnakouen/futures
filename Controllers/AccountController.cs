using System;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MtpApp.Models;

namespace MtpApp.Controllers
{
    [Authorize]
    public class AccountController : Controller
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly SignInManager<ApplicationUser> _signInManager;
        private readonly RoleManager<IdentityRole> _roleManager;
        private readonly ApplicationDbContext _context;

        public AccountController(
            UserManager<ApplicationUser> userManager,
            SignInManager<ApplicationUser> signInManager,
            RoleManager<IdentityRole> roleManager,
            ApplicationDbContext context)
        {
            _userManager = userManager;
            _signInManager = signInManager;
            _roleManager = roleManager;
            _context = context;
        }

        [AllowAnonymous]
        public IActionResult Login(string returnUrl)
        {
            ViewData["ReturnUrl"] = returnUrl;
            return View();
        }

        [HttpPost, AllowAnonymous, ValidateAntiForgeryToken]
        public async Task<IActionResult> Login(LoginViewModel model, string returnUrl)
        {
            if (!ModelState.IsValid) return View(model);

            var result = await _signInManager.PasswordSignInAsync(model.Email, model.Password, model.RememberMe, lockoutOnFailure: false);
            if (result.Succeeded)
            {
                var user = await _userManager.FindByEmailAsync(model.Email);
                _context.LoginHistorys.Add(new LoginHistory
                {
                    LoggedBy = $"{user?.FirstName} {user?.LastName}",
                    LoggedDate = DateTime.UtcNow,
                    IPAddress = HttpContext.Connection.RemoteIpAddress?.ToString(),
                    HostName = Request.Headers["User-Agent"].ToString()
                });
                await _context.SaveChangesAsync();
                return RedirectToLocal(returnUrl);
            }

            TempData["msg"] = "Login failed.";
            ModelState.AddModelError(string.Empty, "Invalid email or password.");
            return View(model);
        }

        [Authorize]
        public IActionResult Register() => View();

        [HttpPost, Authorize, ValidateAntiForgeryToken]
        public async Task<IActionResult> Register(RegisterViewModel model)
        {
            if (!ModelState.IsValid) return View(model);

            if (!string.IsNullOrEmpty(model.Id))
            {
                var existing = await _userManager.FindByIdAsync(model.Id);
                if (existing == null) return NotFound();
                existing.UserName = model.Email;
                existing.Email = model.Email;
                existing.FirstName = model.FirstName;
                existing.LastName = model.LastName;
                existing.Branch = model.Branch;
                existing.PhoneNumber = model.PhoneNumber;
                await _userManager.UpdateAsync(existing);
                return RedirectToAction("Index", "Users");
            }

            var user = new ApplicationUser
            {
                UserName = model.Email,
                Email = model.Email,
                FirstName = model.FirstName,
                LastName = model.LastName,
                Branch = model.Branch,
                PhoneNumber = model.PhoneNumber
            };

            var createResult = await _userManager.CreateAsync(user, model.Password);
            if (createResult.Succeeded)
            {
                if (_roleManager != null && !await _roleManager.RoleExistsAsync("Manage Employee"))
                    await _roleManager.CreateAsync(new IdentityRole("Manage Employee"));
                return RedirectToAction("Index", "Users");
            }
            AddErrors(createResult);
            return View(model);
        }

        [HttpGet, Authorize]
        public async Task<IActionResult> EditUser(string id)
        {
            var user = await _context.Users.SingleOrDefaultAsync(u => u.Id == id);
            if (user == null) return NotFound();
            var vm = new RegisterViewModel
            {
                Id = user.Id,
                FirstName = user.FirstName,
                LastName = user.LastName,
                Branch = user.Branch,
                Email = user.Email,
                PhoneNumber = user.PhoneNumber
            };
            return View("EditUser", vm);
        }

        [Authorize]
        public async Task<IActionResult> DeleteUser(string id)
        {
            var user = await _userManager.FindByIdAsync(id);
            if (user == null) return NotFound();
            user.IsDeleted = true;
            await _userManager.UpdateAsync(user);
            return RedirectToAction("Index", "Users");
        }

        [AllowAnonymous]
        public async Task<IActionResult> ConfirmEmail(string userId, string code)
        {
            if (userId == null || code == null) return View("Error");
            var user = await _userManager.FindByIdAsync(userId);
            if (user == null) return View("Error");
            var result = await _userManager.ConfirmEmailAsync(user, code);
            if (result.Succeeded) return View("ConfirmEmail");
            AddErrors(result);
            return View();
        }

        [HttpPost, ValidateAntiForgeryToken]
        public async Task<IActionResult> LogOff()
        {
            await _signInManager.SignOutAsync();
            return RedirectToAction("Index", "Home");
        }

        public async Task<IActionResult> RemoveAccountList()
        {
            var userId = User?.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            var currentUser = await _userManager.FindByIdAsync(userId);
            var logins = currentUser != null
                ? await _userManager.GetLoginsAsync(currentUser)
                : new System.Collections.Generic.List<Microsoft.AspNetCore.Identity.UserLoginInfo>();
            ViewData["ShowRemoveButton"] = HasPassword() || logins.Count > 1;
            return PartialView("_RemoveAccountPartial", logins);
        }

        private bool HasPassword()
        {
            var userId = User?.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            var user = _userManager.FindByIdAsync(userId).GetAwaiter().GetResult();
            return user?.PasswordHash != null;
        }

        private IActionResult RedirectToLocal(string returnUrl)
        {
            if (Url.IsLocalUrl(returnUrl)) return Redirect(returnUrl);
            return RedirectToAction("Index", "Home");
        }

        private void AddErrors(IdentityResult result)
        {
            foreach (var err in result.Errors)
                ModelState.AddModelError(string.Empty, err.Description ?? err.Code);
        }
    }
}
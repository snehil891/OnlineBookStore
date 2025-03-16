using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using OnlineBookStoreAppBackEnd.Data;
using OnlineBookStoreAppBackEnd.Models;
using System.Threading.Tasks;
using BCrypt.Net;

namespace OnlineBookStoreAppBackEnd.Controllers
{
    [Route("api/auth")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public AuthController(ApplicationDbContext context)
        {
            _context = context;
        }

        // Forgot Password - Get Security Question
        [HttpPost("forgot-password")]
        public async Task<IActionResult> ForgotPassword([FromBody] ForgotPasswordRequest request)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.EmailId == request.EmailId);
            if (user == null)
                return NotFound(new { message = "User not found" });

            return Ok(new { securityQuestion = user.SecurityQuestion }); // ✅ Return security question
        }

        // Verify Security Answer & Reset Password
        [HttpPost("reset-password")]
        public async Task<IActionResult> ResetPassword([FromBody] ResetPasswordRequest request)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.EmailId == request.EmailId);
            if (user == null || !BCrypt.Net.BCrypt.Verify(request.SecurityAnswer, user.SecurityAnswer))
                return BadRequest(new { message = "Incorrect security answer" });

            // Update password
            user.UserPassword = BCrypt.Net.BCrypt.HashPassword(request.NewPassword);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Password reset successful" });
        }
    }

    //For Forgot Password
    public class ForgotPasswordRequest
    {
        public string? EmailId { get; set; }
    }

    //For Reset Password
    public class ResetPasswordRequest
    {
        public string? EmailId { get; set; }
        public string? SecurityAnswer { get; set; }
        public string? NewPassword { get; set; }
    }
}

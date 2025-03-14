using System.ComponentModel.DataAnnotations;

namespace OnlineBookStoreAppBackEnd.Models
{
    public class User
    {
        public int UserId { get; set; }
        [Required]
        public string? FullName { get; set; }
        [Required, EmailAddress]
        public string? EmailId { get; set; }
        [Required,RegularExpression(@"^\d{10}$", ErrorMessage ="Phone number must be of 10 digits.")]
        public string? PhoneNumber { get; set; }
        [Required]
        public string? UserPassword { get; set; }
        [Required, RegularExpression("^(Customer|Admin)$")]
        public string? Role { get; set; } = "Customer";
    }
}

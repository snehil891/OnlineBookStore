using System.ComponentModel.DataAnnotations;

namespace OnlineBookStoreAppBackEnd.Models
{
    public class OrderDto
    {
        [Required]
        public int UserId { get; set; }

        [Required]
        [StringLength(255, MinimumLength = 5, ErrorMessage = "Shipping Address must be between 5 and 255 characters.")]
        public string? ShippingAddress { get; set; }

        [Required]
        public List<OrderItemRequest> OrderItems { get; set; } = new();
    }
}

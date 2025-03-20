using System.ComponentModel.DataAnnotations;

namespace OnlineBookStoreAppBackEnd.Models
{
    public class OrderRequest
    {
        [Required]
        public int UserId { get; set; }
        [Required]
        public List<OrderItem> OrderItems { get; set; }
    }

    public class OrderItemRequest
    {
        [Required]
        public int BookId { get; set; }
        [Required]
        public int Quantity { get; set; }
        [Required]
        public decimal Price { get; set; }
    }
}

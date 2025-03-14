using System.ComponentModel.DataAnnotations.Schema;

namespace OnlineBookStoreAppBackEnd.Models
{
    public class Order
    {
        public int OrderId { get; set; }
        [ForeignKey("UserId")]
        public int UserId { get; set; }
        [ForeignKey("BookId")]
        public int BookId { get; set; }
        public int Quantity { get; set; }
        public decimal TotalAmount { get; set; }
        public DateTime OrderDate { get; set; } = DateTime.UtcNow;
        public string Status { get; set; } = "Pending";
        public List<OrderItem> OrderItems{ get; set; } = new List<OrderItem>();
    }
}

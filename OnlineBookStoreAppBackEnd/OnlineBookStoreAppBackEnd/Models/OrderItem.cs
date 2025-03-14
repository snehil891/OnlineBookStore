using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace OnlineBookStoreAppBackEnd.Models
{
    public class OrderItem
    {
        [Key]
        public int ItemsId { get; set; }
        [ForeignKey("OrderId")]
        public int OrderId { get; set; }
        [ForeignKey("BookId")]
        public int BookId { get; set; }
        public int Quantity { get; set; }
        public decimal Price { get; set; }
        public Book Book { get; set; }
        public Order Order { get; set; }
    }
}

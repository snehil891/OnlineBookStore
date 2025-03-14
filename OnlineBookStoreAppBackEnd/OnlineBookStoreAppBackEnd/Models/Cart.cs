using System.ComponentModel.DataAnnotations.Schema;

namespace OnlineBookStoreAppBackEnd.Models
{
    public class Cart
    {
        public int Id { get; set; }
        [ForeignKey("UserId")]
        public int UserId { get; set; }
        [ForeignKey("BookId")]
        public int BookId { get; set; }
        public int Quantity { get; set; }
        public DateTime CreateAt { get; set; } = DateTime.UtcNow;
        public Book? Book { get; set; }
        public User? User { get; set; }
    }
}

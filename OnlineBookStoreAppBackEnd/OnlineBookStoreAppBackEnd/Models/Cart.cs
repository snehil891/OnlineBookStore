using System.ComponentModel.DataAnnotations.Schema;

namespace OnlineBookStoreAppBackEnd.Models
{
    public class Cart
    {
        public int CartId { get; set; }

        [ForeignKey("User")]
        public int UserId { get; set; }

        public User? User { get; set; }
        public ICollection<CartItems> CartItems { get; set; } = new List<CartItems>();
    }
}

using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace OnlineBookStoreAppBackEnd.Models
{
    public class Book
    {
        public int BookId { get; set; }
        public string? Title { get; set; }
        public string? Author { get; set; }
        public string? Description { get; set; }
        public decimal Price { get; set; }
        public string? CoverImageUrl { get; set; }

        [ForeignKey("CategoryId")]
        public int CategoryId { get; set; }
        public BookCategory? BookCategory { get; set; }
    }
}

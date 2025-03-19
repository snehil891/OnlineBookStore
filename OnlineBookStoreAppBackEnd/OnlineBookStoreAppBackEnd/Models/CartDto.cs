namespace OnlineBookStoreAppBackEnd.Models
{
    public class CartDto
    {
        public int CartId { get; set; }
        public List<CartItemDto> CartItems { get; set; }
    }
    public class CartItemDto
    {
        public int CartItemId { get; set; }
        public int BookId { get; set; }
        public string BookTitle { get; set; }
        public int Quantity { get; set; }
    }
}

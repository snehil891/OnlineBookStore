using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using OnlineBookStoreAppBackEnd.Data;
using OnlineBookStoreAppBackEnd.Models;

namespace OnlineBookStoreAppBackEnd.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class CartItemsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public CartItemsController(ApplicationDbContext context)
        {
            _context = context;
        }

        // ✅ Fetch cart items for the logged-in user
        [HttpGet("user")]
        public async Task<ActionResult<IEnumerable<CartItems>>> GetUserCartItems()
        {
            var userIdClaim = User.FindFirst("id") ?? User.FindFirst(ClaimTypes.NameIdentifier);
            if (userIdClaim == null || !int.TryParse(userIdClaim.Value, out int userId))
            {
                return Unauthorized("User ID not found in token.");
            }

            var cartItems = await _context.CartItems
                .Include(ci => ci.Book)
                .Where(ci => ci.Cart.UserId == userId)
                .ToListAsync();

            return Ok(new { cartItems });
        }

        // ✅ Add item to cart
        [HttpPost]
        public async Task<IActionResult> AddToCart([FromBody] CartItems cartItemRequest)
        {
            if (cartItemRequest == null || cartItemRequest.BookId <= 0 || cartItemRequest.Quantity <= 0)
            {
                return BadRequest("Invalid cart item request.");
            }

            var userIdClaim = User.FindFirst("id") ?? User.FindFirst(ClaimTypes.NameIdentifier);
            if (userIdClaim == null || !int.TryParse(userIdClaim.Value, out int userId))
            {
                return Unauthorized("User ID not found in token.");
            }

            // ✅ Find or create the user's cart
            var cart = await _context.Cart
                .Include(c => c.CartItems)
                .FirstOrDefaultAsync(c => c.UserId == userId);

            if (cart == null)
            {
                cart = new Cart { UserId = userId, CartItems = new List<CartItems>() };
                _context.Cart.Add(cart);
                await _context.SaveChangesAsync();
            }

            // ✅ Check if book already exists in cart
            var existingCartItem = cart.CartItems.FirstOrDefault(ci => ci.BookId == cartItemRequest.BookId);
            if (existingCartItem != null)
            {
                existingCartItem.Quantity += cartItemRequest.Quantity;
            }
            else
            {
                var newCartItem = new CartItems
                {
                    CartId = cart.CartId,
                    BookId = cartItemRequest.BookId,
                    Quantity = cartItemRequest.Quantity
                };
                _context.CartItems.Add(newCartItem);
            }

            await _context.SaveChangesAsync();
            return Ok(new { message = "Item added to cart successfully." });
        }

        // ✅ Increase quantity of an item in cart
        [HttpPut("increase/{cartItemId}")]
        public async Task<IActionResult> IncreaseQuantity(int cartItemId)
        {
            var cartItem = await _context.CartItems.FindAsync(cartItemId);
            if (cartItem == null)
            {
                return NotFound("Cart item not found.");
            }

            cartItem.Quantity++;
            await _context.SaveChangesAsync();

            return Ok(cartItem);
        }

        // ✅ Decrease quantity of an item in cart
        [HttpPut("decrease/{cartItemId}")]
        public async Task<IActionResult> DecreaseQuantity(int cartItemId)
        {
            var cartItem = await _context.CartItems.FindAsync(cartItemId);
            if (cartItem == null)
            {
                return NotFound("Cart item not found.");
            }

            if (cartItem.Quantity > 1)
            {
                cartItem.Quantity--;
            }
            else
            {
                _context.CartItems.Remove(cartItem);
            }

            await _context.SaveChangesAsync();
            return Ok(cartItem);
        }

        // ✅ Remove an item from cart
        [HttpDelete("{cartItemId}")]
        public async Task<IActionResult> RemoveFromCart(int cartItemId)
        {
            var cartItem = await _context.CartItems.FindAsync(cartItemId);
            if (cartItem == null) return NotFound("Item not found in cart.");

            _context.CartItems.Remove(cartItem);
            await _context.SaveChangesAsync();
            return Ok(new { message = "Item removed from cart successfully." });
        }
    }
}

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
    public class CartsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public CartsController(ApplicationDbContext context)
        {
            _context = context;
        }

        // Get cart for logged-in user
        [HttpGet("user")]
        public async Task<ActionResult<Cart>> GetUserCart()
        {
            try
            {
                // Log all claims for debugging
                var claims = User.Claims.Select(c => new { c.Type, c.Value }).ToList();
                Console.WriteLine($"Token Claims: {System.Text.Json.JsonSerializer.Serialize(claims)}");

                // Try extracting the user ID
                var userIdClaim = User.FindFirst("id") ?? User.FindFirst(ClaimTypes.NameIdentifier);
                if (userIdClaim == null || !int.TryParse(userIdClaim.Value, out int userId))
                {
                    return Unauthorized("User ID not found in token.");
                }

                var cart = await _context.Cart
                    .Include(c => c.CartItems)
                    .ThenInclude(ci => ci.Book)
                    .FirstOrDefaultAsync(c => c.UserId == userId);

                return Ok(new
                {
                    CartId = cart.CartId,
                    UserId = cart.UserId,
                    CartItems = cart.CartItems.Select(ci => new
                    {
                        CartItemId = ci.CartItemId,
                        BookId = ci.BookId,
                        Quantity = ci.Quantity,
                        Book = new
                        {
                            ci.Book.BookId,
                            ci.Book.Title,
                            ci.Book.Author,
                            ci.Book.Price,
                            ci.Book.CoverImageUrl
                        }
                    })
                });

            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal Server Error: {ex.Message}");
            }
        }
    }
}

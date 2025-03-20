using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using OnlineBookStoreAppBackEnd.Data;
using OnlineBookStoreAppBackEnd.Models;

namespace OnlineBookStoreAppBackEnd.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class OrdersController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public OrdersController(ApplicationDbContext context)
        {
            _context = context;
        }

        // Get all orders (Admin Only)
        [Authorize(Roles = "Admin")]
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Order>>> GetAllOrders()
        {
            var orders =  await _context.Orders
                .Include(o => o.OrderItems)
                .ThenInclude(oi => oi.Book)
                .ToListAsync();
            return Ok(orders);
        }

        // Get user-specific orders (Customer Only)
        [Authorize(Roles = "Customer")]
        [HttpGet("user/{userId}")]
        public async Task<ActionResult<IEnumerable<Order>>> GetUserOrder(int userId)
        {
            return await _context.Orders
                .Include(o => o.OrderItems)
                .ThenInclude(oi => oi.Book)
                .Where(o => o.UserId == userId)
                .ToListAsync();
        }

        // Admin can update order status
        [Authorize(Roles = "Admin")]
        [HttpPut("update-status/{orderId}")]
        public async Task<IActionResult> UpdateOrderStatus(int orderId, [FromBody] OrderUpdateRequest orderRequest)
        {
            var order = await _context.Orders.FindAsync(orderId);
            if (order == null)
            {
                return NotFound("Order not found.");
            }

            order.Status = orderRequest.status;
            order.ExpectedDeliveryDate = orderRequest.ExpectedDeliveryDate;
            await _context.SaveChangesAsync();
            return Ok();
        }

        // Place an Order
        [HttpPost]
        public async Task<IActionResult> PlaceOrder([FromBody] OrderDto orderRequest)
        {
            if (orderRequest == null || orderRequest.OrderItems == null || !orderRequest.OrderItems.Any())
                return BadRequest("Invalid order request.");

            // Check if user exists
            var user = await _context.Users.FindAsync(orderRequest.UserId);
            if (user == null)
                return NotFound("User not found.");

            // Create new Order with shipping address
            var order = new Order
            {
                UserId = orderRequest.UserId,
                ShippingAddress = orderRequest.ShippingAddress, // ✅ Store Address
                OrderDate = DateTime.UtcNow,
                Status = "Pending",
                OrderItems = new List<OrderItem>(),
                TotalAmount = orderRequest.OrderItems.Sum(i=> i.Price * i.Quantity)
            };

            // Add order items
            foreach (var item in orderRequest.OrderItems)
            {
                var book = await _context.Books.FindAsync(item.BookId);
                if (book == null)
                    return BadRequest($"Book with ID {item.BookId} not found.");

                order.OrderItems.Add(new OrderItem
                {
                    BookId = item.BookId,
                    Quantity = item.Quantity,
                    Price = item.Price
                });
            }

            _context.Orders.Add(order);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Order placed successfully", orderId = order.OrderId });
        }

        // Delete Order (Admin Only)
        [Authorize(Roles = "Admin")]
        [HttpDelete("delete/{orderId}")]
        public async Task<IActionResult> DeleteOrder(int orderId)
        {
            var order = await _context.Orders.Include(o=>o.OrderItems).FirstOrDefaultAsync(o=>o.OrderId == orderId);
            if (order == null)
            {
                return NotFound("Order not found");
            }

            _context.OrderItems.RemoveRange(order.OrderItems);
            _context.Orders.Remove(order);
            await _context.SaveChangesAsync();

            return Ok(new {message = "Order deleted successfully"});
        }
    }
    public class OrderUpdateRequest
    {
        public string? status { get; set; }
        public DateTime? ExpectedDeliveryDate { get; set; }
    }
}

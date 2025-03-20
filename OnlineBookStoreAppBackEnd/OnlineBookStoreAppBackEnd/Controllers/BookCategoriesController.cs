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
    public class BookCategoriesController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public BookCategoriesController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/BookCategories
        [HttpGet]
        public async Task<ActionResult<IEnumerable<BookCategory>>> GetBookCategories()
        {
          if (_context.BookCategories == null)
          {
              return NotFound();
          }
            return await _context.BookCategories.ToListAsync();
        }

        // GET: api/BookCategories/5
        [HttpGet("{id}")]
        public async Task<ActionResult<BookCategory>> GetBookCategory(int id)
        {
          if (_context.BookCategories == null)
          {
              return NotFound();
          }
            var bookCategory = await _context.BookCategories.FindAsync(id);

            if (bookCategory == null)
            {
                return NotFound("Category not found");
            }

            return Ok(bookCategory);
        }

        // PUT: api/BookCategories/{id} (update a category) --Admin only
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [Authorize(Roles = "Admin")]
        [HttpPut("{id}")]
        public async Task<IActionResult> PutBookCategory(int id, BookCategory bookCategory)
        {
            if (id != bookCategory.BookCategoryId)
            {
                return BadRequest("Category ID mismatch");
            }

            _context.Entry(bookCategory).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!_context.BookCategories.Any(c => c.BookCategoryId == id))
                {
                    return NotFound("Category not found");
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // POST: api/BookCategories (add a new category) --Admin only
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [Authorize(Roles = "Admin")]
        [HttpPost]
        public async Task<ActionResult<BookCategory>> PostBookCategory(BookCategory bookCategory)
        {
            if(await _context.BookCategories.AnyAsync(c => c.CategoryName == bookCategory.CategoryName))
            {
                return BadRequest("Category already exists");
            }
            _context.BookCategories.Add(bookCategory);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetBookCategory), new { id = bookCategory.BookCategoryId }, bookCategory);
        }

        // DELETE: api/BookCategories/{id} (delete a category) --Admin only
        [Authorize(Roles = "Admin")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteBookCategory(int id)
        {
            var bookCategory = await _context.BookCategories.FindAsync(id);
            if (bookCategory == null)
            {
                return NotFound("Category not found");
            }
            _context.BookCategories.Remove(bookCategory);
            await _context.SaveChangesAsync();
            return NoContent();
        }

        private bool BookCategoryExists(int id)
        {
            return (_context.BookCategories?.Any(e => e.BookCategoryId == id)).GetValueOrDefault();
        }
    }
}

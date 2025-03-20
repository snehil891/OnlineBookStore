using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using OnlineBookStoreAppBackEnd.Data;
using OnlineBookStoreAppBackEnd.Models;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

[Route("api/[controller]")]
[ApiController]
public class BooksController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public BooksController(ApplicationDbContext context)
    {
        _context = context;
    }

    // ✅ GET: api/books (Retrieve all books)
    [HttpGet]
    public async Task<IActionResult> GetBooks()
    {
        var books = await _context.Books.Include(b => b.BookCategory).ToListAsync();
        return Ok(books);
    }

    // ✅ GET: api/books/{id} (Retrieve a single book)
    [HttpGet("{id}")]
    public async Task<ActionResult<Book>> GetBook(int id)
    {
        var book = await _context.Books.Include(b => b.BookCategory).FirstOrDefaultAsync(b => b.BookId == id);
        if (book == null)
            return NotFound();

        return Ok(book);
    }

    // ✅ GET: api/books/search?query=title (Search books by title, author, or category)
    [HttpGet("search")]
    public async Task<ActionResult<IEnumerable<Book>>> SearchBooks([FromQuery] string query)
    {
        var books = await _context.Books
            .Include(b => b.BookCategory)
            .Where(b => b.Title.Contains(query) || b.Author.Contains(query) || b.BookCategory.CategoryName.Contains(query))
            .ToListAsync();

        if (!books.Any())
            return NotFound("No books found.");

        return Ok(books);
    }

    // ✅ POST: api/books (Add a new book) - Admin Only
    [Authorize(Roles = "Admin")]
    [HttpPost]
    public async Task<ActionResult<Book>> PostBook(Book book)
    {
        _context.Books.Add(book);
        await _context.SaveChangesAsync();
        return CreatedAtAction(nameof(GetBook), new { id = book.BookId }, book);
    }

    // ✅ DELETE: api/books/{id} (Delete a book) - Admin Only
    [Authorize(Roles = "Admin")]
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteBook(int id)
    {
        var book = await _context.Books.FindAsync(id);
        if (book == null)
            return NotFound();

        _context.Books.Remove(book);
        await _context.SaveChangesAsync();
        return NoContent();
    }
}

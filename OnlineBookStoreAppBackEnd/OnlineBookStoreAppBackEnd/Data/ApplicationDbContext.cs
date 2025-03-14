using Microsoft.EntityFrameworkCore;
using OnlineBookStoreAppBackEnd.Models;

namespace OnlineBookStoreAppBackEnd.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options) { }

        public DbSet<User> Users { get; set; }
        public DbSet<Book> Books { get; set; }
        public DbSet<BookCategory> BookCategories { get; set; }
        public DbSet<Cart> Cart { get; set; }
        public DbSet<Order> Orders { get; set; }
        public DbSet<OrderItem> OrderItems { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // Book-Category Relationship
            modelBuilder.Entity<Book>()
                .HasOne(b => b.BookCategory)
                .WithMany()
                .HasForeignKey(b => b.CategoryId);

            // Cart Relationships
            modelBuilder.Entity<Cart>()
                .HasOne(c => c.User)
                .WithMany()
                .HasForeignKey(c => c.UserId)
                .OnDelete(DeleteBehavior.Cascade); // Delete cart when user is deleted

            modelBuilder.Entity<Cart>()
                .HasOne(c => c.Book)
                .WithMany()
                .HasForeignKey(c => c.BookId)
                .OnDelete(DeleteBehavior.Cascade); // Delete cart items when book is deleted

            // Order-OrderItem Relationships
            modelBuilder.Entity<OrderItem>()
                .HasKey(oi => oi.ItemsId); // Primary Key

            modelBuilder.Entity<OrderItem>()
                .HasOne(oi => oi.Order)
                .WithMany(o=> o.OrderItems)
                .HasForeignKey(oi => oi.OrderId)
                .OnDelete(DeleteBehavior.Cascade); // Delete order items if order is deleted

            modelBuilder.Entity<OrderItem>()
                .HasOne(oi => oi.Book)
                .WithMany()
                .HasForeignKey(oi => oi.BookId)
                .OnDelete(DeleteBehavior.Cascade); // Delete order items if book is deleted

            // Fix decimal precision for Price and TotalAmount
            modelBuilder.Entity<Book>()
                .Property(b => b.Price)
                .HasColumnType("decimal(18,2)");

            modelBuilder.Entity<Order>()
                .Property(o => o.TotalAmount)
                .HasColumnType("decimal(18,2)");

            modelBuilder.Entity<OrderItem>()
                .Property(oi => oi.Price)
                .HasColumnType("decimal(18,2)");
        }
    }
}

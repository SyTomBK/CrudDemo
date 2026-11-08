using CrudDemo.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace CrudDemo.Api.Data;

public class AppDbContext(DbContextOptions<AppDbContext> options) : DbContext(options)
{
    public DbSet<Product> Products => Set<Product>();
}
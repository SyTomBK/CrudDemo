using System.ComponentModel.DataAnnotations;

namespace CrudDemo.Api.Models;

public class Product
{
    public int Id { get; set; }
    [MaxLength(200)]
    public string Name { get; set; } = string.Empty;
    public decimal Price { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}

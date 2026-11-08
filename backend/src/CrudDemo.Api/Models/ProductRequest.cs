using System.ComponentModel.DataAnnotations;

namespace CrudDemo.Api.Models;
public record ProductRequest(
    [Required, MaxLength(200)] string Name,
    [Range(0, 1_000_000_000)] decimal Price);
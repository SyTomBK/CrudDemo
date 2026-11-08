using CrudDemo.Api.Data;
using CrudDemo.Api.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace CrudDemo.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ProductsController(AppDbContext db) : ControllerBase
{
    // lấy danh sách sản phẩm
    [HttpGet]
    public async Task<IEnumerable<Product>> GetAll() =>
        await db.Products.OrderByDescending(p => p.Id).ToListAsync();

    [HttpGet("{id:int}")]
    public async Task<ActionResult<Product>> GetById(int id) =>
        await db.Products.FindAsync(id) is { } p ? p : NotFound();

    [HttpPost]
    public async Task<ActionResult<Product>> Create(ProductRequest req)
    {
        var product = new Product { Name = req.Name, Price = req.Price };
        db.Products.Add(product);
        await db.SaveChangesAsync();
        return CreatedAtAction(nameof(GetById), new { id = product.Id }, product);
    }

    [HttpPut("{id:int}")]
    public async Task<IActionResult> Update(int id, ProductRequest req)
    {
        var product = await db.Products.FindAsync(id);
        if (product is null) return NotFound();
        product.Name = req.Name;
        product.Price = req.Price;
        await db.SaveChangesAsync();
        return NoContent();
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id)
    {
        var product = await db.Products.FindAsync(id);
        if (product is null) return NotFound();
        db.Products.Remove(product);
        await db.SaveChangesAsync();
        return NoContent();
    }
}
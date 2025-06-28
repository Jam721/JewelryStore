using System.ComponentModel.DataAnnotations;
using JewelryStore.Domain.Models;

namespace JewelryStore.Infrastructure.Entities;

public class JewelryEntity
{
    [Key]
    public Guid JewelryId { get; set; }
    public string Name { get; set; } = string.Empty;
    public Category Category { get; set; }
    public decimal Prise { get; set; }
    public double Weight { get; set; }
    public int Quantity { get; set; }
    public bool InStock { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    public string MainImageUrl { get; set; } = string.Empty;
    public int Watches { get; set; } = 0;
    public bool IsPremium { get; set; } = false;
}
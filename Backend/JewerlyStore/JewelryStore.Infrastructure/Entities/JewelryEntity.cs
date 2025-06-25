using System.ComponentModel.DataAnnotations;

namespace JewelryStore.Infrastructure.Entities;

public class JewelryEntity
{
    [Key]
    public Guid JewelryId { get; set; }
    public string Name { get; set; } = string.Empty;
    public decimal Prise { get; set; }
    public double Weight { get; set; }
    public bool InStock { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    public string MainImageUrl { get; set; } = string.Empty;
}
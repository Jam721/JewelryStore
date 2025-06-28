using JewelryStore.Domain.Models;

namespace JewelryStore.Dtos.Request;

public class JewelryAddRequest
{
    public string Name { get; set; } = string.Empty;
    public Category Category { get; set; }
    public decimal Prise { get; set; }
    public int Quantity { get; set; }
    public double Weight { get; set; }
    public bool IsPremium { get; set; }
}
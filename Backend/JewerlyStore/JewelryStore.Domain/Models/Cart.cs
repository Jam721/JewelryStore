namespace JewelryStore.Domain.Models;

public class Cart
{
    public Guid Id { get; set; }
    public List<Jewelry> Jewelries { get; set; } = [];
}
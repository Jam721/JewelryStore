namespace JewelryStore.Dtos.Request;

public class JewelryAddRequest
{
    public string Name { get; set; } = string.Empty;
    public decimal Prise { get; set; }
    public double Weight { get; set; }
    public bool InStock { get; set; }
}
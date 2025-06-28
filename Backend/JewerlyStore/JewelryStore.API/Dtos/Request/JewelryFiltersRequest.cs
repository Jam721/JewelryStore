using JewelryStore.Domain.Models;

namespace JewelryStore.Dtos.Request;

public class JewelryFiltersRequest
{
    public int PageNumber { get; set; } = 1;
    public int PageSize { get; set; } = 10;
    public decimal? MinPrice { get; set; } = null;
    public decimal? MaxPrice { get; set; } = null;
    public DateTime? StartDate { get; set; } = null;
    public DateTime? EndDate { get; set; } = null;
    public int? MinWatches { get; set; } = null;
    public int? MaxWatches { get; set; } = null;
    public Category? Category { get; set; } = null;
    public string Sort { get; set; } = "watches-desc";
}
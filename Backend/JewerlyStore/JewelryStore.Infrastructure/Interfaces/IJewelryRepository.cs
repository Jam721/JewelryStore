using JewelryStore.Domain.Models;
using JewelryStore.Infrastructure.Entities;

namespace JewelryStore.Infrastructure.Interfaces;

public interface IJewelryRepository : IBaseRepository<Jewelry, JewelryEntity>
{
    public Task<JewelryEntity> UpdateJewelry(Guid id, string name, decimal price, CancellationToken cancellationToken);

    Task<List<JewelryEntity>?> GetPaginatedListAsync(
        int pageNumber,
        int pageSize,
        decimal? minPrice = null,
        decimal? maxPrice = null,
        DateTime? startDate = null,
        DateTime? endDate = null,
        int? minWatches = null,
        int? maxWatches = null,
        Category? category = null,
        string sortBy = "watches-desc",
        CancellationToken cancellationToken = default);
}
using JewelryStore.Domain.Models;
using JewelryStore.Infrastructure.Entities;

namespace JewelryStore.Infrastructure.Interfaces;

public interface IJewelryRepository : IBaseRepository<Jewelry, JewelryEntity>
{
    public Task<JewelryEntity> UpdateJewelry(Guid id, string name, decimal price, CancellationToken cancellationToken);
    
    
}
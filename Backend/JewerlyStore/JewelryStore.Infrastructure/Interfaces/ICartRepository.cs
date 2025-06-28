using JewelryStore.Domain.Models;
using JewelryStore.Infrastructure.Entities;

namespace JewelryStore.Infrastructure.Interfaces;

public interface ICartRepository
{
    Task<CartEntity> GetAllByUserIdAsync(Guid userId, CancellationToken cancellationToken);
    Task<JewelryEntity> AddAsync(Guid jewelryId, Guid userId, CancellationToken cancellationToken);
    Task<JewelryEntity> DeleteAsync(Guid jewelryId, Guid userId, CancellationToken cancellationToken);
}
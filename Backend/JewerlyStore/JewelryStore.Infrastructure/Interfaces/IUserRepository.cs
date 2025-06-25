using JewelryStore.Domain.Models;
using JewelryStore.Infrastructure.Entities;

namespace JewelryStore.Infrastructure.Interfaces;

public interface IUserRepository : IBaseRepository<User, UserEntity>
{
    public Task<UserEntity> GetByEmailAsync(string email, CancellationToken cancellationToken);
    
    public Task<UserEntity> UpdateAsync(
        Guid id, string firstName, 
        string lastName, string email, 
        CancellationToken cancellationToken);
}
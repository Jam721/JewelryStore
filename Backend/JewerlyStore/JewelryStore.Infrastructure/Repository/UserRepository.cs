using AutoMapper;
using JewelryStore.Domain.Models;
using JewelryStore.Infrastructure.Entities;
using JewelryStore.Infrastructure.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace JewelryStore.Infrastructure.Repository;

public class UserRepository(AppDbContext context, IMapper mapper) : IUserRepository
{
    public async Task<List<UserEntity>?> GetPaginatedListAsync(int pageNumber, int pageSize, CancellationToken cancellationToken)
    {
        var users = await context.Users
            .AsNoTracking()
            .Skip((pageNumber - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync(cancellationToken);
        
        return users;
    }

    public async Task<UserEntity?> GetByIdAsync(Guid id, CancellationToken cancellationToken)
    {
        var user = await context.Users
            .AsNoTracking()
            .FirstOrDefaultAsync(u=>u.UserId==id,cancellationToken);
        
        if(user == null) throw new KeyNotFoundException();
        
        return user;
    }
    
    public async Task<UserEntity> GetByEmailAsync(string email, CancellationToken cancellationToken)
    {
        var user = await context.Users
            .AsNoTracking()
            .FirstOrDefaultAsync(u => u.Email == email, cancellationToken);
        
        if(user == null) throw new KeyNotFoundException();
        
        return user;
    }

    public async Task<UserEntity?> AddAsync(User model, CancellationToken cancellationToken)
    {
        var userEntity = mapper.Map<UserEntity>(model);
            
        await context.Users.AddAsync(userEntity, cancellationToken);
        await context.SaveChangesAsync(cancellationToken);
        
        return userEntity;
    }
    
    public async Task<UserEntity> UpdateAsync(Guid id, string firstName, 
        string lastName, string email, 
        CancellationToken cancellationToken)
    {
        var userEntity = await context.Users
            .FirstOrDefaultAsync(u=>u.UserId==id, cancellationToken);
        
        if(userEntity == null) throw new KeyNotFoundException();
        
        userEntity.FirstName = firstName;
        userEntity.LastName = lastName;
        userEntity.Email = email;
        
        await context.SaveChangesAsync(cancellationToken);
        
        return userEntity;
    }

    public async Task<UserEntity?> DeleteAsync(Guid id, CancellationToken cancellationToken)
    {
        var userEntity = await context.Users
            .FirstOrDefaultAsync(u => u.UserId==id, cancellationToken);
        
        if(userEntity == null) throw new KeyNotFoundException();
        
        context.Users.Remove(userEntity);
        await context.SaveChangesAsync(cancellationToken);
        
        return userEntity;
    }
}
using JewelryStore.Infrastructure.Entities;
using JewelryStore.Infrastructure.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace JewelryStore.Infrastructure.Repository;

public class CartRepository(AppDbContext context) : ICartRepository
{
    public async Task<CartEntity> GetAllByUserIdAsync(Guid userId, CancellationToken cancellationToken)
    {
        var user = await context.Users
            .Include(u => u.Cart)
            .ThenInclude(cart => cart.Jewelries)
            .FirstOrDefaultAsync(u => u.UserId == userId, cancellationToken);
    
        if (user == null) 
            throw new KeyNotFoundException($"User {userId} not found");
    
        if (user.Cart == null)
            throw new KeyNotFoundException($"Cart for user {userId} not found");
    
        return user.Cart;
    }

    public async Task<JewelryEntity> AddAsync(Guid jewelryId, Guid userId, CancellationToken cancellationToken)
    {
        var jewelry = await context.Jewelries
                          .FindAsync([jewelryId], cancellationToken)
                      ?? throw new KeyNotFoundException($"Jewelry {jewelryId} not found");

        var cart = await GetAllByUserIdAsync(userId, cancellationToken);
        
        if(jewelry.Quantity<=0) throw new KeyNotFoundException($"Jewelry {jewelryId} not found");

        cart.Jewelries.Add(jewelry);
        await context.SaveChangesAsync(cancellationToken);
    
        return jewelry;
    }

    public async Task<JewelryEntity> DeleteAsync(Guid jewelryId, Guid userId, CancellationToken cancellationToken)
    {
        var cart = await GetAllByUserIdAsync(userId, cancellationToken);
    
        var jewelry = cart.Jewelries
                          .FirstOrDefault(j => j.JewelryId == jewelryId)
                      ?? throw new KeyNotFoundException($"Jewelry {jewelryId} not found in cart");
    
        cart.Jewelries.Remove(jewelry);
        await context.SaveChangesAsync(cancellationToken);
    
        return jewelry;
    }
}
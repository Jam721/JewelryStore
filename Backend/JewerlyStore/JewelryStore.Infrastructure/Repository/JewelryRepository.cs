using AutoMapper;
using JewelryStore.Domain.Models;
using JewelryStore.Infrastructure.Entities;
using JewelryStore.Infrastructure.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace JewelryStore.Infrastructure.Repository;

public class JewelryRepository(AppDbContext context, IMapper mapper) : IJewelryRepository
{
    public async Task<List<JewelryEntity>?> GetPaginatedListAsync(int pageNumber, int pageSize, CancellationToken cancellationToken)
    {
        var jewelries = await context.Jewelries
            .AsNoTracking()
            .Skip((pageNumber - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync(cancellationToken);
        
        return jewelries;
    }

    public async Task<JewelryEntity?> GetByIdAsync(Guid id, CancellationToken cancellationToken)
    {
        var jewelry = await context.Jewelries
            .AsNoTracking()
            .FirstOrDefaultAsync(j=>j.JewelryId==id,cancellationToken);

        return jewelry;
    }

    public async Task<JewelryEntity?> AddAsync(Jewelry entity, CancellationToken cancellationToken)
    {
        var jewelry = mapper.Map<JewelryEntity>(entity);
        
        await context.Jewelries.AddAsync(jewelry, cancellationToken);
        await context.SaveChangesAsync(cancellationToken); 
        
        return jewelry;
    }

    public async Task<JewelryEntity?> DeleteAsync(Guid id, CancellationToken cancellationToken)
    {
        var jewelry = await context.Jewelries.FirstOrDefaultAsync(j=>j.JewelryId==id, cancellationToken);
        
        if(jewelry == null) throw new KeyNotFoundException();
        context.Jewelries.Remove(jewelry);
        await context.SaveChangesAsync(cancellationToken);
        
        return jewelry;
    }

    public async Task<JewelryEntity> UpdateJewelry(Guid id, string name, decimal price, CancellationToken cancellationToken)
    {
        var jewelry = await context.Jewelries.FirstOrDefaultAsync(j => j.JewelryId == id, cancellationToken);
        
        if(jewelry == null) throw new KeyNotFoundException();
        
        jewelry.Name = name;
        jewelry.Prise = price;
        jewelry.UpdatedAt = DateTime.UtcNow;
        await context.SaveChangesAsync(cancellationToken);
        
        return jewelry;
    }
}
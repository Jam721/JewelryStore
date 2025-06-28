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
            .OrderBy(x => x.Watches)
            .Skip((pageNumber - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync(cancellationToken);
        
        return jewelries;
    }
    
    public async Task<List<JewelryEntity>?> GetPaginatedListAsync(
        int pageNumber,
        int pageSize,
        decimal? minPrice = null,
        decimal? maxPrice = null,
        DateTime? startDate = null,
        DateTime? endDate = null,
        int? minWatches = null,
        int? maxWatches = null,
        Category? category = null,
        string sortBy = "watches-desc", // Добавлен параметр сортировки
        CancellationToken cancellationToken = default)
    {
        var query = context.Jewelries.AsNoTracking();

        // Фильтрация (остаётся без изменений)
        if (minPrice.HasValue)
            query = query.Where(j => j.Prise >= minPrice.Value);
    
        if (maxPrice.HasValue)
            query = query.Where(j => j.Prise <= maxPrice.Value);

        if (startDate.HasValue)
            query = query.Where(j => j.CreatedAt >= startDate.Value);
    
        if (endDate.HasValue)
            query = query.Where(j => j.CreatedAt <= endDate.Value);

        if (minWatches.HasValue)
            query = query.Where(j => j.Watches >= minWatches.Value);
    
        if (maxWatches.HasValue)
            query = query.Where(j => j.Watches <= maxWatches.Value);

        if (category.HasValue)
            query = query.Where(j => j.Category == category.Value);

        // Сортировка
        query = sortBy switch
        {
            "watches-desc" => query.OrderByDescending(j => j.Watches),
            "watches-asc" => query.OrderBy(j => j.Watches),
            "prise-desc" => query.OrderByDescending(j => j.Prise),
            "prise-asc" => query.OrderBy(j => j.Prise),
            "createdAt-desc" => query.OrderByDescending(j => j.CreatedAt),
            "createdAt-asc" => query.OrderBy(j => j.CreatedAt),
            _ => query.OrderByDescending(j => j.Watches) // Значение по умолчанию
        };

        return await query
            .Skip((pageNumber - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync(cancellationToken);
    }

    public async Task<JewelryEntity?> GetByIdAsync(Guid id, CancellationToken cancellationToken)
    {
        var jewelry = await context.Jewelries
            .FirstOrDefaultAsync(j => j.JewelryId == id, cancellationToken);
    
        if (jewelry == null) 
            return null;
    
        jewelry.Watches++;
        await context.SaveChangesAsync(cancellationToken);
    
        context.Entry(jewelry).State = EntityState.Detached;
    
        return jewelry;
    }

    public async Task<JewelryEntity?> AddAsync(Jewelry entity, CancellationToken cancellationToken)
    {
        var jewelry = mapper.Map<JewelryEntity>(entity);
        
        if(jewelry.Quantity==0) 
            jewelry.InStock = false;
        else 
            jewelry.InStock = true;
        
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
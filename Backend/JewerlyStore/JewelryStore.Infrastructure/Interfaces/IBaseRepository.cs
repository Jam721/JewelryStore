namespace JewelryStore.Infrastructure.Interfaces;

public interface IBaseRepository<in TBase, TEntity> where TEntity : class where TBase : class
{
    public Task<List<TEntity>?> GetPaginatedListAsync(
        int pageNumber, 
        int pageSize, 
        CancellationToken cancellationToken);
    
    public Task<TEntity?> GetByIdAsync(Guid id, CancellationToken cancellationToken);
    
    public Task<TEntity?> AddAsync(TBase entity, CancellationToken cancellationToken);
    
    public Task<TEntity?> DeleteAsync(Guid id, CancellationToken cancellationToken);
}
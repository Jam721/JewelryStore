using JewelryStore.Infrastructure.Entities;
using Microsoft.EntityFrameworkCore;

namespace JewelryStore.Infrastructure;

public class AppDbContext(DbContextOptions<AppDbContext> options) : DbContext(options)
{
    public DbSet<UserEntity> Users { get; set; } = null!;
    public DbSet<JewelryEntity> Jewelries { get; set; } = null!;
}
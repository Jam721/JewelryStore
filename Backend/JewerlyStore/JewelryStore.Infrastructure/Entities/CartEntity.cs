using System.ComponentModel.DataAnnotations;

namespace JewelryStore.Infrastructure.Entities;

public class CartEntity
{
    [Key]
    public Guid Id { get; set; }
    public List<JewelryEntity> Jewelries { get; set; } = [];
}
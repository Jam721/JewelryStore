using System.ComponentModel.DataAnnotations;

namespace JewelryStore.Infrastructure.Entities;

public class UserEntity
{
    [Key]
    public Guid UserId { get; set; }

    public string FirstName { get; set; } = string.Empty;
    
    public string LastName { get; set; } = string.Empty;
    
    public string Email { get; set; } = string.Empty;
    
    public string PasswordHash { get; set; } = string.Empty;

    public DateTime DateRegistry { get; set; }
}
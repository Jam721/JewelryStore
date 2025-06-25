namespace JewelryStore.Domain.Models;

public class User
{
    public Guid UserId { get; set; }

    public string FirstName { get; set; } = string.Empty;
    
    public string LastName { get; set; } = string.Empty;
    
    public string Email { get; set; } = string.Empty;
    
    public string PasswordHash { get; set; } = string.Empty;

    public DateTime DateRegistry { get; set; }


    public User CreateUser(string firstName, string lastName, string email, string passwordHash)
    {
        UserId = Guid.NewGuid();
        FirstName = firstName;
        LastName = lastName;
        Email = email;
        PasswordHash = passwordHash;
        DateRegistry = DateTime.UtcNow;
        return this;
    }
}
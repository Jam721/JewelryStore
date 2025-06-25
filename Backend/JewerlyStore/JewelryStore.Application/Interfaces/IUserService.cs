namespace JewelryStore.Application.Interfaces;

public interface IUserService
{
    public Task Register(
        string firstName, string lastName, 
        string email, string password, 
        CancellationToken cancellationToken);
    
    public Task<string> Login(string email, string password, CancellationToken cancellationToken);
}
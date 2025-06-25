using AutoMapper;
using JewelryStore.Application.Interfaces;
using JewelryStore.Domain.Models;
using JewelryStore.Infrastructure.Interfaces;

namespace JewelryStore.Application.Services;

public class UserService : IUserService
{
    private readonly IUserRepository _repository;
    private readonly IJwtProvider _jwtProvider;
    private readonly IPasswordHasher _passwordHasher;
    private readonly IMapper _mapper;

    public UserService(
        IUserRepository repository, 
        IJwtProvider jwtProvider, 
        IPasswordHasher passwordHasher,
        IMapper mapper)
    {
        _repository = repository;
        _jwtProvider = jwtProvider;
        _passwordHasher = passwordHasher;
        _mapper = mapper;
    }

    public async Task Register(string firstName, string lastName, string email, string password, 
        CancellationToken cancellationToken)
    {
        var passwordHashed = _passwordHasher.Generate(password);
        
        if(passwordHashed == null) throw new ApplicationException("Invalid password");
        
        var user = new User().CreateUser(firstName, lastName, email, passwordHashed);
        
        await _repository.AddAsync(user, cancellationToken);
    }

    public async Task<string> Login(string email, string password, CancellationToken cancellationToken)
    {
        var userEntity = await _repository.GetByEmailAsync(email, cancellationToken);

        if (userEntity == null) throw new Exception("Пользователь не найден");

        var result = _passwordHasher.Verify(password, userEntity.PasswordHash);

        if (result == false) throw new Exception("Failed to Login");
        
        var user = _mapper.Map<User>(userEntity);

        var token = _jwtProvider.GenerateToken(user);

        return token;
    }
}
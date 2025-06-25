using JewelryStore.Domain.Models;

namespace JewelryStore.Application.Interfaces;

public interface IJwtProvider
{
    public string GenerateToken(User user);
}
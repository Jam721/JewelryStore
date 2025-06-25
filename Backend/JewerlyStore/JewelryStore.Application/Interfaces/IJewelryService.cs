using JewelryStore.Domain.Models;
using Microsoft.AspNetCore.Http;

namespace JewelryStore.Application.Interfaces;

public interface IJewelryService
{
    Task<Jewelry> AddJewelryAsync(Jewelry jewelry, IFormFile? jewelryFile, CancellationToken cancellationToken);
}
using AutoMapper;
using JewelryStore.Application.Interfaces;
using JewelryStore.Domain.Models;
using JewelryStore.Infrastructure.Interfaces;
using Microsoft.AspNetCore.Http;

namespace JewelryStore.Application.Services;

public class JewelryService : IJewelryService
{
    private readonly IJewelryRepository _jewelryRepository;
    private readonly IFileStorageService _fileStorageService;
    private readonly IMapper _mapper;

    public JewelryService(IJewelryRepository jewelryRepository,
        IFileStorageService fileStorageService, IMapper mapper)
    {
        _jewelryRepository = jewelryRepository;
        _fileStorageService = fileStorageService;
        _mapper = mapper;
    }

    public async Task<Jewelry> AddJewelryAsync(Jewelry jewelry, IFormFile? jewelryFile, CancellationToken cancellationToken)
    {
        var jewelryObjectName = "default-avatar.png";

        if (jewelryFile is { Length: > 0 })
        {
            await using var stream = jewelryFile.OpenReadStream();
            var uploadedName = await _fileStorageService.UploadAvatarAsync(
                stream,
                jewelryFile.FileName,
                jewelryFile.ContentType);
            
            if (!string.IsNullOrEmpty(uploadedName))
                jewelryObjectName = uploadedName;
        }

        jewelry.MainImageUrl = jewelryObjectName;
        
        var jewelryEntity = await _jewelryRepository.AddAsync(jewelry, cancellationToken);
        
        return _mapper.Map<Jewelry>(jewelryEntity);
    }
}
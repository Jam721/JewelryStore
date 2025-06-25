using JewelryStore.Application.Interfaces;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Minio;
using Minio.DataModel.Args;

namespace JewelryStore.Application.Services;

public class FileStorageService : IFileStorageService
{
    private readonly IMinioClient _minioClient;
    private readonly ILogger<FileStorageService> _logger;
    private readonly string? _bucketName;

    public FileStorageService(IMinioClient minioClient, IConfiguration configuration, ILogger<FileStorageService> logger)
    {
        _minioClient = minioClient;
        _logger = logger;
        _bucketName = configuration["Minio:BucketName"];
        
        InitializeBucketAsync().Wait();
    }
    
    private async Task InitializeBucketAsync()
    {
        try
        {
            var existsArgs = new BucketExistsArgs().WithBucket(_bucketName);
            bool exists = await _minioClient.BucketExistsAsync(existsArgs);
        
            if (!exists)
            {
                var makeArgs = new MakeBucketArgs().WithBucket(_bucketName);
                await _minioClient.MakeBucketAsync(makeArgs);
                _logger.LogInformation("Bucket {BucketName} created", _bucketName);
            }
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Bucket initialization error");
            throw;
        }
    }
    
    public async Task<string?> UploadAvatarAsync(Stream fileStream, string fileName, string contentType)
    {
        try 
        {
            var objectName = $"jewelry/{Guid.NewGuid()}{Path.GetExtension(fileName)}";
            var args = new PutObjectArgs()
                .WithBucket(_bucketName)
                .WithObject(objectName)
                .WithStreamData(fileStream)
                .WithObjectSize(fileStream.Length)
                .WithContentType(contentType);

            await _minioClient.PutObjectAsync(args);
            _logger.LogInformation($"Файл {fileName} загружен как {objectName}");
            return objectName;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Ошибка загрузки файла в MinIO");
            return null;
        }
    }

    public async Task<string> GetAvatarUrlAsync(string objectName)
    {
        var args = new PresignedGetObjectArgs()
            .WithBucket(_bucketName)
            .WithObject(objectName)
            .WithExpiry(3600 * 24);

        return await _minioClient.PresignedGetObjectAsync(args);
    }
    
    public async Task<bool> DeleteAvatarAsync(string objectName)
    {
        if (string.IsNullOrWhiteSpace(objectName) )
        {
            _logger.LogWarning("Попытка удаления фотки с пустым именем объекта");
            return false;
        }

        try
        {
            var args = new RemoveObjectArgs()
                .WithBucket(_bucketName)
                .WithObject(objectName);

            await _minioClient.RemoveObjectAsync(args);
            _logger.LogInformation("Фотка {ObjectName} успешно удалёна", objectName);
            return true;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Ошибка удаления фотки {ObjectName}", objectName);
            return false;
        }
    }
}
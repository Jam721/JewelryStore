namespace JewelryStore.Application.Interfaces;

public interface IFileStorageService
{
    Task<string?> UploadAvatarAsync(Stream fileStream, string fileName, string contentType);
    Task<string> GetAvatarUrlAsync(string objectName);
    Task<bool> DeleteAvatarAsync(string objectName);
}
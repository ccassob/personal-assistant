using Azure.Storage.Blobs;
using Azure.Storage.Blobs.Models;

namespace personal_assistant_api.Services;

public class BlobStorageService(IConfiguration configuration)
{
    private readonly string _connectionString = configuration["AzureStorage:ConnectionString"] ?? "";
    private readonly string _containerName = configuration["AzureStorage:ContainerName"] ?? "credit-card-statements";

    public async Task<string> UploadAsync(Stream stream, string blobName, string contentType,
        Dictionary<string, string>? metadata = null, string? containerName = null)
    {
        var container = new BlobContainerClient(_connectionString, containerName ?? _containerName);
        await container.CreateIfNotExistsAsync();
        var blob = container.GetBlobClient(blobName);
        await blob.UploadAsync(stream, new BlobUploadOptions
        {
            HttpHeaders = new BlobHttpHeaders { ContentType = contentType },
            Metadata = metadata
        });
        return blobName;
    }

    public async Task<byte[]> DownloadBytesAsync(string blobName, string? containerName = null)
    {
        var container = new BlobContainerClient(_connectionString, containerName ?? _containerName);
        var blob = container.GetBlobClient(blobName);
        var response = await blob.DownloadContentAsync();
        return response.Value.Content.ToArray();
    }

    public async Task DeleteAsync(string blobName, string? containerName = null)
    {
        var container = new BlobContainerClient(_connectionString, containerName ?? _containerName);
        var blob = container.GetBlobClient(blobName);
        await blob.DeleteIfExistsAsync();
    }
}

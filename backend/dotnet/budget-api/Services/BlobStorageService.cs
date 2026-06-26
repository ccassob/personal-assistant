using Azure.Storage.Blobs;
using Azure.Storage.Blobs.Models;

namespace budget_api.Services;

public class BlobStorageService(IConfiguration configuration)
{
    private readonly string _connectionString = configuration["AzureStorage:ConnectionString"] ?? "";
    private readonly string _containerName = configuration["AzureStorage:ContainerName"] ?? "credit-card-statements";

    public async Task<string> UploadAsync(Stream stream, string blobName, string contentType,
        Dictionary<string, string>? metadata = null)
    {
        var container = new BlobContainerClient(_connectionString, _containerName);
        await container.CreateIfNotExistsAsync();
        var blob = container.GetBlobClient(blobName);
        await blob.UploadAsync(stream, new BlobUploadOptions
        {
            HttpHeaders = new BlobHttpHeaders { ContentType = contentType },
            Metadata = metadata
        });
        return blobName;
    }
}

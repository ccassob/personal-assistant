using Azure.Storage.Blobs;
using Azure.Storage.Blobs.Models;
using Azure.Storage.Sas;

namespace budget_api.Services;

public class BlobStorageService(IConfiguration configuration)
{
    private readonly string _connectionString = configuration["AzureStorage:ConnectionString"] ?? "";
    private readonly string _containerName = configuration["AzureStorage:ContainerName"] ?? "credit-card-statements";

    public async Task<string> UploadAsync(Stream stream, string blobName, string contentType)
    {
        var container = new BlobContainerClient(_connectionString, _containerName);
        await container.CreateIfNotExistsAsync();
        var blob = container.GetBlobClient(blobName);
        await blob.UploadAsync(stream, new BlobUploadOptions { HttpHeaders = new BlobHttpHeaders { ContentType = contentType } });
        return blobName;
    }

    public string GenerateSasUrl(string blobName, TimeSpan ttl)
    {
        var serviceClient = new BlobServiceClient(_connectionString);
        var blob = serviceClient.GetBlobContainerClient(_containerName).GetBlobClient(blobName);

        var sasBuilder = new BlobSasBuilder
        {
            BlobContainerName = _containerName,
            BlobName = blobName,
            Resource = "b",
            ExpiresOn = DateTimeOffset.UtcNow.Add(ttl)
        };
        sasBuilder.SetPermissions(BlobSasPermissions.Read);

        return blob.GenerateSasUri(sasBuilder).ToString();
    }
}

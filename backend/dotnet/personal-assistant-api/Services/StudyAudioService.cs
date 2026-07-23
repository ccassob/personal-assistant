using personal_assistant_api.Models;

namespace personal_assistant_api.Services;

/// <summary>
/// Synthesizes user-provided SSML into a tagged MP3 stored in Blob Storage, and wraps blob
/// download/delete for the audio container. The SSML itself is authored/saved by the user —
/// there is no automatic SSML generation here.
/// </summary>
public class StudyAudioService(
    TextToSpeechService tts,
    Mp3TaggingService tagger,
    BlobStorageService blobStorage,
    IConfiguration configuration)
{
    private const string Artist = "Christopher Academy";
    private const string Genre = "Education";

    private readonly string _container = configuration["AzureStorage:AudioContainerName"] ?? "study-audio";

    public async Task<string> SynthesizeAsync(
        Technology technology,
        TechnologyTheorySection section,
        int sessionNumber,
        string ssml,
        CancellationToken ct = default)
    {
        var audio = await tts.SynthesizeAsync(ssml, ct);

        var album = technology.Name;
        var title = $"{album} {section.Title} {sessionNumber}".Trim();
        var tagged = tagger.Tag(audio, new Mp3Tags(
            Title: title,
            Artist: Artist,
            Album: album,
            Genre: Genre,
            Year: DateTime.Today.Year,
            TrackNumber: sessionNumber));

        var blobName = $"{technology.UserId}/{technology.Id}/session-{sessionNumber}.mp3";
        using var stream = new MemoryStream(tagged);
        await blobStorage.UploadAsync(stream, blobName, "audio/mpeg", containerName: _container);
        return blobName;
    }

    public Task<byte[]> GetAudioBytesAsync(string blobName) =>
        blobStorage.DownloadBytesAsync(blobName, _container);

    public Task DeleteAudioAsync(string blobName) =>
        blobStorage.DeleteAsync(blobName, _container);
}

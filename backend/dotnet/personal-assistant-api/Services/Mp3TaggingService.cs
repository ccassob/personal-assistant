namespace personal_assistant_api.Services;

public record Mp3Tags(string Title, string Artist, string Album, string Genre, int Year, int TrackNumber);

/// <summary>
/// Writes ID3v2 tags onto raw MP3 bytes (as returned by Azure TTS) using TagLibSharp,
/// operating fully in memory via a stream abstraction (no temp files).
/// </summary>
public class Mp3TaggingService
{
    public byte[] Tag(byte[] mp3, Mp3Tags tags)
    {
        var ms = new MemoryStream();
        ms.Write(mp3, 0, mp3.Length);
        ms.Position = 0;

        var abstraction = new StreamFileAbstraction("audio.mp3", ms);
        using (var file = TagLib.File.Create(abstraction, "audio/mpeg", TagLib.ReadStyle.Average))
        {
            var tag = file.Tag;
            tag.Title = tags.Title;
            tag.Performers = [tags.Artist];
            tag.Album = tags.Album;
            tag.Genres = [tags.Genre];
            tag.Year = (uint)tags.Year;
            tag.Track = (uint)tags.TrackNumber;
            file.Save();
        }

        return ms.ToArray();
    }

    private sealed class StreamFileAbstraction(string name, Stream stream) : TagLib.File.IFileAbstraction
    {
        public string Name { get; } = name;
        public Stream ReadStream { get; } = stream;
        public Stream WriteStream { get; } = stream;
        // The caller owns the MemoryStream lifetime (we read its bytes after Save()).
        public void CloseStream(Stream stream) { }
    }
}

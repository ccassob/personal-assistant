using System.Text;
using Microsoft.Extensions.Options;
using personal_assistant_api.Options;

namespace personal_assistant_api.Services;

/// <summary>
/// Synthesizes SSML into MP3 bytes via the Azure Speech REST v1 endpoint
/// (https://{region}.tts.speech.microsoft.com/cognitiveservices/v1).
/// </summary>
public class TextToSpeechService(IHttpClientFactory httpClientFactory, IOptions<AzureSpeechOptions> options)
{
    private readonly AzureSpeechOptions _opts = options.Value;

    public async Task<byte[]> SynthesizeAsync(string ssml, CancellationToken ct = default)
    {
        var http = httpClientFactory.CreateClient();
        var endpoint = $"https://{_opts.Region}.tts.speech.microsoft.com/cognitiveservices/v1";

        using var request = new HttpRequestMessage(HttpMethod.Post, endpoint)
        {
            Content = new StringContent(ssml, Encoding.UTF8, "application/ssml+xml")
        };
        request.Headers.Add("Ocp-Apim-Subscription-Key", _opts.ApiKey);
        request.Headers.Add("X-Microsoft-OutputFormat", _opts.OutputFormat);
        request.Headers.Add("User-Agent", "personal-assistant");

        using var response = await http.SendAsync(request, ct);
        if (!response.IsSuccessStatusCode)
        {
            var body = await response.Content.ReadAsStringAsync(ct);
            throw new InvalidOperationException(
                $"Azure Speech TTS failed ({(int)response.StatusCode} {response.ReasonPhrase}): {body}");
        }
        return await response.Content.ReadAsByteArrayAsync(ct);
    }
}

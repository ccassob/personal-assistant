namespace personal_assistant_api.Options;

public class AzureSpeechOptions
{
    public string Region { get; set; } = "";
    public string ApiKey { get; set; } = "";
    public string OutputFormat { get; set; } = "audio-24khz-160kbitrate-mono-mp3";
}

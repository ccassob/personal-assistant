namespace PersonalAssistant.Api.Services;

public enum ResultError
{
    None,
    NotFound,
    BadRequest,
}

public class Result
{
    public bool Succeeded { get; }
    public ResultError Error { get; }
    public string? ErrorMessage { get; }

    protected Result(bool succeeded, ResultError error, string? errorMessage)
    {
        Succeeded = succeeded;
        Error = error;
        ErrorMessage = errorMessage;
    }

    public static Result Ok() => new(true, ResultError.None, null);
    public static Result NotFound() => new(false, ResultError.NotFound, null);
    public static Result BadRequest(string? message = null) => new(false, ResultError.BadRequest, message);
}

public class Result<T> : Result
{
    public T? Value { get; }

    private Result(bool succeeded, ResultError error, string? errorMessage, T? value)
        : base(succeeded, error, errorMessage)
    {
        Value = value;
    }

    public static Result<T> Ok(T value) => new(true, ResultError.None, null, value);
    public static new Result<T> NotFound() => new(false, ResultError.NotFound, null, default);
    public static new Result<T> BadRequest(string? message = null) => new(false, ResultError.BadRequest, message, default);
}

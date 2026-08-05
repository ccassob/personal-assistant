FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src
COPY personal-assistant-api.csproj .
RUN dotnet restore personal-assistant-api.csproj
COPY . .
RUN dotnet publish personal-assistant-api.csproj -c Release -o /app/publish --no-restore

FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS runtime
RUN apt-get update && apt-get install -y --no-install-recommends curl \
    && rm -rf /var/lib/apt/lists/*
WORKDIR /app
ENV ASPNETCORE_URLS=http://+:8080
COPY --from=build /app/publish .
ENTRYPOINT ["dotnet", "personal-assistant-api.dll"]

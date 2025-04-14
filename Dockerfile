# --- Step 1: Build React frontend ---
FROM node:18 AS frontend-build
WORKDIR /app
COPY onlinebookstorefrontend/ .
RUN npm install && npm run build

# --- Step 2: Build .NET backend ---
FROM mcr.microsoft.com/dotnet/sdk:7.0 AS backend-build
WORKDIR /src
COPY OnlineBookStoreAppBackEnd/ .
RUN dotnet restore
RUN dotnet publish -c Release -o /app/publish

# --- Step 3: Final image with runtime only ---
FROM mcr.microsoft.com/dotnet/aspnet:7.0
WORKDIR /app

# Copy backend build
COPY --from=backend-build /app/publish .

# Copy frontend build to wwwroot (static files served by .NET)
COPY --from=frontend-build /app/build ./wwwroot

EXPOSE 80
ENTRYPOINT ["dotnet", "OnlineBookStoreAppBackEnd.dll"]

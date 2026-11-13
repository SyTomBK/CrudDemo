# ---------- Giai đoạn 1: build ----------
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

COPY global.json nuget.config ./
COPY .config/ .config/
COPY src/CrudDemo.Api/CrudDemo.Api.csproj src/CrudDemo.Api/
RUN dotnet restore src/CrudDemo.Api/CrudDemo.Api.csproj

COPY src/ src/
ARG GIT_SHA=unknown
RUN dotnet publish src/CrudDemo.Api/CrudDemo.Api.csproj \
    -c Release -o /app/publish --no-restore \
    -p:UseAppHost=false -p:SourceRevisionId=${GIT_SHA}


# ---------- Giai đoạn 2: runtime ----------
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS runtime
LABEL org.opencontainers.image.source=https://github.com/SyTomBK/CrudDemo
WORKDIR /app
COPY --from=build /app/publish .

USER $APP_UID
EXPOSE 8080
ENTRYPOINT ["dotnet", "CrudDemo.Api.dll"]

# ---------- Giai đoạn 3: sinh script migration ----------
FROM build AS migrations-script
RUN dotnet tool restore \
 && dotnet ef migrations script --idempotent \
    --project src/CrudDemo.Api -o /out/migrate.sql


# ---------- Giai đoạn 4: image chạy migration ----------
FROM postgres:17-alpine AS migrator
LABEL org.opencontainers.image.source=https://github.com/SyTomBK/CrudDemo
COPY --from=migrations-script /out/migrate.sql /migrations/migrate.sql
USER postgres
ENTRYPOINT ["psql", "-v", "ON_ERROR_STOP=1", "-f", "/migrations/migrate.sql"]
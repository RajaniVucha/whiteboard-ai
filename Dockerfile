# Use the official PostgreSQL image from Docker Hub
FROM postgres:latest

# Set environment variables for database configuration
ENV POSTGRES_DB=whiteboard
ENV POSTGRES_USER=whiteboarduser
ENV POSTGRES_PASSWORD=password

# Expose the PostgreSQL port
EXPOSE 5432


# Use the official Keycloak image as base
FROM jboss/keycloak:latest as keycloak

# Expose Keycloak ports
EXPOSE 8080 8443

# Set environment variables for Keycloak
ENV KEYCLOAK_USER=admin \
    KEYCLOAK_PASSWORD=admin \
    DB_VENDOR=POSTGRES \
    DB_ADDR=postgres \
    DB_DATABASE=whiteboard \
    DB_USER=whiteboarduser \
    DB_PASSWORD=password

# Copy the PostgreSQL initialization script to the Keycloak container
COPY --from=postgres /docker-entrypoint-initdb.d /docker-entrypoint-initdb.d

# Set up a health check for Keycloak
HEALTHCHECK --interval=1m --timeout=5s \
  CMD wget -q --spider http://localhost:8080/auth || exit 1
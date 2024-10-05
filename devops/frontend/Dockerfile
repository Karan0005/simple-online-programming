# Use an image with the specified Node.js and npm versions
FROM node:20.17.0 AS build

# Copy complete code base to docker
COPY . /app

# Set the working directory
WORKDIR /app

# Set default build-time argument for APP_ENV (not used directly)
ARG APP_ENV='LOCAL'

# Set runtime environment variable for APP_ENV
ENV APP_ENV=${APP_ENV}

# Install all dependencies and build project
RUN npm install && npm run frontend:build

# Serve the app using nginx
FROM nginx:alpine

# Copy the build artifacts from the build stage
COPY --from=build /app/dist/apps/frontend /usr/share/nginx/html

# Set default build-time argument for PORT_FRONTEND (not used directly)
ARG PORT_FRONTEND=80

# Set runtime environment variable for PORT_FRONTEND
ENV PORT_FRONTEND=${PORT_FRONTEND}

# Print the value of PORT during build
RUN echo "The PORT_FRONTEND environment variable is set to ${PORT_FRONTEND}"

# Directly replace the default Nginx configuration with your local configuration
COPY --from=build /app/devops/frontend/nginx.conf /etc/nginx/conf.d/default.conf.template

# Expose the port for Docker (not used by Nginx but good practice)
EXPOSE ${PORT_FRONTEND}

# Use envsubst to replace ${PORT_FRONTEND} in the Nginx configuration at runtime
CMD ["sh", "-c", "envsubst '${PORT_FRONTEND}' < /etc/nginx/conf.d/default.conf.template > /etc/nginx/conf.d/default.conf && nginx -g 'daemon off;'"]

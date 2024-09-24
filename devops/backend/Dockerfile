# Use an image with the specified Node.js and npm versions
FROM node:20.17.0 AS build

# Copy complete code base to docker
COPY . /app

# Set the working directory
WORKDIR /app

# Install all dependencies and build project
RUN npm install
RUN npm run backend:build

# Set default build-time argument for PORT (not used directly)
ARG PORT_BACKEND=8000

# Set runtime environment variable for PORT
ENV PORT_BACKEND=${PORT_BACKEND}

# Print the value of PORT during build
RUN echo "The PORT_BACKEND environment variable is set to ${PORT_BACKEND}"

# Expose the port for REST API
EXPOSE ${PORT_BACKEND}

# Start the REST API server
CMD ["node", "/app/dist/apps/backend/main"]

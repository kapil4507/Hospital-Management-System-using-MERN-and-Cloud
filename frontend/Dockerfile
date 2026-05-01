# Stage 1: Build the Vite React App
FROM node:18-alpine AS build

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json first (for caching layers)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the frontend source code
COPY . .

# Build the application for production (outputs to /app/dist)
RUN npm run build

# Stage 2: Serve the app using NGINX
FROM nginx:alpine

# Copy the built static files from the build stage to NGINX's public directory
COPY --from=build /app/dist /usr/share/nginx/html

# Expose port 80 to the outside world
EXPOSE 80

# Start NGINX
CMD ["nginx", "-g", "daemon off;"]

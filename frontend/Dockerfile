# Stage 1: Build the Vite React App
FROM node:18-alpine AS build
WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

# Stage 2: Serve the app using NGINX
FROM nginx:alpine

# Copy the built static files from the build stage to NGINX's public directory
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]

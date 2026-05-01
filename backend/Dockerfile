FROM node:18-alpine

# working directory
WORKDIR /usr/src/app

# package files and install dependencies
COPY package*.json ./
RUN npm install

# rest of the backend source code
COPY . .

# port 5001 for the REST API
EXPOSE 5001

# Start Node.js
CMD ["node", "server.js"]
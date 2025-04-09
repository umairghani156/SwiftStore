# Build the React app with Vite
FROM node:18 AS build

WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy the entire client folder
COPY . .

# Run the build command (production build)
RUN npm run build

# Use Nginx to serve the built React app
FROM nginx:alpine

# Copy custom nginx.conf for React routing (single page app)
COPY ./nginx.conf /etc/nginx/nginx.conf

# Copy the build output from the previous build stage to Nginx's html folder
COPY --from=build /app/dist /usr/share/nginx/html

# Expose port 80 for the Nginx server
EXPOSE 80

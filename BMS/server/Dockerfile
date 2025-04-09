# Use Node.js as the base image
FROM node:18

# Set the working directory inside the container
WORKDIR /app

# Copy the package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the server application files
COPY . .

# Expose the backend API port (5000)
EXPOSE 5000

# Run the backend app
CMD ["npm", "start"]

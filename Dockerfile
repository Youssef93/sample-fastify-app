# Use a Node.js 20 image based on Alpine Linux
FROM node:20-alpine

# Set the working directory for the build stage
WORKDIR /app

# Copy the application code
COPY . .

# Install dependencies
RUN npm install

# Build the application
RUN npm run build

# Install only production dependencies
RUN npm install --omit=dev

# Command to run the application
CMD ["npm", "run", "serve"]

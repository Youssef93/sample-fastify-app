FROM node:22-alpine AS base

FROM base AS build

# Set the working directory for the build stage
WORKDIR /app

# Copy the application code
COPY . .

# Install dependencies
RUN npm install

# Build the application
RUN npm run build

FROM base AS app

# Set the working directory for the app stage
WORKDIR /app

# Copy the build artifacts from the build stage
COPY --from=build /app/dist /app/dist

COPY package.json package-lock.json /app/

# Install only production dependencies
RUN npm install --omit=dev

# Command to run the application
CMD ["npm", "run", "serve"]

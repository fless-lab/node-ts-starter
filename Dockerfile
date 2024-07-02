# Use an official Node.js base image
FROM node:18-alpine3.20 AS base

# Install dumb-init and libc6-compat
RUN apk add --no-cache libc6-compat dumb-init

# Set the working directory in the container
WORKDIR /usr/src/app

FROM base AS build

# Copy the package.json and package-lock.json
COPY package*.json ./

# Install project dependencies
RUN npm install

# Copy the src folder and tsconfig.json needed to build the application
COPY tsconfig.json ./
COPY src ./src

# Build the TypeScript project
RUN npm run build

FROM base AS prune

# Copy the package.json and package-lock.json again
COPY package*.json ./

# define the production environment
ENV NODE_ENV=production

# Install only production dependencies
RUN npm install --omit=dev

FROM base AS release

# Copy the node_modules without dev dependencies
COPY --from=prune /usr/src/app/node_modules ./node_modules

# Copy the build directory
COPY --from=build /usr/src/app/build ./dist

# Create a new user for security purposes
RUN addgroup -S myuser && adduser -S myuser -G myuser
USER myuser

ENV PORT=9095

# Expose the application port
EXPOSE $PORT

# Use dumb-init as the entrypoint
ENTRYPOINT ["/usr/bin/dumb-init", "--"]

# Define the command to run based on the environment
CMD ["node", "dist/server.js"]

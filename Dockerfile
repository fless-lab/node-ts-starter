# Use an official Node.js base image
FROM node:18

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy the package.json and package-lock.json
COPY package*.json ./

# Install application dependencies
RUN npm install

# Copy the rest of the application
COPY . .

# Build the TypeScript project
RUN npm run build

# Expose the application port
EXPOSE $PORT

# Define the command to run based on the environment
CMD ["sh", "-c", "if [ \"$NODE_ENV\" = \"production\" ]; then npm run start:prod; else npm start; fi"]

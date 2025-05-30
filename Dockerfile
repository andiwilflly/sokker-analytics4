# Use Bun's official image
FROM oven/bun:latest

# Set working directory
WORKDIR /app

# Copy all files (including monorepo structure)
COPY . .

# Install pnpm (Bun doesn’t come with it)
RUN bun add -g pnpm

# Install all dependencies using pnpm
RUN pnpm install

# Build only the server
RUN pnpm run server:build

# Set default command to run the server
CMD ["pnpm", "--filter", "@server", "start"]

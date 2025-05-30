# Use Bun's official image (Debian based)
FROM oven/bun:latest

# Install build tools required to build native modules
RUN apt-get update && apt-get install -y \
    build-essential \
    python3 \
    pkg-config \
    libsqlite3-dev \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY . .

# Install pnpm globally
RUN bun add -g pnpm

# Install dependencies
RUN pnpm install

# Rebuild native bindings for better-sqlite3 explicitly
RUN pnpm rebuild better-sqlite3 --update-binary

# Build server only
RUN pnpm run server:build

CMD ["pnpm", "--filter", "@server", "start"]

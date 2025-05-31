FROM node:18

# Set working directory
WORKDIR /app

# Install pnpm globally
RUN npm install -g pnpm

# Pre-copy only files required for dependency resolution
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

# Install all dependencies (including workspaces)
RUN pnpm install

# Now copy the rest of the monorepo (apps/, packages/, etc.)
COPY . .

# Build all workspaces in dependency order
RUN pnpm --filter @shared... --filter @client... --filter @server... run build

# Start only the server
CMD ["pnpm", "--filter", "@server", "start"]
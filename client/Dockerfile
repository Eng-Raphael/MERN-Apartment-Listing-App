# ---- Build Stage ----
FROM node:18 AS builder
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy all project files
COPY . .

# Build Next.js (generates .next)
RUN npm run build

# ---- Production Stage ----
FROM node:18
WORKDIR /app

# Copy build output from builder
COPY --from=builder /app/.next ./.next


# Copy package files
COPY package*.json ./

# Install ONLY production dependencies
RUN npm install --only=production

EXPOSE 3000

# Run the production server
CMD ["npm", "start"]

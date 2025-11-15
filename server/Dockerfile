# ---- Build Stage ----
FROM node:18 AS builder
WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build  # builds ./dist

# ---- Production Stage ----
FROM node:18
WORKDIR /app

COPY package*.json ./
RUN npm install --only=production

COPY --from=builder /app/dist ./dist

EXPOSE 5001
CMD ["node", "dist/index.js"]

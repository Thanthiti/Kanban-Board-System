FROM node:20-alpine AS builder
WORKDIR /app

RUN apk add --no-cache bash curl openssl-dev libc6-compat python3 make g++

COPY package*.json ./
RUN npm ci

COPY . .

# Prisma generate (no CLI binary-targets)
RUN npx prisma generate

# Stage 2: Run
FROM node:20-alpine
WORKDIR /app

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app ./

EXPOSE 3000
CMD ["npm", "run", "start"]

# Install dependencies if needed
FROM node:24-alpine AS dev
WORKDIR /app
COPY package.json yarn.lock ./
RUN npx yarn install --frozen-lockfile
COPY . .
RUN npx prisma generate
ENTRYPOINT ["npx", "yarn"]
CMD ["start:dev"]

# Build production dist
FROM node:24-alpine AS builder
WORKDIR /app
ENV NODE_ENV=production
COPY --from=dev /app/node_modules ./node_modules
COPY . . 
RUN npx prisma generate
RUN npx yarn build
RUN rm -rf node_modules
# RUN npx yarn --frozen-lockfile --production
RUN npx yarn install --frozen-lockfile --production

# Run production version only with necessary files
FROM node:24-alpine AS production
WORKDIR /app
ENV NODE_ENV=production
RUN addgroup --system --gid 1001 nestjs \
  && adduser --system --uid 1001 nestjs
COPY --from=builder --chown=nestjs:nestjs /app/dist ./dist
COPY --from=builder --chown=nestjs:nestjs /app/node_modules ./node_modules
COPY --from=builder --chown=nestjs:nestjs /app/package.json ./package.json
COPY --from=builder --chown=nestjs:nestjs /app/prisma ./prisma
USER nestjs
CMD ["node", "dist/main.js"]
# CMD ["sh", "-c", "npx prisma migrate deploy && node dist/main.js"]
# syntax=docker/dockerfile:1
FROM node:20-alpine AS base
WORKDIR /app

FROM base AS deps
COPY package.json package-lock.json* pnpm-lock.yaml* ./
RUN npm i -g pnpm@9 && pnpm install --prod=false || npm ci

FROM deps AS build
COPY tsconfig.json ./
COPY src ./src
RUN npm i -g pnpm@9 && pnpm run build || npx tsc -p tsconfig.json

FROM node:20-alpine AS runtime
ENV NODE_ENV=production
WORKDIR /app
COPY --from=build /app/dist ./dist
COPY package.json ./package.json
RUN npm i -g pnpm@9 && pnpm i --prod || npm ci --omit=dev
EXPOSE 3000
CMD ["node", "dist/index.js"]

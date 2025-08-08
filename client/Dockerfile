# syntax=docker/dockerfile:1
FROM node:20-alpine AS base
WORKDIR /app

FROM base AS deps
COPY package.json package-lock.json* pnpm-lock.yaml* ./
RUN npm i -g pnpm@9 && pnpm install --prod=false || npm ci

FROM deps AS build
COPY . .
ARG VITE_API_URL
ENV VITE_API_URL=${VITE_API_URL}
RUN npm i -g pnpm@9 && pnpm run build || npm run build

FROM node:20-alpine AS runtime
WORKDIR /app
COPY --from=build /app/dist ./dist
COPY package.json ./package.json
RUN npm i -g pnpm@9 && pnpm i --prod || npm ci --omit=dev
EXPOSE 5173
CMD ["npx", "serve", "-s", "dist", "-l", "5173"]

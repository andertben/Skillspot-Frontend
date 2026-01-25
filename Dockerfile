# Build stage
FROM node:20-alpine AS build
WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
# build arguments
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL

RUN npm run build

# Runtime stage
FROM nginx:alpine

# For CRA, replace /app/dist with /app/build
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80
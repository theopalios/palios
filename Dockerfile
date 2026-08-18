# glibc base: the lockfile's platform-specific optional deps (rollup/sharp)
# resolve reliably here; musl/alpine trips npm's optional-dep lockfile bug
FROM node:22-slim AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --no-audit --no-fund
COPY . .
RUN npm run build

FROM nginx:1.29-alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html

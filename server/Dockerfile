FROM node:22.16-slim
ARG NODE_ENV
WORKDIR /app
RUN apt-get update -y && apt-get install -y openssl && npm i -g pnpm
COPY package*.json .
RUN if [ $NODE_ENV = "development" ]; then \ 
      pnpm install; \
    else \
      pnpm install --prod; \
    fi
COPY . .
CMD [ "pnpm", "dev" ]
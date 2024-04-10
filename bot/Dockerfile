# base node image
FROM node:18-bullseye-slim as base

# set for base and all layer that inherit from it
ENV NODE_ENV production

FROM base as production

WORKDIR /myapp

COPY . .

RUN apt-get update && apt-get install -y openssl

RUN npm install --include=dev

RUN npx prisma generate

CMD ["npm", "start"]
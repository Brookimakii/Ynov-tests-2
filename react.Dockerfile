FROM public.ecr.aws/docker/library/node:20
# FROM node:20

WORKDIR /app

ENV PATH=/app/node_module/.bin:$PATH

COPY package.json ./
COPY package-lock.json ./

RUN npm install
RUN npm install react-scripts@5.0.1 -g --silent
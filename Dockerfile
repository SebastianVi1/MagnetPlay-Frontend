FROM node:20-alpine

WORKDIR /app

ARG VITE_API_URL
ARG VITE_STREAMING_URL

COPY package*.json ./

RUN npm install

COPY . .

ENV VITE_API_URL=${VITE_API_URL:-http://backend:8080}
ENV VITE_STREAMING_URL=${VITE_STREAMING_URL:-http://streaming-api:3000}

EXPOSE 5173

CMD ["npm", "run", "dev", "--", "--host"]
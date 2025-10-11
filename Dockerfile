FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Environment variable for Docker
ENV VITE_API_URL=http://backend:8080

# Expose port
EXPOSE 5173

# Start development server with host option
CMD ["npm", "run", "dev", "--", "--host"]